import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { allergyService } from '../../services/allergy.service';
import { useAllergy } from '../../hooks/queries/useAllergies';
import { usePatients } from '../../hooks/queries/usePatients';
import { useUsers } from '../../hooks/queries/useUsers';
import AllergyForm from '../../components/allergies/AllergyForm';

const EditAllergyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: allergy, isLoading, isError } = useAllergy(id);
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: usersResult, isLoading: usersLoading } = useUsers({ limit: 1000 });
  const users = usersResult?.users ?? [];

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await allergyService.updateAllergy(id, {
        allergen: data.allergen,
        reaction: data.reaction,
        severity: data.severity,
        documentedDate: data.documentedDate,
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
      showSnackbar('Allergy updated successfully', 'success');
      const patientId = allergy?.patientId?._id || allergy?.patientId;
      navigate(`/allergies?patient_id=${patientId}`);
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update allergy. Please try again.';
      setError(message);
      showSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !allergy) {
    return <Alert severity="error">Allergy not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Edit Allergy</Typography>
          <Typography variant="body1" color="text.secondary">
            Edit allergy details to update the allergy.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <AllergyForm
              onSubmit={handleSubmit}
              initialData={allergy}
              loading={saving}
              isEditMode={true}
              patients={patients}
              users={users}
              patientsLoading={patientsLoading}
              usersLoading={usersLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditAllergyPage;
