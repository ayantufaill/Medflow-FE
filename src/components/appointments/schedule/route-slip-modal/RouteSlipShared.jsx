import React from 'react';
import { Box } from '@mui/material';

export const SectionHeader = ({ title }) => (
  <Box
    sx={{
      backgroundColor: '#f3f8fd',
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

export const InfoRow = ({ label, value, alignValue = 'left' }) => (
  <Box sx={{ display: 'flex', width: '100%', mb: '6px', fontSize: '13px', justifyContent: 'space-between' }}>
    <Box sx={{ fontWeight: 600, color: '#334155', minWidth: '130px', mr: 2, whiteSpace: 'nowrap' }}>
      {label}:
    </Box>
    <Box sx={{ flex: 1, color: '#475569', textAlign: alignValue, whiteSpace: 'nowrap' }}>
      {value || '--'}
    </Box>
  </Box>
);

export const SectionContainer = ({ children, sx = {} }) => (
  <Box
    sx={{
      boxSizing: 'border-box',
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
