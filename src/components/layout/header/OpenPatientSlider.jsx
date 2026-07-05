import { Box, Typography } from '@mui/material';
import { TableChart } from '@mui/icons-material';

const OpenPatientSlider = ({ onClick }) => (
  <Box
    onClick={onClick}
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
      cursor: 'pointer',
      flexShrink: 0,
      '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#c8d0d9' },
    }}
  >
    <TableChart sx={{ fontSize: '14px', color: '#7a8a9a' }} />
    <Typography sx={{ fontSize: '12px', color: '#4a5568', fontWeight: 500, whiteSpace: 'nowrap' }}>
      Open patient slider
    </Typography>
  </Box>
);

export default OpenPatientSlider;
