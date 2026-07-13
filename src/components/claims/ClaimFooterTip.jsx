import React from 'react';
import { Box, Typography } from '@mui/material';
import alertIcon from '../../assets/claimicons/alerticon.svg';

const ClaimFooterTip = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.8,
      mt: 1.5,
      py: 1,
      px: 1.5,
    }}
  >
    <Box component="img" src={alertIcon} alt="tip" sx={{ width: 14, height: 14, opacity: 0.6 }} />
    <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 400 }}>
      Tip: Fix all validation errors, then select claims and click Send Claims to submit them electronically.
    </Typography>
  </Box>
);

export default ClaimFooterTip;
