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

  const invoiceProcedures =
    editTarget?.lineItems ||
    editTarget?.procedures ||
    editTarget?.details?.find((detail) => detail.isGrouped)?.procedures ||
    [];

  const rows = useMemo(() => {
    if (!selectedClaim) return [];
    return (selectedClaim.procedures || []).map((claimProc) => {
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

      const proc = { ...match, ...claimProc };
      const charge = parseAmount(
        proc.totalPrice || proc.total || proc.charge || proc.ProcFee || proc.amount,
      );
      const appliedWriteOff = parseAmount(proc.writeoff || proc.estimatedWriteOff);
      
      const insPaid = parseAmount(proc.insPayAmt || proc.insPaid || proc.paidAmount);
      const insEst = parseAmount(
        proc.insPortion || proc.primaryInsPortion || proc.insPayEst
      );
      // If proc.insuranceBalance is explicitly provided use it, else calculate remaining from est - paid
      const insuranceBalance = proc.insuranceBalance !== undefined && proc.insuranceBalance !== null 
        ? parseAmount(proc.insuranceBalance)
        : Math.max(0, insEst - insPaid);

      const patientBalance = parseAmount(
        proc.patientBalance || proc.ptBalance || proc.ptPortion || proc.patientPortion,
      );
      const totalBalance = Math.max(0, patientBalance + insuranceBalance);

      const expectedWriteOff = parseAmount(proc.writeOffEst || proc.writeoffEstimate);
      const defaultWriteOff = Math.max(
        0,
        expectedWriteOff > 0
          ? expectedWriteOff - appliedWriteOff
          : charge - totalBalance - appliedWriteOff,
      );

      return {
        id: procedureId(proc),
        code: proc.code || proc.cptCode || proc.ProcCode || "-",
        description: proc.description || proc.treatment || "",
        provider: proc.provider || proc.providerName || editTarget?.initials || "Staff",
        charge,
        patientBalance,
        insuranceBalance,
        totalBalance,
        appliedWriteOff,
        defaultWriteOff,
        expectedWriteOff: expectedWriteOff > 0 ? expectedWriteOff : defaultWriteOff + appliedWriteOff,
      };
    });
  }, [selectedClaim, invoiceProcedures, editTarget]);

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
    if (!selectedClaim) return;
    
    let overpaymentAmount = 0;
    const procs = rows.map(row => {
      const adjustedWO = parseAmount(writeOffInputs[row.id] !== undefined ? writeOffInputs[row.id] : row.defaultWriteOff);
      const totalNewWO = adjustedWO + row.appliedWriteOff;
      const excess = Math.max(0, totalNewWO - row.expectedWriteOff);
      overpaymentAmount += excess;
      
      return {
        id: row.id,
        code: row.code,
        excess: excess
      };
    });

    if (overpaymentAmount > 0.005) {
      setOverpaymentData({ amount: overpaymentAmount, procs: procs.filter(p => p.excess > 0.005) });
      setShowOverpaymentAlert(true);
    } else {
      handleProceedAdjust('credit');
    }
  };

  const handleProceedAdjust = async (overpaymentAction = 'credit') => {
    if (!selectedClaim) return;
    setIsSubmitting(true);
    let overpaymentAmount = 0;
    const procs = rows.map(row => {
      const adjustedWO = parseAmount(writeOffInputs[row.id] !== undefined ? writeOffInputs[row.id] : row.defaultWriteOff);
      const totalNewWO = adjustedWO + row.appliedWriteOff;
      const excess = Math.max(0, totalNewWO - row.expectedWriteOff);
      overpaymentAmount += excess;
      
      return {
        id: row.id,
        wo: totalNewWO,
        pay: 0,
        allowed: 0,
        ded: 0,
        excess: excess,
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
        claimId: selectedClaim.id,
        previousClaimStatus: selectedClaim.status,
        overpaymentAmount: overpaymentAmount > 0.005 ? overpaymentAmount : undefined,
        overpaymentAction: overpaymentAmount > 0.005 ? overpaymentAction : undefined,
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
      } catch (e) {
        // ignore
      }
      
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adjusting write-off:", err);
      alert("Failed to adjust write-off: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
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
                ["Insurance Write-Off", totals.writeOff],
              ].map(([label, value]) => (
                <Box key={label} sx={{ width: 130, textAlign: "right" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: label === "Insurance Write-Off" ? COLORS.ACCENT : COLORS.TEXT_PRIMARY }}>
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
                      width: 88,
                      "& .MuiInputBase-root": { height: 30, fontSize: "12px" },
                      "& input": { textAlign: "right", fontWeight: 700, color: COLORS.ACCENT },
                    }}
                  />
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
            disabled={!selectedClaim || isSubmitting}
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
            Adjust
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
            The following procedures have write-off amounts higher than expected. If the patient has not yet paid
            their portion, the excess will be deducted from the patient's portion automatically. Any remaining excess will be saved as Patient Credit.
          </Typography>
          <Box sx={{ bgcolor: '#f0f7ff', border: '1px solid #b8d5f8', borderRadius: '8px', px: 2, py: 1.5, mb: 1 }}>
            {overpaymentData.procs.map((proc, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 500 }}>
                  {proc.code}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#1976d2', fontWeight: 700 }}>
                  over by ${proc.excess.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Box sx={{ borderTop: '1px solid #b8d5f8', mt: 1, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>Total Excess</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1976d2' }}>${overpaymentData.amount.toFixed(2)}</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              setShowOverpaymentAlert(false);
              handleProceedAdjust('credit');
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
            Continue and save excess as credit
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
