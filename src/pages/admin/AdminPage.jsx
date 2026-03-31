import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserManagementView from './UserManagementView';
import PracticeInfoListPage from '../practice-info/PracticeInfoListPage';
import InsuranceCompaniesListPage from '../insurance-companies/InsuranceCompaniesListPage';
import AppointmentTypesListPage from '../appointment-types/AppointmentTypesListPage';
import ServicesListPage from '../services/ServicesListPage';

const TABS = [
  { label: 'User Management' },
  { label: 'Practice Setup' },
  { label: 'Clinical Management' },
  { label: 'Finance Management' },
  { label: 'Insurance Management' },
];

const AdminPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

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
          onChange={(_, val) => setActiveTab(val)}
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
            <Tab key={tab.label} label={tab.label} disableRipple />
          ))}
        </Tabs>
      </Box>

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
  );
};

export default AdminPage;
