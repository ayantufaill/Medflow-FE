import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { PAYMENT_METHODS } from '../../../constants/financeConstants';

const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      zIndex: 1600,
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 }
    },
  },
};

const DepositTopRow = ({
  depositType,
  fromPatient,
  setFromPatient,
  paymentMethod,
  setPaymentMethod,
  toAccount,
  setToAccount,
  policy,
  setPolicy
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      flexWrap: 'nowrap', 
      gap: 1.5, 
      borderBottom: `1px solid ${COLORS.BORDER}`, 
      pb: 1.5,
      mb: 2 
    }}>
      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        04/15/2026
      </Typography>
      
      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>
        {depositType === 'insurance-deposit' ? 'Insurance Deposit from' : 'Deposit #24634 from'}
      </Typography>

      <Select
        variant="outlined"
        size="small"
        value={fromPatient}
        onChange={(e) => setFromPatient(e.target.value)}
        sx={{ 
          fontSize: '0.8125rem', minWidth: 100, height: '28px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
        }}
        MenuProps={MENU_PROPS}
      >
        <MenuItem value={fromPatient}>{fromPatient}</MenuItem>
      </Select>

      <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>with</Typography>

      <Select
        variant="outlined"
        size="small"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        sx={{ 
          fontSize: '0.8125rem', minWidth: 120, height: '28px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
        }}
        MenuProps={MENU_PROPS}
      >
        {PAYMENT_METHODS.map(method => (
          <MenuItem key={method} value={method}>{method}</MenuItem>
        ))}
      </Select>

      <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>to</Typography>

      <Select
        variant="outlined"
        size="small"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
        displayEmpty
        sx={{ 
          fontSize: '0.8125rem', minWidth: 120, height: '28px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
        }}
        MenuProps={MENU_PROPS}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="account1">Account 1</MenuItem>
        <MenuItem value="account2">Account 2</MenuItem>
      </Select>

      {depositType === 'insurance-deposit' && (
        <>
          <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>Policy</Typography>

          <Select
            variant="outlined"
            size="small"
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            displayEmpty
            sx={{ 
              fontSize: '0.8125rem', minWidth: 120, height: '28px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
            }}
            MenuProps={MENU_PROPS}
          >
            <MenuItem value=""><em>Select Policy</em></MenuItem>
            <MenuItem value="policy1">Policy 1</MenuItem>
            <MenuItem value="policy2">Policy 2</MenuItem>
          </Select>
        </>
      )}
    </Box>
  );
};

export default DepositTopRow;
