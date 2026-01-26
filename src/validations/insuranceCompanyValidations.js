/**
 * Insurance Company Form Validations
 *
 * This file contains all validation rules for insurance company-related forms.
 * These validations are compatible with react-hook-form.
 */

import { EMAIL_PATTERN, PHONE_PATTERN } from '../constants/global';

/**
 * Insurance Company Form Validations
 */
export const insuranceCompanyValidations = {
  name: {
    required: 'Insurance company name is required',
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
        return 'Insurance company name is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters';
      }
      return true;
    },
  },
  payerId: {
    required: 'Payer ID is required',
    maxLength: {
      value: 20,
      message: 'Payer ID must not exceed 20 characters',
    },
    pattern: {
      value: /^[A-Za-z0-9]+$/,
      message: 'Payer ID cannot contain special characters',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Payer ID is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
        return 'Payer ID cannot contain special characters';
      }
      return true;
    },
  },
  phone: {
    required: 'Phone number is required',
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Phone number is required';
      }
      // react-phone-input-2 provides a valid phone number format
      // Check if the phone number has at least 7 digits (minimum valid phone length)
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        return 'Please provide a complete phone number';
      }
      if (digitsOnly.length > 15) {
        return 'Phone number is too long';
      }
      return true;
    },
  },
  addressLine1: {
    required: false,
    maxLength: {
      value: 200,
      message: 'Address line 1 must not exceed 200 characters',
    },
  },
  city: {
    required: 'City is required',
    maxLength: {
      value: 50,
      message: 'City must not exceed 50 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]+$/,
      message:
        'City can only contain letters, spaces, hyphens, and apostrophes',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'City is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!/^[A-Za-z\s'-]+$/.test(trimmed)) {
        return 'City can only contain letters, spaces, hyphens, and apostrophes';
      }
      return true;
    },
  },
  state: {
    required: 'State is required',
    maxLength: {
      value: 50,
      message: 'State must not exceed 50 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]+$/,
      message:
        'State can only contain letters, spaces, hyphens, and apostrophes',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'State is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!/^[A-Za-z\s'-]+$/.test(trimmed)) {
        return 'State can only contain letters, spaces, hyphens, and apostrophes';
      }
      return true;
    },
  },
  zipCode: {
    required: false,
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return true; // Optional field
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      // Remove any non-digit characters for validation
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (trimmed.length < 3 || trimmed.length > 10) {
        return 'Invalid postal code';
      }
      if (!/^\d+$/.test(digitsOnly)) {
        return 'Zip code must contain only numbers';
      }
      return true;
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
    validate: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Email is required';
      }
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!EMAIL_PATTERN.test(trimmed)) {
        return 'Invalid email address';
      }
      return true;
    },
  },
  isActive: {
    required: false,
  },
};
