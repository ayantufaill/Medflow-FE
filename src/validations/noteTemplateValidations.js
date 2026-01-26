export const noteTemplateValidations = {
  name: {
    required: 'Template name is required',
    minLength: {
      value: 3,
      message: 'Template name must be at least 3 character',
    },
    maxLength: {
      value: 100,
      message: 'Template name must not exceed 100 characters',
    },
    validate: {
      notEmpty: (value) =>
        value.trim().length > 0 || 'Template name cannot be empty',
    },
  },
  description: {
    maxLength: {
      value: 500,
      message: 'Description must not exceed 500 characters',
    },
  },
  specialty: {
    maxLength: {
      value: 100,
      message: 'Specialty must not exceed 100 characters',
    },
  },
  templateStructure: {
    required: 'Template structure is required',
    validate: {
      isObject: (value) => {
        if (!value || typeof value !== 'object') {
          return 'Template structure must be a valid object';
        }
        return true;
      },
      notEmpty: (value) => {
        if (Object.keys(value).length === 0) {
          return 'Template structure cannot be empty';
        }
        return true;
      },
    },
  },
};
