import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';

const CourtesyCreditComponent = ({ adjustmentData, onSave, onCancel }) => {
  const [adjustmentType, setAdjustmentType] = useState('Un-Collected');

  // Exact options from the provided dropdown screenshot
  const options = [
    'Un-Collected',
    'Professional Courtesy',
    'Immediate Family Courtesy',
    'OON paid',
    'Sunbit Fee',
    'Courtesy 3% for cash pay',
    'Alle Rewards',
    'Uncollect: de-escalate situation',
    'No balance billing',
    'Pro bono',
    'Fee included in Invisalign treatment',
    'Downgrade',
    'Care Credit fee',
    'Employee benefit',
    'Cherry Fee',
    'HFD Fee'
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...adjustmentData,
        adjustmentType
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 600, 
      bgcolor: '#fff', 
      border: '1px solid #ccc', 
      borderRadius: '4px', 
      overflow: 'hidden'
    }}>
      {/* Purple Header Bar */}
      <Box sx={{ bgcolor: '#7e57c2', color: '#fff', p: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
          Courtesy Credit
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Main Selection Row */}
        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#7e57c2', fontWeight: 'bold', pb: 0.5 }}>
            {adjustmentData?.date || '04/15/2026'}
          </Typography>
          
          <Typography variant="caption" sx={{ color: '#7e57c2', pb: 0.5 }}>
            Adjustment Type
          </Typography>

          {/* Underlined Dropdown Menu */}
          <Box sx={{ flexGrow: 1, borderBottom: '1.5px solid #7e57c2' }}>
            <Select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              variant="standard"
              disableUnderline
              fullWidth
              sx={{ 
                fontSize: '13px', 
                height: 25,
                '& .MuiSelect-select': { pb: 0.5 }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#fff',
                    '& .MuiMenuItem-root': {
                      fontSize: '12px',
                      py: 0.5,
                      borderBottom: '1px solid #eee'
                    },
                    '& .Mui-selected': {
                      bgcolor: '#5c6bc0 !important', // Matches the blue highlight
                      color: '#fff'
                    }
                  }
                }
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>

        {/* Bottom Decorative/functional line found in legacy UI */}
        <Divider sx={{ borderBottom: '1px solid #7e57c2', opacity: 0.5, mb: 2 }} />

        {/* Action Buttons - Below Divider */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              bgcolor: '#d4c4a8', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '11px',
              '&:hover': { bgcolor: '#c5b396' }
            }}
          >
            Edit Courtesy
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleCancel}
            sx={{ 
              bgcolor: '#bdbdbd', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '11px',
              '&:hover': { bgcolor: '#9e9e9e' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CourtesyCreditComponent;
