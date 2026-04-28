import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  People,
  CalendarToday,
  CalendarMonth,
  Description,
  Receipt,
  Person,
  Assessment,
  Lock,
  ExitToApp,
  Business,
  AccountBalance,
  EventRepeat,
  Queue,
  MeetingRoom,
  Note,
  MonitorHeart,
  Folder,
  Payment,
  RequestQuote,
  MedicalServices,
  Assignment,
  CloudUpload,
  VerifiedUser,
  Forum,
  Settings,
  AttachMoney,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Sidebar widths for desktop expanded and collapsed states
const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  // { text: 'Users', icon: <Person />, path: '/users', adminOnly: true },
  // { text: 'Patients', icon: <People />, path: '/patients' },
  // { text: 'Providers', icon: <Person />, path: '/providers', adminOnly: true },
  /*{
    text: 'Appointment Types',
    icon: <CalendarToday />,
    path: '/appointment-types',
    adminOnly: true,
  },*/
  /*{
    text: 'Rooms',
    icon: <MeetingRoom />,
    path: '/rooms',
    requiredRoles: ['Admin'],
  },*/
 // { text: 'Users', icon: <Person />, path: '/users', requiredRoles: ['Admin'] },
  {
    text: 'Patients',
    icon: <People />,
    path: '/patients',
    requiredRoles: ['Admin', 'Receptionist', 'Doctor'],
  },
  { text: 'Appointments', icon: <CalendarToday />, path: '/appointments/operatory-schedule', requiredRoles: ['Admin', 'Receptionist', 'Provider', 'Doctor'] },
  // {
  //   text: 'Calendar',
  //   icon: <CalendarMonth />,
  //   path: '/appointments/calendar',
  // },
  /*{
    text: 'Waitlist',
    icon: <Queue />,
    path: '/waitlist',
    requiredRoles: ['Admin', 'Receptionist'],
  },*/
  /*{
    text: 'Recurring Appointments',
    icon: <EventRepeat />,
    path: '/recurring-appointments',
    requiredRoles: ['Admin', 'Receptionist'],
  },*/
  /*{
    text: 'Portal Messages',
    icon: <Forum />,
    path: '/portal-messages',
    requiredRoles: ['Admin', 'Provider', 'Doctor'],
  },*/
  /*{
    text: 'Note Templates',
    icon: <Note />,
    path: '/note-templates',
    requiredRoles: ['Admin', 'Doctor'],
  },*/
  /*{
    text: 'Clinical Notes',
    icon: <Description />,
    path: '/clinical-notes',
    requiredRoles: ['Admin', 'Doctor'],
  },*/
  // {
  //   text: 'Vital Signs',
  //   icon: <MonitorHeart />,
  //   path: '/vital-signs',
  //   requiredRoles: ['Admin', 'Doctor', 'Nurse'],
  // },
  // {
  //   text: 'Documents',
  //   icon: <Folder />,
  //   path: '/documents',
  //   requiredRoles: ['Admin', 'Doctor', 'Nurse'],
  // },
  /*{
    text: 'Service Catalog',
    icon: <MedicalServices />,
    path: '/services',
    requiredRoles: ['Admin', 'Billing'],
  },
  {
    text: 'Invoices',
    icon: <Receipt />,
    path: '/invoices',
    requiredRoles: ['Admin', 'Billing', 'Receptionist'],
  },*/
 /* {
    text: 'Payments',
    icon: <Payment />,
    path: '/payments',
    requiredRoles: ['Admin', 'Billing', 'Receptionist'],
  },*/
  /*{
    text: 'Estimates',
    icon: <RequestQuote />,
    path: '/estimates',
    requiredRoles: ['Admin', 'Billing', 'Doctor'],
  },*/
  //{ text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Patient Reports', icon: <Description />, path: '/patient-reports', requiredRoles: ['Admin', 'Doctor', 'Receptionist'] },
  { text: 'Insurance', icon: <AccountBalance />, path: '/insurance', requiredRoles: ['Admin', 'Billing', 'Receptionist'] },
  { text: 'Finance', icon: <AttachMoney />, path: '/finance', requiredRoles: ['Admin', 'Billing', 'Receptionist'] },
  { text: 'Clinical', icon: <Description />, path: '/clinical', requiredRoles: ['Admin', 'Doctor'] },
 // { text: 'Administration', icon: <AdminPanelSettings />, path: '/admin' },
  /*{
    text: 'Practice Info',
    icon: <Business />,
    path: '/practice-info',
    requiredRoles: ['Admin'],
  },*/
  /*{
    text: 'Insurance Companies',
    icon: <AccountBalance />,
    path: '/insurance-companies',
    requiredRoles: ['Admin'],
  },*/
  // Sprint 6 - Claims Management
  /*{
    text: 'Claims',
    icon: <Assignment />,
    path: '/claims',
    requiredRoles: ['Admin', 'Billing'],
  },*/
  // Sprint 6 - ERA/EOB Processing
  /*{
    text: 'ERA/EOB',
    icon: <CloudUpload />,
    path: '/era',
    requiredRoles: ['Admin', 'Billing'],
  },*/
  // Sprint 6 - Authorization Management
  /*{
    text: 'Authorizations',
    icon: <VerifiedUser />,
    path: '/authorizations',
    requiredRoles: ['Admin', 'Billing', 'Front Desk'],
  },*/
];

