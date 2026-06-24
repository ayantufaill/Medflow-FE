import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserManagementView from './UserManagementView';
import ProvidersListPage from '../providers/ProvidersListPage';
import PracticeInfoListPage from '../practice-info/PracticeInfoListPage';
import InsuranceCompaniesListPage from '../insurance-companies/InsuranceCompaniesListPage';
import AppointmentTypesListPage from '../appointment-types/AppointmentTypesListPage';
import ServicesListPage from '../services/ServicesListPage';
import PaymentTerminals from './PaymentTerminals';
import InstallationGuide from './InstallationGuide';
import MoveData from './MoveData';
import ProductsManagement from './ProductsManagement';
import ProcedureCodesManagement from './ProcedureCodesManagement';
import ChecklistsManagement from './ChecklistsManagement';
import InsuranceCarriers from './InsuranceCarriers';
import InsurancePlans from './InsurancePlans';
import MembershipPlans from './MembershipPlans';
import MatchConvertedCarriers from './MatchConvertedCarriers';
import MatchVyneCarriers from './MatchVyneCarriers';
import PatientCommunicationSettings from './PatientCommunicationSettings';
import PatientCommunicationTemplates from './PatientCommunicationTemplates';
import EmailCampaigns from './EmailCampaigns';
import Questionnaires from './Questionnaires';
import ScheduleGapFills from './ScheduleGapFills';
import ReviewSettings from './ReviewSettings';
import AdjustmentTypes from './AdjustmentTypes';
import FeeGuides from './FeeGuides';
import FeeGuideDetail from './FeeGuideDetail';
import BillingConfiguration from './BillingConfiguration';
import PaymentTypes from './PaymentTypes';
import ARAutomation from './ARAutomation';
import CoverageBookShortcuts from './CoverageBookShortcuts';
import DashboardGoals from './DashboardGoals';
import PaymentPresentation from './PaymentPresentation';

const USER_MANAGEMENT_SUB_TABS = [
  { label: 'Users', path: '/admin/user-management' },
  { label: 'Providers', path: '/admin/user-management/providers' },
  { label: 'Roles', path: '/admin/user-management/roles' },
  { label: 'Time Clock', path: '/admin/user-management/time-clock' },
  { label: 'Task Management', path: '/admin/user-management/task-management' },
];

const TABS = [
  { label: 'User Management', path: '/admin/user-management' },
  { label: 'Practice Setup', path: '/admin/practice-setup', clickPath: '/admin/practice-setup/onboarding' },
  { label: 'Patient Communication', path: '/admin/patient-communication' },
  { label: 'Clinical Management', path: '/admin/clinical-management' },
  { label: 'Finance Management', path: '/admin/finance-management' },
  { label: 'Insurance Management', path: '/admin/insurance-management' },
];

const PRACTICE_SETUP_SUB_TABS = [
  { label: 'Setup Wizard', path: '/admin/practice-setup/onboarding' },
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
  { label: 'Installation Guide', path: '/admin/practice-setup/installation-guide' },
  { label: 'Move Data', path: '/admin/practice-setup/move-data' },
];

const PATIENT_COMMUNICATION_SUB_TABS = [
  { label: 'Communication Settings', path: '/admin/patient-communication/settings' },
  { label: 'Templates (Emails/Texts/Letters)', path: '/admin/patient-communication/templates' },
  { label: 'Email Campaign', path: '/admin/patient-communication/email-campaign' },
  { label: 'Questionnaires', path: '/admin/patient-communication/questionnaires' },
  { label: 'Schedule Gap Fills', path: '/admin/patient-communication/gap-fills' },
  { label: 'Review Settings', path: '/admin/patient-communication/review-settings' },
];

const FINANCIAL_MANAGEMENT_SUB_TABS = [
  { label: 'Adjustment Types', path: '/admin/finance-management/adjustment-types' },
  { label: 'Fee Guide', path: '/admin/finance-management/fee-guide' },
  { label: 'Billing Configuration', path: '/admin/finance-management/billing-configuration' },
  { label: 'Payment Types', path: '/admin/finance-management/payment-types' },
  { label: 'Payment Terminal', path: '/admin/finance-management/payment-terminal' },
  { label: 'Dashboard Goals', path: '/admin/finance-management/dashboard-goals' },
  { label: 'Payment Presentation', path: '/admin/finance-management/payment-presentation' },
  { label: 'Coverage Book Shortcut', path: '/admin/finance-management/coverage-book-shortcut' },
  { label: 'AR Automation', path: '/admin/finance-management/ar-automation' },
];

