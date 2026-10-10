/**
 * Billing Slice - Redux State Management
 *
 * Purpose:
 * Manages billing and revenue cycle state:
 * - Current invoice being processed
 * - Claim status tracking
 * - Payment plan management
 * - A/R aging calculations
 *
 * Why Redux instead of local state:
 * - Invoice state affects multiple billing pages
 * - Claim status needs to be tracked across modules
 * - Payment plans need to be accessible from patient and billing modules
 * - Complex calculations (A/R aging) benefit from centralized state
 * - Financial data requires predictable state updates (audit compliance)
 *
 * @author Senior Software Engineer
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/api";
import { invoiceService } from "../../services/invoice.service";
import { claimService } from "../../services/claim.service";
import { paymentService } from "../../services/payment.service";
import { reportingService } from "../../services/reporting.service";
import dayjs from "dayjs";
import { buildLedgerProcedureContext } from "../../utils/ledgerCalculations";

const EMPTY_ARRAY = Object.freeze([]);

const moneyNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const roundMoney = (value) => Math.round(moneyNumber(value) * 100) / 100;

// Display name of whoever created an invoice / payment / adjustment / claim.
// The backend resolves this from the entering user (SecUserNumEntry / meta.createdBy)
// into `createdByName`; older rows may not have one, in which case we fall back to
// a generic label rather than inventing a name.
const creatorDisplay = (entity) => entity?.createdByName || "STAFF";

const adjustmentDisplayType = (adjustment = {}) => {
  const note = String(adjustment.notes || "");
  const selectedType = note.match(/^\s*(.*?)\s+applied\s+to\s+/i)?.[1]?.trim();
  if (selectedType) return selectedType;
  return adjustment.type || "Adjustment";
};

const isDbiProcedure = (item = {}) =>
  item.dbi === true ||
  item.dbi === 1 ||
  String(item.dbi).toLowerCase() === "true";

const isPatientPenaltyItem = (item = {}) => {
  if (
    item.isPatientPenalty ||
    item.isAccountPenalty ||
    item.patientOnly ||
    item.accountPenalty ||
    item.noBillIns === 1 ||
    item.noBillIns === true
  ) {
    return true;
  }
  const desc = String(item.description || item.title || "").toLowerCase();
  const code = String(item.cptCode || item.code || "").toUpperCase();
  return Boolean(
    code.startsWith("ACC-") ||
    code.startsWith("PENALTY") ||
    code.startsWith("FEE-") ||
    code.startsWith("LATE-") ||
    code === "D9986" ||
    code === "D9987" ||
    desc.includes("late cancellation") ||
    desc.includes("cancellation") ||
    desc.includes("broken appt") ||
    desc.includes("broken appointment") ||
    desc.includes("missed") ||
    desc.includes("no show") ||
    desc.includes("no-show") ||
    desc.includes("late fee") ||
    desc.includes("late payment") ||
    desc.includes("penalty"),
  );
};

export const createInvoice = createAsyncThunk(
  "billing/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const result = await invoiceService.createStandaloneInvoice(invoiceData);
      return result;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create invoice",
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Ledger thunks
// ---------------------------------------------------------------------------

/**
 * Fetch invoices + adjustments for a patient and merge them into a sorted
 * ledger list. Result is cached by patientId.
 */
