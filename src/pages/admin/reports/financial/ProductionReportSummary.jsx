import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductionReportSummary = () => {
  return (
    <Box sx={{ mt: 3, ml: 4 }}>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
        <Box component="span" sx={{ color: 'primary.main' }}>Net est. Production:</Box> 
        <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>Total Charge + Adj(+/-) - Est Write Off = $0.00</Box>
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
        Number of Seen Patients: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>0</Box>
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        Average Production Per Patient: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>$0.00</Box>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Switch to new</Typography>
      </Box>
    </Box>
  );
};

export default ProductionReportSummary;
