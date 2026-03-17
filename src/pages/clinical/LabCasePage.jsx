import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';

const LabCasePage = () => {
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Lab Case
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Laboratory cases and dental lab work orders
        </Typography>
      </Box>
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body1">
          Content for Lab Case will be displayed here.
        </Typography>
      </Box>
    </Box>
  );
};

export default LabCasePage;
