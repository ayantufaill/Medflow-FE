import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_COLLAPSED_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMobileDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDesktopSidebarToggle = () => setSidebarOpen((prev) => !prev);

  const desktopSidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onMobileMenuClick={handleMobileDrawerToggle}
        onDesktopMenuClick={handleDesktopSidebarToggle}
      />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar
          open={sidebarOpen}
          onClose={handleMobileDrawerToggle}
          mobileOpen={mobileOpen}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${desktopSidebarWidth}px)` },
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
