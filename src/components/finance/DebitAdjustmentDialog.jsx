import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';

// Helper for the colored financial column headers
const HeaderLabel = ({ label, color }) => (
  <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', fontSize: '10px' }}>
    {label}
  </Typography>
);

const DebitAdjustmentDialog = ({ onClose }) => {
  const columns = [
    { label: "Ins Writeoff", width: 80, color: "#d38c7d" },
    { label: "Patient:", width: 80, color: "#d38c7d" },
    { label: "Insurance:", width: 80, color: "#d38c7d" },
    { label: "Charges: $100.00", width: 100, color: "#d38c7d" },
    { label: "Payment: $0.00", width: 80, color: "#81c784", align: 'right' },
    { label: "Adjust: $0.00", width: 80, color: "#7e57c2", align: 'right' },
  ];

  const headerInfo = {
    invoiceNum: "#24636",
    adjustmentDate: "04/15/2026",
    adjustmentType: "Debit Adjustment #24642",
    invoiceDate: "04/14/2026"
  };

  const lineItems = [
    {
      code: "L5001 Broken appt",
      patient: "test test",
      values: [
        { val: "$0.00", width: 80 },
        { val: "$100.00", width: 80 },
        { val: "$0.00", width: 80 },
        { val: "$100.00", width: 100, bold: true },
        { val: "$0.00", width: 80, bold: true, color: "#81c784" },
      ],
      percent: "0%"
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: '#fff', 
      border: '1px solid #ccc', 
      borderRadius: '4px', 
      overflow: 'hidden', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      {/* Blue Header Bar */}
      <Box sx={{ bgcolor: '#7788bb', color: '#fff', p: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
          Adjust invoice {headerInfo.invoiceNum}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Top Input Row: Date, Type, Reason */}
        <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#7788bb', fontWeight: 'bold' }}>
            {headerInfo.adjustmentDate}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #7788bb', pb: 0.2 }}>
             <Typography variant="caption" sx={{ color: '#7788bb', mr: 1, fontWeight: 'bold' }}>
               {headerInfo.adjustmentType}
             </Typography>
             <Typography variant="caption" sx={{ color: '#666' }}>type</Typography>
             <Select 
               variant="standard" 
               defaultValue="" 
               sx={{ width: 150, ml: 1, height: 20, fontSize: '11px' }}
               disableUnderline
             >
                <MenuItem value=""><em>None</em></MenuItem>
             </Select>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #333', pb: 0.2, flexGrow: 1 }}>
            <Typography variant="caption" sx={{ color: '#333', whiteSpace: 'nowrap' }}>Reason: </Typography>
            <TextField 
              variant="standard" 
              fullWidth 
              InputProps={{ 
                disableUnderline: true,
                sx: { fontSize: '11px', px: 1, height: 20 } 
              }} 
            />
            <Typography variant="caption" sx={{ color: '#333', ml: 2, whiteSpace: 'nowrap' }}>for invoice: {headerInfo.invoiceNum}:</Typography>
          </Box>
        </Stack>


        {/* Calculation Logic Row */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Select variant="standard" defaultValue="Percentage" sx={{ fontSize: '11px', height: 25 }}>
            <MenuItem value="Percentage">Percentage</MenuItem>
          </Select>
          <Typography variant="caption" sx={{ pt: 1 }}>%</Typography>
          <TextField 
            variant="standard" 
            defaultValue="0" 
            sx={{ width: 30, '& input': { textAlign: 'center', py: 0, fontSize: '12px' } }} 
          />
          <Typography variant="caption" sx={{ pt: 1 }}>= $0</Typography>
        </Stack>

        {/* Financial Category Headers */}
        <Stack direction="row" sx={{ mb: 1, width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '11px', width: 220 }}>
            Invoice {headerInfo.invoiceNum} : {headerInfo.invoiceDate} for
          </Typography>
          
          <Stack direction="row" spacing={0} sx={{ flexGrow: 1 }}>
            {columns.map((col, idx) => (
              <Box key={idx} sx={{ width: col.width, textAlign: col.align || 'left' }}>
                <HeaderLabel label={col.label} color={col.color} />
              </Box>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 1.5, mt: 0.5, bgcolor: '#1e1b24ff' }} />

        {/* Detailed Line Items */}
        {lineItems.map((item, idx) => (
          <Box key={idx} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1, 
            borderBottom: '1px solid #eee' 
          }}>
            <Box sx={{ width: 220, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#444' }}>{item.code}</Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '10px' }}>{item.patient}</Typography>
            </Box>
            
            <Stack direction="row" spacing={0} sx={{ flexGrow: 1 }}>
              {item.values.map((v, vIdx) => (
                <Typography 
                  key={vIdx}
                  variant="caption" 
                  sx={{ 
                    color: v.color || '#444', 
                    width: v.width, 
                    textAlign: 'right', 
                    pr: 1, 
                    fontWeight: v.bold ? 'bold' : 'normal' 
                  }}
                >
                  {v.val}
                </Typography>
              ))}
              <Box sx={{ width: 80, display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                <Box sx={{ border: '1px dashed #999', px: 1, py: 0.2 }}>
                  <Typography variant="caption" sx={{ fontSize: '10px' }}>{item.percent}</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}

        {/* Footer with Description and Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer', fontWeight: 500 }}>
            + Add description
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                bgcolor: '#7788bb', 
                textTransform: 'none', 
                fontSize: '11px',
                px: 2,
                '&:hover': { bgcolor: '#6577aa' } 
              }}
            >
              Adjust
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={onClose}
              sx={{ 
                bgcolor: '#9e9e9e', 
                textTransform: 'none', 
                fontSize: '11px',
                px: 2,
                '&:hover': { bgcolor: '#757575' } 
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default DebitAdjustmentDialog;
