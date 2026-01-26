/**
 * Waitlist Form Validations
 *
 * This file contains all validation rules for waitlist-related forms.
 * These validations are compatible with react-hook-form.
 */

import dayjs from 'dayjs';

export const waitlistValidations = {
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
  preferredDate: {
    required: false,
  },
  preferredTimeStart: {
    required: false,
    validate: (value) => {
      // Optional field - allow null/undefined/empty
      if (!value) {
        return true;
      }
      
      // If it's a dayjs object, it's valid (TimePicker returns dayjs objects)
      if (dayjs.isDayjs(value) && value.isValid()) {
        return true;
      }
      
      // If it's a string, validate the format
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') {
          return true; // Empty string is allowed (optional field)
        }
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
          return 'Preferred start time must be in HH:mm format (24-hour)';
        }
        return true;
      }
      
      // For any other type, consider it invalid
      return 'Preferred start time must be in HH:mm format (24-hour)';
    },
  },
  preferredTimeEnd: {
    required: false,
    validate: (value, formValues) => {
      // Optional field - allow null/undefined/empty
      if (!value) {
        return true;
      }
      
      // If it's a dayjs object, validate it
      if (dayjs.isDayjs(value) && value.isValid()) {
        // If both start and end times are provided, end should be after start
        if (formValues.preferredTimeStart) {
          let startTime = null;
          
          // Parse start time
          if (dayjs.isDayjs(formValues.preferredTimeStart)) {
            startTime = formValues.preferredTimeStart;
          } else if (typeof formValues.preferredTimeStart === 'string') {
            const [hours, minutes] = formValues.preferredTimeStart.split(':');
            if (hours && minutes) {
              startTime = dayjs()
                .hour(parseInt(hours, 10))
                .minute(parseInt(minutes, 10));
            }
          }
          
          if (startTime && startTime.isValid()) {
            const startMinutes = startTime.hour() * 60 + startTime.minute();
            const endMinutes = value.hour() * 60 + value.minute();
            if (endMinutes <= startMinutes) {
              return 'Preferred end time must be after start time';
            }
          }
        }
        return true;
      }
      
      // If it's a string, validate the format
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') {
          return true; // Empty string is allowed (optional field)
        }
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
          return 'Preferred end time must be in HH:mm format (24-hour)';
        }
        
        // If both start and end times are provided, end should be after start
        if (formValues.preferredTimeStart && trimmed) {
          let startTimeStr = '';
          if (dayjs.isDayjs(formValues.preferredTimeStart)) {
            startTimeStr = formValues.preferredTimeStart.format('HH:mm');
          } else if (typeof formValues.preferredTimeStart === 'string') {
            startTimeStr = formValues.preferredTimeStart;
          }
          
          if (startTimeStr) {
            const startParts = startTimeStr.split(':');
            const endParts = trimmed.split(':');
            const startMinutes =
              parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
            const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
            if (endMinutes <= startMinutes) {
              return 'Preferred end time must be after start time';
            }
          }
        }
        return true;
      }
      
      // For any other type, consider it invalid
      return 'Preferred end time must be in HH:mm format (24-hour)';
    },
  },
  priority: {
    required: false,
    validate: (value) => {
      if (!value) {
        return true; // Optional field
      }
      const validPriorities = ['urgent', 'normal', 'flexible'];
      if (!validPriorities.includes(value)) {
        return 'Invalid priority selected';
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
      const validStatuses = ['active', 'called', 'scheduled', 'expired'];
      if (!validStatuses.includes(value)) {
        return 'Invalid status selected';
      }
      return true;
    },
  },
  notes: {
    required: false,
    maxLength: {
      value: 1000,
      message: 'Notes must not exceed 1000 characters',
    },
  },
};
