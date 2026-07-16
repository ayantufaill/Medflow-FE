import React, { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const UnsavedChangesPrompt = ({ when, onSave }) => {
  // Prevent leaving via the browser tab closing or reloading
  useEffect(() => {
    if (!when) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for most browsers
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when]);

  // Prevent internal React Router navigation
  let blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        when && currentLocation.pathname !== nextLocation.pathname,
      [when]
    )
  );

  const handleCancel = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  const handleDiscard = () => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave();
        if (blocker.state === 'blocked') {
          blocker.proceed();
        }
      } catch (err) {
        console.error('Failed to save before navigating:', err);
        // Do not proceed if save failed
      }
    } else {
      if (blocker.state === 'blocked') {
        blocker.proceed();
      }
    }
  };

  return (
    <Dialog 
      open={blocker.state === 'blocked'} 
      onClose={handleCancel}
      PaperProps={{
        sx: {
          width: '500px',
          maxWidth: 'none',
          borderRadius: '14px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          m: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: 'border-box', 
        px: '25px', 
        py: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        borderBottom: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_TINT,
        m: 0
      }}>
        <WarningIcon sx={{ fontSize: '20px', color: COLORS.WARNING }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Unsaved Changes
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', pt: '24px !important', pb: '24px', backgroundColor: '#f8fafc' }}>
        <DialogContentText sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_BODY }}>
          You have unsaved changes. Do you want to save them before leaving this page?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: '16px 20px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: '8px' }}>
        <Button 
          onClick={handleCancel} 
          variant="outlined"
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDiscard} 
          variant="outlined"
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.ERROR,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.ERROR, backgroundColor: 'rgba(239, 68, 68, 0.04)' }
          }}
        >
          Discard
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{
            backgroundColor: '#1d4ed8',
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1e40af', boxShadow: 'none' }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesPrompt;
