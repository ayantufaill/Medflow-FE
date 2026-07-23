import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CreditCardOutlined as CreditCardIcon } from '@mui/icons-material';
import InfoCard from './InfoCard';

const OnyxStripeBilling = () => {
  return (
    <InfoCard 
      title="ONYX STRIPE BILLING" 
      icon={
        <Box sx={{ bgcolor: '#EAF0FC', borderRadius: '4px', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreditCardIcon sx={{ fontSize: 16, color: '#3B63E0' }} />
        </Box>
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>
          No payment method found
        </Typography>
        <Button variant="text" sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 600, color: '#3B63E0', p: 0 }}>
          View Billing
        </Button>
      </Box>
    </InfoCard>
  );
};

export default OnyxStripeBilling;
