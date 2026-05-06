import { useState, useEffect, useCallback } from 'react';
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
import { patientService } from '../../services/patient.service';
import RecurringAppointmentForm from '../../components/recurring-appointments/RecurringAppointmentForm';

const EditRecurringAppointmentPage = () => {
  const navigate = useNavigate();
  const { recurringAppointmentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recurringAppointment, setRecurringAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const searchPatients = useCallback(async (search = '') => {
    try {
      setLoadingPatients(true);
      const result = await patientService.getAllPatients(1, 20, search, 'active');
      setPatients(result.patients || []);
    } catch {
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    if (recurringAppointmentId) {
      recurringAppointmentService
        .getRecurringAppointmentById(recurringAppointmentId)
        .then((data) => setRecurringAppointment(data))
        .catch((err) =>
          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              'Failed to load recurring appointment data. Please try again.'
          )
        )
        .finally(() => setLoading(false));
    }
    searchPatients('');
  }, [recurringAppointmentId, searchPatients]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await recurringAppointmentService.updateRecurringAppointment(recurringAppointmentId, data);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !recurringAppointment) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!recurringAppointment) {
    return <Alert severity="error">Recurring appointment not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
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
          patients={patients}
          loadingPatients={loadingPatients}
          onPatientSearch={searchPatients}
        />
      </Paper>
    </Box>
  );
};

export default EditRecurringAppointmentPage;
