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
import { useDispatch } from "react-redux";
import { createCarrierThunk } from "../../store/slices/insuranceSlice";
import InsuranceCompanyForm from "../../components/insurance-companies/InsuranceCompanyForm";

const CreateInsuranceCompanyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      await dispatch(createCarrierThunk(data)).unwrap();

      showSnackbar("Insurance company created successfully", "success");
      navigate("/insurance-companies");
    } catch (err) {
      const errMsg = err || "Failed to create insurance company. Please try again.";
      setError(errMsg);
      showSnackbar(errMsg, "error");
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
            Create Insurance Company
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter insurance company details.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <InsuranceCompanyForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-insurance-company-form"
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
            form="create-insurance-company-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? "Creating..." : "Create Insurance Company"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateInsuranceCompanyPage;

