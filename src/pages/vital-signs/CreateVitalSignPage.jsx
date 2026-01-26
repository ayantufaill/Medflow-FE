import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import { patientService } from '../../services/patient.service';
import { appointmentService } from '../../services/appointment.service';
import {
  vitalSignValidations,
  validateAtLeastOneVital,
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';

const CreateVitalSignPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientLoading, setPatientLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('F');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [abnormalConfirmDialogOpen, setAbnormalConfirmDialogOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);
  const [prefilledPatient, setPrefilledPatient] = useState(null);
  const [prefilledAppointment, setPrefilledAppointment] = useState(null);

  const appointmentIdParam = searchParams.get('appointmentId');
  const patientIdParam = searchParams.get('patientId');
  const isPrefilledFromUrl = !!(appointmentIdParam || patientIdParam);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      patientId: '',
      appointmentId: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      temperature: '',
      weight: '',
      height: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      recordedDate: dayjs(),
      recordedTime: dayjs(),
      notes: '',
    },
  });

  const watchedPatientId = watch('patientId');
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
    const initializeData = async () => {
      try {
        setLoading(true);
        const result = await patientService.getAllPatients(1, 50);
        setPatients(result.patients || []);

        if (patientIdParam) {
          const patient = await patientService.getPatientById(patientIdParam);
          if (patient) {
            setPrefilledPatient(patient);
            setValue('patientId', patient._id);
            if (!patients.find(p => p._id === patient._id)) {
              setPatients(prev => [patient, ...prev]);
            }
          }
        }

        if (appointmentIdParam) {
          const appointment = await appointmentService.getAppointmentById(appointmentIdParam);
          if (appointment) {
            setPrefilledAppointment(appointment);
            setValue('appointmentId', appointment._id);
            if (appointment.patientId) {
              const patId = typeof appointment.patientId === 'object' ? appointment.patientId._id : appointment.patientId;
              setValue('patientId', patId);
              const patient = await patientService.getPatientById(patId);
              if (patient) {
                setPrefilledPatient(patient);
                if (!patients.find(p => p._id === patient._id)) {
                  setPatients(prev => [patient, ...prev]);
                }
              }
            }
          }
        }
      } catch (err) {
        showSnackbar('Failed to load initial data', 'error');
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [showSnackbar, patientIdParam, appointmentIdParam, setValue]);

  const debouncedPatientSearch = useDebouncedCallback(async (search) => {
    if (!search || search.length < 2) return;
    try {
      setPatientLoading(true);
      const result = await patientService.getAllPatients(1, 50, search);
      setPatients(result?.patients || []);
    } catch (err) {
      console.error('Failed to search patients', err);
    } finally {
      setPatientLoading(false);
    }
  }, 300);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (watchedPatientId) {
        try {
          setAppointmentLoading(true);
          const result = await appointmentService.getAppointmentsByPatient(watchedPatientId);
          const appointmentsArray = Array.isArray(result) ? result : result?.appointments || [];
          setAppointments(appointmentsArray);
        } catch (err) {
          console.error('Failed to fetch appointments', err);
          setAppointments([]);
        } finally {
          setAppointmentLoading(false);
        }
      } else {
        setAppointments([]);
        setValue('appointmentId', '');
      }
    };
    fetchAppointments();
  }, [watchedPatientId, setValue]);

  const handleCancelClick = () => {
    if (isDirty) {
      setCancelDialogOpen(true);
    } else {
      navigate('/vital-signs');
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    navigate('/vital-signs');
  };

  const checkAbnormalValues = (data) => {
    const abnormalities = [];
    
    let tempInF = data.temperature ? parseFloat(data.temperature) : null;
    if (tempInF && temperatureUnit === 'C') {
      tempInF = (tempInF * 9 / 5) + 32;
    }
    if (tempInF && (tempInF < 95 || tempInF > 100.4)) {
      abnormalities.push(`Temperature: ${data.temperature}°${temperatureUnit} (Normal: 95-100.4°F)`);
    }
    
    const systolic = data.bloodPressureSystolic ? parseInt(data.bloodPressureSystolic) : null;
    const diastolic = data.bloodPressureDiastolic ? parseInt(data.bloodPressureDiastolic) : null;
    if (systolic && diastolic) {
      if (systolic >= 180 || diastolic >= 120) {
        abnormalities.push(`Blood Pressure: ${systolic}/${diastolic} mmHg (Hypertensive Crisis)`);
      }
    }
    
    const heartRate = data.heartRate ? parseInt(data.heartRate) : null;
    if (heartRate && (heartRate < 60 || heartRate > 100)) {
      abnormalities.push(`Heart Rate: ${heartRate} bpm (Normal: 60-100 bpm)`);
    }
    
    const spo2 = data.oxygenSaturation ? parseFloat(data.oxygenSaturation) : null;
    if (spo2 && spo2 < 95) {
      abnormalities.push(`SpO2: ${spo2}% (Normal: ≥95%)`);
    }
    
    const respRate = data.respiratoryRate ? parseInt(data.respiratoryRate) : null;
    if (respRate && (respRate < 12 || respRate > 20)) {
      abnormalities.push(`Respiratory Rate: ${respRate} /min (Normal: 12-20 /min)`);
    }
    
    return abnormalities;
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

    const abnormalities = checkAbnormalValues(data);
    if (abnormalities.length > 0) {
      setPendingSubmitData(data);
      setAbnormalConfirmDialogOpen(true);
      return;
    }

    await submitVitalSigns(data);
  };

  const submitVitalSigns = async (data) => {
    try {
      setSubmitting(true);
      setError('');

      let temperatureInF = data.temperature ? parseFloat(data.temperature) : undefined;
      if (temperatureInF && temperatureUnit === 'C') {
        temperatureInF = parseFloat(((temperatureInF * 9 / 5) + 32).toFixed(1));
      }

      const vitalSignData = {
        patientId: data.patientId,
        appointmentId: data.appointmentId,
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
        recordedDate: data.recordedDate ? data.recordedDate.toISOString() : new Date().toISOString(),
        recordedTime: data.recordedTime ? data.recordedTime.format('HH:mm') : undefined,
        notes: data.notes || undefined,
      };

      await vitalSignService.createVitalSign(vitalSignData);
      showSnackbar('Vital signs recorded successfully', 'success');
      navigate(`/patients/${data.patientId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to record vital signs';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmAbnormal = async () => {
    setAbnormalConfirmDialogOpen(false);
    if (pendingSubmitData) {
      await submitVitalSigns(pendingSubmitData);
      setPendingSubmitData(null);
    }
  };

  const handleCancelAbnormal = () => {
    setAbnormalConfirmDialogOpen(false);
    setPendingSubmitData(null);
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Record Vital Signs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Record patient vital signs for an appointment
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
            Patient & Appointment
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="patientId"
                control={control}
                rules={{ required: vitalSignValidations.patientId.required }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={patients.find(p => p._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input' && !isPrefilledFromUrl) {
                        debouncedPatientSearch(newInputValue);
                      }
                    }}
                    options={patients}
                    loading={patientLoading}
                    disabled={!!prefilledPatient}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient *"
                        placeholder="Type to search patients..."
                        error={!!errors.patientId}
                        helperText={errors.patientId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {patientLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="appointmentId"
                control={control}
                rules={{ required: vitalSignValidations.appointmentId.required }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={appointments.find(a => a._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    options={appointments}
                    loading={appointmentLoading}
                    disabled={!watchedPatientId || !!prefilledAppointment}
                    getOptionLabel={(option) => `${new Date(option.appointmentDate).toLocaleDateString()} - ${option.startTime || 'N/A'}`}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    noOptionsText={!watchedPatientId ? 'Select a patient first' : 'No appointments found'}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Appointment"
                        error={!!errors.appointmentId}
                        helperText={errors.appointmentId?.message || (!watchedPatientId ? 'Select a patient first' : '')}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {appointmentLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Blood Pressure & Heart Rate
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ mt: 1 }}>
                {isBPInvalid && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    Systolic must be higher than Diastolic
                  </Alert>
                )}
                {bpCategory ? (
                  <Chip
                    label={bpCategory.label}
                    color={bpCategory.color}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Enter BP values to see category
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
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
                      error={!!errors.oxygenSaturation}
                      helperText={errors.oxygenSaturation?.message}
                    />
                    {isSpO2Critical && (
                      <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 1 }}>
                        Warning: SpO2 below 90% - Patient requires immediate attention!
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
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="recordedTime"
                  control={control}
                  rules={{
                    required: vitalSignValidations.recordedTime.required,
                    validate: (value) => {
                      const recordedDate = watch('recordedDate');
                      if (recordedDate && dayjs(recordedDate).isSame(dayjs(), 'day')) {
                        if (value && dayjs(value).isAfter(dayjs())) {
                          return 'Time cannot be in the future';
                        }
                      }
                      return true;
                    }
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
              <Grid size={12}>
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
            {submitting ? <CircularProgress size={24} /> : 'Record Vitals'}
          </Button>
        </Box>
      </form>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to cancel? All entered data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Continue Editing</Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={abnormalConfirmDialogOpen} onClose={handleCancelAbnormal}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Abnormal Values Detected
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            One or more vital sign values are outside the normal range:
          </DialogContentText>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {pendingSubmitData && checkAbnormalValues(pendingSubmitData).map((item, index) => (
              <Typography component="li" key={index} variant="body2" color="warning.main" sx={{ mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Box>
          <DialogContentText sx={{ mt: 2 }}>
            Do you wish to proceed with recording these values?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAbnormal}>Go Back</Button>
          <Button onClick={handleConfirmAbnormal} color="warning" variant="contained">
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateVitalSignPage;
