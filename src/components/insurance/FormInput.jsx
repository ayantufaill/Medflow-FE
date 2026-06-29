import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const FormInput = ({ label, required, children, labelEndAdornment, ...props }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Typography 
            sx={{ 
              fontSize: '12px', // Standardized label size
              fontWeight: 700, 
              color: '#555', 
              textTransform: 'uppercase' 
            }}
          >
            {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
          </Typography>
          {labelEndAdornment}
        </Box>
      )}
      <TextField
        fullWidth
        size="small"
        {...props}
        sx={{ 
          bgcolor: '#f8f9fc',
          '& .MuiInputBase-root': { 
            fontSize: '14px', // Standardized input text size
            height: '36px' 
          },
          '& fieldset': { borderColor: '#DFE5EC' },
          ...(props.sx || {})
        }}
      >
        {children}
      </TextField>
    </Box>
  );
};

export default FormInput;
