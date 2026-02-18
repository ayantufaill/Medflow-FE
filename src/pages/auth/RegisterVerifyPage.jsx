import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../../services/auth.service';
import { registerValidations, getConfirmPasswordValidation } from '../../validations/auth.validations';
import { getPostLoginRoute } from '../../utils/auth-routing';

const RegisterVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link. Please check your email and try again.');
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) {
      setError('Invalid verification link. Please check your email and try again.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await authService.verifyEmailAndRegister(token, data.password);
      if (result) {
        setSuccess(true);
        // Store tokens if provided (AuthContext will decode and set user state)
        if (result.tokens) {
          localStorage.setItem('accessToken', result.tokens.accessToken);
          localStorage.setItem('refreshToken', result.tokens.refreshToken);
        }
        // Redirect to role-specific home or login after 2 seconds
        setTimeout(() => {
          if (result.tokens) {
            const roleRoute = (() => {
              try {
                const payload = JSON.parse(atob(result.tokens.accessToken.split('.')[1]));
                return getPostLoginRoute(payload.roles || []);
              } catch {
                return '/dashboard';
              }
            })();
            navigate(roleRoute, { replace: true });
          } else {
            navigate('/login', {
              state: { message: 'Password set successfully! Your account is now active. Please login.' },
            });
          }
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to set password. The link may have expired. Please contact support or try registering again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper sx={{ p: 4, width: '100%' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid verification link. Please check your email and try again.
            </Alert>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={Link} to="/register" variant="body2">
                Go to Registration
              </MuiLink>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Set Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Complete your registration by setting your password. Your account will be activated once you set your password.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password set successfully! Your account is now active. Redirecting...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', registerValidations.password)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword', getConfirmPasswordValidation(password))}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || success}
            >
              {loading ? <CircularProgress size={24} /> : 'Set Password & Activate Account'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Back to Login
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterVerifyPage;
