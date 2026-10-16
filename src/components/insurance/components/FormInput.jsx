import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const FormInput = ({ label, subLabel, required, children, labelEndAdornment, renderInput, ...props }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, mb: 0.5 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '12px', // Standardized label size
              fontWeight: 700,
              color: '#555',
              textTransform: 'uppercase'
            }}
          >
            {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
          </Typography>
          {subLabel && (
            <Typography
              component="span"
              sx={{
                fontSize: '11px',
                fontWeight: 400,
                color: '#6b7280',
                textTransform: 'none'
              }}
            >
              {subLabel}
            </Typography>
          )}
          {labelEndAdornment}
        </Box>
      )}
      {renderInput ? renderInput() : (
        <TextField
          fullWidth
          size="small"
          {...props}
          sx={{
            bgcolor: '#f8f9fc',
            '& .MuiInputBase-root': {
              height: '36px'
            },
            '& .MuiSelect-select': {
              fontSize: '14px !important',
              color: '#111827 !important',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingTop: '0 !important',
              paddingBottom: '0 !important',
              height: '100% !important',
              minHeight: 'unset !important'
            },
            '& fieldset': { borderColor: '#DFE5EC' },
            ...(props.sx || {})
          }}
        >
          {children}
        </TextField>
      )}
    </Box>
  );
};

export default FormInput;
