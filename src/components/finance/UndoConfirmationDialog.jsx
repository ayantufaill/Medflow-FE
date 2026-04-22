import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

const UndoConfirmationDialog = ({ open, onClose, onConfirm }) => {
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
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#333',
        pb: 1
      }}>
        Undo Adjustment
      </DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <Typography variant="body2" sx={{ color: '#555', fontSize: '14px' }}>
          Are you sure you want to undo? This will zero out the adjustment.
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
            bgcolor: '#d32f2f',
            '&:hover': {
              bgcolor: '#b71c1c'
            }
          }}
        >
          Undo Adjustments
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UndoConfirmationDialog;