export const fetchLedgerItems = createAsyncThunk(
  "billing/fetchLedgerItems",
  async (payload, { rejectWithValue }) => {
    try {
      const patientId =
        typeof payload === "object" ? payload.patientId : payload;
      const includeVoided =
        typeof payload === "object" ? Boolean(payload.includeVoided) : false;
      const composite = await invoiceService.getPatientCompositeLedger(
        patientId,
        includeVoided,
      );
      const {
        invoices = [],
        adjustments = [],
        payments = [],
        claims = [],
      } = composite;
      const linkedAdjustmentIds = new Set();

      // One definition of "what this procedure still owes", shared with the
      // Add Payment dialog so both screens agree.
      const ledgerProcedures = buildLedgerProcedureContext({
        invoices,
        claims,
        adjustments,
      });
      const {
        proceduresForAdjustment,
        proceduresForPayment,
      } = ledgerProcedures;

      const mappedInvoices = invoices.map((invoice) => {
        // Reconstruct the original total charge. The backend may update totalAmount to
        // reflect the remaining balance (not the original charge) after a payment is recorded.
        // The only reliable source is: paidAmount + balanceDue when a payment exists.
        const rawTotal = Number(invoice.totalAmount || 0);
        const rawPaid = Number(invoice.paidAmount || 0);
        const rawBal = Number(invoice.balanceDue || 0);
        const rawPt = Number(invoice.patientPortion || 0);
        const rawIns =
          Number(invoice.insurancePortion || 0) +
          Number(invoice.secondaryInsPortion || 0);
        const originalTotal = rawTotal > 0 ? rawTotal : rawPt + rawIns;
        const penaltyItems = (invoice.lineItems || []).filter(
          isPatientPenaltyItem,
        );
        const penaltyTotal = penaltyItems.reduce((sum, item) => {
          const charge = Number(
            item.charge || item.total || item.totalPrice || item.amount || 0,
          );
          return sum + charge;
        }, 0);

        // Map payments and claims associated with this invoice
        const invoicePms = payments.filter(
          (p) => String(p.invoiceId) === String(invoice._id || invoice.id),
        );
        const invoiceClaims = claims.filter(
          (c) =>
            String(c.invoiceRefId) === String(invoice._id || invoice.id) ||
            String(c.invoice?._id || c.invoice?.id || "") ===
              String(invoice._id || invoice.id) ||
            (c.selectedItems &&
              c.selectedItems.some(
                (item) =>
                  String(item.invoiceId) === String(invoice._id || invoice.id),
              )),
        );

        // Find adjustments associated with this invoice
        const invoiceAdjs = adjustments.filter((a) => {
          if (!a.notes) return false;
          return (
            a.notes.includes(`Invoice #${invoice._id}`) ||
            (invoice.id && a.notes.includes(`Invoice #${invoice.id}`))
          );
        });

        // Track linked adjustment IDs so we don't render them as standalone items later
        invoiceAdjs.forEach((a) => linkedAdjustmentIds.add(a._id || a.id));

        let totalPtPaidAmt = 0;
        let totalPtAdjAmt = 0;

        let totalInsPaidAmt = 0;
        let totalAdjAmt = 0;
        // Only insurance write-offs posted by the insurance payment flow
        // ("Invoice #x - Insurance W/O: $y"). Everything else that reduces the
        // invoice — courtesy write-offs, un-collected, small balance, etc. —
        // is an adjustment and must NOT be reported as an Applied W/O.
        let totalInsWoAmt = 0;
        let runningBalance = originalTotal;

        // Combine payments and adjustments to calculate a single unified running balance chronologically
        const combinedDetails = [
          ...invoicePms.map((p) => ({ ...p, _isPmt: true })),
          ...invoiceAdjs.map((a) => ({ ...a, _isAdj: true })),
        ].sort((a, b) => {
          const numA = Number(a.id || a._id);
          const numB = Number(b.id || b._id);
          return numA - numB; // Oldest first for running balance math
        });

        const mappedCombinedDetails = combinedDetails
          .map((item) => {
            if (item._isPmt) {
              const payment = item;
              const isVoided =
                String(payment.status || "").toLowerCase() === "void" ||
                String(payment.status || "").toLowerCase() === "voided";
              const rawAmount =
                payment.isAccountCredit &&
                payment.appliedCreditAmount !== undefined
                  ? Number(payment.appliedCreditAmount)
                  : Number(payment.amount || 0);
              const paymentAmt = isVoided ? 0 : rawAmount;

              if (
                payment.paymentSource === "insurance_company" ||
                payment.method === "insurance"
              ) {
                totalInsPaidAmt += paymentAmt;
              } else {
                totalPtPaidAmt += paymentAmt;
              }
              runningBalance -= paymentAmt;

              return {
                id: payment._id || payment.id,
                title:
                  payment.paymentSource === "insurance_company" ||
                  payment.method === "insurance"
                    ? `Ins Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || "EFT"} : $${rawAmount.toFixed(2)} / $${rawAmount.toFixed(2)}${isVoided ? " (VOIDED)" : ""}`
                    : `Pt Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || "Patient Check"} : $${rawAmount.toFixed(2)} / $${rawAmount.toFixed(2)}${isVoided ? " (VOIDED)" : ""}`,
                amount: isVoided
                  ? "(Voided)"
                  : `$${Math.max(0, runningBalance).toFixed(2)}`,
                isPayment: true,
                isVoided,
                initials: creatorDisplay(payment),
                createdByName: payment.createdByName || null,
                createdAt: payment.paidAt || null,
                description: payment.notes || "",
                procedures: proceduresForPayment(payment),
              };
            } else {
              const adj = item;
              const isVoided =
                String(adj.status || "").toLowerCase() === "void" ||
                String(adj.status || "").toLowerCase() === "voided";
              const isTransfer = !!(
                adj.notes && adj.notes.toLowerCase().includes("income transfer")
              );
              // Insurance write-off adjustments are posted by the insurance
              // payment flow ("Invoice #x - Insurance W/O: $y"). They reduce
              // the invoice balance exactly like the write-off amount, but are
              // not money received from the patient, so they must never be
              // counted as patient-paid.
              const isInsWriteOff = !!(
                adj.notes &&
                (adj.notes.toLowerCase().includes("insurance w/o") ||
                  adj.notes.toLowerCase().includes("insurance writeoff") ||
                  adj.notes.toLowerCase().includes("insurance write-off"))
              );
              const isCourtesy = !!(
                (adj.notes && adj.notes.toLowerCase().includes("courtesy")) ||
                (adj.notes &&
                  adj.notes.toLowerCase().includes("small balance")) ||
                adj.type === "Write-off" ||
                (adj.type || "").toLowerCase() === "write-off" ||
                (adj.type || "").toLowerCase() === "writeoff" ||
                (adj.notes && adj.notes.toLowerCase().includes("write-off")) ||
                (adj.notes && adj.notes.toLowerCase().includes("writeoff")) ||
                !adj.type // Defaulting to Write-off if empty, even if notes have the invoice link
              );
              const adjAmt = isVoided ? 0 : Math.abs(Number(adj.amount || 0));

              totalAdjAmt += adjAmt;
              if (isInsWriteOff) totalInsWoAmt += adjAmt;
              if ((isCourtesy || isTransfer) && !isInsWriteOff)
                totalPtAdjAmt += adjAmt;
              runningBalance -= adjAmt;

              return {
                id: adj._id || adj.id,
                title: isTransfer
                  ? adj.notes
                  : isInsWriteOff
                    ? `Applied write-off : $${Math.abs(Number(adj.amount || 0)).toFixed(2)}${isVoided ? " (VOIDED)" : ""}`
                    : `Adjustment #${adj._id || adj.id}: ${adjustmentDisplayType(adj)} : $${Math.abs(Number(adj.amount || 0)).toFixed(2)}${isVoided ? " (VOIDED)" : ""}`,
                amount: isVoided
                  ? "(Voided)"
                  : `$${Math.max(0, runningBalance).toFixed(2)}`,
                rawAmount: adjAmt,
                procedureId: adj.procedureId,
                isCourtesy,
                isPayment: true,
                isAdjustment: true,
                isTransfer,
                isVoided,
                initials: creatorDisplay(adj),
                createdByName: adj.createdByName || null,
                createdAt: adj.createdAt || null,
                description: adj.notes || "",
                // The line items this adjustment hit, restated with the
                // write-off folded in, so the row can expand into them.
                procedures: proceduresForAdjustment(adj),
              };
            }
          })
          .reverse(); // Reverse at the end so newest is at the top

        const claimsMapped = invoiceClaims.map((claim) => {
          let claimStatus = claim.statusDisplay || claim.status || "Unsent";

          const isApproved =
            claimStatus.toLowerCase().includes("approved") ||
            claimStatus.toLowerCase().includes("paid") ||
            claimStatus.toLowerCase().includes("received") ||
            claimStatus.toLowerCase().includes("rejected") ||
            claimStatus.toLowerCase().includes("denied");

          const isSecondaryClaim =
            String(claim.insuranceType || "").toLowerCase() === "secondary" ||
            String(claim.claimType || "").toLowerCase() === "secondary" ||
            String(claim.ClaimType || "").toLowerCase() === "secondary";

          const effectiveInsuranceType = isSecondaryClaim
            ? "secondary"
            : claim.insuranceType || "primary";

          let specificProcedures = [];
          if (claim.procedures && claim.procedures.length > 0) {
            specificProcedures = claim.procedures
              .filter((proc) => {
                const belongsToThisInvoice =
                  String(proc.invoiceId) ===
                    String(invoice._id || invoice.id) ||
                  (invoice.lineItems || []).some(
                    (l) =>
                      String(
                        l.id || l._id || l.procedureId || l.procId || l.ProcNum,
                      ) === String(proc.id || proc.ProcNum),
                  );
                return belongsToThisInvoice && !isDbiProcedure(proc);
              })
              .map((proc) => {
                const matchedLine = (invoice.lineItems || []).find(
                  (l) =>
                    String(
                      l.id || l._id || l.procedureId || l.procId || l.ProcNum,
                    ) === String(proc.id || proc.ProcNum),
                );
                return { ...matchedLine, ...proc };
              });
          } else if (claim.selectedItems && claim.selectedItems.length > 0) {
            const thisInvoiceItems = claim.selectedItems.filter(
              (item) =>
                String(item.invoiceId) === String(invoice._id || invoice.id),
            );
            if (thisInvoiceItems.length > 0) {
              specificProcedures = (invoice.lineItems || [])
                .filter(
                  (l) =>
                    thisInvoiceItems.some(
                      (item) =>
                        String(item.itemId) ===
                        String(
                          l.id ||
                            l._id ||
                            l.procedureId ||
                            l.procId ||
                            l.ProcNum,
                        ),
                    ) && !isDbiProcedure(l),
                )
                .map((l) => {
                  const matchedSel = thisInvoiceItems.find(
                    (item) =>
                      String(item.itemId) ===
                      String(
                        l.id || l._id || l.procedureId || l.procId || l.ProcNum,
                      ),
                  );
                  return {
                    ...l,
                    amount: matchedSel?.amount,
                    insAmount: matchedSel?.insAmount || matchedSel?.amount,
                    insPayEst: matchedSel?.amount,
                  };
                });
            } else {
              specificProcedures = [];
            }
          } else {
            specificProcedures = (invoice.lineItems || []).filter(
              (l) => !isDbiProcedure(l),
            );
          }
          const specificAmount = specificProcedures.reduce(
            (sum, line) =>
              sum +
              Number(
                line.fee ||
                  line.charge ||
                  line.total ||
                  line.totalPrice ||
                  line.ProcFee ||
                  0,
              ),
            0,
          );

          const specificSecondaryAmount = specificProcedures.reduce(
            (sum, line) =>
              sum +
              Number(
                line.secondaryInsPortion !== undefined &&
                  line.secondaryInsPortion !== null &&
                  Number(line.secondaryInsPortion) > 0
                  ? line.secondaryInsPortion
                  : line.insPayEst || line.amount || 0,
              ),
            0,
          );

          const rawClaimAmount =
            Number(claim.submittedAmount) || Number(claim.claimAmount) || 0;
          const finalClaimAmount = isSecondaryClaim
            ? rawClaimAmount > 0 &&
              rawClaimAmount < Number(invoice.totalAmount || 0)
              ? rawClaimAmount
              : specificSecondaryAmount > 0
                ? specificSecondaryAmount
                : rawClaimAmount
            : rawClaimAmount > 0
              ? rawClaimAmount
              : specificAmount;

          return {
            id: claim.id || claim._id,
            claimNumber: claim.claimNumber || claim.id || claim._id,
            status: claimStatus,
            statusResponse:
              claim.statusMessage ||
              claim.statusResponse ||
              (claimStatus.toLowerCase() !== "unsent" && !isApproved
                ? "Status Response (A0): The claim is in process"
                : ""),
            attachments: claim.attachments || [],
            hasAttachment: Boolean(claim.hasAttachment),
            eobs: claim.eobs || [],
            title: `${claim.claimNumber || claim.id || claim._id} to ${claim.insuranceCompany?.name || "Insurance"}(${claim.insuranceCompany?.payerId || "00000"})${claim.isVoided ? " (VOIDED)" : ""} :`,
            amount: `$${finalClaimAmount.toFixed(2)}`,
            insuranceType: effectiveInsuranceType,
            ClaimType: isSecondaryClaim ? "Secondary" : claim.claimType,
            claimFormat: claim.claimFormat,
            claimAmount: finalClaimAmount,
            isClaim: true,
            isPayment: false,
            isApproved,
            isVoided: Boolean(claim.isVoided),
            isLocked: Boolean(claim.isLocked),
            lockedDate: claim.lockedDate || null,
            procedures: specificProcedures,
            initials: creatorDisplay(claim),
            createdByName: claim.createdByName || null,
            createdAt: claim.createdAt || null,
            description: claim.notes || claim.description || "",
          };
        });

        let detailsMapped = [];
        if (invoice.lineItems?.length > 0) {
          const invoiceProcedures = invoice.lineItems;

          const combinedTitle = invoiceProcedures
            .map((l) => l.description || "Procedure")
            .join(", ");

          const totalAmount = invoiceProcedures.reduce(
            (sum, line) =>
              sum + Number(line.total || line.totalPrice || line.charge || 0),
            0,
          );

          if (invoiceProcedures.length > 0) {
            detailsMapped = [
              {
                id: invoice.invoiceNumber || invoice._id || invoice.id,
                title: combinedTitle,
                amount: `$${totalAmount.toFixed(2)}`,
                isGrouped: true,
                isPayment: false,
                procedures: invoiceProcedures,
                createdAt: invoice.createdAt || invoice.invoiceDate || null,
                description: invoice.notes || "",
              },
            ];
          }
        }

        // Adjust balances by subtracting paid amounts AND adjustments
        // Adjustments function identically to patient payments since they reduce patient burden
        const effectivePtPaid = totalPtPaidAmt + totalPtAdjAmt;

        // Check if claims associated with this invoice have been paid/approved
        const hasApprovedClaim = claimsMapped.some((c) => c.isApproved);
        const hasInsurancePaymentRecord = invoicePms.some(
          (p) =>
            (p.paymentSource === "insurance_company" ||
              p.method === "insurance") &&
            String(p.status || "").toLowerCase() !== "void" &&
            String(p.status || "").toLowerCase() !== "voided",
        );
        // Voided claims are retained for the "include voided transactions" view but
        // must not hold insurance money out of the invoice any more.
        const isLiveClaim = (c) =>
          !c.isVoided && String(c.status || "").toLowerCase() !== "void";

        const hasInsurancePayment =
          totalInsPaidAmt > 0 || hasInsurancePaymentRecord;
        const hasPendingClaim = claimsMapped.some(
          (c) => !c.isApproved && isLiveClaim(c),
        );
        const hasPrimaryClaim = claimsMapped.some(
          (c) =>
            isLiveClaim(c) &&
            String(c.insuranceType || c.ClaimType || "").toLowerCase() !==
              "secondary",
        );
        const hasSecondaryClaim = claimsMapped.some(
          (c) =>
            isLiveClaim(c) &&
            String(c.insuranceType || c.ClaimType || "").toLowerCase() ===
              "secondary",
        );
        const claimExpectedInsurance = (claim) => {
          const isSecondary =
            String(claim.insuranceType || claim.ClaimType || "")
              .toLowerCase() === "secondary";
          const procedures = claim.procedures || [];
          const procedureTotal = procedures.reduce((sum, line) => {
            if (isSecondary) {
              return (
                sum +
                Number(
                  line.secondaryInsPortion !== undefined &&
                    line.secondaryInsPortion !== null
                    ? line.secondaryInsPortion
                    : (line.insPayEst ?? line.amount ?? 0),
                )
              );
            }
            return (
              sum +
              Number(
                line.primaryInsPortion !== undefined &&
                  line.primaryInsPortion !== null &&
                  Number(line.primaryInsPortion) > 0
                  ? line.primaryInsPortion
                  : (line.insPayEst ?? line.insPortion ?? line.amount ?? 0),
              )
            );
          }, 0);
          return procedureTotal > 0
            ? procedureTotal
            : Number(claim.claimAmount || 0);
        };
        const claimedInsuranceAmount = claimsMapped
          .filter(isLiveClaim)
          .reduce((sum, claim) => sum + claimExpectedInsurance(claim), 0);

        let unbilledInsurance = 0;
        if (!hasPrimaryClaim) {
          unbilledInsurance += Number(invoice.insurancePortion) || 0;
        }
        if (!hasSecondaryClaim && Number(invoice.secondaryInsPortion) > 0) {
          unbilledInsurance += Number(invoice.secondaryInsPortion) || 0;
        }

        const hasUnbilledInsurance = unbilledInsurance > 0.01;

        const isInsuranceSettled =
          (hasApprovedClaim || hasInsurancePayment) &&
          !hasPendingClaim &&
          !hasUnbilledInsurance;

        const totalPendingClaimAmount = claimsMapped
          .filter((c) => !c.isApproved && isLiveClaim(c))
          .reduce((sum, claim) => sum + claimExpectedInsurance(claim), 0);

        const insOverpayment = Math.max(0, totalInsPaidAmt - rawIns);
        const ptOverpayment = Math.max(0, effectivePtPaid - rawPt);

        const isClaimPartial = claimsMapped.some((c) =>
          String(c.status || "")
            .toLowerCase()
            .includes("partial"),
        );
        const hasPartialPayment = invoicePms.some(
          (p) =>
            (p.paymentSource === "insurance_company" ||
              p.method === "insurance") &&
            Boolean(p.isPartialPayment),
        );
        const isPartialAdjudication = isClaimPartial || hasPartialPayment;

        let adjustedPtBal = 0;
        let adjustedInsBal = 0;

        if (isInsuranceSettled) {
          if (isPartialAdjudication) {
            // Partial Payment marked:
            // Claim remains open/ongoing. Underpayment remains in insurance balance.
            // Patient portion is preserved and NOT charged for underpayment.
            const unallocatedPenalty = Math.max(0, penaltyTotal - rawPt);
            adjustedPtBal = Math.max(
              0,
              rawPt + unallocatedPenalty - effectivePtPaid,
            );
            adjustedInsBal = Math.max(
              0,
              originalTotal -
                rawPt -
                unallocatedPenalty -
                (Number(invoice.writeoffAmount) || 0) -
                totalInsPaidAmt,
            );
          } else {
            // Final Payment (Partial Payment unchecked / final):
            // Final claim adjudication. The insurance portion stays
            // responsible for anything it hasn't paid yet (expected − paid =
            // underpayment stays an insurance balance), and the patient only
            // shows a balance for the remainder after that.
            // Use the larger of rawIns or (total - writeoff - ptPortion) as the
            // true expected insurance in case the backend stored totalInsPaid
            // instead of the original expected amount.
            const effectiveExpectedIns =
              claimedInsuranceAmount > 0
                ? claimedInsuranceAmount
                : Math.max(
                    rawIns,
                    Math.max(
                      0,
                      originalTotal -
                        (Number(invoice.writeoffAmount) || 0) -
                        rawPt,
                    ),
                  );
            adjustedInsBal = Math.max(
              0,
              effectiveExpectedIns - totalInsPaidAmt,
            );
            adjustedPtBal = Math.max(
              0,
              originalTotal -
                (Number(invoice.writeoffAmount) || 0) -
                totalInsPaidAmt -
                effectivePtPaid -
                adjustedInsBal,
            );
          }
        } else {
          // Insurance pending: patient owes their portion, insurance owes their portion
          const penaltyInIns = Math.min(rawIns, penaltyTotal);
          const hasLiveClaim = hasPrimaryClaim || hasSecondaryClaim;
          let calcInsBal = hasLiveClaim
            ? Math.max(
                0,
                rawIns - penaltyInIns - totalInsPaidAmt - ptOverpayment,
              )
            : 0;

          // Once a claim exists, only the procedures actually on that claim
          // remain with insurance. Any unclaimed procedure's estimate moves to
          // the patient balance, even while the claim is still pending.
          if (hasLiveClaim || hasInsurancePayment || hasApprovedClaim) {
            const expectedRemainingIns =
              totalPendingClaimAmount + unbilledInsurance;
            calcInsBal = Math.min(calcInsBal, expectedRemainingIns);
          }

          adjustedInsBal = calcInsBal;
          adjustedPtBal = Math.max(
            0,
            originalTotal -
              (Number(invoice.writeoffAmount) || 0) -
              totalInsPaidAmt -
              effectivePtPaid -
              adjustedInsBal,
          );
        }
        // The estimated write-off is NOT a posted adjustment yet — it only
        // comes off the invoice balance once the insurance payment flow
        // actually applies it, at which point it is already counted inside
        // totalAdjAmt. Subtracting it here as well dropped the outstanding
        // W/O from the balance ($165 instead of $194 = $45 patient +
        // $120 insurance + $29 pending Ins WO).
        const adjustedInvBal = Math.max(
          0,
          originalTotal - totalPtPaidAmt - totalInsPaidAmt - totalAdjAmt,
        );

        const ptPaidDisplay = totalPtPaidAmt;

        return {
          id: invoice._id || invoice.id,
          invoiceNumber: invoice.invoiceNumber || invoice._id || invoice.id,
          date: invoice.invoiceDate
            ? dayjs(invoice.invoiceDate).format("MM/DD/YYYY")
            : "N/A",
          rawDate: invoice.invoiceDate || "",
          method: "Invoice",
          amount: `$${originalTotal.toFixed(2)}`,
          totalAmount: `$${originalTotal.toFixed(2)}`,
          color: "#5c6bc0",
          isAdjustment: false,
          initials: creatorDisplay(invoice),
          createdByName: invoice.createdByName || null,
          isVoided:
            String(invoice.status || "").toLowerCase() === "voided" ||
            String(invoice.status || "").toLowerCase() === "void",
          success:
            String(invoice.status || "").toLowerCase() !== "draft" &&
            String(invoice.status || "").toLowerCase() !== "voided" &&
            String(invoice.status || "").toLowerCase() !== "void",
          summary: {
            // Ins WO is the write-off still outstanding: the priced estimate
            // less what the insurance payment flow has already applied. Once
            // the W/O is posted it moves into Applied WO, so the same dollars
            // are never counted in both columns.
            insWo: `$${Math.max(0, (Number(invoice.writeoffAmount) || 0) - totalInsWoAmt).toFixed(2)}`,
            ptBal: `$${adjustedPtBal.toFixed(2)}`,
            insBal: `$${adjustedInsBal.toFixed(2)}`,
            invBal: `$${adjustedInvBal.toFixed(2)}`,
            // Insurance write-offs only — general adjustments (courtesy,
            // un-collected, small balance…) belong on the invoice balance, not
            // in Applied W/O.
            appliedWo: `$${totalInsWoAmt.toFixed(2)}`,
            ptPaid: `$${ptPaidDisplay.toFixed(2)}`,
            insPaid: `$${totalInsPaidAmt.toFixed(2)}`,
          },
          details: [
            ...mappedCombinedDetails,
            ...claimsMapped,
            ...detailsMapped,
          ],
        };
      });

      const mappedAdjustments = adjustments
        .filter((adj) => !linkedAdjustmentIds.has(adj._id || adj.id))
        .map((adj) => {
          const amt = Number(adj.amount || 0);
          const isVoided =
            String(adj.status || "").toLowerCase() === "void" ||
            String(adj.status || "").toLowerCase() === "voided";
          const isTransfer = !!(
            adj.notes && adj.notes.toLowerCase().includes("income transfer")
          );
          const isCourtesy = !!(
            (adj.notes && adj.notes.toLowerCase().includes("courtesy")) ||
            adj.type === "Write-off" ||
            (adj.type || "").toLowerCase() === "write-off" ||
            (adj.type || "").toLowerCase() === "writeoff" ||
            (adj.notes && adj.notes.toLowerCase().includes("write-off")) ||
            (adj.notes && adj.notes.toLowerCase().includes("writeoff")) ||
            !adj.type
          );

          // The line items this adjustment was posted against, restated with the
          // write-off folded in. An adjustment with no procedure link keeps its
          // old single note row, since there is nothing to expand into.
          const targetProcedures = proceduresForAdjustment(adj);

          return {
            id: adj._id || adj.id,
            invoiceNumber: isTransfer
              ? adj.notes
              : `Adj #${adj._id || adj.id}${isVoided ? " (VOIDED)" : ""}`,
            date: adj.date ? dayjs(adj.date).format("MM/DD/YYYY") : "N/A",
            rawDate: adj.date || "",
            method: isTransfer ? "Transfer" : "Adjustment",
            amount: isVoided ? "(Voided)" : `$${Math.abs(amt).toFixed(2)}`,
            color: isVoided ? "#9e9e9e" : isTransfer ? "#0288d1" : "#7e57c2",
            isAdjustment: true,
            isTransfer,
            useCheckmark: false,
            initials: creatorDisplay(adj),
            createdByName: adj.createdByName || null,
            isVoided,
            success: !isVoided,
            summary: {
              insWo: "$0.00",
              ptBal: `$${amt.toFixed(2)}`,
              insBal: "$0.00",
              invBal: `$${amt.toFixed(2)}`,
              appliedWo: "$0.00",
              ptPaid: "$0.00",
              insPaid: "$0.00",
            },
            details: [
              {
                id: adj._id || adj.id,
                title: isTransfer
                  ? adj.notes
                  : adj.notes || "Patient Account Adjustment",
                amount: `$${amt.toFixed(2)}`,
                isTransfer,
                createdAt: adj.createdAt || null,
                description: adj.notes || "",
                // Post-adjustment line items, so the row expands into them the
                // way an invoice does (see LedgerSubRow's procedure table).
                procedures: targetProcedures,
                defaultExpanded: targetProcedures.length > 0,
              },
            ],
          };
        });

      const mappedPayments = payments
        .filter((pay) => !pay.invoiceId)
        .map((pay) => {
          const amt = Number(pay.amount || 0);
          const isVoided =
            String(pay.status || "").toLowerCase() === "void" ||
            String(pay.status || "").toLowerCase() === "voided";
          const isDeposit =
            Boolean(pay.isDeposit) ||
            Boolean(
              pay.depositType === "patient" || pay.depositType === "insurance",
            ) ||
            String(pay.notes || "")
              .toLowerCase()
              .includes("prepayment deposit") ||
            String(pay.paymentMethod || "")
              .toLowerCase()
              .includes("deposit") ||
            String(pay.method || "")
              .toLowerCase()
              .includes("deposit");

          return {
            id: pay._id || pay.id,
            invoiceNumber: `Pay #${pay.receiptNumber || pay.id}${isVoided ? " (VOIDED)" : ""}`,
            date: pay.paidAt ? dayjs(pay.paidAt).format("MM/DD/YYYY") : "N/A",
            rawDate: pay.paidAt || "",
            method: isDeposit ? "Patient Deposit" : "Payment",
            depositType: pay.depositType || (isDeposit ? "patient" : undefined),
            isPatientDeposit: isDeposit,
            amount: isVoided ? "(Voided)" : `$${amt.toFixed(2)}`,
            color: isVoided ? "#9e9e9e" : "#4caf50",
            isAdjustment: false,
            isTopLevelPayment: true,
            useCheckmark: true,
            initials: creatorDisplay(pay),
            createdByName: pay.createdByName || null,
            isVoided,
            success: !isVoided,
            summary: {
              insWo: "$0.00",
              ptBal: isVoided
                ? "$0.00"
                : isDeposit
                  ? "$0.00"
                  : `-$${amt.toFixed(2)}`,
              insBal: "$0.00",
              invBal: "$0.00",
              appliedWo: "$0.00",
              ptPaid: isVoided
                ? "$0.00"
                : isDeposit
                  ? "$0.00"
                  : `$${amt.toFixed(2)}`,
              insPaid: "$0.00",
            },
            details: [
              {
                id: pay._id || pay.id,
                title:
                  pay.notes ||
                  `Patient Payment via ${pay.paymentMethod || "Card"}`,
                amount: isVoided ? "(Voided)" : `$${amt.toFixed(2)}`,
                isVoided,
                createdAt: pay.paidAt || null,
              },
            ],
          };
        });

      const combined = [
        ...mappedInvoices,
        ...mappedAdjustments,
        ...mappedPayments,
      ];
      combined.sort((a, b) => {
        const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
        const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;

        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA;
        }
        return String(b.id).localeCompare(String(a.id));
      });

      return { patientId, items: combined };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch ledger",
      );
    }
  },
);

