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

const CourtesyCreditComponent = ({ adjustmentData, onSave, onCancel, onClose, showAmountSection = true }) => {
  const [adjustmentType, setAdjustmentType] = useState('Un-Collected');
  const [creditAmount, setCreditAmount] = useState('0.00');
  
  // Determine button label based on context
  const buttonLabel = showAmountSection ? 'Add Courtesy' : 'Edit Courtesy';

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
        adjustmentType,
        creditAmount: parseFloat(creditAmount) || 0,
        date: adjustmentData?.date || '04/15/2026'
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
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
      {/* Blue Header Bar */}
      <Box sx={{ bgcolor: '#7788bb', color: '#fff', p: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
          Courtesy Credit
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Main Selection Row */}
        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 'bold', pb: 0.5 }}>
            {adjustmentData?.date || '04/15/2026'}
          </Typography>
          
          <Typography variant="caption" sx={{ color: '#5c6bc0', pb: 0.5 }}>
            Adjustment Type
          </Typography>

          {/* Underlined Dropdown Menu */}
          <Box sx={{ flexGrow: 1, borderBottom: '1.5px solid #7788bb' }}>
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

        {/* Courtesy Credit Amount - Only show when showAmountSection is true */}
        {showAmountSection && (
          <>
            {/* Courtesy Credit Amount */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
              <Typography 
                sx={{ 
                  fontSize: '0.85rem', 
                  color: '#2c3e50', 
                  fontWeight: 500 
                }}
              >
                Courtesy Credit Amount:
              </Typography>
              
              <Box 
                sx={{ 
                  border: '1.5px dashed #666',
                  borderRadius: '2px',
                  px: 1,
                  py: 0.5,
                  minWidth: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'transparent'
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1a237e', mr: 0.5 }}>$</Typography>
                <input
                  type="text"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#1a237e',
                    textAlign: 'center',
                    width: '60px',
                    fontFamily: 'inherit'
                  }}
                />
              </Box>
            </Box>
          </>
        )}

        {/* Bottom Decorative/functional line found in legacy UI */}
        <Divider sx={{ borderBottom: '1px solid #7788bb', opacity: 0.5, mb: 2 }} />

        {/* Add Description and Actions - Below Divider */}
        {showAmountSection && (
          <Typography 
            sx={{ 
              color: '#5c7cb6', 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
              mb: 2
            }}
          >
            + Add description
          </Typography>
        )}

        {/* Action Buttons - Always visible */}
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
            {buttonLabel}
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
