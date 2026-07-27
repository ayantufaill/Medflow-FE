import React, { useState } from 'react';
import { feeService } from '../../../services/fee.service';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';

const ReestimateDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await feeService.reestimateTPlans();
      onClose();
    } catch (error) {
      console.error('Failed to reestimate treatment plans:', error);
      alert('Failed to start re-estimation.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        lineHeight: 1.3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Re-estimate Treatment Plans
      </DialogTitle>
      <DialogContent sx={{ py: 4, px: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
          The system will start re-estimating all active treatment plans.
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', mb: 4 }}>
          This process can take up to 2 hours depending on the number of treatment plans in your system.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button 
            variant="text" 
            sx={{ 
              textTransform: 'none', 
              color: '#475569', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 3, 
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
              textTransform: 'none', 
              backgroundColor: '#2563eb', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 3, 
              boxShadow: 'none', 
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' } 
            }}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'OK'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReestimateDialog;
