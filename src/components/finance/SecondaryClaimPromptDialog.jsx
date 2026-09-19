import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
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
  onSubmit,
  patientName = 'Patient',
  invoiceId,
  primaryClaimId,
  secondaryInsuranceName = 'Secondary Insurance',
}) {
  const [claimType, setClaimType] = useState('electronic'); // 'electronic' | 'manual'

  const handleSubmit = () => {
    onSubmit({
      claimType,
      invoiceId,
      primaryClaimId
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.BORDER}`,
        p: 3,
        bgcolor: COLORS.SURFACE_TINT,
        color: COLORS.PRIMARY,
        fontWeight: 700,
        fontSize: "1.25rem"
      }}>
        Secondary Insurance Claim
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="body1" sx={{ color: COLORS.SECONDARY, mb: 2 }}>
            A primary insurance payment was recorded for <strong>{patientName}</strong>, but there is still an unpaid balance. The patient has secondary insurance coverage with <strong>{secondaryInsuranceName}</strong>.
          </Typography>
          <Typography variant="body1" sx={{ color: COLORS.SECONDARY }}>
            Would you like to generate a secondary claim for the remaining balance?
          </Typography>
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            sx={{ gap: 2 }}
          >
            <Box sx={{ 
              border: `1px solid ${claimType === 'electronic' ? COLORS.ACCENT : COLORS.BORDER}`, 
              borderRadius: '12px', 
              p: 2,
              bgcolor: claimType === 'electronic' ? COLORS.PRIMARY_LIGHT : COLORS.WHITE,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => setClaimType('electronic')}
            >
              <FormControlLabel 
                value="electronic" 
                control={<Radio sx={{ color: claimType === 'electronic' ? COLORS.ACCENT : COLORS.SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.PRIMARY }}>Electronic Claim</Typography>
                    <Typography variant="body2" sx={{ color: COLORS.SECONDARY }}>Generate and queue an electronic secondary claim automatically.</Typography>
                  </Box>
                } 
                sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
              />
            </Box>

            <Box sx={{ 
              border: `1px solid ${claimType === 'manual' ? COLORS.ACCENT : COLORS.BORDER}`, 
              borderRadius: '12px', 
              p: 2,
              bgcolor: claimType === 'manual' ? COLORS.PRIMARY_LIGHT : COLORS.WHITE,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => setClaimType('manual')}
            >
              <FormControlLabel 
                value="manual" 
                control={<Radio sx={{ color: claimType === 'manual' ? COLORS.ACCENT : COLORS.SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.PRIMARY }}>Manual Claim</Typography>
                    <Typography variant="body2" sx={{ color: COLORS.SECONDARY }}>Generate a secondary claim but keep it in Draft/Manual status.</Typography>
                  </Box>
                } 
                sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
              />
            </Box>
          </RadioGroup>
        </FormControl>

      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            color: COLORS.SECONDARY, 
            borderColor: COLORS.BORDER,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            '&:hover': {
              borderColor: COLORS.SECONDARY,
              bgcolor: 'transparent'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            bgcolor: COLORS.ACCENT, 
            color: COLORS.WHITE,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4338ca', // Darker indigo
              boxShadow: 'none',
            }
          }}
        >
          Generate Secondary Claim
        </Button>
      </DialogActions>
    </Dialog>
  );
}
