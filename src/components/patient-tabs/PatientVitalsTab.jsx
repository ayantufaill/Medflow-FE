import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Favorite as HeartIcon,
  Thermostat as TempIcon,
  MonitorWeight as WeightIcon,
  Height as HeightIcon,
  Air as RespiratoryIcon,
  WaterDrop as OxygenIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import {
  usePatientVitalSigns,
  useDeleteVitalSign,
} from '../../hooks/queries/useVitalSigns';
import {
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';

const PatientVitalsTab = ({ patientId }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vital: null });

  // Fetch only the last 3 readings for the tab preview
  const {
    data,
    isLoading: loading,
    isError,
    error: queryError,
    refetch,
  } = usePatientVitalSigns(patientId, 1, 3);

  const vitals = data?.vitalSigns || [];
  const totalCount = data?.pagination?.total || 0;
  const error = isError ? (queryError?.response?.data?.error?.message || 'Failed to load vital signs') : '';

  const { mutateAsync: deleteVitalSign, isPending: deleting } = useDeleteVitalSign();

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '-';
    const date = dayjs(dateString).format('MMM DD, YYYY');
    if (!timeString) return date;
    const [hours, minutes] = timeString.split(':');
    const time = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
    return `${date} at ${time.format('h:mm A')}`;
  };

  const handleDeleteClick = (vital) => {
    setDeleteDialog({ open: true, vital });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.vital) return;
    try {
      await deleteVitalSign(deleteDialog.vital._id);
      showSnackbar('Vital signs deleted successfully', 'success');
      setDeleteDialog({ open: false, vital: null });
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete vital signs',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="medium">
          Vital Signs ({totalCount})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HistoryIcon />}
            onClick={() => navigate(`/vital-signs/patient/${patientId}`)}
          >
            View Full History
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/vital-signs/create?patientId=${patientId}`)}
          >
            Record Vitals
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {vitals.length === 0 ? (
        <Alert severity="info">No vital signs recorded for this patient.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {vitals.map((vital) => {
            const bmi = calculateBMI(vital.weight, vital.height);
            const bmiCategory = getBMICategory(bmi);
            const bpCategory = getBloodPressureCategory(
              vital.bloodPressureSystolic,
              vital.bloodPressureDiastolic
            );

            return (
              <Card key={vital._id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {formatDateTime(vital.recordedDate, vital.recordedTime)}
                      </Typography>
                      {vital.appointmentId && (
                        <Typography variant="caption" color="text.secondary">
                          Appointment: {dayjs(vital.appointmentId.appointmentDate).format('MMM DD, YYYY')}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {bpCategory && (
                        <Chip
                          label={bpCategory.label}
                          color={bpCategory.color}
                          size="small"
                        />
                      )}
                      {bmiCategory && (
                        <Chip
                          label={`BMI: ${bmi} - ${bmiCategory.label}`}
                          color={bmiCategory.color}
                          size="small"
                        />
                      )}
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/vital-signs/${vital._id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(vital)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <HeartIcon fontSize="small" color="error" />
                        <Typography variant="caption" color="text.secondary">
                          Blood Pressure
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vital.bloodPressureSystolic && vital.bloodPressureDiastolic
                          ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic} mmHg`
                          : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <HeartIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Heart Rate
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vital.heartRate ? `${vital.heartRate} bpm` : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <TempIcon fontSize="small" color="warning" />
                        <Typography variant="caption" color="text.secondary">
                          Temperature
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vital.temperature ? `${vital.temperature}°F` : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <OxygenIcon fontSize="small" color="info" />
                        <Typography variant="caption" color="text.secondary">
                          SpO2
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        color={vital.oxygenSaturation && vital.oxygenSaturation < 90 ? 'error.main' : 'inherit'}
                      >
                        {vital.oxygenSaturation ? `${vital.oxygenSaturation}%` : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <RespiratoryIcon fontSize="small" color="success" />
                        <Typography variant="caption" color="text.secondary">
                          Respiratory
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vital.respiratoryRate ? `${vital.respiratoryRate} /min` : '-'}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <WeightIcon fontSize="small" color="secondary" />
                        <Typography variant="caption" color="text.secondary">
                          Weight / Height
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vital.weight ? `${vital.weight} lbs` : '-'}
                        {vital.height ? ` / ${vital.height} in` : ''}
                      </Typography>
                    </Grid>
                  </Grid>

                  {vital.notes && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {vital.notes}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {totalCount > 3 && (
            <Button
              variant="text"
              color="primary"
              startIcon={<HistoryIcon />}
              onClick={() => navigate(`/vital-signs/patient/${patientId}`)}
              sx={{ alignSelf: 'center', mt: 1 }}
            >
              View all {totalCount} vital sign records
            </Button>
          )}
        </Box>
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Vital Signs"
        message="Are you sure you want to delete this vital signs record? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, vital: null })}
      />
    </Box>
  );
};

export default PatientVitalsTab;
