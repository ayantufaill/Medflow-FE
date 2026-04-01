import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserManagementView from './UserManagementView';
import PracticeInfoListPage from '../practice-info/PracticeInfoListPage';
import InsuranceCompaniesListPage from '../insurance-companies/InsuranceCompaniesListPage';
import AppointmentTypesListPage from '../appointment-types/AppointmentTypesListPage';
import ServicesListPage from '../services/ServicesListPage';

const TABS = [
  { label: 'User Management', path: '/admin/user-management' },
  { label: 'Practice Setup', path: '/admin/practice-setup' },
  { label: 'Clinical Management', path: '/admin/clinical-management' },
  { label: 'Finance Management', path: '/admin/finance-management' },
  { label: 'Insurance Management', path: '/admin/insurance-management' },
];

const PRACTICE_SETUP_SUB_TABS = [
  { label: 'Kiosk Account View', path: '/admin/kiosk-accounts' },
  { label: 'MyChart Configuration', path: '/admin/my-chart-configuration' },
  { label: 'Office Timings', path: '/admin/office-timings' },
  { label: 'Online Schedule', path: '/admin/online-schedule' },
];

const AdminPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSubNav, setShowSubNav] = useState(false);

  const activeTab = TABS.findIndex((tab) => tab.path === location.pathname);

  if (location.pathname === '/admin') {
    return <Navigate to="/admin/user-management" replace />;
  }

  return (
    <Box>
      {/* Main tab bar + sub-nav wrapper — hover on this whole area keeps sub-nav visible */}
      <Box
        onMouseLeave={() => setShowSubNav(false)}
        sx={{ mx: -3, backgroundColor: theme.palette.background.paper }}
      >
        {/* Main tabs */}
        <Box sx={{ borderBottom: showSubNav ? 0 : 1, borderColor: 'divider', px: 3 }}>
          <Tabs
            value={activeTab === -1 ? false : activeTab}
            onChange={() => {}}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.875rem',
                minWidth: 140,
                color: 'text.secondary',
                borderBottom: '3px solid transparent',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            {TABS.map((tab, index) => (
              <Tab
                key={tab.label}
                label={tab.label}
                component={Link}
                to={tab.path}
                disableRipple
                onMouseEnter={() => setShowSubNav(index === 1)}
              />
            ))}
          </Tabs>
        </Box>

        {/* Practice Setup sub-nav — visible on hover */}
        {showSubNav && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              borderTop: 1,
              px: 3,
              backgroundColor: '#f0f4fa',
              display: 'flex',
              gap: 0,
            }}
          >
            {PRACTICE_SETUP_SUB_TABS.map((sub) => (
              <Typography
                key={sub.label}
                component={Link}
                to={sub.path}
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  borderBottom: '2px solid transparent',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    borderBottomColor: theme.palette.primary.main,
                  },
                }}
              >
                {sub.label}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* Page content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <UserManagementView />}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/onboarding')}
                sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
              >
                Onboard New Practice
              </Button>
            </Box>
            <PracticeInfoListPage />
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AppointmentTypesListPage />
          </Box>
        )}
        {activeTab === 3 && <ServicesListPage />}
        {activeTab === 4 && <InsuranceCompaniesListPage />}
      </Box>
    </Box>
  );
};

export default AdminPage;
