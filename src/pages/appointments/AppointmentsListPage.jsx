import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  FilterAltOff as FilterAltOffIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/appointment.service';
import { providerService } from '../../services/provider.service';
import { patientService } from '../../services/patient.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const AppointmentsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    appointmentId: null,
  });
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    appointmentId: null,
    appointmentCode: '',
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointmentId: null,
    appointmentCode: '',
  });
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [checkInDialog, setCheckInDialog] = useState({
    open: false,
    appointment: null,
    copayAmount: 0,
  });
  const [checkInLoading, setCheckInLoading] = useState(false);
  const previousSearchRef = useRef('');
  const searchDebounceTimerRef = useRef(null);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter || startDate || endDate;
  const roleNames = (user?.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);
  const canManageAppointments = roleNames.some((role) => ['Admin', 'Receptionist'].includes(role));


  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await appointmentService.getAllAppointments(
        page + 1,
        rowsPerPage,
        '',
        '',
        statusFilter || '',
        startDate ? dayjs(startDate).format('YYYY-MM-DDTHH:mm') : '',
        endDate ? dayjs(endDate).format('YYYY-MM-DDTHH:mm') : '',
        '',
        search || ''
      );
      setAppointments(result.appointments || []);
      setTotalAppointments(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch appointments. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, startDate, endDate, search]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, appointmentId) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      appointmentId,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      appointmentId: null,
    });
  };

  const handleViewDetails = (appointmentId) => {
    handleActionMenuClose();
    navigate(`/appointments/${appointmentId}`);
  };

  const handleEdit = (appointmentId) => {
    handleActionMenuClose();
    navigate(`/appointments/${appointmentId}/edit`);
  };

  const handleCancelClick = (appointmentId) => {
    handleActionMenuClose();
    const appointment = appointments.find(
      (apt) => (apt._id || apt.id) === appointmentId
    );

    if (!appointment) return;

    if (appointment.status === 'cancelled') {
      showSnackbar('Appointment is already cancelled', 'warning');
      return;
    }

    if (appointment.status === 'completed') {
      showSnackbar('Cannot cancel a completed appointment', 'error');
      return;
    }

    setCancelDialog({
      open: true,
      appointmentId,
      appointmentCode: appointment.appointmentCode || 'this appointment',
    });
    setCancelReason('');
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelLoading(true);
      await appointmentService.cancelAppointment(
        cancelDialog.appointmentId,
        cancelReason || undefined
      );
      showSnackbar('Appointment cancelled successfully', 'success');
      setCancelDialog({ open: false, appointmentId: null, appointmentCode: '' });
      setCancelReason('');
      fetchAppointments();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to cancel appointment',
        'error'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialog({ open: false, appointmentId: null, appointmentCode: '' });
    setCancelReason('');
  };

  const handleReschedule = (appointmentId) => {
    handleActionMenuClose();
    navigate(`/appointments/${appointmentId}/edit`, {
      state: { reschedule: true },
    });
  };

  const canCancel = (appointment) => {
    return (
      appointment &&
      appointment.status !== 'cancelled' &&
      appointment.status !== 'completed'
    );
  };

  const canReschedule = (appointment) => {
    return (
      appointment &&
      appointment.status !== 'cancelled' &&
      appointment.status !== 'completed'
    );
  };

  const canCheckIn = (appointment) => {
    return (
      appointment &&
      (appointment.status === 'scheduled' || appointment.status === 'confirmed')
    );
  };

  const handleCheckIn = async (appointmentId) => {
    handleActionMenuClose();
    const appointment = appointments.find(
      (apt) => (apt._id || apt.id) === appointmentId
    );

    if (!appointment) return;

    // Get expected copay from patient's primary insurance
    const expectedCopay =
      appointment.patientId?.primaryInsurance?.copayAmount ||
      appointment.patientId?.insurances?.find((ins) => ins.isActive && ins.insuranceType === 'primary')
        ?.copayAmount ||
      0;

    setCheckInDialog({
      open: true,
      appointment: appointment,
      copayAmount: expectedCopay,
    });
  };

  const handleCheckInConfirm = async () => {
    if (!checkInDialog.appointment) return;

    try {
      setCheckInLoading(true);
      const appointmentId = checkInDialog.appointment._id || checkInDialog.appointment.id;

      // First check-in the appointment
      await appointmentService.checkInAppointment(appointmentId);

      // Then update with copay if amount > 0
      if (checkInDialog.copayAmount > 0) {
        await appointmentService.updateAppointment(appointmentId, {
          copayCollected: checkInDialog.copayAmount,
        });
      }

      showSnackbar('Patient checked in successfully', 'success');
      setCheckInDialog({ open: false, appointment: null, copayAmount: 0 });
      fetchAppointments();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to check in patient',
        'error'
      );
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleDeleteClick = (appointmentId) => {
    handleActionMenuClose();
    const appointment = appointments.find(
      (apt) => (apt._id || apt.id) === appointmentId
    );

    if (!appointment) return;

    setDeleteDialog({
      open: true,
      appointmentId,
      appointmentCode: appointment.appointmentCode || 'this appointment',
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await appointmentService.deleteAppointment(deleteDialog.appointmentId);
      showSnackbar('Appointment deleted successfully', 'success');
      setDeleteDialog({ open: false, appointmentId: null, appointmentCode: '' });
      fetchAppointments();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete appointment',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, appointmentId: null, appointmentCode: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return dayjs(dateString).format('MMM DD, YYYY');
    } catch {
      return '-';
    }
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

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Appointments
        </Typography>
        {canManageAppointments && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={() => navigate('/appointments/calendar')}
            >
              Calendar View
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/appointments/new')}
            >
              New Appointment
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={!!error} onClose={() => setError('')} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="error">
              Error
            </Typography>
            <IconButton size="small" onClick={() => setError('')}>
              <ClearIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError('')} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                placeholder="Search by patient, provider name, code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="checked_in">Checked In</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="no_show">No Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DateTimePicker
                label="Start Date & Time"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DateTimePicker
                label="End Date & Time"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                minDateTime={startDate}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Refresh">
                  <IconButton
                    onClick={fetchAppointments}
                    disabled={loading}
                    color="primary"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                {hasActiveFilters && (
                  <Tooltip title="Reset Filters">
                    <IconButton
                      onClick={handleResetFilters}
                      color="secondary"
                    >
                      <FilterAltOffIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Insurance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No appointments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appointment) => (
                      <TableRow key={appointment._id || appointment.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(appointment.appointmentDate)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {appointment.patientId?.firstName}{' '}
                          {appointment.patientId?.lastName}
                        </TableCell>
                        <TableCell>
                          {appointment.providerId?.userId?.firstName}{' '}
                          {appointment.providerId?.userId?.lastName}
                        </TableCell>
                        <TableCell>
                          {appointment.appointmentTypeId?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip
                              label={appointment.insuranceVerified ? '✓ Verified' : '✗ Not Verified'}
                              color={appointment.insuranceVerified ? 'success' : 'warning'}
                              size="small"
                              variant={appointment.insuranceVerified ? 'filled' : 'outlined'}
                            />
                            {appointment.copayCollected > 0 && (
                              <Typography variant="caption" color="success.main" fontWeight="medium">
                                Copay: ${appointment.copayCollected}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status || 'scheduled'}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                appointment._id || appointment.id
                              )
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalAppointments}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actionMenu.anchorEl && [
          <MenuItem key="view" onClick={() => handleViewDetails(actionMenu.appointmentId)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>,
          ...((() => {
            const appointment = appointments.find(
              (apt) => (apt._id || apt.id) === actionMenu.appointmentId
            );
            const items = [];

            if (!canManageAppointments) {
              return items;
            }

            items.push(
              <MenuItem key="edit" onClick={() => handleEdit(actionMenu.appointmentId)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            );

            if (canCheckIn(appointment)) {
              items.push(
                <MenuItem
                  key="check-in"
                  onClick={() => handleCheckIn(actionMenu.appointmentId)}
                >
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Check In</ListItemText>
                </MenuItem>
              );
            }

            // if (canReschedule(appointment)) {
            //   items.push(
            //     <MenuItem
            //       key="reschedule"
            //       onClick={() => handleReschedule(actionMenu.appointmentId)}
            //     >
            //       <ListItemIcon>
            //         <ScheduleIcon fontSize="small" />
            //       </ListItemIcon>
            //       <ListItemText>Reschedule</ListItemText>
            //     </MenuItem>
            //   );
            // }

            if (canCancel(appointment)) {
              items.push(
                <MenuItem
                  key="cancel"
                  onClick={() => handleCancelClick(actionMenu.appointmentId)}
                >
                  <ListItemIcon>
                    <CancelIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cancel</ListItemText>
                </MenuItem>
              );
            }

            items.push(
              <MenuItem
                key="delete"
                onClick={() => handleDeleteClick(actionMenu.appointmentId)}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            );

            return items;
          })()),
        ]}
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        message={`Are you sure you want to delete appointment "${deleteDialog.appointmentCode}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />

      <Dialog
        open={cancelDialog.open}
        onClose={handleCancelDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon color="warning" />
            <Typography variant="h6">Cancel Appointment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to cancel appointment "{cancelDialog.appointmentCode}"?
          </Typography>
          <TextField
            fullWidth
            label="Cancellation Reason (Optional)"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter the reason for cancellation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} disabled={cancelLoading}>
            Close
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            color="warning"
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-in with Copay Dialog */}
      <Dialog
        open={checkInDialog.open}
        onClose={() => setCheckInDialog({ open: false, appointment: null, copayAmount: 0 })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Check-in Patient</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Patient: {checkInDialog.appointment?.patientId?.firstName}{' '}
              {checkInDialog.appointment?.patientId?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Appointment: {checkInDialog.appointment?.appointmentTypeId?.name || 'N/A'}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Copay Amount"
            type="number"
            value={checkInDialog.copayAmount}
            onChange={(e) =>
              setCheckInDialog({
                ...checkInDialog,
                copayAmount: parseFloat(e.target.value) || 0,
              })
            }
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Enter copay amount collected from patient (leave 0 if no copay)"
            sx={{ mt: 2 }}
          />

          {checkInDialog.appointment?.patientId?.primaryInsurance?.copayAmount && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Expected Copay: ${checkInDialog.appointment.patientId.primaryInsurance.copayAmount}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCheckInDialog({ open: false, appointment: null, copayAmount: 0 })}
            disabled={checkInLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckInConfirm}
            disabled={checkInLoading}
            startIcon={checkInLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {checkInLoading ? 'Checking In...' : 'Check In'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsListPage;
