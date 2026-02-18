import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

const PortalRegisterPage = () => {
  const { initiateRegistration, resendVerificationCode } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [emailSentTo, setEmailSentTo] = useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    const result = await initiateRegistration(values);
    if (result.success) {
      setEmailSentTo(result.email);
      reset();
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!emailSentTo) return;
    setResending(true);
    setError('');
    const result = await resendVerificationCode(emailSentTo);
    if (!result.success) {
      setError(result.error || 'Failed to resend verification link');
    }
    setResending(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Portal Registration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We’ll email you a link to set your password and activate your portal account.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {emailSentTo && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Verification link sent to <strong>{emailSentTo}</strong>.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            {...register('firstName', { required: 'First name is required' })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            {...register('lastName', { required: 'Last name is required' })}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            {...register('phone')}
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Submitting...' : 'Create Account'}
          </Button>
        </Box>

        {emailSentTo && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleResend}
            sx={{ mt: 2 }}
            disabled={resending}
          >
            {resending ? 'Resending...' : 'Resend Verification Link'}
          </Button>
        )}

        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/portal/login" underline="hover">
            Back to portal login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortalRegisterPage;
