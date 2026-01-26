import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
  Tooltip,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { Info as InfoIcon, Save as SaveIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { providerValidations } from '../../validations/providerValidations';
import { userService } from '../../services/user.service';
import { providerService } from '../../services/provider.service';

const ProviderForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
  externalUsers = null,
}) => {
  const [users, setUsers] = useState(externalUsers || []);
  const [usersLoading, setUsersLoading] = useState(externalUsers === null);
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const userSearchTimerRef = useRef(null);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const specialtySearchTimerRef = useRef(null);

  const searchUsers = useCallback(async (search = '') => {
    try {
      setUsersLoading(true);
      const result = await userService.getUsersByRoleName(
        'Doctor',
        1,
        20,
        'active',
        !isEditMode,
        search
      );
      setUsers(result.users || []);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (externalUsers !== null) {
      setUsers(externalUsers);
      setUsersLoading(false);
      return;
    }

    searchUsers('');
  }, [isEditMode, externalUsers, searchUsers]);

  const searchSpecialties = useCallback(async (search = '') => {
    try {
      setSpecialtiesLoading(true);
      const result = await providerService.getSpecialties();
      const specialtiesList = result.specialties || [];
      if (search) {
        const filtered = specialtiesList.filter(s => 
          s.toLowerCase().includes(search.toLowerCase())
        );
        setSpecialties(filtered);
      } else {
        setSpecialties(specialtiesList);
      }
    } catch (err) {
      console.error('Error searching specialties:', err);
    } finally {
      setSpecialtiesLoading(false);
    }
  }, []);

  useEffect(() => {
    searchSpecialties('');
  }, [searchSpecialties]);

  // Helper function to parse time string to dayjs
  const parseTime = (timeString) => {
    if (!timeString) return null;
    if (dayjs.isDayjs(timeString)) return timeString;
    return dayjs(timeString, 'HH:mm');
  };

  const normalizeSpecialtyValue = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      const trimmed = value
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .filter((v) => v.length > 0);
      return Array.from(new Set(trimmed));
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    }

    return [];
  };

  // Convert backend workingHours array to frontend format (object with day keys)
  const convertWorkingHoursToFormFormat = (workingHours) => {
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };

    const formFormat = {
      monday: { startTime: null, endTime: null, isAvailable: false },
      tuesday: { startTime: null, endTime: null, isAvailable: false },
      wednesday: { startTime: null, endTime: null, isAvailable: false },
      thursday: { startTime: null, endTime: null, isAvailable: false },
      friday: { startTime: null, endTime: null, isAvailable: false },
      saturday: { startTime: null, endTime: null, isAvailable: false },
      sunday: { startTime: null, endTime: null, isAvailable: false },
    };

    if (workingHours && Array.isArray(workingHours)) {
      workingHours.forEach((wh) => {
        const dayKey = dayMap[wh.dayOfWeek];
        if (dayKey && wh.isAvailable !== false && wh.startTime && wh.endTime) {
          formFormat[dayKey] = {
            startTime: parseTime(wh.startTime),
            endTime: parseTime(wh.endTime),
            isAvailable: true,
          };
        }
      });
    }

    return formFormat;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    defaultValues: initialData
      ? {
          userId: initialData.userId?._id || initialData.userId || '',
          npiNumber: initialData.npiNumber || '',
          licenseNumber: initialData.licenseNumber || '',
          specialty: normalizeSpecialtyValue(initialData.specialty),
          title: initialData.title || 'MD',
          appointmentBufferMinutes: initialData.appointmentBufferMinutes || 15,
          maxDailyAppointments: initialData.maxDailyAppointments || '',
          consultationFee: initialData.consultationFee || '',
          isAcceptingNewPatients: initialData.isAcceptingNewPatients !== false,
          telehealthEnabled: initialData.telehealthEnabled || false,
          isActive: initialData.isActive !== false,
          workingHours: convertWorkingHoursToFormFormat(
            initialData.workingHours
          ),
        }
      : {
          userId: '',
          npiNumber: '',
          licenseNumber: '',
          specialty: [],
          title: 'MD',
          appointmentBufferMinutes: 15,
          maxDailyAppointments: '',
          consultationFee: '',
          isAcceptingNewPatients: true,
          telehealthEnabled: false,
          isActive: true,
          workingHours: {
            monday: { startTime: parseTime('09:00'), endTime: parseTime('17:00'), isAvailable: true },
            tuesday: { startTime: parseTime('09:00'), endTime: parseTime('17:00'), isAvailable: true },
            wednesday: { startTime: parseTime('09:00'), endTime: parseTime('17:00'), isAvailable: true },
            thursday: { startTime: parseTime('09:00'), endTime: parseTime('17:00'), isAvailable: true },
            friday: { startTime: parseTime('09:00'), endTime: parseTime('17:00'), isAvailable: true },
            saturday: { startTime: null, endTime: null, isAvailable: false },
            sunday: { startTime: null, endTime: null, isAvailable: false },
          },
        },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        userId: initialData.userId?._id || initialData.userId || '',
        npiNumber: initialData.npiNumber || '',
        licenseNumber: initialData.licenseNumber || '',
        specialty: normalizeSpecialtyValue(initialData.specialty),
        title: initialData.title || 'MD',
        appointmentBufferMinutes: initialData.appointmentBufferMinutes || 15,
        maxDailyAppointments: initialData.maxDailyAppointments || '',
        consultationFee: initialData.consultationFee || '',
        isAcceptingNewPatients: initialData.isAcceptingNewPatients !== false,
        telehealthEnabled: initialData.telehealthEnabled || false,
        isActive: initialData.isActive !== false,
        workingHours: convertWorkingHoursToFormFormat(initialData.workingHours),
      });
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const sanitizeSpecialty = (value) => {
    const list = normalizeSpecialtyValue(value)
      .map((v) => sanitizeValue(v))
      .filter((v) => typeof v === 'string' && v.length > 0);
    return Array.from(new Set(list));
  };

  // Convert frontend workingHours format (object with day keys) to backend format (array)
  const convertWorkingHoursToBackendFormat = (workingHours) => {
    const dayMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    const backendFormat = [];

    Object.keys(dayMap).forEach((dayKey) => {
      const dayHours = workingHours[dayKey];
      if (
        dayHours &&
        dayHours.isAvailable &&
        dayHours.startTime &&
        dayHours.endTime
      ) {
        const formatTime = (timeValue) => {
          if (!timeValue) return '';
          if (typeof timeValue === 'string') return timeValue;
          return timeValue.format('HH:mm');
        };

        backendFormat.push({
          dayOfWeek: dayMap[dayKey],
          startTime: formatTime(dayHours.startTime),
          endTime: formatTime(dayHours.endTime),
          isAvailable: true,
        });
      }
    });

    return backendFormat;
  };

  const handleFormSubmit = (formData) => {
    // Get current form values to ensure we have the latest state
    const currentValues = getValues();
    const workingHours =
      currentValues.workingHours || formData.workingHours || {};

    // Validate working hours - at least one day must be enabled
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    const hasEnabledDay = days.some((day) => {
      const dayHours = workingHours[day];
      // Check both boolean true and truthy values
      return (
        dayHours &&
        (dayHours.isAvailable === true ||
          dayHours.isAvailable === 'true' ||
          dayHours.isAvailable)
      );
    });

    if (!hasEnabledDay) {
      setError('workingHours', {
        type: 'manual',
        message: 'At least one day must be enabled with working hours',
      });
      return;
    }

    // Validate working hours for each enabled day
    let hasWorkingHoursErrors = false;

    Object.keys(workingHours || {}).forEach((dayKey) => {
      const dayHours = workingHours[dayKey];
      // Check both boolean true and truthy values
      if (
        dayHours &&
        (dayHours.isAvailable === true ||
          dayHours.isAvailable === 'true' ||
          dayHours.isAvailable)
      ) {
        if (!dayHours.startTime) {
          setError(`workingHours.${dayKey}.startTime`, {
            type: 'manual',
            message: 'Start time is required when day is available',
          });
          hasWorkingHoursErrors = true;
        }
        if (!dayHours.endTime) {
          setError(`workingHours.${dayKey}.endTime`, {
            type: 'manual',
            message: 'End time is required when day is available',
          });
          hasWorkingHoursErrors = true;
        }
        if (dayHours.startTime && dayHours.endTime) {
          const formatTime = (timeValue) => {
            if (!timeValue) return '';
            if (typeof timeValue === 'string') return timeValue;
            return timeValue.format('HH:mm');
          };
          const startTime = formatTime(dayHours.startTime);
          const endTime = formatTime(dayHours.endTime);
          if (endTime <= startTime) {
            setError(`workingHours.${dayKey}.endTime`, {
              type: 'manual',
              message: 'End time must be after start time',
            });
            hasWorkingHoursErrors = true;
          }
        }
      }
    });

    if (hasWorkingHoursErrors) {
      return;
    }

    const sanitizedData = {
      ...formData,
      npiNumber: sanitizeValue(formData.npiNumber),
      licenseNumber: sanitizeValue(formData.licenseNumber),
      specialty: sanitizeSpecialty(formData.specialty),
      appointmentBufferMinutes: Number(formData.appointmentBufferMinutes),
      maxDailyAppointments: Number(formData.maxDailyAppointments),
      consultationFee: formData.consultationFee
        ? Number(formData.consultationFee)
        : undefined,
      workingHours: convertWorkingHoursToBackendFormat(workingHours),
    };

    onSubmit(sanitizedData);
  };


  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

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
              name="userId"
              control={control}
              rules={providerValidations.userId}
              render={({ field }) => {
                const selectedUser = users.find(
                  (u) => (u._id || u.id) === field.value
                );
                return (
                  <Autocomplete
                    disabled={isEditMode}
                    options={users}
                    loading={usersLoading}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.firstName} ${option.lastName} (${option.email})`
                        : ''
                    }
                    value={selectedUser || null}
                    onChange={(event, newValue) => {
                      field.onChange(
                        newValue ? newValue._id || newValue.id : ''
                      );
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        if (userSearchTimerRef.current) {
                          clearTimeout(userSearchTimerRef.current);
                        }
                        userSearchTimerRef.current = setTimeout(() => {
                          searchUsers(newInputValue);
                        }, 300);
                      } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
                        searchUsers('');
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="User *"
                        error={!!errors.userId}
                        helperText={errors.userId?.message}
                        placeholder="Search user by name or email..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {usersLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={
                      usersLoading
                        ? 'Searching...'
                        : 'No users found'
                    }
                    filterOptions={(x) => x}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="NPI Number *"
              {...register('npiNumber', providerValidations.npiNumber)}
              error={!!errors.npiNumber}
              helperText={errors.npiNumber?.message}
              inputProps={{ maxLength: 10 }}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) &&
                  !(e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pastedData = e.clipboardData.getData('text');
                if (!/^\d*$/.test(pastedData)) {
                  e.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="License Number *"
              {...register('licenseNumber', providerValidations.licenseNumber)}
              error={!!errors.licenseNumber}
              helperText={errors.licenseNumber?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="specialty"
              control={control}
              rules={providerValidations.specialty}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={specialties}
                  value={field.value || []}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                      if (specialtySearchTimerRef.current) {
                        clearTimeout(specialtySearchTimerRef.current);
                      }
                      specialtySearchTimerRef.current = setTimeout(() => {
                        searchSpecialties(newInputValue);
                      }, 300);
                    } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
                      searchSpecialties('');
                    }
                  }}
                  isOptionEqualToValue={(option, value) => option === value}
                  filterSelectedOptions
                  loading={specialtiesLoading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={`${option}-${index}`}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Specialty *"
                      error={!!errors.specialty}
                      helperText={errors.specialty?.message}
                      placeholder="Search specialty..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {specialtiesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={
                    specialtiesLoading
                      ? 'Searching...'
                      : 'No specialties found'
                  }
                  filterOptions={(x) => x}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.title}>
              <InputLabel>Title *</InputLabel>
              <Controller
                name="title"
                control={control}
                rules={providerValidations.title}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'MD'}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Title *"
                  >
                    <MenuItem value="MD">MD</MenuItem>
                    <MenuItem value="DO">DO</MenuItem>
                    <MenuItem value="NP">NP</MenuItem>
                    <MenuItem value="PA">PA</MenuItem>
                    <MenuItem value="RN">RN</MenuItem>
                    <MenuItem value="LPN">LPN</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                )}
              />
              {errors.title && (
                <FormHelperText>{errors.title.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Appointment Buffer (minutes) *"
              type="number"
              {...register(
                'appointmentBufferMinutes',
                providerValidations.appointmentBufferMinutes
              )}
              error={!!errors.appointmentBufferMinutes}
              helperText={errors.appointmentBufferMinutes?.message}
              inputProps={{ min: 0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Time between appointments for notes/prep.">
                      <IconButton size="small" edge="end">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Max Daily Appointments *"
              type="number"
              {...register(
                'maxDailyAppointments',
                providerValidations.maxDailyAppointments
              )}
              error={!!errors.maxDailyAppointments}
              helperText={errors.maxDailyAppointments?.message}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Consultation Fee"
              type="number"
              {...register(
                'consultationFee',
                providerValidations.consultationFee
              )}
              error={!!errors.consultationFee}
              helperText={errors.consultationFee?.message}
              inputProps={{ min: 0, step: 1.0 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.isAcceptingNewPatients}>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={
                      initialData?.isAcceptingNewPatients !== false
                    }
                  />
                }
                label="Accepting New Patients"
              />
            </FormControl>
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  {...register('telehealthEnabled')}
                  defaultChecked={initialData?.telehealthEnabled || false}
                />
              }
              label="Telehealth Enabled"
            />
          </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.isActive}>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={initialData?.isActive !== false}
                  />
                }
                label="Active"
              />
            </FormControl>
          </Grid>

          {/* Working Hours Section */}
          <Grid size={12}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Working Hours *
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configure working hours for each day of the week. At least one
                day must be enabled.
              </Typography>
              {errors.workingHours &&
                typeof errors.workingHours === 'object' &&
                errors.workingHours.message && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {errors.workingHours.message}
                  </Typography>
                )}
              <Grid container spacing={2}>
                {daysOfWeek.map((day) => {
                  const dayKey = day.key;
                  const dayHoursPath = `workingHours.${dayKey}`;
                  const isAvailablePath = `${dayHoursPath}.isAvailable`;
                  const startTimePath = `${dayHoursPath}.startTime`;
                  const endTimePath = `${dayHoursPath}.endTime`;

                  const isAvailable = watch(isAvailablePath);

                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dayKey}>
                      <Box
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Controller
                              name={isAvailablePath}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value || false}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    field.onChange(isChecked);
                                    
                                    if (isChecked) {
                                      const currentValues = getValues();
                                      const currentDayHours = currentValues.workingHours?.[dayKey];
                                      
                                      // Set default times if not already set
                                      const updatedWorkingHours = {
                                        ...currentValues.workingHours,
                                        [dayKey]: {
                                          isAvailable: true,
                                          startTime: currentDayHours?.startTime || parseTime('09:00'),
                                          endTime: currentDayHours?.endTime || parseTime('17:00'),
                                        }
                                      };
                                      
                                      reset({
                                        ...currentValues,
                                        workingHours: updatedWorkingHours,
                                      });
                                      
                                      // Clear error when a day is enabled
                                      const days = [
                                        'monday',
                                        'tuesday',
                                        'wednesday',
                                        'thursday',
                                        'friday',
                                        'saturday',
                                        'sunday',
                                      ];
                                      const hasEnabledDay = days.some((d) => {
                                        const dayHours = updatedWorkingHours[d];
                                        return (
                                          dayHours &&
                                          (dayHours.isAvailable === true ||
                                            dayHours.isAvailable)
                                        );
                                      });
                                      if (
                                        hasEnabledDay &&
                                        errors.workingHours?.message
                                      ) {
                                        clearErrors('workingHours');
                                      }
                                    }
                                  }}
                                />
                              )}
                            />
                          }
                          label={
                            <Typography variant="subtitle2" fontWeight="medium">
                              {day.label}
                            </Typography>
                          }
                        />
                        {isAvailable && (
                          <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                              <Grid size={6}>
                                <Controller
                                  name={startTimePath}
                                  control={control}
                                  rules={
                                    providerValidations.workingHours?.startTime
                                  }
                                  render={({ field }) => (
                                    <TimePicker
                                      {...field}
                                      label="Start Time *"
                                      value={field.value}
                                      onChange={(newValue) =>
                                        field.onChange(newValue)
                                      }
                                      slotProps={{
                                        textField: {
                                          fullWidth: true,
                                          size: 'small',
                                          error:
                                            !!errors.workingHours?.[dayKey]
                                              ?.startTime,
                                          helperText:
                                            errors.workingHours?.[dayKey]
                                              ?.startTime?.message,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid size={6}>
                                <Controller
                                  name={endTimePath}
                                  control={control}
                                  rules={
                                    providerValidations.workingHours?.endTime
                                  }
                                  render={({ field }) => (
                                    <TimePicker
                                      {...field}
                                      label="End Time *"
                                      value={field.value}
                                      onChange={(newValue) =>
                                        field.onChange(newValue)
                                      }
                                      slotProps={{
                                        textField: {
                                          fullWidth: true,
                                          size: 'small',
                                          error:
                                            !!errors.workingHours?.[dayKey]
                                              ?.endTime,
                                          helperText:
                                            errors.workingHours?.[dayKey]
                                              ?.endTime?.message,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
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
                    : 'Create Provider'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ProviderForm;
