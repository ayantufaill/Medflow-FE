import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import PublicRoute from './components/shared/PublicRoute';
import HomeRoute from './components/shared/HomeRoute';
import Layout from './components/layout/Layout';
import PortalLayout from './components/layout/PortalLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';
import RegisterVerifyPage from './pages/auth/RegisterVerifyPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/account/ProfilePage';
import ChangePasswordPage from './pages/account/ChangePasswordPage';
import UsersListPage from './pages/users/UsersListPage';
import EditUserPage from './pages/users/EditUserPage';
import ViewUserPage from './pages/users/ViewUserPage';
import CreateUserPage from './pages/users/CreateUserPage';
import AssignRolesPage from './pages/users/AssignRolesPage';
import PracticeInfoListPage from './pages/practice-info/PracticeInfoListPage';
import CreatePracticeInfoPage from './pages/practice-info/CreatePracticeInfoPage';
import EditPracticeInfoPage from './pages/practice-info/EditPracticeInfoPage';
import ViewPracticeInfoPage from './pages/practice-info/ViewPracticeInfoPage';
import PatientsListPage from './pages/patients/PatientsListPage';
import CreatePatientPage from './pages/patients/CreatePatientPage';
import EditPatientPage from './pages/patients/EditPatientPage';
import ViewPatientPage from './pages/patients/ViewPatientPage';
import ViewPatientInsurancePage from './pages/patients/ViewPatientInsurancePage';
import ViewPatientAllergyPage from './pages/patients/ViewPatientAllergyPage';
import PatientMedicalHistoryPage from './pages/patients/PatientMedicalHistoryPage';
import AllergiesListPage from './pages/allergies/AllergiesListPage';
import CreateAllergyPage from './pages/allergies/CreateAllergyPage';
import EditAllergyPage from './pages/allergies/EditAllergyPage';
import InsuranceCompaniesListPage from './pages/insurance-companies/InsuranceCompaniesListPage';
import CreateInsuranceCompanyPage from './pages/insurance-companies/CreateInsuranceCompanyPage';
import EditInsuranceCompanyPage from './pages/insurance-companies/EditInsuranceCompanyPage';
import ProvidersListPage from './pages/providers/ProvidersListPage';
import CreateProviderPage from './pages/providers/CreateProviderPage';
import EditProviderPage from './pages/providers/EditProviderPage';
import ViewProviderPage from './pages/providers/ViewProviderPage';
import AppointmentTypesListPage from './pages/appointment-types/AppointmentTypesListPage';
import CreateAppointmentTypePage from './pages/appointment-types/CreateAppointmentTypePage';
import EditAppointmentTypePage from './pages/appointment-types/EditAppointmentTypePage';
import ViewAppointmentTypePage from './pages/appointment-types/ViewAppointmentTypePage';
import RoomsListPage from './pages/rooms/RoomsListPage';
import CreateRoomPage from './pages/rooms/CreateRoomPage';
import EditRoomPage from './pages/rooms/EditRoomPage';
import ViewRoomPage from './pages/rooms/ViewRoomPage';
import AppointmentsListPage from './pages/appointments/AppointmentsListPage';
import CreateAppointmentPage from './pages/appointments/CreateAppointmentPage';
import EditAppointmentPage from './pages/appointments/EditAppointmentPage';
import ViewAppointmentPage from './pages/appointments/ViewAppointmentPage';
import SchedulePage from './pages/appointments/SchedulePage';
import AppointmentCalendarPage from './pages/appointments/AppointmentCalendarPage';
import WaitlistListPage from './pages/waitlist/WaitlistListPage';
import CreateWaitlistPage from './pages/waitlist/CreateWaitlistPage';
import EditWaitlistPage from './pages/waitlist/EditWaitlistPage';
import ViewWaitlistPage from './pages/waitlist/ViewWaitlistPage';
import RecurringAppointmentsListPage from './pages/recurring-appointments/RecurringAppointmentsListPage';
import CreateRecurringAppointmentPage from './pages/recurring-appointments/CreateRecurringAppointmentPage';
import EditRecurringAppointmentPage from './pages/recurring-appointments/EditRecurringAppointmentPage';
import ViewRecurringAppointmentPage from './pages/recurring-appointments/ViewRecurringAppointmentPage';
import NoteTemplatesListPage from './pages/note-templates/NoteTemplatesListPage';
import CreateNoteTemplatePage from './pages/note-templates/CreateNoteTemplatePage';
import EditNoteTemplatePage from './pages/note-templates/EditNoteTemplatePage';
import ViewNoteTemplatePage from './pages/note-templates/ViewNoteTemplatePage';
import ClinicalNotesListPage from './pages/clinical-notes/ClinicalNotesListPage';
import CreateClinicalNotePage from './pages/clinical-notes/CreateClinicalNotePage';
import EditClinicalNotePage from './pages/clinical-notes/EditClinicalNotePage';
import ViewClinicalNotePage from './pages/clinical-notes/ViewClinicalNotePage';
import VitalSignsListPage from './pages/vital-signs/VitalSignsListPage';
import CreateVitalSignPage from './pages/vital-signs/CreateVitalSignPage';
import EditVitalSignPage from './pages/vital-signs/EditVitalSignPage';
import ViewVitalSignPage from './pages/vital-signs/ViewVitalSignPage';
import PatientVitalHistoryPage from './pages/vital-signs/PatientVitalHistoryPage';
import DocumentsListPage from './pages/documents/DocumentsListPage';
import UploadDocumentPage from './pages/documents/UploadDocumentPage';
import EditDocumentPage from './pages/documents/EditDocumentPage';
import ViewDocumentPage from './pages/documents/ViewDocumentPage';
import PatientDocumentsPage from './pages/documents/PatientDocumentsPage';
// Sprint 5 - Billing Module
import ServicesListPage from './pages/services/ServicesListPage';
import CreateServicePage from './pages/services/CreateServicePage';
import EditServicePage from './pages/services/EditServicePage';
import ViewServicePage from './pages/services/ViewServicePage';
import InvoicesListPage from './pages/invoices/InvoicesListPage';
import CreateInvoicePage from './pages/invoices/CreateInvoicePage';
import EditInvoicePage from './pages/invoices/EditInvoicePage';
import ViewInvoicePage from './pages/invoices/ViewInvoicePage';
import PaymentsListPage from './pages/payments/PaymentsListPage';
import RecordPaymentPage from './pages/payments/RecordPaymentPage';
import ViewPaymentPage from './pages/payments/ViewPaymentPage';
import EstimatesListPage from './pages/estimates/EstimatesListPage';
import CreateEstimatePage from './pages/estimates/CreateEstimatePage';
import EditEstimatePage from './pages/estimates/EditEstimatePage';
import ViewEstimatePage from './pages/estimates/ViewEstimatePage';
// Sprint 6 - Claims Module
import ClaimsListPage from './pages/claims/ClaimsListPage';
import ViewClaimPage from './pages/claims/ViewClaimPage';
import DeniedClaimsPage from './pages/claims/DeniedClaimsPage';
import ResubmitClaimPage from './pages/claims/ResubmitClaimPage';
import SecondaryClaimsPage from './pages/claims/SecondaryClaimsPage';
// Sprint 6 - ERA Module
import ERAListPage from './pages/era/ERAListPage';
import ImportERAPage from './pages/era/ImportERAPage';
import ViewERAPage from './pages/era/ViewERAPage';
import UnmatchedERAItemsPage from './pages/era/UnmatchedERAItemsPage';
// Sprint 6 - Authorization Module
import AuthorizationsListPage from './pages/authorizations/AuthorizationsListPage';
import CreateAuthorizationPage from './pages/authorizations/CreateAuthorizationPage';
import ViewAuthorizationPage from './pages/authorizations/ViewAuthorizationPage';
import PortalLoginPage from './pages/portal/PortalLoginPage';
import PortalRegisterPage from './pages/portal/PortalRegisterPage';
import PortalDashboardPage from './pages/portal/PortalDashboardPage';
import PortalAppointmentsPage from './pages/portal/PortalAppointmentsPage';
import PortalAppointmentDetailPage from './pages/portal/PortalAppointmentDetailPage';
import PortalMessagesPage from './pages/portal/PortalMessagesPage';
import PortalFormsPage from './pages/portal/PortalFormsPage';
import PortalFormDetailPage from './pages/portal/PortalFormDetailPage';
import PortalProfilePage from './pages/portal/PortalProfilePage';
import PortalNotificationsPage from './pages/portal/PortalNotificationsPage';
import ProviderPortalMessagesPage from './pages/portal/ProviderPortalMessagesPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

