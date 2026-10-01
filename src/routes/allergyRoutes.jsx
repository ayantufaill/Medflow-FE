import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import AllergiesListPage from '../pages/allergies/AllergiesListPage';
import CreateAllergyPage from '../pages/allergies/CreateAllergyPage';
import EditAllergyPage from '../pages/allergies/EditAllergyPage';

// Medflow-BE's allergy.routes.ts has no per-route role/permission check beyond
// basic PHI access (authenticate + requirePhiAccess) — every clinical and
// operations role can use it, not just Provider/Receptionist. This used to
// exclude Hygienist, Assistant, Dental Assistant, Clinical Staff, Front Desk,
// Biller, and Lab, none of whom the backend actually blocks.
const allowedGroups = ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'];

const allergyRoutes = [
  <Route
    key="/allergies"
    path="/allergies"
    element={<ProtectedRoute allowedGroups={allowedGroups}><Layout><AllergiesListPage /></Layout></ProtectedRoute>}
  />,
  <Route
    key="/allergies/new"
    path="/allergies/new"
    element={<ProtectedRoute allowedGroups={allowedGroups}><Layout><CreateAllergyPage /></Layout></ProtectedRoute>}
  />,
  <Route
    key="/allergies/:id/edit"
    path="/allergies/:id/edit"
    element={<ProtectedRoute allowedGroups={allowedGroups}><Layout><EditAllergyPage /></Layout></ProtectedRoute>}
  />,
];

export default allergyRoutes;
