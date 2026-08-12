import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { COLORS } from '../../../constants/colors';
import { PAYMENT_METHODS } from '../../../constants/financeConstants';

const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 }
    },
  },
};

const InsurancePaymentTopRow = ({
  claims,
  selectedClaim,
  setSelectedClaim,
  paymentMethod,
  setPaymentMethod,
  checkboxOptions
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
        07/15/2022
      </Typography>
      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.8125rem', fontWeight: 500, ml: 1, whiteSpace: 'nowrap' }}>
        Payment claim:
      </Typography>

      <Select 
        variant="outlined" 
        size="small"
        value={selectedClaim}
        onChange={(e) => setSelectedClaim(e.target.value)}
        sx={{ 
          fontSize: '0.8125rem', minWidth: 250, height: '28px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
        }}
        MenuProps={MENU_PROPS}
      >
        {claims.length === 0 ? (
          <MenuItem value="select a claim">select a claim</MenuItem>
        ) : (
          claims.map((claim) => (
            <MenuItem key={claim.id} value={claim.id}>
              Claim #{claim.claimNumber || claim.id} ({claim.status})
            </MenuItem>
          ))
        )}
      </Select>

      <Typography sx={{ fontSize: '0.8125rem', ml: 1 }}>with</Typography>
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
        {PAYMENT_METHODS.map((m) => (
          <MenuItem key={m} value={m}>{m}</MenuItem>
        ))}
        {/* Preserve any extra ones like 'Test Jen' that were there */}
        <MenuItem value="Test Jen">Test Jen</MenuItem>
      </Select>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
        {checkboxOptions.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox size="small" sx={{ p: 0.2, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} />
            <Typography sx={{ fontSize: '0.8125rem' }}>{item.label}</Typography>
            {item.icon && <HelpOutlineIcon sx={{ fontSize: '0.8rem', ml: 0.5, color: '#666' }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InsurancePaymentTopRow;
