// Replaces the old portalFormTemplates.js hardcoded object. Template definitions now come
// from the live /form-templates API (see formTemplate.service.js) — these helpers operate on
// a `templatesById` map built from that response instead of a static import, so a template
// created in the admin Digital Forms builder shows up in the portal without a frontend deploy.

// Backend returns { templateId, name, description, fields, isActive, ... }; the render code
// below was written against { title, fields } — map name->title here so PortalFormsPage /
// PortalFormDetailPage didn't need a wider rewrite.
export const mapBackendTemplate = (backendTemplate) => ({
  title: backendTemplate.name,
  description: backendTemplate.description || '',
  fields: backendTemplate.fields || [],
});

export const buildTemplatesById = (backendTemplates) => {
  const map = {};
  for (const template of backendTemplates || []) {
    map[template.templateId] = mapBackendTemplate(template);
  }
  return map;
};

export const getTemplateDefinition = (templatesById, templateId) =>
  templatesById[templateId] || null;

export const getDefaultFormData = (templatesById, templateId) => {
  const template = getTemplateDefinition(templatesById, templateId);
  if (!template) {
    return { response: '' };
  }

  return template.fields.reduce((acc, field) => {
    if (field.type === 'boolean') {
      acc[field.key] = false;
      return acc;
    }
    if (field.type === 'date' || field.type === 'signature') {
      acc[field.key] = field.type === 'signature' ? null : '';
      return acc;
    }
    acc[field.key] = '';
    return acc;
  }, {});
};

export const normalizeFormDataForTemplate = (templatesById, templateId, formData) => {
  const template = getTemplateDefinition(templatesById, templateId);
  if (!template) {
    if (formData && typeof formData === 'object' && !Array.isArray(formData)) {
      return formData;
    }
    return { response: '' };
  }

  const defaults = getDefaultFormData(templatesById, templateId);
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return defaults;
  }

  return { ...defaults, ...formData };
};

// A submitted form is locked from further patient edits once it contains a real captured
// signature — editing it after the fact would silently alter a signed legal record.
export const isSignatureBearingTemplate = (template) =>
  Boolean(template?.fields?.some((field) => field.type === 'signature'));
