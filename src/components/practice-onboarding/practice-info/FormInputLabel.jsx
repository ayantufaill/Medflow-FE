import React from 'react';
import { Box, Typography } from '@mui/material';

const FormInputLabel = ({ label, required }) => (
  <Typography
    variant="body2"
    sx={{
      fontWeight: 500,
      color: '#8a8f9c', // Lighter grayish tone from the mockup
      fontSize: '0.75rem',
      mb: 0.8,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: 'flex',
      alignItems: 'center'
    }}
  >
    {label}
    {required && (
      <Box component="span" sx={{ color: '#ef4444', ml: 0.3, fontWeight: 'bold' }}>
        *
      </Box>
    )}
  </Typography>
);

export default FormInputLabel;
