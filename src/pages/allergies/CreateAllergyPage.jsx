import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { allergyService } from '../../services/allergy.service';
import { usePatients } from '../../hooks/queries/usePatients';
import { useUsers } from '../../hooks/queries/useUsers';
import AllergyForm from '../../components/allergies/AllergyForm';

const CreateAllergyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get('patient_id');
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: usersResult, isLoading: usersLoading } = useUsers({ limit: 1000 });
  const users = usersResult?.users ?? [];

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await allergyService.createAllergy({
        patientId: data.patientId || patientIdFromQuery,
        allergen: data.allergen,
        reaction: data.reaction,
        severity: data.severity,
        documentedBy: data.documentedBy,
        documentedDate: data.documentedDate,
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
      showSnackbar('Allergy created successfully', 'success');
      navigate(patientIdFromQuery ? `/allergies?patient_id=${patientIdFromQuery}` : '/allergies');
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create allergy. Please try again.';
      setError(message);
      showSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Create Allergy</Typography>
          <Typography variant="body1" color="text.secondary">
            Enter allergy details for the patient.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <AllergyForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-allergy-form"
          initialData={patientIdFromQuery ? { patientId: patientIdFromQuery } : null}
          patients={patients}
          users={users}
          patientsLoading={patientsLoading}
          usersLoading={usersLoading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => window.history.back()} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-allergy-form"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {saving ? 'Creating...' : 'Create Allergy'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAllergyPage;
