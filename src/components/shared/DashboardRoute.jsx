import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleNames, getStaffLandingRoute } from '../../utils/auth-routing';
import Layout from '../layout/Layout';
import DashboardTab from '../../pages/admin/reports/DashboardTab';

const DashboardRoute = () => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = getRoleNames(user);

  if (roles.includes('Patient')) {
    return <Navigate to="/portal" replace />;
  }

  // No reports access (most clinical and lab roles): the dashboard's API would
  // refuse, so go to the page this user actually works from instead.
  const landing = getStaffLandingRoute(user);
  if (landing !== '/dashboard') {
    return <Navigate to={landing} replace />;
  }

  return (
    <Layout hideSidebar={true}>
      <DashboardTab />
    </Layout>
  );
};

export default DashboardRoute;
