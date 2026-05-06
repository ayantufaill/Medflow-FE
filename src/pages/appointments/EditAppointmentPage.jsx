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
import { appointmentService } from '../../services/appointment.service';
import { patientService } from '../../services/patient.service';
import { languageService } from '../../services/language.service';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const EditAppointmentPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [languages, setLanguages] = useState([]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError('');
      const appointmentData = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(appointmentData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load appointment data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    searchPatients('');
    languageService.getAllLanguages(true).then((result) => setLanguages(result || [])).catch(() => {});
  }, [searchPatients]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await appointmentService.updateAppointment(appointmentId, data);
      showSnackbar('Appointment updated successfully', 'success');
      navigate('/appointments');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update appointment. Please try again.';
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

  if (error && !appointment) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box>
        <Alert severity="error">Appointment not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit appointment details to update the appointment record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <AppointmentForm
          onSubmit={onSubmit}
          initialData={appointment}
          loading={saving}
          isEditMode={true}
          patients={patients}
          loadingPatients={loadingPatients}
          languages={languages}
          onPatientSearch={searchPatients}
        />
      </Paper>
    </Box>
  );
};

export default EditAppointmentPage;
