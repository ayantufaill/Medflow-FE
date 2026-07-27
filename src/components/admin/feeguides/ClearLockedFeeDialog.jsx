import React, { useState } from 'react';
import { feeService } from '../../../services/fee.service';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';

const ClearLockedFeeDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await feeService.clearLockedFees();
      onClose();
    } catch (error) {
      console.error('Failed to clear locked fees:', error);
      alert('Failed to clear locked fees.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogContent sx={{ py: 4, px: 4 }}>
        <Typography variant="body1" sx={{ mb: 4, fontWeight: 600, color: '#1e293b', textAlign: 'center', fontSize: '1.1rem' }}>
          Are you sure you want to clear locked fee?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="text" 
            sx={{ 
              color: '#475569', 
              textTransform: 'none', 
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': { backgroundColor: '#f1f5f9' } 
            }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#2563eb', 
              textTransform: 'none', 
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' } 
            }}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Clearing...' : 'Proceed'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClearLockedFeeDialog;
