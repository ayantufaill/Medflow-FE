import React from 'react';
import { Box, Typography } from '@mui/material';

const ClaimManagementHeader = () => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', fontFamily: 'Inter', mb: 0.5 }}>
      Claim Management
    </Typography>
    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Inter' }}>
      Track, validate, and submit patient claims efficiently
    </Typography>
  </Box>
);

export default ClaimManagementHeader;
