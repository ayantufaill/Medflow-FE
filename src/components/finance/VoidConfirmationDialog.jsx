import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

const VoidConfirmationDialog = ({ open, onClose, onConfirm, voidTarget }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#fff',
        py: 0.75,
        bgcolor: '#7788bb',
        textAlign: 'center'
      }}>
        Void Adjustment
      </DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <Typography variant="body2" sx={{ color: '#555', fontSize: '14px' }}>
          Are you sure you want to void this adjustment:
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            textTransform: 'none',
            color: '#666',
            borderColor: '#ccc'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          sx={{ 
            textTransform: 'none',
            bgcolor: '#7788bb',
            color: '#fff',
            '&:hover': {
              bgcolor: '#6577aa'
            }
          }}
        >
          Void
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoidConfirmationDialog;
