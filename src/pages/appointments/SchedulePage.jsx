import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarTodayIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentService } from '../../services/appointment.service';
import { providerService } from '../../services/provider.service';

const SchedulePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(7, 'day'));

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const result = await providerService.getAllProviders(1, 100, '', true);
        setProviders(result.providers || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    // Only fetch if dates are valid
    if (
      startDate &&
      endDate &&
      dayjs(startDate).isValid() &&
      dayjs(endDate).isValid()
    ) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, startDate, endDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // Ensure dates are valid
      const start =
        startDate && dayjs(startDate).isValid()
          ? dayjs(startDate).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD');
      const end =
        endDate && dayjs(endDate).isValid()
          ? dayjs(endDate).format('YYYY-MM-DD')
          : dayjs().add(7, 'day').format('YYYY-MM-DD');

      const result = await appointmentService.getAllAppointments(
        1,
        100,
        selectedProvider || '',
        '',
        '',
        start,
        end,
        ''
      );
      setAppointments(result.appointments || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to load schedule. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return dayjs(dateString).format('MMM DD, YYYY');
    } catch {
      return '-';
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: 'default',
      confirmed: 'info',
      checked_in: 'warning',
      completed: 'success',
      cancelled: 'error',
      no_show: 'error',
    };
    return statusColors[status] || 'default';
  };

  // Group appointments by date and sort by time
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!appointment || !appointment.appointmentDate) return acc;
    try {
      const date = dayjs(appointment.appointmentDate).format('YYYY-MM-DD');
      if (date && date !== 'Invalid Date') {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
      }
    } catch (err) {
      console.error('Error processing appointment date:', err);
    }
    return acc;
  }, {});

  // Sort dates and appointments within each date by time
  const sortedDates = Object.keys(appointmentsByDate).sort();
  sortedDates.forEach((date) => {
    appointmentsByDate[date].sort((a, b) => {
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ minWidth: 'auto' }}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Appointment Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage appointments in a schedule view.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAppointments}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/appointments/new')}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={selectedProvider}
                label="Provider"
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <MenuItem value="">All Providers</MenuItem>
                {providers.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.firstName} {provider.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  if (newValue && dayjs(newValue).isValid()) {
                    setStartDate(newValue);
                    // Ensure end date is after start date
                    if (endDate && dayjs(newValue).isAfter(endDate)) {
                      setEndDate(dayjs(newValue).add(7, 'day'));
                    }
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
                maxDate={endDate}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  if (newValue && dayjs(newValue).isValid()) {
                    setEndDate(newValue);
                    // Ensure start date is before end date
                    if (startDate && dayjs(newValue).isBefore(startDate)) {
                      setStartDate(dayjs(newValue).subtract(7, 'day'));
                    }
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={startDate}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      ) : sortedDates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CalendarTodayIcon
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No appointments scheduled for the selected date range.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {sortedDates.map((date) => (
            <Paper key={date} sx={{ p: 3, mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 2 }}
              >
                {dayjs(date).format('dddd, MMMM DD, YYYY')}
              </Typography>
              <Grid container spacing={2}>
                {appointmentsByDate[date].map((appointment) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={appointment._id || appointment.id}
                  >
                    <Card
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 4,
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/appointments/${appointment._id || appointment.id}`
                        )
                      }
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {formatTime(appointment.startTime)} -{' '}
                            {formatTime(appointment.endTime)}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {appointment.providerId?.userId?.firstName ||
                            appointment.providerId?.providerCode ||
                            'N/A'}{' '}
                          {appointment.providerId?.userId?.lastName || ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.patientId?.firstName || 'N/A'}{' '}
                          {appointment.patientId?.lastName || ''}
                        </Typography>
                        {appointment.appointmentTypeId?.name && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {appointment.appointmentTypeId.name}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SchedulePage;
