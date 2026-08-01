import React from 'react';
import { Typography, TextField, Button, DialogActions } from '@mui/material';
import { COLORS } from '../../../constants/colors';

const AddPaymentFooter = ({
  showDescription,
  setShowDescription,
  description,
  setDescription,
  overpayment,
  paymentAmount,
  handleApplyAndPay,
  onClose
}) => {
  return (
    <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2.5, px: 3, py: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
      {!showDescription ? (
        <Typography onClick={() => setShowDescription(true)} sx={{ color: COLORS.ACCENT, fontSize: '0.8125rem', cursor: 'pointer', mr: 'auto' }}>
          + Add description
        </Typography>
      ) : (
        <TextField 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          variant="standard" 
          autoFocus 
          sx={{ width: 250, mr: 'auto', input: { fontSize: '0.8125rem' } }} 
        />
      )}

      <Typography sx={{ color: '#4a6b96', fontWeight: 'bold', fontSize: '0.8125rem' }}>
        Overpayment: ${overpayment}
      </Typography>
      <Typography sx={{ color: '#5e9e42', fontSize: '0.8125rem', fontWeight: 500 }}>
        Payment: ${paymentAmount.toFixed(2)}
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleApplyAndPay} 
        disabled={paymentAmount <= 0}
        sx={{ 
          bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2.25, fontSize: '0.8125rem',
          '&:disabled': { cursor: 'not-allowed', bgcolor: '#e0e0e0', color: '#9e9e9e' }, 
          '&:hover': { bgcolor: '#1565c0', boxShadow: 'none' } 
        }}
      >
        Apply
      </Button>
      <Button 
        variant="outlined" 
        onClick={onClose}
        sx={{ 
          color: COLORS.TEXT_SECONDARY, borderColor: COLORS.BORDER, bgcolor: 'white', textTransform: 'none', 
          boxShadow: 'none', px: 2.25, fontSize: '0.8125rem', '&:hover': { bgcolor: '#f5f5f5' } 
        }}
      >
        Cancel
      </Button>
    </DialogActions>
  );
};

export default AddPaymentFooter;
