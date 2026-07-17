import React from 'react';
import { Box, Typography, Radio, Checkbox, FormControlLabel, RadioGroup } from '@mui/material';

const ShortMorphologicalAnalysis = ({ formData, handleFieldChange, MORPHOLOGICAL_DATA }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', mb: 3 }}>
        SHORT MORPHOLOGICAL ANALYSIS
      </Typography>

      {/* Canine Classification */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600, pt: 1 }}>
          Canine Classification
        </Typography>
        <Box>
          {['Right', 'Left'].map((side, index) => (
            <Box key={side} sx={{ display: 'flex', alignItems: 'center', mb: index === 0 ? 1 : 0 }}>
              <Typography sx={{ width: 60, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                {side}
              </Typography>
              <RadioGroup 
                row
                value={formData[index === 0 ? 'canineRight' : 'canineLeft'] || ''}
                onChange={(e) => handleFieldChange(index === 0 ? 'canineRight' : 'canineLeft', e.target.value)}
              >
                {MORPHOLOGICAL_DATA.canineClassification.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563eb' } }} />}
                    label={<Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>{option.label}</Typography>}
                    sx={{ mr: 4 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Posterior Crossbite */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
          Posterior Crossbite
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {MORPHOLOGICAL_DATA.posteriorCrossbite.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  size="small"
                  checked={formData.posteriorCrossbite.includes(option.value)}
                  onChange={(e) => {
                    const current = formData.posteriorCrossbite;
                    if (e.target.checked) {
                      handleFieldChange('posteriorCrossbite', [...current, option.value]);
                    } else {
                      handleFieldChange('posteriorCrossbite', current.filter(v => v !== option.value));
                    }
                  }}
                  sx={{ '&.Mui-checked': { color: '#2563eb' } }}
                />
              }
              label={<Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>{option.label}</Typography>}
              sx={{ mr: 2 }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ShortMorphologicalAnalysis;
