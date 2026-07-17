import React from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import { COLORS } from '../../constants/colors';

const FlagOption = ({ label, color, checked, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <Checkbox 
        size="small" 
        checked={checked || false}
        onChange={() => onChange(label)}
        sx={{ p: 0.5, mr: 1, color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} 
      />
      <Box sx={{ width: 22, height: 22, bgcolor: color, borderRadius: '4px', mr: 1.5, flexShrink: 0 }} />
      <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_BODY }}>
        {label}
      </Typography>
    </Box>
  );
};

export default FlagOption;
