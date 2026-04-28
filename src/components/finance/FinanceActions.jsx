import React, { useState } from 'react';
import { Stack, FormControlLabel, Checkbox, Typography, Button, Tooltip } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InsuranceCoverageDialog from './InsuranceCoverageDialog';

const FinanceActions = ({ view, expanded, onExpandToggle, onFilterChange }) => {
  const navigate = useNavigate();
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [includeVoided, setIncludeVoided] = useState(false);
  const [hideBillingTransfers, setHideBillingTransfers] = useState(false);

  const handleInsuranceCoverageClick = () => {
    setShowInsuranceDialog(true);
  };

  const handleCloseInsuranceDialog = () => {
    setShowInsuranceDialog(false);
  };

  const handleVoidedChange = (e) => {
    const newValue = e.target.checked;
    setIncludeVoided(newValue);
    if (onFilterChange) {
      onFilterChange({ includeVoided: newValue, hideBillingTransfers });
    }
  };

  const handleBillingTransfersChange = (e) => {
    const newValue = e.target.checked;
    setHideBillingTransfers(newValue);
    if (onFilterChange) {
      onFilterChange({ includeVoided, hideBillingTransfers: newValue });
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1.5 }}>
      {/* Ledger Filters */}
      <Stack direction="row" spacing={2}>
        <FormControlLabel 
          control={<Checkbox size="small" checked={includeVoided} onChange={handleVoidedChange} />} 
          label={<Typography variant="caption">Include voided transactions</Typography>} 
        />
        {view !== 'family' && view !== 'individual' && (
          <FormControlLabel 
            control={<Checkbox size="small" checked={hideBillingTransfers} onChange={handleBillingTransfersChange} />} 
            label={<Typography variant="caption">Hide billing transfers</Typography>} 
          />
        )}
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1}>
        {[
          { label: expanded ? 'Collapse Invoices' : 'Expand Invoices', variant: 'contained', hideInLedgerViews: true, action: onExpandToggle },
          // { label: 'Past Statements', variant: 'contained' },
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
              bgcolor: btn.variant === 'contained' ? '#1976d2' : 'transparent', 
              color: btn.variant === 'contained' ? '#fff' : '#1976d2',
              borderColor: '#1976d2',
              textTransform: 'none',
              minWidth: btn.minWidth || 'auto',
              display: 'flex',
              '&:hover': {
                bgcolor: btn.variant === 'contained' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)',
                borderColor: '#1565c0',
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
