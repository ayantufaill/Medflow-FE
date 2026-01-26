import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { patientService } from "../../services/patient.service";
import PatientForm from "../../components/patients/PatientForm";

const CreatePatientPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await patientService.createPatient(data);

      showSnackbar("Patient created successfully", "success");
      navigate("/patients");
    } catch (err) {
      let errorMessage = "Failed to create patient. Please try again.";
      
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

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create Patient
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter patient details to create a new patient record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <PatientForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-patient-form"
        />

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-patient-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? "Creating..." : "Create Patient"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePatientPage;

