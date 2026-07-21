import React from 'react';
import { Paper, Typography } from '@mui/material';

const InstallationStepCard = ({ title, description, children }) => {
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#E2E8F0', borderRadius: '10px', boxShadow: 'none' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#11223F', mb: 1, fontSize: '14px' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: children ? 2 : 0, lineHeight: 1.6, fontSize: '13px' }}>
        {description}
      </Typography>
      {children}
    </Paper>
  );
};

export default InstallationStepCard;
