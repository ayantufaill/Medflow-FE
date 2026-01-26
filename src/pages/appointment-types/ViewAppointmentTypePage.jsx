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
import { appointmentTypeService } from "../../services/appointment-type.service";

const ViewAppointmentTypePage = () => {
  const navigate = useNavigate();
  const { appointmentTypeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentType, setAppointmentType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await appointmentTypeService.getAppointmentTypeById(
          appointmentTypeId
        );
        setAppointmentType(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to load appointment type. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (appointmentTypeId) {
      fetchData();
    }
  }, [appointmentTypeId]);

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

  if (error && !appointmentType) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!appointmentType) {
    return (
      <Box>
        <Alert severity="error">Appointment type not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      {/* Navigation Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Appointment Type Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View details for "<emp>{appointmentType.name}</emp>"
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={() =>
            navigate(`/appointment-types/${appointmentTypeId}/edit`)
          }
        >
          Edit
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Details Section */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Name
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {appointmentType.name || "-"}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={appointmentType.isActive ? "Active" : "Inactive"}
              color={appointmentType.isActive ? "success" : "default"}
              size="small"
            />
          </Grid>
          {appointmentType.description && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {appointmentType.description}
              </Typography>
            </Grid>
          )}
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Default Duration
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {appointmentType.defaultDuration || 0} minutes
            </Typography>
          </Grid>
          {appointmentType.defaultPrice !== undefined &&
            appointmentType.defaultPrice !== null && (
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Default Price
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${appointmentType.defaultPrice.toFixed(2)}
                </Typography>
              </Grid>
            )}
          {appointmentType.colorCode && (
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Color Code
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: appointmentType.colorCode,
                    border: 1,
                    borderColor: "divider",
                  }}
                />
                <Typography variant="body1" fontWeight="medium">
                  {appointmentType.colorCode}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Requires Authorization
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {appointmentType.requiresAuthorization ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Buffer Before
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {appointmentType.bufferBefore || 0} minutes
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Buffer After
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {appointmentType.bufferAfter || 0} minutes
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewAppointmentTypePage;
