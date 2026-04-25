import React from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';

const InsuranceWriteOffDialog = ({ onClose }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: '#fff', 
      border: '1px solid #ccc', 
      borderRadius: '4px', 
      overflow: 'hidden', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      {/* Blue Header Bar */}
      <Box sx={{ bgcolor: '#7788bb', color: '#fff', p: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
          Insurance Write-Off invoice #24635
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Main Input Row */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#7788bb', fontWeight: 'bold' }}>
            04/15/2026
          </Typography>
          
          <Typography variant="caption" sx={{ color: '#333' }}>claim:</Typography>
          
          <Box sx={{ position: 'relative' }}>
            <Select 
              variant="outlined" 
              defaultValue="select a claim" 
              sx={{ 
                height: 24, 
                fontSize: '11px', 
                bgcolor: '#fff',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7788bb' }
              }}
            >
              <MenuItem value="select a claim" sx={{ fontSize: '11px' }}>select a claim</MenuItem>
            </Select>
          </Box>

          <Typography variant="caption" sx={{ color: '#333', ml: 1 }}>for invoice: #</Typography>
        </Stack>

        {/* Blue Bottom Border Line */}
        <Divider sx={{ borderBottom: '1.5px solid #7788bb', mt: 2, mb: 3 }} />

        {/* Action Buttons Row */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button 
            size="small" 
            variant="contained" 
            sx={{ 
              bgcolor: '#7788bb',
              color: '#fff !important',
              textTransform: 'none', 
              fontSize: '11px',
              minWidth: 70,
              borderRadius: '4px'
            }}
          >
            Adjust
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            onClick={onClose}
            sx={{ 
              bgcolor: '#9e9e9e', 
              textTransform: 'none', 
              fontSize: '11px',
              minWidth: 70,
              borderRadius: '4px',
              '&:hover': { bgcolor: '#757575' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default InsuranceWriteOffDialog;