/**
 * Load full line-item details + payments for a single invoice row and merge
 * them back into the cached ledger list for a patient.
 */
export const fetchInvoiceDetails = createAsyncThunk(
  "billing/fetchInvoiceDetails",
  async (
    { patientId, invoiceId, includeVoided = false },
    { rejectWithValue },
  ) => {
    try {
      const fullInvoice = await invoiceService.getInvoiceById(
        invoiceId,
        includeVoided,
      );

      let totalPaidAmt = 0;
      let paymentsMapped = [];
      try {
        const paymentsResponse =
          await paymentService.getPaymentsByInvoice(invoiceId);
        const payments = paymentsResponse?.payments || paymentsResponse || [];
        const invTotal = Number(fullInvoice.totalAmount || 0);
        const invPaid = Number(fullInvoice.paidAmount || 0);
        const invBal = Number(fullInvoice.balanceDue || 0);
        const invPt = Number(fullInvoice.patientPortion || 0);
        const trueTotal =
          invPaid > 0
            ? invPaid + invBal
            : invTotal > 0
              ? invTotal
              : invPt > 0
                ? invPt
                : invBal;
        let runningBalance = trueTotal;
        const sortedPayments = (
          Array.isArray(payments) ? [...payments] : []
        ).sort((a, b) => {
          const numA = Number(a.PayNum || a.id);
          const numB = Number(b.PayNum || b.id);
          return numA - numB;
        });

        paymentsMapped = sortedPayments
          .map((payment) => {
            const isVoided =
              String(payment.status || "").toLowerCase() === "void" ||
              String(payment.status || "").toLowerCase() === "voided";
            const paymentAmt = isVoided ? 0 : Number(payment.amount || 0);
            const originalAmt = Number(payment.amount || 0);

            const isIns =
              payment.paymentSource === "insurance_company" ||
              payment.method === "insurance";
            if (isIns) {
              // we do not have totalInsPaidAmt declared in this scope, but we can track it
            }

            totalPaidAmt += paymentAmt;
            runningBalance -= paymentAmt;

            const title = isIns
              ? `Ins Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || "EFT"} : $${originalAmt.toFixed(2)} / $${originalAmt.toFixed(2)}${isVoided ? " (VOIDED)" : ""}`
              : `Pt Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || "Patient Check"} : $${originalAmt.toFixed(2)} / $${originalAmt.toFixed(2)}${isVoided ? " (VOIDED)" : ""}`;

            return {
              id: payment._id || payment.id,
              title,
              amount: isVoided
                ? "(Voided)"
                : `$${Math.max(0, runningBalance).toFixed(2)}`,
              isPayment: true,
              isVoided,
              createdAt: payment.paidAt || null,
            };
          })
          .reverse();
      } catch (e) {
        console.error("Failed to fetch payments for invoice", e);
      }

      let claimsMapped = [];
      try {
        const claimsResponse = await claimService.getAllClaims({ invoiceId });
        const claims = claimsResponse?.claims || claimsResponse || [];

        claimsMapped = (Array.isArray(claims) ? claims : []).map((claim) => {
          let specificProcedures = claim.procedures;
          if (!specificProcedures || specificProcedures.length === 0) {
            specificProcedures = (fullInvoice.lineItems || []).filter(
              (l) => !isDbiProcedure(l),
            );
          } else {
            specificProcedures = specificProcedures
              .map((proc) => {
                const matchedLine = (fullInvoice.lineItems || []).find(
                  (l) =>
                    String(
                      l.id || l._id || l.procedureId || l.procId || l.ProcNum,
                    ) === String(proc.id || proc.ProcNum || proc.procedureId),
                );
                return { ...matchedLine, ...proc };
              })
              .filter((proc) => !isDbiProcedure(proc));
          }
          const specificAmount = specificProcedures.reduce(
            (sum, line) =>
              sum +
              Number(
                line.fee ||
                  line.charge ||
                  line.total ||
                  line.totalPrice ||
                  line.ProcFee ||
                  0,
              ),
            0,
          );

          return {
            id: claim.id || claim._id,
            claimNumber: claim.claimNumber || claim.id || claim._id,
            status: claim.statusDisplay || claim.status,
            attachments: claim.attachments || [],
            hasAttachment: Boolean(claim.hasAttachment),
            eobs: claim.eobs || [],
            title: `Ins Claim #${claim.claimNumber || claim.id} (${claim.statusDisplay || claim.status}) with: ${claim.insuranceCompany?.name || "Insurance"}`,
            amount: `$${specificAmount.toFixed(2)}`,
            isClaim: true,
            isPayment: false,
            procedures: specificProcedures,
            createdAt: claim.createdAt || null,
            description: claim.notes || claim.description || "",
          };
        });
      } catch (e) {
        console.error("Failed to fetch claims for invoice", e);
      }

      let detailsMapped = [];
      if (fullInvoice.lineItems?.length > 0) {
        // The inner invoice row should only show procedures where dbi is true
        const invoiceProcedures = fullInvoice.lineItems.filter(
          (l) => l.dbi === true,
        );

        const combinedTitle = invoiceProcedures
          .map((l) => l.description || "Procedure")
          .join(", ");

        const totalAmount = invoiceProcedures.reduce(
          (sum, line) =>
            sum + Number(line.total || line.totalPrice || line.charge || 0),
          0,
        );

        if (invoiceProcedures.length > 0) {
          detailsMapped = [
            {
              id:
                fullInvoice.invoiceNumber || fullInvoice._id || fullInvoice.id,
              title: combinedTitle,
              amount: `$${totalAmount.toFixed(2)}`,
              isGrouped: true,
              isPayment: false,
              procedures: invoiceProcedures,
              description: fullInvoice.notes || "",
            },
          ];
        }
      }

      return {
        patientId,
        invoiceId,
        details: [...paymentsMapped, ...claimsMapped, ...detailsMapped],
        totalPaidAmt,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to fetch invoice details",
      );
    }
  },
  {
    condition: ({ patientId, invoiceId }, { getState }) => {
      const { billing } = getState();
      if (billing.detailsFetchingSet.includes(invoiceId)) return false;
      const items = billing.ledgerCache[patientId] || [];
      const cachedItem = items.find((i) => i.id === invoiceId);
      if (cachedItem && cachedItem.details && cachedItem.details.length > 0)
        return false;
      return true;
    },
  },
);

