import React from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const TreatmentPlanSyncDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#FBFCFE',
          color: '#1e293b',
          fontSize: '1.05rem',
          fontWeight: 600,
          py: 2.5,
          px: 3,
          lineHeight: 1.3,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        Select the offices you would like to sync with the source office
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 3, backgroundColor: '#fff' }}>
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
              '& .MuiInputBase-input': { backgroundColor: '#f8fafc', fontSize: '0.85rem', color: '#64748b' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderRadius: 1.5 }
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Target Offices
          </Typography>
          <Box sx={{ p: 3, border: '1px dashed #cbd5e1', borderRadius: 2, backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5, backgroundColor: '#fff' }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            fontSize: '0.85rem',
            fontWeight: 600,
            px: 3,
            borderRadius: 1.5,
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
            fontSize: '0.85rem',
            fontWeight: 600,
            px: 4,
            borderRadius: 1.5,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }
          }}
        >
          Sync
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentPlanSyncDialog;
