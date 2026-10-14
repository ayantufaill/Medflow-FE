import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const COLORS = {
  PRIMARY: "#2a3b7c",
  PRIMARY_LIGHT: "#f3f5fa",
  SECONDARY: "#4a5568",
  BORDER: "#e2e8f0",
  SUCCESS: "#38a169",
  WARNING: "#dd6b20",
  WARNING_LIGHT: "#feebc8",
  DANGER: "#e53e3e",
  WHITE: "#ffffff",
  SURFACE: "#f8fafc",
  SURFACE_TINT: "#f1f5f9",
  ACCENT: "#4f46e5", // Match primary button colors
};

export default function SecondaryClaimPromptDialog({
  open,
  onClose,
  onConfirm,
  patientName = 'Patient',
  invoiceId,
  primaryClaimId,
  secondaryInsuranceName = 'Secondary Insurance',
}) {
  const handleYes = () => {
    onConfirm({ invoiceId, primaryClaimId });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ zIndex: 150000 }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: "border-box",
        px: "25px",
        py: "16px",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${COLORS.BORDER}`,
        bgcolor: COLORS.SURFACE_TINT,
        color: COLORS.PRIMARY,
        fontWeight: 600,
        fontSize: "15px",
        m: 0,
        flexShrink: 0,
      }}>
        Secondary Insurance Claim
      </DialogTitle>
      
      <DialogContent sx={{ px: "25px", pt: "24px !important", pb: 3 }}>
        <Box sx={{ mb: 3, mt: 1, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: COLORS.SECONDARY, mb: 2, textAlign: 'center' }}>
            A primary insurance payment was recorded for <strong>{patientName}</strong>, but there is still an unpaid balance. The patient has secondary insurance coverage with <strong>{secondaryInsuranceName}</strong>.
          </Typography>
          <Typography variant="body1" sx={{ color: COLORS.SECONDARY, textAlign: 'center' }}>
            Would you like to generate a secondary claim for the remaining balance?
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: 3,
        pb: 2,
        pt: 2,
        borderTop: `1px solid ${COLORS.BORDER}`,
        bgcolor: '#fff',
        gap: 1,
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            color: COLORS.SECONDARY, 
            borderColor: COLORS.BORDER,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            height: "36px",
            px: 3,
            '&:hover': {
              borderColor: COLORS.SECONDARY,
              bgcolor: 'transparent'
            }
          }}
        >
          No
        </Button>
        <Button 
          onClick={handleYes} 
          variant="contained" 
          sx={{ 
            bgcolor: COLORS.ACCENT, 
            color: COLORS.WHITE,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            height: "36px",
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4338ca', // Darker indigo
              boxShadow: 'none',
            }
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
