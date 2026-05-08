import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
} from '@mui/material';

const UsedFeeGuidesDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#003380', 
        color: '#fff', 
        textAlign: 'center', 
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 600
      }}>
        Used Fee Guides
      </DialogTitle>
      
      <DialogContent sx={{ mt: 3, px: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          {/* Left Side */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#1a3c7e', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
              Billed Fees:
            </Typography>
            <Typography sx={{ color: '#666', fontSize: '0.9rem', mb: 2 }}>
              Office Fees 2026
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#003380',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '20px',
                px: 3,
                py: 0.8,
                fontSize: '0.85rem',
                '&:hover': { bgcolor: '#002661' },
                boxShadow: 'none'
              }}
            >
              Change Billed Fee Guide
            </Button>
          </Box>

          {/* Right Side */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#1a3c7e', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
              Insurance Plan Fees:
            </Typography>
            <Typography sx={{ 
              color: '#5c7bb0', 
              fontSize: '0.85rem', 
              fontStyle: 'italic',
              lineHeight: 1.4
            }}>
              To change ins. fee guides, please edit insurance plan
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#f5f5f5', p: 1.5 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#e0e0e0', 
            color: '#444', 
            textTransform: 'none',
            borderRadius: '20px',
            px: 4,
            '&:hover': { bgcolor: '#d5d5d5' },
            boxShadow: 'none'
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsedFeeGuidesDialog;
