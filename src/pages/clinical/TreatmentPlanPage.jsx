import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';

const TreatmentPlanPage = () => {
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Treatment Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Comprehensive treatment plans and procedures
        </Typography>
      </Box>
      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Typography variant="body1">
          Content for Treatment Plan will be displayed here.
        </Typography>
      </Box>
    </Box>
  );
};

export default TreatmentPlanPage;
