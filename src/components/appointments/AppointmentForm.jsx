import { useEffect, useState, useCallback, useRef } from 'react';
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
  IconButton,
  Paper,
  Typography,
  Divider,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  PlaylistAdd as WaitlistIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { appointmentValidations } from '../../validations/appointmentValidations';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';
import { appointmentTypeService } from '../../services/appointment-type.service';
import { appointmentService } from '../../services/appointment.service';
import { roomService } from '../../services/room.service';
import { languageService } from '../../services/language.service';
import { waitlistService } from '../../services/waitlist.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const AppointmentForm = ({
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
  const [rooms, setRooms] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [patientSearch, setPatientSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  const [appointmentTypeSearch, setAppointmentTypeSearch] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingAppointmentTypes, setLoadingAppointmentTypes] = useState(false);
  const patientSearchTimerRef = useRef(null);
  const providerSearchTimerRef = useRef(null);
  const appointmentTypeSearchTimerRef = useRef(null);
  const [addingToWaitlist, setAddingToWaitlist] = useState(false);
  const { showSnackbar } = useSnackbar();

  const searchPatients = useCallback(async (search = '') => {
    try {
      setLoadingPatients(true);
      const result = await patientService.getAllPatients(
        1,
        20,
        search,
        'active'
      );
      setPatients(result.patients || []);
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  const searchProviders = useCallback(async (search = '') => {
    try {
      setLoadingProviders(true);
      const result = await providerService.getAllProviders(1, 20, search, true);
      setProviders(result.providers || []);
    } catch (err) {
      console.error('Error searching providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  const searchAppointmentTypes = useCallback(async (search = '') => {
    try {
      setLoadingAppointmentTypes(true);
      const result = await appointmentTypeService.getAllAppointmentTypes(
        1,
        20,
        search,
        true
      );
      setAppointmentTypes(result.appointmentTypes || []);
    } catch (err) {
      console.error('Error searching appointment types:', err);
    } finally {
      setLoadingAppointmentTypes(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found. Please log in again.');
          throw new Error('Authentication required. Please log in again.');
        }

        const [patientsResult, providersResult, typesResult, roomsResult, languagesResult] =
          await Promise.all([
            patientService.getAllPatients(1, 100, '', 'active'),
            providerService.getAllProviders(1, 100, '', true),
            appointmentTypeService.getAllAppointmentTypes(1, 100, '', true),
            roomService.getAllRooms(1, 100, '', true),
            languageService.getAllLanguages(true),
          ]);
        setPatients(patientsResult.patients || []);
        setProviders(providersResult.providers || []);
        setAppointmentTypes(typesResult.appointmentTypes || []);
        setRooms(roomsResult.rooms || []);
        setLanguages(languagesResult || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          console.error('Unauthorized. Token may be expired or invalid.');
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const [conflictError, setConflictError] = useState('');
  const [checkingConflict, setCheckingConflict] = useState(false);

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
      status: 'scheduled',
    },
    mode: 'onChange',
  });

  const requiresInterpreter = watch('requiresInterpreter');
  const customFields = watch('customFields') || {};
  const providerId = watch('providerId');
  const appointmentDate = watch('appointmentDate');
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

        // Parse time strings to minutes since midnight for comparison
        const parseTime = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const startMinutes = parseTime(startTimeStr);
        const endMinutes = parseTime(endTimeStr);

        // Calculate duration from times or use provided duration
        let calculatedDuration = endMinutes - startMinutes;
        const appointmentDuration =
          durationMinutesValue || calculatedDuration || 30;

        // Validate end time is after start time
        if (calculatedDuration <= 0) {
          setConflictError('End time must be after start time.');
          return true;
        }

        // First, check using available slots API (more efficient and considers working hours)
        // Only use this if we have all required data
        if (dateStr && providerIdValue && appointmentDuration) {
          try {
            const availableSlotsResult =
              await appointmentService.getAvailableSlots(
                providerIdValue,
                dateStr,
                appointmentDuration
              );

            const availableSlots = availableSlotsResult?.availableSlots || [];

            if (availableSlots.length === 0) {
              setConflictError(
                'No slots available for selected date and time.'
              );
              return true;
            }

            // Check if the selected start time is in the available slots
            const isSlotAvailable = availableSlots.some((slot) => {
              const slotTime = parseTime(slot);
              return slotTime === startMinutes;
            });

            if (!isSlotAvailable) {
              setConflictError(
                `This time slot is not available. The provider may have other appointments at this time. Please select an available time slot.`
              );
              return true;
            }
          } catch (slotsError) {
            console.warn(
              'Available slots API failed, using manual conflict check:',
              slotsError
            );
          }
        }

        // Also do manual conflict check as a backup (more detailed and accurate)
        try {
          const result = await appointmentService.getAllAppointments(
            1,
            100,
            providerIdValue,
            '',
            '',
            dateStr,
            dateStr,
            ''
          );

          const existingAppointments = result.appointments || [];

          // Check for daily max appointments limit
          const selectedProvider = providers.find(
            (p) => (p._id || p.id) === providerIdValue
          );
          if (selectedProvider?.maxDailyAppointments) {
            const activeAppointments = existingAppointments.filter(
              (apt) =>
                apt.status !== 'cancelled' &&
                apt.status !== 'no_show' &&
                (!excludeAppointmentId ||
                  (apt._id !== excludeAppointmentId &&
                    apt.id !== excludeAppointmentId))
            );
            if (
              activeAppointments.length >= selectedProvider.maxDailyAppointments
            ) {
              setConflictError(
                `The provider has reached the maximum daily appointments limit (${selectedProvider.maxDailyAppointments}). Please select a different date or provider.`
              );
              return true;
            }
          }

          const newStart = parseTime(startTimeStr);
          const newEnd = parseTime(endTimeStr);

          // Check for conflicts (excluding cancelled and no_show appointments)
          const conflictingAppointments = existingAppointments.filter((apt) => {
            if (
              excludeAppointmentId &&
              (apt._id === excludeAppointmentId ||
                apt.id === excludeAppointmentId)
            ) {
              return false;
            }

            if (apt.status === 'cancelled' || apt.status === 'no_show') {
              return false;
            }

            const aptStart = parseTime(apt.startTime);
            const aptEnd = parseTime(apt.endTime);

            const hasOverlap = newEnd > aptStart && newStart < aptEnd;
            return hasOverlap;
          });

          if (conflictingAppointments.length > 0) {
            const conflictDetails = conflictingAppointments
              .map((apt) => `${apt.startTime} - ${apt.endTime}`)
              .join(', ');
            const conflictMsg = `This time slot conflicts with existing appointment(s) at ${conflictDetails}. Please choose a different time.`;
            setConflictError(conflictMsg);
            return true;
          }

          setConflictError('');
          return false;
        } catch (conflictError) {
          console.error('Error checking appointment conflicts:', conflictError);
          setConflictError('');
          return false;
        }
      } catch (error) {
        console.error('Error checking appointment conflict:', error);
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Unable to verify provider availability. Please try again.';
        setConflictError(errorMessage);
        // Don't block submission if conflict check fails - let backend handle it
        return false;
      } finally {
        setCheckingConflict(false);
      }
    },
    []
  );

  // Auto-calculate end time when start time or duration changes (only if end time is not manually set)
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
    if (
      selectedType?.defaultDuration &&
      !startTimeManuallySet &&
      !endTimeManuallySet
    ) {
      const currentValues = watch();
      const currentDuration = currentValues.durationMinutes;
      const hasDurationAlreadySet = currentDuration && currentDuration > 0;
      if (!hasDurationAlreadySet && currentDuration !== selectedType.defaultDuration) {
        reset({
          ...currentValues,
          durationMinutes: selectedType.defaultDuration,
        });
      }
    }
  }, [
    appointmentTypeId,
    appointmentTypes,
    reset,
    watch,
    startTimeManuallySet,
    endTimeManuallySet,
  ]);

  const calculateEndTimeFromStart = useCallback((start, duration) => {
    if (
      !start ||
      !dayjs.isDayjs(start) ||
      !start.isValid() ||
      !duration ||
      duration < 5
    ) {
      return null;
    }
    return start.add(duration, 'minute');
  }, []);

  const calculateStartTimeFromEnd = useCallback((end, duration) => {
    if (
      !end ||
      !dayjs.isDayjs(end) ||
      !end.isValid() ||
      !duration ||
      duration < 5
    ) {
      return null;
    }
    return end.subtract(duration, 'minute');
  }, []);

  const calculateDurationFromTimes = useCallback((start, end) => {
    if (
      !start ||
      !end ||
      !dayjs.isDayjs(start) ||
      !dayjs.isDayjs(end) ||
      !start.isValid() ||
      !end.isValid()
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
      startTime &&
      dayjs.isDayjs(startTime) &&
      startTime.isValid() &&
      durationMinutes &&
      durationMinutes >= 5 &&
      !endTimeManuallySet
    ) {
      const calculatedEndTime = calculateEndTimeFromStart(
        startTime,
        durationMinutes
      );
      if (
        calculatedEndTime &&
        (!endTime || !dayjs.isDayjs(endTime) || !endTime.isValid())
      ) {
        reset({
          ...watch(),
          endTime: calculatedEndTime,
        });
      }
    }
  }, [
    startTime,
    durationMinutes,
    reset,
    watch,
    endTime,
    endTimeManuallySet,
    calculateEndTimeFromStart,
  ]);

  useEffect(() => {
    if (
      endTime &&
      dayjs.isDayjs(endTime) &&
      endTime.isValid() &&
      durationMinutes &&
      durationMinutes >= 5 &&
      !startTimeManuallySet &&
      endTimeManuallySet &&
      (!startTime || !dayjs.isDayjs(startTime) || !startTime.isValid())
    ) {
      const calculatedStartTime = calculateStartTimeFromEnd(
        endTime,
        durationMinutes
      );
      if (calculatedStartTime) {
        reset({
          ...watch(),
          startTime: calculatedStartTime,
        });
      }
    }
  }, [
    endTime,
    durationMinutes,
    reset,
    watch,
    startTime,
    startTimeManuallySet,
    endTimeManuallySet,
    calculateStartTimeFromEnd,
  ]);

  // Watch for changes and check conflicts
  useEffect(() => {
    if (providerId && appointmentDate && startTime && endTime) {
      const timeoutId = setTimeout(() => {
        const appointmentId = isEditMode
          ? initialData?._id || initialData?.id || null
          : null;
        checkAppointmentConflict(
          providerId,
          appointmentDate,
          startTime,
          endTime,
          appointmentId,
          durationMinutes
        );
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setConflictError('');
    }
  }, [
    providerId,
    appointmentDate,
    startTime,
    endTime,
    durationMinutes,
    isEditMode,
    initialData,
    checkAppointmentConflict,
  ]);

  useEffect(() => {
    if (initialData) {
      const parseTime = (timeValue) => {
        if (!timeValue) return null;

        // If it's already a dayjs object, return it
        if (dayjs.isDayjs(timeValue)) {
          return timeValue;
        }

        // If it's a Date object, convert to dayjs
        if (timeValue instanceof Date) {
          return dayjs(timeValue);
        }

        // If it's a string, parse it
        if (typeof timeValue === 'string') {
          // Check if it's in HH:mm format
          if (timeValue.includes(':')) {
            const [hours, minutes] = timeValue.split(':');
            return dayjs()
              .hour(parseInt(hours, 10))
              .minute(parseInt(minutes, 10));
          }
          // Otherwise try to parse as ISO string or other format
          return dayjs(timeValue);
        }

        // If it's a number (timestamp), convert it
        if (typeof timeValue === 'number') {
          return dayjs(timeValue);
        }

        // Fallback: try to parse with dayjs
        return dayjs(timeValue);
      };

      reset({
        patientId: initialData.patientId?._id || initialData.patientId || '',
        providerId: initialData.providerId?._id || initialData.providerId || '',
        appointmentTypeId:
          initialData.appointmentTypeId?._id ||
          initialData.appointmentTypeId ||
          '',
        appointmentDate: initialData.appointmentDate
          ? dayjs(initialData.appointmentDate)
          : null,
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
          initialData.customFields &&
          typeof initialData.customFields === 'object'
            ? initialData.customFields
            : {},
        status: initialData.status || 'scheduled',
      });
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

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
        preferredDate: formValues.appointmentDate ? formValues.appointmentDate.format('YYYY-MM-DD') : undefined,
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
        status: 'scheduled',
      });
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to add to waitlist',
        'error'
      );
    } finally {
      setAddingToWaitlist(false);
    }
  };

  const MAX_CUSTOM_FIELDS = 10;

  const handleAddCustomField = () => {
    if (Object.keys(customFieldsLocal).length >= MAX_CUSTOM_FIELDS) {
      return;
    }
    const newKey = `customField_${Object.keys(customFieldsLocal).length + 1}`;
    const newFields = { ...customFieldsLocal, [newKey]: '' };
    setCustomFieldsLocal(newFields);
    reset({
      ...watch(),
      customFields: newFields,
    });
  };

  const handleRemoveCustomField = (key) => {
    const newFields = { ...customFieldsLocal };
    delete newFields[key];
    setCustomFieldsLocal(newFields);
    reset({
      ...watch(),
      customFields: newFields,
    });
  };

  const handleCustomFieldKeyChange = (oldKey, newKey) => {
    if (!newKey || newKey === oldKey) return;
    const newFields = {};
    Object.entries(customFieldsLocal).forEach(([k, v]) => {
      if (k === oldKey) {
        newFields[newKey] = v;
      } else {
        newFields[k] = v;
      }
    });
    setCustomFieldsLocal(newFields);
    reset({
      ...watch(),
      customFields: newFields,
    });
  };

  const handleCustomFieldValueChange = (key, value) => {
    const newFields = { ...customFieldsLocal, [key]: value };
    setCustomFieldsLocal(newFields);
    reset({
      ...watch(),
      customFields: newFields,
    });
  };

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const handleFormSubmit = async (formData) => {
    // Validate end time is after start time
    const formatTime = (timeValue) => {
      if (!timeValue) return '';
      if (typeof timeValue === 'string') return timeValue;
      return timeValue.format('HH:mm');
    };

    // Validate appointment date is not in the past
    if (formData.appointmentDate && dayjs.isDayjs(formData.appointmentDate)) {
      const today = dayjs().startOf('day');
      if (formData.appointmentDate.isBefore(today)) {
        setError('appointmentDate', {
          type: 'manual',
          message: 'Appointment date cannot be in the past',
        });
        setConflictError(
          'Appointment date cannot be in the past. Please select a future date.'
        );
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
        setError('endTime', {
          type: 'manual',
          message: 'End time must be after start time',
        });
        setError('startTime', {
          type: 'manual',
          message: 'Start time must be before end time',
        });
        setConflictError(
          'End time must be after start time. Please adjust the times.'
        );
        return; // Prevent form submission
      }

      if (duration < 5) {
        setError('endTime', {
          type: 'manual',
          message: 'Appointment duration must be at least 5 minutes',
        });
        setConflictError(
          'Appointment duration must be at least 5 minutes. Please adjust the times.'
        );
        return; // Prevent form submission
      }
    }

    // Check for conflicts before submitting
    const appointmentDuration = formData.durationMinutes || 30;

    if (!isEditMode) {
      const hasConflict = await checkAppointmentConflict(
        formData.providerId,
        formData.appointmentDate,
        formData.startTime,
        formData.endTime,
        null,
        appointmentDuration
      );

      if (hasConflict) {
        setError('startTime', {
          type: 'manual',
          message:
            conflictError ||
            'This time slot conflicts with an existing appointment or slot not exist',
        });
        setError('endTime', {
          type: 'manual',
          message:
            conflictError ||
            'This time slot conflicts with an existing appointment or slot not exist',
        });
        return; // Prevent form submission
      }
    } else {
      // For edit mode, exclude current appointment from conflict check
      const appointmentId = initialData?._id || initialData?.id;
      if (appointmentId) {
        const hasConflict = await checkAppointmentConflict(
          formData.providerId,
          formData.appointmentDate,
          formData.startTime,
          formData.endTime,
          appointmentId,
          appointmentDuration
        );

        if (hasConflict) {
          setError('startTime', {
            type: 'manual',
            message:
              conflictError ||
              'This time slot conflicts with an existing appointment',
          });
          setError('endTime', {
            type: 'manual',
            message:
              conflictError ||
              'This time slot conflicts with an existing appointment',
          });
          return; // Prevent form submission
        }
      }
    }

    const sanitizedData = {
      ...formData,
      appointmentDate: formData.appointmentDate
        ? formData.appointmentDate.format('YYYY-MM-DD')
        : '',
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      durationMinutes: formData.durationMinutes
        ? Number(formData.durationMinutes)
        : undefined,
      chiefComplaint: sanitizeValue(formData.chiefComplaint) || undefined,
      notes: sanitizeValue(formData.notes) || undefined,
      roomId: sanitizeValue(formData.roomId) || undefined,
      interpreterLanguage: formData.requiresInterpreter
        ? sanitizeValue(formData.interpreterLanguage) || undefined
        : undefined,
      copayCollected: formData.copayCollected
        ? Number(formData.copayCollected)
        : undefined,
      reminderSent: formData.reminderSent || false,
      status: formData.status || 'scheduled',
      customFields:
        formData.customFields && Object.keys(formData.customFields).length > 0
          ? Object.fromEntries(
              Object.entries(formData.customFields).filter(
                ([key, value]) =>
                  key &&
                  value &&
                  key.trim() !== '' &&
                  value.toString().trim() !== ''
              )
            )
          : undefined,
    };

    onSubmit(sanitizedData);
  };

  if (loadingData) {
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
        <Dialog
          open={!!conflictError}
          onClose={() => setConflictError('')}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" color="error">
                Conflict Detected
              </Typography>
              <IconButton size="small" onClick={() => setConflictError('')}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>{conflictError}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              You can either change the appointment time or add this appointment to the waitlist for later scheduling.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConflictError('')}
              variant="outlined"
            >
              Change Time
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="patientId"
              control={control}
              rules={appointmentValidations.patientId}
              render={({ field }) => {
                const selectedPatient = patients.find(
                  (p) => (p._id || p.id) === field.value
                );
                return (
                  <Autocomplete
                    disabled={isEditMode}
                    options={patients}
                    loading={loadingPatients}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.firstName} ${option.lastName} (${option.patientCode})`
                        : ''
                    }
                    value={selectedPatient || null}
                    onChange={(event, newValue) => {
                      field.onChange(
                        newValue ? newValue._id || newValue.id : ''
                      );
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        if (patientSearchTimerRef.current) {
                          clearTimeout(patientSearchTimerRef.current);
                        }
                        patientSearchTimerRef.current = setTimeout(() => {
                          searchPatients(newInputValue);
                        }, 300);
                      } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
                        searchPatients('');
                      }
                    }}
                    onBlur={() => {
                      searchPatients('');
                    }}
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
                              {loadingPatients ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={
                      loadingPatients ? 'Searching...' : 'No patients found'
                    }
                    filterOptions={(x) => x}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="providerId"
              control={control}
              rules={appointmentValidations.providerId}
              render={({ field }) => {
                const selectedProvider = providers.find(
                  (p) => (p._id || p.id) === field.value
                );
                return (
                  <Autocomplete
                    options={providers}
                    loading={loadingProviders}
                    getOptionLabel={(option) => {
                      if (!option) return '';
                      const firstName = option.userId?.firstName || '';
                      const lastName = option.userId?.lastName || '';
                      const code = option.providerCode || '';
                      const name = `${firstName} ${lastName}`.trim();
                      return name
                        ? `${name} (${code})`
                        : code || 'Unknown Provider';
                    }}
                    value={selectedProvider || null}
                    onChange={(event, newValue) => {
                      field.onChange(
                        newValue ? newValue._id || newValue.id : ''
                      );
                      setConflictError('');
                      clearErrors('startTime');
                      clearErrors('endTime');
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        if (providerSearchTimerRef.current) {
                          clearTimeout(providerSearchTimerRef.current);
                        }
                        providerSearchTimerRef.current = setTimeout(() => {
                          searchProviders(newInputValue);
                        }, 300);
                      } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
                        searchProviders('');
                      }
                    }}
                    onBlur={() => {
                      searchProviders('');
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
                        placeholder="Search provider by name or code..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingProviders ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={
                      loadingProviders ? 'Searching...' : 'No providers found'
                    }
                    filterOptions={(x) => x}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="appointmentTypeId"
              control={control}
              render={({ field }) => {
                const selectedType = appointmentTypes.find(
                  (t) => (t._id || t.id) === field.value
                );
                return (
                  <Autocomplete
                    options={appointmentTypes}
                    loading={loadingAppointmentTypes}
                    getOptionLabel={(option) => (option ? option.name : '')}
                    value={selectedType || null}
                    onChange={(event, newValue) => {
                      field.onChange(
                        newValue ? newValue._id || newValue.id : ''
                      );
                      if (newValue?.defaultDuration) {
                        const currentValues = watch();
                        const currentStartTime = currentValues.startTime;
                        const currentDuration = currentValues.durationMinutes;
                        const hasDurationAlreadySet = currentDuration && currentDuration > 0;
                        const hasValidStartTime =
                          currentStartTime &&
                          dayjs.isDayjs(currentStartTime) &&
                          currentStartTime.isValid();

                        if (!hasDurationAlreadySet) {
                          const updates = {
                            ...currentValues,
                            durationMinutes: newValue.defaultDuration,
                          };

                          if (hasValidStartTime && !endTimeManuallySet) {
                            updates.endTime = calculateEndTimeFromStart(
                              currentStartTime,
                              newValue.defaultDuration
                            );
                          }

                          reset(updates);
                        }
                      }
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        if (appointmentTypeSearchTimerRef.current) {
                          clearTimeout(appointmentTypeSearchTimerRef.current);
                        }
                        appointmentTypeSearchTimerRef.current = setTimeout(
                          () => {
                            searchAppointmentTypes(newInputValue);
                          },
                          300
                        );
                      } else if (reason === 'clear' || (reason === 'reset' && !newInputValue)) {
                        searchAppointmentTypes('');
                      }
                    }}
                    onBlur={() => {
                      searchAppointmentTypes('');
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
                        placeholder="Search appointment type..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingAppointmentTypes ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={
                      loadingAppointmentTypes
                        ? 'Searching...'
                        : 'No appointment types found'
                    }
                    filterOptions={(x) => x}
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
                  value={field.value}
                  onChange={(newValue) => {
                    if (
                      newValue &&
                      dayjs.isDayjs(newValue) &&
                      newValue.isValid()
                    ) {
                      const today = dayjs().startOf('day');
                      if (newValue.isBefore(today)) {
                        setError('appointmentDate', {
                          type: 'manual',
                          message: 'Appointment date cannot be in the past',
                        });
                        return;
                      }
                    }
                    field.onChange(newValue);
                    clearErrors('appointmentDate');
                    setConflictError('');
                    clearErrors('startTime');
                    clearErrors('endTime');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.appointmentDate,
                      helperText: errors.appointmentDate?.message,
                      onBlur: () => {
                        const value = field.value;
                        if (value && dayjs.isDayjs(value) && value.isValid()) {
                          const today = dayjs().startOf('day');
                          if (value.isBefore(today)) {
                            setError('appointmentDate', {
                              type: 'manual',
                              message: 'Appointment date cannot be in the past',
                            });
                          }
                        }
                      },
                    },
                  }}
                  minDate={dayjs()}
                  disablePast
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

                    if (
                      newValue &&
                      dayjs.isDayjs(newValue) &&
                      newValue.isValid()
                    ) {
                      const currentEndTime = watch('endTime');
                      const currentDuration = watch('durationMinutes');

                      if (
                        endTimeManuallySet &&
                        currentEndTime &&
                        dayjs.isDayjs(currentEndTime) &&
                        currentEndTime.isValid()
                      ) {
                        const calculatedDuration = calculateDurationFromTimes(
                          newValue,
                          currentEndTime
                        );
                        if (calculatedDuration && calculatedDuration >= 5) {
                          reset({
                            ...watch(),
                            startTime: newValue,
                            durationMinutes: calculatedDuration,
                          });
                        }
                      } else if (currentDuration && currentDuration >= 5) {
                        const calculatedEndTime = calculateEndTimeFromStart(
                          newValue,
                          currentDuration
                        );
                        if (calculatedEndTime) {
                          reset({
                            ...watch(),
                            startTime: newValue,
                            endTime: calculatedEndTime,
                          });
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
                      error: !!errors.startTime || !!conflictError,
                      helperText:
                        errors.startTime?.message ||
                        (conflictError && checkingConflict
                          ? 'Checking availability...'
                          : ''),
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
                // Calculate minimum end time (start time + 5 minutes)
                let minTime = null;
                if (
                  startTime &&
                  dayjs.isDayjs(startTime) &&
                  startTime.isValid()
                ) {
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

                      if (
                        newValue &&
                        dayjs.isDayjs(newValue) &&
                        newValue.isValid()
                      ) {
                        const currentStartTime = watch('startTime');
                        const currentDuration = watch('durationMinutes');

                        if (
                          startTimeManuallySet &&
                          currentStartTime &&
                          dayjs.isDayjs(currentStartTime) &&
                          currentStartTime.isValid()
                        ) {
                          const calculatedDuration = calculateDurationFromTimes(
                            currentStartTime,
                            newValue
                          );
                          if (calculatedDuration && calculatedDuration >= 5) {
                            reset({
                              ...watch(),
                              endTime: newValue,
                              durationMinutes: calculatedDuration,
                            });
                          }
                        } else if (currentDuration && currentDuration >= 5) {
                          const calculatedStartTime = calculateStartTimeFromEnd(
                            newValue,
                            currentDuration
                          );
                          if (calculatedStartTime) {
                            reset({
                              ...watch(),
                              endTime: newValue,
                              startTime: calculatedStartTime,
                            });
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
                            : ''),
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
                    currentStartTime &&
                    dayjs.isDayjs(currentStartTime) &&
                    currentStartTime.isValid();
                  const hasValidEndTime =
                    currentEndTime &&
                    dayjs.isDayjs(currentEndTime) &&
                    currentEndTime.isValid();

                  if (
                    hasValidStartTime &&
                    hasValidEndTime &&
                    startTimeManuallySet &&
                    endTimeManuallySet
                  ) {
                    setDurationError(
                      'Please adjust the start-time and end-time'
                    );
                    return;
                  }

                  setDurationError('');

                  if (newDuration >= 5) {
                    if (hasValidStartTime && !endTimeManuallySet) {
                      const calculatedEndTime = calculateEndTimeFromStart(
                        currentStartTime,
                        newDuration
                      );
                      if (calculatedEndTime) {
                        reset({
                          ...watch(),
                          durationMinutes: newDuration,
                          endTime: calculatedEndTime,
                        });
                      }
                    } else if (hasValidEndTime && !startTimeManuallySet) {
                      const calculatedStartTime = calculateStartTimeFromEnd(
                        currentEndTime,
                        newDuration
                      );
                      if (calculatedStartTime) {
                        reset({
                          ...watch(),
                          durationMinutes: newDuration,
                          startTime: calculatedStartTime,
                        });
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
                const selectedRoom = rooms.find(
                  (r) => (r._id || r.id) === field.value
                );
                return (
                  <Autocomplete
                    options={rooms}
                    getOptionLabel={(option) => (option ? option.name : '')}
                    value={selectedRoom || null}
                    onChange={(event, newValue) => {
                      field.onChange(
                        newValue ? newValue._id || newValue.id : ''
                      );
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
              {...register(
                'chiefComplaint',
                appointmentValidations.chiefComplaint
              )}
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
                    <InputLabel id="interpreter-language-label">
                      Interpreter Language *
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="interpreter-language-label"
                      label="Interpreter Language *"
                    >
                      <MenuItem value="">
                        <em>Select a language</em>
                      </MenuItem>
                      {languages.map((lang) => (
                        <MenuItem key={lang._id || lang.code} value={lang.name}>
                          {lang.name} {lang.nativeName && lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
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
                  if (value === null || value === undefined || value === '') {
                    return true;
                  }
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 0) {
                    return 'Copay collected must be 0 or greater';
                  }
                  if (numValue > 999999.99) {
                    return 'Copay collected must be 999999.99 or less';
                  }
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
                  ![
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                  ].includes(key)
                ) {
                  const selectionStart = e.target.selectionStart;
                  const decimalIndex = value.indexOf('.');
                  if (selectionStart > decimalIndex) {
                    e.preventDefault();
                  }
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
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="checked_in">Checked In</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="no_show">No Show</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText>{errors.status.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
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
                  No custom fields added. Click "Add Field" to add custom
                  fields.
                </Typography>
              </Paper>
            ) : (
              <>
                {Object.entries(customFieldsLocal).map(
                  ([key, value], index) => (
                    <Box key={`custom-field-${index}`} sx={{ width: '100%' }}>
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField
                            fullWidth
                            label={`Field Name ${index + 1}`}
                            defaultValue={key}
                            onBlur={(e) => {
                              const newKey = e.target.value.trim();
                              if (newKey && newKey !== key) {
                                handleCustomFieldKeyChange(key, newKey);
                              }
                            }}
                            placeholder="e.g., Referral Source, Special Instructions"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label={`Field Value ${index + 1}`}
                            defaultValue={value || ''}
                            onBlur={(e) =>
                              handleCustomFieldValueChange(key, e.target.value)
                            }
                            placeholder="Enter the value"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              height: '100%',
                              pt: { xs: 0, sm: 1 },
                            }}
                          >
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
                  )
                )}
              </>
            )}
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
                    : 'Create Appointment'}
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
