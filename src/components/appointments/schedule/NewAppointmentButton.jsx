import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontWeight, fontSize, radius } from '../../../constants/styles';

const NewAppointmentButton = ({ onClick }) => (
  <Button
    variant="contained"
    startIcon={<Add sx={{ fontSize: '15px' }} />}
    onClick={onClick}
    sx={{
      flexShrink: 0,
      backgroundColor: COLORS.ACCENT,
      borderRadius: radius.md,
      textTransform: 'none',
      fontWeight: fontWeight.medium,
      fontSize: fontSize.base,
      lineHeight: '16px',
      letterSpacing: '0px',
      color: COLORS.WHITE,
      px: '8px',
      py: '5px',
      boxShadow: 'none',
      whiteSpace: 'nowrap',
      '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
    }}
  >
    New appointment
  </Button>
);

export default NewAppointmentButton;
