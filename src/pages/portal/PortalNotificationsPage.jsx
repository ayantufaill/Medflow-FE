import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  PortalEmptyState,
  PortalPageHeader,
  PortalSectionTitle,
  PortalStatCard,
  portalSurfaceSx,
} from './PortalUi';

const PortalNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    smsEnabled: true,
    inAppEnabled: true,
    appointmentReminderHours: 24,
  });
  const [status, setStatus] = useState({ error: '', success: '' });

  const refresh = async () => {
    try {
      const [notificationsRes, preferencesRes] = await Promise.all([
        portalService.getNotifications({ page: 1, limit: 20 }),
        portalService.getNotificationPreferences(),
      ]);
      setNotifications(notificationsRes.notifications || []);
      setPreferences(
        preferencesRes || {
          emailEnabled: true,
          smsEnabled: true,
          inAppEnabled: true,
          appointmentReminderHours: 24,
        }
      );
    } catch (err) {
      setStatus({
        error:
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load notifications',
        success: '',
      });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const handleMarkRead = async (notificationId) => {
    try {
      await portalService.markNotificationRead(notificationId);
      await refresh();
    } catch (err) {
      setStatus({
        error:
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to mark notification as read',
        success: '',
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((item) => !item.isRead);
      await Promise.all(unread.map((item) => portalService.markNotificationRead(item._id)));
      await refresh();
    } catch (err) {
      setStatus({
        error:
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to mark all notifications as read',
        success: '',
      });
    }
  };

  const handleSavePreferences = async () => {
    try {
      setStatus({ error: '', success: '' });
      await portalService.updateNotificationPreferences({
        ...preferences,
        appointmentReminderHours: Number(preferences.appointmentReminderHours || 24),
      });
      setStatus({ error: '', success: 'Notification preferences updated' });
    } catch (err) {
      setStatus({
        error:
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to update preferences',
        success: '',
      });
    }
  };

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Notifications"
        subtitle="Control reminders and stay updated on messages, forms, and appointments."
      />
      {status.error && <Alert severity="error">{status.error}</Alert>}
      {status.success && <Alert severity="success">{status.success}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <PortalStatCard label="Total Notifications" value={notifications.length} accent="#145a98" />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortalStatCard label="Unread" value={unreadCount} accent="#d97706" />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortalStatCard label="Reminder Window (Hours)" value={preferences.appointmentReminderHours || 24} accent="#0d8a72" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box sx={{ ...portalSurfaceSx, height: '100%' }}>
            <PortalSectionTitle title="Preferences" subtitle="Choose how you receive updates." />
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailEnabled}
                    onChange={(event) =>
                      setPreferences((prev) => ({ ...prev, emailEnabled: event.target.checked }))
                    }
                  />
                }
                label="Email notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.smsEnabled}
                    onChange={(event) =>
                      setPreferences((prev) => ({ ...prev, smsEnabled: event.target.checked }))
                    }
                  />
                }
                label="SMS notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.inAppEnabled}
                    onChange={(event) =>
                      setPreferences((prev) => ({ ...prev, inAppEnabled: event.target.checked }))
                    }
                  />
                }
                label="In-app notifications"
              />
              <TextField
                label="Appointment Reminder Hours"
                type="number"
                value={preferences.appointmentReminderHours}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, appointmentReminderHours: event.target.value }))
                }
                inputProps={{ min: 1, max: 168 }}
              />
              <Button variant="contained" onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box sx={{ ...portalSurfaceSx, height: '100%' }}>
            <PortalSectionTitle
              title="Recent Notifications"
              subtitle="Newest notifications first."
              action={
                <Button size="small" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                  Mark all read
                </Button>
              }
            />
            <Stack spacing={1}>
              {notifications.length === 0 && (
                <PortalEmptyState
                  title="No notifications found"
                  description="New updates will appear here."
                />
              )}
              {notifications.map((notification) => (
                <Box key={notification._id} sx={{ border: '1px solid #e8edf3', borderRadius: 2, p: 1.5 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.createdAt
                      ? dayjs(notification.createdAt).format('MMM D, YYYY h:mm A')
                      : '-'}
                  </Typography>
                  {!notification.isRead && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => handleMarkRead(notification._id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PortalNotificationsPage;

