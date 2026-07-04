import { Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const PatientSearch = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      height: '40px',
      backgroundColor: COLORS.SURFACE_INPUT,
      border: `1px solid ${COLORS.BORDER}`,
      borderRadius: radius.md,
      px: '12px',
      mb: '10px',
      cursor: 'text',
    }}
  >
    <Search sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED }} />
    <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_MUTED, fontWeight: fontWeight.regular }}>
      Search patient...
    </Typography>
  </Box>
);

export default PatientSearch;
