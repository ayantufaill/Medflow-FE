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
import { useSelector } from 'react-redux';
import { selectPracticeInfo } from '../../store/slices/practiceInfoSlice';
import FlagOption from './FlagOption';

const PatientFlagsDialog = ({ open, onClose, onSave, initialFlags = [] }) => {
  const [flags, setFlags] = useState({});
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

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
      sx={{ 
        zIndex: 9999,
        '& .MuiDialog-paper': { 
          borderRadius: '14px', 
          overflow: 'hidden',
          maxWidth: '750px',
          width: '100%' 
        }
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: 'border-box', 
        px: '20px', 
        py: '14px', 
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

      <DialogContent sx={{ px: '20px', pt: '16px !important', pb: '16px', bgcolor: '#f8fafc', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {(() => {
          // Group global flags by category
          const grouped = globalFlags.reduce((acc, flag) => {
            const cat = flag.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(flag);
            return acc;
          }, {});

          return Object.entries(grouped).map(([category, catFlags]) => (
            <Box key={category} sx={{ 
              flex: '1 1 calc(50% - 8px)', 
              minWidth: '250px',
              border: `1px solid ${COLORS.BORDER_LIGHT}`, 
              borderRadius: '12px', 
              backgroundColor: COLORS.WHITE, 
              p: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography sx={{ fontWeight: 600, mb: 1.5, color: COLORS.TEXT_PRIMARY, fontSize: '14px' }}>
                {category}
              </Typography>
              {catFlags.map(flag => (
                <FlagOption
                  key={flag.id}
                  label={flag.name}
                  color={flag.color}
                  checked={flags[flag.name]}
                  onChange={() => {
                    setFlags(prev => ({
                      ...prev,
                      [flag.name]: !prev[flag.name]
                    }));
                  }}
                />
              ))}
            </Box>
          ));
        })()}
      </DialogContent>

      <DialogActions sx={{ p: '12px 20px', bgcolor: COLORS.SURFACE_CARD, justifyContent: 'space-between', borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
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
              height: '34px',
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
              height: '34px',
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
