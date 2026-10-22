import { useMemo, useState, useEffect } from "react";
import { usePatient } from "../../hooks/redux/usePatient";
import { paymentService } from "../../services/payment.service";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import { COLORS } from "../../constants/colors";
import { radius, fontWeight } from "../../constants/styles";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const parseAmount = (value) =>
  Number(String(value ?? "").replace(/[^0-9.-]+/g, "")) || 0;

const procedureId = (proc = {}) =>
  String(proc.id || proc._id || proc.ProcNum || proc.procedureId || proc.procId || proc.itemId || "");

// De-duplicated on purpose. `id` and `_id` hold the same string for an invoice
// line, and code/cptCode/ProcCode often repeat too. Feeding the raw list into
// paidMap.set(... + paid) credited every insurance payment twice, which is
// what produced a $224 "paid" figure against a $112 payment.
const procedureAliases = (proc = {}) =>
  [
    proc.id,
    proc._id,
    proc.ProcNum,
    proc.procedureId,
    proc.procId,
    proc.itemId,
    proc.code ? `code:${proc.code}` : null,
    proc.cptCode ? `code:${proc.cptCode}` : null,
    proc.ProcCode ? `code:${proc.ProcCode}` : null,
  ]
    .filter(Boolean)
    .map(String)
    .filter((alias, idx, all) => all.indexOf(alias) === idx);

