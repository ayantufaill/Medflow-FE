/**
 * Service Catalog Validations
 * Validation rules for service/procedure forms
 */

export const serviceValidations = {
  cptCode: {
    required: 'CPT code is required',
    minLength: {
      value: 4,
      message: 'CPT code must be at least 4 characters',
    },
    maxLength: {
      value: 10,
      message: 'CPT code cannot exceed 10 characters',
    },
    pattern: {
      value: /^[A-Za-z0-9]+$/,
      message: 'CPT code can only contain letters and numbers',
    },
  },
  name: {
    required: 'Service name is required',
    minLength: {
      value: 3,
      message: 'Service name must be at least 3 characters',
    },
    maxLength: {
      value: 200,
      message: 'Service name cannot exceed 200 characters',
    },
  },
  description: {
    maxLength: {
      value: 1000,
      message: 'Description cannot exceed 1000 characters',
    },
  },
  category: {
    required: 'Category is required',
  },
  price: {
    required: 'Price is required',
    min: {
      value: 0,
      message: 'Price cannot be negative',
    },
    max: {
      value: 100000,
      message: 'Price cannot exceed $100,000',
    },
  },
  duration: {
    min: {
      value: 0,
      message: 'Duration cannot be negative',
    },
    max: {
      value: 480,
      message: 'Duration cannot exceed 8 hours (480 minutes)',
    },
  },
};
