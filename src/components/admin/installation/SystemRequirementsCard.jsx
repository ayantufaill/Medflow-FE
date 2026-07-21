import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const SystemRequirementsCard = ({ osName, requirements }) => {
  return (
    <Paper sx={{ bgcolor: '#FFFFFF', borderRadius: '10px', boxShadow: 'none', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#F3F8FD', px: 2, py: 1.5, borderBottom: '1px solid #E2E8F0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#11223F', fontSize: '14px' }}>
          System Requirements ({osName})
        </Typography>
      </Box>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {requirements.map((req, idx) => (
          <Typography key={idx} variant="body2" sx={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.7 }}>
            • {req}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default SystemRequirementsCard;
