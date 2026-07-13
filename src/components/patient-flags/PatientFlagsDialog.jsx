import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box, 
  Typography, 
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { COLORS } from '../../constants/colors';
import FlagCommunicationColumn from './FlagCommunicationColumn';
import FlagBillingPatientColumn from './FlagBillingPatientColumn';

const PatientFlagsDialog = ({ open, onClose, onSave, initialFlags = [] }) => {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    if (open) {
      const initialMap = {};
      if (Array.isArray(initialFlags)) {
        initialFlags.forEach(flag => {
          initialMap[flag] = true;
        });
      }
      setFlags(initialMap);
    }
  }, [open, initialFlags]);

  const handleFlagToggle = (flagLabel) => {
    setFlags(prev => ({
      ...prev,
      [flagLabel]: !prev[flagLabel]
    }));
  };

  const activeFlagsCount = Object.values(flags).filter(Boolean).length;

  const handleSave = () => {
    if (onSave) {
      // Pass the array of true flag labels
      const selectedFlags = Object.keys(flags).filter(key => flags[key]);
      onSave(selectedFlags);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: '14px', overflow: 'hidden' }
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
        <FlagOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Add Patient Flags
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', pt: '25px !important', pb: '25px', bgcolor: '#f8fafc', display: 'flex', gap: '20px' }}>
        <FlagCommunicationColumn flags={flags} handleFlagToggle={handleFlagToggle} />
        <FlagBillingPatientColumn flags={flags} handleFlagToggle={handleFlagToggle} />
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', bgcolor: COLORS.SURFACE_CARD, justifyContent: 'space-between', borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_MUTED }}>
          You can add up to 15 flags per patient. {activeFlagsCount} flag{activeFlagsCount !== 1 ? 's' : ''} selected.
        </Typography>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: 'none', 
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '6px',
              height: '36px',
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' } 
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: 'none', 
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '6px',
              height: '36px',
              '&:hover': { backgroundColor: '#1a50cc' } 
            }}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PatientFlagsDialog;
