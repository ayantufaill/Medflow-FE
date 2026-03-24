import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const DiagnosticOpinionPage = () => {
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />
      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Typography variant="body1">
          Please select a diagnostic subsection above.
        </Typography>
      </Box>
    </Box>
  );
};

export default DiagnosticOpinionPage;
