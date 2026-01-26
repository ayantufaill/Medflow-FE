import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import {
  vitalSignValidations,
  validateAtLeastOneVital,
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';

const EditVitalSignPage = () => {
  const navigate = useNavigate();
  const { vitalSignId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [vitalSign, setVitalSign] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('F');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      temperature: '',
      weight: '',
      height: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      recordedDate: null,
      recordedTime: null,
      notes: '',
    },
  });

  const watchedWeight = watch('weight');
  const watchedHeight = watch('height');
  const watchedSystolic = watch('bloodPressureSystolic');
  const watchedDiastolic = watch('bloodPressureDiastolic');
  const watchedOxygenSaturation = watch('oxygenSaturation');
  const watchedNotes = watch('notes');
  const notesCharCount = watchedNotes?.length || 0;
  const maxNotesLength = 1000;

  const bmi = calculateBMI(
    watchedWeight ? parseFloat(watchedWeight) : null,
    watchedHeight ? parseFloat(watchedHeight) : null
  );
  const bmiCategory = getBMICategory(bmi);
  const bpCategory = getBloodPressureCategory(
    watchedSystolic ? parseInt(watchedSystolic) : null,
    watchedDiastolic ? parseInt(watchedDiastolic) : null
  );

  const systolicNum = watchedSystolic ? parseInt(watchedSystolic) : null;
  const diastolicNum = watchedDiastolic ? parseInt(watchedDiastolic) : null;
  const isBPInvalid = systolicNum && diastolicNum && systolicNum <= diastolicNum;
  const isSpO2Critical = watchedOxygenSaturation && parseFloat(watchedOxygenSaturation) < 90;

  const convertTemperature = (value, toUnit) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (toUnit === 'C') {
      return ((numValue - 32) * 5 / 9).toFixed(1);
    } else {
      return ((numValue * 9 / 5) + 32).toFixed(1);
    }
  };

  const handleTemperatureUnitChange = (event, newUnit) => {
    if (newUnit && newUnit !== temperatureUnit) {
      const currentTemp = watch('temperature');
      if (currentTemp) {
        const convertedTemp = convertTemperature(currentTemp, newUnit);
        setValue('temperature', convertedTemp);
      }
      setTemperatureUnit(newUnit);
    }
  };

  useEffect(() => {
    const fetchVitalSign = async () => {
      try {
        setLoading(true);
        const data = await vitalSignService.getVitalSignById(vitalSignId);
        setVitalSign(data);

        reset({
          bloodPressureSystolic: data.bloodPressureSystolic || '',
          bloodPressureDiastolic: data.bloodPressureDiastolic || '',
          temperature: data.temperature || '',
          weight: data.weight || '',
          height: data.height || '',
          heartRate: data.heartRate || '',
          respiratoryRate: data.respiratoryRate || '',
          oxygenSaturation: data.oxygenSaturation || '',
          recordedDate: data.recordedDate ? dayjs(data.recordedDate) : null,
          recordedTime: data.recordedTime ? dayjs(`2000-01-01T${data.recordedTime}`) : null,
          notes: data.notes || '',
        });
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
  }, [vitalSignId, reset, showSnackbar]);

  const getPatientName = () => {
    if (vitalSign?.patientId?.firstName && vitalSign?.patientId?.lastName) {
      return `${vitalSign.patientId.firstName} ${vitalSign.patientId.lastName}`;
    }
    return 'Unknown Patient';
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setCancelDialogOpen(true);
    } else {
      window.history.back();
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    window.history.back();
  };

  const onSubmit = async (data) => {
    if (isBPInvalid) {
      setError('Systolic BP must be higher than Diastolic BP');
      showSnackbar('Systolic BP must be higher than Diastolic BP', 'error');
      return;
    }

    const validationError = validateAtLeastOneVital(data);
    if (validationError) {
      setError(validationError);
      showSnackbar(validationError, 'error');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let temperatureInF = data.temperature ? parseFloat(data.temperature) : undefined;
      if (temperatureInF && temperatureUnit === 'C') {
        temperatureInF = parseFloat(((temperatureInF * 9 / 5) + 32).toFixed(1));
      }

      const updates = {
        bloodPressureSystolic: data.bloodPressureSystolic
          ? parseInt(data.bloodPressureSystolic)
          : undefined,
        bloodPressureDiastolic: data.bloodPressureDiastolic
          ? parseInt(data.bloodPressureDiastolic)
          : undefined,
        temperature: temperatureInF,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
        heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
        respiratoryRate: data.respiratoryRate ? parseInt(data.respiratoryRate) : undefined,
        oxygenSaturation: data.oxygenSaturation
          ? parseFloat(data.oxygenSaturation)
          : undefined,
        recordedDate: data.recordedDate ? data.recordedDate.toISOString() : undefined,
        recordedTime: data.recordedTime ? data.recordedTime.format('HH:mm') : undefined,
        notes: data.notes || undefined,
      };

      await vitalSignService.updateVitalSign(vitalSignId, updates);
      showSnackbar('Vital signs updated successfully', 'success');
      navigate(`/vital-signs/${vitalSignId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update vital signs';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vitalSign) {
    return (
      <Alert severity="error">Vital sign record not found</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Vital Signs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Patient: {getPatientName()}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Blood Pressure & Heart Rate
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Controller
                name="bloodPressureSystolic"
                control={control}
                rules={{
                  min: vitalSignValidations.bloodPressureSystolic.min,
                  max: vitalSignValidations.bloodPressureSystolic.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Systolic BP"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                    }}
                    error={!!errors.bloodPressureSystolic}
                    helperText={errors.bloodPressureSystolic?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="bloodPressureDiastolic"
                control={control}
                rules={{
                  min: vitalSignValidations.bloodPressureDiastolic.min,
                  max: vitalSignValidations.bloodPressureDiastolic.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Diastolic BP"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                    }}
                    error={!!errors.bloodPressureDiastolic}
                    helperText={errors.bloodPressureDiastolic?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ mt: 1 }}>
                {isBPInvalid && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    Systolic must be higher than Diastolic
                  </Alert>
                )}
                {bpCategory && (
                  <Chip
                    label={bpCategory.label}
                    color={bpCategory.color}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="heartRate"
                control={control}
                rules={{
                  min: vitalSignValidations.heartRate.min,
                  max: vitalSignValidations.heartRate.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Heart Rate"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                    }}
                    error={!!errors.heartRate}
                    helperText={errors.heartRate?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Temperature & Respiratory
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Controller
                  name="temperature"
                  control={control}
                  rules={{
                    min: temperatureUnit === 'F' 
                      ? vitalSignValidations.temperature.min 
                      : { value: 32, message: 'Temperature must be at least 32°C' },
                    max: temperatureUnit === 'F' 
                      ? vitalSignValidations.temperature.max 
                      : { value: 43, message: 'Temperature must be less than 43°C' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Temperature"
                      inputProps={{ step: '0.1' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">°{temperatureUnit}</InputAdornment>,
                      }}
                      error={!!errors.temperature}
                      helperText={errors.temperature?.message}
                    />
                  )}
                />
                <ToggleButtonGroup
                  value={temperatureUnit}
                  exclusive
                  onChange={handleTemperatureUnitChange}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <ToggleButton value="F">°F</ToggleButton>
                  <ToggleButton value="C">°C</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="respiratoryRate"
                control={control}
                rules={{
                  min: vitalSignValidations.respiratoryRate.min,
                  max: vitalSignValidations.respiratoryRate.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Respiratory Rate"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">breaths/min</InputAdornment>
                      ),
                    }}
                    error={!!errors.respiratoryRate}
                    helperText={errors.respiratoryRate?.message || 'Valid range: 5-60'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="oxygenSaturation"
                control={control}
                rules={{
                  min: { value: 0, message: 'SpO2 must be at least 0%' },
                  max: { value: 100, message: 'SpO2 cannot exceed 100%' },
                }}
                render={({ field }) => (
                  <Box>
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Oxygen Saturation (SpO2)"
                      inputProps={{ step: '0.1', min: 0, max: 100 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      error={!!errors.oxygenSaturation || isSpO2Critical}
                      helperText={errors.oxygenSaturation?.message}
                    />
                    {isSpO2Critical && (
                      <Alert severity="error" icon={<WarningIcon />} sx={{ mt: 1 }}>
                        Critical: SpO2 below 90% - Immediate attention required!
                      </Alert>
                    )}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Weight & Height
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="weight"
                control={control}
                rules={{
                  min: vitalSignValidations.weight.min,
                  max: vitalSignValidations.weight.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Weight"
                    inputProps={{ step: '0.1' }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                    }}
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="height"
                control={control}
                rules={{
                  min: vitalSignValidations.height.min,
                  max: vitalSignValidations.height.max,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Height"
                    inputProps={{ step: '0.1' }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">inches</InputAdornment>,
                    }}
                    error={!!errors.height}
                    helperText={errors.height?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {bmi && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Calculated BMI
                  </Typography>
                  <Typography variant="h6">
                    {bmi}{' '}
                    {bmiCategory && (
                      <Chip
                        label={bmiCategory.label}
                        color={bmiCategory.color}
                        size="small"
                      />
                    )}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recording Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="recordedDate"
                  control={control}
                  rules={{ 
                    required: vitalSignValidations.recordedDate.required,
                    validate: (value) => {
                      if (value && dayjs(value).isAfter(dayjs(), 'day')) {
                        return 'Date cannot be in the future';
                      }
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Date *"
                      maxDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.recordedDate,
                          helperText: errors.recordedDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="recordedTime"
                  control={control}
                  rules={{
                    required: vitalSignValidations.recordedTime.required,
                  }}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      label="Time *"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.recordedTime,
                          helperText: errors.recordedTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  rules={{ maxLength: vitalSignValidations.notes.maxLength }}
                  render={({ field }) => (
                    <Box>
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={10}
                        label="Notes"
                        placeholder="Additional notes or observations..."
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
                      />
                      <Typography 
                        variant="caption" 
                        color={notesCharCount > maxNotesLength ? 'error' : 'text.secondary'}
                        sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
                      >
                        {notesCharCount}/{maxNotesLength} characters
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </LocalizationProvider>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={submitting || isBPInvalid}
          >
            {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </form>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to cancel? All changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Continue Editing</Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditVitalSignPage;
