import { useEffect, useState, useRef } from 'react';
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
  FormControlLabel,
  Switch,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Typography,
  IconButton,
} from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon, Close as CloseIcon, PlaylistAdd as WaitlistIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { recurringAppointmentValidations } from '../../validations/recurringAppointmentValidations';
import { recurringAppointmentService } from '../../services/recurring-appointment.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { waitlistService } from '../../services/waitlist.service';
import { useDropdownData } from '../../hooks/redux/useDropdownData';

const RecurringAppointmentForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
  patients = [],
  loadingPatients = false,
  onPatientSearch,
}) => {
  const {
    providers,
    appointmentTypes,
    providersLoading,
    appointmentTypesLoading,
  } = useDropdownData({ providers: true, appointmentTypes: true });

  const patientSearchTimerRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [appointmentOverrides, setAppointmentOverrides] = useState({});
  const [editingConflict, setEditingConflict] = useState(null);
  const [waitlistLoading, setWaitlistLoading] = useState({});
  const [addedToWaitlist, setAddedToWaitlist] = useState({});
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    trigger,
    setValue,
  } = useForm({
    defaultValues: initialData || {
      patientId: '',
      providerId: '',
      appointmentTypeId: '',
      frequency: 'weekly',
      frequencyValue: 1,
      startDate: null,
      endDate: null,
      preferredTime: null,
      preferredDayOfWeek: '',
      totalAppointments: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const frequency = watch('frequency');
  const frequencyValue = watch('frequencyValue');

  useEffect(() => {
    if (startDate) {
      trigger('preferredTime');
      if (dayjs.isDayjs(startDate) && startDate.isValid()) {
        setValue('preferredDayOfWeek', startDate.day());
      }
    }
  }, [startDate, trigger, setValue]);

  useEffect(() => {
    if (startDate && endDate && frequency && frequencyValue) {
      const start = dayjs.isDayjs(startDate) ? startDate : dayjs(startDate);
      const end = dayjs.isDayjs(endDate) ? endDate : dayjs(endDate);
      if (start.isValid() && end.isValid() && end.isAfter(start)) {
        const diffDays = end.diff(start, 'day');
        let intervalDays = 7;
        if (frequency === 'weekly') intervalDays = 7 * (Number(frequencyValue) || 1);
        else if (frequency === 'monthly') intervalDays = 30 * (Number(frequencyValue) || 1);
        else if (frequency === 'quarterly') intervalDays = 90 * (Number(frequencyValue) || 1);
        const cappedTotal = Math.min(Math.max(Math.floor(diffDays / intervalDays) + 1, 1), 100);
        setValue('totalAppointments', cappedTotal);
      }
    }
  }, [startDate, endDate, frequency, frequencyValue, setValue]);

  useEffect(() => {
    if (initialData) {
      const parseTime = (timeString) => {
        if (!timeString) return null;
        try {
          if (dayjs.isDayjs(timeString)) return timeString.isValid() ? timeString : null;
          if (typeof timeString === 'string') {
            const [hours, minutes] = timeString.split(':');
            if (hours && minutes) {
              const parsed = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
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
          if (dayjs.isDayjs(dateValue)) return dateValue.isValid() ? dateValue : null;
          const parsed = dayjs(dateValue);
          return parsed.isValid() ? parsed : null;
        } catch {
          return null;
        }
      };

      reset({
        patientId: initialData.patientId?._id || initialData.patientId || '',
        providerId: initialData.providerId?._id || initialData.providerId || '',
        appointmentTypeId: initialData.appointmentTypeId?._id || initialData.appointmentTypeId || '',
        frequency: initialData.frequency || 'weekly',
        frequencyValue: initialData.frequencyValue || 1,
        startDate: parseDate(initialData.startDate),
        endDate: parseDate(initialData.endDate),
        preferredTime: parseTime(initialData.preferredTime),
        preferredDayOfWeek:
          initialData.preferredDayOfWeek !== undefined && initialData.preferredDayOfWeek !== null
            ? initialData.preferredDayOfWeek
            : '',
        totalAppointments: initialData.totalAppointments || '',
        isActive: initialData.isActive !== false,
      });
    }
  }, [initialData, reset]);

  const formatTimeValue = (timeValue) => {
    if (!timeValue) return undefined;
    if (typeof timeValue === 'string') return timeValue.trim() !== '' ? timeValue : undefined;
    try {
      return timeValue.format('HH:mm');
    } catch {
      return undefined;
    }
  };

  const buildPreviewPayload = (formData) => ({
    providerId: formData.providerId,
    appointmentTypeId: formData.appointmentTypeId || undefined,
    frequency: formData.frequency,
    frequencyValue: formData.frequencyValue,
    startDate: formData.startDate?.format('YYYY-MM-DD'),
    endDate: formData.endDate?.format('YYYY-MM-DD'),
    preferredTime: formatTimeValue(formData.preferredTime),
    preferredDayOfWeek:
      formData.preferredDayOfWeek !== '' && formData.preferredDayOfWeek !== null
        ? Number(formData.preferredDayOfWeek)
        : undefined,
    totalAppointments: formData.totalAppointments ? Number(formData.totalAppointments) : undefined,
  });

  const buildSanitizedData = (formData) => {
    const getStringValue = (value) => {
      if (!value) return undefined;
      const str = typeof value === 'string' ? value : String(value);
      return str.trim() !== '' ? str.trim() : undefined;
    };

    const sanitizedData = {};

    const patientId = getStringValue(formData.patientId);
    if (patientId) sanitizedData.patientId = patientId;

    const providerId = getStringValue(formData.providerId);
    if (providerId) sanitizedData.providerId = providerId;

    sanitizedData.frequency = getStringValue(formData.frequency) || 'weekly';

    if (formData.frequencyValue) {
      const freqValue = Number(formData.frequencyValue);
      if (!isNaN(freqValue) && freqValue > 0) sanitizedData.frequencyValue = freqValue;
    }

    if (formData.startDate) {
      try { sanitizedData.startDate = formData.startDate.format('YYYY-MM-DD'); } catch { /* ignore */ }
    }

    const formattedTime = formatTimeValue(formData.preferredTime);
    if (formattedTime) sanitizedData.preferredTime = formattedTime;

    const appointmentTypeId = getStringValue(formData.appointmentTypeId);
    if (appointmentTypeId) sanitizedData.appointmentTypeId = appointmentTypeId;

    if (formData.endDate) {
      try { sanitizedData.endDate = formData.endDate.format('YYYY-MM-DD'); } catch { /* ignore */ }
    }

    if (
      formData.preferredDayOfWeek !== '' &&
      formData.preferredDayOfWeek !== null &&
      formData.preferredDayOfWeek !== undefined
    ) {
      const dayOfWeek = Number(formData.preferredDayOfWeek);
      if (!isNaN(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6) {
        sanitizedData.preferredDayOfWeek = dayOfWeek;
      }
    }

    if (formData.totalAppointments && formData.totalAppointments !== '') {
      const total = Number(formData.totalAppointments);
      if (!isNaN(total) && total > 0) sanitizedData.totalAppointments = total;
    }

    if (formData.isActive !== undefined) sanitizedData.isActive = formData.isActive;

    return sanitizedData;
  };

  const runPreview = async (formData) => {
    const previewPayload = buildPreviewPayload(formData);

    if (!previewPayload.providerId || !previewPayload.startDate || !previewPayload.preferredTime) {
      showSnackbar('Please fill in Provider, Start Date, and Preferred Time', 'warning');
      return null;
    }
    if (!previewPayload.totalAppointments && !previewPayload.endDate) {
      showSnackbar('Please provide Total Appointments or End Date', 'warning');
      return null;
    }

    setPreviewLoading(true);
    setPreviewError('');
    try {
      const result = await recurringAppointmentService.previewRecurringAppointments(previewPayload);
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to preview appointments. Please check your inputs.';
      setPreviewError(msg);
      showSnackbar(msg, 'error');
      return null;
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (isEditMode) {
      onSubmit(buildSanitizedData(formData));
      return;
    }

    const result = await runPreview(formData);
    if (!result) return;

    setPreviewData(result);
    setAppointmentOverrides({});
    setAddedToWaitlist({});
    setPreviewOpen(true);
  };

  const handlePreview = async () => {
    const result = await runPreview(watch());
    if (!result) return;

    setPreviewData(result);
    setAppointmentOverrides({});
    setAddedToWaitlist({});
    setPreviewOpen(true);
  };

  const handleConfirmCreate = async () => {
    const formValues = watch();
    const overridesArray = Object.entries(appointmentOverrides).map(([key, value]) => ({
      appointmentNumber: parseInt(key),
      ...value,
    }));

    const payload = {
      patientId: formValues.patientId,
      providerId: formValues.providerId,
      appointmentTypeId: formValues.appointmentTypeId || undefined,
      frequency: formValues.frequency,
      frequencyValue: formValues.frequencyValue,
      startDate: formValues.startDate?.format('YYYY-MM-DD'),
      endDate: formValues.endDate?.format('YYYY-MM-DD'),
      preferredTime: formatTimeValue(formValues.preferredTime),
      preferredDayOfWeek:
        formValues.preferredDayOfWeek !== '' && formValues.preferredDayOfWeek !== null
          ? Number(formValues.preferredDayOfWeek)
          : undefined,
      totalAppointments: formValues.totalAppointments ? Number(formValues.totalAppointments) : undefined,
      appointmentOverrides: overridesArray.length > 0 ? overridesArray : undefined,
    };

    setPreviewOpen(false);
    onSubmit(payload, true);
  };

  const handleSkipConflict = (appointmentNumber) => {
    setAppointmentOverrides((prev) => ({
      ...prev,
      [appointmentNumber]: { ...prev[appointmentNumber], skip: true },
    }));
  };

  const handleUnskipConflict = (appointmentNumber) => {
    setAppointmentOverrides((prev) => {
      const updated = { ...prev };
      if (updated[appointmentNumber]) {
        delete updated[appointmentNumber].skip;
        if (Object.keys(updated[appointmentNumber]).length === 0) delete updated[appointmentNumber];
      }
      return updated;
    });
  };

  const handleEditConflict = (apt) => {
    setEditingConflict({
      appointmentNumber: apt.appointmentNumber,
      date: dayjs(apt.date),
      startTime: dayjs(`2000-01-01 ${apt.startTime}`),
      endTime: dayjs(`2000-01-01 ${apt.endTime}`),
    });
  };

  const handleSaveConflictEdit = () => {
    if (editingConflict) {
      setAppointmentOverrides((prev) => ({
        ...prev,
        [editingConflict.appointmentNumber]: {
          customDate: editingConflict.date.format('YYYY-MM-DD'),
          customStartTime: editingConflict.startTime.format('HH:mm'),
          customEndTime: editingConflict.endTime.format('HH:mm'),
        },
      }));
      setEditingConflict(null);
    }
  };

  const getAppointmentStatus = (apt) => {
    const override = appointmentOverrides[apt.appointmentNumber];
    if (addedToWaitlist[apt.appointmentNumber]) return 'waitlisted';
    if (override?.skip) return 'skipped';
    if (override?.customDate || override?.customStartTime) return 'modified';
    if (apt.hasConflict) return 'conflict';
    return 'available';
  };

  const handleAddToWaitlist = async (apt) => {
    const formValues = watch();
    const { appointmentNumber } = apt;

    setWaitlistLoading((prev) => ({ ...prev, [appointmentNumber]: true }));
    try {
      await waitlistService.createWaitlistEntry({
        patientId: formValues.patientId,
        providerId: formValues.providerId,
        appointmentTypeId: formValues.appointmentTypeId,
        preferredDate: dayjs(apt.date).format('YYYY-MM-DD'),
        preferredTimeStart: apt.startTime,
        preferredTimeEnd: apt.endTime,
        priority: 'normal',
        notes: `From recurring appointment - Appointment #${appointmentNumber} had a conflict`,
      });

      setAddedToWaitlist((prev) => ({ ...prev, [appointmentNumber]: true }));
      setAppointmentOverrides((prev) => ({
        ...prev,
        [appointmentNumber]: { ...prev[appointmentNumber], skip: true },
      }));
      showSnackbar(`Appointment #${appointmentNumber} added to waitlist`, 'success');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add to waitlist',
        'error'
      );
    } finally {
      setWaitlistLoading((prev) => ({ ...prev, [appointmentNumber]: false }));
    }
  };

  const hasUnresolvedConflicts = () => {
    if (!previewData?.previewAppointments) return false;
    return previewData.previewAppointments.some(
      (apt) => apt.hasConflict && getAppointmentStatus(apt) === 'conflict'
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="patientId"
              control={control}
              rules={recurringAppointmentValidations.patientId}
              render={({ field }) => {
                const selectedPatient = patients.find((p) => (p._id || p.id) === field.value);
                return (
                  <Autocomplete
                    disabled={isEditMode}
                    options={patients}
                    loading={loadingPatients}
                    filterOptions={(x) => x}
                    getOptionLabel={(option) =>
                      option ? `${option.firstName} ${option.lastName} (${option.patientCode})` : ''
                    }
                    value={selectedPatient || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    onInputChange={(event, value, reason) => {
                      if (reason === 'input') {
                        if (patientSearchTimerRef.current) clearTimeout(patientSearchTimerRef.current);
                        patientSearchTimerRef.current = setTimeout(() => {
                          onPatientSearch?.(value);
                        }, 300);
                      } else if (reason === 'clear') {
                        onPatientSearch?.('');
                      }
                    }}
                    onBlur={() => onPatientSearch?.('')}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient *"
                        error={!!errors.patientId}
                        helperText={errors.patientId?.message}
                        placeholder="Search patient..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="providerId"
              control={control}
              rules={recurringAppointmentValidations.providerId}
              render={({ field }) => {
                const selectedProvider = providers.find((p) => (p._id || p.id) === field.value);
                return (
                  <Autocomplete
                    options={providers}
                    loading={providersLoading}
                    getOptionLabel={(option) => {
                      if (!option) return '';
                      const firstName = option.userId?.firstName || option.firstName || '';
                      const lastName = option.userId?.lastName || option.lastName || '';
                      const code = option.providerCode || '';
                      const name = `${firstName} ${lastName}`.trim();
                      return name ? `${name} (${code})` : code || 'Unknown Provider';
                    }}
                    value={selectedProvider || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const q = inputValue.toLowerCase();
                      return options.filter((o) => {
                        const firstName = o.userId?.firstName || o.firstName || '';
                        const lastName = o.userId?.lastName || o.lastName || '';
                        return (
                          firstName.toLowerCase().includes(q) ||
                          lastName.toLowerCase().includes(q) ||
                          (o.providerCode || '').toLowerCase().includes(q)
                        );
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Provider *"
                        error={!!errors.providerId}
                        helperText={errors.providerId?.message}
                        placeholder="Search provider..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {providersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="appointmentTypeId"
              control={control}
              rules={recurringAppointmentValidations.appointmentTypeId}
              render={({ field }) => {
                const selectedType = appointmentTypes.find((t) => (t._id || t.id) === field.value);
                return (
                  <Autocomplete
                    options={appointmentTypes}
                    loading={appointmentTypesLoading}
                    getOptionLabel={(option) => (option ? option.name : '')}
                    value={selectedType || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const q = inputValue.toLowerCase();
                      return options.filter((o) => o.name?.toLowerCase().includes(q));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Appointment Type *"
                        error={!!errors.appointmentTypeId}
                        helperText={errors.appointmentTypeId?.message}
                        placeholder="Search appointment type..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {appointmentTypesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.frequency}>
              <InputLabel>Frequency *</InputLabel>
              <Controller
                name="frequency"
                control={control}
                rules={recurringAppointmentValidations.frequency}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'weekly'}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Frequency *"
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                )}
              />
              {errors.frequency && <FormHelperText>{errors.frequency.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Frequency Value *"
              type="number"
              {...register('frequencyValue', recurringAppointmentValidations.frequencyValue)}
              error={!!errors.frequencyValue}
              helperText={
                errors.frequencyValue?.message ||
                (() => {
                  const val = Number(frequencyValue) || 1;
                  if (frequency === 'weekly') return val === 1 ? 'Every week.' : `Every ${val} weeks.`;
                  if (frequency === 'monthly') return val === 1 ? 'Every month.' : `Every ${val} months.`;
                  if (frequency === 'quarterly') return val === 1 ? 'Every quarter.' : `Every ${val} quarters.`;
                  return 'How often (e.g., every 2 weeks)';
                })()
              }
              inputProps={{ min: 1, max: 52 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="startDate"
              control={control}
              rules={recurringAppointmentValidations.startDate}
              render={({ field }) => {
                let dateValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    dateValue = field.value.isValid() ? field.value : null;
                  } else if (typeof field.value === 'string' || field.value instanceof Date) {
                    const parsed = dayjs(field.value);
                    dateValue = parsed.isValid() ? parsed : null;
                  }
                }
                return (
                  <DatePicker
                    label="Start Date *"
                    value={dateValue}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                    minDate={dayjs()}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="endDate"
              control={control}
              rules={recurringAppointmentValidations.endDate}
              render={({ field }) => {
                let dateValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    dateValue = field.value.isValid() ? field.value : null;
                  } else if (typeof field.value === 'string' || field.value instanceof Date) {
                    const parsed = dayjs(field.value);
                    dateValue = parsed.isValid() ? parsed : null;
                  }
                }
                const minDate =
                  startDate && dayjs.isDayjs(startDate) && startDate.isValid() ? startDate : dayjs();
                return (
                  <DatePicker
                    label="End Date"
                    value={dateValue}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                    minDate={minDate}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="preferredTime"
              control={control}
              rules={recurringAppointmentValidations.preferredTime}
              render={({ field }) => {
                let timeValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    timeValue = field.value.isValid() ? field.value : null;
                  } else if (typeof field.value === 'string') {
                    const [hours, minutes] = field.value.split(':');
                    if (hours && minutes) {
                      const parsed = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
                      timeValue = parsed.isValid() ? parsed : null;
                    }
                  }
                }
                return (
                  <TimePicker
                    label="Preferred Time *"
                    value={timeValue}
                    onChange={(newValue) => field.onChange(newValue)}
                    ampm={true}
                    format="hh:mm A"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.preferredTime,
                        helperText: errors.preferredTime?.message,
                      },
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.preferredDayOfWeek}>
              <InputLabel>Preferred Day of Week</InputLabel>
              <Controller
                name="preferredDayOfWeek"
                control={control}
                rules={recurringAppointmentValidations.preferredDayOfWeek}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Preferred Day of Week"
                  >
                    <MenuItem value=""><em>--Any Day--</em></MenuItem>
                    <MenuItem value={0}>Sunday</MenuItem>
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                  </Select>
                )}
              />
              {errors.preferredDayOfWeek && (
                <FormHelperText>{errors.preferredDayOfWeek.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Total Appointments"
              type="number"
              {...register('totalAppointments', recurringAppointmentValidations.totalAppointments)}
              error={!!errors.totalAppointments}
              helperText={
                errors.totalAppointments?.message ||
                'Number of appointments to generate immediately (max 100, or provide End Date to auto-calculate). Leave empty to generate manually later.'
              }
              inputProps={{ min: 1, max: 100 }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  {...register('isActive')}
                  defaultChecked={initialData?.isActive !== false}
                />
              }
              label="Active"
            />
          </Grid>

          {!hideButtons && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button type="button" variant="outlined" onClick={() => window.history.back()} disabled={loading}>
                  Cancel
                </Button>
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={previewLoading ? <CircularProgress size={20} /> : <PreviewIcon />}
                    onClick={handlePreview}
                    disabled={loading || previewLoading}
                  >
                    {previewLoading ? 'Loading Preview...' : 'Preview'}
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Recurring Appointment'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Preview Recurring Appointments</Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewError && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
              <Typography variant="body2" color="error.contrastText">{previewError}</Typography>
            </Box>
          )}
          {previewData && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`Total: ${previewData.totalCount} appointments`} color="primary" variant="outlined" />
                <Chip label={`Available: ${previewData.availableCount}`} color="success" variant="outlined" />
                {previewData.conflictCount > 0 && (
                  <Chip label={`Conflicts: ${previewData.conflictCount}`} color="error" variant="outlined" />
                )}
              </Box>
              {previewData.conflictCount > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {previewData.conflictCount} appointment(s) have conflicts.{' '}
                    <strong>You must resolve all conflicts before creating.</strong>
                  </Typography>
                  <Typography variant="body2" component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                    <li><strong>Skip</strong> - Don't create this appointment</li>
                    <li><strong>Edit</strong> - Change the date/time to avoid conflict</li>
                    <li><strong>Waitlist</strong> - Add to waitlist for later scheduling</li>
                  </Typography>
                </Alert>
              )}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.previewAppointments.map((apt) => {
                      const status = getAppointmentStatus(apt);
                      const override = appointmentOverrides[apt.appointmentNumber];
                      const displayDate = override?.customDate ? dayjs(override.customDate) : dayjs(apt.date);
                      const displayStartTime = override?.customStartTime || apt.startTime;
                      const displayEndTime = override?.customEndTime || apt.endTime;

                      return (
                        <TableRow
                          key={apt.appointmentNumber}
                          sx={{
                            backgroundColor:
                              status === 'conflict' ? 'error.lighter' :
                              status === 'skipped' ? 'action.disabledBackground' :
                              status === 'modified' ? 'info.lighter' : 'transparent',
                            opacity: status === 'skipped' ? 0.6 : 1,
                            textDecoration: status === 'skipped' ? 'line-through' : 'none',
                          }}
                        >
                          <TableCell>{apt.appointmentNumber}</TableCell>
                          <TableCell>
                            {displayDate.format('MMM DD, YYYY')}
                            {override?.customDate && (
                              <Typography variant="caption" color="info.main" display="block">(modified)</Typography>
                            )}
                          </TableCell>
                          <TableCell>{displayDate.format('dddd')}</TableCell>
                          <TableCell>
                            {dayjs(`2000-01-01 ${displayStartTime}`).format('h:mm A')} -{' '}
                            {dayjs(`2000-01-01 ${displayEndTime}`).format('h:mm A')}
                            {(override?.customStartTime || override?.customEndTime) && (
                              <Typography variant="caption" color="info.main" display="block">(modified)</Typography>
                            )}
                          </TableCell>
                          <TableCell>{apt.durationMinutes} min</TableCell>
                          <TableCell>
                            {status === 'waitlisted' ? <Chip label="Waitlisted" color="secondary" size="small" /> :
                             status === 'skipped' ? <Chip label="Skipped" color="default" size="small" /> :
                             status === 'modified' ? <Chip label="Modified" color="info" size="small" /> :
                             status === 'conflict' ? <Chip label="Conflict" color="error" size="small" title={apt.conflictReason} /> :
                             <Chip label="Available" color="success" size="small" />}
                          </TableCell>
                          <TableCell>
                            {apt.hasConflict && status === 'conflict' && (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                <Button size="small" variant="outlined" color="warning" onClick={() => handleSkipConflict(apt.appointmentNumber)}>
                                  Skip
                                </Button>
                                <Button size="small" variant="outlined" color="primary" onClick={() => handleEditConflict(apt)}>
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => handleAddToWaitlist(apt)}
                                  disabled={waitlistLoading[apt.appointmentNumber]}
                                  startIcon={waitlistLoading[apt.appointmentNumber] ? <CircularProgress size={14} /> : <WaitlistIcon />}
                                >
                                  Waitlist
                                </Button>
                              </Box>
                            )}
                            {status === 'skipped' && !addedToWaitlist[apt.appointmentNumber] && (
                              <Button size="small" variant="text" onClick={() => handleUnskipConflict(apt.appointmentNumber)}>
                                Undo
                              </Button>
                            )}
                            {status === 'waitlisted' && (
                              <Typography variant="caption" color="text.secondary">Added to waitlist</Typography>
                            )}
                            {status === 'modified' && (
                              <Button size="small" variant="text" color="error" onClick={() => handleUnskipConflict(apt.appointmentNumber)}>
                                Reset
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {previewData.previewAppointments.some((apt) => apt.hasConflict && apt.conflictingAppointments) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Conflict Details:</Typography>
                  {previewData.previewAppointments
                    .filter((apt) => apt.hasConflict && apt.conflictingAppointments)
                    .map((apt) => (
                      <Box key={apt.appointmentNumber} sx={{ mb: 1 }}>
                        <Typography variant="body2" color="error">
                          Appointment #{apt.appointmentNumber} ({dayjs(apt.date).format('MMM DD, YYYY')}): {apt.conflictReason}
                        </Typography>
                        {apt.conflictingAppointments.map((conflict, idx) => (
                          <Typography key={idx} variant="caption" sx={{ ml: 2, display: 'block' }}>
                            - {conflict.patientName} ({conflict.appointmentCode}): {conflict.startTime} - {conflict.endTime}
                          </Typography>
                        ))}
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmCreate}
            startIcon={<SaveIcon />}
            disabled={loading || hasUnresolvedConflicts()}
          >
            {hasUnresolvedConflicts() ? 'Resolve All Conflicts First' : 'Confirm & Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Conflict Dialog */}
      <Dialog open={!!editingConflict} onClose={() => setEditingConflict(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Appointment Slot</DialogTitle>
        <DialogContent>
          {editingConflict && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Modify the date and time to avoid the scheduling conflict.
              </Typography>
              <DatePicker
                label="Date"
                value={editingConflict.date}
                onChange={(newValue) => setEditingConflict((prev) => ({ ...prev, date: newValue }))}
                minDate={dayjs()}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="Start Time"
                value={editingConflict.startTime}
                onChange={(newValue) => setEditingConflict((prev) => ({ ...prev, startTime: newValue }))}
                ampm={true}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="End Time"
                value={editingConflict.endTime}
                onChange={(newValue) => setEditingConflict((prev) => ({ ...prev, endTime: newValue }))}
                ampm={true}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingConflict(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveConflictEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default RecurringAppointmentForm;
