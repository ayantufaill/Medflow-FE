import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';

const LateFeeDialog = ({ onClose, onAddFee, adjustmentType }) => {
  const [selectedInvoices, setSelectedInvoices] = useState(['25136', '25135']);
  const [outstandingType, setOutstandingType] = useState('patient');
  const [rateValue, setRateValue] = useState('0.00');

  const isFlatRate = adjustmentType === 'Flat rate';
  const isPercentage = adjustmentType === 'Percentage';
  const showCustomRate = isFlatRate || isPercentage;

  const invoices = [
    { id: '25136', date: '05/06/2026', patient: 'Vicky Widener', amount: 100.00, ins: 0.00, writeoff: 0.00, owing: 100.00 },
    { id: '25135', date: '05/06/2026', patient: 'Vicky Widener', amount: 100.00, ins: 0.00, writeoff: 0.00, owing: 100.00 },
  ];

  const handleToggleInvoice = (id) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(i => i.id));
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${COLORS.BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
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
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Invoices {adjustmentType ? `— ${adjustmentType}` : ''}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2, display: 'flex', flexDirection: 'column' }}>
        <TableContainer component={Box} sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontSize: '13px' } }}>
                <TableCell padding="checkbox">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Checkbox 
                      size="small" 
                      checked={selectedInvoices.length === invoices.length}
                      indeterminate={selectedInvoices.length > 0 && selectedInvoices.length < invoices.length}
                      onChange={handleToggleAll}
                      sx={{ p: 0, color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT }, '&.MuiCheckbox-indeterminate': { color: COLORS.ACCENT } }} 
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>All</Typography>
                  </Stack>
                </TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Insurance</TableCell>
                <TableCell>Ins Writeoff</TableCell>
                <TableCell>Previous Total Owing</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} sx={{ '& td': { borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.2, fontSize: '13px', color: COLORS.TEXT_BODY } }}>
                  <TableCell padding="checkbox">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Checkbox 
                        size="small" 
                        checked={selectedInvoices.includes(inv.id)}
                        onChange={() => handleToggleInvoice(inv.id)}
                        sx={{ p: 0, color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} 
                      />
                      <Typography sx={{ color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap', fontSize: '13px' }}>
                        Invoice #{inv.id}: {inv.date} for {inv.patient}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: COLORS.ACCENT, fontWeight: 600 }}>${inv.amount.toFixed(2)}</TableCell>
                  <TableCell>${inv.ins.toFixed(2)}</TableCell>
                  <TableCell>${inv.writeoff.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: COLORS.ACCENT, fontWeight: 600 }}>${inv.owing.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, px: 3, py: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
        <RadioGroup 
          row 
          value={outstandingType} 
          onChange={(e) => setOutstandingType(e.target.value)}
        >
          <FormControlLabel 
            value="total" 
            control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
            label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>Total Outstanding</Typography>} 
          />
          <FormControlLabel 
            value="patient" 
            control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
            label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>Patient Outstanding</Typography>} 
          />
        </RadioGroup>
        
        {showCustomRate && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>
              {isPercentage ? 'Percentage:' : 'Flat Rate:'}
            </Typography>
            <TextField
              variant="standard"
              size="small"
              value={rateValue}
              onChange={(e) => setRateValue(e.target.value)}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 0.5, color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>{isPercentage ? '%' : '$'}</Typography>,
              }}
              sx={{ 
                width: '80px',
                '& .MuiInput-underline:before': { borderBottomColor: COLORS.BORDER },
                '& .MuiInput-underline:after': { borderBottomColor: COLORS.ACCENT },
                '& .MuiInputBase-input': {
                  fontSize: '13px',
                  textAlign: 'center',
                  color: COLORS.TEXT_PRIMARY
                }
              }}
            />
          </Stack>
        )}

        <Stack direction="row" spacing={1}>
          <Button 
            variant="contained" 
            onClick={() => onAddFee(selectedInvoices, rateValue)}
            sx={{ 
              bgcolor: COLORS.ACCENT, 
              color: '#fff', 
              textTransform: 'none', 
              px: 3,
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: 'none',
              borderRadius: '6px',
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            Add {adjustmentType || 'Fee'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              color: COLORS.TEXT_SECONDARY, 
              borderColor: COLORS.BORDER, 
              bgcolor: 'white',
              textTransform: 'none', 
              px: 3,
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: 'none',
              borderRadius: '6px',
              '&:hover': { bgcolor: '#f5f5f5', boxShadow: 'none' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default LateFeeDialog;
