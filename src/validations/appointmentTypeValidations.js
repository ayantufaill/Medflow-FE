/**
 * Appointment Type Form Validations
 *
 * This file contains all validation rules for appointment type-related forms.
 * These validations are compatible with react-hook-form.
 */

export const appointmentTypeValidations = {
  name: {
    required: 'Appointment type name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
    maxLength: {
      value: 100,
      message: 'Name must not exceed 100 characters',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Appointment type name is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters';
      }
      // Check for special characters (allow only letters, numbers, spaces, hyphens, and underscores)
      if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
        return 'Name cannot contain special characters. Only letters, numbers, spaces, hyphens, and underscores are allowed.';
      }
      return true;
    },
  },
  description: {
    required: false,
    maxLength: {
      value: 500,
      message: 'Description must not exceed 500 characters',
    },
  },
  defaultDuration: {
    required: 'Default duration is required',
    min: {
      value: 1,
      message: 'Default duration must be a positive integer greater than 0',
    },
    max: {
      value: 1440,
      message: 'Default duration cannot exceed 1440 minutes (24 hours)',
    },
    validate: (value) => {
      if (!value || value === '') {
        return 'Default duration is required';
      }
      const numValue = Number(value);
      if (isNaN(numValue) || !Number.isInteger(numValue) || numValue <= 0) {
        return 'Default duration must be a positive integer greater than 0';
      }
      if (numValue > 1440) {
        return 'Default duration cannot exceed 1440 minutes (24 hours)';
      }
      return true;
    },
  },
  defaultPrice: {
    required: false,
    min: {
      value: 0,
      message: 'Default price must be 0 or greater',
    },
    max: {
      value: 999999.99,
      message: 'Default price cannot exceed 999,999.99',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Default price must be 0 or greater';
      }
      if (numValue > 999999.99) {
        return 'Default price cannot exceed 999,999.99';
      }
      // Check for maximum 2 decimal places
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        return 'Price can have a maximum of 2 decimal places';
      }
      return true;
    },
  },
  colorCode: {
    required: false,
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return true; // Optional field
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) {
        return true;
      }
      // Check if it's a valid hex color
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (hexPattern.test(trimmed)) {
        return true;
      }
      // Check if it's a valid CSS color name (supports multi-word names like "sky blue", "pale green")
      const tempDiv = document.createElement('div');
      tempDiv.style.color = trimmed;
      document.body.appendChild(tempDiv);
      const computedColor = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      if (computedColor && computedColor !== '' && computedColor !== 'rgba(0, 0, 0, 0)') {
        return true;
      }
      return 'Color must be a valid hex color (e.g., #FF5733) or a valid color name (e.g., red, sky blue)';
    },
  },
  requiresAuthorization: {
    required: false,
  },
  bufferBefore: {
    required: false,
    min: {
      value: 0,
      message: 'Buffer before must be 0 or greater',
    },
    max: {
      value: 240,
      message: 'Buffer before cannot exceed 240 minutes (4 hours)',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Buffer before must be 0 or greater';
      }
      if (numValue > 240) {
        return 'Buffer before cannot exceed 240 minutes (4 hours)';
      }
      return true;
    },
  },
  bufferAfter: {
    required: false,
    min: {
      value: 0,
      message: 'Buffer after must be 0 or greater',
    },
    max: {
      value: 240,
      message: 'Buffer after cannot exceed 240 minutes (4 hours)',
    },
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Optional field
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        return 'Buffer after must be 0 or greater';
      }
      if (numValue > 240) {
        return 'Buffer after cannot exceed 240 minutes (4 hours)';
      }
      return true;
    },
  },
  isActive: {
    required: false,
    validate: (value) => {
      // Boolean fields are not required
      if (value === null || value === undefined) {
        return true; // Optional field
      }
      if (typeof value !== 'boolean') {
        return 'Active status must be a boolean';
      }
      return true;
    },
  },
};
