import { Box, Typography } from '@mui/material';

const HeaderLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
    <Box
      sx={{
        width: '36px',
        height: '36px',
        backgroundColor: '#333333',
        border: '2px solid #ffffff',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>M</Typography>
    </Box>
    <Typography
      sx={{
        fontFamily: 'Manrope',
        fontWeight: 700,
        fontSize: '14px',
        letterSpacing: '-0.14px',
        color: '#0b2545',
      }}
    >
      MedFlow
    </Typography>
  </Box>
);

export default HeaderLogo;
