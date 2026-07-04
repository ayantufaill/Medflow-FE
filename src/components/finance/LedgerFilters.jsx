import React from 'react';
import { Box, Typography } from '@mui/material';

const LedgerFilters = ({ view, filters, onFilterChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 2, px: 1 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={filters.includeVoided} 
          onChange={(e) => onFilterChange({ includeVoided: e.target.checked })} 
        />
        <Typography variant="caption">Include voided transactions</Typography>
      </label>
      {view !== 'family' && view !== 'individual' && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={filters.hideBillingTransfers} 
            onChange={(e) => onFilterChange({ hideBillingTransfers: e.target.checked })} 
          />
          <Typography variant="caption">Hide billing transfers</Typography>
        </label>
      )}
    </Box>
  );
};

export default LedgerFilters;
