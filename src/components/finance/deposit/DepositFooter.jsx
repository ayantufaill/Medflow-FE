import React from 'react';
import { Box, Typography, Button, DialogActions } from '@mui/material';
import { COLORS } from '../../../constants/colors';

const DepositFooter = ({ handleSave, onClose }) => {
  return (
    <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto', px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
      <Typography 
        sx={{ 
          color: COLORS.ACCENT, 
          fontSize: '0.85rem', 
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        + Add description
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{ 
            bgcolor: COLORS.ACCENT, 
            color: '#fff',
            textTransform: 'none', 
            fontWeight: 500,
            boxShadow: 'none',
            px: 3,
            '&:hover': { bgcolor: '#1565c0', boxShadow: 'none' } 
          }}
        >
          Add Deposit
        </Button>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            color: COLORS.TEXT_SECONDARY, borderColor: COLORS.BORDER, bgcolor: 'white',
            textTransform: 'none', 
            fontWeight: 500,
            boxShadow: 'none',
            px: 3,
            '&:hover': { bgcolor: '#f5f5f5', boxShadow: 'none' } 
          }}
        >
          Cancel
        </Button>
      </Box>
    </DialogActions>
  );
};

export default DepositFooter;
