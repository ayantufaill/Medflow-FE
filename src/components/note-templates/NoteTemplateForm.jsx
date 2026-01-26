import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  IconButton,
  Divider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { noteTemplateValidations } from '../../validations/noteTemplateValidations';
import { noteTemplateService } from '../../services/note-template.service';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-Select' },
];


const NoteTemplateForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
  onFieldsChange,
  specialties,
}) => {
  const [templateFields, setTemplateFields] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      specialty: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        specialty: initialData.specialty || '',
        isActive: initialData.isActive !== false,
      });
      setDescriptionLength((initialData.description || '').length);

      if (initialData.templateStructure?.fields) {
        const fields = initialData.templateStructure.fields;
        setTemplateFields(fields);
        if (onFieldsChange) {
          onFieldsChange(fields);
        }
      }
    }
  }, [initialData, reset, onFieldsChange]);

  const handleAddField = () => {
    if (templateFields.length >= 50) {
      return;
    }
    const newFields = [
      ...templateFields,
      {
        id: `field_${Date.now()}`,
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        defaultContent: '',
        options: [],
      },
    ];
    setTemplateFields(newFields);
    if (onFieldsChange) {
      onFieldsChange(newFields);
    }
  };

  const handleRemoveField = (index) => {
    const field = templateFields[index];
    const hasData = field.label?.trim() || field.placeholder?.trim() || field.defaultContent?.trim() || (field.options && field.options.some(opt => opt.trim()));
    
    if (hasData) {
      setFieldToDelete(index);
      setDeleteConfirmOpen(true);
    } else {
      const newFields = templateFields.filter((_, i) => i !== index);
      setTemplateFields(newFields);
      if (onFieldsChange) {
        onFieldsChange(newFields);
      }
    }
  };

  const confirmDeleteField = () => {
    if (fieldToDelete !== null) {
      const newFields = templateFields.filter((_, i) => i !== fieldToDelete);
      setTemplateFields(newFields);
      if (onFieldsChange) {
        onFieldsChange(newFields);
      }
      setFieldToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const cancelDeleteField = () => {
    setFieldToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const validateFieldLabel = (label) => {
    const invalidChars = /[<>'"`;,\\|{}[\]]/;
    return !invalidChars.test(label);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...templateFields];
    const currentField = newFields[index];
    
    if (field === 'type') {
      currentField.type = value;
      
      if (value === 'date') {
        currentField.placeholder = 'YYYY-MM-DD';
      } else if (value === 'number') {
        currentField.placeholder = 'Enter a number';
      } else if (value === 'boolean') {
        currentField.placeholder = '';
        currentField.defaultContent = '';
      } else if (value === 'select' || value === 'multiselect') {
        if (!currentField.options || currentField.options.length === 0) {
          currentField.options = [''];
        }
      } else {
        currentField.placeholder = '';
      }
    } else if (field === 'label') {
      if (validateFieldLabel(value) || value === '') {
        currentField[field] = value;
      }
    } else {
      currentField[field] = value;
    }
    
    setTemplateFields(newFields);
    if (onFieldsChange) {
      onFieldsChange(newFields);
    }
  };

  const handleAddOption = (fieldIndex) => {
    const newFields = [...templateFields];
    if (!newFields[fieldIndex].options) {
      newFields[fieldIndex].options = [];
    }
    newFields[fieldIndex].options.push('');
    setTemplateFields(newFields);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const newFields = [...templateFields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setTemplateFields(newFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const newFields = [...templateFields];
    newFields[fieldIndex].options[optionIndex] = value;
    setTemplateFields(newFields);
  };

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]+>/g, '');
    }
    return value;
  };

  const handleFormSubmit = (formData) => {
    if (templateFields.length === 0) {
      return;
    }
    
    const hasInvalidFields = templateFields.some(field => !field.label?.trim());
    if (hasInvalidFields) {
      return;
    }
    const templateStructure = {
      fields: templateFields.map((field) => ({
        ...field,
        label: field.label.trim(),
        placeholder: field.placeholder?.trim() || '',
        defaultContent: field.defaultContent?.trim() || '',
        options:
          field.type === 'select' || field.type === 'multiselect'
            ? field.options.filter((opt) => opt.trim())
            : undefined,
      })),
    };

    const defaultContent = {};
    templateFields.forEach((field) => {
      if (field.defaultContent?.trim()) {
        defaultContent[field.id] = field.defaultContent.trim();
      } else if (field.type === 'boolean') {
        defaultContent[field.id] = false;
      } else if (field.type === 'multiselect') {
        defaultContent[field.id] = [];
      } else {
        defaultContent[field.id] = '';
      }
    });

    const sanitizedData = {
      name: sanitizeValue(formData.name),
      description: sanitizeValue(formData.description) || undefined,
      specialty: sanitizeValue(formData.specialty) || undefined,
      templateStructure,
      defaultContent,
      isActive: formData.isActive,
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Template Name *"
            {...register('name', noteTemplateValidations.name)}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="specialty"
            control={control}
            rules={noteTemplateValidations.specialty}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={specialties}
                value={value || null}
                onChange={(event, newValue) => onChange(newValue || '')}
                loading={loadingSpecialties}
                disabled={loadingSpecialties}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Specialty"
                    error={!!errors.specialty}
                    helperText={errors.specialty?.message}
                  />
                )}
                freeSolo
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            {...register('description', noteTemplateValidations.description)}
            error={!!errors.description}
            helperText={errors.description?.message || `${descriptionLength} / 500`}
            onChange={(e) => {
              setDescriptionLength(e.target.value.length);
              register('description').onChange(e);
            }}
            slotProps={{
              htmlInput: {
                maxLength: 500,
                style: { resize: 'vertical' }
              }
            }}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Active"
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="h6">Template Fields</Typography>
              <Typography variant="body2" color="text.secondary">
                At least one field is required to create a template
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddField}
              size="small"
              disabled={templateFields.length >= 50}
            >
              Add Field {templateFields.length >= 50 ? '(Max 50)' : ''}
            </Button>
          </Box>
        </Grid>

        {templateFields.length === 0 && (
          <Grid size={12}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <Typography color="text.secondary">
                No fields added yet. Click "Add Field" to create template
                fields.
              </Typography>
            </Paper>
          </Grid>
        )}

        {templateFields.map((field, index) => (
          <Grid size={12} key={field.id}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Chip label={`Field ${index + 1}`} size="small" />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveField(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Field Label"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(index, 'label', e.target.value)
                    }
                    required
                    error={field.label && (field.label.length > 50 || !validateFieldLabel(field.label))}
                    helperText={
                      field.label && field.label.length > 50 
                        ? 'Field label must be 50 characters or less' 
                        : field.label && !validateFieldLabel(field.label)
                        ? 'Invalid characters detected. Avoid: < > \' " ` ; , \\ | { } [ ]'
                        : ''
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 50
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Field Type *</InputLabel>
                    <Select
                      value={field.type}
                      label="Field Type *"
                      onChange={(e) =>
                        handleFieldChange(index, 'type', e.target.value)
                      }
                    >
                      {FIELD_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Placeholder Text"
                    value={field.placeholder || ''}
                    onChange={(e) =>
                      handleFieldChange(index, 'placeholder', e.target.value)
                    }
                    disabled={field.type === 'boolean'}
                    slotProps={{
                      htmlInput: {
                        maxLength: 100
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Default Content"
                    value={field.defaultContent || ''}
                    onChange={(e) =>
                      handleFieldChange(index, 'defaultContent', e.target.value)
                    }
                    helperText="Pre-populated value for this field"
                    disabled={field.type === 'boolean' || field.type === 'multiselect'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(index, 'required', e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                </Grid>

                {(field.type === 'select' || field.type === 'multiselect') && (
                  <Grid size={12}>
                    <Box sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          Options
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleAddOption(index)}
                        >
                          Add Option
                        </Button>
                      </Box>
                      {field.options?.map((option, optionIndex) => (
                        <Box
                          key={optionIndex}
                          sx={{ display: 'flex', gap: 1, mb: 1 }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveOption(index, optionIndex)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!hideButtons && (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}
        >
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading || templateFields.length === 0}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update Template'
              : 'Create Template'}
          </Button>
        </Box>
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={cancelDeleteField}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This field contains data. Are you sure you want to delete it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteField}>Cancel</Button>
          <Button onClick={confirmDeleteField} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteTemplateForm;
