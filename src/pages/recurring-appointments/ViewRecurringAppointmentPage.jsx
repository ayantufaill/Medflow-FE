import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { recurringAppointmentService } from "../../services/recurring-appointment.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import dayjs from "dayjs";

const ViewRecurringAppointmentPage = () => {
  const navigate = useNavigate();
  const { recurringAppointmentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recurringAppointment, setRecurringAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await recurringAppointmentService.getRecurringAppointmentById(
            recurringAppointmentId
          );
        setRecurringAppointment(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to load recurring appointment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (recurringAppointmentId) {
      fetchData();
    }
  }, [recurringAppointmentId]);

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

  if (error && !recurringAppointment) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error
        </Typography>
        <Typography>{error}</Typography>
        <Button
          onClick={() => navigate("/recurring-appointments")}
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!recurringAppointment) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Not Found
        </Typography>
        <Typography>Recurring appointment not found</Typography>
        <Button
          onClick={() => navigate("/recurring-appointments")}
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
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

  const getFrequencyLabel = (frequency, frequencyValue) => {
    if (!frequency) return "-";
    const value = frequencyValue || 1;
    const labels = {
      daily: value === 1 ? "Daily" : `Every ${value} days`,
      weekly: value === 1 ? "Weekly" : `Every ${value} weeks`,
      monthly: value === 1 ? "Monthly" : `Every ${value} months`,
    };
    return labels[frequency] || frequency;
  };

  const getDayOfWeekLabel = (day) => {
    if (!day) return "-";
    const days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };
    return days[day] || day;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Recurring Appointment Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View details of this recurring appointment.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() =>
            navigate(`/recurring-appointments/${recurringAppointmentId}/edit`)
          }
        >
          Edit
        </Button>
      </Box>

      {/* Details Section */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={recurringAppointment.isActive ? "Active" : "Inactive"}
              color={recurringAppointment.isActive ? "success" : "default"}
              size="small"
            />
          </Grid>
          {recurringAppointment.patientId && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Patient
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {recurringAppointment.patientId.firstName}{" "}
                {recurringAppointment.patientId.lastName}
                {recurringAppointment.patientId.patientCode &&
                  ` (${recurringAppointment.patientId.patientCode})`}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.providerId && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Provider
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {recurringAppointment.providerId.userId?.firstName}{" "}
                {recurringAppointment.providerId.userId?.lastName}
                {recurringAppointment.providerId.providerCode &&
                  ` (${recurringAppointment.providerId.providerCode})`}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.appointmentTypeId && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Appointment Type
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {recurringAppointment.appointmentTypeId.name || "-"}
              </Typography>
            </Grid>
          )}
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Frequency
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {getFrequencyLabel(
                recurringAppointment.frequency,
                recurringAppointment.frequencyValue
              )}
            </Typography>
          </Grid>
          {recurringAppointment.preferredDayOfWeek !== undefined &&
            recurringAppointment.preferredDayOfWeek !== null && (
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Preferred Day of Week
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {getDayOfWeekLabel(recurringAppointment.preferredDayOfWeek)}
                </Typography>
              </Grid>
            )}
          {recurringAppointment.startDate && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Start Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(recurringAppointment.startDate)}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.endDate && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                End Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(recurringAppointment.endDate)}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.preferredTime && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Preferred Time
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatTime(recurringAppointment.preferredTime)}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.totalAppointments && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {recurringAppointment.totalAppointments}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.createdBy && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created By
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {recurringAppointment.createdBy.firstName}{" "}
                {recurringAppointment.createdBy.lastName}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.createdAt && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created At
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(recurringAppointment.createdAt)}
              </Typography>
            </Grid>
          )}
          {recurringAppointment.updatedAt && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(recurringAppointment.updatedAt)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewRecurringAppointmentPage;
