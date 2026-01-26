/**
 * Allergy Form Validations
 * 
 * This file contains all validation rules for allergy-related forms.
 * These validations are compatible with react-hook-form.
 */

/**
 * Allergy Form Validations
 */
export const allergyValidations = {
  patientId: {
    required: 'Patient is required',
    validate: (value) => {
      if (!value || value.trim() === '') {
        return 'Patient is required';
      }
      return true;
    },
  },
  allergen: {
    required: 'Allergen is required',
    minLength: {
      value: 1,
      message: 'Allergen must be at least 1 character',
    },
    maxLength: {
      value: 200,
      message: 'Allergen must not exceed 200 characters',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Allergen cannot be empty or whitespace only',
  },
  reaction: {
    required: 'Reaction is required',
    minLength: {
      value: 1,
      message: 'Reaction must be at least 1 character',
    },
    maxLength: {
      value: 500,
      message: 'Reaction must not exceed 500 characters',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Reaction cannot be empty or whitespace only',
  },
  severity: {
    required: 'Severity is required',
    validate: (value) => {
      if (!value) {
        return 'Severity is required';
      }
      if (!['mild', 'moderate', 'severe'].includes(value)) {
        return 'Severity must be one of: mild, moderate, severe';
      }
      return true;
    },
  },
  documentedDate: {
    required: 'Documented date is required',
    validate: (value) => {
      if (!value) {
        return 'Documented date is required';
      }
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        return 'Documented date must not be a future date';
      }
      return true;
    },
  },
  isActive: {
    // Optional boolean, no validation needed
  },
};

