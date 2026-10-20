import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { loginValidations } from '../../validations/auth.validations';
import { AuthLayout, AuthInput, AuthButton } from '../../components/auth';

const alertSx = {
  mb: 2,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  borderRadius: '8px',
};

const footerLinkSx = {
  textAlign: 'center',
  mt: '28px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  color: '#6B7280',
};

const linkStyle = {
  color: '#2D6CDF',
  fontWeight: 600,
  textDecoration: 'none',
};

const showHideButtonSx = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'Manrope, sans-serif',
  fontWeight: 700,
  fontSize: '11px',
  letterSpacing: '0.06em',
  color: '#6B7280',
  '&:hover': { color: '#082545' },
  transition: 'color 0.15s ease',
};

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
    } catch {
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
    } catch {
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
    } catch {
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
    <AuthLayout>
      <Box sx={{ width: '100%', maxWidth: 380 }}>
        {/* Heading */}
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '24px',
            lineHeight: 1,
            letterSpacing: '-0.24px',
            color: '#082545',
            mb: '6px',
          }}
        >
          {step === 1 && 'Forgot password?'}
          {step === 2 && 'Check your email'}
          {step === 3 && 'Set new password'}
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#6B7280',
            mb: '28px',
          }}
        >
          {step === 1 && "Enter your email address and we'll send you a 6-digit reset code."}
          {step === 2 && (
            <>
              We've sent a 6-digit reset code to{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#082545' }}>
                {resetEmail}
              </Box>
              . Please check your inbox.
            </>
          )}
          {step === 3 && 'Choose a new password for your MedFlow account.'}
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={alertSx}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && step === 2 && (
          <Alert severity="success" sx={alertSx}>
            Reset code sent to your email!
          </Alert>
        )}

        {/* Step 1: Request Reset */}
        {step === 1 && (
          <Box component="form" onSubmit={handleSubmit(handleRequestReset)} noValidate>
            <AuthInput
              id="email"
              label="CLINIC EMAIL"
              type="email"
              placeholder="dr.wells@medflow.io"
              autoFocus
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', loginValidations.email)}
            />
            <AuthButton type="submit" loading={loading} loadingText="Sending...">
              Send Reset Code
            </AuthButton>
            <Typography sx={footerLinkSx}>
              <Link to="/login" style={linkStyle}>
                Back to Sign In
              </Link>
            </Typography>
          </Box>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <Box>
            <AuthInput
              id="resetCode"
              label="RESET CODE"
              placeholder="123456"
              autoFocus
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              value={resetCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setResetCode(value);
                // Only clear error when user starts typing, not on every keystroke
                if (error && value.length === 0) {
                  setError('');
                }
              }}
              style={{
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '10px',
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AuthButton
                loading={loading}
                loadingText="Verifying..."
                disabled={resetCode.length !== 6}
                onClick={handleVerifyCode}
              >
                Verify Code
              </AuthButton>
              <AuthButton
                variant="outlined"
                loading={resending}
                loadingText="Resending..."
                disabled={resendTimer > 0}
                onClick={handleResendCode}
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
              </AuthButton>
            </Box>

            <Typography sx={footerLinkSx}>
              <Box
                component="button"
                type="button"
                onClick={() => {
                  setStep(1);
                  setResetCode('');
                  setError('');
                  setSuccess(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  ...linkStyle,
                }}
              >
                Use Different Email
              </Box>
            </Typography>
          </Box>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <Box component="form" onSubmit={handleSubmit(handleResetPassword)} noValidate>
            {success && (
              <Alert severity="success" sx={alertSx}>
                Password reset successfully! Redirecting to login...
              </Alert>
            )}
            <AuthInput
              id="newPassword"
              label="NEW PASSWORD"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              endAdornment={
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  sx={showHideButtonSx}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </Box>
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
            />
            <AuthInput
              id="confirmPassword"
              label="CONFIRM NEW PASSWORD"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              endAdornment={
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  sx={showHideButtonSx}
                >
                  {showConfirmPassword ? 'HIDE' : 'SHOW'}
                </Box>
              }
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <AuthButton type="submit" loading={loading} loadingText="Resetting...">
              Reset Password
            </AuthButton>
            <Typography sx={footerLinkSx}>
              <Link to="/login" style={linkStyle}>
                Back to Sign In
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
