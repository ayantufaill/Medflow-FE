import React from 'react';
import { Box, Typography } from '@mui/material';

const ReportLayout = ({ title, subtitle, children, summaryFooter }) => {
  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.8rem', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {children}

      {summaryFooter && (
        <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
          {summaryFooter}
        </Box>
      )}
    </Box>
  );
};

export default ReportLayout;
