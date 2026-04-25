import React, { useState } from 'react';
import { Stack, FormControlLabel, Checkbox, Typography, Button, Tooltip } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InsuranceCoverageDialog from './InsuranceCoverageDialog';

const FinanceActions = ({ view, expanded, onExpandToggle }) => {
  const navigate = useNavigate();
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);

  const handleInsuranceCoverageClick = () => {
    setShowInsuranceDialog(true);
  };

  const handleCloseInsuranceDialog = () => {
    setShowInsuranceDialog(false);
  };

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
          { label: 'INS. COVERAGE', variant: 'contained', hasIcon: true, action: handleInsuranceCoverageClick },
          { label: 'Tx', variant: 'outlined', minWidth: '30px', action: () => navigate('/clinical/treatment-plan'), tooltip: 'Treatment Plan' },
        ].filter(btn => !(btn.hideInLedgerViews && (view === 'family' || view === 'individual'))).map((btn) => (
          <Tooltip title={btn.tooltip || ''} arrow>
          <Button 
            key={btn.label}
            variant={btn.variant} 
            size="small" 
            onClick={btn.action}
            sx={{ 
              bgcolor: btn.variant === 'contained' ? '#d4a537' : 'transparent', 
              color: btn.variant === 'contained' ? '#fff' : '#d4a537',
              borderColor: '#d4a537',
              textTransform: 'none',
              minWidth: btn.minWidth || 'auto',
              display: 'flex',
              '&:hover': {
                bgcolor: btn.variant === 'contained' ? '#c4942d' : 'rgba(212, 165, 55, 0.04)',
                borderColor: '#c4942d',
              }
            }}
          >
            {btn.label} {btn.hasIcon && <ArrowDropDown />}
          </Button>
          </Tooltip>
        ))}
      </Stack>

      {/* Insurance Coverage Dialog */}
      <InsuranceCoverageDialog 
        open={showInsuranceDialog} 
        onClose={handleCloseInsuranceDialog} 
      />
    </Stack>
  );
};

export default FinanceActions;
