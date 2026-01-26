/**
 * Provider Form Validations
 *
 * This file contains all validation rules for provider-related forms.
 * These validations are compatible with react-hook-form.
 */

export const providerValidations = {
  userId: {
    required: 'User is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'User is required';
      }
      return true;
    },
  },
  npiNumber: {
    required: 'NPI Number is required',
    pattern: {
      value: /^\d{10}$/,
      message: 'NPI Number must be exactly 10 digits',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'NPI Number is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!/^\d{10}$/.test(trimmed)) {
        return 'NPI Number must be exactly 10 digits';
      }
      return true;
    },
  },
  licenseNumber: {
    required: 'License number is required',
    maxLength: {
      value: 50,
      message: 'License number must not exceed 50 characters',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'License number is required';
      }
      return true;
    },
  },
  specialty: {
    required: 'Specialty is required',
    validate: (value) => {
      if (!value) {
        return 'Specialty is required';
      }

      if (Array.isArray(value)) {
        const trimmed = value
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter((v) => v.length > 0);
        if (trimmed.length === 0) {
          return 'Specialty is required';
        }
        const hasTooLong = trimmed.some((v) => v.length > 100);
        if (hasTooLong) {
          return 'Specialty must not exceed 100 characters';
        }
        return true;
      }

      if (typeof value === 'string') {
        if (value.trim() === '') {
          return 'Specialty is required';
        }
        if (value.trim().length > 100) {
          return 'Specialty must not exceed 100 characters';
        }
        return true;
      }

      return 'Specialty is required';
    },
  },
  title: {
    required: 'Title is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Title is required';
      }
      const validTitles = ['MD', 'DO', 'NP', 'PA', 'RN', 'LPN', 'Other'];
      if (!validTitles.includes(value)) {
        return 'Invalid title selected';
      }
      return true;
    },
  },
  appointmentBufferMinutes: {
    required: 'Appointment buffer is required',
    min: {
      value: 0,
      message: 'Appointment buffer must be 0 or greater',
    },
    max: {
      value: 240,
      message: 'Appointment buffer must be 240 or less',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return 'Appointment buffer is required';
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Appointment buffer must be 0 or greater';
      }
      return true;
    },
  },
  maxDailyAppointments: {
    required: 'Max daily appointments is required',
    min: {
      value: 1,
      message: 'Max daily appointments must be 1 or greater',
    },
    max: {
      value: 100,
      message: 'Max daily appointments must be 100 or less',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return 'Max daily appointments is required';
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 1) {
        return 'Max daily appointments must be 1 or greater';
      }
      return true;
    },
  },
  consultationFee: {
    required: false,
    min: {
      value: 0,
      message: 'Consultation fee must be 0 or greater',
    },
    max: {
      value: 100000,
      message: 'Consultation fee must be 100000 or less',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Consultation fee must be 0 or greater';
      }
      return true;
    },
    pattern: {
      value: /^\d*(\.\d{0,2})?$/,
      message: 'Only two digits allowed after decimal',
    },
  },
  workingHours: {
    required: 'At least one day must be enabled with working hours',
    validate: (value) => {
      if (!value || typeof value !== 'object') {
        return 'Working hours is required';
      }
      // Check if at least one day is enabled
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
        const dayHours = value[day];
        return dayHours && dayHours.isAvailable === true;
      });
      if (!hasEnabledDay) {
        return 'At least one day must be enabled with working hours';
      }
      return true;
    },
    startTime: {
      validate: (value) => {
        // This will be validated at the form level
        return true;
      },
    },
    endTime: {
      validate: (value) => {
        // This will be validated at the form level
        return true;
      },
    },
  },
};
