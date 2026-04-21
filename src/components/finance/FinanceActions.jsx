import React from 'react';
import { Stack, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

const FinanceActions = ({ view }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1.5 }}>
      {/* Ledger Filters */}
      <Stack direction="row" spacing={2}>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Include voided transactions</Typography>} />
        {view !== 'family' && (
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Hide billing transfers</Typography>} />
        )}
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1}>
        {[
          { label: 'Expand Invoices', variant: 'contained', hideInFamily: true },
          { label: 'Past Statements', variant: 'contained' },
          { label: 'INS. COVERAGE', variant: 'contained', hasIcon: true },
          { label: 'Tx', variant: 'outlined', minWidth: '30px' },
        ].filter(btn => !(btn.hideInFamily && view === 'family')).map((btn) => (
          <Button 
            key={btn.label}
            variant={btn.variant} 
            size="small" 
            sx={{ 
              bgcolor: btn.variant === 'contained' ? '#5c6bc0' : 'transparent', 
              color: btn.variant === 'contained' ? '#fff' : '#5c6bc0',
              borderColor: '#5c6bc0',
              textTransform: 'none',
              minWidth: btn.minWidth || 'auto',
              display: 'flex',
              '&:hover': {
                bgcolor: btn.variant === 'contained' ? '#3f51b5' : 'rgba(92, 107, 192, 0.04)',
                borderColor: '#3f51b5',
              }
            }}
          >
            {btn.label} {btn.hasIcon && <ArrowDropDown />}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default FinanceActions;
