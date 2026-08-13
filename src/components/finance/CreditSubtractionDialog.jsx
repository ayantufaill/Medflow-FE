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

const CreditSubtractionDialog = ({ onClose, editTarget }) => {
  const dispatch = useDispatch();
  
  const [adjustmentType, setAdjustmentType] = useState("Write Off");
  const [reason, setReason] = useState("");
  const [calcMode, setCalcMode] = useState("Percentage");
  const [calcValue, setCalcValue] = useState("");

  const invoiceNum = editTarget?.invoiceNumber || editTarget?.id || 'N/A';
  const rawDate = editTarget?.invoiceDate || editTarget?.createdAt || editTarget?.dateService;
  const invoiceDate = rawDate ? dayjs(rawDate).format('MM/DD/YYYY') : 'N/A';
  const adjustmentDate = dayjs().format('MM/DD/YYYY');
  const patientId = editTarget?.patientId || editTarget?.patient?.id || editTarget?.patient?._id;
  const patientName = editTarget?.patient?.firstName 
    ? `${editTarget.patient.firstName} ${editTarget.patient.lastName}` 
    : (typeof editTarget?.patient === 'string' ? editTarget.patient : 'Unknown');

  const procedures = editTarget?.lineItems || 
                     editTarget?.procedures || 
                     (editTarget?.details?.find(d => d.isGrouped)?.procedures) || 
                     [];

  const totalCharges = procedures.reduce((sum, p) => sum + Number(p.totalPrice || p.charge || p.ProcFee || 0), 0);
  const totalPayment = procedures.reduce((sum, p) => sum + Number(p.patientPaid || 0) + Number(p.insurancePaid || 0), 0);
  
  const dynamicLineItems = procedures.map(p => {
    const charge = Number(p.totalPrice || p.charge || p.ProcFee || 0);
    const ptBalance = Number(p.patientBalance || p.ptBalance || 0);
    const insBalance = Number(p.insuranceBalance || p.insBalance || 0);
    const ptPaid = Number(p.patientPaid || 0);
    const insPaid = Number(p.insurancePaid || 0);
    const pay = ptPaid + insPaid;
    
    return {
      code: p.code || p.cptCode || p.ProcCode || 'Item',
      patient: patientName,
      values: [
        { val: "$0.00" },
        { val: `$${ptBalance.toFixed(2)}` },
        { val: `$${insBalance.toFixed(2)}` },
        { val: `$${charge.toFixed(2)}` },
        { val: `$${pay.toFixed(2)}` },
      ],
      charge,
    };
  });

  const parsedValue = parseFloat(calcValue) || 0;
  const adjustmentAmount = calcMode === "Percentage" 
    ? totalCharges * (parsedValue / 100) 
    : parsedValue;

  const finalLineItems = dynamicLineItems.length > 0 ? dynamicLineItems.map(item => {
    // Pro-rate adjustment for line items if it's a percentage or just show 0 if flat
    let percentStr = "0%";
    if (calcMode === "Percentage") {
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
              <MenuItem value="Write Off">Write Off</MenuItem>
              <MenuItem value="Un-Collected">Un-Collected</MenuItem>
              <MenuItem value="pre payment">pre payment</MenuItem>
              <MenuItem value="wellness">wellness</MenuItem>
              <MenuItem value="Small Balance W/O">Small Balance W/O</MenuItem>
              <MenuItem value="Curtsey W/O">Curtsey W/O</MenuItem>
              <MenuItem value="NON PAYMENT">NON PAYMENT</MenuItem>
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

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
          <Select
            variant="outlined"
            size="small"
            value={calcMode}
            onChange={(e) => setCalcMode(e.target.value)}
            sx={{ height: 36, fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, color: '#09121f', backgroundColor: '#fafbfe', borderRadius: '4px', '& .MuiSelect-select': { py: 1, pl: 2, display: 'flex', alignItems: 'center', gap: 0.5 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
            MenuProps={{ sx: { zIndex: 150000 }, PaperProps: { sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: radius.sm, mt: 0.5, '& .MuiMenuItem-root': { fontSize: '13px', fontFamily: 'Inter', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 } } } }}
          >
            <MenuItem value="Percentage">Percentage</MenuItem>
            <MenuItem value="Flat rate">Flat rate</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>
            {calcMode === "Percentage" ? "%" : "$"}
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={calcValue}
            onChange={(e) => setCalcValue(e.target.value)}
            type="number"
            sx={{ width: 60, '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT }, '& input': { textAlign: "center", py: 0 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER } }}
          />
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: "bold" }}>
            = ${adjustmentAmount.toFixed(2)}
          </Typography>
        </Stack>

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
