import { useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { TableChart } from '@mui/icons-material';
import { usePatient } from '../../../hooks/redux';

const OpenPatientSlider = ({ onClick, isOpen }) => {
  const { currentPatient } = usePatient();
  const [toastOpen, setToastOpen] = useState(false);

  const handleClick = (e) => {
    if (!currentPatient) {
      setToastOpen(true);
    } else {
      onClick(e);
    }
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6px',
          height: '32px',
          px: '8px',
          backgroundColor: '#fbfdfe',
          border: '1px solid #e0e5eb',
          borderRadius: '14px',
          cursor: currentPatient ? 'pointer' : 'not-allowed',
          opacity: currentPatient ? 1 : 0.6,
          flexShrink: 0,
          '&:hover': { 
            backgroundColor: currentPatient ? '#f1f5f9' : '#fbfdfe', 
            borderColor: currentPatient ? '#c8d0d9' : '#e0e5eb' 
          },
        }}
      >
        <TableChart sx={{ fontSize: '14px', color: '#7a8a9a' }} />
        <Typography sx={{ fontSize: '12px', color: '#4a5568', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {isOpen ? "Close patient slider" : "Open patient slider"}
        </Typography>
      </Box>

      <Snackbar 
        open={toastOpen} 
        autoHideDuration={3000} 
        onClose={() => setToastOpen(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 6 }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="error" sx={{ width: '100%' }}>
          Select a patient first
        </Alert>
      </Snackbar>
    </>
  );
};

export default OpenPatientSlider;
