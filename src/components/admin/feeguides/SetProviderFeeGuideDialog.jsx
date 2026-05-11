import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SetProviderFeeGuideDialog = ({ open, onClose, onSave }) => {
  const [provider, setProvider] = React.useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}>
      <DialogTitle sx={{ bgcolor: '#4b71a1', color: 'white', py: 1.5, fontSize: '1rem', textAlign: 'center' }}>
        Set Provider Fee Guide
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
          Provider
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter Name"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: '#fcfcfc'
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => onSave(provider)}
          sx={{ bgcolor: '#d9a366', '&:hover': { bgcolor: '#c99356' }, textTransform: 'none', px: 4 }}
        >
          Save
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ bgcolor: '#9e9e9e', '&:hover': { bgcolor: '#8e8e8e' }, textTransform: 'none', px: 4 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetProviderFeeGuideDialog;
