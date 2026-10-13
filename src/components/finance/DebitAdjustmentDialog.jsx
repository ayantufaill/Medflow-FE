import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { usePatient } from '../../hooks/redux/usePatient';
import { createInvoiceDebitAdjustment } from '../../store/slices/billingSlice';

// Helper for the colored financial column headers
const HeaderLabel = ({ label, color }) => (
  <Typography
    variant="caption"
    sx={{ color: color, fontWeight: "bold", fontSize: "11px" }}
  >
    {label}
  </Typography>
);

const parseNum = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
};

const formatPatientName = (patient) => {
  if (!patient) return "";
  if (typeof patient === "string") return patient;
  return (
    patient.fullName ||
    patient.name ||
    `${patient.firstName || patient.FName || ""} ${patient.lastName || patient.LName || ""}`.trim()
  );
};

const procedureDescription = (proc = {}) =>
  proc.description ||
  proc.name ||
  proc.Descript ||
  proc.procedureDescription ||
  proc.serviceDescription ||
  proc.BillingNote ||
  "";

const procedureMergeKey = (proc = {}) =>
  proc.id ||
  proc._id ||
  proc.ProcNum ||
  proc.procedureId ||
  proc.procId ||
  proc.itemId ||
  proc.code ||
  proc.cptCode ||
  proc.ProcCode ||
  procedureDescription(proc);

const mergeProcedures = (...sources) => {
  const merged = new Map();
  sources
    .flat()
    .filter(Boolean)
    .forEach((proc) => {
      const key = String(procedureMergeKey(proc) || "");
      if (!key) return;
      merged.set(key, { ...(merged.get(key) || {}), ...proc });
    });
  return Array.from(merged.values());
};

