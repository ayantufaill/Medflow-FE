import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

const safeStringify = (value) => {
  try {
    return JSON.stringify(value || {}, null, 2);
  } catch {
    return '{}';
  }
};

const PortalFormDetailPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [jsonText, setJsonText] = useState('{}');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedJsonError = useMemo(() => {
    try {
      JSON.parse(jsonText || '{}');
      return '';
    } catch (err) {
      return err.message || 'Invalid JSON';
    }
  }, [jsonText]);

  useEffect(() => {
    (async () => {
      if (!formId) return;
      try {
        const row = await portalService.getFormById(formId);
        setForm(row);
        setTemplateId(row.templateId || '');
        setJsonText(safeStringify(row.formData));
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load form'
        );
      }
    })();
  }, [formId]);

  const handleSave = async () => {
    if (!formId || parsedJsonError) return;
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const updated = await portalService.updateForm(formId, {
        templateId: templateId || undefined,
        formData: JSON.parse(jsonText || '{}'),
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
      {parsedJsonError && <Alert severity="warning">JSON error: {parsedJsonError}</Alert>}

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
            label="Template ID"
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            fullWidth
          />
          <TextField
            label="Form Data (JSON)"
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            multiline
            minRows={14}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || Boolean(parsedJsonError)}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PortalFormDetailPage;
