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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ zIndex: 1400, '& .MuiDialog-paper': { borderRadius: '12px', overflow: 'hidden' } }}>
      <DialogTitle sx={{ backgroundColor: '#F1F5FD', color: '#111', py: 2, px: 3, fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Set Provider Fee Guide
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
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
          onClick={() => onSave(provider)}
          sx={{ bgcolor: '#2262ef', color: '#fff', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetProviderFeeGuideDialog;
