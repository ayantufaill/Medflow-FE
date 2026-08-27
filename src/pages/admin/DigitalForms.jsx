import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Block as DeactivateIcon,
  Description as FormIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { formTemplateService } from '../../services/formTemplate.service';
import CreateFormTemplateModal from '../../components/admin/patient-communication/digital-forms/CreateFormTemplateModal';
import DigitalFormTemplateEditor from '../../components/admin/patient-communication/digital-forms/DigitalFormTemplateEditor';

// Standalone admin surface for the /form-templates API — deliberately not folded into the
// unrelated Questionnaires (patient-communication surveys) or Informed Consents (procedure
// PDF metadata) modules, since neither shares this feature's data shape or portal-rendering
// path. This is the only place patients' intake/consent form field definitions get authored.
const DigitalForms = () => {
  const { showSnackbar } = useSnackbar();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editorState, setEditorState] = useState(null); // { isNew, templateId, initialName, initialDescription }
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await formTemplateService.getAll({ includeInactive: true });
      setTemplates(data);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to load form templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreate = ({ templateId, name, description }) => {
    setCreateOpen(false);
    setEditorState({ isNew: true, templateId, initialName: name, initialDescription: description });
  };

  const handleEditorClose = (didChange) => {
    setEditorState(null);
    if (didChange) fetchTemplates();
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      setDeactivating(true);
      await formTemplateService.deactivate(deactivateTarget.templateId);
      showSnackbar('Form template deactivated', 'success');
      setDeactivateTarget(null);
      fetchTemplates();
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to deactivate template', 'error');
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>Digital Forms</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
            Intake and consent forms patients complete from the portal.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          New Form
        </Button>
      </Box>

      <TextField
        size="small"
        placeholder="Search forms..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3, width: 320 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: '#94a3b8' }}>
          <FormIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
          <Typography>No form templates yet.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filtered.map((template) => (
            <Box
              key={template.templateId}
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #E5E9F2', borderRadius: 2, p: 2, bgcolor: '#fff',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>{template.name}</Typography>
                  <Chip
                    label={template.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={template.isActive ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {template.templateId} · {template.fields.length} field{template.fields.length === 1 ? '' : 's'} · updated{' '}
                  {dayjs(template.updatedAt).format('MMM D, YYYY')}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => setEditorState({ isNew: false, templateId: template.templateId })}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                {template.isActive && (
                  <IconButton size="small" onClick={() => setDeactivateTarget(template)}>
                    <DeactivateIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <CreateFormTemplateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />

      {editorState && (
        <DigitalFormTemplateEditor
          open
          isNew={editorState.isNew}
          templateId={editorState.templateId}
          initialName={editorState.initialName}
          initialDescription={editorState.initialDescription}
          onClose={handleEditorClose}
        />
      )}

      <Dialog open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)}>
        <DialogTitle>Deactivate "{deactivateTarget?.name}"?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This hides the form from patients going forward. Past submissions keep referencing
            this template and remain visible — this is a soft disable, not a delete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateTarget(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeactivate} disabled={deactivating}>
            {deactivating ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DigitalForms;
