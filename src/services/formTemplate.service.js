import apiClient from '../config/api';

// Backend enum (src/services/form-template.service.ts on Medflow-BE) — keep the label copy here
// since it's a UI concern; the value list itself must stay in sync with FORM_FIELD_TYPES server-side.
export const FORM_FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio' },
  { value: 'signature', label: 'Signature' },
];

// Field types that require a non-empty `options` array — mirrors OPTION_FIELD_TYPES server-side
// so the builder can validate before hitting the API instead of round-tripping a 400.
export const OPTION_FIELD_TYPES = new Set(['select', 'radio']);

export const TEMPLATE_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Admin-authored intake/consent form templates. Distinct from portal.service.js's
// /portal/forms* (patient submissions) — this is the /form-templates CRUD that defines
// what those submissions render and validate against.
export const formTemplateService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.includeInactive) query.append('includeInactive', 'true');
    const qs = query.toString();
    const response = await apiClient.get(`/form-templates${qs ? `?${qs}` : ''}`);
    return response.data.data || [];
  },

  async getByTemplateId(templateId) {
    const response = await apiClient.get(`/form-templates/${templateId}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/form-templates', payload);
    return response.data.data;
  },

  async update(templateId, payload) {
    const response = await apiClient.put(`/form-templates/${templateId}`, payload);
    return response.data.data;
  },

  async deactivate(templateId) {
    const response = await apiClient.patch(`/form-templates/${templateId}/deactivate`);
    return response.data.data;
  },
};
