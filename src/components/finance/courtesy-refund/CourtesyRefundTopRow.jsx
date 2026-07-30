import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { COLORS } from '../../../constants/colors';

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

const CourtesyRefundTopRow = ({
  fromPatient,
  setFromPatient,
  paymentMethod,
  setPaymentMethod,
  toAccount,
  setToAccount,
  accountCredit,
  setAccountCredit
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
        Courtesy Refund #24633 from
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
        <MenuItem value="Do not use">Do not use</MenuItem>
        <MenuItem value="Cash">Cash</MenuItem>
        <MenuItem value="Credit Card">Credit Card</MenuItem>
        <MenuItem value="Check">Check</MenuItem>
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

      <FormControlLabel 
        control={
          <Checkbox 
            size="small" 
            checked={accountCredit}
            onChange={(e) => setAccountCredit(e.target.checked)}
            sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
          />
        } 
        label={<Typography sx={{ fontSize: '0.85rem' }}>Account Credit</Typography>} 
        sx={{ ml: 1, mr: 0 }}
      />
    </Box>
  );
};

export default CourtesyRefundTopRow;
