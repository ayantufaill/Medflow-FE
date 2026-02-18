import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

const PortalFormsPage = () => {
  const [pendingForms, setPendingForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [formDrafts, setFormDrafts] = useState({});
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      const [pending, formsRes] = await Promise.all([
        portalService.getPendingForms(),
        portalService.getForms({ page: 1, limit: 20 }),
      ]);
      setPendingForms(pending || []);
      setSubmittedForms(formsRes.forms || []);
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

  const handleSubmitForm = async (templateId) => {
    try {
      setError('');
      await portalService.submitForm({
        templateId,
        formData: {
          response: formDrafts[templateId] || '',
        },
      });
      setFormDrafts((prev) => ({ ...prev, [templateId]: '' }));
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to submit form'
      );
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Forms</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Pending Forms
        </Typography>
        <Stack spacing={2}>
          {pendingForms.length === 0 && (
            <Typography color="text.secondary">No pending forms.</Typography>
          )}
          {pendingForms.map((form) => (
            <Box key={form.templateId} sx={{ border: '1px solid #e8edf3', borderRadius: 1, p: 1.5 }}>
              <Typography fontWeight={600}>{form.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {form.description}
              </Typography>
              <TextField
                label="Your response"
                multiline
                minRows={3}
                fullWidth
                value={formDrafts[form.templateId] || ''}
                onChange={(event) =>
                  setFormDrafts((prev) => ({ ...prev, [form.templateId]: event.target.value }))
                }
              />
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleSubmitForm(form.templateId)}
              >
                Submit Form
              </Button>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Submitted Forms
        </Typography>
        <Stack spacing={1}>
          {submittedForms.length === 0 && (
            <Typography color="text.secondary">No submitted forms.</Typography>
          )}
          {submittedForms.map((form) => (
            <Box key={form._id} sx={{ border: '1px solid #e8edf3', borderRadius: 1, p: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {form.templateId || 'General form'}
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
      </Paper>
    </Stack>
  );
};

export default PortalFormsPage;
