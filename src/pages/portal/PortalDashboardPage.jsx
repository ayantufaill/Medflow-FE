import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  PortalEmptyState,
  PortalPageHeader,
  PortalSectionTitle,
  PortalStatCard,
  PortalStatusChip,
  portalSurfaceSx,
} from './PortalUi';

const PortalDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    profile: null,
    appointments: [],
    notifications: [],
    pendingForms: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [profile, appointmentsRes, notificationsRes, pendingForms] = await Promise.all([
          portalService.getMyProfile(),
          portalService.getMyAppointments({ page: 1, limit: 5 }),
          portalService.getNotifications({ page: 1, limit: 5 }),
          portalService.getPendingForms(),
        ]);
        setData({
          profile,
          appointments: appointmentsRes.appointments || [],
          notifications: notificationsRes.notifications || [],
          pendingForms: pendingForms || [],
        });
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load portal dashboard'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const patientName = useMemo(
    () =>
      data.profile?.patient?.firstName ||
      data.profile?.user?.firstName ||
      'Patient',
    [data.profile]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title={`Welcome, ${patientName}`}
        subtitle="Track appointments, complete forms, and stay connected with your care team."
        action={
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/portal/appointments" variant="contained">
              Book Appointment
            </Button>
            <Button component={RouterLink} to="/portal/messages" variant="outlined">
              Open Messages
            </Button>
          </Stack>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <PortalStatCard
            label="Upcoming Appointments"
            value={data.appointments.length}
            accent="#1566b0"
            helper="Next 5 records"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortalStatCard
            label="Unread Notifications"
            value={data.notifications.filter((item) => !item.isRead).length}
            accent="#0d8a72"
            helper="Recent updates"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortalStatCard
            label="Pending Forms"
            value={data.pendingForms.length}
            accent="#d97706"
            helper="Action required"
          />
        </Grid>
      </Grid>

      <Box sx={portalSurfaceSx}>
        <PortalSectionTitle
          title="Next Appointments"
          subtitle="Your upcoming visits and their status."
          action={
            <Button component={RouterLink} to="/portal/appointments" size="small">
              View all
            </Button>
          }
        />
        {data.appointments.length === 0 ? (
          <Stack spacing={1.2}>
            <PortalEmptyState
              title="No appointments scheduled"
              description="Book your next visit to see it here."
            />
            <Box>
              <Button component={RouterLink} to="/portal/appointments" variant="outlined" size="small">
                Book now
              </Button>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={1}>
            {data.appointments.map((appointment) => (
              <Box
                key={appointment._id}
                sx={{
                  border: '1px solid #e1eaf8',
                  borderRadius: 2,
                  p: 1.5,
                  backgroundColor: '#fff',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={1}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {dayjs(appointment.appointmentDate).format('ddd, MMM D, YYYY')} •{' '}
                      {appointment.startTime}-{appointment.endTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Appointment #{appointment._id}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PortalStatusChip status={appointment.status} />
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/portal/appointments/${appointment._id}`}
                    >
                      View
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default PortalDashboardPage;