// open: controls desktop sidebar — true = expanded (full), false = collapsed (icons only)
// mobileOpen: controls the temporary mobile drawer
// onClose: closes the mobile drawer
const Sidebar = ({ open, onClose, mobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, user } = useAuth();

  // Helper function to check if user has required roles
  const hasRequiredRole = (requiredRoles) => {
    // If no role restrictions, show to everyone
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // If user doesn't have roles data, don't show restricted items
    if (!user || !user.roles || user.roles.length === 0) return false;

    const userRoles = user.roles;
    const userRoleNames = userRoles
      .map((role) => (typeof role === 'string' ? role : role?.name || ''))
      .filter(Boolean);

    // Check if user has at least one of the required roles
    return requiredRoles.some((role) => userRoleNames.includes(role));
  };

  const handleNavigation = (path) => {
    navigate(path);
    // On mobile, close the drawer after navigating
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login', { replace: true });
  };


  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Wraps an icon-only item in a Tooltip when the sidebar is collapsed on desktop.
  // On mobile or when expanded, Tooltip is a passthrough (no title shown).
  const WithTooltip = ({ title, children }) => {
    const showTooltip = !isMobile && !open;
    return showTooltip ? (
      <Tooltip title={title} placement="right" arrow>
        {children}
      </Tooltip>
    ) : (
      children
    );
  };

  // Shared drawer content — rendered for both mobile and desktop drawers.
  // `isCollapsed` drives whether to show icons-only or icons+text layout.
  const DrawerContent = ({ isCollapsed }) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Logo Section — shows full brand name when expanded, icon only when collapsed */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 1,
          borderColor: 'divider',
          minHeight: 52,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          MF
        </Box>
        {/* Hide brand text when collapsed */}
        {!isCollapsed && (
          <Typography variant="h6" fontWeight={600} color="primary" noWrap>
            MedFlow
          </Typography>
        )}
      </Box>

      {/* User Profile Section — avatar + info when expanded, avatar only when collapsed */}
      {user && (
        <WithTooltip title={`${user.firstName} ${user.lastName}`}>
          <Box
            sx={{
              p: isCollapsed ? 1 : 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              {getUserInitials()}
            </Avatar>
            {/* Hide name/email when collapsed */}
            {!isCollapsed && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>
        </WithTooltip>
      )}

      {/* Navigation Menu */}
      <List dense sx={{ flex: 1, pt: 0.5, overflowY: 'auto', overflowX: 'hidden' }}>
        {menuItems
          .filter((item) => {
            // For backward compatibility
            if (item.adminOnly) {
              return hasRequiredRole(['Admin']);
            }
            // Check if item has role restrictions
            return hasRequiredRole(item.requiredRoles);
          })
          .map((item) => {
            // Special handling for paths that could conflict
            const isExactMatch = location.pathname === item.path;
            const isStartsWithMatch =
              item.path !== '/dashboard' &&
              location.pathname.startsWith(item.path + '/');

            let isActive = false;

            if (item.path === '/patients') {
              // Check if we're on a patient report page
              const isPatientReport = location.pathname.match(/^\/patients\/\d+\/report/);
              if (!isPatientReport && (isExactMatch || isStartsWithMatch)) {
                isActive = true;
              }
            } else if (item.path === '/patient-reports') {
              // Match /patient-reports OR /patients/:id/report/*
              const isPatientReportRoute = location.pathname.match(/^\/patients\/\d+\/report/);
              if (isExactMatch || isPatientReportRoute) {
                isActive = true;
              }
            } else if (isStartsWithMatch || isExactMatch) {
              isActive = true;
            }

            return (
              <WithTooltip key={item.text} title={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      // Center icons when collapsed, left-align when expanded
                      mx: 0.5,
                      mb: 0.25,
                      borderRadius: 1,
                      py: 0.5,
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      px: isCollapsed ? 1 : 1.5,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '15',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '25',
                        },
                        '& .MuiListItemIcon-root': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? theme.palette.primary.main : 'inherit',
                        // Remove extra left margin when collapsed so icon is truly centered
                        minWidth: isCollapsed ? 'unset' : 40,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {/* Hide label when collapsed */}
                    {!isCollapsed && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </ListItem>
              </WithTooltip>
            );
          })}
      </List>

      <Divider />

      {/* Bottom Menu Items (Profile, Change Password, Sign Out) */}
      <List dense>
        {[
          {
            text: 'My Profile',
            icon: <Person />,
            path: '/profile',
            // All authenticated users can access their profile
          },
          {
            text: 'Change Password',
            icon: <Lock />,
            path: '/change-password',
            // All authenticated users can change their password
          },
        ]
          .filter((item) => hasRequiredRole(item.requiredRoles))
          .map((item) => (
            <WithTooltip key={item.text} title={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 'unset' : 40,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </WithTooltip>
          ))}

        {/* Settings icon — Admin only */}
        {hasRequiredRole(['Admin']) && (
          <WithTooltip title="Settings">
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('/admin/user-management')}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 1 : 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'unset' : 40,
                    justifyContent: 'center',
                  }}
                >
                  <Settings />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="Settings" />}
              </ListItemButton>
            </ListItem>
          </WithTooltip>
        )}

        <Divider sx={{ my: 0.5 }} />

        {/* Sign Out button */}
        <WithTooltip title="Sign Out">
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 1,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main' + '15',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 'unset' : 40,
                  justifyContent: 'center',
                  color: 'error.main',
                }}
              >
                <ExitToApp />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Sign Out" />}
            </ListItemButton>
          </ListItem>
        </WithTooltip>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        // Desktop: reserve space for the sidebar (width animates with the drawer)
        width: { md: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED },
        flexShrink: { md: 0 },
        transition: 'width 0.2s ease',
      }}
    >
      {/* Mobile drawer — temporary, slides in from the left */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH_EXPANDED,
          },
        }}
      >
        {/* Mobile always shows full content */}
        <DrawerContent isCollapsed={false} />
      </Drawer>

      {/* Desktop drawer — permanent, animates between collapsed and expanded widths */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            // Animate the paper width for a smooth slide effect
            width: open ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {/* Pass isCollapsed so content adapts to show icons-only or full layout */}
        <DrawerContent isCollapsed={!open} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
