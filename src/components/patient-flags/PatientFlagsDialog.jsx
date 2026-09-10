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
import { useSelector, useDispatch } from 'react-redux';
import { selectPracticeInfo, fetchCurrentPracticeInfo } from '../../store/slices/practiceInfoSlice';
import FlagOption from './FlagOption';
import { resolveFlagColor } from './constants';

const DEFAULT_FLAG_GROUPS = [
  { id: '1', category: 'Patient Communication', name: 'Send appointment reminder earlier than scheduled time', color: '#22c55e' },
  { id: '2', category: 'Billing', name: 'alert', color: '#3b82f6' },
  { id: '3', category: 'Billing', name: 'old patient', color: '#8b5cf6' },
  { id: '4', category: 'Billing', name: 'family & friends', color: '#ef4444' },
  { id: '5', category: 'Billing', name: 'late payment', color: '#ef4444' },
  { id: '6', category: 'Billing', name: 'needs special care', color: '#3b82f6' },
  { id: '7', category: 'Billing', name: 'TDS Member', color: '#22c55e' },
  { id: '8', category: 'Billing', name: 'Botox/Filler', color: '#eef681' },
  { id: '9', category: 'Patient', name: 'Bioclear Patient', color: '#cf5dbd' },
  { id: '10', category: 'Patient', name: 'Ortho Patient', color: '#4d39c0' },
  { id: '11', category: 'Patient', name: 'Balance Owed', color: '#d3562f' },
];

const PatientFlagsDialog = ({ open, onClose, onSave, initialFlags = [] }) => {
  const [flags, setFlags] = useState({});
  const dispatch = useDispatch();
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

  useEffect(() => {
    if (open && (!globalFlags || globalFlags.length === 0)) {
      dispatch(fetchCurrentPracticeInfo());
    }
  }, [open, globalFlags, dispatch]);

  useEffect(() => {
    if (open) {
      const initialMap = {};
      if (Array.isArray(initialFlags)) {
        initialFlags.forEach(flag => {
          const name = typeof flag === 'string' ? flag : (flag?.name || flag?.label);
          if (name) {
            initialMap[name] = true;
          }
        });
      }
      setFlags(initialMap);
    }
  }, [open, initialFlags]);

  const activeFlagsCount = Object.values(flags).filter(Boolean).length;

  const handleSave = () => {
    if (onSave) {
      const selectedFlagNames = Object.keys(flags).filter(key => flags[key]);
      const effectiveList = (globalFlags && globalFlags.length > 0) ? globalFlags : DEFAULT_FLAG_GROUPS;
      const selectedFlags = selectedFlagNames.map(name => {
        const found = effectiveList.find(
          f => (f.name || f.label || '').toLowerCase() === String(name).toLowerCase()
        );
        return {
          id: found?.id || Date.now().toString(),
          name: found?.name || found?.label || name,
          color: found?.color || resolveFlagColor(name, effectiveList),
          category: found?.category || 'General'
        };
      });
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
          const effectiveFlags = (globalFlags && globalFlags.length > 0) ? globalFlags : DEFAULT_FLAG_GROUPS;
          // Group global flags by category
          const grouped = effectiveFlags.reduce((acc, flag) => {
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
