import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const NewAppointmentButton = ({ onClick }) => (
  <Button
    variant="contained"
    startIcon={<Add sx={{ fontSize: '15px' }} />}
    onClick={onClick}
    sx={{
      flexShrink: 0,
      backgroundColor: '#2262ef',
      borderRadius: '8px',
      textTransform: 'none',
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0px',
      color: '#fcfcfc',
      px: '8px',
      py: '5px',
      boxShadow: 'none',
      whiteSpace: 'nowrap',
      '&:hover': { backgroundColor: '#1a50cc', boxShadow: 'none' },
    }}
  >
    New appointment
  </Button>
);

export default NewAppointmentButton;
