import { useState } from 'react';
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
import { appointmentTypeService } from '../../services/appointment-type.service';
import { useAppointmentType } from '../../hooks/queries/useAppointmentTypes';
import AppointmentTypeForm from '../../components/appointment-types/AppointmentTypeForm';

const EditAppointmentTypePage = () => {
  const navigate = useNavigate();
  const { appointmentTypeId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: appointmentType, isLoading, isError } = useAppointmentType(appointmentTypeId);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await appointmentTypeService.updateAppointmentType(appointmentTypeId, data);
      showSnackbar('Appointment type updated successfully', 'success');
      navigate('/appointment-types');
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update appointment type. Please try again.';
      setError(message);
      showSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !appointmentType) {
    return <Alert severity="error">Appointment type not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Appointment Type
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit appointment type details to update the appointment type record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <AppointmentTypeForm
          onSubmit={handleSubmit}
          initialData={appointmentType}
          loading={saving}
          isEditMode={true}
        />
      </Paper>
    </Box>
  );
};

export default EditAppointmentTypePage;
