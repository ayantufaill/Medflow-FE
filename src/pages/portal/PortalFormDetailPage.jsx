import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import { formTemplateService } from '../../services/formTemplate.service';
import SignaturePad from '../../components/shared/SignaturePad';
import {
  isSignatureBearingTemplate,
  mapBackendTemplate,
  normalizeFormDataForTemplate,
} from './formTemplateHelpers';
import { PortalPageHeader, PortalSectionTitle, portalSurfaceSx } from './PortalUi';

const PortalFormDetailPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // A signature field means this submission is a signed legal record — once submitted it's
  // locked from further patient edits (matches the backend's 423 on PUT for these forms).
  const locked = useMemo(() => isSignatureBearingTemplate(template), [template]);

  useEffect(() => {
    (async () => {
      if (!formId) return;
      try {
        const row = await portalService.getFormById(formId);
        setForm(row);
        setTemplateId(row.templateId || '');

        let templateDef = null;
        if (row.templateId) {
          try {
            const backendTemplate = await formTemplateService.getByTemplateId(row.templateId);
            templateDef = mapBackendTemplate(backendTemplate);
          } catch {
            templateDef = null;
          }
        }
        setTemplate(templateDef);

        const templatesById = templateDef ? { [row.templateId]: templateDef } : {};
        setFormData(normalizeFormDataForTemplate(templatesById, row.templateId, row.formData));
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
    if (!formId || locked) return;
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
              disabled={locked}
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
          disabled={locked}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <TextField
          key={field.key}
          select
          label={field.label}
          value={value || ''}
          onChange={(event) => updateValue(field.key, event.target.value)}
          fullWidth
          required={Boolean(field.required)}
          disabled={locked}
        >
          {(field.options || []).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (field.type === 'radio') {
      return (
        <Box key={field.key}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {field.label}
            {field.required ? ' *' : ''}
          </Typography>
          <RadioGroup
            row
            value={value || ''}
            onChange={(event) => updateValue(field.key, event.target.value)}
          >
            {(field.options || []).map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                disabled={locked}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </Box>
      );
    }

    if (field.type === 'signature') {
      return (
        <Box key={field.key}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {field.label}
            {field.required ? ' *' : ''}
          </Typography>
          <SignaturePad
            value={value || null}
            showClearButton={!locked}
            onChange={(dataUrl) => updateValue(field.key, dataUrl)}
          />
        </Box>
      );
    }

    return (
      <TextField
        key={field.key}
        label={field.label}
        type={
          field.type === 'date'
            ? 'date'
            : field.type === 'email'
              ? 'email'
              : field.type === 'number'
                ? 'number'
                : field.type === 'phone'
                  ? 'tel'
                  : 'text'
        }
        value={value || ''}
        onChange={(event) => updateValue(field.key, event.target.value)}
        fullWidth
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
        required={Boolean(field.required)}
        disabled={locked}
      />
    );
  };

  if (!form && !error) {
    return <Typography>Loading form...</Typography>;
  }

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Form Details"
        subtitle={`Form #${form?._id || '-'}`}
        action={
          <Button component={RouterLink} to="/portal/forms" variant="outlined">
            Back
          </Button>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {locked && (
        <Alert severity="info">
          This form includes a signature and is locked from further edits once submitted.
          Contact the office if this record needs to be corrected.
        </Alert>
      )}

      <Box sx={portalSurfaceSx}>
        <PortalSectionTitle title={template?.title || templateId || 'General Form'} />
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

          {!locked && (
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default PortalFormDetailPage;
