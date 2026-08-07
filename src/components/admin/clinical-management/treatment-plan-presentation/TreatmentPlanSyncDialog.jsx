import React from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { radius, fontSize, fontWeight } from '../../../../constants/styles';
import { COLORS } from '../../../../constants/colors';

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
          Sync
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentPlanSyncDialog;
