import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';

const ClinicalPage = () => {
  const { section } = useParams();
  
  // Determine active section from URL or default to 'exam'
  const activeSection = section || 'exam';

  // Section titles and descriptions
  const sectionInfo = {
    exam: { title: 'Exam', description: 'Patient examination records and clinical findings' },
    diagnostic: { title: 'Diagnostic Opinion', description: 'Detailed diagnostic opinions and clinical assessments' },
    treatment: { title: 'Treatment Plan', description: 'Comprehensive treatment plans and procedures' },
    adjunctive: { title: 'Adjunctive Therapy', description: 'Adjunctive therapy records and treatments' },
    rx: { title: 'RX (Prescriptions)', description: 'Prescription records and medication history' },
    referral: { title: 'Referral', description: 'Patient referrals and specialist recommendations' },
    progress: { title: 'Progress Notes', description: 'Patient progress notes and treatment updates' },
    lab: { title: 'Lab Case', description: 'Laboratory cases and dental lab work orders' },
    ai: { title: 'AI Conversation', description: 'AI-powered clinical conversations and assistance' },
  };

  const currentSection = sectionInfo[activeSection] || sectionInfo.exam;

  return (
    <Box>
      {/* Navigation Bar */}
      <ClinicalNavbar />
      
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          {currentSection.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          {currentSection.description}
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Typography variant="body1">
          Content for {currentSection.title} will be displayed here.
        </Typography>
      </Box>
    </Box>
  );
};

export default ClinicalPage;
