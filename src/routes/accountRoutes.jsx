import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import ProfilePage from '../pages/account/ProfilePage';
import ChangePasswordPage from '../pages/account/ChangePasswordPage';
import InsuranceFormMockupPage from '../pages/demo/InsuranceFormMockupPage';

const anyRole = (children) => (
  <ProtectedRoute requireAllRoles={true}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const accountRoutes = [
  <Route key="/profile" path="/profile" element={anyRole(<ProfilePage />)} />,
  <Route key="/change-password" path="/change-password" element={anyRole(<ChangePasswordPage />)} />,
  <Route
    key="/demo/insurance-form"
    path="/demo/insurance-form"
    element={
      <ProtectedRoute requireAllRoles={true}>
        <InsuranceFormMockupPage />
      </ProtectedRoute>
    }
  />,
];

export default accountRoutes;
