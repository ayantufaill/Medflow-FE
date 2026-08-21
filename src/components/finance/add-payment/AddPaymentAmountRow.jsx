import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, TextField } from '@mui/material';
import { COLORS } from '../../../constants/colors';

const AddPaymentAmountRow = ({
  patientAmountChecked,
  setPatientAmountChecked,
  amountType,
  setAmountType,
  displayAmount,
  setManualAmount,
  paymentMethod,
  accountCredit,
  MENU_PROPS
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Checkbox 
        size="small" 
        sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} 
        checked={patientAmountChecked} 
        onChange={(e) => setPatientAmountChecked(e.target.checked)} 
      />
      <Select 
        variant="outlined" 
        size="small" 
        value={amountType}
        onChange={(e) => {
          setAmountType(e.target.value);
          if (e.target.value === 'specific amount') setManualAmount('');
          if (e.target.value === 'patient amount') setManualAmount('');
        }}
        sx={{ 
          fontSize: '0.8125rem', width: 150, height: '28px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
        }} 
        MenuProps={MENU_PROPS}
      >
        <MenuItem value="patient amount">Patient Amount</MenuItem>
        <MenuItem value="specific amount">Specific Amount</MenuItem>
      </Select>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.8125rem', mr: 0.5, ml: 1, fontWeight: 500 }}>$</Typography>
        <TextField
          value={displayAmount}
          onChange={(e) => {
            let val = e.target.value;
            if (paymentMethod === 'Account Credit') {
              const numVal = parseFloat(val);
              if (!isNaN(numVal) && numVal > (accountCredit || 0)) {
                val = (accountCredit || 0).toString();
              }
            }
            setManualAmount(val);
          }}
          variant="outlined"
          size="small"
          sx={{ 
            width: 80,
            '& .MuiInputBase-root': { height: '28px', fontSize: '0.8125rem' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
          }}
        />
        {paymentMethod === 'Account Credit' && (
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_SECONDARY, ml: 1, mt: '1px' }}>
            Available deposit: ${(accountCredit || 0).toFixed(2)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddPaymentAmountRow;
