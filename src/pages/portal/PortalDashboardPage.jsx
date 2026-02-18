import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Welcome back</Typography>
        <Typography color="text.secondary">
          {data.profile?.patient?.firstName || data.profile?.user?.firstName || 'Patient'}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Upcoming Appointments
            </Typography>
            <Typography variant="h4">{data.appointments.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Unread Notifications
            </Typography>
            <Typography variant="h4">
              {data.notifications.filter((item) => !item.isRead).length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pending Forms
            </Typography>
            <Typography variant="h4">{data.pendingForms.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Next Appointments
        </Typography>
        {data.appointments.length === 0 ? (
          <Typography color="text.secondary">No appointments found.</Typography>
        ) : (
          <Stack spacing={1}>
            {data.appointments.map((appointment) => (
              <Box
                key={appointment._id}
                sx={{ border: '1px solid #eceff3', borderRadius: 1, p: 1.5 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {dayjs(appointment.appointmentDate).format('MMM D, YYYY')} •{' '}
                  {appointment.startTime}-{appointment.endTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {appointment.status}
                </Typography>
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/portal/appointments/${appointment._id}`}
                  sx={{ mt: 0.5 }}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default PortalDashboardPage;
