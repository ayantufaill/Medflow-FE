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
  AdminPanelSettings,
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
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  // { text: 'Users', icon: <Person />, path: '/users', adminOnly: true },
  // { text: 'Patients', icon: <People />, path: '/patients' },
  { text: 'Providers', icon: <Person />, path: '/providers', adminOnly: true },
  {
    text: 'Appointment Types',
    icon: <CalendarToday />,
    path: '/appointment-types',
    adminOnly: true,
  },
  {
    text: 'Rooms',
    icon: <MeetingRoom />,
    path: '/rooms',
    requiredRoles: ['Admin'],
  },
  { text: 'Users', icon: <Person />, path: '/users', requiredRoles: ['Admin'] },
  {
    text: 'Patients',
    icon: <People />,
    path: '/patients',
    requiredRoles: ['Admin', 'Receptionist', 'Doctor'],
  },
  { text: 'Appointments', icon: <CalendarToday />, path: '/appointments', requiredRoles: ['Admin', 'Receptionist', 'Provider', 'Doctor'] },
  // {
  //   text: 'Calendar',
  //   icon: <CalendarMonth />,
  //   path: '/appointments/calendar',
  // },
  {
    text: 'Waitlist',
    icon: <Queue />,
    path: '/waitlist',
    requiredRoles: ['Admin', 'Receptionist'],
  },
  {
    text: 'Recurring Appointments',
    icon: <EventRepeat />,
    path: '/recurring-appointments',
    requiredRoles: ['Admin', 'Receptionist'],
  },
  {
    text: 'Portal Messages',
    icon: <Forum />,
    path: '/portal-messages',
    requiredRoles: ['Admin', 'Provider', 'Doctor'],
  },
  {
    text: 'Note Templates',
    icon: <Note />,
    path: '/note-templates',
    requiredRoles: ['Admin', 'Doctor'],
  },
  {
    text: 'Clinical Notes',
    icon: <Description />,
    path: '/clinical-notes',
    requiredRoles: ['Admin', 'Doctor'],
  },
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
  {
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
  },
  {
    text: 'Payments',
    icon: <Payment />,
    path: '/payments',
    requiredRoles: ['Admin', 'Billing', 'Receptionist'],
  },
  {
    text: 'Estimates',
    icon: <RequestQuote />,
    path: '/estimates',
    requiredRoles: ['Admin', 'Billing', 'Doctor'],
  },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Administration', icon: <AdminPanelSettings />, path: '/admin' },
  {
    text: 'Practice Info',
    icon: <Business />,
    path: '/practice-info',
    requiredRoles: ['Admin'],
  },
  {
    text: 'Insurance Companies',
    icon: <AccountBalance />,
    path: '/insurance-companies',
    requiredRoles: ['Admin'],
  },
  // Sprint 6 - Claims Management
  {
    text: 'Claims',
    icon: <Assignment />,
    path: '/claims',
    requiredRoles: ['Admin', 'Billing'],
  },
  // Sprint 6 - ERA/EOB Processing
  {
    text: 'ERA/EOB',
    icon: <CloudUpload />,
    path: '/era',
    requiredRoles: ['Admin', 'Billing'],
  },
  // Sprint 6 - Authorization Management
  {
    text: 'Authorizations',
    icon: <VerifiedUser />,
    path: '/authorizations',
    requiredRoles: ['Admin', 'Billing', 'Front Desk'],
  },
];

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

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          // borderBottom: '1px solid',
          borderColor: 'divider',
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
          }}
        >
          MF
        </Box>
        <Typography variant="h6" fontWeight={600} color="primary">
          MedFlow
        </Typography>
      </Box>

      {/* User Profile Section */}
      {user && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: theme.palette.primary.main,
              fontSize: '1rem',
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 1, overflowY: 'auto' }}>
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
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' &&
                location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
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
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      <Divider />

      {/* Bottom Menu Items */}
      <List>
        {/* Define bottom menu items with role restrictions */}
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
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{ mx: 1, mb: 0.5, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 1,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.main' + '15',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
