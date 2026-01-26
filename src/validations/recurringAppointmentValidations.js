/**
 * Recurring Appointment Form Validations
 *
 * This file contains all validation rules for recurring appointment-related forms.
 * These validations are compatible with react-hook-form.
 */

export const recurringAppointmentValidations = {
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
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Appointment type is required';
      }
      return true;
    },
  },
  frequency: {
    required: 'Frequency is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Frequency is required';
      }
      const validFrequencies = ['weekly', 'monthly', 'quarterly'];
      if (!validFrequencies.includes(value)) {
        return 'Invalid frequency selected';
      }
      return true;
    },
  },
  frequencyValue: {
    required: 'Frequency value is required',
    min: {
      value: 1,
      message: 'Frequency value must be at least 1',
    },
    max: {
      value: 52,
      message: 'Frequency value cannot exceed 52',
    },
    validate: (value) => {
      if (!value || value === '') {
        return 'Frequency value is required';
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 1) {
        return 'Frequency value must be at least 1';
      }
      if (numValue > 52) {
        return 'Frequency value cannot exceed 52';
      }
      return true;
    },
  },
  startDate: {
    required: 'Start date is required',
    validate: (value) => {
      if (!value) {
        return 'Start date is required';
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let dateValue;
      if (value && typeof value === 'object' && value.toDate) {
        dateValue = value.toDate();
      } else if (value instanceof Date) {
        dateValue = value;
      } else {
        dateValue = new Date(value);
      }
      dateValue.setHours(0, 0, 0, 0);
      if (dateValue < today) {
        return 'Start date cannot be in the past';
      }
      return true;
    },
  },
  endDate: {
    required: false,
    validate: (value, formValues) => {
      if (!value) {
        return true; // Optional field
      }
      if (
        formValues.startDate &&
        value &&
        value.isBefore(formValues.startDate)
      ) {
        return 'End date must be after start date';
      }
      return true;
    },
  },
  preferredTime: {
    required: 'Preferred time is required',
    validate: (value, formValues) => {
      if (!value) {
        return 'Preferred time is required';
      }
      
      let timeHours, timeMinutes;
      
      if (value && typeof value === 'object' && value.isValid && value.isValid()) {
        timeHours = value.hour();
        timeMinutes = value.minute();
      } else if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
          return 'Preferred time is required';
        }
        const match = trimmed.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (!match) {
          return 'Preferred time must be a valid time';
        }
        timeHours = parseInt(match[1], 10);
        timeMinutes = parseInt(match[2], 10);
      } else {
        return 'Preferred time must be a valid time';
      }
      
      if (formValues?.startDate) {
        const now = new Date();
        let startDateValue;
        if (formValues.startDate && typeof formValues.startDate === 'object' && formValues.startDate.toDate) {
          startDateValue = formValues.startDate.toDate();
        } else if (formValues.startDate instanceof Date) {
          startDateValue = formValues.startDate;
        } else {
          startDateValue = new Date(formValues.startDate);
        }
        
        const isToday = startDateValue.getFullYear() === now.getFullYear() &&
                        startDateValue.getMonth() === now.getMonth() &&
                        startDateValue.getDate() === now.getDate();
        
        if (isToday) {
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const selectedMinutes = timeHours * 60 + timeMinutes;
          if (selectedMinutes < currentMinutes) {
            return 'Cannot select a time in the past for today';
          }
        }
      }
      
      return true;
    },
  },
  preferredDayOfWeek: {
    required: false,
    min: {
      value: 0,
      message: 'Day of week must be between 0 and 6',
    },
    max: {
      value: 6,
      message: 'Day of week must be between 0 and 6',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 6) {
        return 'Day of week must be between 0 (Sunday) and 6 (Saturday)';
      }
      return true;
    },
  },
  totalAppointments: {
    required: false,
    min: {
      value: 1,
      message: 'Total appointments must be at least 1',
    },
    max: {
      value: 100,
      message: 'Total appointments cannot exceed 100',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 1) {
        return 'Total appointments must be at least 1';
      }
      if (numValue > 100) {
        return 'Total appointments cannot exceed 100';
      }
      return true;
    },
  },
  isActive: {
    required: false,
  },
};
