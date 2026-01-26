/**
 * Appointment Form Validations
 *
 * This file contains all validation rules for appointment-related forms.
 * These validations are compatible with react-hook-form.
 */

export const appointmentValidations = {
  patientId: {
    required: 'Patient is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Patient is required';
      }
      return true;
    },
  },
  providerId: {
    required: 'Provider is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Provider is required';
      }
      return true;
    },
  },
  appointmentTypeId: {
    required: 'Appointment type is required',
  },
  appointmentDate: {
    required: 'Appointment date is required',
    validate: (value) => {
      if (!value) {
        return 'Appointment date is required';
      }
      return true;
    },
  },
  startTime: {
    required: 'Start time is required',
    validate: (value) => {
      if (!value) {
        return 'Start time is required';
      }
      // Handle dayjs object from TimePicker
      let timeString = '';
      if (typeof value === 'string') {
        timeString = value.trim();
      } else if (value && typeof value.format === 'function') {
        // dayjs object
        timeString = value.format('HH:mm');
      } else {
        return 'Start time must be in HH:mm format (24-hour)';
      }

      // Validate HH:mm format (strict two-digit hours)
      if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        return 'Start time must be in HH:mm format (24-hour)';
      }
      return true;
    },
  },
  endTime: {
    required: 'End time is required',
    validate: (value, formValues) => {
      if (!value) {
        return 'End time is required';
      }
      // Handle dayjs object from TimePicker
      let timeString = '';
      if (typeof value === 'string') {
        timeString = value.trim();
      } else if (value && typeof value.format === 'function') {
        // dayjs object
        timeString = value.format('HH:mm');
      } else {
        return 'End time must be in HH:mm format (24-hour)';
      }

      // Validate HH:mm format (strict two-digit hours)
      if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        return 'End time must be in HH:mm format (24-hour)';
      }

      // Check if end time is after start time
      const startTime = formValues.startTime;
      if (startTime) {
        let startTimeString = '';
        if (typeof startTime === 'string') {
          startTimeString = startTime.trim();
        } else if (startTime && typeof startTime.format === 'function') {
          startTimeString = startTime.format('HH:mm');
        }

        if (
          startTimeString &&
          /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(startTimeString)
        ) {
          // Parse times to minutes for comparison
          const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
          };

          const startMinutes = parseTime(startTimeString);
          const endMinutes = parseTime(timeString);
          const duration = endMinutes - startMinutes;

          if (duration <= 0) {
            return 'End time must be after start time';
          }

          if (duration < 5) {
            return 'Appointment duration must be at least 5 minutes';
          }
        }
      }

      return true;
    },
  },
  durationMinutes: {
    required: false,
    min: {
      value: 5,
      message: 'Duration must be at least 5 minutes',
    },
    max: {
      value: 1440,
      message: 'Duration must not exceed 1440 minutes (24 hours)',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 5) {
        return 'Duration must be at least 5 minutes';
      }
      return true;
    },
  },
  chiefComplaint: {
    required: false,
    maxLength: {
      value: 500,
      message: 'Chief complaint must not exceed 500 characters',
    },
  },
  notes: {
    required: false,
    maxLength: {
      value: 1000,
      message: 'Notes must not exceed 1000 characters',
    },
  },
  roomId: {
    required: false,
    maxLength: {
      value: 50,
      message: 'Room ID must not exceed 50 characters',
    },
  },
  requiresInterpreter: {
    required: false,
  },
  interpreterLanguage: {
    required: false,
    maxLength: {
      value: 50,
      message: 'Interpreter language must not exceed 50 characters',
    },
    validate: (value, formValues) => {
      if (
        formValues.requiresInterpreter &&
        (!value || (typeof value === 'string' && value.trim() === ''))
      ) {
        return 'Interpreter language is required when interpreter is needed';
      }
      return true;
    },
  },
  insuranceVerified: {
    required: false,
  },
  copayCollected: {
    required: false,
    min: {
      value: 0,
      message: 'Copay collected must be 0 or greater',
    },
    max: {
      value: 999999.99,
      message: 'Copay collected must be 999999.99 or less',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Copay collected must be 0 or greater';
      }
      return true;
    },
  },
  status: {
    required: false,
    validate: (value) => {
      if (!value) {
        return true; // Optional field
      }
      const validStatuses = [
        'scheduled',
        'confirmed',
        'checked_in',
        'completed',
        'cancelled',
        'no_show',
      ];
      if (!validStatuses.includes(value)) {
        return 'Invalid status selected';
      }
      return true;
    },
  },
  cancellationReason: {
    required: false,
    maxLength: {
      value: 500,
      message: 'Cancellation reason must not exceed 500 characters',
    },
  },
};
