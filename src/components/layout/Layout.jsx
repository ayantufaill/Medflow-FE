import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import PatientSlider from '../patient-slider/PatientSlider';

const SIDEBAR_COLLAPSED_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 280;

const Layout = ({ children, hideSidebar = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);

  const handleMobileDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDesktopSidebarToggle = () => setSidebarOpen((prev) => !prev);

  const desktopSidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onMobileMenuClick={handleMobileDrawerToggle}
        onDesktopMenuClick={handleDesktopSidebarToggle}
        onOpenPatientSlider={() => setSliderOpen(true)}
      />
      <PatientSlider open={sliderOpen} onClose={() => setSliderOpen(false)} />

      <Box sx={{ display: 'flex', flex: 1, mt: '65px' }}>
        {!hideSidebar && (
          <Sidebar
            open={sidebarOpen}
            onClose={handleMobileDrawerToggle}
            mobileOpen={mobileOpen}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: hideSidebar ? 0 : 3,
            width: { md: hideSidebar ? '100%' : `calc(100% - ${desktopSidebarWidth}px)` },
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
