import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import ProvidersListPage from '../pages/providers/ProvidersListPage';
import CreateProviderPage from '../pages/providers/CreateProviderPage';
import EditProviderPage from '../pages/providers/EditProviderPage';
import ViewProviderPage from '../pages/providers/ViewProviderPage';
import AppointmentTypesListPage from '../pages/appointment-types/AppointmentTypesListPage';
import CreateAppointmentTypePage from '../pages/appointment-types/CreateAppointmentTypePage';
import EditAppointmentTypePage from '../pages/appointment-types/EditAppointmentTypePage';
import ViewAppointmentTypePage from '../pages/appointment-types/ViewAppointmentTypePage';
import RoomsListPage from '../pages/rooms/RoomsListPage';
import CreateRoomPage from '../pages/rooms/CreateRoomPage';
import EditRoomPage from '../pages/rooms/EditRoomPage';
import ViewRoomPage from '../pages/rooms/ViewRoomPage';
import InsuranceCompaniesListPage from '../pages/insurance-companies/InsuranceCompaniesListPage';
import CreateInsuranceCompanyPage from '../pages/insurance-companies/CreateInsuranceCompanyPage';
import EditInsuranceCompanyPage from '../pages/insurance-companies/EditInsuranceCompanyPage';
import NoteTemplatesListPage from '../pages/note-templates/NoteTemplatesListPage';
import CreateNoteTemplatePage from '../pages/note-templates/CreateNoteTemplatePage';
import EditNoteTemplatePage from '../pages/note-templates/EditNoteTemplatePage';
import ViewNoteTemplatePage from '../pages/note-templates/ViewNoteTemplatePage';

const adminOnly = (children) => (
  <ProtectedRoute requiredRoles={['Admin']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const adminDoctor = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const configRoutes = [
  <Route key="/providers" path="/providers" element={adminOnly(<ProvidersListPage />)} />,
  <Route key="/providers/new" path="/providers/new" element={adminOnly(<CreateProviderPage />)} />,
  <Route key="/providers/:providerId/edit" path="/providers/:providerId/edit" element={adminOnly(<EditProviderPage />)} />,
  <Route key="/providers/:providerId" path="/providers/:providerId" element={adminOnly(<ViewProviderPage />)} />,

  <Route key="/appointment-types" path="/appointment-types" element={adminOnly(<AppointmentTypesListPage />)} />,
  <Route key="/appointment-types/new" path="/appointment-types/new" element={adminOnly(<CreateAppointmentTypePage />)} />,
  <Route key="/appointment-types/:appointmentTypeId/edit" path="/appointment-types/:appointmentTypeId/edit" element={adminOnly(<EditAppointmentTypePage />)} />,
  <Route key="/appointment-types/:appointmentTypeId" path="/appointment-types/:appointmentTypeId" element={adminOnly(<ViewAppointmentTypePage />)} />,

  <Route key="/rooms" path="/rooms" element={adminOnly(<RoomsListPage />)} />,
  <Route key="/rooms/new" path="/rooms/new" element={adminOnly(<CreateRoomPage />)} />,
  <Route key="/rooms/:roomId/edit" path="/rooms/:roomId/edit" element={adminOnly(<EditRoomPage />)} />,
  <Route key="/rooms/:roomId" path="/rooms/:roomId" element={adminOnly(<ViewRoomPage />)} />,

  <Route key="/insurance-companies" path="/insurance-companies" element={adminOnly(<InsuranceCompaniesListPage />)} />,
  <Route key="/insurance-companies/new" path="/insurance-companies/new" element={adminOnly(<CreateInsuranceCompanyPage />)} />,
  <Route key="/insurance-companies/:insuranceCompanyId/edit" path="/insurance-companies/:insuranceCompanyId/edit" element={adminOnly(<EditInsuranceCompanyPage />)} />,

  <Route key="/note-templates" path="/note-templates" element={adminDoctor(<NoteTemplatesListPage />)} />,
  <Route key="/note-templates/create" path="/note-templates/create" element={adminDoctor(<CreateNoteTemplatePage />)} />,
  <Route key="/note-templates/:noteTemplateId/edit" path="/note-templates/:noteTemplateId/edit" element={adminDoctor(<EditNoteTemplatePage />)} />,
  <Route key="/note-templates/:noteTemplateId" path="/note-templates/:noteTemplateId" element={adminDoctor(<ViewNoteTemplatePage />)} />,
];

export default configRoutes;
