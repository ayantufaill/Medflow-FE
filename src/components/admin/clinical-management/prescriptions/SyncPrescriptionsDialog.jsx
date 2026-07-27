import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

const SyncPrescriptionsDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#fff',
          color: '#1e293b',
          fontSize: '1.25rem',
          fontWeight: 700,
          py: 2.5,
          px: 4,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        Sync Prescriptions
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400, mt: 0.5 }}>
          Select the target offices you would like to sync with the source office
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#334155' }}>
            Source Office
          </Typography>
          <TextField
            fullWidth
            size="small"
            value="thedentalstudio"
            disabled
            sx={{
              '& .MuiInputBase-input': { backgroundColor: '#f8fafc', fontSize: '0.9rem', py: 1, borderRadius: 2, color: '#475569' },
              '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' }
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#334155' }}>
            Target Offices
          </Typography>
          <Box sx={{ p: 3, border: '1px dashed #cbd5e1', borderRadius: 2, backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3, gap: 1, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.85rem',
            px: 3,
            '&:hover': { backgroundColor: '#e2e8f0' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            px: 4,
            boxShadow: 'none',
            borderRadius: 1.5,
            '&:hover': { backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }
          }}
        >
          Sync Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncPrescriptionsDialog;
