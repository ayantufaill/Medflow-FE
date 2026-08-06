import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleNames } from '../../utils/auth-routing';
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

  return (
    <Layout hideSidebar={true}>
      <DashboardTab />
    </Layout>
  );
};

export default DashboardRoute;
