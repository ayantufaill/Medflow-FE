import React, { useState, useEffect } from 'react';
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
import apiClient from '../../config/api';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

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

const DebitAdjustmentDialog = ({ onClose, onAdjust, editTarget }) => {
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
    editTarget?.patient && typeof editTarget.patient === 'object'
      ? `${editTarget.patient.firstName || ''} ${editTarget.patient.lastName || ''}`.trim()
      : (typeof editTarget?.patient === 'string' ? editTarget.patient : 'Unknown');

  // Procedures come from whichever shape the ledger row carries: the full
  // invoice detail (lineItems), a claim's procedures, or the grouped invoice
  // row inside an expanded ledger item.
  const procedures =
    editTarget?.lineItems ||
    editTarget?.procedures ||
    (editTarget?.details?.find((d) => d.isGrouped)?.procedures) ||
    [];

  const [adjustType, setAdjustType] = useState("");
  const [reason, setReason] = useState("");
  const [calcMode, setCalcMode] = useState("Percentage");
  const [calcValue, setCalcValue] = useState("0");

  // Per-line adjustment amounts are the only mutable state, keyed by the target
  // invoice so switching rows is naturally isolated — no reset effect needed,
  // and everything else is re-derived from `editTarget` on every render so
  // reopening the dialog on a different invoice can never show a stale row.
  const [lineAdjustments, setLineAdjustments] = useState({});
  const adjustmentsForLine = lineAdjustments[invoiceNum] || {};

  // Adjustment type options, same source the credit / account dialogs use.
  const [adjustmentTypeOptions, setAdjustmentTypeOptions] = useState([]);
  useEffect(() => {
    let alive = true;
    apiClient
      .get('/admin-finance/definitions/1')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (alive && Array.isArray(data) && data.length > 0) {
          setAdjustmentTypeOptions(data);
          setAdjustType((prev) => prev || data[0]?.type || "");
        }
      })
      .catch((err) => console.error('Failed to fetch adjustment definitions:', err));
    return () => {
      alive = false;
    };
  }, []);

  const lineItems =
    procedures.length > 0
      ? procedures.map((p) => {
          const charge = Number(p.totalPrice || p.charge || p.ProcFee || 0);
          const writeoff = Number(p.writeoff || p.estimatedWriteOff || 0);
          const ptPortion = Number(p.ptPortion || p.patientPortion || p.ptAmt || 0);
          const insPortion = Number(
            p.totalInsPortion || p.insPortion || p.insurancePortion || 0,
          );
          const patientPaid = Number(p.patientPaidAmount ?? p.patientPaid ?? 0);
          const insurancePaid = Number(p.insurancePaidAmount ?? p.insurancePaid ?? 0);
          return {
            code: p.code || p.cptCode || p.ProcCode || 'Item',
            patient: patientName,
            values: [
              { val: `$${writeoff.toFixed(2)}`, flex: 80 },
              { val: `$${ptPortion.toFixed(2)}`, flex: 80 },
              { val: `$${insPortion.toFixed(2)}`, flex: 80 },
              { val: `$${charge.toFixed(2)}`, flex: 100, bold: true },
              { val: `$${(patientPaid + insurancePaid).toFixed(2)}`, flex: 80, bold: true, color: '#22c55e' },
            ],
            percent: "0%",
            procId: p.id || p._id || p.ProcNum,
          };
        })
      : [
          {
            code: "No items found",
            patient: patientName,
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

  const totalCharges = lineItems.reduce((s, i) => s + parseNum(i.values[3]?.val), 0);
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
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>type</Typography>
            <Select
              variant="outlined"
              size="small"
              value={adjustType}
              onChange={(e) => setAdjustType(e.target.value)}
              displayEmpty
              sx={{
                width: 150,
                height: '36px',
                borderRadius: radius.sm,
                fontSize: "13px",
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
              {adjustmentTypeOptions.length > 0 ? (
                adjustmentTypeOptions.map((opt) => (
                  <MenuItem key={opt.id || opt.type} value={opt.type} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
                    {opt.type}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value=""><em>None</em></MenuItem>
              )}
            </Select>
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
                {item.patient}
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
            onClick={() => {
              onAdjust?.({
                invoiceId: editTarget?.id,
                invoiceNumber: invoiceNum,
                invoiceDate: rawDate ?? null,
                patientName,
                adjustmentType: adjustType,
                reason,
                calcMode,
                calcValue,
                totalAdjust,
                lineItems: lineItems.map((item, idx) => ({
                  code: item.code,
                  procId: item.procId,
                  amount: lineAdjustValue(item, idx),
                })),
              });
              onClose?.();
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
