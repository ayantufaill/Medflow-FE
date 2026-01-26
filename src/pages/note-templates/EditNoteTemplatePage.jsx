import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { noteTemplateService } from '../../services/note-template.service';
import NoteTemplateForm from '../../components/note-templates/NoteTemplateForm';

const EditNoteTemplatePage = () => {
  const { noteTemplateId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [templateFields, setTemplateFields] = useState([]);

  useEffect(() => {
    fetchTemplate();
  }, [noteTemplateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await noteTemplateService.getNoteTemplateById(noteTemplateId);
      setTemplate(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to fetch note template. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await noteTemplateService.updateNoteTemplate(noteTemplateId, data);

      showSnackbar('Note template updated successfully', 'success');
      navigate('/note-templates');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update note template. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Note Template
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update template details and structure
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : template ? (
          <>
            <NoteTemplateForm
              onSubmit={handleSubmit}
              initialData={template}
              loading={saving}
              isEditMode={true}
              hideButtons={true}
              formId="edit-note-template-form"
              onFieldsChange={setTemplateFields}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 4,
              }}
            >
              <Button variant="outlined" onClick={handleBack} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                form="edit-note-template-form"
                disabled={saving || templateFields.length === 0}
                startIcon={
                  saving ? <CircularProgress size={20} color="inherit" /> : null
                }
              >
                {saving ? 'Updating...' : 'Update Template'}
              </Button>
            </Box>
          </>
        ) : null}
      </Paper>
    </Box>
  );
};

export default EditNoteTemplatePage;
