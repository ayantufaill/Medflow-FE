import { Box, Typography, Divider } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { PatientDetails, FamilyDetails } from './PatientDetails';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, headingSecondarySx } from '../../../constants/styles';

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
    <Divider sx={{ borderColor: COLORS.BORDER, my: '6px' }} />

    {/* Procedure row */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.SURFACE_CARD,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        px: '12px',
        py: '10px',
      }}
    >
      <Typography sx={{ ...headingSecondarySx }}>
        P 1 #15 crown /bu
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>___min</Typography>
        <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
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
          backgroundColor: COLORS.ACCENT,
          borderRadius: radius.md,
          px: '16px',
          py: '12px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
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
        borderRadius: radius.md,
        px: '16px',
        py: '12px',
        cursor: 'not-allowed',
      }}
    >
      <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
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