/**
 * Backdate an invoice or adjustment, then re-fetch the ledger.
 */
export const backdateTransaction = createAsyncThunk(
  "billing/backdateTransaction",
  async (
    { patientId, itemId, date, isAdjustment },
    { dispatch, rejectWithValue },
  ) => {
    try {
      if (isAdjustment) {
        await apiClient.patch(`/adjustments/${itemId}`, {
          date: new Date(date),
        });
      } else {
        await invoiceService.updateInvoice(itemId, {
          invoiceDate: new Date(date),
        });
      }
      await dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to backdate transaction",
      );
    }
  },
);

/**
 * Void (delete) an invoice item, a full invoice, or an adjustment.
 */
export const voidTransaction = createAsyncThunk(
  "billing/voidTransaction",
  async (
    {
      patientId,
      invoiceId,
      itemId,
      isAdjustment,
      isGrouped,
      isPayment,
      isDeposit,
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      if (isAdjustment) {
        await apiClient.delete(`/adjustments/${itemId || invoiceId}`);
      } else if (isPayment) {
        await paymentService.voidPayment(itemId, "Voided from Ledger");
      } else if (isDeposit) {
        try {
          await apiClient.delete(`/deposits/${itemId}`);
        } catch (depositErr) {
          const status = depositErr?.response?.status;
          if (status !== 404 && status !== 405) {
            throw depositErr;
          }
        }
      } else if (isGrouped) {
        // Voiding an entire invoice goes through the invoice void endpoint.
        // It marks the statement void and reverses any deductible the invoice
        // posted, which a plain delete cannot do — /admin-finance has no
        // invoice route, so that path 404'd.
        await invoiceService.voidInvoice(invoiceId, "Voided from Ledger");
      } else {
        // A single procedure off an invoice. It is flagged voided rather than
        // deleted, so the invoice can still list it under "include voided
        // transactions" while every total ignores it.
        await invoiceService.voidInvoiceItem(
          invoiceId,
          itemId,
          "Voided from Ledger",
        );
      }

      // Recalculate invoice balances if we didn't just delete the whole invoice
      if (invoiceId && !isGrouped && !isDeposit) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }

      await dispatch(fetchLedgerItems(patientId));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-ledger"));
        window.dispatchEvent(new CustomEvent("add-ledger-item"));
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to void transaction",
      );
    }
  },
);
/**
 * Transfer outstanding insurance balance to the patient.
 */
