import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentService } from '../../services/appointment.service';
import { patientService } from '../../services/patient.service';
import { useDropdownData } from '../../hooks/redux/useDropdownData';
import AddNewPatientAppointmentForm from '../../components/appointments/AddNewPatientAppointmentForm';

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const { providers } = useDropdownData({ providers: true });

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
  }, [searchPatients]);

  const handleSubmit = async (formData) => {
    const patientId = formData.patientId;
    if (!patientId) {
      showSnackbar('Please select a patient.', 'warning');
      return;
    }
    const start = formData.appointmentDate && formData.startTime
      ? dayjs(`${formData.appointmentDate}T${formData.startTime}`)
      : dayjs();
    const duration = formData.durationMinutes || 30;
    const end = start.add(duration, 'minute');
    const provider = providers?.find(
      (p) =>
        (p.firstName &&
          p.lastName &&
          `${p.firstName} ${p.lastName}` === formData.providerId) ||
        p._id === formData.providerId,
    );
    const effectiveProvider = provider || (providers && providers[0]);
    const payload = {
      patientId,
      providerId: effectiveProvider?._id,
      appointmentDate: start.format('YYYY-MM-DD'),
      startTime: start.format('HH:mm'),
      endTime: end.format('HH:mm'),
      durationMinutes: duration,
      chiefComplaint: '',
      notes: formData.notes || '',
      roomId: undefined,
      requiresInterpreter: false,
      interpreterLanguage: '',
      insuranceVerified: false,
      copayCollected: 0,
      reminderSent: false,
      customFields: {},
      status: formData.status || 'scheduled',
    };
    try {
      setSaving(true);
      setError('');
      await appointmentService.createAppointment(payload);
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
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Dialog open={!!error} onClose={() => setError('')} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="error">
              Error
            </Typography>
            <IconButton size="small" onClick={() => setError('')}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError('')} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AddNewPatientAppointmentForm
        patients={patients}
        loadingPatients={loadingPatients}
        onPatientSearch={searchPatients}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/appointments')}
        loading={saving}
        initialDateTime={initialDateTime || dayjs().hour(9).minute(5)}
      />
    </Box>
  );
};

export default CreateAppointmentPage;