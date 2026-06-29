import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Schedule', path: '/appointments/operatory-schedule' },
  { label: 'Patients', path: '/patients' },
  { label: 'Clinical', path: '/clinical' },
  { label: 'Insurance', path: '/insurance' },
  { label: 'Billing', path: '/finance' },
  { label: 'Reports', path: '/patient-reports' },
];

const NavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      {TABS.map(({ label, path }) => {
        const active = isActive(path);
        return (
          <Box
            key={label}
            onClick={() => navigate(path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '12px',
              py: '6px',
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
                letterSpacing: '0px',
                fontWeight: active ? 600 : 400,
                color: active ? '#2262ef' : '#5c646f',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default NavTabs;
