import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  GlobalStyles,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Person as PersonIcon,
  MonitorHeart as MonitorHeartIcon,
  Thermostat as ThermostatIcon,
  Scale as ScaleIcon,
  EventNote as EventNoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import {
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';

const Label = ({ children }) => (
  <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', letterSpacing: '0px', color: '#4b5563', display: 'block', mb: 0.5 }}>
    {children}
  </Typography>
);

const ReadOnlyField = ({ value, adornment }) => (
  <Box
    sx={{
      borderRadius: '8px',
      backgroundColor: '#F9FAFB',
      border: '1px solid #E5E7EB',
      padding: '10px 14px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: value ? '#111827' : '#9CA3AF' }}>
      {value || '-'}
    </Typography>
    {adornment && value && (
      <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#6B7280' }}>
        {adornment}
      </Typography>
    )}
  </Box>
);

const SectionContainer = ({ title, icon: Icon, children }) => {
  const borderColor = '#E5E7EB';
  const headerBg = '#F3F8FD';
  
  return (
    <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 3, backgroundColor: '#FFFFFF' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}`, borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
        {Icon && <Icon sx={{ width: 22, height: 22, color: '#2563EB' }} />}
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#111' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

const ViewVitalsDialog = ({ open, onClose, vitalSignId, onDeleted, onEdit }) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vitalSign, setVitalSign] = useState(null);
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!open || !vitalSignId) return;

    const fetchVitalSign = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await vitalSignService.getVitalSignById(vitalSignId);
        setVitalSign(data);
      } catch (err) {
        const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load vital sign record';
        setError(errMsg);
        showSnackbar(errMsg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVitalSign();
  }, [vitalSignId, open, showSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await vitalSignService.deleteVitalSign(vitalSignId);
      showSnackbar('Vital sign record deleted successfully', 'success');
      if (onDeleted) onDeleted();
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

  return (
    <>
      <GlobalStyles styles={{ '.MuiDialog-root': { zIndex: 10000 } }} />
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 10000 }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            backgroundColor: '#F9FAFB',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 3, 
          pb: 2,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        }}>
          <Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: '#111827', mb: 0.5 }}>
              Vital Signs Record
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B7280' }}>
              Viewing recorded vitals for patient
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: '#9CA3AF',
              '&:hover': { backgroundColor: '#F3F4F6', color: '#4B5563' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, backgroundColor: '#F9FAFB' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error || !vitalSign ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error || 'Vital sign record not found'}</Alert>
          ) : (
            <>
              <SectionContainer title="Record Details" icon={EventNoteIcon}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Patient Name</Label>
                      <ReadOnlyField value={getPatientName()} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Recorded By</Label>
                      <ReadOnlyField value={getRecordedByName()} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Recorded Date</Label>
                      <ReadOnlyField value={formatDate(vitalSign.recordedDate)} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Recorded Time</Label>
                      <ReadOnlyField value={vitalSign.recordedTime} />
                    </Box>
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Blood Pressure & Heart Rate" icon={MonitorHeartIcon}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Systolic BP</Label>
                      <ReadOnlyField value={vitalSign.bloodPressureSystolic} adornment="mmHg" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Diastolic BP</Label>
                      <ReadOnlyField value={vitalSign.bloodPressureDiastolic} adornment="mmHg" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Heart Rate</Label>
                      <ReadOnlyField value={vitalSign.heartRate} adornment="bpm" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      {bpCategory && (
                        <Chip label={bpCategory.label} color={bpCategory.color} size="small" />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Temperature & Respiratory" icon={ThermostatIcon}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Temperature</Label>
                      <ReadOnlyField value={vitalSign.temperature} adornment="°F" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Respiratory Rate</Label>
                      <ReadOnlyField value={vitalSign.respiratoryRate} adornment="breaths/min" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>SpO2</Label>
                      <ReadOnlyField value={vitalSign.oxygenSaturation} adornment="%" />
                    </Box>
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Weight & Height" icon={ScaleIcon}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Weight</Label>
                      <ReadOnlyField value={vitalSign.weight} adornment="lbs" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Label>Height</Label>
                      <ReadOnlyField value={vitalSign.height} adornment="in" />
                    </Box>
                  </Grid>
                  {bmi && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Calculated BMI: <strong>{bmi}</strong></Typography>
                        {bmiCategory && <Chip label={bmiCategory.label} color={bmiCategory.color} size="small" />}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </SectionContainer>

              {vitalSign.notes && (
                <SectionContainer title="Additional Notes" icon={PersonIcon}>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      padding: '12px 14px',
                    }}
                  >
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#111827', whiteSpace: 'pre-wrap' }}>
                      {vitalSign.notes}
                    </Typography>
                  </Box>
                </SectionContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            {!loading && !error && vitalSign && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '6px',
                  px: 2,
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              onClick={onClose} 
              variant="outlined"
              sx={{ 
                borderColor: '#D1D5DB',
                color: '#374151',
                backgroundColor: '#FFFFFF',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '6px',
                px: 2,
                '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }
              }}
            >
              Close
            </Button>
            {!loading && !error && vitalSign && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  onClose();
                  if (onEdit) onEdit(vitalSignId);
                }}
                sx={{ 
                  backgroundColor: '#2563EB', 
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '6px',
                  px: 2.5,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#1D4ED8', boxShadow: 'none' }
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

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
        sx={{ zIndex: 10001 }}
      />
    </>
  );
};

export default ViewVitalsDialog;
