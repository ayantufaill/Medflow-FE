import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { patientService } from "../../services/patient.service";
import PatientForm from "../../components/patients/PatientForm";

const EditPatientPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState(null);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");
      // Include SSN in the response for edit mode
      const patientData = await patientService.getPatientById(patientId, true);
      setPatient(patientData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to load patient data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await patientService.updatePatient(patientId, data);

      showSnackbar("Patient updated successfully", "success");
      navigate("/patients");
    } catch (err) {
      let errorMessage = "Failed to update patient. Please try again.";
      
      // Handle specific error cases
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
        // Check for email uniqueness error
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('already exists') || 
             errorMessage.toLowerCase().includes('duplicate') ||
             errorMessage.toLowerCase().includes('unique'))) {
          errorMessage = "A patient with this email address already exists. Please use a different email.";
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('already exists') || 
             errorMessage.toLowerCase().includes('duplicate') ||
             errorMessage.toLowerCase().includes('unique'))) {
          errorMessage = "A patient with this email address already exists. Please use a different email.";
        }
      }
      
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

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

  if (error && !patient) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box>
        <Alert severity="error">Patient not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Patient
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit patient details to update the patient record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <PatientForm
              onSubmit={onSubmit}
              initialData={patient}
              loading={saving}
              isEditMode={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditPatientPage;

