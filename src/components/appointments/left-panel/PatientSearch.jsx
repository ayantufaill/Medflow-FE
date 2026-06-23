import { Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';

const PatientSearch = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      height: '40px',
      backgroundColor: '#f5f7fa',
      border: '1px solid #e0e5eb',
      borderRadius: '8px',
      px: '12px',
      mb: '10px',
      cursor: 'text',
    }}
  >
    <Search sx={{ fontSize: '16px', color: '#9aa3ae' }} />
    <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#9aa3ae', fontWeight: 400 }}>
      Search patient...
    </Typography>
  </Box>
);

export default PatientSearch;
