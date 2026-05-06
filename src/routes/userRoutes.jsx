import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import UsersListPage from '../pages/users/UsersListPage';
import CreateUserPage from '../pages/users/CreateUserPage';
import EditUserPage from '../pages/users/EditUserPage';
import ViewUserPage from '../pages/users/ViewUserPage';
import AssignRolesPage from '../pages/users/AssignRolesPage';

const adminOnly = (children) => (
  <ProtectedRoute requiredRoles={['Admin']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const userRoutes = [
  <Route key="/users" path="/users" element={adminOnly(<UsersListPage />)} />,
  <Route key="/users/new" path="/users/new" element={adminOnly(<CreateUserPage />)} />,
  <Route key="/users/:userId/edit" path="/users/:userId/edit" element={adminOnly(<EditUserPage />)} />,
  <Route key="/users/:userId/roles" path="/users/:userId/roles" element={adminOnly(<AssignRolesPage />)} />,
  <Route key="/users/:userId" path="/users/:userId" element={adminOnly(<ViewUserPage />)} />,
];

export default userRoutes;
