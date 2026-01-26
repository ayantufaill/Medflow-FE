import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { allergyService } from "../../services/allergy.service";
import AllergyForm from "../../components/allergies/AllergyForm";

const CreateAllergyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get("patient_id");
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

      const allergyData = {
        patientId: data.patientId || patientIdFromQuery,
        allergen: data.allergen,
        reaction: data.reaction,
        severity: data.severity,
        documentedDate: data.documentedDate,
        isActive: data.isActive !== undefined ? data.isActive : true,
      };

      await allergyService.createAllergy(allergyData);

      showSnackbar("Allergy created successfully", "success");
      
      // Navigate back to allergies list with patient_id if provided
      if (patientIdFromQuery) {
        navigate(`/allergies?patient_id=${patientIdFromQuery}`);
      } else {
        navigate("/allergies");
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create allergy. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create allergy. Please try again.",
        "error"
      );
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
            Create Allergy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter allergy details for the patient.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <AllergyForm
            onSubmit={handleSubmit}
            loading={saving}
            isEditMode={false}
            hideButtons={true}
            formId="create-allergy-form"
            initialData={patientIdFromQuery ? { patientId: patientIdFromQuery } : null}
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
              form="create-allergy-form"
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {saving ? "Creating..." : "Create Allergy"}
            </Button>
          </Box>
        </Paper>
    </Box>
  );
};

export default CreateAllergyPage;

