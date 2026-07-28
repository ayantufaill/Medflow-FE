import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';

const AddOpenEdgeAutoDialog = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ 
          backgroundColor: '#fff',
          color: '#0f172a',
          fontSize: '1.1rem',
          fontWeight: 700,
          py: 3,
          px: 4,
          borderBottom: '1px solid #f1f5f9'
        }}>
          Connect OpenEdge Device
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, fontSize: '0.9rem' }}>
            The system will automatically search for and connect to active OpenEdge devices on your local network. Please ensure the device is powered on and connected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 0, gap: 1.5 }}>
          <Button 
            onClick={onClose}
            variant="text"
            sx={{
              textTransform: 'none',
              color: '#475569',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
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
          >
            Start Scan & Connect
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOpenEdgeAutoDialog;
