import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

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
    <Stack spacing={2}>
      <Typography variant="h4">Notifications</Typography>
      {status.error && <Alert severity="error">{status.error}</Alert>}
      {status.success && <Alert severity="success">{status.success}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Preferences
        </Typography>
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
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recent Notifications
        </Typography>
        <Stack spacing={1}>
          {notifications.length === 0 && (
            <Typography color="text.secondary">No notifications found.</Typography>
          )}
          {notifications.map((notification) => (
            <Box key={notification._id} sx={{ border: '1px solid #e8edf3', borderRadius: 1, p: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
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
      </Paper>
    </Stack>
  );
};

export default PortalNotificationsPage;
