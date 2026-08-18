import React from 'react';
import { Box, Typography, Button, DialogActions } from '@mui/material';
import { COLORS } from '../../../constants/colors';

const DepositFooter = ({ handleSave, onClose }) => {
  return (
    <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto', px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff' }}>
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
            fontWeight: 600,
            borderRadius: '8px',
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
            color: '#64748b',
            borderColor: '#cbd5e1',
            borderRadius: '8px',
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
            textTransform: 'none',
            px: 2,
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
      </Box>
    </DialogActions>
  );
};

export default DepositFooter;
