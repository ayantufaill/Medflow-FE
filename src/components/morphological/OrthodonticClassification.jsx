import React from 'react';
import { Box, Typography, Radio, FormControlLabel, RadioGroup, TextField, InputAdornment, Button } from '@mui/material';

const OrthodonticClassification = ({ formData, handleFieldChange, MORPHOLOGICAL_DATA }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', mb: 4 }}>
        ORTHODONTIC CLASSIFICATION
      </Typography>

      {/* Overbite & Overjet */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 4 }}>
        <Box sx={{ 
          display: 'flex', alignItems: 'center', border: '1px solid #f3f4f6', 
          borderRadius: '12px', px: 2, py: 1.5, width: '320px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <Typography sx={{ flex: 1, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
            Overbite
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TextField
              size="small"
              value={formData.overbitePercent || ''}
              onChange={(e) => handleFieldChange('overbitePercent', e.target.value)}
              sx={{
                width: 60,
                '& .MuiOutlinedInput-root': {
                  height: 32,
                  borderRadius: '6px',
                  bgcolor: '#fff',
                  '& fieldset': { borderColor: '#e5e7eb' },
                  '&:hover fieldset': { borderColor: '#d1d5db' }
                },
                '& input': { textAlign: 'center', fontSize: '0.85rem', p: 0 }
              }}
            />
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', width: 20 }}>%</Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', alignItems: 'center', border: '1px solid #f3f4f6', 
          borderRadius: '12px', px: 2, py: 1.5, width: '320px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <Typography sx={{ flex: 1, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
            Overjet
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TextField
              size="small"
              value={formData.overjet || ''}
              onChange={(e) => handleFieldChange('overjet', e.target.value)}
              sx={{
                width: 60,
                '& .MuiOutlinedInput-root': {
                  height: 32,
                  borderRadius: '6px',
                  bgcolor: '#fff',
                  '& fieldset': { borderColor: '#e5e7eb' },
                  '&:hover fieldset': { borderColor: '#d1d5db' }
                },
                '& input': { textAlign: 'center', fontSize: '0.85rem', p: 0 }
              }}
            />
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', width: 24 }}>mm</Typography>
          </Box>
        </Box>
      </Box>

      {/* Molar Classification */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600, pt: 1 }}>
          Molar Classification
        </Typography>
        <Box>
          {['Right', 'Left'].map((side, index) => (
            <Box key={side} sx={{ display: 'flex', alignItems: 'center', mb: index === 0 ? 1 : 0 }}>
              <Typography sx={{ width: 60, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                {side}
              </Typography>
              <RadioGroup 
                row
                value={formData[index === 0 ? 'molarRight' : 'molarLeft'] || ''}
                onChange={(e) => handleFieldChange(index === 0 ? 'molarRight' : 'molarLeft', e.target.value)}
              >
                {MORPHOLOGICAL_DATA.molarClassification.map((option) => (
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

      {/* Primary Molar Relationship */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600, pt: 1 }}>
          Primary Molar Relationship
        </Typography>
        <Box>
          {['Right', 'Left'].map((side, index) => (
            <Box key={side} sx={{ display: 'flex', alignItems: 'center', mb: index === 0 ? 1 : 0 }}>
              <Typography sx={{ width: 60, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                {side}
              </Typography>
              <RadioGroup 
                row
                value={formData[index === 0 ? 'primaryMolarRight' : 'primaryMolarLeft'] || ''}
                onChange={(e) => handleFieldChange(index === 0 ? 'primaryMolarRight' : 'primaryMolarLeft', e.target.value)}
              >
                {MORPHOLOGICAL_DATA.primaryMolarRelationship.map((option) => (
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

      {/* Anterior Tooth Shape */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
          Anterior Tooth Shape
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {MORPHOLOGICAL_DATA.anteriorToothShape.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleFieldChange('anteriorToothShape', option.value)}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                px: 3,
                py: 0.5,
                fontSize: '0.85rem',
                fontWeight: formData.anteriorToothShape === option.value ? 600 : 500,
                color: formData.anteriorToothShape === option.value ? '#fff' : '#4b5563',
                bgcolor: formData.anteriorToothShape === option.value ? '#2563eb' : '#fff',
                border: formData.anteriorToothShape === option.value ? '1px solid #2563eb' : '1px solid #d1d5db',
                '&:hover': {
                  bgcolor: formData.anteriorToothShape === option.value ? '#1d4ed8' : '#f3f4f6'
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Midline */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
          Midline
        </Typography>
        <RadioGroup 
          row
          value={formData.midline || ''}
          onChange={(e) => handleFieldChange('midline', e.target.value)}
          sx={{ alignItems: 'center' }}
        >
          {MORPHOLOGICAL_DATA.midline.map((option) => (
            <Box key={option.value} sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <FormControlLabel
                value={option.value}
                control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>{option.label}</Typography>}
                sx={{ mr: option.value === 'left' ? 1 : 0 }}
              />
              {option.value === 'left' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                  <TextField
                    size="small"
                    value={formData.midlineMm || ''}
                    onChange={(e) => handleFieldChange('midlineMm', e.target.value)}
                    sx={{
                      width: 50,
                      '& .MuiOutlinedInput-root': {
                        height: 32,
                        borderRadius: '6px',
                        bgcolor: '#fff',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' }
                      },
                      '& input': { textAlign: 'center', fontSize: '0.85rem', p: 0 }
                    }}
                  />
                  <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>mm</Typography>
                </Box>
              )}
            </Box>
          ))}
        </RadioGroup>
      </Box>

      {/* Axial Inclination */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ width: 220, fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
          Axial Inclination
        </Typography>
        <RadioGroup 
          row
          value={formData.axialInclination || ''}
          onChange={(e) => handleFieldChange('axialInclination', e.target.value)}
        >
          {MORPHOLOGICAL_DATA.axialInclination.map((option) => (
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
    </Box>
  );
};

export default OrthodonticClassification;