export const transferOutstandingToPatient = createAsyncThunk(
  "billing/transferOutstandingToPatient",
  async (
    { invoiceId, procedureId, patientId, skipFetch },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await apiClient.post(
        `/invoices/${invoiceId}/items/${procedureId}/transfer-outstanding`,
      );
      if (!skipFetch) {
        // Ensure any cached ledger for this patient is invalidated so fetchLedgerItems actually refetches
        try {
          dispatch(invalidateLedger(patientId));
        } catch (e) {
          // ignore if action isn't available for some reason
        }
        await dispatch(fetchLedgerItems(patientId));
        await dispatch(fetchInvoiceDetails({ patientId, invoiceId }));
      }
      return { procedureId, invoiceId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          "Failed to transfer outstanding balance to patient",
      );
    }
  },
);

/**
 * Shift what the patient still owes on a line item back onto the insurance
 * estimate - the reverse of transferOutstandingToPatient.
 */
export const transferOutstandingToInsurance = createAsyncThunk(
  "billing/transferOutstandingToInsurance",
  async (
    { invoiceId, procedureId, patientId, skipFetch },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await apiClient.post(
        `/invoices/${invoiceId}/items/${procedureId}/transfer-outstanding-to-insurance`,
      );
      if (!skipFetch) {
        try {
          dispatch(invalidateLedger(patientId));
        } catch (e) {
          // ignore if action isn't available for some reason
        }
        await dispatch(fetchLedgerItems(patientId));
        await dispatch(fetchInvoiceDetails({ patientId, invoiceId }));
      }
      return { procedureId, invoiceId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          "Failed to transfer outstanding patient balance to insurance",
      );
    }
  },
);

/**
 * Apply a courtesy credit adjustment for a procedure.
 */
export const applyCourtesyCredit = createAsyncThunk(
  "billing/applyCourtesyCredit",
  async (
    { patientId, procedureId, invoiceId, adjustmentType, creditAmount },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await apiClient.post("/adjustments", {
        patientId,
        amount: -Math.abs(creditAmount),
        date: new Date(),
        notes: `${adjustmentType} applied to Procedure #${procedureId}`,
      });
      if (invoiceId) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }
      await dispatch(fetchLedgerItems(patientId));
      if (invoiceId) {
        await dispatch(fetchInvoiceDetails({ patientId, invoiceId }));
      }
      return { procedureId, invoiceId, adjustmentType };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to apply courtesy credit",
      );
    }
  },
);

/**
 * Apply a generic adjustment to an invoice.
 */
export const createInvoiceAdjustment = createAsyncThunk(
  "billing/createInvoiceAdjustment",
  async (
    {
      patientId,
      invoiceId,
      adjustmentType,
      adjustmentAmount,
      reason,
      typeId,
      lineItems,
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const procedureAdjustments = (lineItems || [])
        .map((line) => ({
          ...line,
          amount: Number(line.amount || 0),
        }))
        .filter((line) => line.procedureId && line.amount > 0);

      if (procedureAdjustments.length > 0) {
        for (const line of procedureAdjustments) {
          await apiClient.post("/adjustments", {
            patientId,
            invoiceId,
            procedureId: line.procedureId,
            amount: -Math.abs(line.amount),
            date: new Date(),
            type: typeId || undefined,
            notes: `${adjustmentType} applied to Invoice #${invoiceId} Procedure #${line.procedureId}${line.code ? ` (${line.code})` : ""}${reason ? ` - ${reason}` : ""}`,
          });
        }
      } else {
        await apiClient.post("/adjustments", {
          patientId,
          invoiceId,
          amount: -Math.abs(adjustmentAmount),
          date: new Date(),
          type: typeId || undefined,
          notes: `${adjustmentType} applied to Invoice #${invoiceId}${reason ? ` - ${reason}` : ""}`,
        });
      }
      if (invoiceId) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }
      await dispatch(fetchLedgerItems(patientId));
      if (invoiceId) {
        await dispatch(fetchInvoiceDetails({ patientId, invoiceId }));
      }
      return { invoiceId, adjustmentType };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          "Failed to create invoice adjustment",
      );
    }
  },
);

/**
 * Undo a courtesy credit by finding and deleting the matching adjustment.
 */
export const undoCourtesyCredit = createAsyncThunk(
  "billing/undoCourtesyCredit",
  async (
    { patientId, procedureId, invoiceId },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await apiClient.get(
        `/adjustments?patientId=${patientId}&limit=1000`,
      );
      const adjustments = response.data?.data?.adjustments || [];
      const target = adjustments.find(
        (adj) => adj.notes && adj.notes.includes(`Procedure #${procedureId}`),
      );
      if (target) {
        await apiClient.delete(`/adjustments/${target._id || target.id}`);
      }
      if (invoiceId) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }
      await dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || "Failed to undo courtesy credit",
      );
    }
  },
);

// ---------------------------------------------------------------------------
// AddPaymentDialog — draft invoices with per-item remaining balances
// ---------------------------------------------------------------------------

/**
 * Fetch draft invoices for payment allocation.
 *
 * Every per-procedure number (patient balance, insurance balance, write-off,
 * adjustment) comes from the same shared ledger context the patient ledger
 * uses, so a line can never read "$25 patient / $0 insurance / $20 adjustment"
 * in the ledger and something else here. Fully-settled lines and invoices are
 * dropped - this dialog only collects money the patient still owes.
 * Cached by patientId in `paymentInvoicesCache`.
 */
