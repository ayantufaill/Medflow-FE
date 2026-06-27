import { Box, Typography } from '@mui/material';
import InitialsAvatar from '../../shared/InitialsAvatar';

const DoctorProfile = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
    <InitialsAvatar name="Dr. Sarah Wells" size={36} fontSize={12} />
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
