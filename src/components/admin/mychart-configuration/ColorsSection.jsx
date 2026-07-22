import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
} from '@mui/material';

const colorMapping = [
  { label: 'Primary Font Color', key: 'primaryFontColor' },
  { label: 'Secondary Font Color', key: 'secondaryFontColor' },
  { label: 'Page Background Color', key: 'pageBackgroundColor' },
  { label: 'Section Background Color', key: 'sectionBackgroundColor' },
  { label: 'Primary Color', key: 'primaryColor' },
  { label: 'Secondary Color', key: 'secondaryColor' },
];

const ColorsSection = ({ colors, onColorChange, onResetColors }) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Colors</Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onResetColors}
          sx={{ textTransform: 'none' }}
        >
          Reset Colors
        </Button>
      </Box>
      
      {colorMapping.map(({ label, key }) => (
        <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="body2">{label}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              {(colors[key] || '#ffffff').toUpperCase()}
            </Typography>
            <input
              type="color"
              value={colors[key] || '#ffffff'}
              onChange={(e) => onColorChange(key, e.target.value)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '28px',
                height: '24px',
                padding: 0,
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />
    </Paper>
  );
};

export default ColorsSection;
