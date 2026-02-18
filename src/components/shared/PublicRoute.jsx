import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { getPostLoginRoute } from '../../utils/auth-routing';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getPostLoginRoute(user)} replace />;
  }

  return children;
};

export default PublicRoute;
