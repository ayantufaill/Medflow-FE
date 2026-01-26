/**
 * Authentication Form Validations
 * 
 * This file contains all validation rules for authentication-related forms.
 * These validations are compatible with react-hook-form.
 */

import { EMAIL_PATTERN, PHONE_PATTERN, PASSWORD_STRENGTH_PATTERN } from '../constants/global';
/**
 * Login Form Validations
 */
export const loginValidations = {
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
  },
};

/**
 * Registration Form Validations
 */
export const registerValidations = {
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
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Invalid email address',
    },
  },
  phone: {
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
    // Optional - user can select a role during registration
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

