import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { appointmentService } from "../../services/appointment.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import dayjs from "dayjs";

const ViewAppointmentPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleStartTime, setRescheduleStartTime] = useState(null);
  const [rescheduleEndTime, setRescheduleEndTime] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await appointmentService.getAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to load appointment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchData();
    }
  }, [appointmentId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !appointment) {
    return (
      <Box>
        <Dialog open={true} onClose={() => navigate('/appointments')} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="error">
                Error
              </Typography>
              <IconButton size="small" onClick={() => navigate('/appointments')}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>{error}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/appointments')} variant="contained" color="error">
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box>
        <Dialog open={true} onClose={() => navigate('/appointments')} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="error">
                Not Found
              </Typography>
              <IconButton size="small" onClick={() => navigate('/appointments')}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>Appointment not found</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/appointments')} variant="contained" color="error">
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return dayjs(dateString).format("MMM DD, YYYY");
    } catch {
      return "-";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: "default",
      confirmed: "info",
      checked_in: "warning",
      completed: "success",
      cancelled: "error",
      no_show: "error",
    };
    return statusColors[status] || "default";
  };

  const getStatusLabel = (status) => {
    return status
      ? status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "-";
  };

  const getAppointmentTypeLabel = (type) => {
    return type
      ? type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "-";
  };

  const canCancel = () => {
    return (
      appointment &&
      appointment.status !== "cancelled" &&
      appointment.status !== "completed"
    );
  };

  const canReschedule = () => {
    return (
      appointment &&
      appointment.status !== "cancelled" &&
      appointment.status !== "completed"
    );
  };

  const canDelete = () => {
    return appointment && appointment.status !== "completed";
  };

  const handleCancelClick = () => {
    setCancellationReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      setProcessing(true);
      await appointmentService.cancelAppointment(
        appointmentId,
        cancellationReason || undefined
      );
      showSnackbar("Appointment cancelled successfully", "success");
      setCancelDialogOpen(false);
      // Refresh appointment data
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to cancel appointment",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRescheduleClick = () => {
    if (appointment) {
      setRescheduleDate(dayjs(appointment.appointmentDate));
      const [startHours, startMinutes] = appointment.startTime.split(":");
      const [endHours, endMinutes] = appointment.endTime.split(":");
      setRescheduleStartTime(
        dayjs().hour(parseInt(startHours)).minute(parseInt(startMinutes))
      );
      setRescheduleEndTime(
        dayjs().hour(parseInt(endHours)).minute(parseInt(endMinutes))
      );
    }
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) {
      showSnackbar("Please select date, start time, and end time", "error");
      return;
    }

    try {
      setProcessing(true);
      await appointmentService.rescheduleAppointment(appointmentId, {
        appointmentDate: rescheduleDate.format("YYYY-MM-DD"),
        startTime: rescheduleStartTime.format("HH:mm"),
        endTime: rescheduleEndTime.format("HH:mm"),
      });
      showSnackbar("Appointment rescheduled successfully", "success");
      setRescheduleDialogOpen(false);
      // Refresh appointment data
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to reschedule appointment",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setProcessing(true);
      await appointmentService.checkInAppointment(appointmentId);
      showSnackbar("Patient checked in successfully", "success");
      // Refresh appointment data
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to check in patient",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setProcessing(true);
      await appointmentService.deleteAppointment(appointmentId);
      showSnackbar("Appointment deleted successfully", "success");
      setDeleteDialogOpen(false);
      navigate("/appointments");
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to delete appointment",
        "error"
      );
      setDeleteDialogOpen(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box>
      {/* Navigation Header */}
      <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 1 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Appointment Details
          </Typography>
        </Box>
      </Box>

      <Dialog open={!!error} onClose={() => setError("")} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="error">
              Error
            </Typography>
            <IconButton size="small" onClick={() => setError("")}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError("")} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Primary Details Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Avatar and Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              minWidth: 300,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "primary.main",
                  fontSize: "1.8rem",
                }}
              >
                <EventIcon />
              </Avatar>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {appointment.appointmentCode || "N/A"}
              </Typography>
              <Stack spacing={0.5}>
                {appointment.patientId && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </Typography>
                  </Box>
                )}
                {appointment.appointmentDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(appointment.appointmentDate)} at{" "}
                      {formatTime(appointment.startTime)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
          {/* Action Buttons */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {appointment &&
              (appointment.status === "scheduled" ||
                appointment.status === "confirmed") && (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  disableElevation
                  startIcon={<CheckCircleIcon />}
                  onClick={handleCheckIn}
                  disabled={processing}
                >
                  Check In
                </Button>
              )}
            {canCancel() && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                disableElevation
                startIcon={<CancelIcon />}
                onClick={handleCancelClick}
                disabled={processing}
              >
                Cancel
              </Button>
            )}
            {canReschedule() && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                disableElevation
                startIcon={<ScheduleIcon />}
                onClick={handleRescheduleClick}
                disabled={processing}
              >
                Reschedule
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              disableElevation
              startIcon={<EditIcon />}
              onClick={() => navigate(`/appointments/${appointmentId}/edit`)}
              disabled={processing}
            >
              Edit
            </Button>
            {canDelete() && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                disableElevation
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                disabled={processing}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Tabs Section */}
      <Paper sx={{ width: "100%" }}>
        {/* Sticky Tabs */}
        <Box
          sx={{
            position: "sticky",
            top: { xs: 56, lg: 63 },
            zIndex: 10,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Appointment Information" />
            <Tab label="Additional Details" />
          </Tabs>
        </Box>

        {/* Tab Panel: Appointment Information */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Appointment Code
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.appointmentCode || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={getStatusLabel(appointment.status)}
                  color={getStatusColor(appointment.status)}
                  size="small"
                />
              </Grid>
              {appointment.patientId && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Patient
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.patientId.firstName}{" "}
                    {appointment.patientId.lastName}
                  </Typography>
                </Grid>
              )}
              {appointment.providerId && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Provider
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.providerId.userId?.firstName}{" "}
                    {appointment.providerId.userId?.lastName}
                  </Typography>
                </Grid>
              )}
              {appointment.appointmentTypeId && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Appointment Type
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.appointmentTypeId.name || "-"}
                  </Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Appointment Type (Legacy)
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {getAppointmentTypeLabel(appointment.appointmentType) || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(appointment.appointmentDate) || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatTime(appointment.startTime) || "-"} -{" "}
                  {formatTime(appointment.endTime) || "-"}
                </Typography>
              </Grid>
              {appointment.durationMinutes && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Duration
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.durationMinutes} minutes
                  </Typography>
                </Grid>
              )}
              {appointment.roomId && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Room
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.roomId}
                  </Typography>
                </Grid>
              )}
              {appointment.chiefComplaint && (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Chief Complaint
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.chiefComplaint}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Tab Panel: Additional Details */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {appointment.notes && (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Notes
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.notes}
                  </Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Insurance Status
                </Typography>
                <Chip
                  label={appointment.insuranceVerified ? "✓ Verified" : "✗ Not Verified"}
                  color={appointment.insuranceVerified ? "success" : "warning"}
                  size="small"
                  variant={appointment.insuranceVerified ? "filled" : "outlined"}
                />
              </Grid>
              <Grid size={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Copay Collected
                </Typography>
                <Typography variant="body1" fontWeight="medium" color={appointment.copayCollected > 0 ? "success.main" : "text.primary"}>
                  {appointment.copayCollected > 0 ? `$${appointment.copayCollected.toFixed(2)}` : "Not collected"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Requires Interpreter
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.requiresInterpreter ? "Yes" : "No"}
                </Typography>
              </Grid>
              {appointment.interpreterLanguage && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Interpreter Language
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.interpreterLanguage}
                  </Typography>
                </Grid>
              )}
              {appointment.customFields &&
                Object.keys(appointment.customFields).length > 0 && (
                  <Grid size={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      Custom Fields
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {Object.entries(appointment.customFields).map(
                        ([key, value]) => (
                          <Box
                            key={key}
                            sx={{
                              p: 2,
                              bgcolor: "background.default",
                              borderRadius: 1,
                              border: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              gutterBottom
                            >
                              {key}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {String(value || "-")}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Grid>
                )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reminder Sent
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.reminderSent ? "Yes" : "No"}
                </Typography>
              </Grid>
              {appointment.cancellationReason && (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Cancellation Reason
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.cancellationReason}
                  </Typography>
                </Grid>
              )}
              {appointment.checkInAt && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Check-in Time
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(appointment.checkInAt)} at{" "}
                    {formatTime(dayjs(appointment.checkInAt).format("HH:mm"))}
                  </Typography>
                </Grid>
              )}
              {appointment.completedAt && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Completed Time
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(appointment.completedAt)} at{" "}
                    {formatTime(dayjs(appointment.completedAt).format("HH:mm"))}
                  </Typography>
                </Grid>
              )}
              {appointment.createdBy && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created By
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {appointment.createdBy.firstName}{" "}
                    {appointment.createdBy.lastName}
                  </Typography>
                </Grid>
              )}
              {appointment.createdAt && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created At
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(appointment.createdAt)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !processing && setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Cancellation Reason (Optional)"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Enter reason for cancellation..."
            disabled={processing}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={processing}
            color="inherit"
          >
            No, Keep Appointment
          </Button>
          <Button
            onClick={handleCancelConfirm}
            disabled={processing}
            color="error"
            variant="contained"
            startIcon={processing ? <CircularProgress size={16} /> : null}
          >
            Yes, Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onClose={() => !processing && setRescheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <DatePicker
                label="New Appointment Date *"
                value={rescheduleDate}
                onChange={(newValue) => setRescheduleDate(newValue)}
                minDate={dayjs()}
                disabled={processing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <TimePicker
                label="New Start Time *"
                value={rescheduleStartTime}
                onChange={(newValue) => {
                  setRescheduleStartTime(newValue);
                  if (newValue && appointment?.durationMinutes) {
                    setRescheduleEndTime(
                      newValue.add(appointment.durationMinutes, "minute")
                    );
                  }
                }}
                disabled={processing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <TimePicker
                label="New End Time *"
                value={rescheduleEndTime}
                onChange={(newValue) => setRescheduleEndTime(newValue)}
                minTime={
                  rescheduleStartTime
                    ? rescheduleStartTime.add(5, "minute")
                    : null
                }
                disabled={processing}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRescheduleDialogOpen(false)}
            disabled={processing}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRescheduleConfirm}
            disabled={
              processing ||
              !rescheduleDate ||
              !rescheduleStartTime ||
              !rescheduleEndTime
            }
            color="primary"
            variant="contained"
            startIcon={processing ? <CircularProgress size={16} /> : null}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !processing && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this appointment? This action cannot
            be undone. The appointment will be permanently removed from the
            system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={processing}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={processing}
            color="error"
            variant="contained"
            startIcon={processing ? <CircularProgress size={16} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewAppointmentPage;
