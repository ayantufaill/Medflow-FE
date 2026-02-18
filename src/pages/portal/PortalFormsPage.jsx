import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  getDefaultFormData,
  getTemplateDefinition,
  normalizeFormDataForTemplate,
} from './portalFormTemplates';
import {
  PortalEmptyState,
  PortalPageHeader,
  PortalSectionTitle,
  portalSurfaceSx,
} from './PortalUi';

const PortalFormsPage = () => {
  const [pendingForms, setPendingForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [formDrafts, setFormDrafts] = useState({});
  const [error, setError] = useState('');
  const [savingTemplateId, setSavingTemplateId] = useState('');

  const refresh = async () => {
    try {
      const [pending, formsRes] = await Promise.all([
        portalService.getPendingForms(),
        portalService.getForms({ page: 1, limit: 20 }),
      ]);
      const pendingRows = pending || [];
      setPendingForms(pendingRows);
      setSubmittedForms(formsRes.forms || []);

      setFormDrafts((prev) => {
        const next = { ...prev };
        for (const form of pendingRows) {
          if (!next[form.templateId]) {
            next[form.templateId] = getDefaultFormData(form.templateId);
          }
        }
        return next;
      });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load forms'
      );
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const submittedByTemplate = useMemo(() => {
    const map = new Map();
    for (const form of submittedForms) {
      if (!form.templateId || map.has(form.templateId)) continue;
      map.set(form.templateId, form);
    }
    return map;
  }, [submittedForms]);

  const updateDraftValue = (templateId, key, value) => {
    setFormDrafts((prev) => ({
      ...prev,
      [templateId]: {
        ...normalizeFormDataForTemplate(templateId, prev[templateId]),
        [key]: value,
      },
    }));
  };

  const validateRequiredFields = (templateId, draft) => {
    const template = getTemplateDefinition(templateId);
    if (!template) return '';

    for (const field of template.fields) {
      if (!field.required) continue;
      const value = draft[field.key];
      if (field.type === 'boolean' && !value) {
        return `${field.label} is required`;
      }
      if (field.type !== 'boolean' && !String(value || '').trim()) {
        return `${field.label} is required`;
      }
    }

    return '';
  };

  const handleSubmitForm = async (templateId) => {
    try {
      setError('');
      setSavingTemplateId(templateId);
      const draft = normalizeFormDataForTemplate(templateId, formDrafts[templateId]);
      const validationError = validateRequiredFields(templateId, draft);
      if (validationError) {
        setError(validationError);
        return;
      }

      await portalService.submitForm({
        templateId,
        formData: draft,
      });

      setFormDrafts((prev) => ({
        ...prev,
        [templateId]: getDefaultFormData(templateId),
      }));
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to submit form'
      );
    } finally {
      setSavingTemplateId('');
    }
  };

  const renderField = (templateId, field) => {
    const draft = normalizeFormDataForTemplate(templateId, formDrafts[templateId]);
    const value = draft[field.key];

    if (field.type === 'boolean') {
      return (
        <FormControlLabel
          key={field.key}
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(event) => updateDraftValue(templateId, field.key, event.target.checked)}
            />
          }
          label={field.label}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <TextField
          key={field.key}
          label={field.label}
          value={value || ''}
          onChange={(event) => updateDraftValue(templateId, field.key, event.target.value)}
          multiline
          minRows={3}
          fullWidth
          required={Boolean(field.required)}
        />
      );
    }

    return (
      <TextField
        key={field.key}
        label={field.label}
        type={field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
        value={value || ''}
        onChange={(event) => updateDraftValue(templateId, field.key, event.target.value)}
        fullWidth
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
        required={Boolean(field.required)}
      />
    );
  };

  const renderSummary = (form) => {
    const data = normalizeFormDataForTemplate(form.templateId, form.formData);
    const template = getTemplateDefinition(form.templateId);
    if (!template) {
      return String(data.response || '').trim() || 'Submitted';
    }

    const summaryField = template.fields.find((field) => {
      const value = data[field.key];
      return field.type !== 'boolean' && String(value || '').trim();
    });

    if (!summaryField) return 'Submitted';
    return `${summaryField.label}: ${String(data[summaryField.key]).slice(0, 80)}`;
  };

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Forms"
        subtitle="Complete required forms and review previous submissions."
      />
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={portalSurfaceSx}>
        <PortalSectionTitle
          title="Pending Forms"
          subtitle="Please submit these before your next visit."
        />
        <Stack spacing={2}>
          {pendingForms.length === 0 && (
            <PortalEmptyState
              title="No pending forms"
              description="You are all caught up."
            />
          )}
          {pendingForms.map((form) => {
            const template = getTemplateDefinition(form.templateId);
            const latestSubmitted = submittedByTemplate.get(form.templateId);
            return (
              <Box
                key={form.templateId}
                sx={{ border: '1px solid #e8edf3', borderRadius: 2, p: 1.5, backgroundColor: '#fff' }}
              >
                <Typography fontWeight={600}>{template?.title || form.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {form.description}
                </Typography>

                <Stack spacing={1.5}>
                  {template
                    ? template.fields.map((field) => renderField(form.templateId, field))
                    : (
                      <TextField
                        label="Response"
                        value={normalizeFormDataForTemplate(form.templateId, formDrafts[form.templateId]).response || ''}
                        onChange={(event) =>
                          updateDraftValue(form.templateId, 'response', event.target.value)
                        }
                        multiline
                        minRows={3}
                        fullWidth
                      />
                    )}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmitForm(form.templateId)}
                    disabled={savingTemplateId === form.templateId}
                  >
                    {savingTemplateId === form.templateId ? 'Submitting...' : 'Submit Form'}
                  </Button>
                  {latestSubmitted && (
                    <Button component={RouterLink} to={`/portal/forms/${latestSubmitted._id}`} variant="outlined">
                      View Last Submission
                    </Button>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Box sx={portalSurfaceSx}>
        <PortalSectionTitle
          title="Submitted Forms"
          subtitle="Open any form to review or update."
        />
        <Stack spacing={1}>
          {submittedForms.length === 0 && (
            <PortalEmptyState
              title="No submitted forms yet"
              description="Your submitted forms will appear here."
            />
          )}
          {submittedForms.map((form) => (
            <Box key={form._id} sx={{ border: '1px solid #e8edf3', borderRadius: 2, p: 1.5, backgroundColor: '#fff' }}>
              <Typography variant="body2" fontWeight={600}>
                {getTemplateDefinition(form.templateId)?.title || form.templateId || 'General form'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {renderSummary(form)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Submitted: {form.submittedAt ? dayjs(form.submittedAt).format('MMM D, YYYY h:mm A') : '-'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button component={RouterLink} to={`/portal/forms/${form._id}`} size="small">
                  View / Edit
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default PortalFormsPage;
