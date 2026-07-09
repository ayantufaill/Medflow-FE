import React from 'react';
import { Box } from '@mui/material';

export const SectionHeader = ({ title }) => (
  <Box
    sx={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: '8px 12px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '0.75rem',
      color: '#475569'
    }}
  >
    {title}
  </Box>
);

export const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: '6px', fontSize: '13px' }}>
    <Box sx={{ width: '150px', fontWeight: 600, color: '#334155' }}>
      {label}:
    </Box>
    <Box sx={{ flex: 1, color: '#475569' }}>
      {value || '--'}
    </Box>
  </Box>
);

export const SectionContainer = ({ children, sx = {} }) => (
  <Box
    sx={{
      border: '1px solid #e2e8f0',
      borderTop: 'none',
      padding: '12px',
      minHeight: '60px',
      backgroundColor: '#fff',
      ...sx
    }}
  >
    {children}
  </Box>
);
