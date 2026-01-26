import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { loginValidations } from '../../validations/auth.validations';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const {
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPassword,
    resendPasswordResetCode,
  } = useAuth();
  const [step, setStep] = useState(1); // 1: Request, 2: Verify, 3: Reset
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('newPassword');

  // Step 1: Request Password Reset
  const handleRequestReset = async (data) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await requestPasswordReset(data.email);
      if (result.success) {
        setResetEmail(data.email);
        setSuccess(true);
        setStep(2);
        // Start resend timer (60 seconds)
        setResendTimer(60);
      } else {
        setError(result.error || 'Failed to send reset code. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async () => {
    if (!resetCode || resetCode.length !== 6) {
      setError('Please enter a valid 6-digit reset code.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await verifyPasswordResetCode(resetEmail, resetCode);
      if (result.success) {
        setSuccess(false); // Clear success from previous step
        setStep(3);
      } else {
        setSuccess(false);
        setError(result.error || 'Invalid reset code. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.message || 
                          err.message || 
                          'Invalid reset code. Please try again.';
                          setSuccess(false);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccess(false); // Clear any previous success message
    setLoading(true);

    try {
      const result = await resetPassword(resetEmail, resetCode, data.newPassword);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', {
            replace: true,
            state: {
              message: 'Password reset successfully! Please login with your new password.',
            },
          });
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Code
  const handleResendCode = async () => {
    if (resendTimer > 0) {
      return; // Don't allow resend if timer is active
    }

    setError('');
    setResending(true);

    try {
      const result = await resendPasswordResetCode(resetEmail);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Start resend timer (60 seconds)
        setResendTimer(60);
      } else {
        setError(result.error || 'Failed to resend reset code. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Timer effect for resend code
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify Reset Code'}
            {step === 3 && 'Reset Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {step === 1 && "Enter your email address and we'll send you a reset code."}
            {step === 2 && `We've sent a reset code to ${resetEmail}. Please check your email.`}
            {step === 3 && 'Enter your new password below.'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && step === 2 && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Reset code sent to your email!
            </Alert>
          )}


          {/* Step 1: Request Reset */}
          {step === 1 && (
            <Box
              component="form"
              onSubmit={handleSubmit(handleRequestReset)}
              sx={{ mt: 1, width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', loginValidations.email)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Back to Sign In
                </MuiLink>
              </Box>
            </Box>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <Box sx={{ mt: 1, width: '100%' }}>
              <TextField
                fullWidth
                id="resetCode"
                label="Reset Code"
                value={resetCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setResetCode(value);
                  // Only clear error when user starts typing, not on every keystroke
                  if (error && value.length === 0) {
                    setError('');
                  }
                }}
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' },
                }}
                error={!!error}
                helperText={error || ''}
                sx={{ mb: 2 }}
                autoFocus
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyCode}
                disabled={loading || resetCode.length !== 6}
                sx={{ mb: 2 }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleResendCode}
                disabled={resending || resendTimer > 0}
                sx={{ mb: 2 }}
                startIcon={resending ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {resending
                  ? 'Resending...'
                  : resendTimer > 0
                  ? `Resend Code (${resendTimer}s)`
                  : 'Resend Code'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <MuiLink
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setStep(1);
                    setResetCode('');
                    setError('');
                    setSuccess(false);
                  }}
                  sx={{ cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  Use Different Email
                </MuiLink>
              </Box>
            </Box>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <Box
              component="form"
              onSubmit={handleSubmit(handleResetPassword)}
              sx={{ mt: 1, width: '100%' }}
            >
              {success && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                  Password reset successfully! Redirecting to login...
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
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
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
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
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Back to Sign In
                </MuiLink>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;

