import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SelectToothDialog = ({ open, onClose, selectedTeeth = [], onSave }) => {
  const [localSelection, setLocalSelection] = useState([]);

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedTeeth || []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleToggle = (tooth) => {
    setLocalSelection(prev => {
      const newSelection = prev.includes(tooth)
        ? prev.filter(t => t !== tooth)
        : [...prev, tooth];
      onSave(newSelection);
      return newSelection;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const topRowLeft = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const topRowRight = ['9', '10', '11', '12', '13', '14', '15', '16'];
  const bottomRowLeft = ['32', '31', '30', '29', '28', '27', '26', '25'];
  const bottomRowRight = ['24', '23', '22', '21', '20', '19', '18', '17'];

  const ToothButton = ({ tooth }) => {
    const isSelected = localSelection.includes(tooth);
    return (
      <Box
        onClick={() => handleToggle(tooth)}
        sx={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: isSelected ? 700 : 500,
          color: isSelected ? '#1976d2' : '#555',
          bgcolor: isSelected ? '#e3f2fd' : 'transparent',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: '#f5f5f5'
          }
        }}
      >
        {tooth}
      </Box>
    );
  };

  const QuadrantButton = ({ quad }) => {
    const isSelected = localSelection.includes(quad);
    return (
      <Box
        onClick={() => handleToggle(quad)}
        sx={{
          width: '32px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: isSelected ? '#1976d2' : '#555',
          bgcolor: isSelected ? '#e3f2fd' : 'transparent',
          borderRadius: '4px',
          mx: 1,
          '&:hover': {
            bgcolor: '#f5f5f5'
          }
        }}
      >
        {quad}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: { width: 'max-content', maxWidth: 'none', borderRadius: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
          Select Tooth
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
            padding: '2px'
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {topRowLeft.map(t => <ToothButton key={t} tooth={t} />)}
          </Box>
          <QuadrantButton quad="Q1" />
          <QuadrantButton quad="Q2" />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {topRowRight.map(t => <ToothButton key={t} tooth={t} />)}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {bottomRowLeft.map(t => <ToothButton key={t} tooth={t} />)}
          </Box>
          <QuadrantButton quad="Q4" />
          <QuadrantButton quad="Q3" />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {bottomRowRight.map(t => <ToothButton key={t} tooth={t} />)}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectToothDialog;
