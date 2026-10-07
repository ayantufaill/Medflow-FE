import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import RoleBasedPortalMessagesRoute from '../components/shared/RoleBasedPortalMessagesRoute';
import Layout from '../components/layout/Layout';
import PortalLayout from '../components/layout/PortalLayout';
import PortalDashboardPage from '../pages/portal/PortalDashboardPage';
import PortalAppointmentsPage from '../pages/portal/PortalAppointmentsPage';
import PortalAppointmentDetailPage from '../pages/portal/PortalAppointmentDetailPage';
import PortalFormsPage from '../pages/portal/PortalFormsPage';
import PortalFormDetailPage from '../pages/portal/PortalFormDetailPage';
import PortalProfilePage from '../pages/portal/PortalProfilePage';
import PortalNotificationsPage from '../pages/portal/PortalNotificationsPage';
import ProviderPortalMessagesPage from '../pages/portal/ProviderPortalMessagesPage';

const portalRoutes = [
  <Route
    key="/portal"
    path="/portal"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalDashboardPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/appointments"
    path="/portal/appointments"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalAppointmentsPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/appointments/:appointmentId"
    path="/portal/appointments/:appointmentId"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalAppointmentDetailPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  // 'Doctor' was not a real backend role (see seedRoles.ts) and is dropped
  // here rather than replaced — 'Provider' already covers it.
  <Route
    key="/portal/messages"
    path="/portal/messages"
    element={
      // Patients, plus Admin / Provider staff by exact role name (not the
      // whole admin group: the access matrix gives Group/Branch Admin no portal).
      <ProtectedRoute
        allowedGroups={['__none__']}
        allowIf={(user) => (user?.roles || [])
          .map((r) => (typeof r === 'string' ? r : r?.name))
          .some((name) => ['Patient', 'Admin', 'Provider', 'Doctor', 'dentist'].includes(name))}
      >
        <RoleBasedPortalMessagesRoute />
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/forms"
    path="/portal/forms"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalFormsPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/forms/:formId"
    path="/portal/forms/:formId"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalFormDetailPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/profile"
    path="/portal/profile"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalProfilePage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal/notifications"
    path="/portal/notifications"
    element={
      <ProtectedRoute requiredRoles={['Patient']}>
        <PortalLayout><PortalNotificationsPage /></PortalLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="/portal-messages"
    path="/portal-messages"
    element={
      // Screen access matrix: Super Admin / Admin and Provider only. Not
      // requiredRoles={['Admin']}, which also admits Group/Branch Admin.
      <ProtectedRoute
        allowedGroups={['__none__']}
        allowIf={(user) => (user?.roles || [])
          .map((r) => (typeof r === 'string' ? r : r?.name))
          .some((name) => ['Admin', 'Provider', 'Doctor', 'dentist'].includes(name))}
      >
        <Layout><ProviderPortalMessagesPage /></Layout>
      </ProtectedRoute>
    }
  />,
];

export default portalRoutes;
