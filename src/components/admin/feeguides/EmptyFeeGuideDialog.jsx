import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { createFeeGuide } from '../../../store/slices/feeGuideSlice';

const EmptyFeeGuideDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    dispatch(createFeeGuide(name));
    setName('');
    onClose();
  };

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
        Empty Fee Guide
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#333' }}>
          Name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            onClick={handleSave}
            disabled={!name.trim()}
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
