import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as HeartIcon,
  Thermostat as TempIcon,
  Speed as BPIcon,
  Air as BreathIcon,
  MonitorWeight as WeightIcon,
  Height as HeightIcon,
  Healing as O2Icon,
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import {
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ViewVitalSignPage = () => {
  const navigate = useNavigate();
  const { vitalSignId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vitalSign, setVitalSign] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchVitalSign = async () => {
      try {
        setLoading(true);
        const data = await vitalSignService.getVitalSignById(vitalSignId);
        setVitalSign(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load vital sign record'
        );
        showSnackbar('Failed to load vital sign record', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVitalSign();
  }, [vitalSignId, showSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await vitalSignService.deleteVitalSign(vitalSignId);
      showSnackbar('Vital sign record deleted successfully', 'success');
      navigate('/vital-signs');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete vital sign record',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const getPatientName = () => {
    if (vitalSign?.patientId?.firstName && vitalSign?.patientId?.lastName) {
      return `${vitalSign.patientId.firstName} ${vitalSign.patientId.lastName}`;
    }
    return 'Unknown Patient';
  };

  const getRecordedByName = () => {
    if (vitalSign?.recordedBy?.firstName && vitalSign?.recordedBy?.lastName) {
      return `${vitalSign.recordedBy.firstName} ${vitalSign.recordedBy.lastName}`;
    }
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const bmi = vitalSign?.bmi || calculateBMI(vitalSign?.weight, vitalSign?.height);
  const bmiCategory = getBMICategory(bmi);
  const bpCategory = getBloodPressureCategory(
    vitalSign?.bloodPressureSystolic,
    vitalSign?.bloodPressureDiastolic
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vitalSign) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vital-signs')}
          sx={{ mb: 2 }}
        >
          Back to Vital Signs
        </Button>
        <Alert severity="error">{error || 'Vital sign record not found'}</Alert>
      </Box>
    );
  }

  const VitalCard = ({ icon: Icon, label, value, unit, category }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Icon color="primary" />
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {value || '-'}
          {value && unit && (
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
              {unit}
            </Typography>
          )}
        </Typography>
        {category && (
          <Chip
            label={category.label}
            color={category.color}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vital-signs')}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Vital Signs Record
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getPatientName()} - {formatDate(vitalSign.recordedDate)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/vital-signs/${vitalSignId}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Record Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getPatientName()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EventIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recorded Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(vitalSign.recordedDate)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TimeIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recorded Time
                  </Typography>
                  <Typography variant="body1">
                    {vitalSign.recordedTime || '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recorded By
                  </Typography>
                  <Typography variant="body1">
                    {getRecordedByName()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={BPIcon}
                label="Blood Pressure"
                value={
                  vitalSign.bloodPressureSystolic || vitalSign.bloodPressureDiastolic
                    ? `${vitalSign.bloodPressureSystolic || '-'}/${vitalSign.bloodPressureDiastolic || '-'}`
                    : null
                }
                unit="mmHg"
                category={bpCategory}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={HeartIcon}
                label="Heart Rate"
                value={vitalSign.heartRate}
                unit="bpm"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={TempIcon}
                label="Temperature"
                value={vitalSign.temperature}
                unit="°F"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={BreathIcon}
                label="Respiratory Rate"
                value={vitalSign.respiratoryRate}
                unit="breaths/min"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={O2Icon}
                label="Oxygen Saturation"
                value={vitalSign.oxygenSaturation}
                unit="%"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={WeightIcon}
                label="Weight"
                value={vitalSign.weight}
                unit="lbs"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <VitalCard
                icon={HeightIcon}
                label="Height"
                value={vitalSign.height}
                unit="in"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WeightIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      BMI
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {bmi || '-'}
                  </Typography>
                  {bmiCategory && (
                    <Chip
                      label={bmiCategory.label}
                      color={bmiCategory.color}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {vitalSign.notes && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {vitalSign.notes}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteDialog}
        title="Delete Vital Sign Record"
        message="Are you sure you want to delete this vital sign record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />
    </Box>
  );
};

export default ViewVitalSignPage;
