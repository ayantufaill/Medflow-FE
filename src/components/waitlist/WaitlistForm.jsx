import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { waitlistValidations } from '../../validations/waitlistValidations';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';
import { appointmentTypeService } from '../../services/appointment-type.service';

const WaitlistForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [patientInputValue, setPatientInputValue] = useState('');
  const [providerInputValue, setProviderInputValue] = useState('');
  const [typeInputValue, setTypeInputValue] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const searchPatients = useDebouncedCallback(async (searchTerm) => {
    try {
      setLoadingPatients(true);
      const result = await patientService.getAllPatients(1, 20, searchTerm, 'active');
      setPatients(result.patients || []);
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  }, 300);

  const searchProviders = useDebouncedCallback(async (searchTerm) => {
    try {
      setLoadingProviders(true);
      const result = await providerService.getAllProviders(1, 20, searchTerm, true);
      setProviders(result.providers || []);
    } catch (err) {
      console.error('Error searching providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  }, 300);

  const searchTypes = useDebouncedCallback(async (searchTerm) => {
    try {
      setLoadingTypes(true);
      const result = await appointmentTypeService.getAllAppointmentTypes(1, 20, searchTerm, true);
      setAppointmentTypes(result.appointmentTypes || []);
    } catch (err) {
      console.error('Error searching appointment types:', err);
    } finally {
      setLoadingTypes(false);
    }
  }, 300);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        const [patientsResult, providersResult, typesResult] =
          await Promise.all([
            patientService.getAllPatients(1, 20, '', 'active'),
            providerService.getAllProviders(1, 20, '', true),
            appointmentTypeService.getAllAppointmentTypes(1, 20, '', true),
          ]);
        setPatients(patientsResult.patients || []);
        setProviders(providersResult.providers || []);
        setAppointmentTypes(typesResult.appointmentTypes || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: initialData || {
      patientId: '',
      providerId: '',
      appointmentTypeId: '',
      preferredDate: null,
      preferredTimeStart: null,
      preferredTimeEnd: null,
      priority: 'normal',
      status: 'active',
      notes: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      const parseTime = (timeString) => {
        if (!timeString) return null;
        try {
          if (dayjs.isDayjs(timeString)) {
            return timeString.isValid() ? timeString : null;
          }
          if (typeof timeString === 'string') {
            const [hours, minutes] = timeString.split(':');
            if (hours && minutes) {
              const parsed = dayjs()
                .hour(parseInt(hours, 10))
                .minute(parseInt(minutes, 10));
              return parsed.isValid() ? parsed : null;
            }
          }
          return null;
        } catch {
          return null;
        }
      };

      const parseDate = (dateValue) => {
        if (!dateValue) return null;
        try {
          if (dayjs.isDayjs(dateValue)) {
            return dateValue.isValid() ? dateValue : null;
          }
          const parsed = dayjs(dateValue);
          return parsed.isValid() ? parsed : null;
        } catch {
          return null;
        }
      };

      if (initialData.patientId && typeof initialData.patientId === 'object') {
        setSelectedPatient(initialData.patientId);
      }
      if (initialData.providerId && typeof initialData.providerId === 'object') {
        setSelectedProvider(initialData.providerId);
      }
      if (initialData.appointmentTypeId && typeof initialData.appointmentTypeId === 'object') {
        setSelectedType(initialData.appointmentTypeId);
      }

      reset({
        patientId: initialData.patientId?._id || initialData.patientId || '',
        providerId: initialData.providerId?._id || initialData.providerId || '',
        appointmentTypeId:
          initialData.appointmentTypeId?._id ||
          initialData.appointmentTypeId ||
          '',
        preferredDate: parseDate(initialData.preferredDate),
        preferredTimeStart: parseTime(initialData.preferredTimeStart),
        preferredTimeEnd: parseTime(initialData.preferredTimeEnd),
        priority: initialData.priority || 'normal',
        status: initialData.status || 'active',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const handleFormSubmit = (formData) => {
    const formatTime = (timeValue) => {
      if (!timeValue) return '';
      if (typeof timeValue === 'string') return timeValue;
      return timeValue.format('HH:mm');
    };

    const sanitizedData = {
      ...formData,
      preferredDate: formData.preferredDate
        ? formData.preferredDate.format('YYYY-MM-DD')
        : undefined,
      preferredTimeStart: formatTime(formData.preferredTimeStart) || undefined,
      preferredTimeEnd: formatTime(formData.preferredTimeEnd) || undefined,
      notes: sanitizeValue(formData.notes) || undefined,
    };

    onSubmit(sanitizedData);
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        id={formId}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="patientId"
              control={control}
              rules={waitlistValidations.patientId}
              render={({ field }) => (
                <Autocomplete
                  disabled={isEditMode}
                  options={patients}
                  getOptionLabel={(option) =>
                    option ? `${option.firstName} ${option.lastName} (${option.patientCode})` : ''
                  }
                  value={selectedPatient}
                  onChange={(_, newValue) => {
                    setSelectedPatient(newValue);
                    field.onChange(newValue?._id || newValue?.id || '');
                  }}
                  inputValue={patientInputValue}
                  onInputChange={(_, newInputValue) => {
                    setPatientInputValue(newInputValue);
                    if (newInputValue) {
                      searchPatients(newInputValue);
                    }
                  }}
                  onBlur={() => {
                    searchPatients('');
                  }}
                  isOptionEqualToValue={(option, value) =>
                    (option._id || option.id) === (value._id || value.id)
                  }
                  loading={loadingPatients}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient *"
                      error={!!errors.patientId}
                      helperText={errors.patientId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingPatients ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="Type to search patients..."
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="providerId"
              control={control}
              rules={waitlistValidations.providerId}
              render={({ field }) => (
                <Autocomplete
                  options={providers}
                  getOptionLabel={(option) =>
                    option ? `${option.userId?.firstName || ''} ${option.userId?.lastName || ''} (${option.providerCode})` : ''
                  }
                  value={selectedProvider}
                  onChange={(_, newValue) => {
                    setSelectedProvider(newValue);
                    field.onChange(newValue?._id || newValue?.id || '');
                  }}
                  inputValue={providerInputValue}
                  onInputChange={(_, newInputValue) => {
                    setProviderInputValue(newInputValue);
                    if (newInputValue) {
                      searchProviders(newInputValue);
                    }
                  }}
                  onBlur={() => {
                    searchProviders('');
                  }}
                  isOptionEqualToValue={(option, value) =>
                    (option._id || option.id) === (value._id || value.id)
                  }
                  loading={loadingProviders}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider *"
                      error={!!errors.providerId}
                      helperText={errors.providerId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingProviders ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="Type to search providers..."
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="appointmentTypeId"
              control={control}
              rules={waitlistValidations.appointmentTypeId}
              render={({ field }) => (
                <Autocomplete
                  options={appointmentTypes}
                  getOptionLabel={(option) => option?.name || ''}
                  value={selectedType}
                  onChange={(_, newValue) => {
                    setSelectedType(newValue);
                    field.onChange(newValue?._id || newValue?.id || '');
                  }}
                  inputValue={typeInputValue}
                  onInputChange={(_, newInputValue) => {
                    setTypeInputValue(newInputValue);
                    if (newInputValue) {
                      searchTypes(newInputValue);
                    }
                  }}
                  onBlur={() => {
                    searchTypes('');
                  }}
                  isOptionEqualToValue={(option, value) =>
                    (option._id || option.id) === (value._id || value.id)
                  }
                  loading={loadingTypes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Appointment Type *"
                      error={!!errors.appointmentTypeId}
                      helperText={errors.appointmentTypeId?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingTypes ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="Type to search appointment types..."
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="preferredDate"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true; // Optional field
                  
                  let dateValue = null;
                  if (dayjs.isDayjs(value)) {
                    dateValue = value;
                  } else if (typeof value === 'string' || value instanceof Date) {
                    dateValue = dayjs(value);
                  }
                  
                  if (dateValue && dateValue.isValid()) {
                    const today = dayjs().startOf('day');
                    if (dateValue.isBefore(today)) {
                      return 'Preferred date cannot be in the past';
                    }
                  }
                  
                  return true;
                },
              }}
              render={({ field }) => {
                // Ensure value is always a dayjs object or null
                let dateValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    dateValue = field.value.isValid() ? field.value : null;
                  } else if (
                    typeof field.value === 'string' ||
                    field.value instanceof Date
                  ) {
                    const parsed = dayjs(field.value);
                    dateValue = parsed.isValid() ? parsed : null;
                  }
                }
                return (
                  <DatePicker
                    label="Preferred Date"
                    value={dateValue}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      // Clear error if date is valid
                      if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
                        const today = dayjs().startOf('day');
                        if (!newValue.isBefore(today)) {
                          // Date is valid, errors will be cleared by react-hook-form
                        }
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.preferredDate,
                        helperText: errors.preferredDate?.message,
                      },
                    }}
                    minDate={dayjs()}
                    disablePast
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="preferredTimeStart"
              control={control}
              rules={waitlistValidations.preferredTimeStart}
              render={({ field }) => {
                // Ensure value is always a dayjs object or null
                let timeValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    timeValue = field.value.isValid() ? field.value : null;
                  } else if (typeof field.value === 'string') {
                    // Parse time string (HH:mm format)
                    const [hours, minutes] = field.value.split(':');
                    if (hours && minutes) {
                      const parsed = dayjs()
                        .hour(parseInt(hours, 10))
                        .minute(parseInt(minutes, 10));
                      timeValue = parsed.isValid() ? parsed : null;
                    }
                  }
                }
                return (
                  <TimePicker
                    label="Preferred Start Time"
                    value={timeValue}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.preferredTimeStart,
                        helperText: errors.preferredTimeStart?.message,
                      },
                    }}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="preferredTimeEnd"
              control={control}
              rules={waitlistValidations.preferredTimeEnd}
              render={({ field }) => {
                // Ensure value is always a dayjs object or null
                let timeValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    timeValue = field.value.isValid() ? field.value : null;
                  } else if (typeof field.value === 'string') {
                    // Parse time string (HH:mm format)
                    const [hours, minutes] = field.value.split(':');
                    if (hours && minutes) {
                      const parsed = dayjs()
                        .hour(parseInt(hours, 10))
                        .minute(parseInt(minutes, 10));
                      timeValue = parsed.isValid() ? parsed : null;
                    }
                  }
                }
                return (
                  <TimePicker
                    label="Preferred End Time"
                    value={timeValue}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.preferredTimeEnd,
                        helperText: errors.preferredTimeEnd?.message,
                      },
                    }}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                rules={waitlistValidations.priority}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'normal'}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="flexible">Flexible</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={waitlistValidations.status}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'active'}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="called">Called</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              {...register('notes', waitlistValidations.notes)}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          </Grid>
          {!hideButtons && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={loading}
                >
                  {loading
                    ? 'Saving...'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Add to Waitlist'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default WaitlistForm;
