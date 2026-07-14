import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Radio } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ToothPositionCard = ({ formData, handleFieldChange, MORPHOLOGICAL_DATA, handleAddTeeth, handleShowPhotos }) => {
  return (
    <Box sx={{ bgcolor: '#F1F6FA', borderRadius: '12px', p: '24px', border: '1px solid #e5e7eb', width: '100%', maxWidth: '402.13px', height: '392.8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', ml: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
          Tooth Position
        </Typography>
        <FormControlLabel
          control={
            <Radio
              size="small"
              checked={formData.noFindings}
              onClick={() => handleFieldChange('noFindings', !formData.noFindings)}
              sx={{ p: 0.5, '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>NO FINDINGS</Typography>}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, ...(formData.noFindings && { opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }) }}>
        {MORPHOLOGICAL_DATA.toothPosition.map((item) => {
          const isActive = formData.toothPosition[item.id]?.value === 'select';
          const isNoneActive = formData.toothPosition[item.id]?.value === 'none' || !isActive;
          
          return (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.85rem', color: isActive ? '#2563eb' : '#374151', fontWeight: isActive ? 600 : 500 }}>
                {item.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="small"
                  disableRipple
                  onClick={() => {
                    const newPos = { ...formData.toothPosition };
                    newPos[item.id] = { ...newPos[item.id], value: 'none' };
                    handleFieldChange('toothPosition', newPos);
                  }}
                  sx={{
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    py: 0.25,
                    px: 1.5,
                    minWidth: 'auto',
                    color: isNoneActive ? '#111827' : '#9ca3af',
                    bgcolor: isNoneActive ? '#fff' : 'transparent',
                    border: isNoneActive ? '1px solid #d1d5db' : '1px solid transparent',
                    borderRadius: '16px',
                    '&:hover': { bgcolor: isNoneActive ? '#f9fafb' : 'transparent' }
                  }}
                >
                  NONE
                </Button>
                <Button
                  size="small"
                  disableElevation
                  onClick={() => {
                    const newPos = { ...formData.toothPosition };
                    newPos[item.id] = { ...newPos[item.id], value: 'select' };
                    handleFieldChange('toothPosition', newPos);
                    handleAddTeeth(item.id);
                  }}
                  sx={{
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    py: 0.5,
                    px: 1.5,
                    minWidth: '72px',
                    color: isActive ? '#fff' : '#3b82f6',
                    bgcolor: isActive ? '#2563eb' : '#eff6ff',
                    border: isActive ? '1px solid #2563eb' : '1px solid #bfdbfe',
                    borderRadius: '6px',
                    '&:hover': { bgcolor: isActive ? '#1d4ed8' : '#dbeafe' }
                  }}
                >
                  SELECT
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<PhotoCameraIcon sx={{ fontSize: 20 }} />}
        onClick={handleShowPhotos}
        sx={{
          mt: 4,
          textTransform: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          py: 1,
          bgcolor: '#3b82f6',
          boxShadow: 'none',
          borderRadius: '8px',
          '&:hover': { bgcolor: '#2563eb', boxShadow: 'none' }
        }}
      >
        Show Patient Photos
      </Button>
    </Box>
  );
};

export default ToothPositionCard;
