import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';

const AdjunctiveTherapyPage = () => {
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Adjunctive Therapy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Adjunctive therapy records and treatments
        </Typography>
      </Box>
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body1">
          Content for Adjunctive Therapy will be displayed here.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdjunctiveTherapyPage;
