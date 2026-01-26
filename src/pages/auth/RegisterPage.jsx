import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link as MuiLink,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useAuth } from "../../contexts/AuthContext";
import { roleService } from "../../services/role.service";
import {
  registerValidations,
  getConfirmPasswordValidation,
} from "../../validations/auth.validations";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    initiateRegistration,
    resendVerificationCode,
  } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  // Check for error from URL params (from email link redirect)
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const errorParam = params.get('error');
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        // Clean URL
        window.history.replaceState({}, document.title, '/register');
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await roleService.getAllRoles();
        const activeRoles = rolesData.filter((role) => role.isActive !== false);
        setRoles(activeRoles);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await initiateRegistration(data);
      if (result.success) {
        setVerificationEmail(result.email);
        setVerificationStep(true);
        // Clear the form
        reset();
      } else {
        setError(
          result.error || 'Failed to send verification link. Please try again.'
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setError('');
    setResending(true);

    try {
      const result = await resendVerificationCode(verificationEmail);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(
          result.error ||
            'Failed to resend verification link. Please try again.'
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleBackToForm = () => {
    setVerificationStep(false);
    setError('');
    setSuccess(false);
  };

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
            boxShadow: { xs: 'none', sm: 3 },
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign up to get started with MedFlow
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && !verificationStep && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}

          {success && verificationStep && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Verification link resent to your email!
            </Alert>
          )}

          {!verificationStep ? (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} sx={{ flex: '1 1 auto' }}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...register('firstName', registerValidations.firstName)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ flex: '1 1 auto' }}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...register('lastName', registerValidations.lastName)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ flex: '1 1 auto', width: '100%' }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email', registerValidations.email)}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ flex: '1 1 auto', width: '30%' }}
                >
                  <FormControl fullWidth required error={!!errors.roleId}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Controller
                      name="roleId"
                      control={control}
                      rules={registerValidations.roleId}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="role-select-label"
                          id="roleId"
                          label="Role"
                          disabled={rolesLoading}
                          value={field.value || ''}
                        >
                          <MenuItem value="">
                            <em>--None--</em>
                          </MenuItem>
                          {roles.map((role) => (
                            <MenuItem
                              key={role._id || role.id}
                              value={role._id || role.id}
                            >
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.roleId && (
                      <FormHelperText>{errors.roleId.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ flex: '1 1 auto' }}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={registerValidations.phone}
                    render={({ field }) => (
                      <Box>
                        <Box
                          sx={{
                            width: '100%',
                            '& .react-tel-input': {
                              width: '100% !important',
                            },
                            '& .form-control': {
                              width: '100% !important',
                            },
                          }}
                        >
                          <PhoneInput
                            {...field}
                            country={'us'}
                            enableSearch={true}
                            disableSearchIcon={false}
                            searchPlaceholder="Search country"
                            onChange={(value, country, e, formattedValue) => {
                              field.onChange(value);
                            }}
                            value={field.value || ''}
                          />
                        </Box>
                        {errors.phone && (
                          <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                            {errors.phone.message}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ flex: '1 1 auto', width: '100%' }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Note:</strong> You will receive an email with a link to set your password and activate your account.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || success}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              {/* <Box sx={{ textAlign: "center", mt: 2 }}>
              Already have an account?&nbsp;
              <MuiLink component={Link} to="/login" variant="body2">
                Sign In
              </MuiLink>
            </Box> */}
            </Box>
          ) : (
            <Box sx={{ mt: 1, width: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Check Your Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We've sent a verification link to{' '}
                  <strong>{verificationEmail}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Please check your email and click the link to complete your registration.
                  <br />
                  <strong>This is a link to click, NOT a verification code.</strong>
                </Typography>
                <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>What to do:</strong>
                    <br />
                    1. Check your email inbox (and spam folder if needed)
                    <br />
                    2. Click the "Set Up Your Password" button in the email
                    <br />
                    3. Your account will be activated automatically
                    <br />
                    4. You can then login with your email and password
                  </Typography>
                </Alert>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleResendLink}
                disabled={resending}
                sx={{ mb: 2 }}
                startIcon={
                  resending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {resending ? 'Resending...' : 'Resend Verification Link'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={handleBackToForm}
                disabled={resending}
              >
                Back to Registration Form
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
