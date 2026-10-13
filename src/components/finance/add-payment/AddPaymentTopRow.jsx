import React from 'react';
import { Box, Typography, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';
import { PAYMENT_METHODS } from '../../../constants/financeConstants';
import { OutlinedSelect } from '../../patients/form-components/formInputs';

const AddPaymentTopRow = ({
  selectedPatient,
  setSelectedPatient,
  paymentMethod,
  setPaymentMethod,
  addFamilyCredit,
  setAddFamilyCredit,
  MENU_PROPS,
}) => {
  const greenText = COLORS.TEXT_PRIMARY;
  const paymentMethods = PAYMENT_METHODS.filter((method) => method !== 'Insurance Check');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography sx={{ color: greenText, fontSize: '0.8125rem', fontWeight: 500 }}>
        {dayjs().format('MM/DD/YYYY')}
      </Typography>
      <Typography sx={{ color: greenText, fontSize: '0.8125rem' }}>Payment</Typography>
      <Typography sx={{ fontSize: '0.8125rem' }}>from</Typography>
      
      <OutlinedSelect
        value={selectedPatient} 
        onChange={(e) => setSelectedPatient(e.target.value)}
        sx={{
          width: 150,
          '& .MuiOutlinedInput-root': { height: '32px' },
          '& .MuiSelect-select': { py: 0, fontSize: '0.8125rem' }
        }}
        SelectProps={{ MenuProps: MENU_PROPS }}
      >
        <MenuItem value={selectedPatient}>{selectedPatient}</MenuItem>
      </OutlinedSelect>

      <Typography sx={{ fontSize: '0.8125rem', ml: 1 }}>with</Typography>
      
      <OutlinedSelect
        value={paymentMethod} 
        onChange={(e) => setPaymentMethod(e.target.value)}
        sx={{
          width: 120,
          '& .MuiOutlinedInput-root': { height: '32px' },
          '& .MuiSelect-select': { py: 0, fontSize: '0.8125rem' }
        }}
        SelectProps={{ MenuProps: MENU_PROPS }}
      >
        {paymentMethods.map((m) => (
          <MenuItem key={m} value={m}>{m}</MenuItem>
        ))}
      </OutlinedSelect>

      {paymentMethod === 'Account Credit' && (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={addFamilyCredit}
              onChange={(e) => setAddFamilyCredit(e.target.checked)}
              sx={{ p: 0.5, color: '#94a3b8', '&.Mui-checked': { color: '#60a5fa' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.8125rem', color: greenText }}>Add family credit</Typography>}
          sx={{ ml: 1, mr: 0 }}
        />
      )}

      {paymentMethod === 'Patient Check' && (
        <>
          <Typography sx={{ fontSize: '0.8125rem', ml: 2 }}>Cheque #:</Typography>
          <TextField 
            variant="outlined" 
            size="small" 
            sx={{ 
              width: 80, mx: 1,
              '& .MuiInputBase-root': { height: '28px', fontSize: '0.8125rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
            }} 
          />
          <Typography sx={{ fontSize: '0.8125rem', ml: 1 }}>Bank/Branch #:</Typography>
          <TextField 
            variant="outlined" 
            size="small" 
            sx={{ 
              width: 100, mx: 1,
              '& .MuiInputBase-root': { height: '28px', fontSize: '0.8125rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
            }} 
          />
        </>
      )}
    </Box>
  );
};

export default AddPaymentTopRow;
