import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  Button,
} from '@mui/material';

const EmptyFeeGuideDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Copy Fee Guide from
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#333' }}>
          Name
        </Typography>
        <TextField
          size="small"
          fullWidth
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: '#4fc3f7' },
              '&:hover fieldset': { borderColor: '#4fc3f7' },
              '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#d9a366', textTransform: 'none', minWidth: 80, '&:hover': { bgcolor: '#c08d50' } }}
            onClick={onClose}
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#999', textTransform: 'none', minWidth: 80, '&:hover': { bgcolor: '#888' } }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmptyFeeGuideDialog;
