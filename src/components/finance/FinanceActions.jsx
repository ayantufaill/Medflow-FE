import React from 'react';
import { Stack, FormControlLabel, Checkbox, Typography, Button, Tooltip } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FinanceActions = ({ view, expanded, onExpandToggle }) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1.5 }}>
      {/* Ledger Filters */}
      <Stack direction="row" spacing={2}>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Include voided transactions</Typography>} />
        {view !== 'family' && view !== 'individual' && (
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Hide billing transfers</Typography>} />
        )}
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1}>
        {[
          { label: expanded ? 'Collapse Invoices' : 'Expand Invoices', variant: 'contained', hideInLedgerViews: true, action: onExpandToggle },
          { label: 'Past Statements', variant: 'contained' },
          { label: 'INS. COVERAGE', variant: 'contained', hasIcon: true },
          { label: 'Tx', variant: 'outlined', minWidth: '30px', action: () => navigate('/clinical/treatment-plan'), tooltip: 'Treatment Plan' },
        ].filter(btn => !(btn.hideInLedgerViews && (view === 'family' || view === 'individual'))).map((btn) => (
          <Tooltip title={btn.tooltip || ''} arrow>
          <Button 
            key={btn.label}
            variant={btn.variant} 
            size="small" 
            onClick={btn.action}
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
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};

export default FinanceActions;
