import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  PortalPageHeader,
  PortalSectionTitle,
  PortalStatusChip,
  portalSurfaceSx,
} from './PortalUi';

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

const DetailItem = ({ label, value }) => (
  <Stack spacing={0.4}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography>{value || '-'}</Typography>
  </Stack>
);

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
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Appointment Details"
        subtitle={`Appointment #${appointment._id}`}
        action={
          <Button component={RouterLink} to="/portal/appointments" variant="outlined">
            Back
          </Button>
        }
      />

      <Stack sx={portalSurfaceSx} spacing={1.5}>
        <PortalSectionTitle
          title="Visit Information"
          action={<PortalStatusChip status={appointment.status} />}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Date"
              value={
                appointment.appointmentDate
                  ? dayjs(appointment.appointmentDate).format('ddd, MMM D, YYYY')
                  : '-'
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Time"
              value={`${appointment.startTime || '-'} - ${appointment.endTime || '-'}`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem label="Provider" value={getProviderName(appointment.providerId)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Appointment Type"
              value={getAppointmentTypeName(appointment.appointmentTypeId)}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailItem label="Chief Complaint" value={appointment.chiefComplaint || '-'} />
          </Grid>
          <Grid item xs={12}>
            <DetailItem label="Notes" value={appointment.notes || '-'} />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default PortalAppointmentDetailPage;

