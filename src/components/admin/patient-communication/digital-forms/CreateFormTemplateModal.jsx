import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Description as FormIcon } from '@mui/icons-material';
import { TEMPLATE_ID_PATTERN } from '../../../../services/formTemplate.service';

// Captures just enough to hand off to DigitalFormTemplateEditor, which does the actual
// POST /form-templates once fields have been added — mirrors the Questionnaires
// create-modal-then-editor flow already used elsewhere in this codebase.
const CreateFormTemplateModal = ({ open, onClose, onCreate }) => {
  const [templateId, setTemplateId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slugError, setSlugError] = useState('');

  const reset = () => {
    setTemplateId('');
    setName('');
    setDescription('');
    setSlugError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!TEMPLATE_ID_PATTERN.test(templateId)) {
      setSlugError('Lowercase letters, numbers, and hyphens only (e.g. "new-patient-intake")');
      return;
    }
    onCreate({ templateId, name, description });
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ zIndex: 9999 }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: '#F0F5FF', p: 1, borderRadius: 2, display: 'flex' }}>
            <FormIcon sx={{ fontSize: '1.5rem', color: '#3B82F6' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
            New Digital Form
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 4, pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
              Form Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="E.g., New Patient Intake"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
              Template ID <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g., new-patient-intake"
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value.toLowerCase());
                setSlugError('');
              }}
              error={Boolean(slugError)}
              helperText={slugError || 'Stable slug patients\' submissions reference — cannot be changed after creation.'}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Description</Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="Shown to patients above the form"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!name.trim() || !templateId.trim()}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Continue to Field Builder
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormTemplateModal;
