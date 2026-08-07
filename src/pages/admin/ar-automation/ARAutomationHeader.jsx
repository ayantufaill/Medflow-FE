import React from 'react';
import { Box, Typography } from '@mui/material';

const ARAutomationHeader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
        AR Automation
      </Typography>
    </Box>
  );
};

export default ARAutomationHeader;
