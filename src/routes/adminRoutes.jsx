import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import AdminPage from '../pages/admin/AdminPage';
import PracticeOnboardingPage from '../pages/admin/PracticeOnboardingPage';
import KioskAccountsView from '../pages/admin/KioskAccountsView';
import MyChartConfiguration from '../pages/admin/MyChartConfiguration';
import OfficeTimings from '../pages/admin/OfficeTimings';
import PatientFlags from '../pages/admin/PatientFlags';
import PaymentTerminals from '../pages/admin/PaymentTerminals';
import DocumentCategorySetup from '../pages/admin/DocumentCategorySetup';
// Note: DocumentCategorySetup, ScheduleConfiguration, PracticeSettings, PracticeInformation are now loaded via AdminPage
import ProductsManagement from '../pages/admin/ProductsManagement';
import PrescriptionTemplates from '../pages/admin/PrescriptionTemplates';
import ProcedureCodesManagement from '../pages/admin/ProcedureCodesManagement';
import ChecklistsManagement from '../pages/admin/ChecklistsManagement';
import ClinicalSystemSettings from '../pages/admin/ClinicalSystemSettings';
import RecareConfiguration from '../pages/admin/RecareConfiguration';
import TreatmentPlanPresentation from '../pages/admin/TreatmentPlanPresentation';
import InformedConsent from '../pages/admin/InformedConsent';
import PrePostOps from '../pages/admin/PrePostOps';
import ReportsDashboard from '../pages/admin/ReportsDashboard';
import AdvancedReporting from '../pages/admin/AdvancedReporting';
import ClinicAnalyticsPage from '../pages/admin/ClinicAnalyticsPage';
import PracticeGroupsPage from '../pages/admin/PracticeGroupsPage';
import MyGroupPage from '../pages/admin/MyGroupPage';

const adminOnly = (children, hideSidebar = true) => (
  <ProtectedRoute requiredRoles={['Admin']}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

// Admin, OR anyone holding the given permission (e.g. Group Admin's real
// `group:view_analytics` permission) — Group Admin never holds the 'Admin' role
// name, so a plain requiredRoles check would always exclude them.
const adminOrPermission = (children, permission, hideSidebar = true) => (
  <ProtectedRoute requiredRoles={['Admin']} requiredPermissions={[permission]} requireEitherRoleOrPermission>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

// Group Admin's own branch-reassignment screen — also open to Branch Admin (its
// narrower single-branch sibling, scoped down client-side in MyGroupPage.jsx) and
// to Admin for oversight.
const groupOrBranchAdminOnly = (children, hideSidebar = true) => (
  <ProtectedRoute requiredRoles={['Admin', 'Group Admin', 'Branch Admin']}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const adminRoutes = [
  <Route key="/admin" path="/admin" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/user-management" path="/admin/user-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/user-management/providers" path="/admin/user-management/providers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/user-management/roles" path="/admin/user-management/roles" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/user-management/time-clock" path="/admin/user-management/time-clock" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/user-management/task-management" path="/admin/user-management/task-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup" path="/admin/practice-setup" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management" path="/admin/clinical-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management" path="/admin/finance-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/adjustment-types" path="/admin/finance-management/adjustment-types" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/fee-guide" path="/admin/finance-management/fee-guide" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/fee-guide/:id" path="/admin/finance-management/fee-guide/:id" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/billing-configuration" path="/admin/finance-management/billing-configuration" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/payment-types" path="/admin/finance-management/payment-types" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/payment-terminal" path="/admin/finance-management/payment-terminal" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/dashboard-goals" path="/admin/finance-management/dashboard-goals" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/payment-presentation" path="/admin/finance-management/payment-presentation" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/coverage-book-shortcut" path="/admin/finance-management/coverage-book-shortcut" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/finance-management/ar-automation" path="/admin/finance-management/ar-automation" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management" path="/admin/insurance-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication" path="/admin/patient-communication" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/settings" path="/admin/patient-communication/settings" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/templates" path="/admin/patient-communication/templates" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/email-campaign" path="/admin/patient-communication/email-campaign" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/questionnaires" path="/admin/patient-communication/questionnaires" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/gap-fills" path="/admin/patient-communication/gap-fills" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/patient-communication/review-settings" path="/admin/patient-communication/review-settings" element={adminOnly(<AdminPage />)} />,

  <Route key="/admin/insurance-management/carriers" path="/admin/insurance-management/carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/plans" path="/admin/insurance-management/plans" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/membership-plans" path="/admin/insurance-management/membership-plans" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/match-converted-carriers" path="/admin/insurance-management/match-converted-carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/match-vyne-carriers" path="/admin/insurance-management/match-vyne-carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/onboarding" path="/admin/practice-setup/onboarding" element={adminOnly(<PracticeOnboardingPage />, true)} />,
  <Route key="/admin/practice-setup/kiosk-accounts" path="/admin/practice-setup/kiosk-accounts" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/my-chart-configuration" path="/admin/practice-setup/my-chart-configuration" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/operatory-setup" path="/admin/practice-setup/operatory-setup" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/patient-flags" path="/admin/practice-setup/patient-flags" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/financial/payment-terminals" path="/admin/practice-setup/financial/payment-terminals" element={adminOnly(<PaymentTerminals />)} />,
  <Route key="/admin/practice-setup/document-category-setup" path="/admin/practice-setup/document-category-setup" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/schedule-configuration" path="/admin/practice-setup/schedule-configuration" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/practice-settings" path="/admin/practice-setup/practice-settings" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/practice-information" path="/admin/practice-setup/practice-information" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/office-timings" path="/admin/practice-setup/office-timings" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/online-schedule" path="/admin/practice-setup/online-schedule" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/installation-guide" path="/admin/practice-setup/installation-guide" element={adminOnly(<AdminPage />)} />,

  <Route key="/admin/clinical-management/products" path="/admin/clinical-management/products" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/procedure-codes" path="/admin/clinical-management/procedure-codes" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/checklists" path="/admin/clinical-management/checklists" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/prescription-templates" path="/admin/clinical-management/prescription-templates" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/system-settings" path="/admin/clinical-management/system-settings" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/recare-configuration" path="/admin/clinical-management/recare-configuration" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/TreatmentPlan-Presentation" path="/admin/clinical-management/TreatmentPlan-Presentation" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/informed-consent" path="/admin/clinical-management/informed-consent" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/clinical-management/pre-post-ops" path="/admin/clinical-management/pre-post-ops" element={adminOnly(<AdminPage />)} />,
  <Route key="/kpi" path="/kpi" element={adminOnly(<ReportsDashboard />, true)} />,
  <Route key="/admin/reports/*" path="/admin/reports/*" element={adminOnly(<ReportsDashboard />, true)} />,
  <Route key="/admin/advanced-reporting" path="/admin/advanced-reporting" element={adminOnly(<AdvancedReporting />)} />,
  <Route key="/admin/analytics" path="/admin/analytics" element={adminOrPermission(<ClinicAnalyticsPage />, 'group:view_analytics')} />,
  <Route key="/admin/practice-groups" path="/admin/practice-groups" element={adminOrPermission(<PracticeGroupsPage />, 'platform:manage_practice_groups')} />,
  <Route key="/admin/my-group" path="/admin/my-group" element={groupOrBranchAdminOnly(<MyGroupPage />)} />,
  <Route key="admin-catchall" path="/admin/*" element={adminOnly(<AdminPage />)} />,
];

export default adminRoutes;