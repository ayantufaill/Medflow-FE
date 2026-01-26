import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentTypeService } from '../../services/appointment-type.service';
import AppointmentTypeForm from '../../components/appointment-types/AppointmentTypeForm';

const CreateAppointmentTypePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await appointmentTypeService.createAppointmentType(data);

      showSnackbar('Appointment type created successfully', 'success');
      navigate('/appointment-types');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create appointment type. Please try again.';
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
            Create Appointment Type
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter appointment type details to create a new appointment type.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <AppointmentTypeForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-appointment-type-form"
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
            form="create-appointment-type-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? 'Creating...' : 'Create Appointment Type'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAppointmentTypePage;
