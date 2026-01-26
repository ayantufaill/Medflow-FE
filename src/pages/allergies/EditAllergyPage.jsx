import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { allergyService } from "../../services/allergy.service";
import AllergyForm from "../../components/allergies/AllergyForm";

const EditAllergyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [allergy, setAllergy] = useState(null);

  const fetchAllergy = async () => {
    try {
      setLoading(true);
      const allergyData = await allergyService.getAllergyById(id);
      setAllergy(allergyData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to load allergy data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllergy();
    }
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      const updateData = {
        allergen: data.allergen,
        reaction: data.reaction,
        severity: data.severity,
        documentedDate: data.documentedDate,
        isActive: data.isActive !== undefined ? data.isActive : true,
      };

      await allergyService.updateAllergy(id, updateData);

      showSnackbar("Allergy updated successfully", "success");
      navigate(`/allergies?patient_id=${allergy.patientId?._id || allergy.patientId}`);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update allergy. Please try again."
      );
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

  if (!allergy) {
    return (
      <Box>
        <Alert severity="error">Allergy not found</Alert>
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
            Edit Allergy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit allergy details to update the allergy.
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
            <AllergyForm
              onSubmit={onSubmit}
              initialData={allergy}
              loading={saving}
              isEditMode={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditAllergyPage;

