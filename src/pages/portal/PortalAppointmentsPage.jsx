import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  PortalEmptyState,
  PortalPageHeader,
  PortalSectionTitle,
  PortalStatusChip,
  portalSurfaceSx,
} from './PortalUi';

const DEFAULT_DURATION = 30;

const addMinutes = (time, minutesToAdd) => {
  const [hours, minutes] = String(time || '00:00')
    .split(':')
    .map((part) => Number(part || 0));
  const total = hours * 60 + minutes + minutesToAdd;
  const normalized = Math.max(0, total);
  const nextHours = Math.floor(normalized / 60) % 24;
  const nextMinutes = normalized % 60;
  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
};

const defaultBooking = {
  providerId: '',
  appointmentDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  startTime: '',
  chiefComplaint: '',
  notes: '',
};

const getProviderName = (provider) => {
  if (!provider) return 'Provider';
  if (typeof provider === 'string') return provider;
  const linkedUser = provider.userId;
  const fullName = `${linkedUser?.firstName || ''} ${linkedUser?.lastName || ''}`.trim();
  return fullName || provider.providerCode || provider._id || 'Provider';
};

const PortalAppointmentsPage = () => {
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(defaultBooking);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reschedule, setReschedule] = useState({
    newDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    newStartTime: '',
  });
  const [cancelReason, setCancelReason] = useState('');

  const refresh = async () => {
    try {
      const [providersData, appointmentsData] = await Promise.all([
        portalService.getProviders(),
        portalService.getMyAppointments({ page: 1, limit: 20 }),
      ]);
      setProviders(providersData);
      setAppointments(appointmentsData.appointments || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load appointments'
      );
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!booking.providerId || !booking.appointmentDate) {
        setAvailableSlots([]);
        return;
      }
      try {
        setSlotsLoading(true);
        const slots = await portalService.getAvailableSlots(
          booking.providerId,
          booking.appointmentDate,
          DEFAULT_DURATION
        );
        const nextSlots = slots.availableSlots || [];
        setAvailableSlots(nextSlots);
        if (!nextSlots.includes(booking.startTime)) {
          setBooking((prev) => ({ ...prev, startTime: nextSlots[0] || '' }));
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load available slots'
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [booking.providerId, booking.appointmentDate]);

  const providerOptions = useMemo(
    () =>
      providers.map((provider) => ({
        value: provider._id,
        label:
          provider.name ||
          `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
          provider.providerCode ||
          `Provider #${provider._id}`,
      })),
    [providers]
  );

  const handleBook = async (event) => {
    event.preventDefault();
    setBookingLoading(true);
    setError('');
    try {
      await portalService.bookAppointment({
        ...booking,
        endTime: addMinutes(booking.startTime, DEFAULT_DURATION),
        durationMinutes: DEFAULT_DURATION,
      });
      setBooking(defaultBooking);
      setAvailableSlots([]);
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to book appointment'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const openRescheduleDialog = async (appointment) => {
    const providerId =
      typeof appointment.providerId === 'string'
        ? appointment.providerId
        : appointment.providerId?._id;
    const newDate = dayjs(appointment.appointmentDate).format('YYYY-MM-DD');
    setSelectedAppointment(appointment);
    setCancelReason('');
    setReschedule({
      newDate,
      newStartTime: appointment.startTime || '',
    });

    if (!providerId) {
      setRescheduleSlots([]);
      return;
    }

    try {
      const slots = await portalService.getAvailableSlots(providerId, newDate, DEFAULT_DURATION);
      const nextSlots = slots.availableSlots || [];
      setRescheduleSlots(nextSlots);
      if (!nextSlots.includes(appointment.startTime)) {
        setReschedule((prev) => ({ ...prev, newStartTime: nextSlots[0] || '' }));
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load available slots'
      );
    }
  };

  const handleRescheduleDateChange = async (value) => {
    if (!selectedAppointment) return;
    const providerId =
      typeof selectedAppointment.providerId === 'string'
        ? selectedAppointment.providerId
        : selectedAppointment.providerId?._id;
    setReschedule((prev) => ({ ...prev, newDate: value }));
    if (!providerId || !value) {
      setRescheduleSlots([]);
      return;
    }
    try {
      const slots = await portalService.getAvailableSlots(providerId, value, DEFAULT_DURATION);
      const nextSlots = slots.availableSlots || [];
      setRescheduleSlots(nextSlots);
      setReschedule((prev) => ({
        ...prev,
        newDate: value,
        newStartTime: nextSlots.includes(prev.newStartTime) ? prev.newStartTime : nextSlots[0] || '',
      }));
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load available slots'
      );
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment) return;
    try {
      await portalService.rescheduleAppointment(selectedAppointment._id, {
        newDate: reschedule.newDate,
        newStartTime: reschedule.newStartTime,
        newEndTime: addMinutes(reschedule.newStartTime, DEFAULT_DURATION),
      });
      setSelectedAppointment(null);
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to reschedule appointment'
      );
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;
    try {
      await portalService.cancelAppointment(selectedAppointment._id, cancelReason);
      setSelectedAppointment(null);
      setCancelReason('');
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to cancel appointment'
      );
    }
  };

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Appointments"
        subtitle="Book, review, and reschedule your upcoming visits."
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Box sx={portalSurfaceSx}>
            <PortalSectionTitle
              title="Book New Appointment"
              subtitle="Pick provider, date, and an available time slot."
            />
            <Box component="form" onSubmit={handleBook}>
              <Stack spacing={1.5}>
                <TextField
                  select
                  label="Provider"
                  value={booking.providerId}
                  onChange={(event) =>
                    setBooking((prev) => ({ ...prev, providerId: event.target.value }))
                  }
                  required
                >
                  {providerOptions.map((provider) => (
                    <MenuItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Date"
                  type="date"
                  value={booking.appointmentDate}
                  onChange={(event) =>
                    setBooking((prev) => ({ ...prev, appointmentDate: event.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  select
                  label="Available Time Slots"
                  value={booking.startTime}
                  onChange={(event) =>
                    setBooking((prev) => ({ ...prev, startTime: event.target.value }))
                  }
                  required
                  disabled={!booking.providerId || slotsLoading}
                  helperText={slotsLoading ? 'Loading slots...' : '30-minute duration'}
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot} - {addMinutes(slot, DEFAULT_DURATION)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Chief Complaint"
                  value={booking.chiefComplaint}
                  onChange={(event) =>
                    setBooking((prev) => ({ ...prev, chiefComplaint: event.target.value }))
                  }
                />
                <TextField
                  label="Notes"
                  value={booking.notes}
                  onChange={(event) => setBooking((prev) => ({ ...prev, notes: event.target.value }))}
                  multiline
                  minRows={2}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={bookingLoading || !booking.providerId || !booking.startTime}
                >
                  {bookingLoading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Box sx={portalSurfaceSx}>
            <PortalSectionTitle title="Your Appointments" subtitle="Latest scheduled and past visits." />
            <Stack spacing={1.25}>
              {appointments.length === 0 && (
                <PortalEmptyState
                  title="No appointments available"
                  description="Once you book an appointment, it will appear here."
                />
              )}
              {appointments.map((appointment) => (
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
                        {getProviderName(appointment.providerId)}
                      </Typography>
                    </Box>
                    <PortalStatusChip status={appointment.status} />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/portal/appointments/${appointment._id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openRescheduleDialog(appointment)}
                      disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setCancelReason('');
                      }}
                      disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="New Date"
              type="date"
              value={reschedule.newDate}
              onChange={(event) => handleRescheduleDateChange(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Available Time Slots"
              value={reschedule.newStartTime}
              onChange={(event) =>
                setReschedule((prev) => ({ ...prev, newStartTime: event.target.value }))
              }
            >
              {rescheduleSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot} - {addMinutes(slot, DEFAULT_DURATION)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cancellation Reason (optional)"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAppointment(null)}>Close</Button>
          <Button onClick={handleReschedule} variant="contained" disabled={!reschedule.newStartTime}>
            Save Reschedule
          </Button>
          <Button onClick={handleCancel} color="error" variant="outlined">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default PortalAppointmentsPage;

