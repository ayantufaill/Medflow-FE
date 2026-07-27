import React from 'react';
import { TextField, Typography } from '@mui/material';
import FormSection from './FormSection';

const DisclaimerSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Disclaimer" 
      show={show} 
      onToggle={onToggle}
    >
      <TextField
        multiline
        rows={4}
        fullWidth
        value={formSettings.disclaimerText}
        onChange={(e) => handleSettingChange('disclaimerText', e.target.value)}
        sx={{ 
          '& .MuiOutlinedInput-root': { fontSize: '0.85rem' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
        }}
      />
      <Typography sx={{ color: '#2563eb', fontSize: '0.8rem', mt: 1, cursor: 'pointer', fontWeight: 500 }}>
        + add new paragraph
      </Typography>
    </FormSection>
  );
};

export default DisclaimerSection;
