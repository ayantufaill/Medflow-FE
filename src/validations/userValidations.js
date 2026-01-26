/**
 * User Form Validations
 * 
 * This file contains all validation rules for user-related forms.
 * These validations are compatible with react-hook-form.
 */

import { EMAIL_PATTERN, PHONE_PATTERN, PASSWORD_STRENGTH_PATTERN } from '../constants/global';

/**
 * User Form Validations
 */
export const userValidations = {
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
  email: {
    trim: true,
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: PHONE_PATTERN,
      message: 'Please provide a valid phone number',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long',
    },
    pattern: {
      value: PASSWORD_STRENGTH_PATTERN,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  },
  confirmPassword: (password) => ({
    required: 'Please confirm your password',
    validate: (value) => value === password || 'Passwords do not match',
  }),
  roleId: {
    required: 'Role is required',
    pattern: {
      value: /^[0-9a-fA-F]{24}$/,
      message: 'Invalid role ID',
    },
  },
  isActive: {
    required: 'User status is required',
    boolean: {
      value: true,
      message: 'User status must be a boolean',
    },
  },
};

/**
 * Helper function to get confirm password validation
 * This is a function because it needs the current password value
 * @param {string} password - The password field value to match against
 * @returns {object} Validation rules for confirm password
 */
export const getConfirmPasswordValidation = (password) => {
  return registerValidations.confirmPassword(password);
};

