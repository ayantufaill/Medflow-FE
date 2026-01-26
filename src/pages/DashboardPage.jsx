import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome to MedFlow
      </Typography>
      <Paper sx={{ p: 4, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Hello, {user?.firstName} {user?.lastName}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user?.email}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPage;

