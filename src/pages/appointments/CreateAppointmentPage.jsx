import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentService } from '../../services/appointment.service';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialData = useMemo(() => {
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const providerId = searchParams.get('providerId');

    if (!date && !startTime && !endTime && !providerId) {
      return null;
    }

    const parseTime = (timeString) => {
      if (!timeString) return null;
      const [hours, minutes] = timeString.split(':');
      return dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
    };

    return {
      appointmentDate: date ? dayjs(date) : null,
      startTime: startTime ? parseTime(startTime) : null,
      endTime: endTime ? parseTime(endTime) : null,
      providerId: providerId || '',
      patientId: '',
      appointmentTypeId: '',
      durationMinutes: startTime && endTime ? 
        (parseTime(endTime)?.diff(parseTime(startTime), 'minute') || 30) : 30,
      chiefComplaint: '',
      notes: '',
      roomId: '',
      requiresInterpreter: false,
      interpreterLanguage: '',
      insuranceVerified: false,
      copayCollected: '',
      reminderSent: false,
      customFields: {},
      status: 'scheduled',
    };
  }, [searchParams]);

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await appointmentService.createAppointment(data);

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
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter appointment details to schedule a new appointment.
          </Typography>
        </Box>
      </Box>

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

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <AppointmentForm
          onSubmit={handleSubmit}
          initialData={initialData}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-appointment-form"
        />

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}
        >
          <Button variant="outlined" onClick={handleBack} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-appointment-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? 'Creating...' : 'Create Appointment'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAppointmentPage;
