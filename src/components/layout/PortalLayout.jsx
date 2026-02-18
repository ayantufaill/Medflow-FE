import { useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/portal', label: 'Home' },
  { to: '/portal/appointments', label: 'Appointments' },
  { to: '/portal/messages', label: 'Messages' },
  { to: '/portal/forms', label: 'Forms' },
  { to: '/portal/profile', label: 'Profile' },
  { to: '/portal/notifications', label: 'Notifications' },
];

const PortalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const fullName = useMemo(() => {
    const first = user?.firstName || '';
    const last = user?.lastName || '';
    return `${first} ${last}`.trim() || user?.email || 'Patient';
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/portal/login', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 0% 0%, rgba(25,118,210,0.08), transparent 35%), #f7f9fc',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #0f4c81 0%, #1976d2 60%, #2496ed 100%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, py: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            MedFlow Portal
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {links.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to !== '/portal' && location.pathname.startsWith(link.to));
              return (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color={isActive ? 'secondary' : 'inherit'}
                  variant={isActive ? 'contained' : 'text'}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 8,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
            <Typography variant="body2" sx={{ opacity: 0.9, ml: 1 }}>
              {fullName}
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default PortalLayout;
