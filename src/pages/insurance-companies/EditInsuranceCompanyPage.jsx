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
import { insuranceCompanyService } from "../../services/insurance.service";
import InsuranceCompanyForm from "../../components/insurance-companies/InsuranceCompanyForm";

const EditInsuranceCompanyPage = () => {
  const navigate = useNavigate();
  const { insuranceCompanyId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState(null);

  const fetchInsuranceCompany = async () => {
    try {
      const company = await insuranceCompanyService.getInsuranceCompanyById(insuranceCompanyId);
      setInsuranceCompany(company);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to load insurance company data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (insuranceCompanyId) {
      fetchInsuranceCompany();
    }
  }, [insuranceCompanyId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await insuranceCompanyService.updateInsuranceCompany(insuranceCompanyId, data);

      showSnackbar("Insurance company updated successfully", "success");
      navigate("/insurance-companies");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update insurance company. Please try again."
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

  if (!insuranceCompany) {
    return (
      <Box>
        <Alert severity="error">Insurance company not found</Alert>
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
            Edit Insurance Company
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit insurance company details to update the company.
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
            <InsuranceCompanyForm
              onSubmit={onSubmit}
              initialData={insuranceCompany}
              loading={saving}
              isEditMode={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditInsuranceCompanyPage;

