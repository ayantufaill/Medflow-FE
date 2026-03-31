import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserManagementView from './UserManagementView';
import PracticeInfoListPage from '../practice-info/PracticeInfoListPage';
import KioskAccountsView from './KioskAccountsView';
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

const AdminPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = TABS.findIndex((tab) => tab.path === location.pathname);

  if (location.pathname === '/admin') {
    return <Navigate to="/admin/user-management" replace />;
  }

  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
          mx: -3,
          px: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={activeTab}
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
          {TABS.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              component={Link}
              to={tab.path}
              disableRipple
            />
          ))}
        </Tabs>
      </Box>

      {activeTab === 0 && <UserManagementView />}
      {/* {activeTab === 1 && <KioskAccountsView />} */}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/kiosk-accounts')}
              sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
            >
              Kiosk Accounts View
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/my-chart-configuration')}
              sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
            >
              MyChart Configuration
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/office-timings')}
              sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
            >
              Office Timings
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/online-schedule')}
              sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
            >
              Online Schedule
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
  );
};

export default AdminPage;