const DebitAdjustmentDialog = ({ onClose, onAdjust, editTarget }) => {
  const dispatch = useDispatch();
  const { currentPatient } = usePatient();
  // ── Header, derived from the ledger row that opened the dialog ────────────
  const invoiceNum = editTarget?.invoiceNumber || editTarget?.id || 'N/A';
  const rawDate =
    editTarget?.invoiceDate ||
    editTarget?.date ||
    editTarget?.createdAt ||
    editTarget?.dateService;
  const invoiceDate = rawDate ? dayjs(rawDate).format('MM/DD/YYYY') : 'N/A';
  const adjustmentDate = dayjs().format('MM/DD/YYYY');
  const patientName =
    formatPatientName(currentPatient) ||
    editTarget?.patientName ||
    editTarget?.patientFullName ||
    formatPatientName(editTarget?.patient) ||
    formatPatientName(editTarget?.invoice?.patient) ||
    formatPatientName(editTarget?.patientId) ||
    "Unknown";
  const patientId =
    currentPatient?._id ||
    currentPatient?.id ||
    editTarget?.patientId?._id ||
    editTarget?.patientId?.id ||
    editTarget?.patientId ||
    editTarget?.patient?._id ||
    editTarget?.patient?.id;

  // Procedures come from whichever shape the ledger row carries: the grouped
  // invoice row inside an expanded ledger item (already restated by
  // ledgerCalculations), the full invoice detail, or a claim's procedures.
  // Payment and adjustment sub-rows are deliberately NOT merged in here — they
  // describe money already moved, not the line's liability, and merging them
  // overwrites the restated patient/insurance/write-off columns.
  const groupedProcedures =
    editTarget?.details?.find((d) => d.isGrouped)?.procedures || [];
  const procedures =
    groupedProcedures.length > 0
      ? mergeProcedures(groupedProcedures)
      : mergeProcedures(
          editTarget?.lineItems || [],
          editTarget?.procedures || [],
        );
  const liveClaims = (editTarget?.details || []).filter((detail) => {
    if (!detail?.isClaim || detail.isVoided) return false;
    const status = String(detail.status || "").toLowerCase();
    return status !== "void" && status !== "voided";
  });
  const claimedProcedureIds = new Set(
    liveClaims
      .flatMap((claim) => claim.procedures || [])
      .map((proc) => String(procedureMergeKey(proc) || ""))
      .filter(Boolean),
  );

  const [reason, setReason] = useState("");
  const [calcMode, setCalcMode] = useState("Percentage");
  const [calcValue, setCalcValue] = useState("0");

  // Per-line adjustment amounts are the only mutable state, keyed by the target
  // invoice so switching rows is naturally isolated — no reset effect needed,
  // and everything else is re-derived from `editTarget` on every render so
  // reopening the dialog on a different invoice can never show a stale row.
  const [lineAdjustments, setLineAdjustments] = useState({});
  const adjustmentsForLine = lineAdjustments[invoiceNum] || {};

  // Ledger-sourced rows are already restated (existing debit adjustments folded
  // in) and carry `fee`; raw line items only carry totalPrice/charge.
  const chargeOf = (p) => {
    const restated = p.fee !== undefined && p.fee !== null;
    return Number(restated ? p.fee : p.totalPrice || p.charge || p.ProcFee || 0);
  };
  const totalCharges = procedures.reduce((sum, p) => sum + chargeOf(p), 0);
  // The invoice summary is the reliable source of what has actually been paid;
  // the per-line paid fields can be stale when no payment record backs them.
  const hasSummary = Boolean(editTarget?.summary);
  const summaryInsPaid = parseNum(editTarget?.summary?.insPaid);
  const summaryWriteOff =
    parseNum(editTarget?.summary?.insWo) + parseNum(editTarget?.summary?.appliedWo);
  const claimedInsuranceTotal = procedures.reduce((sum, proc) => {
    if (!claimedProcedureIds.has(String(procedureMergeKey(proc) || ""))) return sum;
    return sum + parseNum(proc.insPortion ?? proc.insurancePortion ?? proc.totalInsPortion);
  }, 0);

  const lineItems =
    procedures.length > 0
      ? procedures.map((p) => {
          // A row that carries `fee` came from the ledger restatement, so its
          // patient / insurance / write-off columns are already final and
          // must be used verbatim. Re-deriving them here would prorate an
          // invoice-level write-off across lines by charge and quietly move
          // dollars between the patient and the insurance estimate.
          const restated = p.fee !== undefined && p.fee !== null;
          const charge = chargeOf(p);
          const writeoff = restated
            ? parseNum(p.writeoff ?? p.estimatedWriteOff ?? 0)
            : hasSummary && summaryWriteOff > 0
              ? summaryWriteOff * (totalCharges > 0 ? charge / totalCharges : 0)
              : parseNum(p.writeoff ?? p.estimatedWriteOff ?? 0);
          const ptPortion = restated
            ? parseNum(p.ptPortion ?? p.patientPortion ?? 0)
            : Math.max(
                0,
                Math.min(
                  parseNum(p.ptPortion ?? p.patientPortion ?? p.ptAmt ?? 0),
                  charge - writeoff,
                ),
              );
          const insPortion = restated
            ? parseNum(p.insPortion ?? 0)
            : Math.max(
                0,
                Math.min(
                  parseNum(
                    p.totalInsPortion || p.insPortion || p.insurancePortion || 0,
                  ),
                  charge - writeoff,
                ),
              );
          const isClaimedProcedure = claimedProcedureIds.has(
            String(procedureMergeKey(p) || ""),
          );
          // Per-procedure paid is what the line actually carries. Only fall
          // back to splitting the invoice total when the line has no figure of
          // its own, and never spread a payment onto a line that was not on
          // the claim that received it.
          const lineInsPaid = parseNum(
            p.insurancePaidAmount ?? p.insurancePaid ?? p.insPaid,
          );
          const linePtPaid = parseNum(
            p.patientPaidAmount ?? p.patientPaid ?? p.ptPaid,
          );
          let paid = lineInsPaid + linePtPaid;
          if (!(paid > 0)) {
            paid =
              isClaimedProcedure && summaryInsPaid > 0
                ? summaryInsPaid *
                  (claimedInsuranceTotal > 0
                    ? insPortion / claimedInsuranceTotal
                    : 1)
                : hasSummary
                  ? 0
                  : 0;
          }
          return {
            code: p.code || p.cptCode || p.ProcCode || 'Item',
            description: procedureDescription(p) || patientName,
            values: [
              { val: `$${writeoff.toFixed(2)}`, flex: 80 },
              { val: `$${ptPortion.toFixed(2)}`, flex: 80 },
              { val: `$${insPortion.toFixed(2)}`, flex: 80 },
              { val: `$${charge.toFixed(2)}`, flex: 100, bold: true },
              { val: `$${paid.toFixed(2)}`, flex: 80, bold: true, color: '#22c55e' },
            ],
            percent: "0%",
            procId: p.id || p._id || p.ProcNum,
            insuranceRatio:
              charge - writeoff > 0 && insPortion > 0
                ? Math.min(1, Math.max(0, insPortion / (charge - writeoff)))
                : 0,
          };
        })
      : [
          {
            code: "No items found",
            description: patientName,
            values: [
              { val: "$0.00", flex: 80 },
              { val: "$0.00", flex: 80 },
              { val: "$0.00", flex: 80 },
              { val: "$0.00", flex: 100, bold: true },
              { val: "$0.00", flex: 80, bold: true, color: '#22c55e' },
            ],
            percent: "0%",
          },
        ];

  // The editable amount for a line: the manual override when the user typed
  // one, otherwise the flat amount this row's charge would take.
  const lineAdjustValue = (item, idx) =>
    adjustmentsForLine[idx] !== undefined
      ? parseNum(adjustmentsForLine[idx])
      : procedures.length > 0
        ? Math.round(parseNum(item.values[3].val) * (parseNum(calcValue) / 100) * 100) / 100
        : 0;

  const totalPayment = lineItems.reduce((s, i) => s + parseNum(i.values[4]?.val), 0);
  const totalAdjust = lineItems.reduce((s, i, idx) => s + lineAdjustValue(i, idx), 0);

  const previewAdjustment = calcMode === "Percentage"
    ? Math.round(totalCharges * (parseNum(calcValue) / 100) * 100) / 100
    : parseNum(calcValue);

  const handleLineAdjustChange = (idx, raw) => {
    const cleaned = String(raw).replace(/[^0-9.]/g, '');
    setLineAdjustments((prev) => ({
      ...prev,
      [invoiceNum]: { ...(prev[invoiceNum] || {}), [idx]: cleaned },
    }));
  };

  // Flex ratios (not fixed pixels) so the columns stretch across the full
  // dialog width instead of leaving dead space on the right.
  const columns = [
    { label: "Ins Writeoff", flex: 80, color: COLORS.TEXT_SECONDARY },
    { label: "Patient:", flex: 80, color: COLORS.TEXT_SECONDARY },
    { label: "Insurance:", flex: 80, color: COLORS.TEXT_SECONDARY },
    { label: `Charges: $${totalCharges.toFixed(2)}`, flex: 100, color: COLORS.TEXT_SECONDARY },
    { label: `Payment: $${totalPayment.toFixed(2)}`, flex: 80, color: '#22c55e', align: "right" },
    { label: `Adjust: $${totalAdjust.toFixed(2)}`, flex: 80, color: COLORS.ACCENT, align: "right" },
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: "hidden" }}>
      {/* Header Bar */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '24px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <EditNoteOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: "bold", color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Adjust invoice {invoiceNum}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: '24px', py: '20px', pt: '24px !important', overflow: 'visible' }}>
        {/* Top Input Row: Date, Type, Reason */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
            {adjustmentDate}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
              Debit Adjustment #{invoiceNum}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', whiteSpace: "nowrap" }}>
              Reason:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ 
                '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
              }}
            />
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', whiteSpace: "nowrap" }}>
              for invoice: {invoiceNum}:
            </Typography>
          </Box>
        </Stack>

        {/* Calculation Logic Row */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
          <Select
            variant="outlined"
            size="small"
            value={calcMode}
            onChange={(e) => setCalcMode(e.target.value)}
            sx={{ 
              fontSize: "13px", 
              height: '36px',
              borderRadius: radius.sm,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              bgcolor: COLORS.SURFACE_TINT
            }}
            MenuProps={{ 
              sx: { zIndex: 150000 },
              PaperProps: {
                sx: {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  borderRadius: radius.sm,
                  mt: 0.5,
                  '& .MuiMenuItem-root': { fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 }
                }
              }
            }}
          >
            <MenuItem value="Percentage">Percentage</MenuItem>
            <MenuItem value="Flat rate">Flat rate</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>%</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={calcValue}
            onChange={(e) => setCalcValue(e.target.value.replace(/[^0-9.]/g, ''))}
            sx={{
              width: 50,
              '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
              '& input': { textAlign: "center", py: 0 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
            }}
          />
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: "bold" }}>
            = ${previewAdjustment.toFixed(2)}
          </Typography>
        </Stack>

        {/* Financial Category Headers */}
        <Stack direction="row" sx={{ mb: 1, width: "100%", alignItems: 'flex-end' }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "12px", color: COLORS.TEXT_PRIMARY, width: 220, flexShrink: 0 }}>
            Invoice {invoiceNum} : {invoiceDate} for {patientName}
          </Typography>

          <Stack direction="row" spacing={0} sx={{ flexGrow: 1, minWidth: 0 }}>
            {columns.map((col, idx) => (
              <Box key={idx} sx={{ flex: col.flex, minWidth: 0, pr: 1, textAlign: col.align || "right" }}>
                <HeaderLabel label={col.label} color={col.color} />
              </Box>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 1.5, mt: 0.5, borderColor: COLORS.BORDER_LIGHT }} />

        {/* Detailed Line Items */}
        {lineItems.map((item, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", py: 1.5, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
            <Box sx={{ width: 220, flexShrink: 0, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '12px', fontWeight: fontWeight.medium }}>
                {item.code}
              </Typography>
              <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "11px" }}>
                {item.description}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0} sx={{ flexGrow: 1, minWidth: 0, alignItems: 'center' }}>
              {item.values.map((v, vIdx) => (
                <Typography
                  key={vIdx}
                  sx={{
                    color: v.color || COLORS.TEXT_PRIMARY,
                    flex: v.flex,
                    minWidth: 0,
                    textAlign: "right",
                    pr: 1,
                    fontSize: '12px',
                    fontWeight: v.bold ? fontWeight.semiBold : fontWeight.regular,
                  }}
                >
                  {v.val}
                </Typography>
              ))}
              <Box sx={{ flex: 80, minWidth: 0, display: "flex", justifyContent: "flex-end", pr: 1 }}>
                <Box sx={{ border: `1px dashed ${COLORS.BORDER}`, px: 1, py: 0.5, borderRadius: '4px', bgcolor: COLORS.SURFACE_TINT, display: 'inline-flex', alignItems: 'center', width: 72, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: "11px", fontWeight: 600, color: COLORS.TEXT_SECONDARY, mr: 0.25 }}>$</Typography>
                  <input
                    type="text"
                    value={
                      adjustmentsForLine[idx] !== undefined
                        ? adjustmentsForLine[idx]
                        : lineAdjustValue(item, idx).toFixed(2)
                    }
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleLineAdjustChange(idx, e.target.value)}
                    onBlur={() => {
                      const raw = adjustmentsForLine[idx];
                      if (raw === undefined || raw === '') return;
                      handleLineAdjustChange(idx, parseNum(raw).toFixed(2));
                    }}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: 48, fontSize: '11px', fontWeight: 600, padding: 0, color: COLORS.TEXT_SECONDARY }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}
      </DialogContent>

      {/* Footer with Description and Actions */}
      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: COLORS.ACCENT, cursor: "pointer", fontWeight: fontWeight.medium, fontSize: '13px', '&:hover': { textDecoration: 'underline' } }}>
          + Add description
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const payload = {
                invoiceId: editTarget?.id,
                invoiceNumber: invoiceNum,
                invoiceDate: rawDate ?? null,
                patientName,
                reason,
                calcMode,
                calcValue,
                totalAdjust,
                lineItems: lineItems.map((item, idx) => ({
                  code: item.code,
                  procId: item.procId,
                  procedureId: item.procId,
                  amount: lineAdjustValue(item, idx),
                  insuranceRatio: item.insuranceRatio,
                })),
              };
              if (onAdjust) {
                onAdjust(payload);
                onClose?.();
                return;
              }
              try {
                await dispatch(
                  createInvoiceDebitAdjustment({
                    patientId,
                    invoiceId: editTarget?.id,
                    adjustmentAmount: totalAdjust,
                    reason,
                    lineItems: payload.lineItems,
                  }),
                ).unwrap();
                onClose?.();
              } catch (err) {
                console.error("Debit adjustment failed", err);
                alert(`Failed to create debit adjustment: ${err}`);
              }
            }}
            sx={{
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
            }}
          >
            Adjust
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default DebitAdjustmentDialog;
