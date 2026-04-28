import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';

const MembershipAdjustmentDialog = ({ onClose }) => {
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
          Membership Adjustment
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Placeholder for middle content if needed later */}
        <Box sx={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Typography variant="caption" sx={{ color: '#999' }}>
             Patient has no active Membership Plan.
           </Typography>
        </Box>

        {/* Footer with Description and Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer', fontWeight: 500 }}>
            + Add description
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                bgcolor: '#7788bb', 
                textTransform: 'none', 
                fontSize: '11px',
                px: 2,
                '&:hover': { bgcolor: '#6577aa' } 
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
                px: 2,
                '&:hover': { bgcolor: '#757575' } 
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default MembershipAdjustmentDialog;
