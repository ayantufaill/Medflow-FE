import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

const PaymentTypesActionBar = ({ showDeleted, setShowDeleted, onSync }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
        Payment Types
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              size="small" 
              checked={showDeleted} 
              onChange={(e) => setShowDeleted(e.target.checked)} 
              sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Show Deleted Payment Types</Typography>}
          sx={{ m: 0 }}
        />
        <Button 
          startIcon={<SyncIcon />}
          size="small"
          variant="contained"
          onClick={onSync}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Sync
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentTypesActionBar;
