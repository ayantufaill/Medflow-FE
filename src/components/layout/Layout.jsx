import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import PatientSlider from '../patient-slider/PatientSlider';

const Layout = ({ children, hideSidebar = false }) => {
  const [sliderOpen, setSliderOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onOpenPatientSlider={() => setSliderOpen(prev => !prev)}
        sliderOpen={sliderOpen}
      />
      <PatientSlider open={sliderOpen} onClose={() => setSliderOpen(false)} />

      <Box sx={{ display: 'flex', flex: 1, mt: '65px' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: hideSidebar ? 0 : 3,
            width: '100%',
            transition: 'width 0.2s ease',
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 65px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
