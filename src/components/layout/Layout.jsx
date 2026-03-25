import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Widths for collapsed (icons only) and expanded sidebar states
const SIDEBAR_COLLAPSED_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 280;

const Layout = ({ children }) => {
  // Controls mobile temporary drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Controls desktop sidebar expanded (true) vs collapsed/icons-only (false)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle mobile drawer (used on small screens)
  const handleMobileDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Toggle desktop sidebar between expanded and collapsed
  const handleDesktopSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Current desktop sidebar width based on open/collapsed state
  const desktopSidebarWidth = sidebarOpen
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navbar receives both toggle handlers so it can trigger the right one per breakpoint */}
      <Navbar
        onMobileMenuClick={handleMobileDrawerToggle}
        onDesktopMenuClick={handleDesktopSidebarToggle}
      />

      {/* Sidebar receives open state for desktop collapse/expand and mobileOpen for mobile drawer */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleMobileDrawerToggle}
        mobileOpen={mobileOpen}
      />

      {/* Main content area — shifts right by the current sidebar width on desktop */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // On desktop, account for sidebar width (animated via sidebar's own transition)
          width: { md: `calc(100% - ${desktopSidebarWidth}px)` },
          // Smooth transition to match sidebar animation
          transition: 'width 0.2s ease',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {/* Spacer to push content below the fixed AppBar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
