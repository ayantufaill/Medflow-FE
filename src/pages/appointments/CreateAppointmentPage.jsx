import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentService } from '../../services/appointment.service';
import { patientService } from '../../services/patient.service';
import { languageService } from '../../services/language.service';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [languages, setLanguages] = useState([]);

  const initialDateTime = useMemo(() => {
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    if (!date && !startTime) return null;
    if (!date) return dayjs().hour(9).minute(5);
    const d = dayjs(date);
    if (startTime) {
      const [h, m] = startTime.split(':').map(Number);
      return d.hour(h).minute(m || 0);
    }
    return d.hour(9).minute(5);
  }, [searchParams]);

  const initialData = useMemo(() => {
    if (!initialDateTime) return null;
    return {
      appointmentDate: initialDateTime,
      startTime: initialDateTime,
      endTime: initialDateTime.add(30, 'minute'),
      durationMinutes: 30,
    };
  }, [initialDateTime]);

  const searchPatients = useCallback(async (search = '') => {
    try {
      setLoadingPatients(true);
      const result = await patientService.getAllPatients(1, 20, search, 'active');
      setPatients(result.patients || []);
    } catch (err) {
      console.error('Error searching patients:', err);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    searchPatients('');
    languageService.getAllLanguages(true).then((result) => setLanguages(result || [])).catch(() => {});
  }, [searchPatients]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      await appointmentService.createAppointment(formData);
      showSnackbar('Appointment created successfully', 'success');
      navigate('/appointments');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create appointment. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            New Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below to schedule a new patient appointment.
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
          initialData={initialData}
          loading={saving}
          isEditMode={false}
          patients={patients}
          loadingPatients={loadingPatients}
          languages={languages}
          onPatientSearch={searchPatients}
        />
      </Paper>
    </Box>
  );
};

export default CreateAppointmentPage;