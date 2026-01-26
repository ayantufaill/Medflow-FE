import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    // Check if new password is different from current password
    if (data.currentPassword === data.newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      // Call API to change password
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setSuccess(true);

      // After successful password change, clear session and logout user
      // Wait a moment to show success message
      setTimeout( () => {
        try {
          // Clear session and logout
          clearSession();
          window.location.reload();
        } catch (err) {
          console.error('Error during logout:', err);
          // Even if logout fails, navigate to login
          navigate('/login', {
            replace: true,
            state: {
              message: 'Password changed successfully. Please login with your new password.',
            },
          });
        }
      }, 2000);
    } catch (error) {
      // Handle backend error response
      const errorData = error.response?.data;

      // Check for nested error structure
      if (errorData?.error) {
        // Main error message
        const mainMessage =
          errorData.error.message ||
          errorData.message ||
          'Failed to change password';
        setError(mainMessage);
      } else {
        // Fallback error handling
        const message =
          errorData?.message ||
          error.message ||
          'Failed to change password. Please try again.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Change Password
      </Typography>
      <Paper sx={{ p: 4, mt: 3, maxWidth: 600 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Password changed successfully! Redirecting to login...
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            type={showCurrentPassword ? 'text' : 'password'}
            label="Current Password"
            margin="normal"
            required
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message || ''}
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            label="New Password"
            margin="normal"
            required
            error={!!errors.newPassword}
            helperText={
              errors.newPassword?.message ||
              'Password must be at least 8 characters with uppercase, lowercase, and number'
            }
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, and one number',
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm New Password"
            margin="normal"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message || ''}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.5 }}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordPage;
