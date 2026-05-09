import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import AdminPage from '../pages/admin/AdminPage';
import PracticeOnboardingPage from '../pages/admin/PracticeOnboardingPage';
import KioskAccountsView from '../pages/admin/KioskAccountsView';
import MyChartConfiguration from '../pages/admin/MyChartConfiguration';
import OfficeTimings from '../pages/admin/OfficeTimings';
import OnlineSchedule from '../pages/admin/OnlineSchedule';
import OperatorySetup from '../pages/admin/OperatorySetup';
import PatientFlags from '../pages/admin/PatientFlags';
import PaymentTerminals from '../pages/admin/PaymentTerminals';
import DocumentCategorySetup from '../pages/admin/DocumentCategorySetup';
import ScheduleConfiguration from '../pages/admin/ScheduleConfiguration';
import PracticeSettings from '../pages/admin/PracticeSettings';
import PracticeInformation from '../pages/admin/PracticeInformation';
import ProductsManagement from '../pages/admin/ProductsManagement';
import PrescriptionTemplates from '../pages/admin/PrescriptionTemplates';
import ProcedureCodesManagement from '../pages/admin/ProcedureCodesManagement';
import ChecklistsManagement from '../pages/admin/ChecklistsManagement';
import ClinicalSystemSettings from '../pages/admin/ClinicalSystemSettings';
import RecareConfiguration from '../pages/admin/RecareConfiguration';
import TreatmentPlanPresentation from '../pages/admin/TreatmentPlanPresentation';
import InformedConsent from '../pages/admin/InformedConsent';
import PrePostOps from '../pages/admin/PrePostOps';

const adminOnly = (children) => (
  <ProtectedRoute requiredRoles={['Admin']}>
    <Layout>{children}</Layout>
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
  <Route key="/admin/insurance-management" path="/admin/insurance-management" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/carriers" path="/admin/insurance-management/carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/plans" path="/admin/insurance-management/plans" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/membership-plans" path="/admin/insurance-management/membership-plans" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/match-converted-carriers" path="/admin/insurance-management/match-converted-carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/insurance-management/match-vyne-carriers" path="/admin/insurance-management/match-vyne-carriers" element={adminOnly(<AdminPage />)} />,
  <Route key="/admin/practice-setup/onboarding" path="/admin/practice-setup/onboarding" element={adminOnly(<PracticeOnboardingPage />)} />,
  <Route key="/admin/practice-setup/kiosk-accounts" path="/admin/practice-setup/kiosk-accounts" element={adminOnly(<KioskAccountsView />)} />,
  <Route key="/admin/practice-setup/my-chart-configuration" path="/admin/practice-setup/my-chart-configuration" element={adminOnly(<MyChartConfiguration />)} />,
  <Route key="/admin/practice-setup/operatory-setup" path="/admin/practice-setup/operatory-setup" element={adminOnly(<OperatorySetup />)} />,
  <Route key="/admin/practice-setup/patient-flags" path="/admin/practice-setup/patient-flags" element={adminOnly(<PatientFlags />)} />,
  <Route key="/admin/practice-setup/financial/payment-terminals" path="/admin/practice-setup/financial/payment-terminals" element={adminOnly(<PaymentTerminals />)} />,
  <Route key="/admin/practice-setup/document-category-setup" path="/admin/practice-setup/document-category-setup" element={adminOnly(<DocumentCategorySetup />)} />,
  <Route key="/admin/practice-setup/schedule-configuration" path="/admin/practice-setup/schedule-configuration" element={adminOnly(<ScheduleConfiguration />)} />,
  <Route key="/admin/practice-setup/practice-settings" path="/admin/practice-setup/practice-settings" element={adminOnly(<PracticeSettings />)} />,
  <Route key="/admin/practice-setup/practice-information" path="/admin/practice-setup/practice-information" element={adminOnly(<PracticeInformation />)} />,
  <Route key="/admin/practice-setup/office-timings" path="/admin/practice-setup/office-timings" element={adminOnly(<OfficeTimings />)} />,
  <Route key="/admin/practice-setup/online-schedule" path="/admin/practice-setup/online-schedule" element={adminOnly(<OnlineSchedule />)} />,
  <Route key="/admin/payment-terminals" path="/admin/payment-terminals" element={adminOnly(<PaymentTerminals />)} />,
  <Route key="/admin/clinical-management/products" path="/admin/clinical-management/products" element={adminOnly(<ProductsManagement />)} />,
  <Route key="/admin/clinical-management/procedure-codes" path="/admin/clinical-management/procedure-codes" element={adminOnly(<ProcedureCodesManagement />)} />,
  <Route key="/admin/clinical-management/checklists" path="/admin/clinical-management/checklists" element={adminOnly(<ChecklistsManagement />)} />,
  <Route key="/admin/clinical-management/prescription-templates" path="/admin/clinical-management/prescription-templates" element={adminOnly(<PrescriptionTemplates />)} />,
  <Route key="/admin/clinical-management/system-settings" path="/admin/clinical-management/system-settings" element={adminOnly(<ClinicalSystemSettings />)} />,
  <Route key="/admin/clinical-management/recare-configuration" path="/admin/clinical-management/recare-configuration" element={adminOnly(<RecareConfiguration />)} />,
  <Route key="/admin/clinical-management/TreatmentPlan-Presentation" path="/admin/clinical-management/TreatmentPlan-Presentation" element={adminOnly(<TreatmentPlanPresentation />)} />,
  <Route key="/admin/clinical-management/informed-consent" path="/admin/clinical-management/informed-consent" element={adminOnly(<InformedConsent />)} />,
  <Route key="/admin/clinical-management/pre-post-ops" path="/admin/clinical-management/pre-post-ops" element={adminOnly(<PrePostOps />)} />,
];

export default adminRoutes;
