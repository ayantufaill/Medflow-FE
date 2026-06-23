import { Box, Typography, Divider } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { PatientDetails, FamilyDetails } from './PatientDetails';

const DotGrid = ({ color = 'rgba(255,255,255,0.6)' }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 3px)', gap: '3px' }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i} sx={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: color }} />
    ))}
  </Box>
);

const PatientActions = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '2px' }}>

    {/* Divider separating patient card from actions */}
    <Divider sx={{ borderColor: '#e0e5eb', my: '6px' }} />

    {/* Procedure row */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e5eb',
        borderRadius: '8px',
        px: '12px',
        py: '10px',
      }}
    >
      <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#09121f' }}>
        P 1 #15 crown /bu
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#9aa3ae' }}>___min</Typography>
        <KeyboardArrowUp sx={{ fontSize: '18px', color: '#5c646f' }} />
      </Box>
    </Box>

    {/* Blue action buttons */}
    {['Route Slip', 'Family Appointments', 'Appointment History'].map((label) => (
      <Box
        key={label}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#2262ef',
          borderRadius: '8px',
          px: '16px',
          py: '12px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#1a50cc' },
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
          {label}
        </Typography>
        {label !== 'Appointment History' && <DotGrid />}
      </Box>
    ))}

    {/* Purchase Products — disabled/gray */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c5cad3',
        borderRadius: '8px',
        px: '16px',
        py: '12px',
        cursor: 'not-allowed',
      }}
    >
      <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
        Purchase Products
      </Typography>
    </Box>

    {/* Patient Details accordion */}
    <PatientDetails />

    {/* Family Details accordion */}
    <FamilyDetails />

  </Box>
);

export default PatientActions;
