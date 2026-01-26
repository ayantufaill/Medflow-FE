export const DOCUMENT_TYPES = [
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'id', label: 'ID Document' },
  { value: 'lab_result', label: 'Lab Result' },
  { value: 'imaging', label: 'Imaging/X-Ray' },
  { value: 'consent_form', label: 'Consent Form' },
  { value: 'treatment_plan', label: 'Treatment Plan' },
  { value: 'referral', label: 'Referral' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'other', label: 'Other' },
];

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateDocumentForm = (values) => {
  const errors = {};

  if (!values.patientId) {
    errors.patientId = 'Patient is required';
  }

  if (!values.documentName || values.documentName.trim() === '') {
    errors.documentName = 'Document name is required';
  } else if (values.documentName.length > 255) {
    errors.documentName = 'Document name cannot exceed 255 characters';
  }

  if (!values.documentType) {
    errors.documentType = 'Document type is required';
  }

  if (!values.storagePath && !values.file) {
    errors.file = 'File is required';
  }

  if (values.description && values.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  return errors;
};

export const getDocumentTypeLabel = (value) => {
  const type = DOCUMENT_TYPES.find((t) => t.value === value);
  return type ? type.label : value;
};

export const getDocumentTypeColor = (type) => {
  const colors = {
    insurance_card: 'primary',
    id: 'secondary',
    lab_result: 'error',
    imaging: 'warning',
    consent_form: 'info',
    treatment_plan: 'success',
    referral: 'default',
    prescription: 'primary',
    other: 'default',
  };
  return colors[type] || 'default';
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
