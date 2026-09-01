import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedAppointmentId, fetchAppointmentById } from '../../store/slices/appointmentSlice';
import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import ExamNavbar from '../../components/clinical/ExamNavbar';

const ExamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const appointmentId = searchParams.get('appointmentId');
    if (appointmentId) {
      dispatch(setSelectedAppointmentId(appointmentId));
      dispatch(fetchAppointmentById(appointmentId));
    }
  }, [searchParams, dispatch]);
  
  // Redirect to radiographic exam if on base exam route
  useEffect(() => {
    if (location.pathname === '/clinical/exam') {
      navigate({
        pathname: '/clinical/exam/radiographic',
        search: location.search
      }, { replace: true });
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