/**
 * App Component - Root Application Component
 * 
 * Provider Hierarchy (Order Matters):
 * 1. ReduxProvider - Redux store for application state
 * 2. QueryClientProvider - React Query for server state/caching
 * 3. ThemeProvider - Material UI theme
 * 4. AuthProvider - Authentication context (simple global state)
 * 5. SnackbarProvider - Notification context (simple global state)
 * 6. BrowserRouter - React Router for navigation
 * 
 * Architecture Rationale:
 * - Redux: Complex application state (patient, appointment, billing interactions)
 * - React Query: Server state (API data, automatic caching, request deduplication)
 * - Context API: Simple global state (auth, notifications)
 * 
 * This hybrid approach provides:
 * - Best performance (React Query eliminates redundant API calls)
 * - Scalable state management (Redux handles complex interactions)
 * - Simple solutions for simple problems (Context API)
 * 
 * @author Senior Software Engineer
 */
function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/setup-password"
                element={
                  <PublicRoute>
                    <SetupPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register/verify"
                element={
                  <PublicRoute>
                    <RegisterVerifyPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/portal/login"
                element={
                  <PublicRoute>
                    <PortalLoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/portal/register"
                element={
                  <PublicRoute>
                    <PortalRegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalDashboardPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/appointments"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalAppointmentsPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/appointments/:appointmentId"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalAppointmentDetailPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/messages"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalMessagesPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/forms"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalFormsPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/forms/:formId"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalFormDetailPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/profile"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalProfilePage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/notifications"
                element={
                  <ProtectedRoute requiredRoles={['Patient']}>
                    <PortalLayout>
                      <PortalNotificationsPage />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireAllRoles={true}>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireAllRoles={true}>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute requireAllRoles={true}>
                    <Layout>
                      <ChangePasswordPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <UsersListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreateUserPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditUserPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId/roles"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <AssignRolesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ViewUserPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice-info"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <PracticeInfoListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice-info/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreatePracticeInfoPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice-info/:practiceInfoId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditPracticeInfoPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice-info/:practiceInfoId"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ViewPracticeInfoPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
                    <Layout>
                      <PatientsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
                    <Layout>
                      <CreatePatientPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
                    <Layout>
                      <EditPatientPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
                    <Layout>
                      <ViewPatientPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId/insurance/:insuranceId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
                    <Layout>
                      <ViewPatientInsurancePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId/allergies/:allergyId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ViewPatientAllergyPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId/medical-history"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor', 'Receptionist']}>
                    <Layout>
                      <PatientMedicalHistoryPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/allergies"
                element={
                  <ProtectedRoute
                    requiredRoles={['Admin', 'Doctor', 'Receptionist']}
                  >
                    <Layout>
                      <AllergiesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/allergies/new"
                element={
                  <ProtectedRoute
                    requiredRoles={['Admin', 'Doctor', 'Receptionist']}
                  >
                    <Layout>
                      <CreateAllergyPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/allergies/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRoles={['Admin', 'Doctor', 'Receptionist']}
                  >
                    <Layout>
                      <EditAllergyPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insurance-companies"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <InsuranceCompaniesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insurance-companies/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreateInsuranceCompanyPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insurance-companies/:insuranceCompanyId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditInsuranceCompanyPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ProvidersListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreateProviderPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/:providerId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditProviderPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/providers/:providerId"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ViewProviderPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-types"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <AppointmentTypesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-types/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreateAppointmentTypePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-types/:appointmentTypeId"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ViewAppointmentTypePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-types/:appointmentTypeId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditAppointmentTypePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <RoomsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <CreateRoomPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms/:roomId"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <ViewRoomPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms/:roomId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin']}>
                    <Layout>
                      <EditRoomPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist", "Provider", "Doctor"]}>
                    <Layout>
                      <AppointmentsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal-messages"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Provider', 'Doctor']}>
                    <Layout>
                      <ProviderPortalMessagesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <CreateAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/schedule"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <SchedulePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/calendar"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <AppointmentCalendarPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:appointmentId"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist", "Provider", "Doctor"]}>
                    <Layout>
                      <ViewAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:appointmentId/edit"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <EditAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waitlist"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <WaitlistListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waitlist/new"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <CreateWaitlistPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waitlist/:waitlistEntryId"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <ViewWaitlistPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waitlist/:waitlistEntryId/edit"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <EditWaitlistPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring-appointments"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <RecurringAppointmentsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring-appointments/new"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <CreateRecurringAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring-appointments/:recurringAppointmentId"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <ViewRecurringAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recurring-appointments/:recurringAppointmentId/edit"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Receptionist"]}>
                    <Layout>
                      <EditRecurringAppointmentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/note-templates"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <NoteTemplatesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/note-templates/create"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <CreateNoteTemplatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/note-templates/:noteTemplateId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ViewNoteTemplatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/note-templates/:noteTemplateId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <EditNoteTemplatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clinical-notes"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ClinicalNotesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clinical-notes/create"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <CreateClinicalNotePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clinical-notes/:clinicalNoteId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ViewClinicalNotePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clinical-notes/:clinicalNoteId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <EditClinicalNotePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vital-signs"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <VitalSignsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vital-signs/create"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <CreateVitalSignPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vital-signs/:vitalSignId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ViewVitalSignPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vital-signs/:vitalSignId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <EditVitalSignPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vital-signs/patient/:patientId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <PatientVitalHistoryPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <DocumentsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/upload"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <UploadDocumentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:documentId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <ViewDocumentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:documentId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <EditDocumentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/patient/:patientId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
                    <Layout>
                      <PatientDocumentsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Sprint 5 - Billing Module Routes */}
              <Route
                path="/services"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ServicesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <CreateServicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/:serviceId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ViewServicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/:serviceId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <EditServicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <InvoicesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <CreateInvoicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/:invoiceId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <ViewInvoicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/:invoiceId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <EditInvoicePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <PaymentsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <RecordPaymentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/:paymentId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
                    <Layout>
                      <ViewPaymentPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimates"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Doctor']}>
                    <Layout>
                      <EstimatesListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimates/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Doctor']}>
                    <Layout>
                      <CreateEstimatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimates/:estimateId/edit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Doctor']}>
                    <Layout>
                      <EditEstimatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimates/:estimateId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Doctor']}>
                    <Layout>
                      <ViewEstimatePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Sprint 6 - Claims Module */}
              <Route
                path="/claims"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ClaimsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claims/denied"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <DeniedClaimsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claims/:claimId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ViewClaimPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claims/:claimId/resubmit"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ResubmitClaimPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claims/secondary"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <SecondaryClaimsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Sprint 6 - ERA Module */}
              <Route
                path="/era"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ERAListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/era/import"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ImportERAPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/era/unmatched"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <UnmatchedERAItemsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/era/:eraId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
                    <Layout>
                      <ViewERAPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Sprint 6 - Authorization Module */}
              <Route
                path="/authorizations"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Front Desk']}>
                    <Layout>
                      <AuthorizationsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authorizations/new"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Front Desk']}>
                    <Layout>
                      <CreateAuthorizationPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authorizations/:authorizationId"
                element={
                  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Front Desk']}>
                    <Layout>
                      <ViewAuthorizationPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<HomeRoute />} />
              <Route path="*" element={<HomeRoute />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
