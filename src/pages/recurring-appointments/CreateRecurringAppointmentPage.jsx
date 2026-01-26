import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { recurringAppointmentService } from '../../services/recurring-appointment.service';
import RecurringAppointmentForm from '../../components/recurring-appointments/RecurringAppointmentForm';

const CreateRecurringAppointmentPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data, useResolution = false) => {
    try {
      setSaving(true);
      setError('');

      let result;
      if (useResolution && data.appointmentOverrides) {
        result = await recurringAppointmentService.createRecurringAppointmentWithResolution(data);
      } else {
        result = await recurringAppointmentService.createRecurringAppointment(data);
      }
      
      // Check if appointments were generated
      const appointmentsCreated = result?.appointmentsCreated || result?.generatedInfo?.appointmentsCreated || 0;
      const skippedCount = result?.skippedCount || result?.generatedInfo?.skippedCount || 0;
      
      let message = 'Recurring appointment created successfully';
      if (appointmentsCreated > 0) {
        message += `. ${appointmentsCreated} appointment(s) generated and added to calendar`;
        if (skippedCount > 0) {
          message += `, ${skippedCount} skipped`;
        }
      } else if (data.totalAppointments || data.endDate) {
        message += '. No appointments were generated (may need manual generation)';
      }

      showSnackbar(message, appointmentsCreated > 0 ? 'success' : 'warning');
      navigate('/recurring-appointments');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create recurring appointment. Please try again.';
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
            Create Recurring Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up a recurring appointment series for a patient.
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
          <MuiButton onClick={() => setError('')} variant="contained" color="error">
            Close
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <RecurringAppointmentForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-recurring-appointment-form"
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
            form="create-recurring-appointment-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? 'Creating...' : 'Create Recurring Appointment'}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Tip: Use the "Preview" button in the form to see proposed dates and check for conflicts before creating.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateRecurringAppointmentPage;
