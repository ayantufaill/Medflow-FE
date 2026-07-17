import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionContainer = ({ title, icon: Icon, children }) => {
  return (
    <Box sx={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      bgcolor: '#fff',
      mb: 4,
      overflow: 'hidden'
    }}>
      <Box sx={{
        bgcolor: '#f8fafc',
        px: 3,
        py: 1.5,
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        {Icon && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: '#eff6ff', // Light blue background for the icon circle
            color: '#3b82f6'
          }}>
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        )}
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 4 }}>
        {children}
      </Box>
    </Box>
  );
};

export default SectionContainer;
