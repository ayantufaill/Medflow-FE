import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

const SkipInvoicesToggle = ({ skipOpenClaims, onToggle }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          Skip Invoices with open claims
        </Typography>
      </Box>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
          Do not send notifications for invoices that have open insurance claims.
        </Typography>
        <Switch 
          checked={skipOpenClaims} 
          onChange={(e) => onToggle(e.target.checked)}
          sx={{ 
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb', opacity: 1 }
          }}
        />
      </Box>
    </Box>
  );
};

export default SkipInvoicesToggle;
