export const PORTAL_FORM_TEMPLATES = {
  'demographics-update': {
    title: 'Demographics Update',
    fields: [
      { key: 'preferredName', label: 'Preferred Name', type: 'text' },
      { key: 'phonePrimary', label: 'Primary Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'addressLine1', label: 'Address Line 1', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'state', label: 'State', type: 'text' },
      { key: 'postalCode', label: 'Postal Code', type: 'text' },
      { key: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
      { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'text' },
      { key: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
  'medical-history-update': {
    title: 'Medical History Update',
    fields: [
      { key: 'allergies', label: 'Allergies', type: 'textarea' },
      { key: 'medications', label: 'Current Medications', type: 'textarea' },
      { key: 'conditions', label: 'Medical Conditions', type: 'textarea' },
      { key: 'pastSurgeries', label: 'Past Surgeries', type: 'textarea' },
      { key: 'familyHistory', label: 'Family History', type: 'textarea' },
      { key: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
  'consent-acknowledgement': {
    title: 'Consent Acknowledgement',
    fields: [
      { key: 'consentToTreatment', label: 'I consent to treatment', type: 'boolean', required: true },
      { key: 'privacyPolicyAcknowledged', label: 'I acknowledge privacy policy', type: 'boolean', required: true },
      { key: 'communicationConsent', label: 'I agree to communication via phone/email/SMS', type: 'boolean' },
      { key: 'signatureName', label: 'Full Name (Digital Signature)', type: 'text', required: true },
      { key: 'signedDate', label: 'Signed Date', type: 'date', required: true },
    ],
  },
};

export const getTemplateDefinition = (templateId) =>
  PORTAL_FORM_TEMPLATES[templateId] || null;

export const getDefaultFormData = (templateId) => {
  const template = getTemplateDefinition(templateId);
  if (!template) {
    return { response: '' };
  }

  return template.fields.reduce((acc, field) => {
    if (field.type === 'boolean') {
      acc[field.key] = false;
      return acc;
    }
    if (field.type === 'date') {
      acc[field.key] = '';
      return acc;
    }
    acc[field.key] = '';
    return acc;
  }, {});
};

export const normalizeFormDataForTemplate = (templateId, formData) => {
  const template = getTemplateDefinition(templateId);
  if (!template) {
    if (formData && typeof formData === 'object' && !Array.isArray(formData)) {
      return formData;
    }
    return { response: '' };
  }

  const defaults = getDefaultFormData(templateId);
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return defaults;
  }

  return { ...defaults, ...formData };
};

