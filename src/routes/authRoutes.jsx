import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import PublicRoute from '../components/shared/PublicRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import SetupPasswordPage from '../pages/auth/SetupPasswordPage';
import RegisterVerifyPage from '../pages/auth/RegisterVerifyPage';
import PortalLoginPage from '../pages/portal/PortalLoginPage';
import PortalRegisterPage from '../pages/portal/PortalRegisterPage';

const authRoutes = [
  <Route
    key="/login"
    path="/login"
    element={<PublicRoute><LoginPage /></PublicRoute>}
  />,
  <Route
    key="/register"
    path="/register"
    element={<ProtectedRoute requiredRoles={['Admin']}><RegisterPage /></ProtectedRoute>}
  />,
  <Route
    key="/forgot-password"
    path="/forgot-password"
    element={<PublicRoute><ForgotPasswordPage /></PublicRoute>}
  />,
  <Route
    key="/setup-password"
    path="/setup-password"
    element={<PublicRoute><SetupPasswordPage /></PublicRoute>}
  />,
  <Route
    key="/register/verify"
    path="/register/verify"
    element={<PublicRoute><RegisterVerifyPage /></PublicRoute>}
  />,
  <Route
    key="/portal/login"
    path="/portal/login"
    element={<PublicRoute><PortalLoginPage /></PublicRoute>}
  />,
  <Route
    key="/portal/register"
    path="/portal/register"
    element={<PublicRoute><PortalRegisterPage /></PublicRoute>}
  />,
];

export default authRoutes;
