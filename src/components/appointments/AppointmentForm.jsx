import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Paper,
  Typography,
  Divider,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  PlaylistAdd as WaitlistIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  LocalHospital as InsuranceIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { appointmentValidations } from '../../validations/appointmentValidations';
import { waitlistService } from '../../services/waitlist.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDropdownData } from '../../hooks/redux/useDropdownData';
import { useDispatch } from 'react-redux';
import { fetchAppointments, fetchAvailableSlots } from '../../store/slices/appointmentSlice';
import { fetchPatientInsurances } from '../../store/slices/patientSlice';

const APPOINTMENT_STATUS_OPTIONS = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Preconfirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "arrived", label: "Arrived" },
  { value: "ready_to_be_seated", label: "Ready To Be Seated" },
  { value: "seated", label: "Seated" },
  { value: "ready_for_doctor", label: "Ready For Doctor" },
  { value: "in_treatment", label: "In Treatment" },
  { value: "ready_for_checkout", label: "Ready For Checkout" },
  { value: "checked_out_incomplete", label: "Checked out incomplete" },
  { value: "checked_out_complete", label: "Checked out complete" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show" },
  { value: "call", label: "Call" },
  { value: "left_message", label: "Left message" },
  { value: "running_late", label: "Running Late" },
  { value: "sent_email_or_text", label: "Sent Email Or Text" },
  { value: "late", label: "Late" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
];

const AppointmentForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
  patients = [],
  loadingPatients = false,
  languages = [],
  onPatientSearch,
}) => {
  // ─── Redux cached dropdown data (fetched ONCE, shared across all forms) ───
  const {
    providers,
    rooms,
    appointmentTypes,
  } = useDropdownData({ providers: true, rooms: true, appointmentTypes: true });

  const dispatch = useDispatch();

  const patientSearchTimerRef = useRef(null);
  const [addingToWaitlist, setAddingToWaitlist] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Insurance eligibility state
  const [insuranceEligibility, setInsuranceEligibility] = useState(null);

  const [conflictError, setConflictError] = useState('');
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [conflictDate, setConflictDate] = useState(null);
  const [conflictProviderId, setConflictProviderId] = useState(null);
  const [conflictDuration, setConflictDuration] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: initialData || {
      patientId: '',
      providerId: '',
      appointmentTypeId: '',
      appointmentDate: null,
      startTime: null,
      endTime: null,
      durationMinutes: 0,
      chiefComplaint: '',
      notes: '',
      roomId: '',
      requiresInterpreter: false,
      interpreterLanguage: '',
      insuranceVerified: false,
      copayCollected: '',
      reminderSent: false,
      customFields: {},
      status: 'unconfirmed',
    },
    mode: 'onChange',
  });

  const requiresInterpreter = watch('requiresInterpreter');
  const customFields = watch('customFields') || {};
  const providerId = watch('providerId');
  const appointmentDate = watch('appointmentDate');
  const watchedPatientId = watch('patientId');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const durationMinutes = watch('durationMinutes');

  // Check for appointment conflicts and provider availability
  const checkAppointmentConflict = useCallback(
    async (
      providerIdValue,
      dateValue,
      startTimeValue,
      endTimeValue,
      excludeAppointmentId = null,
      durationMinutesValue = null
    ) => {
      if (
        !providerIdValue ||
        !dateValue ||
        !startTimeValue ||
        !endTimeValue ||
        !dayjs.isDayjs(dateValue) ||
        !dayjs.isDayjs(startTimeValue) ||
        !dayjs.isDayjs(endTimeValue)
      ) {
        setConflictError('');
        return false;
      }

      try {
        setCheckingConflict(true);
        setConflictError('');

        const dateStr = dateValue.format('YYYY-MM-DD');
        const startTimeStr = startTimeValue.format('HH:mm');
        const endTimeStr = endTimeValue.format('HH:mm');

        const parseTime = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const startMinutes = parseTime(startTimeStr);
        const endMinutes = parseTime(endTimeStr);

        let calculatedDuration = endMinutes - startMinutes;
        const appointmentDuration = durationMinutesValue || calculatedDuration || 30;

        if (calculatedDuration <= 0) {
          setConflictError('End time must be after start time.');
          return true;
        }

        if (dateStr && providerIdValue && appointmentDuration) {
          try {
            const availableSlotsResult = await dispatch(fetchAvailableSlots({
              providerId: providerIdValue,
              date: dateStr,
              duration: appointmentDuration
            })).unwrap();

            const availableSlots = availableSlotsResult?.availableSlots || [];

            if (availableSlots.length === 0) {
              setConflictError('No slots available for selected date and time.');
              return true;
            }

            const isSlotAvailable = availableSlots.some((slot) => {
              const slotTime = parseTime(slot);
              return slotTime === startMinutes;
            });

            if (!isSlotAvailable) {
              setAvailableSlots(availableSlots);
              setConflictDate(dateStr);
              setConflictProviderId(providerIdValue);
              setConflictDuration(appointmentDuration);
              setConflictError(
                `This time slot is not available. The provider may have other appointments at this time. Please select an available time slot.`
              );
              return true;
            }

            setAvailableSlots([]);
          } catch {
            // fall through to manual conflict check
          }
        }

        try {
          const result = await dispatch(fetchAppointments({
            page: 1, limit: 100, providerId: providerIdValue, startDate: dateStr, endDate: dateStr
          })).unwrap();

          const existingAppointments = result.appointments || [];

          const selectedProvider = providers.find(
            (p) => (p._id || p.id) === providerIdValue
          );
          if (selectedProvider?.maxDailyAppointments) {
            const activeAppointments = existingAppointments.filter(
              (apt) =>
                apt.status !== 'cancelled' &&
                apt.status !== 'no_show' &&
                (!excludeAppointmentId ||
                  (apt._id !== excludeAppointmentId && apt.id !== excludeAppointmentId))
            );
            if (activeAppointments.length >= selectedProvider.maxDailyAppointments) {
              setConflictError(
                `The provider has reached the maximum daily appointments limit (${selectedProvider.maxDailyAppointments}). Please select a different date or provider.`
              );
              return true;
            }
          }

          const newStart = parseTime(startTimeStr);
          const newEnd = parseTime(endTimeStr);

          const conflictingAppointments = existingAppointments.filter((apt) => {
            if (
              excludeAppointmentId &&
              (apt._id === excludeAppointmentId || apt.id === excludeAppointmentId)
            ) {
              return false;
            }
            if (apt.status === 'cancelled' || apt.status === 'no_show') return false;

            const aptStart = parseTime(apt.startTime);
            const aptEnd = parseTime(apt.endTime);
            return newEnd > aptStart && newStart < aptEnd;
          });

          if (conflictingAppointments.length > 0) {
            try {
              const availableSlotsResult = await dispatch(fetchAvailableSlots({
                providerId: providerIdValue, date: dateStr, duration: appointmentDuration
              })).unwrap();
              const slots = availableSlotsResult?.availableSlots || [];
              if (slots.length > 0) {
                setAvailableSlots(slots);
                setConflictDate(dateStr);
                setConflictProviderId(providerIdValue);
                setConflictDuration(appointmentDuration);
              }
            } catch {
              // ignore
            }

            const conflictDetails = conflictingAppointments
              .map((apt) => `${apt.startTime} - ${apt.endTime}`)
              .join(', ');
            setConflictError(
              `This time slot conflicts with existing appointment(s) at ${conflictDetails}. Please choose a different time.`
            );
            return true;
          }

          setConflictError('');
          return false;
        } catch {
          setConflictError('');
          return false;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Unable to verify provider availability. Please try again.';
        setConflictError(errorMessage);
        return false;
      } finally {
        setCheckingConflict(false);
      }
    },
    [providers]
  );

  // Auto-calculate end time when start time or duration changes
  const [endTimeManuallySet, setEndTimeManuallySet] = useState(false);
  const [startTimeManuallySet, setStartTimeManuallySet] = useState(false);
  const [durationError, setDurationError] = useState('');
  const appointmentTypeId = watch('appointmentTypeId');
  const [customFieldsLocal, setCustomFieldsLocal] = useState({});

  useEffect(() => {
    setCustomFieldsLocal(customFields || {});
  }, [customFields]);

  useEffect(() => {
    const selectedType = appointmentTypes.find(
      (t) => (t._id || t.id) === appointmentTypeId
    );
    if (selectedType?.defaultDuration && !startTimeManuallySet && !endTimeManuallySet) {
      const currentValues = watch();
      const currentDuration = currentValues.durationMinutes;
      if (!currentDuration || currentDuration === 0) {
        reset({ ...currentValues, durationMinutes: selectedType.defaultDuration });
      }
    }
  }, [appointmentTypeId, appointmentTypes, reset, watch, startTimeManuallySet, endTimeManuallySet]);

  const calculateEndTimeFromStart = useCallback((start, duration) => {
    if (!start || !dayjs.isDayjs(start) || !start.isValid() || !duration || duration < 5) return null;
    return start.add(duration, 'minute');
  }, []);

  const calculateStartTimeFromEnd = useCallback((end, duration) => {
    if (!end || !dayjs.isDayjs(end) || !end.isValid() || !duration || duration < 5) return null;
    return end.subtract(duration, 'minute');
  }, []);

  const calculateDurationFromTimes = useCallback((start, end) => {
    if (
      !start || !end ||
      !dayjs.isDayjs(start) || !dayjs.isDayjs(end) ||
      !start.isValid() || !end.isValid()
    ) {
      return null;
    }
    const startMinutes = start.hour() * 60 + start.minute();
    const endMinutes = end.hour() * 60 + end.minute();
    const duration = endMinutes - startMinutes;
    return duration > 0 ? duration : null;
  }, []);

  useEffect(() => {
    if (
      startTime && dayjs.isDayjs(startTime) && startTime.isValid() &&
      durationMinutes && durationMinutes >= 5 && !endTimeManuallySet
    ) {
      const calculatedEndTime = calculateEndTimeFromStart(startTime, durationMinutes);
      if (calculatedEndTime && (!endTime || !dayjs.isDayjs(endTime) || !endTime.isValid())) {
        reset({ ...watch(), endTime: calculatedEndTime });
      }
    }
  }, [startTime, durationMinutes, reset, watch, endTime, endTimeManuallySet, calculateEndTimeFromStart]);

  useEffect(() => {
    if (
      endTime && dayjs.isDayjs(endTime) && endTime.isValid() &&
      durationMinutes && durationMinutes >= 5 &&
      !startTimeManuallySet && endTimeManuallySet &&
      (!startTime || !dayjs.isDayjs(startTime) || !startTime.isValid())
    ) {
      const calculatedStartTime = calculateStartTimeFromEnd(endTime, durationMinutes);
      if (calculatedStartTime) {
        reset({ ...watch(), startTime: calculatedStartTime });
      }
    }
  }, [endTime, durationMinutes, reset, watch, startTime, startTimeManuallySet, endTimeManuallySet, calculateStartTimeFromEnd]);

  // Debounced conflict check on time/provider/date change
  useEffect(() => {
    if (providerId && appointmentDate && startTime && endTime) {
      const timeoutId = setTimeout(() => {
        const appointmentId = isEditMode ? initialData?._id || initialData?.id || null : null;
        checkAppointmentConflict(providerId, appointmentDate, startTime, endTime, appointmentId, durationMinutes);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setConflictError('');
    }
  }, [providerId, appointmentDate, startTime, endTime, durationMinutes, isEditMode, initialData, checkAppointmentConflict]);

  // ─── Insurance eligibility ────────────────────────────────────────────────

  const checkPatientInsurance = useCallback(async (patientId) => {
    if (!patientId) {
      setInsuranceEligibility(null);
      return;
    }
    try {
      const result = await dispatch(fetchPatientInsurances({ patientId, activeOnly: true })).unwrap();
      const insurances = result?.insurances || [];
      const primaryInsurance = insurances?.find(
        (ins) => ins.isActive === true && ins.insuranceType === 'primary'
      );
      if (primaryInsurance) {
        const insuranceName =
          typeof primaryInsurance.insuranceCompanyId === 'object'
            ? primaryInsurance.insuranceCompanyId?.name || 'Unknown'
            : 'Unknown';
        setInsuranceEligibility({
          status: primaryInsurance.verificationStatus || 'pending',
          insuranceName,
          copayAmount: primaryInsurance.copayAmount,
        });
      } else {
        setInsuranceEligibility({ status: 'no_insurance', insuranceName: 'No Insurance' });
      }
    } catch {
      setInsuranceEligibility({ status: 'no_insurance', insuranceName: 'No Insurance' });
    }
  }, []);

  useEffect(() => {
    const currentPatientId =
      watchedPatientId || initialData?.patientId?._id || initialData?.patientId;
    checkPatientInsurance(currentPatientId);
  }, [watchedPatientId, initialData?.patientId, checkPatientInsurance]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && watchedPatientId) {
        checkPatientInsurance(watchedPatientId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [watchedPatientId, checkPatientInsurance]);

  // ─── initialData reset ───────────────────────────────────────────────────

  useEffect(() => {
    if (initialData) {
      const parseTime = (timeValue) => {
        if (!timeValue) return null;
        if (dayjs.isDayjs(timeValue)) return timeValue;
        if (timeValue instanceof Date) return dayjs(timeValue);
        if (typeof timeValue === 'string') {
          if (timeValue.includes(':')) {
            const [hours, minutes] = timeValue.split(':');
            return dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
          }
          return dayjs(timeValue);
        }
        return dayjs(timeValue);
      };

      reset({
        patientId: initialData.patientId?._id || initialData.patientId || '',
        providerId: initialData.providerId?._id || initialData.providerId || '',
        appointmentTypeId: initialData.appointmentTypeId?._id || initialData.appointmentTypeId || '',
        appointmentDate: initialData.appointmentDate ? dayjs(initialData.appointmentDate) : null,
        startTime: parseTime(initialData.startTime),
        endTime: parseTime(initialData.endTime),
        durationMinutes: initialData.durationMinutes || 30,
        chiefComplaint: initialData.chiefComplaint || '',
        notes: initialData.notes || '',
        roomId: initialData.roomId || '',
        requiresInterpreter: initialData.requiresInterpreter || false,
        interpreterLanguage: initialData.interpreterLanguage || '',
        insuranceVerified: initialData.insuranceVerified || false,
        copayCollected: initialData.copayCollected || '',
        reminderSent: initialData.reminderSent || false,
        customFields:
          initialData.customFields && typeof initialData.customFields === 'object'
            ? initialData.customFields
            : {},
        status: initialData.status || 'scheduled',
      });
    }
  }, [initialData, reset]);

  const handleBack = () => window.history.back();

  const handleAddToWaitlist = async () => {
    const formValues = watch();

    if (!formValues.patientId || !formValues.providerId) {
      showSnackbar('Patient and Provider are required to add to waitlist', 'warning');
      return;
    }

    setAddingToWaitlist(true);
    try {
      const formatTime = (timeValue) => {
        if (!timeValue) return undefined;
        if (typeof timeValue === 'string') return timeValue;
        return timeValue.format('HH:mm');
      };

      await waitlistService.createWaitlistEntry({
        patientId: formValues.patientId,
        providerId: formValues.providerId,
        appointmentTypeId: formValues.appointmentTypeId || undefined,
        preferredDate: formValues.appointmentDate
          ? formValues.appointmentDate.format('YYYY-MM-DD')
          : undefined,
        preferredTimeStart: formatTime(formValues.startTime),
        preferredTimeEnd: formatTime(formValues.endTime),
        priority: 'normal',
        notes: formValues.notes || `Added to waitlist due to scheduling conflict`,
        chiefComplaint: formValues.chiefComplaint || undefined,
      });

      setConflictError('');
      showSnackbar('Appointment added to waitlist successfully', 'success');

      reset({
        patientId: '',
        providerId: '',
        appointmentTypeId: '',
        appointmentDate: null,
        startTime: null,
        endTime: null,
        durationMinutes: 0,
        chiefComplaint: '',
        notes: '',
        roomId: '',
        requiresInterpreter: false,
        interpreterLanguage: '',
        insuranceVerified: false,
        copayCollected: '',
        reminderSent: false,
        customFields: {},
        status: 'unconfirmed',
      });
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add to waitlist',
        'error'
      );
    } finally {
      setAddingToWaitlist(false);
    }
  };

  const MAX_CUSTOM_FIELDS = 10;

  const handleAddCustomField = () => {
    if (Object.keys(customFieldsLocal).length >= MAX_CUSTOM_FIELDS) return;
    const newKey = `customField_${Object.keys(customFieldsLocal).length + 1}`;
    const newFields = { ...customFieldsLocal, [newKey]: '' };
    setCustomFieldsLocal(newFields);
    reset({ ...watch(), customFields: newFields });
  };

  const handleRemoveCustomField = (key) => {
    const newFields = { ...customFieldsLocal };
    delete newFields[key];
    setCustomFieldsLocal(newFields);
    reset({ ...watch(), customFields: newFields });
  };

  const handleCustomFieldKeyChange = (oldKey, newKey) => {
    if (!newKey || newKey === oldKey) return;
    const newFields = {};
    Object.entries(customFieldsLocal).forEach(([k, v]) => {
      newFields[k === oldKey ? newKey : k] = v;
    });
    setCustomFieldsLocal(newFields);
    reset({ ...watch(), customFields: newFields });
  };

  const handleCustomFieldValueChange = (key, value) => {
    const newFields = { ...customFieldsLocal, [key]: value };
    setCustomFieldsLocal(newFields);
    reset({ ...watch(), customFields: newFields });
  };

  const sanitizeValue = (value) => (typeof value === 'string' ? value.trim() : value);

  const handleFormSubmit = async (formData) => {
    const formatTime = (timeValue) => {
      if (!timeValue) return '';
      if (typeof timeValue === 'string') return timeValue;
      return timeValue.format('HH:mm');
    };

    if (formData.appointmentDate && dayjs.isDayjs(formData.appointmentDate)) {
      const today = dayjs().startOf('day');
      if (formData.appointmentDate.isBefore(today)) {
        setError('appointmentDate', {
          type: 'manual',
          message: 'Appointment date cannot be in the past',
        });
        setConflictError('Appointment date cannot be in the past. Please select a future date.');
        return;
      }
    }

    const startTimeStr = formatTime(formData.startTime);
    const endTimeStr = formatTime(formData.endTime);

    if (startTimeStr && endTimeStr) {
      const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      const startMinutes = parseTime(startTimeStr);
      const endMinutes = parseTime(endTimeStr);
      const duration = endMinutes - startMinutes;

      if (duration <= 0) {
        setError('endTime', { type: 'manual', message: 'End time must be after start time' });
        setError('startTime', { type: 'manual', message: 'Start time must be before end time' });
        setConflictError('End time must be after start time. Please adjust the times.');
        return;
      }

      if (duration < 5) {
        setError('endTime', { type: 'manual', message: 'Appointment duration must be at least 5 minutes' });
        setConflictError('Appointment duration must be at least 5 minutes. Please adjust the times.');
        return;
      }
    }

    const appointmentDuration = formData.durationMinutes || 30;

    if (!isEditMode) {
      const hasConflict = await checkAppointmentConflict(
        formData.providerId, formData.appointmentDate,
        formData.startTime, formData.endTime, null, appointmentDuration
      );
      if (hasConflict) {
        setError('startTime', { type: 'manual', message: conflictError || 'This time slot conflicts with an existing appointment or slot not exist' });
        setError('endTime', { type: 'manual', message: conflictError || 'This time slot conflicts with an existing appointment or slot not exist' });
        return;
      }
    } else {
      const appointmentId = initialData?._id || initialData?.id;
      if (appointmentId) {
        const hasConflict = await checkAppointmentConflict(
          formData.providerId, formData.appointmentDate,
          formData.startTime, formData.endTime, appointmentId, appointmentDuration
        );
        if (hasConflict) {
          setError('startTime', { type: 'manual', message: conflictError || 'This time slot conflicts with an existing appointment' });
          setError('endTime', { type: 'manual', message: conflictError || 'This time slot conflicts with an existing appointment' });
          return;
        }
      }
    }

    const sanitizedData = {
      ...formData,
      appointmentDate: formData.appointmentDate ? formData.appointmentDate.format('YYYY-MM-DD') : '',
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      durationMinutes: formData.durationMinutes ? Number(formData.durationMinutes) : undefined,
      chiefComplaint: sanitizeValue(formData.chiefComplaint) || undefined,
      notes: sanitizeValue(formData.notes) || undefined,
      roomId: sanitizeValue(formData.roomId) || undefined,
      interpreterLanguage: formData.requiresInterpreter
        ? sanitizeValue(formData.interpreterLanguage) || undefined
        : undefined,
      copayCollected: formData.copayCollected ? Number(formData.copayCollected) : undefined,
      reminderSent: formData.reminderSent || false,
      status: formData.status || 'scheduled',
      customFields:
        formData.customFields && Object.keys(formData.customFields).length > 0
          ? Object.fromEntries(
              Object.entries(formData.customFields).filter(
                ([key, value]) => key && value && key.trim() !== '' && value.toString().trim() !== ''
              )
            )
          : undefined,
    };

    onSubmit(sanitizedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
        <Dialog
          open={!!conflictError}
          onClose={() => { setConflictError(''); setAvailableSlots([]); }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="error">Conflict Detected</Typography>
              <IconButton size="small" onClick={() => { setConflictError(''); setAvailableSlots([]); }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>{conflictError}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {availableSlots.length > 0
                ? 'Please select an available time slot below or add this appointment to the waitlist.'
                : 'You can either change the appointment time or add this appointment to the waitlist for later scheduling.'}
            </Typography>

            {availableSlots.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Available Time Slots for {conflictDate && dayjs(conflictDate).format('MMMM DD, YYYY')}:
                </Typography>
                <Box
                  sx={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    mt: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Grid container spacing={1}>
                    {availableSlots.map((slot, index) => {
                      const [hours, minutes] = slot.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      const formattedTime = `${displayHour}:${minutes} ${ampm}`;

                      const slotStart = dayjs(`${conflictDate} ${slot}`);
                      const slotEnd = slotStart.add(conflictDuration, 'minute');
                      const endTimeStr = slotEnd.format('HH:mm');
                      const [endHours, endMinutes] = endTimeStr.split(':');
                      const endHour = parseInt(endHours);
                      const endAmpm = endHour >= 12 ? 'PM' : 'AM';
                      const endDisplayHour = endHour % 12 || 12;
                      const formattedEndTime = `${endDisplayHour}:${endMinutes} ${endAmpm}`;

                      return (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              const selectedStart = dayjs(`${conflictDate} ${slot}`);
                              const selectedEnd = selectedStart.add(conflictDuration, 'minute');
                              reset({ ...watch(), startTime: selectedStart, endTime: selectedEnd });
                              setConflictError('');
                              setAvailableSlots([]);
                            }}
                            sx={{
                              py: 1.5,
                              borderColor: 'primary.main',
                              '&:hover': { borderColor: 'primary.dark', bgcolor: 'primary.50' },
                            }}
                          >
                            <Box>
                              <Typography variant="body2" fontWeight="medium">{formattedTime}</Typography>
                              <Typography variant="caption" color="text.secondary">- {formattedEndTime}</Typography>
                            </Box>
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setConflictError(''); setAvailableSlots([]); }} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleAddToWaitlist}
              variant="contained"
              color="secondary"
              startIcon={addingToWaitlist ? <CircularProgress size={16} color="inherit" /> : <WaitlistIcon />}
              disabled={addingToWaitlist}
            >
              Add to Waitlist
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={checkingConflict && !conflictError}
          onClose={() => setCheckingConflict(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Checking Availability</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography>Checking appointment availability...</Typography>
            </Box>
          </DialogContent>
        </Dialog>

        {conflictError && (
          <Grid size={12}>
            <Alert
              severity="error"
              icon={<ErrorIcon />}
              sx={{ mb: 2 }}
              action={
                <IconButton size="small" onClick={() => setConflictError('')} color="inherit">
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Appointment Conflict Detected
              </Typography>
              <Typography variant="body2">{conflictError}</Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Please select a different time slot or provider to continue.
              </Typography>
            </Alert>
          </Grid>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="patientId"
              control={control}
              rules={appointmentValidations.patientId}
              render={({ field }) => {
                const selectedPatient = patients.find((p) => (p._id || p.id) === field.value);
                return (
                  <Autocomplete
                    disabled={isEditMode}
                    options={patients}
                    loading={loadingPatients}
                    getOptionLabel={(option) =>
                      option ? `${option.firstName} ${option.lastName} (${option.patientCode})` : ''
                    }
                    value={selectedPatient || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                      if (!newValue) setInsuranceEligibility(null);
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        if (patientSearchTimerRef.current) clearTimeout(patientSearchTimerRef.current);
                        patientSearchTimerRef.current = setTimeout(() => {
                          onPatientSearch?.(newInputValue);
                        }, 300);
                      } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
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
                        placeholder="Search patient by name or code..."
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
                    noOptionsText={loadingPatients ? 'Searching...' : 'No patients found'}
                    filterOptions={(x) => x}
                  />
                );
              }}
            />
          </Grid>

          {/* Insurance Eligibility Display */}
          {insuranceEligibility && (
            <Grid size={12}>
              <Alert
                severity={
                  insuranceEligibility.status === 'verified'
                    ? 'success'
                    : insuranceEligibility.status === 'pending'
                    ? 'warning'
                    : insuranceEligibility.status === 'failed' || insuranceEligibility.status === 'inactive'
                    ? 'error'
                    : 'info'
                }
                icon={
                  insuranceEligibility.status === 'verified' ? (
                    <CheckCircleIcon />
                  ) : insuranceEligibility.status === 'no_insurance' ? (
                    <InsuranceIcon />
                  ) : (
                    <ErrorIcon />
                  )
                }
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: insuranceEligibility.copayAmount ? 1 : 0,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    label={
                      insuranceEligibility.status === 'verified'
                        ? 'VERIFIED'
                        : insuranceEligibility.status === 'pending'
                        ? 'PENDING'
                        : insuranceEligibility.status === 'failed'
                        ? 'FAILED'
                        : insuranceEligibility.status === 'inactive'
                        ? 'INACTIVE'
                        : 'NO INSURANCE'
                    }
                    size="small"
                    color={
                      insuranceEligibility.status === 'verified'
                        ? 'success'
                        : insuranceEligibility.status === 'pending'
                        ? 'warning'
                        : insuranceEligibility.status === 'no_insurance'
                        ? 'default'
                        : 'error'
                    }
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {insuranceEligibility.insuranceName}
                  </Typography>
                  {insuranceEligibility.copayAmount != null && (
                    <Chip
                      icon={<MoneyIcon fontSize="small" />}
                      label={`Copay: $${insuranceEligibility.copayAmount}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
                {insuranceEligibility.status === 'no_insurance' && (
                  <Typography variant="caption" color="text.secondary">
                    No active primary insurance found for this patient.
                  </Typography>
                )}
                {insuranceEligibility.status === 'pending' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <InfoIcon fontSize="small" color="warning" />
                    <Typography variant="caption">
                      Insurance eligibility has not been verified yet.
                    </Typography>
                  </Box>
                )}
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="providerId"
              control={control}
              rules={appointmentValidations.providerId}
              render={({ field }) => {
                const selectedProvider = providers.find((p) => (p._id || p.id) === field.value);
                return (
                  <Autocomplete
                    options={providers}
                    getOptionLabel={(option) =>
                      option ? `${option.firstName} ${option.lastName}` : ''
                    }
                    value={selectedProvider || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Provider *"
                        error={!!errors.providerId}
                        helperText={errors.providerId?.message}
                        placeholder="Select a provider..."
                      />
                    )}
                    noOptionsText="No providers found"
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const searchLower = inputValue.toLowerCase();
                      return options.filter(
                        (option) =>
                          option.firstName?.toLowerCase().includes(searchLower) ||
                          option.lastName?.toLowerCase().includes(searchLower)
                      );
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="appointmentTypeId"
              control={control}
              rules={appointmentValidations.appointmentTypeId}
              render={({ field }) => {
                const selectedType = appointmentTypes.find((t) => (t._id || t.id) === field.value);
                return (
                  <Autocomplete
                    options={appointmentTypes}
                    getOptionLabel={(option) => (option ? option.name : '')}
                    value={selectedType || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Appointment Type *"
                        error={!!errors.appointmentTypeId}
                        helperText={errors.appointmentTypeId?.message}
                        placeholder="Select an appointment type..."
                      />
                    )}
                    noOptionsText="No appointment types found"
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const searchLower = inputValue.toLowerCase();
                      return options.filter((option) =>
                        option.name?.toLowerCase().includes(searchLower)
                      );
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="appointmentDate"
              control={control}
              rules={appointmentValidations.appointmentDate}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Appointment Date *"
                  minDate={dayjs()}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.appointmentDate,
                      helperText: errors.appointmentDate?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="startTime"
              control={control}
              rules={appointmentValidations.startTime}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="Start Time *"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    setStartTimeManuallySet(true);
                    setDurationError('');

                    if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
                      const currentEndTime = watch('endTime');
                      const currentDuration = watch('durationMinutes');

                      if (
                        endTimeManuallySet &&
                        currentEndTime &&
                        dayjs.isDayjs(currentEndTime) &&
                        currentEndTime.isValid()
                      ) {
                        const calculatedDuration = calculateDurationFromTimes(newValue, currentEndTime);
                        if (calculatedDuration && calculatedDuration >= 5) {
                          reset({ ...watch(), startTime: newValue, durationMinutes: calculatedDuration });
                        }
                      } else if (currentDuration && currentDuration >= 5) {
                        const calculatedEndTime = calculateEndTimeFromStart(newValue, currentDuration);
                        if (calculatedEndTime) {
                          reset({ ...watch(), startTime: newValue, endTime: calculatedEndTime });
                        }
                      }
                    }

                    setConflictError('');
                    clearErrors('startTime');
                    clearErrors('endTime');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startTime,
                      helperText: errors.startTime?.message,
                    },
                  }}
                  disabled={checkingConflict}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="endTime"
              control={control}
              rules={appointmentValidations.endTime}
              render={({ field }) => {
                let minTime = null;
                if (startTime && dayjs.isDayjs(startTime) && startTime.isValid()) {
                  minTime = startTime.add(5, 'minute');
                }

                return (
                  <TimePicker
                    {...field}
                    label="End Time *"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      setEndTimeManuallySet(true);
                      setDurationError('');

                      if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
                        const currentStartTime = watch('startTime');
                        const currentDuration = watch('durationMinutes');

                        if (
                          startTimeManuallySet &&
                          currentStartTime &&
                          dayjs.isDayjs(currentStartTime) &&
                          currentStartTime.isValid()
                        ) {
                          const calculatedDuration = calculateDurationFromTimes(currentStartTime, newValue);
                          if (calculatedDuration && calculatedDuration >= 5) {
                            reset({ ...watch(), endTime: newValue, durationMinutes: calculatedDuration });
                          }
                        } else if (currentDuration && currentDuration >= 5) {
                          const calculatedStartTime = calculateStartTimeFromEnd(newValue, currentDuration);
                          if (calculatedStartTime) {
                            reset({ ...watch(), endTime: newValue, startTime: calculatedStartTime });
                          }
                        }
                      }

                      setConflictError('');
                      clearErrors('startTime');
                      clearErrors('endTime');
                    }}
                    minTime={minTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endTime || !!conflictError,
                        helperText:
                          errors.endTime?.message ||
                          (conflictError && checkingConflict
                            ? 'Checking availability...'
                            : conflictError
                            ? 'Time slot has conflicts'
                            : ''),
                        InputProps: conflictError
                          ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip title="Time slot has conflicts">
                                    <ErrorIcon color="error" fontSize="small" />
                                  </Tooltip>
                                </InputAdornment>
                              ),
                            }
                          : undefined,
                      },
                    }}
                    disabled={checkingConflict}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              {...register('durationMinutes', {
                ...appointmentValidations.durationMinutes,
                onChange: (e) => {
                  const newDuration = parseInt(e.target.value, 10);
                  const currentStartTime = watch('startTime');
                  const currentEndTime = watch('endTime');
                  const hasValidStartTime =
                    currentStartTime && dayjs.isDayjs(currentStartTime) && currentStartTime.isValid();
                  const hasValidEndTime =
                    currentEndTime && dayjs.isDayjs(currentEndTime) && currentEndTime.isValid();

                  if (hasValidStartTime && hasValidEndTime && startTimeManuallySet && endTimeManuallySet) {
                    setDurationError('Please adjust the start-time and end-time');
                    return;
                  }

                  setDurationError('');

                  if (newDuration >= 5) {
                    if (hasValidStartTime && !endTimeManuallySet) {
                      const calculatedEndTime = calculateEndTimeFromStart(currentStartTime, newDuration);
                      if (calculatedEndTime) {
                        reset({ ...watch(), durationMinutes: newDuration, endTime: calculatedEndTime });
                      }
                    } else if (hasValidEndTime && !startTimeManuallySet) {
                      const calculatedStartTime = calculateStartTimeFromEnd(currentEndTime, newDuration);
                      if (calculatedStartTime) {
                        reset({ ...watch(), durationMinutes: newDuration, startTime: calculatedStartTime });
                      }
                    }
                  }
                },
              })}
              error={!!errors.durationMinutes || !!durationError}
              helperText={
                durationError ||
                errors.durationMinutes?.message ||
                'End time will be calculated automatically based on start time and duration'
              }
              inputProps={{ min: 5 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="roomId"
              control={control}
              render={({ field }) => {
                const selectedRoom = rooms.find((r) => (r._id || r.id) === field.value);
                return (
                  <Autocomplete
                    options={rooms}
                    getOptionLabel={(option) => (option ? option.name : '')}
                    value={selectedRoom || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue._id || newValue.id : '');
                    }}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Room"
                        error={!!errors.roomId}
                        helperText={errors.roomId?.message}
                        placeholder="Select a room..."
                      />
                    )}
                    noOptionsText="No rooms found"
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const searchLower = inputValue.toLowerCase();
                      return options.filter((option) =>
                        option.name?.toLowerCase().includes(searchLower)
                      );
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Chief Complaint"
              multiline
              rows={2}
              {...register('chiefComplaint', appointmentValidations.chiefComplaint)}
              error={!!errors.chiefComplaint}
              helperText={errors.chiefComplaint?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              {...register('notes', appointmentValidations.notes)}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  {...register('requiresInterpreter')}
                  defaultChecked={initialData?.requiresInterpreter || false}
                />
              }
              label="Requires Interpreter"
            />
          </Grid>

          {requiresInterpreter && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="interpreterLanguage"
                control={control}
                rules={{
                  validate: (value) => {
                    if (requiresInterpreter && (!value || value.trim() === '')) {
                      return 'Interpreter language is required when interpreter is needed';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.interpreterLanguage}>
                    <InputLabel id="interpreter-language-label">Interpreter Language *</InputLabel>
                    <Select {...field} labelId="interpreter-language-label" label="Interpreter Language *">
                      <MenuItem value=""><em>Select a language</em></MenuItem>
                      {languages.map((lang) => (
                        <MenuItem key={lang._id || lang.code} value={lang.name}>
                          {lang.name}
                          {lang.nativeName && lang.nativeName !== lang.name ? ` (${lang.nativeName})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.interpreterLanguage && (
                      <FormHelperText>{errors.interpreterLanguage.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  {...register('insuranceVerified')}
                  defaultChecked={initialData?.insuranceVerified || false}
                />
              }
              label="Insurance Verified"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Copay Collected"
              type="number"
              {...register('copayCollected', {
                ...appointmentValidations.copayCollected,
                validate: (value) => {
                  if (value === null || value === undefined || value === '') return true;
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 0) return 'Copay collected must be 0 or greater';
                  if (numValue > 999999.99) return 'Copay collected must be 999999.99 or less';
                  const decimalParts = String(value).split('.');
                  if (decimalParts.length > 1 && decimalParts[1].length > 2) {
                    return 'Copay collected cannot have more than 2 decimal places';
                  }
                  return true;
                },
              })}
              error={!!errors.copayCollected}
              helperText={errors.copayCollected?.message}
              inputProps={{ min: 0, step: 0.01 }}
              onKeyDown={(e) => {
                const value = e.target.value;
                const key = e.key;
                if (key === '.' && value.includes('.')) {
                  e.preventDefault();
                }
                const decimalParts = value.split('.');
                if (
                  decimalParts.length > 1 &&
                  decimalParts[1].length >= 2 &&
                  !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)
                ) {
                  const selectionStart = e.target.selectionStart;
                  const decimalIndex = value.indexOf('.');
                  if (selectionStart > decimalIndex) e.preventDefault();
                }
              }}
            />
          </Grid>

          {isEditMode && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('reminderSent')}
                    defaultChecked={initialData?.reminderSent || false}
                  />
                }
                label="Reminder Sent"
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={appointmentValidations.status}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'scheduled'}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Status"
                  >
                    {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3">
                Custom Fields ({Object.keys(customFieldsLocal).length}/{MAX_CUSTOM_FIELDS})
              </Typography>
              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddCustomField}
                disabled={Object.keys(customFieldsLocal).length >= MAX_CUSTOM_FIELDS}
              >
                Add Field
              </Button>
            </Box>
            {Object.keys(customFieldsLocal).length === 0 ? (
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  No custom fields added. Click "Add Field" to add custom fields.
                </Typography>
              </Paper>
            ) : (
              <>
                {Object.entries(customFieldsLocal).map(([key, value], index) => (
                  <Box key={`custom-field-${index}`} sx={{ width: '100%' }}>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                          fullWidth
                          label={`Field Name ${index + 1}`}
                          defaultValue={key}
                          onBlur={(e) => {
                            const newKey = e.target.value.trim();
                            if (newKey && newKey !== key) handleCustomFieldKeyChange(key, newKey);
                          }}
                          placeholder="e.g., Referral Source, Special Instructions"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={`Field Value ${index + 1}`}
                          defaultValue={value || ''}
                          onBlur={(e) => handleCustomFieldValueChange(key, e.target.value)}
                          placeholder="Enter the value"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: { xs: 0, sm: 1 } }}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveCustomField(key)}
                            title="Remove this field"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </>
            )}
          </Grid>

          {!hideButtons && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button type="button" variant="outlined" onClick={handleBack} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Appointment'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentForm;
