import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { recurringAppointmentService } from '../../services/recurring-appointment.service';
import RecurringAppointmentForm from '../../components/recurring-appointments/RecurringAppointmentForm';

const EditRecurringAppointmentPage = () => {
  const navigate = useNavigate();
  const { recurringAppointmentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recurringAppointment, setRecurringAppointment] = useState(null);

  const fetchRecurringAppointment = async () => {
    try {
      setLoading(true);
      setError('');
      const appointmentData =
        await recurringAppointmentService.getRecurringAppointmentById(
          recurringAppointmentId
        );
      setRecurringAppointment(appointmentData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load recurring appointment data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recurringAppointmentId) {
      fetchRecurringAppointment();
    }
  }, [recurringAppointmentId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await recurringAppointmentService.updateRecurringAppointment(
        recurringAppointmentId,
        data
      );

      showSnackbar('Recurring appointment updated successfully', 'success');
      navigate('/recurring-appointments');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update recurring appointment. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !recurringAppointment) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!recurringAppointment) {
    return (
      <Box>
        <Alert severity="error">Recurring appointment not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Recurring Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit recurring appointment details to update the series.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <RecurringAppointmentForm
          onSubmit={onSubmit}
          initialData={recurringAppointment}
          loading={saving}
          isEditMode={true}
        />
      </Paper>
    </Box>
  );
};

export default EditRecurringAppointmentPage;
