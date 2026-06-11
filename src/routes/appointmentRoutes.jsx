import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import { wrapWithBoundary } from '../components/shared';
import AppointmentsListPage from '../pages/appointments/AppointmentsListPage';
import CreateAppointmentPage from '../pages/appointments/CreateAppointmentPage';
import EditAppointmentPage from '../pages/appointments/EditAppointmentPage';
import ViewAppointmentPage from '../pages/appointments/ViewAppointmentPage';
import SchedulePage from '../pages/appointments/SchedulePage';
import AppointmentCalendarPage from '../pages/appointments/AppointmentCalendarPage';
import OperatorySchedulePage from '../pages/appointments/OperatorySchedulePage';
import WaitlistListPage from '../pages/waitlist/WaitlistListPage';
import CreateWaitlistPage from '../pages/waitlist/CreateWaitlistPage';
import EditWaitlistPage from '../pages/waitlist/EditWaitlistPage';
import ViewWaitlistPage from '../pages/waitlist/ViewWaitlistPage';
import RecurringAppointmentsListPage from '../pages/recurring-appointments/RecurringAppointmentsListPage';
import CreateRecurringAppointmentPage from '../pages/recurring-appointments/CreateRecurringAppointmentPage';
import EditRecurringAppointmentPage from '../pages/recurring-appointments/EditRecurringAppointmentPage';
import ViewRecurringAppointmentPage from '../pages/recurring-appointments/ViewRecurringAppointmentPage';

const adminReception = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const appointmentRoutes = [
  <Route
    key="/appointments"
    path="/appointments"
    element={
      <ProtectedRoute requiredRoles={['Admin', 'Receptionist', 'Provider', 'Doctor']}>
        <Layout><AppointmentsListPage /></Layout>
      </ProtectedRoute>
    }
  />,
  <Route key="/appointments/new" path="/appointments/new" element={adminReception(<CreateAppointmentPage />)} />,
  <Route key="/appointments/schedule" path="/appointments/schedule" element={adminReception(<SchedulePage />)} />,
  <Route key="/appointments/calendar" path="/appointments/calendar" element={adminReception(wrapWithBoundary(<AppointmentCalendarPage />))} />,

  <Route key="/appointments/operatory-schedule" path="/appointments/operatory-schedule" element={adminReception(<OperatorySchedulePage />)} />,
  <Route
    key="/appointments/:appointmentId"
    path="/appointments/:appointmentId"
    element={
      <ProtectedRoute requiredRoles={['Admin', 'Receptionist', 'Provider', 'Doctor']}>
        <Layout><ViewAppointmentPage /></Layout>
      </ProtectedRoute>
    }
  />,
  <Route key="/appointments/:appointmentId/edit" path="/appointments/:appointmentId/edit" element={adminReception(<EditAppointmentPage />)} />,
  <Route key="/waitlist" path="/waitlist" element={adminReception(<WaitlistListPage />)} />,
  <Route key="/waitlist/new" path="/waitlist/new" element={adminReception(<CreateWaitlistPage />)} />,
  <Route key="/waitlist/:waitlistEntryId" path="/waitlist/:waitlistEntryId" element={adminReception(<ViewWaitlistPage />)} />,
  <Route key="/waitlist/:waitlistEntryId/edit" path="/waitlist/:waitlistEntryId/edit" element={adminReception(<EditWaitlistPage />)} />,
  <Route key="/recurring-appointments" path="/recurring-appointments" element={adminReception(<RecurringAppointmentsListPage />)} />,
  <Route key="/recurring-appointments/new" path="/recurring-appointments/new" element={adminReception(<CreateRecurringAppointmentPage />)} />,
  <Route key="/recurring-appointments/:recurringAppointmentId" path="/recurring-appointments/:recurringAppointmentId" element={adminReception(<ViewRecurringAppointmentPage />)} />,
  <Route key="/recurring-appointments/:recurringAppointmentId/edit" path="/recurring-appointments/:recurringAppointmentId/edit" element={adminReception(<EditRecurringAppointmentPage />)} />,
];

export default appointmentRoutes;
