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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ zIndex: 1400, '& .MuiDialog-paper': { borderRadius: '12px', overflow: 'hidden' } }}>
      <DialogTitle sx={{ backgroundColor: '#F1F5FD', color: '#111', py: 2, px: 3, fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Round Fee Guide
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#1e293b', mb: 2, fontWeight: 500 }}>
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
      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' }, textTransform: 'none', px: 3, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(value)}
          sx={{ bgcolor: '#2262ef', color: '#fff', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoundFeeGuideDialog;
