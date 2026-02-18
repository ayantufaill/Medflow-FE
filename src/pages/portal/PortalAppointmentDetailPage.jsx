import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

const getProviderName = (provider) => {
  if (!provider) return '-';
  if (typeof provider === 'string') return provider;
  const user = provider.userId;
  const userName =
    (user && `${user.firstName || ''} ${user.lastName || ''}`.trim()) || '';
  return userName || provider.providerCode || provider._id || '-';
};

const getAppointmentTypeName = (appointmentType) => {
  if (!appointmentType) return '-';
  if (typeof appointmentType === 'string') return appointmentType;
  return appointmentType.name || appointmentType._id || '-';
};

const PortalAppointmentDetailPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      if (!appointmentId) return;
      try {
        const row = await portalService.getMyAppointmentById(appointmentId);
        setAppointment(row);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load appointment'
        );
      }
    })();
  }, [appointmentId]);

  if (error) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>
        <Button component={RouterLink} to="/portal/appointments" variant="outlined">
          Back to Appointments
        </Button>
      </Stack>
    );
  }

  if (!appointment) {
    return <Typography>Loading appointment...</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Appointment Details</Typography>
        <Button component={RouterLink} to="/portal/appointments" variant="outlined">
          Back
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Appointment ID
            </Typography>
            <Typography>{appointment._id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography>{appointment.status || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Date
            </Typography>
            <Typography>
              {appointment.appointmentDate
                ? dayjs(appointment.appointmentDate).format('MMM D, YYYY')
                : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Time
            </Typography>
            <Typography>
              {appointment.startTime || '-'} - {appointment.endTime || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Provider
            </Typography>
            <Typography>{getProviderName(appointment.providerId)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
              Appointment Type
            </Typography>
            <Typography>{getAppointmentTypeName(appointment.appointmentTypeId)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Chief Complaint
            </Typography>
            <Typography>{appointment.chiefComplaint || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Notes
            </Typography>
            <Typography>{appointment.notes || '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default PortalAppointmentDetailPage;
