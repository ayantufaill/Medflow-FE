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
import { createInvoiceAdjustment } from '../../store/slices/billingSlice';
import { usePatient } from '../../hooks/redux/usePatient';

const CreditSubtractionDialog = ({ onClose, editTarget }) => {
  const dispatch = useDispatch();
  const { currentPatient } = usePatient();
  
  const [adjustmentType, setAdjustmentType] = useState("Write Off");
  const [reason, setReason] = useState("");
  const [calcMode, setCalcMode] = useState("Percentage");
  const [calcValue, setCalcValue] = useState("");

  const invoiceNum = editTarget?.invoiceNumber || editTarget?.id || 'N/A';
  const rawDate = editTarget?.invoiceDate || editTarget?.date || editTarget?.createdAt || editTarget?.dateService;
  const invoiceDate = rawDate ? dayjs(rawDate).format('MM/DD/YYYY') : 'N/A';
  const adjustmentDate = dayjs().format('MM/DD/YYYY');
  const patientId = currentPatient?._id || currentPatient?.id || editTarget?.patientId || editTarget?.patient?.id;
  const patientName = currentPatient?.firstName 
    ? `${currentPatient.firstName} ${currentPatient.lastName}` 
    : (typeof editTarget?.patient === 'string' ? editTarget.patient : 'Unknown');

  const procedures = editTarget?.lineItems || 
                     editTarget?.procedures || 
                     (editTarget?.details?.find(d => d.isGrouped)?.procedures) || 
                     [];

  const totalCharges = procedures.reduce((sum, p) => sum + Number(p.totalPrice || p.charge || p.ProcFee || 0), 0);
  
  let totalPayment = procedures.reduce((sum, p) => sum + Number(p.patientPaid || 0) + Number(p.insurancePaid || 0), 0);
  let hasSummary = false;
  let totalWo = 0;
  if (editTarget?.summary) {
    hasSummary = true;
    const ptP = Number(editTarget.summary.ptPaid?.replace(/[^0-9.-]+/g,"")) || 0;
    const insP = Number(editTarget.summary.insPaid?.replace(/[^0-9.-]+/g,"")) || 0;
    totalPayment = ptP + insP;
    totalWo = Number(editTarget.summary.insWo?.replace(/[^0-9.-]+/g,"")) || 0;
  }
  
  const dynamicLineItems = procedures.map(p => {
    const charge = Number(p.totalPrice || p.charge || p.ProcFee || 0);
    const weight = totalCharges > 0 ? charge / totalCharges : 0;
    
    let writeoff = Number(p.writeoff || p.estimatedWriteOff || 0);
    if (!writeoff && p.BillingNote) {
      try {
        const bn = JSON.parse(p.BillingNote);
        if (bn.writeoff) writeoff = Number(bn.writeoff);
      } catch (e) {}
    }

    let ptBalance = Number(p.patientBalance || p.ptBalance || parseFloat(String(p.ptPortion || '').replace(/[^0-9.-]+/g, "")) || 0);
    let insBalance = Number(p.insuranceBalance || p.insBalance || parseFloat(String(p.insPortion || '').replace(/[^0-9.-]+/g, "")) || 0);
    let pay = Number(p.paidAmount || p.payAmount || p.patientPaid || 0) + Number(p.insurancePaid || 0);

    // Only override with summary pro-ration if line items don't have their own balances defined
    // and there is an actual summary
    if (hasSummary && ptBalance === 0 && insBalance === 0) {
      ptBalance = Math.max(0, (Number(editTarget.summary.ptBal?.replace(/[^0-9.-]+/g,"")) || 0) * weight);
      insBalance = Math.max(0, (Number(editTarget.summary.insBal?.replace(/[^0-9.-]+/g,"")) || 0) * weight);
      if (writeoff === 0 && totalWo > 0) {
        writeoff = totalWo * weight;
      }
    }
    
    // Always pro-rate pay if it's 0 on line items but exists in summary
    if (hasSummary && pay === 0 && totalPayment > 0) {
      pay = totalPayment * weight;
    }
    
    return {
      code: p.code || p.cptCode || p.ProcCode || 'Item',
      patient: patientName,
      values: [
        { val: `$${writeoff.toFixed(2)}` },
        { val: `$${ptBalance.toFixed(2)}` },
        { val: `$${insBalance.toFixed(2)}` },
        { val: `$${charge.toFixed(2)}` },
        { val: `$${pay.toFixed(2)}` },
      ],
      charge,
    };
  });

  const totalWriteOff = dynamicLineItems.reduce((sum, item) => sum + parseFloat(item.values[0].val.replace(/[^0-9.-]+/g,"")), 0);
  const totalPtBalance = dynamicLineItems.reduce((sum, item) => sum + parseFloat(item.values[1].val.replace(/[^0-9.-]+/g,"")), 0);

  const parsedValue = parseFloat(calcValue) || 0;
  let baseAmount = totalCharges;
  if (adjustmentType === "Curtsey W/O") {
    baseAmount = totalPtBalance;
  }
  
  let adjustmentAmount = calcMode === "Percentage" 
    ? baseAmount * (parsedValue / 100) 
    : parsedValue;

  if (adjustmentType === "Write Off") {
    adjustmentAmount = totalWriteOff;
  }

  if (adjustmentType === "Curtsey W/O" && adjustmentAmount > totalPtBalance) {
    adjustmentAmount = totalPtBalance;
  }

  const finalLineItems = dynamicLineItems.length > 0 ? dynamicLineItems.map(item => {
    // Pro-rate adjustment for line items if it's a percentage or just show 0 if flat
    let percentStr = "0%";
    if (adjustmentType === "Write Off") {
      percentStr = item.values[0].val; // Shows the exact write-off amount for this item
    } else if (calcMode === "Percentage") {
      percentStr = `${parsedValue}%`;
    }
    return { ...item, percent: percentStr };
  }) : [
    {
      code: "No items found",
      patient: patientName,
      values: [
        { val: "$0.00" }, { val: "$0.00" }, { val: "$0.00" }, { val: "$0.00" }, { val: "$0.00" },
      ],
      percent: "0%",
    }
  ];

  const handleAdjust = async () => {
    if (!adjustmentAmount) {
      alert("Please enter a valid adjustment value.");
      return;
    }
    
    try {
      await dispatch(createInvoiceAdjustment({
        patientId,
        invoiceId: editTarget?.id,
        adjustmentType,
        adjustmentAmount,
        reason
      })).unwrap();
      
      if (onClose) onClose();
    } catch (err) {
      console.error("Adjustment failed", err);
      alert("Failed to create adjustment: " + err);
    }
  };

  return (
    <Box sx={{ width: "100%", minWidth: "950px", bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: "hidden" }}>
      <DialogTitle sx={{ boxSizing: 'border-box', px: '24px', py: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${COLORS.BORDER}`, backgroundColor: COLORS.SURFACE_TINT, m: 0, flexShrink: 0 }}>
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
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
            {adjustmentDate}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
              Credit Adjustment
            </Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>type</Typography>
            <Select
              variant="outlined"
              size="small"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              sx={{ width: 150, height: 36, fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, color: '#09121f', backgroundColor: '#fafbfe', borderRadius: '4px', '& .MuiSelect-select': { py: 1, pl: 2, display: 'flex', alignItems: 'center', gap: 0.5 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
              MenuProps={{ sx: { zIndex: 150000 }, PaperProps: { sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: radius.sm, mt: 0.5, '& .MuiMenuItem-root': { fontSize: '13px', fontFamily: 'Inter', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 } } } }}
            >
              <MenuItem value="Write Off" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Write Off</MenuItem>
              <MenuItem value="Un-Collected" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Un-Collected</MenuItem>
              <MenuItem value="pre payment" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Pre Payment</MenuItem>
              <MenuItem value="wellness" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Wellness</MenuItem>
              <MenuItem value="Small Balance W/O" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Small Balance W/O</MenuItem>
              <MenuItem value="Curtsey W/O" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Curtsey W/O</MenuItem>
              <MenuItem value="NON PAYMENT" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Non Payment</MenuItem>
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
              sx={{ '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT }, '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER } }}
            />
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', whiteSpace: "nowrap" }}>
              for invoice: {invoiceNum}:
            </Typography>
          </Box>
        </Stack>

        {adjustmentType !== "Write Off" && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
            <Select
              variant="outlined"
              size="small"
              value={calcMode}
              onChange={(e) => setCalcMode(e.target.value)}
              sx={{ height: 36, fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, color: '#09121f', backgroundColor: '#fafbfe', borderRadius: '4px', '& .MuiSelect-select': { py: 1, pl: 2, display: 'flex', alignItems: 'center', gap: 0.5 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
              MenuProps={{ sx: { zIndex: 150000 }, PaperProps: { sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: radius.sm, mt: 0.5, '& .MuiMenuItem-root': { fontSize: '13px', fontFamily: 'Inter', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 } } } }}
            >
              <MenuItem value="Percentage" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Percentage</MenuItem>
              <MenuItem value="Flat rate" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Flat rate</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>
              {calcMode === "Percentage" ? "%" : "$"}
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={calcValue}
              onChange={(e) => {
                let val = e.target.value;
                if (calcMode === "Percentage") {
                  if (val !== "") {
                    let num = parseFloat(val);
                    if (num > 100) val = "100";
                    if (num < 0) val = "0";
                  }
                } else if (adjustmentType === "Curtsey W/O" && calcMode === "Flat rate") {
                  if (val !== "") {
                    let num = parseFloat(val);
                    if (num > totalPtBalance) val = totalPtBalance.toString();
                    if (num < 0) val = "0";
                  }
                }
                setCalcValue(val);
              }}
              type="number"
              sx={{ width: 120, '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT }, '& input': { textAlign: "center", py: 0 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER } }}
            />
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: "bold" }}>
              = ${adjustmentAmount.toFixed(2)}
            </Typography>
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
          <Box sx={{ width: '220px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>
              Invoice {invoiceNum} : {invoiceDate} for {patientName}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'left', color: '#555' }}>Ins Writeoff</Typography>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'left', color: '#555' }}>Patient:</Typography>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'left', color: '#555' }}>Insurance:</Typography>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'left', color: '#555' }}>Charges: ${totalCharges.toFixed(2)}</Typography>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'right', color: '#22c55e' }}>Payment: ${totalPayment.toFixed(2)}</Typography>
             <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'right', color: COLORS.ACCENT }}>Adjust: -${adjustmentAmount.toFixed(2)}</Typography>
          </Box>
        </Box>

        {finalLineItems.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #f5f5f5' }}>
            <Box sx={{ width: '220px', display: 'flex', alignItems: 'center', py: 1, gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{item.code}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{item.patient}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 1 }}>
                 <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{item.values[0].val}</Typography>
               </Box>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 1 }}>
                 <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{item.values[1].val}</Typography>
               </Box>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 1 }}>
                 <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{item.values[2].val}</Typography>
               </Box>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 1 }}>
                 <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>{item.values[3].val}</Typography>
               </Box>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', py: 1 }}>
                 <Typography sx={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>{item.values[4].val}</Typography>
               </Box>
               <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', py: 1, pr: 1 }}>
                 <Box sx={{ border: '1px dashed #ccc', px: 1, py: 0.25, display: 'inline-flex', alignItems: 'center', borderRadius: '4px' }}>
                   <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{item.percent}</Typography>
                 </Box>
               </Box>
            </Box>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: COLORS.ACCENT, cursor: "pointer", fontWeight: fontWeight.medium, fontSize: '13px', '&:hover': { textDecoration: 'underline' } }}>
          + Add description
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={onClose} sx={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, textTransform: "none", fontSize: "13px", fontWeight: fontWeight.medium, borderRadius: radius.sm, height: '36px', px: 3, "&:hover": { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' } }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdjust} sx={{ bgcolor: COLORS.ACCENT, color: COLORS.WHITE, textTransform: "none", fontSize: "13px", fontWeight: fontWeight.medium, borderRadius: radius.sm, height: '36px', px: 3, boxShadow: 'none', "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } }}>
            Adjust
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default CreditSubtractionDialog;
