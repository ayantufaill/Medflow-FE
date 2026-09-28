import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, TextField } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';
import { PAYMENT_METHODS } from '../../../constants/financeConstants';

const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      maxHeight: 250,
      overflowY: 'auto',
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
  checkboxOptions,
  chequeNo = '',
  setChequeNo,
  branchNo = '',
  setBranchNo,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {dayjs().format('MM/DD/YYYY')}
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

      <Typography sx={{ fontSize: '0.8125rem', ml: 1.5, whiteSpace: 'nowrap' }}>Cheque #:</Typography>
      <TextField
        variant="outlined"
        size="small"
        value={chequeNo}
        onChange={(e) => setChequeNo?.(e.target.value)}
        placeholder=""
        sx={{
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            height: '28px',
            fontSize: '0.8125rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT },
          },
          '& .MuiOutlinedInput-input': { py: '4px', px: '8px' },
        }}
      />

      <Typography sx={{ fontSize: '0.8125rem', ml: 1.5, whiteSpace: 'nowrap' }}>Bank/Branch #:</Typography>
      <TextField
        variant="outlined"
        size="small"
        value={branchNo}
        onChange={(e) => setBranchNo?.(e.target.value)}
        placeholder=""
        sx={{
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            height: '28px',
            fontSize: '0.8125rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT },
          },
          '& .MuiOutlinedInput-input': { py: '4px', px: '8px' },
        }}
      />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2.5 }}>
        {checkboxOptions.map((item) => (
          <Box
            key={item.label}
            onClick={() => item.onChange?.({ target: { checked: !item.checked } })}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
          >
            <Checkbox
              size="small"
              checked={Boolean(item.checked)}
              onChange={(e) => {
                e.stopPropagation();
                item.onChange?.(e);
              }}
              sx={{ p: 0.2, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
            />
            <Typography sx={{ fontSize: '0.8125rem' }}>{item.label}</Typography>
            {item.icon && <HelpOutlineIcon sx={{ fontSize: '0.8rem', ml: 0.5, color: '#666' }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InsurancePaymentTopRow;
