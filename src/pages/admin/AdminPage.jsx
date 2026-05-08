import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserManagementView from './UserManagementView';
import PracticeInfoListPage from '../practice-info/PracticeInfoListPage';
import InsuranceCompaniesListPage from '../insurance-companies/InsuranceCompaniesListPage';
import AppointmentTypesListPage from '../appointment-types/AppointmentTypesListPage';
import ServicesListPage from '../services/ServicesListPage';
import PaymentTerminals from './PaymentTerminals';
import ProductsManagement from './ProductsManagement';
import ProcedureCodesManagement from './ProcedureCodesManagement';
import ChecklistsManagement from './ChecklistsManagement';

const TABS = [
  { label: 'User Management', path: '/admin/user-management' },
  { label: 'Practice Setup', path: '/admin/practice-setup' },
  { label: 'Clinical Management', path: '/admin/clinical-management' },
  { label: 'Finance Management', path: '/admin/finance-management' },
  { label: 'Insurance Management', path: '/admin/insurance-management' },
];

const PRACTICE_SETUP_SUB_TABS = [
  { label: 'Kiosk Account View', path: '/admin/practice-setup/kiosk-accounts' },
  { label: 'MyChart Configuration', path: '/admin/practice-setup/my-chart-configuration' },
  { label: 'Office Timings', path: '/admin/practice-setup/office-timings' },
  { label: 'Online Schedule', path: '/admin/practice-setup/online-schedule' },
  { label: 'Operatory Setup', path: '/admin/practice-setup/operatory-setup' },
  { label: 'Patient Flags', path: '/admin/practice-setup/patient-flags' },
  { label: 'Document Category', path: '/admin/practice-setup/document-category-setup' },
  { label: 'Schedule Configuration', path: '/admin/practice-setup/schedule-configuration' },
  { label: 'Settings', path: '/admin/practice-setup/practice-settings' },
  { label: 'Information', path: '/admin/practice-setup/practice-information' },
];

const FINANCIAL_MANAGEMENT_SUB_TABS = [
  { label: 'Payment Terminals', path: '/admin/payment-terminals' },
];

const CLINICAL_MANAGEMENT_SUB_TABS = [
  { label: 'Products', path: '/admin/clinical-management/products' },
  { label: 'Procedure Codes', path: '/admin/clinical-management/procedure-codes' },
  { label: 'Checklists', path: '/admin/clinical-management/checklists' },
  { label: 'Prescription Templates', path: '/admin/clinical-management/prescription-templates' },
  { label: 'System Settings', path: '/admin/clinical-management/system-settings' },
  { label: 'Recare Configuration', path: '/admin/clinical-management/recare-configuration' },
  { label: 'Informed Consent', path: '/admin/clinical-management/informed-consent' },
  { label: 'Pre & Post-Ops', path: '/admin/clinical-management/pre-post-ops' },
];

const AdminPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);

  const activeTab = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));

  // Check if the current path is a top-level administrative tab
  const isTopLevelPage = TABS.some((tab) => tab.path === location.pathname);
  // If it's not a top-level page and not the base /admin, it's a sub-page
  const isSubPage = !isTopLevelPage && location.pathname !== '/admin';

  if (location.pathname === '/admin') {
    return <Navigate to="/admin/user-management" replace />;
  }

  return (
    <Box>
      {/* Main tab bar + sub-nav wrapper — Hidden on sub-management pages */}
      {!isSubPage && (
        <Box
          onMouseLeave={() => setHoveredTab(null)}
          sx={{ mx: -3, backgroundColor: theme.palette.background.paper }}
        >
        {/* Main tabs */}
        <Box sx={{ borderBottom: hoveredTab !== null ? 0 : 1, borderColor: 'divider', px: 3 }}>
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
                onMouseEnter={() => setHoveredTab(index)}
              />
            ))}
          </Tabs>
        </Box>

        {/* Sub-nav — visible on hover */}
        {hoveredTab !== null && (hoveredTab === 1 || hoveredTab === 2 || hoveredTab === 3) && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              borderTop: 1,
              px: 3,
              backgroundColor: '#f0f4fa',
              display: 'flex',
              gap: 0,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {(hoveredTab === 1
              ? PRACTICE_SETUP_SUB_TABS
              : hoveredTab === 2
              ? CLINICAL_MANAGEMENT_SUB_TABS
              : FINANCIAL_MANAGEMENT_SUB_TABS
            ).map((sub) => (
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
    )}

      {/* Page content */}
      <Box sx={{ mt: isSubPage ? 0 : 3 }}>
        {activeTab === 0 && <UserManagementView />}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/practice-setup/onboarding')}
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
            {location.pathname === '/admin/clinical-management' ? (
              <AppointmentTypesListPage />
            ) : location.pathname === '/admin/clinical-management/products' ? (
              <ProductsManagement />
            ) : location.pathname === '/admin/clinical-management/procedure-codes' ? (
              <ProcedureCodesManagement />
            ) : location.pathname === '/admin/clinical-management/checklists' ? (
              <ChecklistsManagement />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {CLINICAL_MANAGEMENT_SUB_TABS.find((t) => t.path === location.pathname)?.label ||
                    'Clinical Management'}
                </Typography>
                <Typography color="text.secondary">Content for this section is coming soon.</Typography>
              </Box>
            )}
          </Box>
        )}
        {activeTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {location.pathname === '/admin/finance-management' ? (
              <ServicesListPage />
            ) : location.pathname === '/admin/payment-terminals' ? (
              <PaymentTerminals />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  {FINANCIAL_MANAGEMENT_SUB_TABS.find((t) => t.path === location.pathname)?.label ||
                    'Finance Management'}
                </Typography>
                <Typography color="text.secondary">Content for this section is coming soon.</Typography>
              </Box>
            )}
          </Box>
        )}
        {activeTab === 4 && <InsuranceCompaniesListPage />}
      </Box>
    </Box>
  );
};

export default AdminPage;
