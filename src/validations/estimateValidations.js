/**
 * Estimate Validations
 * Validation rules for treatment estimate forms
 */

export const estimateValidations = {
  patientId: {
    required: 'Patient is required',
  },
  providerId: {
    required: 'Provider is required',
  },
  title: {
    required: 'Title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters',
    },
    maxLength: {
      value: 200,
      message: 'Title cannot exceed 200 characters',
    },
  },
  validUntil: {
    required: 'Expiration date is required',
  },
  notes: {
    maxLength: {
      value: 1000,
      message: 'Notes cannot exceed 1000 characters',
    },
  },
};

export const ESTIMATE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'sent', label: 'Sent to Patient', color: 'info' },
  { value: 'accepted', label: 'Accepted', color: 'success' },
  { value: 'declined', label: 'Declined', color: 'error' },
  { value: 'expired', label: 'Expired', color: 'warning' },
  { value: 'converted', label: 'Converted to Invoice', color: 'primary' },
];
