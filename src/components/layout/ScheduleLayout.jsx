import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Header from './Header';
import PatientSlider from '../patient-slider/PatientSlider';
import { fetchCurrentPracticeInfo, selectPracticeInfo } from '../../store/slices/practiceInfoSlice';

const ScheduleLayout = ({ children }) => {
  const [sliderOpen, setSliderOpen] = useState(false);
  const dispatch = useDispatch();
  const practiceInfo = useSelector(selectPracticeInfo);

  useEffect(() => {
    if (!practiceInfo || !practiceInfo.patientFlags || practiceInfo.patientFlags.length === 0) {
      dispatch(fetchCurrentPracticeInfo());
    }
  }, [dispatch, practiceInfo]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header onOpenPatientSlider={() => setSliderOpen(prev => !prev)} sliderOpen={sliderOpen} />
      <Box sx={{ flex: 1, paddingTop: '65px' }}>
        {children}
      </Box>
      <PatientSlider open={sliderOpen} onClose={() => setSliderOpen(false)} />
    </Box>
  );
};

export default ScheduleLayout;
