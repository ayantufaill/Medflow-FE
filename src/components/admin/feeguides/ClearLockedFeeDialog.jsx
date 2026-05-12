import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';

const ClearLockedFeeDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
    >
      <DialogContent sx={{ py: 3, px: 2 }}>
        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, color: '#333', textAlign: 'center' }}>
          Are you sure you want to clear locked fee?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#d9a366', 
              textTransform: 'none', 
              minWidth: 90,
              fontSize: '0.875rem',
              '&:hover': { bgcolor: '#c08d50' } 
            }}
            onClick={onClose}
          >
            Proceed
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#999', 
              textTransform: 'none', 
              minWidth: 90,
              fontSize: '0.875rem',
              '&:hover': { bgcolor: '#888' } 
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClearLockedFeeDialog;
