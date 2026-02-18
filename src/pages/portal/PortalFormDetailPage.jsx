import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  getTemplateDefinition,
  normalizeFormDataForTemplate,
} from './portalFormTemplates';

const PortalFormDetailPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const template = useMemo(() => getTemplateDefinition(templateId), [templateId]);

  useEffect(() => {
    (async () => {
      if (!formId) return;
      try {
        const row = await portalService.getFormById(formId);
        setForm(row);
        setTemplateId(row.templateId || '');
        setFormData(normalizeFormDataForTemplate(row.templateId, row.formData));
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load form'
        );
      }
    })();
  }, [formId]);

  const updateValue = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateRequiredFields = () => {
    if (!template) return '';
    for (const field of template.fields) {
      if (!field.required) continue;
      const value = formData[field.key];
      if (field.type === 'boolean' && !value) {
        return `${field.label} is required`;
      }
      if (field.type !== 'boolean' && !String(value || '').trim()) {
        return `${field.label} is required`;
      }
    }
    return '';
  };

  const handleSave = async () => {
    if (!formId) return;
    const validationError = validateRequiredFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const updated = await portalService.updateForm(formId, {
        templateId: templateId || undefined,
        formData,
      });
      setForm(updated);
      setSuccess('Form updated successfully');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to update form'
      );
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.key];
    if (field.type === 'boolean') {
      return (
        <FormControlLabel
          key={field.key}
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(event) => updateValue(field.key, event.target.checked)}
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
          onChange={(event) => updateValue(field.key, event.target.value)}
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
        onChange={(event) => updateValue(field.key, event.target.value)}
        fullWidth
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
        required={Boolean(field.required)}
      />
    );
  };

  if (!form && !error) {
    return <Typography>Loading form...</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Form Details</Typography>
        <Button component={RouterLink} to="/portal/forms" variant="outlined">
          Back
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Form ID: {form?._id || '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submitted:{' '}
            {form?.submittedAt ? dayjs(form.submittedAt).format('MMM D, YYYY h:mm A') : '-'}
          </Typography>

          <TextField
            label="Form Type"
            value={template?.title || templateId || 'General Form'}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          <Stack spacing={1.5}>
            {template
              ? template.fields.map((field) => renderField(field))
              : (
                <TextField
                  label="Response"
                  value={formData.response || ''}
                  onChange={(event) => updateValue('response', event.target.value)}
                  multiline
                  minRows={8}
                  fullWidth
                />
              )}
          </Stack>

          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PortalFormDetailPage;

