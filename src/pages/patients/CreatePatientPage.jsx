import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { patientService } from "../../services/patient.service";
import NewPatientIntakeForm from "../../components/patients/NewPatientIntakeForm";

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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: { xs: 0.75, sm: 1.25 },
          borderRadius: 2,
          border: '1px solid #dfe5eb',
          boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
          backgroundColor: '#fff',
        }}
      >
        <NewPatientIntakeForm
          onSubmit={handleSubmit}
          loading={saving}
          onCancel={handleBack}
        />
      </Paper>
    </Box>
  );
};

export default CreatePatientPage;

