import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  Button,
  Box,
  DialogTitle,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TransferCreditConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 130000 }}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: '16px 20px',
        bgcolor: '#f3f8fd',
        color: '#000000',
        fontWeight: 600,
        fontSize: '15px'
      }}>
        Transfer Credit
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 10,
            color: '#64748B',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, pt: 4, pb: 3 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#475569', 
            textAlign: 'center', 
            mb: 2,
            mt: 2,
            fontSize: '15px',
            fontWeight: 400
          }}
        >
          Are you sure you want to transfer the outstanding credit to the patient?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: '16px 25px', borderTop: '1px solid #e0e5eb', gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            color: '#64748B', 
            borderColor: '#CBD5E1',
            textTransform: 'none', 
            px: 3,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onConfirm}
          sx={{ 
            bgcolor: '#2362EF', 
            color: '#fff', 
            textTransform: 'none', 
            px: 3,
            boxShadow: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': { bgcolor: '#1A4FCA', boxShadow: 'none' }
          }}
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferCreditConfirmationDialog;
