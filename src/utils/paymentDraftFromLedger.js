/**
 * Build the Add Payment dialog's draft invoice rows from the patient ledger.
 *
 * The ledger (`fetchLedgerItems` → `toLedgerPaymentInvoices`) is the single
 * source of truth for what a procedure still owes the patient. The ledger's
 * grouped detail is reconciled so its per-procedure patient portion sums to the
 * invoice's post-payment `ptBal`, so those rows already carry the remaining
 * balance and must not have payment records subtracted from them again.
 *
 * Kept free of JSX/React so the arithmetic can be exercised directly.
 */

const moneyNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const roundMoney = (value) => Number(Math.max(0, moneyNumber(value)).toFixed(2));

const procedureKey = (proc = {}) => {
  const key =
    proc.id ||
    proc._id ||
    proc.ProcNum ||
    proc.procedureId ||
    proc.itemId ||
    proc.procId;
  return key ? String(key) : "";
};

export const toLedgerPaymentInvoices = (ledgerItems = []) => {
  return ledgerItems
    .filter((item) => item?.method === "Invoice" && !item.isVoided)
    .map((item) => {
      const patientBalance = moneyNumber(item.summary?.ptBal);
      if (!(patientBalance > 0)) return null;
      const invoiceInsuranceBalance = moneyNumber(item.summary?.insBal);

      const grouped = (item.details || []).find(
        (detail) => detail.isGrouped && Array.isArray(detail.procedures),
      );
      const procedures = grouped?.procedures || [];
      const liveClaims = (item.details || []).filter((detail) => {
        if (!detail.isClaim || detail.isVoided) return false;
        const status = String(detail.status || "").toLowerCase();
        return status !== "void" && status !== "voided";
      });

      const paidByProcedure = new Map();
      (item.details || []).forEach((detail) => {
        if (!detail.isPayment || detail.isAdjustment || detail.isVoided) return;
        if (detail.isInsurancePayment) return;
        (detail.procedures || []).forEach((proc) => {
          const key = procedureKey(proc);
          if (!key) return;
          const paid = Math.max(
            moneyNumber(proc.appliedPayment),
            moneyNumber(proc.paymentAmount),
            moneyNumber(proc.paidAmount),
            moneyNumber(proc.payAmount),
          );
          if (paid > 0) {
            paidByProcedure.set(key, (paidByProcedure.get(key) || 0) + paid);
          }
        });
      });

      const claimProcedures = liveClaims.flatMap((claim) =>
        (claim.procedures || []).map((proc) => ({ ...proc, __fromClaim: true })),
      );
      const claimedProcedureIds = new Set(
        claimProcedures.map(procedureKey).filter(Boolean),
      );
      // Procedures taken from the ledger's grouped detail are already restated
      // past every live adjustment AND reconciled so their patient portion sums
      // to the invoice's net patient balance (billingSlice reconciles them to
      // `ptBal`, which is computed after payments). Their patient portion is
      // therefore the remaining balance, not the gross charge, so the payment
      // records must not be subtracted from them a second time.
      const invoiceProcedures = procedures
        .filter((proc) => !claimedProcedureIds.has(procedureKey(proc)))
        .map((proc) => ({ ...proc, __fromInvoice: true, __ledgerNet: true }));
      const patientProcedures =
        invoiceInsuranceBalance <= 0.01 && procedures.length > 0
          ? procedures.map((proc) => ({ ...proc, __fromLedger: true, __ledgerNet: true }))
          : claimProcedures.length > 0 || invoiceProcedures.length > 0
            ? [...claimProcedures, ...invoiceProcedures]
            : [{ ...item, __ledgerNet: true }];

      let lineItems = patientProcedures
        .map((proc, index) => {
          const key = procedureKey(proc);
          const totalAmount = moneyNumber(
            proc.fee ||
              proc.totalPrice ||
              proc.total ||
              proc.ProcFee ||
              proc.charge ||
              proc.amount ||
              item.amount,
          );
          const insuranceAmount = moneyNumber(
            invoiceInsuranceBalance <= 0.01
              ? 0
              : proc.insuranceAmount ??
                  proc.insPortion ??
                  proc.totalInsPortion ??
                  proc.primaryInsPortion ??
                  proc.insPayEst ??
                  0,
          );
          const writeoffAmount = moneyNumber(
            proc.writeoffAmount ??
              proc.writeOffAmount ??
              proc.estimatedWriteOff ??
              proc.writeoff ??
              0,
          );
          let procPatientBalance =
            moneyNumber(proc.patientBalance) ||
            moneyNumber(proc.ptPortion) ||
            moneyNumber(proc.patientPortion) ||
            moneyNumber(proc.patientAmount);
          if (
            proc.__fromClaim &&
            totalAmount > 0 &&
            insuranceAmount > 0 &&
            procPatientBalance + insuranceAmount + writeoffAmount > totalAmount
          ) {
            procPatientBalance = Math.max(
              0,
              totalAmount - insuranceAmount - writeoffAmount,
            );
          }
          // Ledger-sourced rows (`__ledgerNet`) already carry their remaining
          // patient balance — the grouped detail is reconciled against the
          // invoice's post-payment `ptBal` — so subtracting the payment records
          // again would take the money off twice (a $1 payment turned a $45
          // charge into $43 instead of $44). Claim-sourced rows are not
          // reconciled, so only they still subtract what has been paid:
          //
          // The stored `patientPaidAmount` is not reliable on its own — one
          // procedure carried 124 there while holding an un-adjudicated 124
          // insurance estimate and no patient payment at all, which zeroed a
          // $25 balance the invoice's own patientPortion (182) still counted.
          const paidAmount = paidByProcedure.get(key) || 0;
          const remainingPatient = proc.__ledgerNet
            ? roundMoney(procPatientBalance)
            : roundMoney(procPatientBalance - paidAmount);
          return {
            ...proc,
            id: key || `${item.id}-${index}`,
            checked: false,
            payAmount: remainingPatient.toFixed(2),
            patientBalance: remainingPatient,
            totalAmount,
            writeoffAmount,
            adjustmentAmount: 0,
            insuranceAmount,
          };
        })
        .filter((proc) => proc.patientBalance > 0);

      if (lineItems.length === 0) return null;
      // No reconciliation against `item.summary.ptBal`. These rows come from the
      // ledger's own restated per-procedure balances, so they are the truth.
      // Forcing them to add up to the invoice header was inventing money: on an
      // invoice whose lines owed $157 but whose header still said $182, the
      // mismatch was "corrected" by handing the whole $182 to the one surviving
      // line. The header disagrees because that procedure was already settled
      // (its patientPaidAmount covers its portion) while the invoice-level
      // total still counts it.

      return {
        id: item.id,
        invoiceNumber: item.invoiceNumber || item.id,
        invoiceDate: item.rawDate || item.date,
        checked: false,
        patientBalance,
        totalBalance: moneyNumber(item.amount || item.totalAmount),
        insuranceBalance: invoiceInsuranceBalance,
        insWriteoffAmount: moneyNumber(item.summary?.insWo),
        adjustmentAmount: moneyNumber(item.summary?.appliedWo),
        lineItems,
      };
    })
    .filter(Boolean);
};

export default toLedgerPaymentInvoices;
