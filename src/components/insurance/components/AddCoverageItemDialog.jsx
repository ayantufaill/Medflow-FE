import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  HealthAndSafety as CoverageIcon,
} from '@mui/icons-material';

const sharedInputSx = {
  borderRadius: '8px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DB',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2563EB',
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
    color: '#111827',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#9CA3AF',
    opacity: 1,
  },
};

const Label = ({ children }) => (
  <Typography
    sx={{
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '11.5px',
      color: '#4B5563',
      display: 'block',
      mb: 0.75,
    }}
  >
    {children}
  </Typography>
);

const AddCoverageItemDialog = ({ open, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [coverage, setCoverage] = useState('');
  const [waitingPeriod, setWaitingPeriod] = useState('');

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: Date.now(),
        code,
        procedure: code,
        coverage,
        waitingPeriod,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setCode('');
    setCoverage('');
    setWaitingPeriod('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow:
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          backgroundColor: '#F1F5FD',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#E2EBFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CoverageIcon sx={{ color: '#2563EB', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.4px',
                color: '#111827',
              }}
            >
              Add Coverage Item
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '11.5px',
                lineHeight: '17.25px',
                color: '#6B7280',
              }}
            >
              Enter the procedure code and coverage details
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ color: '#6B7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
        {/* Enter Code row */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
            <Label>Enter Code</Label>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                color: '#2563EB',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Select Procedure
            </Typography>
          </Box>
          <TextField
            variant="outlined"
            placeholder="Enter code or procedure"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            size="small"
            InputProps={{ sx: sharedInputSx }}
          />
        </Box>

        {/* Coverage row */}
        <Box sx={{ mb: 2.5 }}>
          <Label>Coverage</Label>
          <TextField
            variant="outlined"
            placeholder="0"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              sx: sharedInputSx,
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Waiting Period row */}
        <Box>
          <Label>Waiting Period</Label>
          <TextField
            variant="outlined"
            placeholder="0"
            value={waitingPeriod}
            onChange={(e) => setWaitingPeriod(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              sx: sharedInputSx,
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>
                    Month(s)
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#FAFAFA',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            fontFamily: 'Inter',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            borderRadius: '6px',
            borderColor: '#D1D5DB',
            color: '#374151',
            px: 2.5,
            '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            fontFamily: 'Inter',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            borderRadius: '6px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            boxShadow: 'none',
            px: 2.5,
            '&:hover': { backgroundColor: '#1D4ED8', boxShadow: 'none' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoverageItemDialog;
