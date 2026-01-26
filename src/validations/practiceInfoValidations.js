/**
 * Practice Info Form Validations
 * 
 * This file contains all validation rules for practice info-related forms.
 * These validations are compatible with react-hook-form.
 */

import { EMAIL_PATTERN, PHONE_PATTERN, URL_PATTERN } from '../constants/global';

/**
 * Practice Info Form Validations
 */
export const practiceInfoValidations = {
  practiceName: {
    required: 'Practice name is required',
    minLength: {
      value: 2,
      message: 'Practice name must be at least 2 characters',
    },
    maxLength: {
      value: 200,
      message: 'Practice name must not exceed 200 characters',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Practice name cannot be empty or whitespace only',
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Email cannot be empty or whitespace only',
  },
  phone: {
    required: 'Phone is required',
    pattern: {
      value: PHONE_PATTERN,
      message: 'Please provide a valid phone number',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Phone cannot be empty or whitespace only',
  },
  fax: {
    pattern: {
      value: PHONE_PATTERN,
      message: 'Please provide a valid fax number',
    },
  },
  taxId: {
    maxLength: {
      value: 50,
      message: 'Tax ID must not exceed 50 characters',
    },
  },
  npiNumber: {
    maxLength: {
      value: 50,
      message: 'NPI number must not exceed 50 characters',
    },
  },
  website: {
    pattern: {
      value: URL_PATTERN,
      message: 'Please provide a valid website URL',
    },
  },
  billingContactEmail: {
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
  },
  address: {
    line1: {
      required: 'Address Line 1 is required',
      maxLength: {
        value: 200,
        message: 'Address line 1 must not exceed 200 characters',
      },
    },
    line2: {
      maxLength: {
        value: 200,
        message: 'Address line 2 must not exceed 200 characters',
      },
    },
    city: {
      required: 'City is required',
      maxLength: {
        value: 100,
        message: 'City must not exceed 100 characters',
      },
    },
    state: {
      required: 'State is required',
      maxLength: {
        value: 100,
        message: 'State must not exceed 100 characters',
      },
    },
    postalCode: {
      required: 'Postal Code is required',
      maxLength: {
        value: 20,
        message: 'Postal code must not exceed 20 characters',
      },
    },
  },
  timezone: {
    required: 'Timezone is required',
  },
  appointmentBufferMinutes: {
    valueAsNumber: true,
    min: {
      value: 0,
      message: 'Appointment buffer must be 0 or greater',
    },
    max: {
      value: 1440,
      message: 'Appointment buffer must not exceed 1440 minutes (24 hours)',
    },
  },
};

