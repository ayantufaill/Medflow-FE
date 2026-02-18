import { useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
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
          'radial-gradient(circle at 0% 0%, rgba(18, 82, 145, 0.14), transparent 38%), radial-gradient(circle at 90% 20%, rgba(36, 150, 237, 0.09), transparent 30%), #f4f7fc',
        fontFamily: '"Manrope", "Segoe UI", sans-serif',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(100deg, #0d3e68 0%, #145a98 50%, #1e7fcb 100%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, py: 1 }}>
          <Stack spacing={0.2}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Space Grotesk", "Avenir Next", "Segoe UI", sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              MedFlow Portal
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Patient Self-Service
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
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
                    borderRadius: 999,
                    px: 1.5,
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.12)',
                    color: isActive ? '#0e4f86' : '#fff',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.22)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.28)', mx: 0.3 }} />
            <Chip
              size="small"
              label={fullName}
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.2)',
                maxWidth: 200,
                '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
              }}
            />
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="inherit"
              sx={{
                borderColor: 'rgba(255,255,255,0.52)',
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default PortalLayout;
