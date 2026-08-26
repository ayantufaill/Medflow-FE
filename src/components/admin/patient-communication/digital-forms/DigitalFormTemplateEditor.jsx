import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  DeleteOutline as DeleteIcon,
  ShortText as TextIcon,
  Notes as TextareaIcon,
  AlternateEmail as EmailIcon,
  Tag as NumberIcon,
  Phone as PhoneIcon,
  Event as DateIcon,
  CheckBox as BooleanIcon,
  ArrowDropDownCircle as SelectIcon,
  RadioButtonChecked as RadioIcon,
  Draw as SignatureIcon,
} from '@mui/icons-material';
import {
  formTemplateService,
  FORM_FIELD_TYPES,
  OPTION_FIELD_TYPES,
} from '../../../../services/formTemplate.service';

const TYPE_ICONS = {
  text: TextIcon,
  textarea: TextareaIcon,
  email: EmailIcon,
  number: NumberIcon,
  phone: PhoneIcon,
  date: DateIcon,
  boolean: BooleanIcon,
  select: SelectIcon,
  radio: RadioIcon,
  signature: SignatureIcon,
};

const emptyField = () => ({
  key: '',
  label: '',
  type: 'text',
  required: false,
  options: [],
});

const TypePill = ({ icon: Icon, label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      border: '1px solid', borderColor: active ? '#3B82F6' : '#E5E9F2',
      borderRadius: 1.5, px: 1.5, py: 0.5,
      bgcolor: active ? '#F0F5FF' : '#fff',
      cursor: 'pointer',
      color: active ? '#3B82F6' : '#64748b',
      '&:hover': { borderColor: '#3B82F6', color: '#3B82F6', bgcolor: '#F0F5FF' },
    }}
  >
    <Icon sx={{ fontSize: '1.1rem', color: 'inherit' }} />
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'inherit' }}>{label}</Typography>
  </Box>
);

