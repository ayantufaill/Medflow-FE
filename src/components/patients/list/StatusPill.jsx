import { Box, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { radius, fontSize, fontWeight } from '../../../constants/styles';

// Colored-dot status pill used in the patients table (Active / Inactive).
const StatusPill = ({ active }) => (
  <Box sx={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    px: '10px', py: '3px', borderRadius: radius.pill,
    backgroundColor: active ? 'rgba(22, 163, 74, 0.10)' : COLORS.SURFACE_INPUT,
  }}>
    <Box sx={{
      width: '6px', height: '6px', borderRadius: '50%',
      backgroundColor: active ? COLORS.STATUS_SUCCESS : COLORS.TEXT_MUTED,
    }} />
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: active ? COLORS.STATUS_SUCCESS : COLORS.TEXT_MUTED }}>
      {active ? 'Active' : 'Inactive'}
    </Typography>
  </Box>
);

export default StatusPill;
