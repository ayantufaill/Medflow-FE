/**
 * Payment Validations
 * Validation rules for payment forms
 */

export const paymentValidations = {
  patientId: {
    required: 'Patient is required',
  },
  amount: {
    required: 'Amount is required',
    min: {
      value: 0.01,
      message: 'Amount must be greater than $0.00',
    },
    max: {
      value: 1000000,
      message: 'Amount cannot exceed $1,000,000',
    },
  },
  paymentMethod: {
    required: 'Payment method is required',
  },
  paymentDate: {
    required: 'Payment date is required',
  },
  referenceNumber: {
    maxLength: {
      value: 50,
      message: 'Reference number cannot exceed 50 characters',
    },
  },
  notes: {
    maxLength: {
      value: 500,
      message: 'Notes cannot exceed 500 characters',
    },
  },
};

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵', requiresReference: false },
  { value: 'credit_card', label: 'Credit Card', icon: '💳', requiresReference: true },
  { value: 'debit_card', label: 'Debit Card', icon: '💳', requiresReference: true },
  { value: 'check', label: 'Check', icon: '📝', requiresReference: true },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', requiresReference: true },
  { value: 'other', label: 'Other', icon: '📱', requiresReference: false },
];
