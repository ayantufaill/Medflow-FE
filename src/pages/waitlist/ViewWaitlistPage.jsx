import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { waitlistService } from "../../services/waitlist.service";
import dayjs from "dayjs";

const ViewWaitlistPage = () => {
  const navigate = useNavigate();
  const { waitlistEntryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [waitlistEntry, setWaitlistEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await waitlistService.getWaitlistEntryById(
          waitlistEntryId
        );
        setWaitlistEntry(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to load waitlist entry. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (waitlistEntryId) {
      fetchData();
    }
  }, [waitlistEntryId]);

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

  if (error && !waitlistEntry) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!waitlistEntry) {
    return (
      <Box>
        <Alert severity="error">Waitlist entry not found</Alert>
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
      active: "info",
      called: "warning",
      scheduled: "success",
      expired: "error",
    };
    return statusColors[status] || "default";
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      urgent: "error",
      normal: "default",
      flexible: "success",
    };
    return priorityColors[priority] || "default";
  };

  const getPriorityLabel = (priority) => {
    return priority
      ? priority.charAt(0).toUpperCase() + priority.slice(1)
      : "-";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Waitlist Entry Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View details of this waitlist entry.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/waitlist/${waitlistEntryId}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={getStatusLabel(waitlistEntry.status)}
              color={getStatusColor(waitlistEntry.status)}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Priority
            </Typography>
            <Chip
              label={getPriorityLabel(waitlistEntry.priority)}
              color={getPriorityColor(waitlistEntry.priority)}
              size="small"
            />
          </Grid>
          {(waitlistEntry.patient || waitlistEntry.patientId) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Patient
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {(waitlistEntry.patient?.firstName || waitlistEntry.patientId?.firstName)}{" "}
                {(waitlistEntry.patient?.lastName || waitlistEntry.patientId?.lastName)}
                {(waitlistEntry.patient?.patientCode || waitlistEntry.patientId?.patientCode) &&
                  ` (${waitlistEntry.patient?.patientCode || waitlistEntry.patientId?.patientCode})`}
              </Typography>
            </Grid>
          )}
          {(waitlistEntry.provider || waitlistEntry.providerId) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Provider
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {(waitlistEntry.provider?.userId?.firstName || waitlistEntry.providerId?.userId?.firstName)}{" "}
                {(waitlistEntry.provider?.userId?.lastName || waitlistEntry.providerId?.userId?.lastName)}
                {(waitlistEntry.provider?.providerCode || waitlistEntry.providerId?.providerCode) &&
                  ` (${waitlistEntry.provider?.providerCode || waitlistEntry.providerId?.providerCode})`}
              </Typography>
            </Grid>
          )}
          {(waitlistEntry.appointmentType || waitlistEntry.appointmentTypeId) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Appointment Type
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {waitlistEntry.appointmentType?.name || waitlistEntry.appointmentTypeId?.name || "-"}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Preferred Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(waitlistEntry.preferredDate)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Preferred Start Time
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatTime(waitlistEntry.preferredTimeStart)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Preferred End Time
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatTime(waitlistEntry.preferredTimeEnd)}
            </Typography>
          </Grid>
          {waitlistEntry.notes && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {waitlistEntry.notes}
              </Typography>
            </Grid>
          )}
          {waitlistEntry.createdBy && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created By
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {typeof waitlistEntry.createdBy === "object"
                  ? `${waitlistEntry.createdBy.firstName || ""} ${waitlistEntry.createdBy.lastName || ""}`.trim() || waitlistEntry.createdBy._id
                  : waitlistEntry.createdBy}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created At
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(waitlistEntry.createdAt)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(waitlistEntry.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewWaitlistPage;
