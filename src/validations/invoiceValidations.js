/**
 * Invoice Validations
 * Validation rules for invoice forms
 */

export const invoiceValidations = {
  patientId: {
    required: 'Patient is required',
  },
  providerId: {
    required: 'Provider is required',
  },
  dateOfService: {
    required: 'Date of service is required',
  },
  dueDate: {
    required: 'Due date is required',
  },
  lineItems: {
    required: 'At least one line item is required',
  },
  notes: {
    maxLength: {
      value: 1000,
      message: 'Notes cannot exceed 1000 characters',
    },
  },
};

export const lineItemValidations = {
  serviceId: {
    required: 'Service is required',
  },
  quantity: {
    required: 'Quantity is required',
    min: {
      value: 1,
      message: 'Quantity must be at least 1',
    },
    max: {
      value: 100,
      message: 'Quantity cannot exceed 100',
    },
  },
  unitPrice: {
    required: 'Unit price is required',
    min: {
      value: 0,
      message: 'Price cannot be negative',
    },
  },
  discount: {
    min: {
      value: 0,
      message: 'Discount cannot be negative',
    },
  },
};

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'partially_paid', label: 'Partially Paid', color: 'info' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'overdue', label: 'Overdue', color: 'error' },
  { value: 'voided', label: 'Voided', color: 'default' },
];
