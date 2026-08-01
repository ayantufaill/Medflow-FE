import React from 'react';
import { Box, Typography } from '@mui/material';

const DepositAmount = ({
  depositAmount,
  setDepositAmount
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
      <Typography 
        sx={{ 
          fontSize: '0.85rem', 
          color: '#2c3e50', 
          fontWeight: 500 
        }}
      >
        Deposit Amount:
      </Typography>
      
      <Box 
        sx={{ 
          border: '1.5px dashed #666',
          borderRadius: '4px',
          px: 1.5,
          py: 0.5,
          minWidth: '70px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'transparent'
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a237e', mr: 0.5 }}>$</Typography>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#1a237e',
            textAlign: 'center',
            width: '60px',
            fontFamily: 'inherit'
          }}
        />
      </Box>
    </Box>
  );
};

export default DepositAmount;
