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
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { providerService } from "../../services/provider.service";

const ViewProviderPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const formatSpecialty = (value) => {
    if (!value) return '-';
    if (Array.isArray(value)) {
      const cleaned = value
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .filter((v) => v.length > 0);
      return cleaned.length ? cleaned.join(', ') : '-';
    }
    if (typeof value === 'string') return value.trim() || '-';
    return '-';
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await providerService.getProviderById(providerId);
        setProvider(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to load provider. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchData();
    }
  }, [providerId]);

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

  if (error && !provider) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box>
        <Alert severity="error">Provider not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  // Convert backend workingHours array to day-keyed object for display
  const getWorkingHoursByDay = () => {
    const hoursByDay = {};
    const dayMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    if (provider.workingHours && Array.isArray(provider.workingHours)) {
      provider.workingHours.forEach((wh) => {
        if (wh.isAvailable !== false && wh.startTime && wh.endTime) {
          hoursByDay[dayMap[wh.dayOfWeek]] = {
            open: wh.startTime,
            close: wh.endTime,
          };
        }
      });
    }

    return hoursByDay;
  };

  const workingHoursByDay = getWorkingHoursByDay();

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Box>
      {/* Navigation Header */}
      <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Provider Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View provider details and manage their information.
          </Typography>
        </Box>
        <Button
          size="small"
          disabled={loading}
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/providers/${providerId}/edit`)}
        >
          Edit Provider
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

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
            <Tab label="Provider Information" />
            <Tab label="Working Hours" />
          </Tabs>
        </Box>

        {/* Tab Panel: Provider Information */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provider's Full Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.userId?.firstName} {provider.userId?.lastName}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  <Chip
                    label={provider.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={provider.isActive ? "success" : "error"}
                  />
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Provider Code
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.providerCode || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  NPI Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.npiNumber || "-"}
                </Typography>
              </Grid>
              {provider.licenseNumber && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    License Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {provider.licenseNumber}
                  </Typography>
                </Grid>
              )}
              {provider.specialty && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Specialty
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatSpecialty(provider.specialty)}
                  </Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Title
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.title || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Appointment Buffer
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.appointmentBufferMinutes || 0} minutes
                </Typography>
              </Grid>
              {provider.maxDailyAppointments && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Max Daily Appointments
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {provider.maxDailyAppointments}
                  </Typography>
                </Grid>
              )}
              {provider.consultationFee !== undefined &&
                provider.consultationFee !== null && (
                  <Grid size={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Consultation Fee
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${provider.consultationFee.toFixed(2)}
                    </Typography>
                  </Grid>
                )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accepting New Patients
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.isAcceptingNewPatients ? "Yes" : "No"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Telehealth Enabled
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {provider.telehealthEnabled ? "Yes" : "No"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel: Working Hours */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Start Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { key: "monday", label: "Monday" },
                    { key: "tuesday", label: "Tuesday" },
                    { key: "wednesday", label: "Wednesday" },
                    { key: "thursday", label: "Thursday" },
                    { key: "friday", label: "Friday" },
                    { key: "saturday", label: "Saturday" },
                    { key: "sunday", label: "Sunday" },
                  ].map((day) => {
                    const dayHours = workingHoursByDay[day.key];
                    const isClosed =
                      !dayHours || !dayHours.open || !dayHours.close;

                    return (
                      <TableRow key={day.key}>
                        <TableCell>{day.label}</TableCell>
                        <TableCell>
                          {isClosed ? (
                            <Typography variant="body2" color="text.secondary">
                              Closed
                            </Typography>
                          ) : (
                            formatTimeTo12Hour(dayHours.open)
                          )}
                        </TableCell>
                        <TableCell>
                          {isClosed ? (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          ) : (
                            formatTimeTo12Hour(dayHours.close)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ViewProviderPage;
