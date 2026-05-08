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
  Paper,
  IconButton,
  TextField,
  InputBase,
} from '@mui/material';
import { Close } from '@mui/icons-material';

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
    <Box sx={{ width: '1100px', bgcolor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#7788bb', p: 1.5, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>
          Invoices
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <TableContainer component={Box} sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #eee', py: 1.5, color: '#ff7043', fontWeight: 500, fontSize: '0.85rem' } }}>
                <TableCell padding="checkbox">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Checkbox 
                      size="small" 
                      checked={selectedInvoices.length === invoices.length}
                      indeterminate={selectedInvoices.length > 0 && selectedInvoices.length < invoices.length}
                      onChange={handleToggleAll}
                      sx={{ p: 0 }} 
                    />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>All</Typography>
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
                <TableRow key={inv.id} sx={{ '& td': { borderBottom: '1px solid #eee', py: 1, fontSize: '0.85rem' } }}>
                  <TableCell padding="checkbox">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Checkbox 
                        size="small" 
                        checked={selectedInvoices.includes(inv.id)}
                        onChange={() => handleToggleInvoice(inv.id)}
                        sx={{ p: 0 }} 
                      />
                      <Typography variant="caption" sx={{ color: '#555', whiteSpace: 'nowrap' }}>
                        Invoice #{inv.id}: {inv.date} for {inv.patient}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: '#ff7043', fontWeight: 500 }}>${inv.amount.toFixed(2)}</TableCell>
                  <TableCell>${inv.ins.toFixed(2)}</TableCell>
                  <TableCell>${inv.writeoff.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: '#ff7043', fontWeight: 500 }}>${inv.owing.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={4} sx={{ mt: 3, mb: 1 }}>
          <RadioGroup 
            row 
            value={outstandingType} 
            onChange={(e) => setOutstandingType(e.target.value)}
          >
            <FormControlLabel 
              value="total" 
              control={<Radio size="small" />} 
              label={<Typography variant="caption" sx={{ fontWeight: 500 }}>Total Outstanding</Typography>} 
            />
            <FormControlLabel 
              value="patient" 
              control={<Radio size="small" />} 
              label={<Typography variant="caption" sx={{ fontWeight: 500 }}>Patient Outstanding</Typography>} 
            />
          </RadioGroup>
          
          {showCustomRate && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#004d40' }}>
                {isPercentage ? 'Percentage:' : 'Flate Rate:'}
              </Typography>
              <TextField
                variant="standard"
                size="small"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 0.5, color: '#004d40' }}>{isPercentage ? '%' : '$'}</Typography>,
                }}
                sx={{ 
                  width: '80px',
                  '& .MuiInput-underline:before': { borderBottomColor: '#ccc' },
                  '& .MuiInput-underline:after': { borderBottomColor: '#004d40' },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    color: '#004d40'
                  }
                }}
              />
            </Stack>
          )}

          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="contained" 
              onClick={() => onAddFee(selectedInvoices, rateValue)}
              sx={{ 
                bgcolor: '#d2b48c', 
                color: '#fff', 
                textTransform: 'none', 
                px: 3,
                boxShadow: 'none',
                borderRadius: '4px',
                '&:hover': { bgcolor: '#c4a47c' }
              }}
            >
              Add {adjustmentType || 'Fee'}
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ 
                bgcolor: '#9e9e9e', 
                color: '#fff', 
                textTransform: 'none', 
                px: 3,
                boxShadow: 'none',
                borderRadius: '4px',
                '&:hover': { bgcolor: '#8e8e8e' }
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

export default LateFeeDialog;
