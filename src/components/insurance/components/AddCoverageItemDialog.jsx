import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
} from '@mui/material';

const sharedInputSx = {
  '& .MuiInputBase-input': {
    padding: '8px 0',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#D1D5DB',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#9CA3AF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1976d2',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#9CA3AF',
    opacity: 1,
  },
};

const AddCoverageItemDialog = ({ open, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [coverage, setCoverage] = useState('');
  const [waitingPeriod, setWaitingPeriod] = useState('');

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: Date.now(), // Temporary ID logic
        code,
        procedure: code, // Can be improved later
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
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ backgroundColor: '#003380', p: 2, textAlign: 'center' }}>
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter' }}>
          Add Coverage Item
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#003380', fontSize: '13px', fontWeight: 500, mb: 1, textDecoration: 'underline' }}>
                Enter Code
              </Typography>
              <TextField
                variant="standard"
                placeholder="Enter code or procedure"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                sx={sharedInputSx}
              />
            </Box>
            <Typography sx={{ color: '#003380', fontSize: '13px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', pb: 1 }}>
              Select Procedure
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#003380', fontSize: '13px', fontWeight: 500 }}>
            Coverage:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <TextField
              variant="standard"
              fullWidth
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              sx={sharedInputSx}
            />
            <Typography sx={{ color: '#333', fontSize: '13px', ml: 1 }}>
              %
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#003380', fontSize: '13px', fontWeight: 500 }}>
            Waiting Period:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <TextField
              variant="standard"
              fullWidth
              value={waitingPeriod}
              onChange={(e) => setWaitingPeriod(e.target.value)}
              sx={sharedInputSx}
            />
            <Typography sx={{ color: '#333', fontSize: '13px', ml: 1 }}>
              Month(s)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, backgroundColor: '#F8F9FA', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: '#869AB8',
            color: 'white',
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 0.5,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#6b82a3',
              boxShadow: 'none',
            }
          }}
        >
          Save
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: '#003380',
            color: '#003380',
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 0.5,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(0, 51, 128, 0.04)',
              borderColor: '#003380',
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoverageItemDialog;
