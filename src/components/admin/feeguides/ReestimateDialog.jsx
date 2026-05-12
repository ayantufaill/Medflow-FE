import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';

const ReestimateDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        The system will start re-estimating all active treatment plans.
      </DialogTitle>
      <DialogContent sx={{ pb: 2, px: 2 }}>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 6, mb: 4, color: '#333' }}>
          This process can take up to 2 hours depending on the number of treatment plans in your system.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#d9a366', textTransform: 'none', minWidth: 60, '&:hover': { bgcolor: '#c08d50' } }}
            onClick={onClose}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReestimateDialog;
