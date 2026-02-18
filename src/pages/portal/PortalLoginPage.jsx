import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { getPostLoginRoute } from '../../utils/auth-routing';

const PortalLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    const result = await login(values);
    if (result.success) {
      navigate(getPostLoginRoute(result.user), { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Portal Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access your appointments, messages, and forms.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Link component={RouterLink} to="/portal/register" underline="hover">
            Create patient account
          </Link>
          <Link component={RouterLink} to="/forgot-password" underline="hover">
            Forgot password
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortalLoginPage;
