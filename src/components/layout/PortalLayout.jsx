import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import LogoImg from '../../assets/medflow-logo.png';
import VerticalDivider from './header/VerticalDivider';
import InitialsAvatar from '../shared/InitialsAvatar';

const links = [
  { to: '/portal', label: 'Home' },
  { to: '/portal/appointments', label: 'Appointments' },
  { to: '/portal/messages', label: 'Messages' },
  { to: '/portal/forms', label: 'Forms' },
  { to: '/portal/profile', label: 'Profile' },
  { to: '/portal/notifications', label: 'Notifications' },
];

// Same look as the staff Header (white bar, logo, text tabs, avatar) so the
// portal feels like the rest of MedFlow.
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
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Inter' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          height: '65px',
          backgroundColor: '#FCFCFC',
          borderBottom: '1px solid #e0e5eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          px: '16px',
          gap: '12px',
        }}
      >
        <Box
          component="img"
          src={LogoImg}
          alt="MedFlow Logo"
          onClick={() => navigate('/portal')}
          sx={{ width: '90px', height: '45px', objectFit: 'contain', cursor: 'pointer', flexShrink: 0 }}
        />
        <VerticalDivider />
        <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#5c646f', whiteSpace: 'nowrap' }}>
          Patient Portal
        </Typography>

        <Box
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {links.map((link) => {
            const active =
              location.pathname === link.to ||
              (link.to !== '/portal' && location.pathname.startsWith(link.to));
            return (
              <Box
                key={link.to}
                onClick={() => navigate(link.to)}
                sx={{
                  px: '12px',
                  py: '6px',
                  flexShrink: 0,
                  cursor: 'pointer',
                  borderRadius: '14px',
                  backgroundColor: active ? 'rgba(34, 98, 239, 0.08)' : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(34, 98, 239, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#2262ef' : '#5c646f',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InitialsAvatar name={fullName} size={36} fontSize={12} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', lineHeight: '20px', color: '#09121f' }}>
                {fullName}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#7a8a9a', lineHeight: 1.3 }}>Patient</Typography>
            </Box>
          </Box>
          <VerticalDivider />
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              px: '10px',
              py: '6px',
              borderRadius: '14px',
              cursor: 'pointer',
              color: '#5c646f',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)', color: '#09121f' },
            }}
          >
            <Logout sx={{ fontSize: 18 }} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Logout</Typography>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default PortalLayout;
