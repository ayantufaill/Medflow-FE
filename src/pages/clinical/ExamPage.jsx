import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import ExamNavbar from '../../components/clinical/ExamNavbar';

const ExamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to radiographic exam if on base exam route
  useEffect(() => {
    if (location.pathname === '/clinical/exam') {
      navigate('/clinical/exam/radiographic', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Exam
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Patient examination records and clinical findings
        </Typography>
      </Box>
       <ExamNavbar />
      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Typography variant="body1">
          Content for Exam will be displayed here.
        </Typography>
      </Box>
    </Box>
  );
};

export default ExamPage;
