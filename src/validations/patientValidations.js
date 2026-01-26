/**
 * Patient Form Validations
 *
 * This file contains all validation rules for patient-related forms.
 * These validations are compatible with react-hook-form.
 */

import { EMAIL_PATTERN, PHONE_PATTERN } from '../constants/global';

/**
 * Patient Form Validations
 */
export const patientValidations = {
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'First name must not exceed 50 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]+$/,
      message: 'First name should not contain numbers or special symbols',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'First name cannot be empty or whitespace only',
  },
  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Last name must not exceed 50 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]+$/,
      message: 'Last name should not contain numbers or special symbols',
    },
    validate: (value) =>
      value?.trim().length
        ? true
        : 'Last name cannot be empty or whitespace only',
  },
  middleName: {
    minLength: {
      value: 1,
      message: 'Middle name must be at least 1 character',
    },
    maxLength: {
      value: 50,
      message: 'Middle name must not exceed 50 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]*$/,
      message: 'Middle name should not contain numbers or special symbols',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Middle name cannot be whitespace only';
      }
      return true;
    },
  },
  preferredName: {
    minLength: {
      value: 1,
      message: 'Preferred name must be at least 1 character',
    },
    maxLength: {
      value: 50,
      message: 'Preferred name must not exceed 50 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Preferred name cannot be whitespace only';
      }
      return true;
    },
  },
  dateOfBirth: {
    required: 'Date of birth is required',
    validate: (value) => {
      if (!value) return 'Date of birth is required';
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'Invalid date';
      const today = new Date();
      if (date > today) return 'Date of birth cannot be in the future';

      // Check age < 150 years
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (actualAge >= 150) return 'Patient age must be less than 150 years';

      return true;
    },
  },
  gender: {
    required: 'Gender is required',
    validate: (value) => {
      if (!value) return 'Gender is required';
      const validGenders = [
        'male',
        'female',
        'non_binary',
        'prefer_not_to_say',
        'unknown',
      ];
      return validGenders.includes(value) || 'Invalid gender value';
    },
  },
  ssn: {
    validate: (value) => {
      if (!value) return true; // Optional
      // Remove hyphens for validation
      const digitsOnly = value.replace(/-/g, '');
      if (digitsOnly.length !== 9) {
        return 'SSN must contain exactly 9 digits';
      }
      if (!/^\d+$/.test(digitsOnly)) {
        return 'SSN must contain only numbers';
      }
      return true;
    },
  },
  phonePrimary: {
    validate: (value, formValues) => {
      // At least one of phone or email must be provided
      const hasPhone = value && value.trim().length > 0;
      const hasEmail = formValues.email && formValues.email.trim().length > 0;

      if (!hasPhone && !hasEmail) {
        return 'Either phone number or email is required';
      }

      if (hasPhone) {
        // Remove + and spaces for validation
        const cleanPhone = value.replace(/^\+/, '').replace(/\s/g, '');

        // International phone number validation
        // E.164 format: country code (1-3 digits) + subscriber number (max 15 total)
        // Minimum: 7 digits (some small countries), Maximum: 15 digits (E.164 standard)
        if (cleanPhone.length < 7) {
          return 'Phone number is too short. Please enter a complete phone number.';
        }
        if (cleanPhone.length > 15) {
          return 'Phone number is too long. Maximum 15 digits allowed.';
        }
        // Must contain only digits
        if (!/^\d+$/.test(cleanPhone)) {
          return 'Phone number must contain only digits';
        }
        // Validate country code (first 1-3 digits should be valid)
        // Country codes range from 1-3 digits, and the number should be reasonable
        if (cleanPhone.length < 8) {
          // Very short numbers might be incomplete
          return 'Phone number appears incomplete. Please check the country code and number.';
        }
      }

      return true;
    },
  },
  phoneSecondary: {
    validate: (value) => {
      // Optional field - if provided, must be valid
      if (!value || !value.trim()) {
        return true; // Optional field
      }

      const cleanPhone = value.replace(/^\+/, '').replace(/\s/g, '');

      // International phone number validation
      // E.164 format: country code (1-3 digits) + subscriber number (max 15 total)
      if (cleanPhone.length < 7) {
        return 'Phone number is too short. Please enter a complete phone number.';
      }
      if (cleanPhone.length > 15) {
        return 'Phone number is too long. Maximum 15 digits allowed.';
      }
      // Must contain only digits
      if (!/^\d+$/.test(cleanPhone)) {
        return 'Phone number must contain only digits';
      }
      if (cleanPhone.length < 8) {
        return 'Phone number appears incomplete. Please check the country code and number.';
      }

      return true;
    },
  },
  email: {
    validate: (value, formValues) => {
      // At least one of phone or email must be provided
      const hasPhone =
        formValues.phonePrimary && formValues.phonePrimary.trim().length > 0;
      const hasEmail = value && value.trim().length > 0;

      if (!hasPhone && !hasEmail) {
        return 'Either phone number or email is required';
      }

      if (hasEmail) {
        const trimmedEmail = value.trim();
        if (trimmedEmail.length === 0) {
          return 'Email cannot be whitespace only';
        }
        if (!EMAIL_PATTERN.test(trimmedEmail)) {
          return 'Invalid email address';
        }
      }

      return true;
    },
  },
  preferredLanguage: {
    validate: (value) => {
      if (!value) return true; // Optional, defaults to 'en'
      const validLanguages = ['en', 'es', 'fr', 'de'];
      return validLanguages.includes(value) || 'Invalid preferred language';
    },
  },
  communicationPreference: {
    validate: (value) => {
      if (!value) return true; // Optional, defaults to 'phone'
      const validPreferences = ['phone', 'email', 'sms', 'portal'];
      return (
        validPreferences.includes(value) || 'Invalid communication preference'
      );
    },
  },
  'address.line1': {
    required: 'Address line 1 is required',
    maxLength: {
      value: 100,
      message: 'Address line 1 must not exceed 100 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Address line 1 cannot be whitespace only';
      }
      return true;
    },
  },
  'address.line2': {
    maxLength: {
      value: 100,
      message: 'Address line 2 must not exceed 100 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Address line 2 cannot be whitespace only';
      }
      return true;
    },
  },
  'address.city': {
    required: 'City is required',
    maxLength: {
      value: 50,
      message: 'City must not exceed 50 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'City cannot be whitespace only';
      }
      return true;
    },
  },
  'address.state': {
    required: 'State is required',
    maxLength: {
      value: 50,
      message: 'State must not exceed 50 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'State cannot be whitespace only';
      }
      return true;
    },
  },
  'address.postalCode': {
    required: 'Postal code is required',
    validate: (value) => {
      if (!value || !value.trim()) {
        return 'Postal code is required';
      }
      // Remove any spaces or hyphens for validation
      const digitsOnly = value.replace(/[\s-]/g, '');
      // Check if it's only numbers and has 5 or 6 digits
      if (!/^\d+$/.test(digitsOnly)) {
        return 'Postal code must contain only numbers';
      }
      if (digitsOnly.length !== 5 && digitsOnly.length !== 6) {
        return 'Postal code must be 5 or 6 digits';
      }
      return true;
    },
  },
  'emergencyContact.name': {
    maxLength: {
      value: 100,
      message: 'Emergency contact name must not exceed 100 characters',
    },
    pattern: {
      value: /^[A-Za-z\s'-]+$/,
      message:
        'Emergency Contact name should not contain numbers or special symbols',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Emergency contact name cannot be whitespace only';
      }
      return true;
    },
  },
  'emergencyContact.relationship': {
    maxLength: {
      value: 50,
      message: 'Relationship must not exceed 50 characters',
    },
    validate: (value) => {
      if (value && value.trim().length === 0) {
        return 'Relationship cannot be whitespace only';
      }
      return true;
    },
  },
  'emergencyContact.phone': {
    validate: (value) => {
      // Optional field - if provided, must be valid
      if (!value || !value.trim()) {
        return true; // Optional field
      }

      const cleanPhone = value.replace(/^\+/, '').replace(/\s/g, '');

      // International phone number validation
      // E.164 format: country code (1-3 digits) + subscriber number (max 15 total)
      if (cleanPhone.length < 7) {
        return 'Phone number is too short. Please enter a complete phone number.';
      }
      if (cleanPhone.length > 15) {
        return 'Phone number is too long. Maximum 15 digits allowed.';
      }
      // Must contain only digits
      if (!/^\d+$/.test(cleanPhone)) {
        return 'Phone number must contain only digits';
      }
      if (cleanPhone.length < 8) {
        return 'Phone number appears incomplete. Please check the country code and number.';
      }

      return true;
    },
  },
  notes: {
    maxLength: {
      value: 1000,
      message: 'Notes must not exceed 1000 characters',
    },
  },
};
