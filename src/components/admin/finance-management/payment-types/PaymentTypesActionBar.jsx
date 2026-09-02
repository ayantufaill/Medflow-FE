import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import syncSvg from '../../../../assets/claimicons/refreshicon.svg';

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
          startIcon={<img src={syncSvg} alt="Sync" style={{ width: 16, height: 16 }} />}
          size="small"
          variant="outlined"
          onClick={onSync}
          sx={{
            textTransform: 'none',
            color: '#1e293b',
            borderColor: '#e2e8f0',
            fontWeight: 600,
            borderRadius: 2,
            height: 36,
            px: 2,
            '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          Sync
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentTypesActionBar;
