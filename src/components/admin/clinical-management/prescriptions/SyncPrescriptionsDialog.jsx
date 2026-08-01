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

import { radius, fontSize, fontWeight } from '../../../../constants/styles';
import { COLORS } from '../../../../constants/colors';

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
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_MUTED,
            borderColor: COLORS.BORDER,
            px: 3,
            '&:hover': { backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.TEXT_MUTED }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          disableElevation
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            px: 4,
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
          }}
        >
          Sync Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncPrescriptionsDialog;
