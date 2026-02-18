import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getPostLoginRoute } from '../../utils/auth-routing';

const HomeRoute = () => {
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

  return <Navigate to={getPostLoginRoute(user)} replace />;
};

export default HomeRoute;