export const fetchPaymentDraftInvoices = createAsyncThunk(
  "billing/fetchPaymentDraftInvoices",
  async (patientId, { rejectWithValue }) => {
    try {
      const composite = await invoiceService.getPatientCompositeLedger(
        patientId,
        false,
      );
      const {
        invoices = [],
        adjustments = [],
        claims = [],
      } = composite || {};
      const ledgerProcedures = buildLedgerProcedureContext({
        invoices,
        claims,
        adjustments,
      });

      const result = invoices
        .map((fullInv) => {
          const invoiceId = fullInv.id || fullInv._id;
          const invoiceClaims = claims.filter(
            (claim) =>
              String(claim.invoiceRefId || "") === String(invoiceId) ||
              String(claim.invoice?._id || claim.invoice?.id || "") ===
                String(invoiceId) ||
              (claim.selectedItems || []).some(
                (item) => String(item.invoiceId) === String(invoiceId),
              ) ||
              (claim.procedures || []).some(
                (proc) =>
                  String(proc.invoiceId || "") === String(invoiceId) ||
                  (fullInv.lineItems || []).some(
                    (line) =>
                      String(line.id || line._id) ===
                      String(proc.id || proc._id || proc.ProcNum),
                  ),
              ),
          );
          const hasLiveClaim = invoiceClaims.some((claim) => {
            const status = String(claim.status || "").toLowerCase();
            return !claim.isVoided && status !== "void" && status !== "voided";
          });

          const lineItems = (fullInv.lineItems || [])
            .filter((item) => !item.isVoided)
            .map((item) => {
              const itemId = item.id || item._id;
              const adjusted = ledgerProcedures.procedureAfterAdjustments(item);
              const patientBalance =
                ledgerProcedures.remainingPatientBalance(item);
              const insuranceBalance =
                ledgerProcedures.remainingInsuranceBalance(item);
              const writeoff =
                ledgerProcedures.writeoffForProcedure(item);
              const adjustmentAmount =
                ledgerProcedures.adjustmentForProcedure(item);
              const totalAmount = moneyNumber(
                adjusted.fee ||
                  item.totalPrice ||
                  item.total ||
                  item.ProcFee ||
                  item.charge ||
                  item.amount,
              );

              return {
                ...item,
                id: itemId,
                checked: false,
                payAmount: patientBalance.toFixed(2),
                patientBalance,
                writeoffAmount: writeoff,
                adjustmentAmount,
                insuranceAmount: insuranceBalance,
                totalAmount,
                remainingBal: Number(
                  Math.max(0, totalAmount - writeoff).toFixed(2),
                ),
              };
            });

          let payableItems = lineItems.filter(
            (item) => Number(item.patientBalance.toFixed(2)) > 0,
          );

          const invoicePatientPaid = lineItems.reduce(
            (sum, item) =>
              sum +
              moneyNumber(
                item.patientPaidAmount ?? item.patientPaid ?? item.ptPaid,
              ),
            0,
          );
          const rawPatientPortion = moneyNumber(fullInv.patientPortion);
          const rawInsurancePortion =
            moneyNumber(fullInv.insurancePortion) +
            moneyNumber(fullInv.secondaryInsPortion);
          const patientOnlyFallback =
            rawPatientPortion <= 0 && rawInsurancePortion <= 0 && !hasLiveClaim
              ? Math.max(
                  0,
                  moneyNumber(fullInv.totalAmount) -
                    moneyNumber(fullInv.writeoffAmount) -
                    moneyNumber(fullInv.paidAmount),
                )
              : 0;
          const invoicePatientBalance = roundMoney(
            moneyNumber(fullInv.patientBalance) ||
              Math.max(0, rawPatientPortion - invoicePatientPaid) ||
              patientOnlyFallback,
          );

          if (payableItems.length === 0 && invoicePatientBalance > 0) {
            const sourceItems = lineItems.length > 0
              ? lineItems
              : [
                  {
                    id: fullInv.id || fullInv._id,
                    description: fullInv.invoiceNumber || "Invoice balance",
                    totalAmount: moneyNumber(fullInv.totalAmount),
                    writeoffAmount: moneyNumber(fullInv.writeoffAmount),
                    insuranceAmount: moneyNumber(fullInv.insurancePortion),
                    adjustmentAmount: moneyNumber(fullInv.adjustmentAmount),
                  },
                ];
            const weights = sourceItems.map((item) =>
              Math.max(
                0,
                moneyNumber(item.ptPortion) ||
                  moneyNumber(item.patientPortion) ||
                  moneyNumber(item.patientAmount) ||
                  moneyNumber(item.totalAmount) ||
                  moneyNumber(item.totalPrice) ||
                  moneyNumber(item.charge) ||
                  moneyNumber(item.amount),
              ),
            );
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            let remaining = invoicePatientBalance;

            payableItems = sourceItems.map((item, index) => {
              const isLast = index === sourceItems.length - 1;
              const share = isLast
                ? remaining
                : roundMoney(
                    invoicePatientBalance *
                      ((totalWeight > 0 ? weights[index] : 1) /
                        (totalWeight > 0 ? totalWeight : sourceItems.length)),
                  );
              remaining = roundMoney(remaining - share);
              return {
                ...item,
                id: item.id || item._id || `${fullInv.id || fullInv._id}-${index}`,
                checked: false,
                patientBalance: share,
                payAmount: share.toFixed(2),
              };
            }).filter((item) => item.patientBalance > 0);
          }

          if (payableItems.length === 0) return null;

          const totalPatientBalance = payableItems.reduce(
            (sum, item) => sum + item.patientBalance,
            0,
          );

          return {
            ...fullInv,
            id: fullInv.id || fullInv._id,
            checked: false,
            patientBalance: Number(totalPatientBalance.toFixed(2)),
            lineItems: payableItems,
          };
        })
        .filter(Boolean);

      return { patientId, invoices: result };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to fetch payment invoices",
      );
    }
  },
  {
    /**
     * Skip if already fetching or already cached for this patient.
     */
    condition: (patientId, { getState }) => {
      const { billing } = getState();
      if (billing.paymentInvoicesFetchingSet?.includes(patientId)) return false;
      return true;
    },
  },
);

export const fetchBillingConfiguration = createAsyncThunk(
  "billing/fetchConfiguration",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/admin-finance/settings/billing_configuration",
        { signal },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.billingConfigLoading) return false;
    },
  },
);

export const saveBillingConfiguration = createAsyncThunk(
  "billing/saveConfiguration",
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        "/admin-finance/settings/billing_configuration",
        configData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchARAutomationConfig = createAsyncThunk(
  "billing/fetchARAutomationConfig",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/admin-finance/settings/ar_automation_config",
        { signal },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.arAutomationLoading) return false;
    },
  },
);

export const saveARAutomationConfig = createAsyncThunk(
  "billing/saveARAutomationConfig",
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        "/admin-finance/settings/ar_automation_config",
        configData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchAdjustmentTypes = createAsyncThunk(
  "billing/fetchAdjustmentTypes",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin-finance/definitions/1", {
        signal,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.adjustmentTypesLoading || billing.adjustmentTypes.length > 0)
        return false;
      return true;
    },
  },
);

export const createAdjustmentType = createAsyncThunk(
  "billing/createAdjustmentType",
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/admin-finance/definitions/1",
        adjustmentData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateAdjustmentType = createAsyncThunk(
  "billing/updateAdjustmentType",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/admin-finance/definitions/item/${id}`,
        updateData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteAdjustmentType = createAsyncThunk(
  "billing/deleteAdjustmentType",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPaymentTypes = createAsyncThunk(
  "billing/fetchPaymentTypes",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin-finance/definitions/4", {
        signal,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypesLoading || billing.paymentTypes.length > 0)
        return false;
      return true;
    },
  },
);

export const createPaymentType = createAsyncThunk(
  "billing/createPaymentType",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/admin-finance/definitions/4",
        paymentData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updatePaymentType = createAsyncThunk(
  "billing/updatePaymentType",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/admin-finance/definitions/item/${id}`,
        updateData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deletePaymentType = createAsyncThunk(
  "billing/deletePaymentType",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPaymentTypeDefaults = createAsyncThunk(
  "billing/fetchPaymentTypeDefaults",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/admin-finance/settings/payment_types_defaults",
        { signal },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypeDefaultsLoading) return false;
      return true;
    },
  },
);

export const savePaymentTypeDefaults = createAsyncThunk(
  "billing/savePaymentTypeDefaults",
  async (defaultsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        "/admin-finance/settings/payment_types_defaults",
        defaultsData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPaymentTerminals = createAsyncThunk(
  "billing/fetchPaymentTerminals",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/admin-finance/settings/payment_terminals",
        { signal },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTerminalsLoading) return false;
      return true;
    },
  },
);

export const savePaymentTerminals = createAsyncThunk(
  "billing/savePaymentTerminals",
  async (terminalsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        "/admin-finance/settings/payment_terminals",
        terminalsData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchArAgingReport = createAsyncThunk(
  "billing/fetchArAgingReport",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport("aging", filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.arAgingLoading) return false;
      return true;
    },
  },
);

export const fetchPatientAgingReport = createAsyncThunk(
  "billing/fetchPatientAgingReport",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport(
        "patient-aging",
        filters,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.patientAgingLoading) return false;
      return true;
    },
  },
);

