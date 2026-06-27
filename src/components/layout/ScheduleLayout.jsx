import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import PatientSlider from '../patient-slider/PatientSlider';

const ScheduleLayout = ({ children }) => {
  const [sliderOpen, setSliderOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header onOpenPatientSlider={() => setSliderOpen(true)} />
      <Box sx={{ flex: 1, paddingTop: '65px' }}>
        {children}
      </Box>
      <PatientSlider open={sliderOpen} onClose={() => setSliderOpen(false)} />
    </Box>
  );
};

export default ScheduleLayout;