const CLINICAL_MANAGEMENT_SUB_TABS = [
  { label: 'Products', path: '/admin/clinical-management/products' },
  { label: 'Procedure Codes', path: '/admin/clinical-management/procedure-codes' },
  { label: 'Checklists', path: '/admin/clinical-management/checklists' },
  { label: 'Prescription Templates', path: '/admin/clinical-management/prescription-templates' },
  { label: 'System Settings', path: '/admin/clinical-management/system-settings' },
  { label: 'Recare Configuration', path: '/admin/clinical-management/recare-configuration' },
  { label: 'TreatmentPlan Presentation', path: '/admin/clinical-management/TreatmentPlan-Presentation' },
  { label: 'Informed Consent', path: '/admin/clinical-management/informed-consent' },
  { label: 'Pre & Post-Ops', path: '/admin/clinical-management/pre-post-ops' },
];

const INSURANCE_MANAGEMENT_SUB_TABS = [
  { label: 'Insurance Carriers', path: '/admin/insurance-management/carriers' },
  { label: 'Insurance Plans', path: '/admin/insurance-management/plans' },
  { label: 'Membership Plans', path: '/admin/insurance-management/membership-plans' },
  { label: 'Match Converted Carriers', path: '/admin/insurance-management/match-converted-carriers' },
  { label: 'Match Vyne Carriers', path: '/admin/insurance-management/match-vyne-carriers' },
];

const AdminPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);

  const activeTab = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));

  const isUserManagementSubTab = USER_MANAGEMENT_SUB_TABS.some((t) => t.path === location.pathname);
  const isPracticeSetupSubTab = PRACTICE_SETUP_SUB_TABS.some((t) => t.path === location.pathname);
  const isPatientCommunicationSubTab = PATIENT_COMMUNICATION_SUB_TABS.some((t) => t.path === location.pathname);
  const isClinicalManagementSubTab = CLINICAL_MANAGEMENT_SUB_TABS.some((t) => t.path === location.pathname);
  const isFinancialManagementSubTab = FINANCIAL_MANAGEMENT_SUB_TABS.some((t) => t.path === location.pathname);
  const isInsuranceManagementSubTab = INSURANCE_MANAGEMENT_SUB_TABS.some((t) => t.path === location.pathname);

  const isTopLevelPage =
    TABS.some((tab) => tab.path === location.pathname) ||
    isUserManagementSubTab ||
    location.pathname === '/admin/practice-setup/installation-guide';

  const isSubPage = !isTopLevelPage && location.pathname !== '/admin';

  if (location.pathname === '/admin') {
    return <Navigate to="/admin/user-management" replace />;
  }

  if (location.pathname === '/admin/practice-setup') {
    return <Navigate to="/admin/practice-setup/onboarding" replace />;
  }

  if (location.pathname === '/admin/patient-communication') {
    return <Navigate to="/admin/patient-communication/settings" replace />;
  }

  return (
    <Box>
      {/* Main tab bar + sub-nav wrapper — Hidden on sub-management pages */}
      {!isSubPage && (
        <Box
          onMouseLeave={() => setHoveredTab(null)}
          sx={{ mx: -3, backgroundColor: theme.palette.background.paper, position: 'relative' }}
        >
          {/* Main tabs */}
          <Box sx={{ borderBottom: hoveredTab !== null ? 0 : 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={activeTab === -1 ? false : activeTab}
              onChange={() => { }}
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
                  to={tab.clickPath || tab.path}
                  disableRipple
                  onMouseEnter={() => setHoveredTab(index)}
                />
              ))}
            </Tabs>
          </Box>

          {/* Sub-nav — visible on hover */}
          {hoveredTab !== null && (hoveredTab === 0 || hoveredTab === 1 || hoveredTab === 2 || hoveredTab === 3 || hoveredTab === 4 || hoveredTab === 5) && (
            <Box
              sx={{
                position: 'absolute',
                top: '48px',
                left: 24 + hoveredTab * 140,
                zIndex: 1100,
                backgroundColor: '#ffffff',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                py: 1,
                minWidth: 260,
                maxWidth: 320,
                maxHeight: 400,
                overflowY: 'auto',
              }}
            >
              {(hoveredTab === 0
                ? USER_MANAGEMENT_SUB_TABS
                : hoveredTab === 1
                  ? PRACTICE_SETUP_SUB_TABS
                  : hoveredTab === 2
                    ? PATIENT_COMMUNICATION_SUB_TABS
                    : hoveredTab === 3
                      ? CLINICAL_MANAGEMENT_SUB_TABS
                      : hoveredTab === 4
                        ? FINANCIAL_MANAGEMENT_SUB_TABS
                        : INSURANCE_MANAGEMENT_SUB_TABS
              ).map((sub) => {
                const isActive = location.pathname === sub.path;
                return (
                  <Typography
                    key={sub.label}
                    component={Link}
                    to={sub.path}
                    onClick={() => setHoveredTab(null)}
                    sx={{
                      px: 2,
                      py: 1.2,
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? theme.palette.primary.main : 'text.secondary',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'background-color 0.15s, color 0.15s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    {sub.label}
                  </Typography>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* Page content */}
      <Box sx={{ mt: isSubPage ? 0 : 3 }}>
        {activeTab === 0 && (
          location.pathname === '/admin/user-management/providers' ? (
            <ProvidersListPage />
          ) : location.pathname === '/admin/user-management/roles' ||
            location.pathname === '/admin/user-management/time-clock' ||
            location.pathname === '/admin/user-management/task-management' ? (
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {USER_MANAGEMENT_SUB_TABS.find((t) => t.path === location.pathname)?.label}
              </Typography>
              <Typography color="text.secondary">Content for this section is coming soon.</Typography>
            </Box>
          ) : (
            <UserManagementView />
          )
        )}
        {activeTab === 1 && (
          location.pathname === '/admin/practice-setup/installation-guide' ? (
            <InstallationGuide />
          ) : location.pathname === '/admin/practice-setup/move-data' ? (
            <MoveData />
          ) : (
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
          )
        )}
        {activeTab === 2 && (
          location.pathname === '/admin/patient-communication/settings' ? (
            <PatientCommunicationSettings />
          ) : location.pathname === '/admin/patient-communication/templates' ? (
            <PatientCommunicationTemplates />
          ) : location.pathname === '/admin/patient-communication/email-campaign' ? (
            <EmailCampaigns />
          ) : location.pathname === '/admin/patient-communication/questionnaires' ? (
            <Questionnaires />
          ) : location.pathname === '/admin/patient-communication/gap-fills' ? (
            <ScheduleGapFills />
          ) : location.pathname === '/admin/patient-communication/review-settings' ? (
            <ReviewSettings />
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: 'text.secondary', mt: 10 }}>
                Patient Communication - {PATIENT_COMMUNICATION_SUB_TABS.find(t => t.path === location.pathname)?.label || 'Module'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 2 }}>
                This module is under development.
              </Typography>
            </Box>
          )
        )}
        {activeTab === 3 && (
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
        {activeTab === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {location.pathname === '/admin/finance-management' ? (
              <ServicesListPage />
            ) : location.pathname === '/admin/finance-management/adjustment-types' ? (
              <AdjustmentTypes />
            ) : location.pathname.includes('/admin/finance-management/fee-guide/') ? (
              <FeeGuideDetail />
            ) : location.pathname === '/admin/finance-management/fee-guide' ? (
              <FeeGuides />
            ) : location.pathname === '/admin/finance-management/billing-configuration' ? (
              <BillingConfiguration />
            ) : location.pathname === '/admin/finance-management/payment-types' ? (
              <PaymentTypes />
            ) : location.pathname === '/admin/finance-management/payment-terminal' ? (
              <PaymentTerminals />
            ) : location.pathname === '/admin/finance-management/dashboard-goals' ? (
              <DashboardGoals />
            ) : location.pathname === '/admin/finance-management/payment-presentation' ? (
              <PaymentPresentation />
            ) : location.pathname === '/admin/finance-management/ar-automation' ? (
              <ARAutomation />
            ) : location.pathname === '/admin/finance-management/coverage-book-shortcut' ? (
              <CoverageBookShortcuts />
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
        {activeTab === 5 && (
          location.pathname === '/admin/insurance-management/carriers' ? (
            <InsuranceCarriers />
          ) : location.pathname === '/admin/insurance-management/plans' ? (
            <InsurancePlans />
          ) : location.pathname === '/admin/insurance-management/membership-plans' ? (
            <MembershipPlans />
          ) : location.pathname === '/admin/insurance-management/match-converted-carriers' ? (
            <MatchConvertedCarriers />
          ) : location.pathname === '/admin/insurance-management/match-vyne-carriers' ? (
            <MatchVyneCarriers />
          ) : (
            <InsuranceCompaniesListPage />
          )
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
