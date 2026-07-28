import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const CarrierSyncDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden' }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#F8FAFC',
          color: '#1e293b',
          fontSize: '1rem',
          fontWeight: 600,
          py: 2,
          px: 3,
          lineHeight: 1.3,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        Select the offices you would like to sync with the source office
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Source Office:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value="thedentalstudio"
            disabled
            sx={{
              '& .MuiInputBase-input': { backgroundColor: '#f1f5f9', fontSize: '0.85rem', color: '#64748b' },
              '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' }
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Target Offices
          </Typography>
          <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1, backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            color: '#475569',
            borderColor: '#cbd5e1',
            fontSize: '0.85rem',
            px: 3,
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '0.85rem',
            px: 4,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Sync
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierSyncDialog;
