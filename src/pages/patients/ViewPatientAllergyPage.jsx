import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { patientService } from '../../services/patient.service';

const ViewPatientAllergyPage = () => {
  const navigate = useNavigate();
  const { patientId, allergyId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allergy, setAllergy] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [allergyData, patientData] = await Promise.all([
          patientService.getAllergyById(patientId, allergyId),
          patientService.getPatientById(patientId),
        ]);

        setAllergy(allergyData);
        setPatient(patientData);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load allergy details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId && allergyId) {
      fetchData();
    }
  }, [patientId, allergyId]);

  const handleBack = () => {
    navigate(`/patients/${patientId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MM/DD/YYYY');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe':
        return 'error';
      case 'moderate':
        return 'warning';
      case 'mild':
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !allergy) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!allergy) {
    return (
      <Box>
        <Alert severity="error">Allergy record not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Allergy Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'} - {allergy.allergen}
          </Typography>
        </Box>
        {/* <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/patients/${patientId}/allergies/${allergyId}/edit`)}
        >
          Edit Allergy
        </Button> */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 3 }}>
          Allergy Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Allergen
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {allergy.allergen || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Severity
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={
                  allergy.severity
                    ? allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)
                    : 'Unknown'
                }
                size="small"
                color={getSeverityColor(allergy.severity)}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={allergy.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={allergy.isActive ? 'success' : 'default'}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Documented Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(allergy.documentedDate)}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Reaction
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {allergy.reaction || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Documented By
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {allergy.documentedBy
                ? `${allergy.documentedBy.firstName || ''} ${allergy.documentedBy.lastName || ''}`.trim() || '-'
                : '-'}
            </Typography>
          </Grid>

          {allergy.notes && (
            <Grid item size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {allergy.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewPatientAllergyPage;