export const fetchModificationsReport = createAsyncThunk(
  "billing/fetchModificationsReport",
  async ({ date, range }, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport("modifications", {
        date,
        range,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPatientAccountNotes = createAsyncThunk(
  "billing/fetchPatientAccountNotes",
  async (patient, { rejectWithValue }) => {
    const patientId =
      typeof patient === "object" ? patient.id || patient.name : patient;
    const patientName = typeof patient === "object" ? patient.name : patient;
    try {
      const response = await apiClient.get(
        `/patients/${patientId}/account-notes`,
      );
      return response.data.data;
    } catch (error) {
      console.warn("API call failed, falling back to localStorage", error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
      const seedNotes = [
        {
          id: "seed-1",
          date: "06/14/2022",
          source: "agingReport",
          text: "This is an account note",
          remindMe: false,
          archived: false,
        },
      ];
      localStorage.setItem(
        `account_notes_${patientName}`,
        JSON.stringify(seedNotes),
      );
      return seedNotes;
    }
  },
);

export const createPatientAccountNote = createAsyncThunk(
  "billing/createPatientAccountNote",
  async ({ patient, text }, { rejectWithValue }) => {
    const patientId =
      typeof patient === "object" ? patient.id || patient.name : patient;
    const patientName = typeof patient === "object" ? patient.name : patient;
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US"),
      source: "agingReport",
      text: text,
      remindMe: false,
      archived: false,
    };
    try {
      const response = await apiClient.post(
        `/patients/${patientId}/account-notes`,
        newNote,
      );
      return response.data.data;
    } catch (error) {
      console.warn("API call failed, saving to localStorage", error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      let notesList = [];
      if (stored) {
        try {
          notesList = JSON.parse(stored);
        } catch (e) {}
      }
      notesList.push(newNote);
      localStorage.setItem(
        `account_notes_${patientName}`,
        JSON.stringify(notesList),
      );
      return notesList;
    }
  },
);

export const updatePatientAccountNote = createAsyncThunk(
  "billing/updatePatientAccountNote",
  async ({ patient, noteId, updates }, { rejectWithValue }) => {
    const patientId =
      typeof patient === "object" ? patient.id || patient.name : patient;
    const patientName = typeof patient === "object" ? patient.name : patient;
    try {
      const response = await apiClient.put(
        `/patients/${patientId}/account-notes/${noteId}`,
        updates,
      );
      return response.data.data;
    } catch (error) {
      console.warn("API call failed, updating in localStorage", error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      let notesList = [];
      if (stored) {
        try {
          notesList = JSON.parse(stored);
        } catch (e) {}
      }
      const updatedList = notesList.map((n) => {
        if (n.id === noteId || String(n.id) === String(noteId)) {
          return { ...n, ...updates };
        }
        return n;
      });
      localStorage.setItem(
        `account_notes_${patientName}`,
        JSON.stringify(updatedList),
      );
      return updatedList;
    }
  },
);

const initialState = {
  // Current invoice being viewed/edited
  currentInvoice: null,

  // Selected invoice ID
  selectedInvoiceId: null,

  // Claim status map (claimId -> status)
  claimStatus: {},

  // Payment plans
  paymentPlans: [],

  // A/R aging data
  arAging: null,
  arAgingLoading: false,

  // Patient aging data
  patientAging: null,
  patientAgingLoading: false,

  // Modifications Report
  modificationsData: [],
  modificationsLoading: false,
  modificationsError: null,

  // Billing Configuration
  billingConfiguration: null,
  billingConfigLoading: false,

  // AR Automation Configuration
  arAutomationConfig: null,
  arAutomationLoading: false,

  // Adjustment Types
  adjustmentTypes: [],
  adjustmentTypesLoading: false,

  // Payment Types
  paymentTypes: [],
  paymentTypesLoading: false,
  paymentTypeDefaults: {
    patient: "Master Card",
    insurance: "Master Card",
    family: "",
  },

  // Payment Terminals
  paymentTerminals: { openEdge: [], prosperipay: [], payrix: [] },
  paymentTerminalsLoading: false,

  // UI state
  loading: false,
  error: null,

  // Ledger state — per-patient ledger items
  ledgerCache: {}, // { [patientId]: LedgerItem[] }
  ledgerLoading: false,
  ledgerError: null,
  detailsFetchingSet: [], // invoice IDs currently being fetched — prevents duplicate requests

  // AddPaymentDialog — draft invoices for payment allocation
  paymentInvoicesCache: {}, // { [patientId]: Invoice[] }
  paymentInvoicesLoading: false,
  paymentInvoicesError: null,
  paymentInvoicesFetchingSet: [], // patientIds currently being fetched

  // Per-invoice adjustmentTypes map { [invoiceId-itemId]: string }
  adjustmentTypeMap: {},

  // Patient Account Notes state
  patientAccountNotes: [],
  patientAccountNotesLoading: false,
  patientAccountNotesError: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    /**
     * Update the manual payment amount for a specific line item in the Add Payment Dialog
     */
    updatePaymentLineItemAmount: (state, action) => {
      const { patientId, invoiceId, procId, amount } = action.payload;
      const cached = state.paymentInvoicesCache[patientId];
      if (Array.isArray(cached)) {
        const invoice = cached.find(
          (inv) => inv.id === invoiceId || inv._id === invoiceId,
        );
        if (invoice && invoice.lineItems) {
          const item = invoice.lineItems.find(
            (i) => i.id === procId || i._id === procId,
          );
          if (item) {
            item.payAmount = amount;
            // Also ensure it is checked if they type an amount > 0
            if (Number(amount) > 0) {
              item.checked = true;
              invoice.checked = true;
            }
          }
        }
      }
    },

    /**
     * Set current invoice
     */
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
      state.selectedInvoiceId =
        action.payload?._id || action.payload?.id || null;
      state.error = null;
    },

    /**
     * Set selected invoice ID
     */
    setSelectedInvoiceId: (state, action) => {
      state.selectedInvoiceId = action.payload;
    },

    /**
     * Update claim status
     * Used for tracking claim processing across modules
     */
    updateClaimStatus: (state, action) => {
      const { claimId, status } = action.payload;
      state.claimStatus[claimId] = status;
    },

    /**
     * Set multiple claim statuses
     * Used when loading claim list
     */
    setClaimStatuses: (state, action) => {
      state.claimStatus = action.payload;
    },

    /**
     * Set payment plans
     */
    setPaymentPlans: (state, action) => {
      state.paymentPlans = action.payload;
    },

    /**
     * Add payment plan
     */
    addPaymentPlan: (state, action) => {
      state.paymentPlans.push(action.payload);
    },

    /**
     * Set A/R aging data
     */
    setArAging: (state, action) => {
      state.arAging = action.payload;
    },

    /**
     * Clear current invoice
     */
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
      state.selectedInvoiceId = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── AddPaymentDialog checkbox reducers ──────────────────────────────────

    /** Toggle an entire payment invoice's checked state (and all its line items with a patient balance). */
    togglePaymentInvoiceChecked: (state, action) => {
      const { patientId, invoiceId } = action.payload;
      const invoices = state.paymentInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      inv.checked = !inv.checked;
      inv.lineItems.forEach((item) => {
        if (!inv.checked) {
          item.checked = false;
        } else if (Number(item.patientBalance) > 0) {
          item.checked = true;
        }
      });
    },

    /** Toggle all payment invoices' checked state for a patient. */
    toggleAllPaymentInvoices: (state, action) => {
      const { patientId, checked } = action.payload;
      const invoices = state.paymentInvoicesCache[patientId];
      if (!invoices) return;
      invoices.forEach((inv) => {
        // Only select invoices that have pt balance > 0
        const hasPatientBalance = inv.lineItems?.some(
          (item) => Number(item.patientBalance) > 0,
        );
        if (hasPatientBalance) {
          inv.checked = checked;
          inv.lineItems.forEach((item) => {
            if (Number(item.patientBalance) > 0) {
              item.checked = checked;
            }
          });
        }
      });
    },

    /** Seed Add Payment invoices from already-rendered ledger rows. */
    setPaymentInvoicesForPatient: (state, action) => {
      const { patientId, invoices } = action.payload;
      if (!patientId) return;
      state.paymentInvoicesCache[patientId] = Array.isArray(invoices)
        ? invoices
        : [];
    },

    /** Toggle a single payment line-item's checked state. */
    togglePaymentLineItemChecked: (state, action) => {
      const { patientId, invoiceId, itemId } = action.payload;
      const invoices = state.paymentInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      const item = inv.lineItems.find((li) => li.id === itemId);
      if (item) item.checked = !item.checked;
      inv.checked =
        inv.lineItems.length > 0 && inv.lineItems.every((li) => li.checked);
    },

    /** Evict cached payment invoices for a patient. */
    invalidatePaymentInvoices: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.paymentInvoicesCache[patientId];
        state.paymentInvoicesFetchingSet =
          state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
      } else {
        state.paymentInvoicesCache = {};
        state.paymentInvoicesFetchingSet = [];
      }
    },

    /** Record the adjustment type applied to a procedure key (invoiceId-itemId). */
    setAdjustmentTypeForItem: (state, action) => {
      const { key, adjustmentType } = action.payload;
      state.adjustmentTypeMap[key] = adjustmentType;
    },

    /** Invalidate (clear) cached ledger for a patient to force re-fetch. */
    invalidateLedger: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.ledgerCache[patientId];
      } else {
        state.ledgerCache = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(fetchBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(fetchBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(saveBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(saveBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(fetchARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(fetchARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(saveARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(saveARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        state.error = action.payload;
      })
      // Adjustment Types
      .addCase(fetchAdjustmentTypes.pending, (state) => {
        state.adjustmentTypesLoading = true;
      })
      .addCase(fetchAdjustmentTypes.fulfilled, (state, action) => {
        state.adjustmentTypesLoading = false;
        state.adjustmentTypes = action.payload;
      })
      .addCase(fetchAdjustmentTypes.rejected, (state, action) => {
        state.adjustmentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdjustmentType.fulfilled, (state, action) => {
        state.adjustmentTypes.push(action.payload);
      })
      .addCase(updateAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex(
          (adj) => adj.id === action.payload.id,
        );
        if (index !== -1) {
          state.adjustmentTypes[index] = action.payload;
        }
      })
      .addCase(deleteAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex(
          (adj) => adj.id === action.payload,
        );
        if (index !== -1) {
          state.adjustmentTypes[index].isHidden = true;
        }
      })
      // Payment Types
      .addCase(fetchPaymentTypes.pending, (state) => {
        state.paymentTypesLoading = true;
      })
      .addCase(fetchPaymentTypes.fulfilled, (state, action) => {
        state.paymentTypesLoading = false;
        state.paymentTypes = action.payload.map((pt) => {
          let cleanNote = pt.note;
          if (typeof cleanNote === "string" && cleanNote.startsWith("{")) {
            try {
              cleanNote = JSON.parse(cleanNote).note || "";
            } catch (e) {}
          }
          return { ...pt, note: cleanNote };
        });
      })
      .addCase(fetchPaymentTypes.rejected, (state, action) => {
        state.paymentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createPaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let cleanNote = pt.note;
        if (typeof cleanNote === "string" && cleanNote.startsWith("{")) {
          try {
            cleanNote = JSON.parse(cleanNote).note || "";
          } catch (e) {}
        }
        state.paymentTypes.push({ ...pt, note: cleanNote });
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let cleanNote = pt.note;
        if (typeof cleanNote === "string" && cleanNote.startsWith("{")) {
          try {
            cleanNote = JSON.parse(cleanNote).note || "";
          } catch (e) {}
        }
        const index = state.paymentTypes.findIndex((p) => p.id === pt.id);
        if (index !== -1) {
          state.paymentTypes[index] = { ...pt, note: cleanNote };
        }
      })
      .addCase(deletePaymentType.fulfilled, (state, action) => {
        const index = state.paymentTypes.findIndex(
          (pt) => pt.id === action.payload,
        );
        if (index !== -1) {
          state.paymentTypes[index].isHidden = true;
        }
      })
      .addCase(fetchPaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
      })
      .addCase(savePaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
      })
      .addCase(fetchPaymentTerminals.pending, (state) => {
        state.paymentTerminalsLoading = true;
      })
      .addCase(fetchPaymentTerminals.fulfilled, (state, action) => {
        state.paymentTerminalsLoading = false;
        // The backend might return an empty object initially
        state.paymentTerminals = {
          openEdge: action.payload?.openEdge || [],
          prosperipay: action.payload?.prosperipay || [],
          payrix: action.payload?.payrix || [],
        };
      })
      .addCase(fetchPaymentTerminals.rejected, (state, action) => {
        state.paymentTerminalsLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(savePaymentTerminals.fulfilled, (state, action) => {
        state.paymentTerminals = {
          openEdge: action.payload?.openEdge || [],
          prosperipay: action.payload?.prosperipay || [],
          payrix: action.payload?.payrix || [],
        };
      })
      .addCase(fetchArAgingReport.pending, (state) => {
        state.arAgingLoading = true;
        state.arAging = null;
      })
      .addCase(fetchArAgingReport.fulfilled, (state, action) => {
        state.arAgingLoading = false;
        state.arAging = action.payload;
      })
      .addCase(fetchArAgingReport.rejected, (state, action) => {
        state.arAgingLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientAgingReport.pending, (state) => {
        state.patientAgingLoading = true;
        state.patientAging = null;
      })
      .addCase(fetchPatientAgingReport.fulfilled, (state, action) => {
        state.patientAgingLoading = false;
        state.patientAging = action.payload;
      })
      .addCase(fetchPatientAgingReport.rejected, (state, action) => {
        state.patientAgingLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchModificationsReport.pending, (state) => {
        state.modificationsLoading = true;
        state.modificationsError = null;
      })
      .addCase(fetchModificationsReport.fulfilled, (state, action) => {
        state.modificationsLoading = false;
        state.modificationsData = action.payload || [];
      })
      .addCase(fetchModificationsReport.rejected, (state, action) => {
        state.modificationsLoading = false;
        state.modificationsError =
          action.payload || "Failed to fetch modifications report";
      })
      .addCase(fetchPatientAccountNotes.pending, (state) => {
        state.patientAccountNotesLoading = true;
        state.patientAccountNotesError = null;
      })
      .addCase(fetchPatientAccountNotes.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotes = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchPatientAccountNotes.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError =
          action.payload || action.error?.message;
      })
      .addCase(createPatientAccountNote.pending, (state) => {
        state.patientAccountNotesLoading = true;
      })
      .addCase(createPatientAccountNote.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        if (Array.isArray(action.payload)) {
          state.patientAccountNotes = action.payload;
        } else if (action.payload && typeof action.payload === "object") {
          const exists = state.patientAccountNotes.some(
            (n) => n.id === action.payload.id || n._id === action.payload._id,
          );
          if (!exists) {
            state.patientAccountNotes = [
              action.payload,
              ...state.patientAccountNotes,
            ];
          }
        }
      })
      .addCase(createPatientAccountNote.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError =
          action.payload || action.error?.message;
      })
      .addCase(updatePatientAccountNote.pending, (state) => {
        state.patientAccountNotesLoading = true;
      })
      .addCase(updatePatientAccountNote.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        if (Array.isArray(action.payload)) {
          state.patientAccountNotes = action.payload;
        } else if (action.payload && typeof action.payload === "object") {
          const noteId = action.payload.id || action.payload._id;
          state.patientAccountNotes = state.patientAccountNotes.map((n) =>
            n.id === noteId || n._id === noteId ? action.payload : n,
          );
        }
      })
      .addCase(updatePatientAccountNote.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError =
          action.payload || action.error?.message;
      })
      // ── Ledger thunks ──────────────────────────────────────────────────────
      .addCase(fetchLedgerItems.pending, (state) => {
        state.ledgerLoading = true;
        state.ledgerError = null;
      })
      .addCase(fetchLedgerItems.fulfilled, (state, action) => {
        state.ledgerLoading = false;
        state.ledgerCache[action.payload.patientId] = action.payload.items;
      })
      .addCase(fetchLedgerItems.rejected, (state, action) => {
        state.ledgerLoading = false;
        state.ledgerError = action.payload;
      })
      .addCase(fetchInvoiceDetails.pending, (state, action) => {
        // Mark this invoice as in-flight so concurrent clicks are ignored
        const invoiceId = action.meta.arg.invoiceId;
        if (!state.detailsFetchingSet.includes(invoiceId)) {
          state.detailsFetchingSet.push(invoiceId);
        }
      })
      .addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
        const { patientId, invoiceId, details, totalPaidAmt } = action.payload;
        // Remove from in-flight set
        state.detailsFetchingSet = state.detailsFetchingSet.filter(
          (id) => id !== invoiceId,
        );
        const items = state.ledgerCache[patientId];
        if (!items) return;
        const idx = items.findIndex((i) => i.id === invoiceId);
        if (idx === -1) return;
        // Preserve existing adjustments that fetchLedgerItems added
        const existingAdjs = (items[idx].details || []).filter(
          (d) => d.isAdjustment,
        );
        items[idx].details = [...existingAdjs, ...details];
        if (totalPaidAmt > 0) {
          items[idx].summary.ptPaid = `$${totalPaidAmt.toFixed(2)}`;
        }
      })
      .addCase(fetchInvoiceDetails.rejected, (state, action) => {
        // Always clear the in-flight marker so a retry is possible
        const invoiceId = action.meta.arg.invoiceId;
        state.detailsFetchingSet = state.detailsFetchingSet.filter(
          (id) => id !== invoiceId,
        );
      })
      // Ledger mutations re-fetch automatically via their thunks — just clear loading
      .addCase(backdateTransaction.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(voidTransaction.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(applyCourtesyCredit.fulfilled, (state, action) => {
        const { procedureId, invoiceId, adjustmentType } = action.payload;
        state.adjustmentTypeMap[`${invoiceId}-${procedureId}`] = adjustmentType;
      })
      .addCase(applyCourtesyCredit.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(undoCourtesyCredit.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      // ── Payment draft invoices ─────────────────────────────────────────────
      .addCase(fetchPaymentDraftInvoices.pending, (state, action) => {
        state.paymentInvoicesLoading = true;
        state.paymentInvoicesError = null;
        const patientId = action.meta.arg;
        if (!state.paymentInvoicesFetchingSet.includes(patientId)) {
          state.paymentInvoicesFetchingSet.push(patientId);
        }
      })
      .addCase(fetchPaymentDraftInvoices.fulfilled, (state, action) => {
        state.paymentInvoicesLoading = false;
        const patientId = action.payload.patientId;
        state.paymentInvoicesFetchingSet =
          state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
        state.paymentInvoicesCache[patientId] = action.payload.invoices;
      })
      .addCase(fetchPaymentDraftInvoices.rejected, (state, action) => {
        state.paymentInvoicesLoading = false;
        const patientId = action.meta.arg;
        state.paymentInvoicesFetchingSet =
          state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
        state.paymentInvoicesError = action.payload;
      });
  },
});

export const {
  setCurrentInvoice,
  setSelectedInvoiceId,
  updateClaimStatus,
  setClaimStatuses,
  setPaymentPlans,
  addPaymentPlan,
  setArAging,
  clearCurrentInvoice,
  setLoading,
  setError,
  togglePaymentInvoiceChecked,
  toggleAllPaymentInvoices,
  togglePaymentLineItemChecked,
  setPaymentInvoicesForPatient,
  invalidatePaymentInvoices,
  setAdjustmentTypeForItem,
  invalidateLedger,
} = billingSlice.actions;

// Selectors
export const selectCurrentInvoice = (state) => state.billing.currentInvoice;
export const selectSelectedInvoiceId = (state) =>
  state.billing.selectedInvoiceId;
export const selectClaimStatus = (state, claimId) =>
  state.billing.claimStatus[claimId];
export const selectAllClaimStatuses = (state) => state.billing.claimStatus;
export const selectPaymentPlans = (state) => state.billing.paymentPlans;
export const selectArAging = (state) => state.billing.arAging;
export const selectBillingConfiguration = (state) =>
  state.billing.billingConfiguration;
export const selectBillingConfigLoading = (state) =>
  state.billing.billingConfigLoading;
export const selectARAutomationConfig = (state) =>
  state.billing.arAutomationConfig;
export const selectARAutomationLoading = (state) =>
  state.billing.arAutomationLoading;
export const selectAdjustmentTypes = (state) => state.billing.adjustmentTypes;
export const selectAdjustmentTypesLoading = (state) =>
  state.billing.adjustmentTypesLoading;
export const selectPaymentTypes = (state) => state.billing.paymentTypes;
export const selectPaymentTypesLoading = (state) =>
  state.billing.paymentTypesLoading;
export const selectPaymentTypeDefaults = (state) =>
  state.billing.paymentTypeDefaults;
export const selectPaymentTerminals = (state) => state.billing.paymentTerminals;
export const selectPaymentTerminalsLoading = (state) =>
  state.billing.paymentTerminalsLoading;
export const selectArAgingLoading = (state) => state.billing.arAgingLoading;
export const selectPatientAging = (state) => state.billing.patientAging;
export const selectPatientAgingLoading = (state) =>
  state.billing.patientAgingLoading;
export const selectPatientAccountNotes = (state) =>
  state.billing.patientAccountNotes;
export const selectPatientAccountNotesLoading = (state) =>
  state.billing.patientAccountNotesLoading;
export const selectPatientAccountNotesError = (state) =>
  state.billing.patientAccountNotesError;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectBillingError = (state) => state.billing.error;

// Ledger selectors
export const selectLedgerLoading = (state) => state.billing.ledgerLoading;
export const selectLedgerError = (state) => state.billing.ledgerError;
export const selectAdjustmentTypeMap = (state) =>
  state.billing.adjustmentTypeMap;
/** Returns cached ledger items for the given patient (or empty array). */
export const selectLedgerItemsForPatient = (patientId) => (state) =>
  state.billing.ledgerCache?.[patientId] || EMPTY_ARRAY;

// Payment invoice selectors
export const selectPaymentInvoicesLoading = (state) =>
  state.billing.paymentInvoicesLoading;
export const selectPaymentInvoicesError = (state) =>
  state.billing.paymentInvoicesError;
/** Returns cached payment draft invoices for the given patient (or empty array). */
export const selectPaymentInvoicesForPatient = (patientId) => (state) =>
  state.billing.paymentInvoicesCache?.[patientId] || EMPTY_ARRAY;

export const selectModificationsData = (state) =>
  state.billing.modificationsData;
export const selectModificationsLoading = (state) =>
  state.billing.modificationsLoading;
export const selectModificationsError = (state) =>
  state.billing.modificationsError;

export default billingSlice.reducer;
