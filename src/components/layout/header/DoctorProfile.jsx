import { Box, Typography } from '@mui/material';

const DoctorProfile = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
    <Box
      sx={{
        width: '36px',
        height: '36px',
        backgroundColor: '#2262ef',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>SW</Typography>
    </Box>
    <Box>
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0px',
          color: '#09121f',
        }}
      >
        Dr. Sarah Wells
      </Typography>
      <Typography sx={{ fontSize: '11px', color: '#7a8a9a', lineHeight: 1.3 }}>
        Riverside Dental
      </Typography>
    </Box>
  </Box>
);

export default DoctorProfile;
