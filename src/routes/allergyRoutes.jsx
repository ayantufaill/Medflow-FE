import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import AllergiesListPage from '../pages/allergies/AllergiesListPage';
import CreateAllergyPage from '../pages/allergies/CreateAllergyPage';
import EditAllergyPage from '../pages/allergies/EditAllergyPage';

const roles = ['Admin', 'Doctor', 'Receptionist'];

const allergyRoutes = [
  <Route
    key="/allergies"
    path="/allergies"
    element={<ProtectedRoute requiredRoles={roles}><Layout><AllergiesListPage /></Layout></ProtectedRoute>}
  />,
  <Route
    key="/allergies/new"
    path="/allergies/new"
    element={<ProtectedRoute requiredRoles={roles}><Layout><CreateAllergyPage /></Layout></ProtectedRoute>}
  />,
  <Route
    key="/allergies/:id/edit"
    path="/allergies/:id/edit"
    element={<ProtectedRoute requiredRoles={roles}><Layout><EditAllergyPage /></Layout></ProtectedRoute>}
  />,
];

export default allergyRoutes;
