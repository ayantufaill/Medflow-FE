import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleNames } from '../../utils/auth-routing';

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

  if (roles.includes('Admin')) {
    return <Navigate to="/admin/reports" replace />;
  }
  
  if (roles.includes('Doctor') || roles.includes('Provider')) {
    return <Navigate to="/clinical" replace />;
  }
  
  if (roles.includes('Receptionist') || roles.includes('Front Desk')) {
    return <Navigate to="/appointments/operatory-schedule" replace />;
  }
  
  if (roles.includes('Billing')) {
    return <Navigate to="/finance" replace />;
  }

  if (roles.includes('Patient')) {
    return <Navigate to="/portal" replace />;
  }

  // Fallback if no matching role
  return <Navigate to="/appointments/operatory-schedule" replace />;
};

export default DashboardRoute;
