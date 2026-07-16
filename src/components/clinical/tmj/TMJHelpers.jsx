import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { fontSize, fontWeight } from "../../../constants/styles";

export const getStatusIconStyle = (color) => ({
  width: 8, height: 8, borderRadius: '50%', backgroundColor: color, border: color === '#10b981' ? '3px solid #d1fae5' : '3px solid #fee2e2', mr: 1, display: 'inline-block', boxSizing: 'content-box'
});

export const CustomLabel = ({ text, subText, italic = false }) => (
  <Box>
    <Typography sx={{ 
      fontWeight: fontWeight.regular, 
      fontSize: fontSize.xs, 
      color: '#333', 
      lineHeight: 1.2,
      fontStyle: italic ? 'italic' : 'normal'
    }}>
      {text}
    </Typography>
    {subText && (
      <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontStyle: italic ? 'italic' : 'normal' }}>
        {subText}
      </Typography>
    )}
  </Box>
);

export const MMInput = ({ value, onChange }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'baseline', ml: 1 }}>
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ 
        width: 35,
        '& input': { textAlign: 'center', fontSize: fontSize.xs, padding: '2px 0' },
        '& .MuiInput-root:before': { borderBottom: '1px solid #9ca3af !important' },
        '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' }
      }}
    />
    <Typography variant="caption" sx={{ ml: 0.5, fontSize: fontSize.xs, color: '#333' }}>mm</Typography>
  </Box>
);