// Mirrors the field-builder UX pattern in QuestionnaireEditor.jsx (type-pill picker,
// dirty-state gated publish) but targets formtemplate's { key, label, type, required,
// options, order } shape rather than questionnaire questions — the two are different
// features with different backends, not variants of the same editor.
const DigitalFormTemplateEditor = ({ open, isNew, templateId, initialName, initialDescription, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError('');

    if (isNew) {
      const startName = initialName || '';
      const startDesc = initialDescription || '';
      setName(startName);
      setDescription(startDesc);
      setIsActive(true);
      setFields([]);
      setInitialSnapshot(JSON.stringify({ name: startName, description: startDesc, isActive: true, fields: [] }));
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await formTemplateService.getByTemplateId(templateId);
        setName(data.name || '');
        setDescription(data.description || '');
        setIsActive(data.isActive !== false);
        setFields(data.fields || []);
        setInitialSnapshot(
          JSON.stringify({
            name: data.name || '',
            description: data.description || '',
            isActive: data.isActive !== false,
            fields: data.fields || [],
          })
        );
      } catch (err) {
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load template');
      } finally {
        setLoading(false);
      }
    })();
  }, [open, isNew, templateId, initialName, initialDescription]);

  const currentSnapshot = JSON.stringify({ name, description, isActive, fields });
  const isDirty = initialSnapshot !== null && initialSnapshot !== currentSnapshot;

  const updateField = (idx, updates) => {
    setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, ...updates } : f)));
  };

  const handleTypeChange = (idx, type) => {
    updateField(idx, {
      type,
      options: OPTION_FIELD_TYPES.has(type) ? [{ value: '', label: '' }] : [],
    });
  };

  const addField = () => setFields((prev) => [...prev, emptyField()]);
  const removeField = (idx) => setFields((prev) => prev.filter((_, i) => i !== idx));
  const moveField = (idx, dir) => {
    setFields((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const addOption = (idx) => {
    updateField(idx, { options: [...(fields[idx].options || []), { value: '', label: '' }] });
  };
  const updateOption = (idx, optIdx, key, value) => {
    const options = [...(fields[idx].options || [])];
    options[optIdx] = { ...options[optIdx], [key]: value };
    updateField(idx, { options });
  };
  const removeOption = (idx, optIdx) => {
    updateField(idx, { options: (fields[idx].options || []).filter((_, i) => i !== optIdx) });
  };

  // Mirrors normalizeFields() in Medflow-BE's form-template.service.ts so authors get
  // immediate feedback instead of a round-trip 400.
  const validate = () => {
    if (!name.trim()) return 'Form name is required';
    if (fields.length === 0) return 'Add at least one field';

    const seenKeys = new Set();
    for (const field of fields) {
      if (!field.key.trim()) return 'Every field needs a key';
      if (seenKeys.has(field.key.trim())) return `Field key "${field.key}" is duplicated`;
      seenKeys.add(field.key.trim());
      if (!field.label.trim()) return `Field "${field.key}" needs a label`;
      if (OPTION_FIELD_TYPES.has(field.type)) {
        const validOptions = (field.options || []).filter((o) => o.value.trim() && o.label.trim());
        if (validOptions.length === 0) return `Field "${field.label}" needs at least one option`;
      }
    }
    return '';
  };

  const handlePublish = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payloadFields = fields.map((field, idx) => ({
      key: field.key.trim(),
      label: field.label.trim(),
      type: field.type,
      required: Boolean(field.required),
      options: OPTION_FIELD_TYPES.has(field.type)
        ? (field.options || []).filter((o) => o.value.trim() && o.label.trim())
        : null,
      order: idx,
    }));

    try {
      setSaving(true);
      setError('');
      if (isNew) {
        await formTemplateService.create({ templateId, name, description, isActive, fields: payloadFields });
      } else {
        await formTemplateService.update(templateId, { name, description, isActive, fields: payloadFields });
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, height: '85vh', display: 'flex', flexDirection: 'column' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
          {isNew ? 'New Digital Form' : `Edit: ${name || templateId}`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={loading || saving || !isDirty}
            sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : isNew ? 'Create' : 'Save Changes'}
          </Button>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 0, display: 'flex', flex: 1, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, p: 4, overflowY: 'auto', bgcolor: '#F8FAFC' }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E9F2', borderRadius: 2, p: 2.5, mb: 3 }}>
                <TextField
                  label="Form Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField label="Template ID" value={templateId} fullWidth size="small" disabled sx={{ mb: 2 }} />
                <FormControlLabel
                  control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                  label="Active (visible to patients as a pending form)"
                />
              </Box>

              {fields.map((field, idx) => {
                const Icon = TYPE_ICONS[field.type] || TextIcon;
                return (
                  <Box key={idx} sx={{ bgcolor: '#fff', border: '1px solid #E5E9F2', borderRadius: 2, p: 2.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
                      <Icon sx={{ fontSize: '1.3rem', color: '#94a3b8' }} />
                      <TextField
                        label="Key"
                        value={field.key}
                        onChange={(e) => updateField(idx, { key: e.target.value })}
                        size="small"
                        sx={{ width: 180 }}
                      />
                      <TextField
                        label="Label"
                        value={field.label}
                        onChange={(e) => updateField(idx, { label: e.target.value })}
                        size="small"
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {FORM_FIELD_TYPES.map((t) => (
                        <TypePill
                          key={t.value}
                          icon={TYPE_ICONS[t.value]}
                          label={t.label}
                          active={field.type === t.value}
                          onClick={() => handleTypeChange(idx, t.value)}
                        />
                      ))}
                    </Box>

                    {OPTION_FIELD_TYPES.has(field.type) && (
                      <Box sx={{ mb: 2, pl: 1 }}>
                        {(field.options || []).map((opt, optIdx) => (
                          <Box key={optIdx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <TextField
                              label="Value"
                              size="small"
                              value={opt.value}
                              onChange={(e) => updateOption(idx, optIdx, 'value', e.target.value)}
                            />
                            <TextField
                              label="Label"
                              size="small"
                              value={opt.label}
                              onChange={(e) => updateOption(idx, optIdx, 'label', e.target.value)}
                              fullWidth
                            />
                            <IconButton size="small" onClick={() => removeOption(idx, optIdx)}>
                              <CloseIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Box>
                        ))}
                        <Button size="small" startIcon={<AddIcon />} onClick={() => addOption(idx)} sx={{ textTransform: 'none' }}>
                          Add Option
                        </Button>
                      </Box>
                    )}

                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(field.required)}
                            onChange={(e) => updateField(idx, { required: e.target.checked })}
                          />
                        }
                        label={<Typography sx={{ fontSize: '0.8rem' }}>Required</Typography>}
                      />
                      <Box>
                        <IconButton size="small" onClick={() => moveField(idx, -1)} disabled={idx === 0}>
                          <UpIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => moveField(idx, 1)} disabled={idx === fields.length - 1}>
                          <DownIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => removeField(idx)} sx={{ '&:hover': { color: '#ef4444' } }}>
                          <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              <Button
                fullWidth
                variant="outlined"
                onClick={addField}
                sx={{ borderStyle: 'dashed', py: 2, textTransform: 'none', fontWeight: 600 }}
              >
                <AddIcon sx={{ mr: 1 }} /> Add Field
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DigitalFormTemplateEditor;
