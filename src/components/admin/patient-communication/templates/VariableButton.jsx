import React from 'react';
import { Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const VariableButton = ({ label }) => (
  <Box sx={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    border: '1px solid #E5E9F2', 
    borderRadius: '20px', 
    px: 1.5, 
    py: 0.5, 
    mr: 1, 
    mb: 1, 
    cursor: 'pointer',
    backgroundColor: '#FBFCFE',
    '&:hover': { 
      backgroundColor: '#F0F5FF', 
      borderColor: '#3B82F6',
      color: '#3B82F6'
    },
    transition: 'all 0.15s'
  }}>
    <Typography sx={{ fontSize: '0.7rem', color: 'inherit', fontWeight: 500 }}>{label}</Typography>
    <AddIcon sx={{ fontSize: 14, ml: 0.5, color: 'inherit' }} />
  </Box>
);
