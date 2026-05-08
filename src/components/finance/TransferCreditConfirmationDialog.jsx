import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  Button,
  Box,
} from '@mui/material';

const TransferCreditConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '4px',
          width: '500px',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: '#7788bb', p: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>
          Transfer Credit
        </Typography>
      </Box>
      <DialogContent sx={{ p: 3 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#1a237e', 
            textAlign: 'center', 
            mb: 4, 
            fontSize: '1rem',
            fontWeight: 400
          }}
        >
          Are you sure you want to 'transfer' the outstanding credit to the patient?
        </Typography>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button 
            variant="contained" 
            onClick={onConfirm}
            sx={{ 
              bgcolor: '#d2b48c', 
              color: '#fff', 
              textTransform: 'none', 
              px: 4,
              boxShadow: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#c4a47c' }
            }}
          >
            Transfer
          </Button>
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ 
              bgcolor: '#9e9e9e', 
              color: '#fff', 
              textTransform: 'none', 
              px: 4,
              boxShadow: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#8e8e8e' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TransferCreditConfirmationDialog;