const InsuranceWriteOffDialog = ({ onClose, editTarget }) => {
  const { currentPatient } = usePatient();
  const reduxPatientId = currentPatient?._id || currentPatient?.id || currentPatient?.PatNum || '';

  const invoiceNumber = editTarget?.invoiceNumber || editTarget?.id || "N/A";
  const invoiceId = editTarget?.id || editTarget?._id || "";
  const invoiceDate = editTarget?.rawDate || editTarget?.invoiceDate || editTarget?.date;
  const patientName =
    typeof editTarget?.patient === "string"
      ? editTarget.patient
      : editTarget?.patient?.name || editTarget?.patientName || "";

  const claims = useMemo(
    () =>
      (editTarget?.details || []).filter((detail) => {
        if (!detail?.isClaim) return false;
        const status = String(detail.status || "").toLowerCase();
        return !detail.isVoided && status !== "void" && status !== "voided";
      }),
    [editTarget],
  );

  const [selectedClaimId, setSelectedClaimId] = useState(claims[0]?.id || "");
  const selectedClaim =
    claims.find((claim) => String(claim.id) === String(selectedClaimId)) ||
    claims[0] ||
    null;

  const invoiceProcedures = useMemo(
    () =>
      editTarget?.lineItems ||
      editTarget?.procedures ||
      editTarget?.details?.find((detail) => detail.isGrouped)?.procedures ||
      [],
    [editTarget],
  );
  const summaryPtBalance = parseAmount(editTarget?.summary?.ptBal);
  const summaryInsBalance = parseAmount(editTarget?.summary?.insBal);
  const summaryAppliedWriteOff = parseAmount(editTarget?.summary?.appliedWo);
  const summaryInsWriteOff = parseAmount(editTarget?.summary?.insWo);
  const summaryInsPaid = parseAmount(editTarget?.summary?.insPaid);
  const invoiceChargeTotal = invoiceProcedures.reduce(
    (sum, proc) =>
      sum +
      parseAmount(
        proc.fee ||
          proc.totalPrice ||
          proc.total ||
          proc.charge ||
          proc.ProcFee ||
          proc.amount,
      ),
    0,
  );
  const hasLedgerSummary = Boolean(editTarget?.summary);
  // Grouped ledger rows are already restated (debit adjustments folded in) and
  // carry `fee`; when that is the case their per-line portions are authoritative
  // and the invoice summary must not be pro-rated back onto them.
  const proceduresRestated = invoiceProcedures.some(
    (proc) => proc.fee !== undefined && proc.fee !== null,
  );
  const paymentByProcedure = useMemo(() => {
    const paidMap = new Map();
    (editTarget?.details || []).forEach((detail) => {
      if (!detail?.isPayment || detail.isAdjustment || detail.isVoided) return;
      const isInsurancePayment =
        detail.isInsurancePayment ||
        String(detail.title || "").toLowerCase().includes("ins payment") ||
        String(detail.paymentSource || "").toLowerCase() === "insurance_company" ||
        String(detail.method || "").toLowerCase() === "insurance";
      if (!isInsurancePayment) return;
      (detail.procedures || []).forEach((proc) => {
        const aliases = procedureAliases(proc);
        if (aliases.length === 0) return;
        const paid =
          parseAmount(proc.appliedPayment) ||
          parseAmount(proc.paymentAmount) ||
          parseAmount(proc.payAmount) ||
          parseAmount(proc.insurancePaidAmount) ||
          parseAmount(proc.insurancePaid) ||
          parseAmount(proc.insPaid) ||
          0;
        if (paid > 0) {
          aliases.forEach((alias) => {
            paidMap.set(alias, (paidMap.get(alias) || 0) + paid);
          });
        }
      });
    });
    return paidMap;
  }, [editTarget]);

  const rows = useMemo(() => {
    if (!selectedClaim) return [];
    const baseRows = (selectedClaim.procedures || []).map((claimProc) => {
      const match =
        invoiceProcedures.find(
          (proc) =>
            procedureId(proc) && procedureId(proc) === procedureId(claimProc),
        ) ||
        invoiceProcedures.find(
          (proc) =>
            (proc.code || proc.cptCode || proc.ProcCode) &&
            (proc.code || proc.cptCode || proc.ProcCode) ===
              (claimProc.code || claimProc.cptCode || claimProc.ProcCode),
        ) ||
        {};

      const proc = { ...claimProc, ...match };
      const key = procedureId(proc);
      const restatedMatch = match.fee !== undefined && match.fee !== null;
      const charge = parseAmount(
        proc.fee ||
          proc.totalPrice ||
          proc.total ||
          proc.charge ||
          proc.ProcFee ||
          proc.amount,
      );
      const weight = invoiceChargeTotal > 0 ? charge / invoiceChargeTotal : 0;
      // Insurance write-off only. `appliedAdjustment` is deliberately NOT in
      // this chain: that field carries patient credits (courtesy, un-collected,
      // small balance). Reading it here mislabelled a $28 Un-Collected credit
      // as an insurance write-off, and the recomputation below then deducted
      // it from the patient a second time.
      const rawAppliedWriteOff = parseAmount(
        proc.appliedWriteOff || proc.writeoff || proc.estimatedWriteOff,
      );
      const appliedWriteOff =
        rawAppliedWriteOff > 0
          ? rawAppliedWriteOff
          : hasLedgerSummary
            ? summaryAppliedWriteOff * weight
            : 0;
      
      const insPaid = parseAmount(claimProc.insPayAmt || claimProc.insPaid);
      const insEst = parseAmount(
        claimProc.insPortion || claimProc.primaryInsPortion || claimProc.insPayEst
      );
      const matchInsuranceBalance = parseAmount(
        match.insuranceBalance ?? match.insBalance ?? match.insPortion ?? match.insuranceAmount,
      );
      const claimInsuranceBalance = parseAmount(
        claimProc.insuranceBalance ?? claimProc.insBalance ?? claimProc.insPortion,
      );
      const matchPatientBalance = parseAmount(
        match.patientBalance ?? match.ptBalance ?? match.ptPortion ?? match.patientPortion,
      );
      const claimPatientBalance = parseAmount(
        claimProc.patientBalance ?? claimProc.ptBalance ?? claimProc.ptPortion ?? claimProc.patientPortion,
      );
      // What insurance actually paid on THIS line. Taking the invoice total
      // and scaling it by charge weight handed a claimed $150 line only 84 of
      // its own $112 payment (112 * 150/200), which then left a phantom $18
      // insurance balance and inflated the patient balance to $38. Prefer the
      // per-procedure figures; the summary split is only a last resort.
      const ownPaid = Math.max(
        parseAmount(match.insurancePaidAmount),
        parseAmount(match.insurancePaid),
        parseAmount(match.insPaid),
        parseAmount(insPaid),
        0,
        ...procedureAliases(proc).map((alias) => paymentByProcedure.get(alias) || 0),
      );
      const procedurePaid =
        ownPaid > 0
          ? ownPaid
          : hasLedgerSummary && summaryInsPaid > 0
            ? summaryInsPaid * weight
            : 0;

      let insuranceBalance;
      let patientBalance;
      if (restatedMatch) {
        // A restated row is already final: insPortion is the portion before
        // payment, and ptPortion is what the patient still owes AFTER every
        // credit and write-off. Rebuilding them as charge − paid − writeoff
        // double-counted credits that are already inside ptPortion and left a
        // phantom patient balance ($10 on a line whose real balance was $0).
        insuranceBalance = Math.max(
          0,
          parseAmount(match.insPortion) - procedurePaid,
        );
        patientBalance = Math.max(0, parseAmount(match.ptPortion));
      } else {
        insuranceBalance =
          matchInsuranceBalance > 0
            ? matchInsuranceBalance
            : hasLedgerSummary && summaryInsBalance > 0
              ? summaryInsBalance * weight
              : Math.max(0, claimInsuranceBalance || insEst - insPaid);
        patientBalance =
          matchPatientBalance > 0
            ? matchPatientBalance
            : Math.max(
                0,
                (claimPatientBalance ||
                  (hasLedgerSummary ? summaryPtBalance * weight : 0)) -
                  procedurePaid,
              );

        if (procedurePaid > 0 || appliedWriteOff > 0) {
          insuranceBalance = Math.max(
            0,
            insuranceBalance - procedurePaid - appliedWriteOff,
          );
          patientBalance = Math.max(
            0,
            charge - appliedWriteOff - procedurePaid - insuranceBalance,
          );
        }

        // After determining patient balance from adjusted data, if insurance balance is still using fallback,
        // recalculate it to ensure patient + insurance + writeoff = charge
        if (matchInsuranceBalance <= 0 && matchPatientBalance > 0) {
          insuranceBalance = Math.max(
            0,
            charge - appliedWriteOff - procedurePaid - patientBalance,
          );
        }
      }
      const totalBalance = Math.max(0, patientBalance + insuranceBalance);

      const expectedWriteOff = parseAmount(proc.writeOffEst || proc.writeoffEstimate);
      const defaultWriteOff = summaryInsWriteOff > 0
        ? Math.max(0, summaryInsWriteOff * weight)
        : insuranceBalance <= 0.005
          ? 0
        : Math.max(
            0,
            expectedWriteOff > 0
              ? expectedWriteOff - appliedWriteOff
              : charge - totalBalance - appliedWriteOff,
          );

      return {
        id: key,
        code: proc.code || proc.cptCode || proc.ProcCode || "-",
        description: proc.description || proc.treatment || "",
        provider: proc.provider || proc.providerName || editTarget?.initials || "Staff",
        charge,
        patientBalance,
        insuranceBalance,
        totalBalance,
        appliedWriteOff,
        defaultWriteOff,
        procedurePaid,
        expectedWriteOff: hasLedgerSummary
          ? defaultWriteOff + appliedWriteOff
          : expectedWriteOff > 0 ? expectedWriteOff : defaultWriteOff + appliedWriteOff,
      };
    });

    const basePatientTotal = baseRows.reduce(
      (sum, row) => sum + row.patientBalance,
      0,
    );
    if (!proceduresRestated && hasLedgerSummary && summaryPtBalance > 0) {
      const missingPatient = Math.max(0, summaryPtBalance - basePatientTotal);
      if (missingPatient > 0.01) {
        let remaining = missingPatient;
        return baseRows.map((row) => {
          const capacity = Math.max(
            0,
            row.charge -
              row.appliedWriteOff -
              row.defaultWriteOff -
              row.procedurePaid -
              row.patientBalance,
          );
          const addPatient = Math.min(capacity, remaining);
          remaining = Math.max(0, remaining - addPatient);
          const patientBalance = row.patientBalance + addPatient;
          const insuranceBalance = Math.max(0, row.insuranceBalance - addPatient);
          return {
            ...row,
            patientBalance,
            insuranceBalance,
            totalBalance: patientBalance + insuranceBalance,
          };
        });
      }
    }

    return baseRows;
  }, [
    selectedClaim,
    invoiceProcedures,
    editTarget,
    invoiceChargeTotal,
    proceduresRestated,
    hasLedgerSummary,
    summaryAppliedWriteOff,
    summaryInsBalance,
    summaryInsWriteOff,
    summaryInsPaid,
    summaryPtBalance,
    paymentByProcedure,
  ]);

  const totals = rows.reduce(
    (sum, row) => ({
      charge: sum.charge + row.charge,
      patient: sum.patient + row.patientBalance,
      insurance: sum.insurance + row.insuranceBalance,
      total: sum.total + row.totalBalance,
      applied: sum.applied + row.appliedWriteOff,
      writeOff: sum.writeOff + row.defaultWriteOff,
    }),
    { charge: 0, patient: 0, insurance: 0, total: 0, applied: 0, writeOff: 0 },
  );

  const [writeOffInputs, setWriteOffInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [showOverpaymentAlert, setShowOverpaymentAlert] = useState(false);
  const [overpaymentData, setOverpaymentData] = useState({ amount: 0, procs: [] });

  useEffect(() => {
    const initialInputs = {};
    rows.forEach(row => {
      initialInputs[row.id] = row.defaultWriteOff.toFixed(2);
    });
    setWriteOffInputs(initialInputs);
  }, [rows]);

  const handleAdjustClick = () => {
    if (!selectedClaim || isAdjusting) return;
    
    setIsAdjusting(true);
    
    let overpaymentAmount = 0;
    let patientAdjustAmount = 0;
    const procs = rows.map(row => {
      const adjustedWO = parseAmount(writeOffInputs[row.id] !== undefined ? writeOffInputs[row.id] : row.defaultWriteOff);
      const excess = row.insuranceBalance <= 0.005 ? Math.max(0, adjustedWO) : 0;
      const patientAdjust = Math.min(excess, Math.max(0, row.patientBalance));
      overpaymentAmount += excess;
      patientAdjustAmount += patientAdjust;
      
      return {
        id: row.id,
        code: row.code,
        excess,
        patientBalance: row.patientBalance,
        patientAdjust,
        creditAmount: Math.max(0, excess - patientAdjust),
      };
    });

    if (overpaymentAmount > 0.005) {
      setOverpaymentData({
        amount: overpaymentAmount,
        patientAdjustAmount,
        creditAmount: Math.max(0, overpaymentAmount - patientAdjustAmount),
        procs: procs.filter(p => p.excess > 0.005),
      });
      setShowOverpaymentAlert(true);
      setIsAdjusting(false);
    } else {
      handleProceedAdjust();
    }
  };

  const handleProceedAdjust = async () => {
    if (!selectedClaim) return;
    setIsSubmitting(true);
    setIsAdjusting(true);
    let overpaymentAmount = 0;
    const procs = rows.map(row => {
      const adjustedWO = parseAmount(writeOffInputs[row.id] !== undefined ? writeOffInputs[row.id] : row.defaultWriteOff);
      const finalWriteOff = row.insuranceBalance <= 0.005
        ? row.appliedWriteOff + adjustedWO
        : adjustedWO;
      const excess = row.insuranceBalance <= 0.005 ? Math.max(0, adjustedWO) : 0;
      overpaymentAmount += excess;

      return {
        id: row.id,
        wo: finalWriteOff,
        pay: 0,
        allowed: 0,
        ded: 0,
        excess,
        claimId: selectedClaim.id
      };
    });

    try {
      const patientIdMatch = window.location.pathname.match(/\/patients\/([^/]+)/);
      const urlPatientId = patientIdMatch ? patientIdMatch[1] : '';
      const pId = (editTarget?.patientId || editTarget?.PatNum || editTarget?.patient?._id || editTarget?.patient?.id || urlPatientId || reduxPatientId || '').toString();

      const paymentData = {
        patientId: pId,
        invoiceId: invoiceId.toString(),
        amount: 0,
        paymentMethod: 'insurance',
        paymentSource: 'insurance_company',
        paymentDate: new Date().toISOString(),
        suppressLedgerPaymentEntry: true,
        claimId: selectedClaim.id,
        previousClaimStatus: selectedClaim.status,
        overpaymentAmount: overpaymentAmount > 0.005 ? overpaymentAmount : undefined,
        overpaymentAction: overpaymentAmount > 0.005 ? 'credit' : undefined,
        procedures: procs
      };

      await paymentService.createPayment(paymentData);
      
      const eventPayload = { patientId: pId, amount: 0 };
      window.dispatchEvent(new CustomEvent('payment-completed', { detail: eventPayload }));
      window.dispatchEvent(new CustomEvent('appointment-financials-updated', { detail: eventPayload }));
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
      try {
        const bc = new BroadcastChannel('medflow-payments');
        bc.postMessage(eventPayload);
        bc.close();
      } catch {
        // ignore
      }
      
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adjusting write-off:", err);
      alert("Failed to adjust write-off: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
      setIsAdjusting(false);
    }
  };

  const claimLabel = (claim) => {
    const amount = parseAmount(claim.claimAmount || claim.amount);
    return `${claim.title || claim.claimNumber || claim.id}${amount > 0 ? ` - ${money(amount)}` : ""}`;
  };

  return (
    <Box sx={{ width: "100%", bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: "hidden" }}>
      <DialogTitle
        sx={{
          boxSizing: "border-box",
          px: "24px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: "bold", color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Insurance Write-Off invoice #{invoiceNumber}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: "24px", py: "24px", pt: "24px !important" }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: "13px" }}>
            {dayjs().format("MM/DD/YYYY")}
          </Typography>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "13px" }}>claim:</Typography>
          <Select
            variant="outlined"
            value={selectedClaim?.id || ""}
            onChange={(event) => setSelectedClaimId(event.target.value)}
            size="small"
            displayEmpty
            sx={{
              minWidth: 360,
              height: "36px",
              borderRadius: radius.sm,
              fontSize: "13px",
              bgcolor: COLORS.SURFACE_TINT,
              ".MuiOutlinedInput-notchedOutline": { borderColor: COLORS.BORDER },
            }}
            MenuProps={{
              sx: { zIndex: 150000 },
              PaperProps: {
                sx: {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  borderRadius: radius.sm,
                  mt: 0.5,
                  "& .MuiMenuItem-root": {
                    fontSize: "13px",
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: fontWeight.medium,
                    py: 1,
                  },
                },
              },
            }}
          >
            {claims.length === 0 ? (
              <MenuItem value="" sx={{ fontSize: "13px" }}>
                No claims for this invoice
              </MenuItem>
            ) : (
              claims.map((claim) => (
                <MenuItem key={claim.id} value={claim.id} sx={{ fontSize: "13px" }}>
                  {claimLabel(claim)}
                </MenuItem>
              ))
            )}
          </Select>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: "13px" }}>
            for invoice: #{invoiceNumber}
          </Typography>
        </Stack>

        <Divider sx={{ mt: 3, mb: 1, borderColor: COLORS.BORDER_LIGHT }} />

        {selectedClaim && (
          <Box sx={{ minWidth: 1120 }}>
            <Box sx={{ display: "flex", alignItems: "center", py: 1, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
              <Box sx={{ width: 420 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                  Invoice {invoiceNumber} : {invoiceDate ? dayjs(invoiceDate).format("MM/DD/YYYY") : "N/A"} for {patientName}
                </Typography>
              </Box>
              {[
                ["Procedure Charge", totals.charge],
                ["Patient Balance", totals.patient],
                ["Insurance Balance", totals.insurance],
                ["Total Balance", totals.total],
                ["Applied Write-Off", totals.applied],
                ["$ Insurance Write-Off", totals.writeOff],
              ].map(([label, value]) => (
                <Box key={label} sx={{ width: 130, textAlign: "right" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: label === "$ Insurance Write-Off" ? COLORS.ACCENT : COLORS.TEXT_PRIMARY }}>
                    {label}: {money(value)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {rows.map((row) => (
              <Box key={`${row.id}-${row.code}`} sx={{ display: "flex", alignItems: "center", py: 1 }}>
                <Box sx={{ width: 420, display: "flex", gap: 1.5 }}>
                  <Typography sx={{ width: 58, fontSize: "12px", color: COLORS.TEXT_PRIMARY }}>{row.code}</Typography>
                  <Typography sx={{ flex: 1, fontSize: "12px", color: COLORS.TEXT_PRIMARY }}>{row.description}</Typography>
                  <Typography sx={{ width: 110, fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>{row.provider}</Typography>
                </Box>
                {[row.charge, row.patientBalance, row.insuranceBalance, row.totalBalance, row.appliedWriteOff].map((value, index) => (
                  <Box key={index} sx={{ width: 130, textAlign: "right" }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>{money(value)}</Typography>
                  </Box>
                ))}
                <Box sx={{ width: 130, display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{ border: '1px dashed #ccc', px: 1, py: 0.25, display: 'inline-flex', alignItems: 'center', borderRadius: '4px', width: '88px' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25, color: COLORS.ACCENT }}>$</Typography>
                    <TextField
                      value={writeOffInputs[row.id] !== undefined ? writeOffInputs[row.id] : row.defaultWriteOff.toFixed(2)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWriteOffInputs(prev => ({ ...prev, [row.id]: val }));
                      }}
                      onBlur={(e) => {
                         const num = parseAmount(e.target.value);
                         setWriteOffInputs(prev => ({ ...prev, [row.id]: num.toFixed(2) }));
                      }}
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": { 
                          height: 30, 
                          fontSize: "12px", 
                          border: 'none', 
                          bgcolor: 'transparent',
                          background: 'transparent',
                          px: 0,
                        },
                        "& .MuiOutlinedInput-root": {
                          border: 'none',
                          background: 'transparent',
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: 'none',
                        },
                        "& input": { 
                          textAlign: "right", 
                          fontWeight: 700, 
                          color: COLORS.ACCENT, 
                          padding: 0, 
                          width: '55px',
                          background: 'transparent',
                        },
                      }}
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          root: 'transparent-input',
                          notchedOutline: 'transparent-input',
                        },
                      }}
                      variant="standard"
                    />
                  </Box>
                </Box>
              </Box>
            ))}

            <Typography sx={{ mt: 2, fontSize: "13px", color: COLORS.ACCENT, cursor: "pointer", fontWeight: fontWeight.medium }}>
              + Add description
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: "16px 24px", borderTop: `1px solid ${COLORS.BORDER}` }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            disabled={!selectedClaim || isSubmitting || isAdjusting}
            onClick={handleAdjustClick}
            sx={{
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              height: "36px",
              px: 3,
              borderRadius: radius.sm,
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: "none" },
            }}
          >
            {isSubmitting || isAdjusting ? 'Adjusting...' : 'Adjust'}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              height: "36px",
              px: 3,
              borderRadius: radius.sm,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, bgcolor: "transparent" },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogActions>

      {/* Overpayment Alert Dialog */}
      <Dialog
        open={showOverpaymentAlert}
        onClose={() => setShowOverpaymentAlert(false)}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 150000, '& .MuiDialog-paper': { maxWidth: '560px', borderRadius: '14px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <InfoOutlinedIcon sx={{ color: COLORS.ACCENT, fontSize: '22px', flexShrink: 0 }} />
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Over-Write-Off Detected
          </Typography>
          <IconButton onClick={() => setShowOverpaymentAlert(false)} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: '24px !important', px: '25px', pb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 2, lineHeight: 1.6 }}>
            {overpaymentData.patientAdjustAmount > 0.005 && overpaymentData.creditAmount <= 0.005
              ? "The write-off exceeds the remaining insurance portion, but this procedure still has patient balance available. The excess will reduce the patient portion."
              : overpaymentData.patientAdjustAmount > 0.005
                ? "The write-off exceeds the remaining insurance portion. The available patient balance will be adjusted first, and only the remaining excess will be saved as Patient Credit."
                : "The following procedures have write-off amounts that exceed the remaining insurance portion. Since no patient balance is available on those procedures, the excess will be saved as Patient Credit."}
          </Typography>
          <Box sx={{ bgcolor: '#f0f7ff', border: '1px solid #b8d5f8', borderRadius: '8px', px: 2, py: 1.5, mb: 1 }}>
            {overpaymentData.procs.map((proc, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 500 }}>
                  {proc.code}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#1976d2', fontWeight: 700 }}>
                    over by ${proc.excess.toFixed(2)}
                  </Typography>
                  {proc.patientAdjust > 0.005 && (
                    <Typography sx={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>
                      adjusts patient ${proc.patientAdjust.toFixed(2)}
                    </Typography>
                  )}
                  {proc.creditAmount > 0.005 && (
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      credit ${proc.creditAmount.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            <Box sx={{ borderTop: '1px solid #b8d5f8', mt: 1, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>Total Excess</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1976d2' }}>${overpaymentData.amount.toFixed(2)}</Typography>
            </Box>
            {overpaymentData.patientAdjustAmount > 0.005 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a' }}>Adjust Patient Portion</Typography>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1976d2' }}>${overpaymentData.patientAdjustAmount.toFixed(2)}</Typography>
              </Box>
            )}
            {overpaymentData.creditAmount > 0.005 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Save as Patient Credit</Typography>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>${overpaymentData.creditAmount.toFixed(2)}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              setShowOverpaymentAlert(false);
              handleProceedAdjust();
            }}
            variant="contained"
            sx={{
              bgcolor: COLORS.ACCENT,
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              px: 2,
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            {overpaymentData.patientAdjustAmount > 0.005 && overpaymentData.creditAmount <= 0.005
              ? "Adjust patient portion"
              : overpaymentData.patientAdjustAmount > 0.005
                ? "Adjust patient portion and save remaining as credit"
                : "Continue and save excess as credit"}
          </Button>
          <Button
            onClick={() => setShowOverpaymentAlert(false)}
            variant="outlined"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsuranceWriteOffDialog;
