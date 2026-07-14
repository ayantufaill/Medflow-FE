import React from 'react';
import { Box, Typography } from '@mui/material';

const ClaimManagementHeader = () => (
  <Box sx={{ borderBottom: '1px solid #e0e6ed', pb: 1, mb: 2 }}>
    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
      Claim Management
    </Typography>
  </Box>
);

export default ClaimManagementHeader;
