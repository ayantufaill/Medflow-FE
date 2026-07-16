import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  GlobalStyles,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Favorite as HeartIcon, 
  Warning as WarningIcon,
  Person as PersonIcon,
  MonitorHeart as MonitorHeartIcon,
  Thermostat as ThermostatIcon,
  Scale as ScaleIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { appointmentService } from '../../services/appointment.service';
import { vitalSignService } from '../../services/vital-sign.service';
import { useCreateVitalSign, useUpdateVitalSign } from '../../hooks/queries/useVitalSigns';
import {
  vitalSignValidations,
  validateAtLeastOneVital,
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from '../../validations/vitalSignValidations';

const FORM_ID = 'record-vitals-dialog-form';

const Label = ({ children, required }) => (
  <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', letterSpacing: '0px', color: '#4b5563', display: 'block', mb: 0.5 }}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

const sharedInputSx = {
  borderRadius: '8px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DB',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
  },
  '&.MuiAutocomplete-inputRoot': {
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  '& .MuiInputBase-input, & .MuiAutocomplete-input': {
    padding: '10px 14px !important',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
  },
  '& .MuiInputBase-input::placeholder, & .MuiAutocomplete-input::placeholder': {
    color: '#9CA3AF',
    opacity: 1,
  },
};

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

const RecordVitalsDialog = ({ open, onClose, patientId, onSaved, editingVitalSignId }) => {
  const { showSnackbar } = useSnackbar();
  const [patients, setPatients] = useState([]);
  const [patientLoading, setPatientLoading] = useState(false);
  const [prefilledPatient, setPrefilledPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('F');
  const [error, setError] = useState('');
  
  const [abnormalConfirmDialogOpen, setAbnormalConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      patientId: patientId || '',
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

  useEffect(() => {
    if (open && !editingVitalSignId) {
      reset({
        patientId: patientId || '',
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
      });
      setError('');
      setTemperatureUnit('F');
    }
  }, [open, patientId, reset, editingVitalSignId]);

  useEffect(() => {
    const fetchEditingData = async () => {
      if (editingVitalSignId && open) {
        try {
          const data = await vitalSignService.getVitalSignById(editingVitalSignId);
          reset({
            patientId: data.patientId?._id || data.patientId || '',
            appointmentId: data.appointmentId?._id || data.appointmentId || '',
            bloodPressureSystolic: data.bloodPressureSystolic || '',
            bloodPressureDiastolic: data.bloodPressureDiastolic || '',
            temperature: data.temperature || '',
            weight: data.weight || '',
            height: data.height || '',
            heartRate: data.heartRate || '',
            respiratoryRate: data.respiratoryRate || '',
            oxygenSaturation: data.oxygenSaturation || '',
            recordedDate: dayjs(data.recordedDate),
            recordedTime: data.recordedTime ? dayjs(`2000-01-01T${data.recordedTime}`) : dayjs(),
            notes: data.notes || '',
          });
        } catch (err) {
          console.error("Failed to fetch vital sign for editing", err);
          showSnackbar("Failed to load record for editing", "error");
        }
      }
    };
    fetchEditingData();
  }, [editingVitalSignId, open, reset, showSnackbar]);

  const watchedPatientId = watch('patientId');

  useEffect(() => {
    const initializeData = async () => {
      if (!open) return;
      try {
        setPatientLoading(true);
        const result = await patientService.getAllPatients(1, 50);
        setPatients(result?.patients || []);

        if (patientId) {
          const patient = await patientService.getPatientById(patientId);
          if (patient) {
            setPrefilledPatient(patient);
            setValue('patientId', patient._id);
            setPatients((prev) => {
              if (!prev.find(p => p._id === patient._id)) {
                return [patient, ...prev];
              }
              return prev;
            });
          }
        } else {
          setPrefilledPatient(null);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setPatientLoading(false);
      }
    };
    initializeData();
  }, [open, patientId, setValue]);

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
      if (watchedPatientId && open) {
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
  }, [watchedPatientId, open, setValue]);

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

  const systolicNum = watchedSystolic ? parseInt(watchedSystolic, 10) : null;
  const diastolicNum = watchedDiastolic ? parseInt(watchedDiastolic, 10) : null;
  const isBPInvalid = systolicNum !== null && diastolicNum !== null && !isNaN(systolicNum) && !isNaN(diastolicNum) && systolicNum <= diastolicNum;
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

  const { mutateAsync: createVitalSign, isPending: isCreating } = useCreateVitalSign();
  const { mutateAsync: updateVitalSign, isPending: isUpdating } = useUpdateVitalSign();
  const submitting = isCreating || isUpdating;

  const submitVitalSigns = async (data) => {
    try {
      setError('');

      let temperatureInF = data.temperature ? parseFloat(data.temperature) : undefined;
      if (temperatureInF && temperatureUnit === 'C') {
        temperatureInF = parseFloat(((temperatureInF * 9 / 5) + 32).toFixed(1));
      }

      const vitalSignData = {
        patientId: data.patientId,
        appointmentId: data.appointmentId || undefined,
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

      if (editingVitalSignId) {
        await updateVitalSign({ id: editingVitalSignId, data: vitalSignData });
        showSnackbar('Vital signs updated successfully', 'success');
      } else {
        await createVitalSign(vitalSignData);
        showSnackbar('Vital signs recorded successfully', 'success');
      }
      onClose();
      if (onSaved) onSaved();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to record vital signs';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    }
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

  const handleCancelClick = () => {
    if (isDirty) {
      setCancelDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    onClose();
  };

  return (
    <>
      <GlobalStyles styles={{ '.MuiPopover-root': { zIndex: '10000 !important' } }} />
      <Dialog
        open={open}
        onClose={submitting ? undefined : onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden' } }}
        sx={{ zIndex: 10000 }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#F1F5FD',
            color: '#111',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <HeartIcon sx={{ color: '#2563EB', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
                {editingVitalSignId ? 'Edit Vitals' : 'Record Vitals'}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
                {editingVitalSignId ? 'Update the patient\'s vital signs' : 'Enter the patient\'s vital signs manually'}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }} disabled={submitting}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate>
              
              <SectionContainer title="Patient & Appointment" icon={PersonIcon}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="patientId"
                      control={control}
                      rules={{ required: vitalSignValidations.patientId.required }}
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Label required>Patient</Label>
                          <Autocomplete
                            fullWidth
                            value={patients.find(p => String(p._id || p.id) === String(value)) || null}
                            onChange={(event, newValue) => {
                              onChange(newValue?._id || newValue?.id || '');
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                              if (reason === 'input' && !patientId) {
                                debouncedPatientSearch(newInputValue);
                              }
                            }}
                            options={patients}
                            loading={patientLoading}
                            disabled={!!prefilledPatient}
                            getOptionLabel={(option) => {
                              if (!option) return '';
                              return `${option.firstName || ''} ${option.lastName || ''}`.trim();
                            }}
                            isOptionEqualToValue={(option, val) => String(option._id || option.id) === String(val?._id || val?.id)}
                            disablePortal
                            ListboxProps={{
                              sx: {
                                fontFamily: 'Inter',
                                fontSize: '0.875rem'
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                placeholder="Type to search patients..."
                                error={!!errors.patientId}
                                helperText={errors.patientId?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  sx: sharedInputSx,
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
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="appointmentId"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Label>Associated Appointment (Optional)</Label>
                          <Autocomplete
                            fullWidth
                            value={appointments.find(a => String(a._id || a.id) === String(value)) || null}
                            onChange={(event, newValue) => {
                              onChange(newValue?._id || newValue?.id || '');
                            }}
                            options={appointments}
                            loading={appointmentLoading}
                            disabled={!watchedPatientId}
                            getOptionLabel={(option) => {
                              if (!option) return '';
                              const dateStr = option.appointmentDate || option.date;
                              const dateDisplay = (dateStr && !isNaN(new Date(dateStr).getTime())) ? new Date(dateStr).toLocaleDateString() : 'No Date';
                              return `${dateDisplay} - ${option.startTime || 'N/A'}`;
                            }}
                            isOptionEqualToValue={(option, val) => String(option._id || option.id) === String(val?._id || val?.id)}
                            disablePortal
                            noOptionsText={
                              <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#6B7280', p: 1 }}>
                                {!watchedPatientId ? 'Select a patient first' : 'No appointments found'}
                              </Typography>
                            }
                            ListboxProps={{
                              sx: {
                                fontFamily: 'Inter',
                                fontSize: '0.875rem'
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                placeholder="Select an appointment"
                                error={!!errors.appointmentId}
                                helperText={errors.appointmentId?.message || (!watchedPatientId ? 'Select a patient first' : '')}
                                InputProps={{
                                  ...params.InputProps,
                                  sx: sharedInputSx,
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
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Blood Pressure & Heart Rate" icon={MonitorHeartIcon}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="bloodPressureSystolic"
                      control={control}
                      rules={{ min: vitalSignValidations.bloodPressureSystolic.min, max: vitalSignValidations.bloodPressureSystolic.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Systolic BP</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Systolic"
                            InputProps={{ endAdornment: <InputAdornment position="end">mmHg</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.bloodPressureSystolic}
                            helperText={errors.bloodPressureSystolic?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="bloodPressureDiastolic"
                      control={control}
                      rules={{ min: vitalSignValidations.bloodPressureDiastolic.min, max: vitalSignValidations.bloodPressureDiastolic.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Diastolic BP</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Diastolic"
                            InputProps={{ endAdornment: <InputAdornment position="end">mmHg</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.bloodPressureDiastolic}
                            helperText={errors.bloodPressureDiastolic?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="heartRate"
                      control={control}
                      rules={{ min: vitalSignValidations.heartRate.min, max: vitalSignValidations.heartRate.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Heart Rate</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Heart Rate"
                            InputProps={{ endAdornment: <InputAdornment position="end">bpm</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.heartRate}
                            helperText={errors.heartRate?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box>
                      {isBPInvalid && (
                        <Alert severity="error" sx={{ mb: 1, py: 0 }}>Systolic must be higher than Diastolic</Alert>
                      )}
                      {bpCategory && (
                        <Chip label={bpCategory.label} color={bpCategory.color} size="small" />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Temperature & Respiratory" icon={ThermostatIcon}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Controller
                        name="temperature"
                        control={control}
                        rules={{
                          min: temperatureUnit === 'F' ? vitalSignValidations.temperature.min : { value: 32, message: 'Temperature must be at least 32°C' },
                          max: temperatureUnit === 'F' ? vitalSignValidations.temperature.max : { value: 43, message: 'Temperature must be less than 43°C' },
                        }}
                        render={({ field }) => (
                          <Box sx={{ flexGrow: 1 }}>
                            <Label>Temperature</Label>
                            <TextField
                              {...field}
                              fullWidth
                              type="number"
                              placeholder="Enter Temperature"
                              inputProps={{ step: '0.1' }}
                              InputProps={{ endAdornment: <InputAdornment position="end">°{temperatureUnit}</InputAdornment>, sx: sharedInputSx }}
                              error={!!errors.temperature}
                              helperText={errors.temperature?.message}
                            />
                          </Box>
                        )}
                      />
                      <ToggleButtonGroup value={temperatureUnit} exclusive onChange={handleTemperatureUnitChange} size="small" sx={{ mt: '23px', height: '39px' }}>
                        <ToggleButton value="F" sx={{ textTransform: 'none', px: 1.5 }}>°F</ToggleButton>
                        <ToggleButton value="C" sx={{ textTransform: 'none', px: 1.5 }}>°C</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="respiratoryRate"
                      control={control}
                      rules={{ min: vitalSignValidations.respiratoryRate.min, max: vitalSignValidations.respiratoryRate.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Respiratory Rate</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Rate"
                            InputProps={{ endAdornment: <InputAdornment position="end">breaths/min</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.respiratoryRate}
                            helperText={errors.respiratoryRate?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="oxygenSaturation"
                      control={control}
                      rules={{ min: { value: 0, message: 'SpO2 must be at least 0%' }, max: { value: 100, message: 'SpO2 cannot exceed 100%' } }}
                      render={({ field }) => (
                        <Box>
                          <Label>SpO2</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter SpO2"
                            inputProps={{ step: '0.1', min: 0, max: 100 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.oxygenSaturation}
                            helperText={errors.oxygenSaturation?.message}
                          />
                          {isSpO2Critical && (
                            <Typography variant="caption" color="error">Critical SpO2!</Typography>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </SectionContainer>

              <SectionContainer title="Weight & Height" icon={ScaleIcon}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="weight"
                      control={control}
                      rules={{ min: vitalSignValidations.weight.min, max: vitalSignValidations.weight.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Weight</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Weight"
                            inputProps={{ step: '0.1' }}
                            InputProps={{ endAdornment: <InputAdornment position="end">lbs</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.weight}
                            helperText={errors.weight?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="height"
                      control={control}
                      rules={{ min: vitalSignValidations.height.min, max: vitalSignValidations.height.max }}
                      render={({ field }) => (
                        <Box>
                          <Label>Height</Label>
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            placeholder="Enter Height"
                            inputProps={{ step: '0.1' }}
                            InputProps={{ endAdornment: <InputAdornment position="end">in</InputAdornment>, sx: sharedInputSx }}
                            error={!!errors.height}
                            helperText={errors.height?.message}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  {bmi && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Calculated BMI: <strong>{bmi}</strong></Typography>
                        {bmiCategory && <Chip label={bmiCategory.label} color={bmiCategory.color} size="small" />}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </SectionContainer>

              <SectionContainer title="Recording Details" icon={EventNoteIcon}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="recordedDate"
                      control={control}
                      rules={{ 
                        required: vitalSignValidations.recordedDate.required,
                        validate: (value) => (value && dayjs(value).isAfter(dayjs(), 'day') ? 'Date cannot be in the future' : true)
                      }}
                      render={({ field }) => (
                        <Box>
                          <Label required>Date</Label>
                          <DatePicker
                            {...field}
                            maxDate={dayjs()}
                            slotProps={{ textField: { fullWidth: true, placeholder: 'Select Date', error: !!errors.recordedDate, helperText: errors.recordedDate?.message, InputProps: { sx: sharedInputSx } } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="recordedTime"
                      control={control}
                      rules={{
                        required: vitalSignValidations.recordedTime.required,
                        validate: (value) => {
                          const recordedDate = watch('recordedDate');
                          if (recordedDate && dayjs(recordedDate).isSame(dayjs(), 'day') && value && dayjs(value).isAfter(dayjs())) {
                            return 'Time cannot be in the future';
                          }
                          return true;
                        }
                      }}
                      render={({ field }) => (
                        <Box>
                          <Label required>Time</Label>
                          <TimePicker
                            {...field}
                            slotProps={{ textField: { fullWidth: true, placeholder: 'Select Time', error: !!errors.recordedTime, helperText: errors.recordedTime?.message, InputProps: { sx: sharedInputSx } } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="notes"
                      control={control}
                      rules={{ maxLength: vitalSignValidations.notes.maxLength }}
                      render={({ field }) => (
                        <Box>
                          <Label>Notes (Optional)</Label>
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={10}
                            placeholder="Additional notes or observations..."
                            InputProps={{ sx: { ...sharedInputSx, '& .MuiInputBase-input': { padding: '0px', ...sharedInputSx['& .MuiInputBase-input'] } } }}
                            error={!!errors.notes}
                            helperText={errors.notes?.message}
                          />
                          <Typography variant="caption" color={notesCharCount > maxNotesLength ? 'error' : 'text.secondary'} sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                            {notesCharCount}/{maxNotesLength} characters
                          </Typography>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </SectionContainer>

            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          backgroundColor: '#F9FAFB', 
          borderTop: '1px solid #E5E7EB', 
          gap: 1.5,
          justifyContent: 'flex-end'
        }}>
          <Button 
            onClick={handleCancelClick} 
            disabled={submitting} 
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
            Cancel
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            variant="contained"
            disabled={submitting || Boolean(isBPInvalid)}
            startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
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
            {submitting ? 'Saving...' : editingVitalSignId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={abnormalConfirmDialogOpen} 
        onClose={handleCancelAbnormal} 
        sx={{ zIndex: 10001 }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: '#111827' }}>
          <WarningIcon sx={{ color: '#F59E0B', width: 24, height: 24 }} />
          Abnormal Values Detected
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563', mb: 2 }}>
            One or more vital sign values are outside the normal range:
          </DialogContentText>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 3 }}>
            {pendingSubmitData && checkAbnormalValues(pendingSubmitData).map((item, index) => (
              <Typography component="li" key={index} variant="body2" sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#D97706', mb: 1, fontWeight: 500 }}>
                {item}
              </Typography>
            ))}
          </Box>
          <DialogContentText sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            Do you wish to proceed with recording these values?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelAbnormal}
            variant="outlined"
            sx={{
              fontFamily: 'Inter',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              borderColor: '#D1D5DB',
              color: '#374151',
              px: 2,
              '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }
            }}
          >
            Go Back
          </Button>
          <Button 
            onClick={handleConfirmAbnormal} 
            variant="contained"
            sx={{
              fontFamily: 'Inter',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
              boxShadow: 'none',
              px: 2.5,
              '&:hover': { backgroundColor: '#D97706', boxShadow: 'none' }
            }}
          >
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => setCancelDialogOpen(false)} 
        sx={{ zIndex: 10001 }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', color: '#111827' }}>
          Discard Changes?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563', mt: 1 }}>
            You have unsaved changes. Are you sure you want to cancel? All entered data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setCancelDialogOpen(false)}
            variant="outlined"
            sx={{
              fontFamily: 'Inter',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              borderColor: '#D1D5DB',
              color: '#374151',
              px: 2,
              '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }
            }}
          >
            Continue Editing
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            variant="contained"
            sx={{
              fontFamily: 'Inter',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              boxShadow: 'none',
              px: 2.5,
              '&:hover': { backgroundColor: '#DC2626', boxShadow: 'none' }
            }}
          >
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecordVitalsDialog;
