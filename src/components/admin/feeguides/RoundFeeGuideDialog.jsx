import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const RoundFeeGuideDialog = ({ open, onClose, onSave }) => {
  const [value, setValue] = React.useState('1');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}>
      <DialogTitle sx={{ bgcolor: '#4b71a1', color: 'white', py: 1.5, fontSize: '1rem', textAlign: 'center' }}>
        Round Fee Guide
      </DialogTitle>
      <DialogContent sx={{ mt: 1.5, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#4b71a1', mb: 1.5 }}>
          Round up the prices to the nearest:
        </Typography>
        <RadioGroup row value={value} onChange={(e) => setValue(e.target.value)} sx={{ justifyContent: 'center', gap: 2 }}>
          <FormControlLabel 
            value="1" 
            control={<Radio size="small" sx={{ color: '#ff8a80', '&.Mui-checked': { color: '#ff8a80' } }} />} 
            label={<Typography sx={{ fontSize: '0.9rem', color: '#333' }}>$ 1</Typography>} 
          />
          <FormControlLabel 
            value="0.1" 
            control={<Radio size="small" sx={{ color: '#ff8a80', '&.Mui-checked': { color: '#ff8a80' } }} />} 
            label={<Typography sx={{ fontSize: '0.9rem', color: '#333' }}>$ 0.1</Typography>} 
          />
          <FormControlLabel 
            value="0.01" 
            control={<Radio size="small" sx={{ color: '#ff8a80', '&.Mui-checked': { color: '#ff8a80' } }} />} 
            label={<Typography sx={{ fontSize: '0.9rem', color: '#333' }}>$ 0.01</Typography>} 
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => onSave(value)}
          sx={{ bgcolor: '#4b71a1', '&:hover': { bgcolor: '#3d5c85' }, textTransform: 'none', px: 4 }}
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

export default RoundFeeGuideDialog;
