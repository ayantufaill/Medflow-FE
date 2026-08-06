import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Autocomplete,
  Chip,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  CloudUpload as UploadIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { documentService } from '../../services/document.service';
import { patientService } from '../../services/patient.service';
import { appointmentService } from '../../services/appointment.service';
import { DOCUMENT_TYPES } from '../../validations/documentValidations';

const DOCUMENT_NAME_PATTERN = /^[a-zA-Z0-9\s\-_.,()]+$/;
const ILLEGAL_CHARS_PATTERN = /[\/:\*\?"<>\|\\]/g;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_DOCUMENT_NAME_LENGTH = 100;

const Label = ({ children, required }) => (
  <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', color: '#4b5563', display: 'block', mb: 0.5 }}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

const sharedInputSx = {
  backgroundColor: '#fff',
  '&.MuiOutlinedInput-root, & .MuiOutlinedInput-root': {
    borderRadius: '4px !important',
    height: '38px !important',
    boxSizing: 'border-box !important',
  },
  '& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB !important',
    borderWidth: '1px !important',
    borderRadius: '4px !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DB !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2563EB !important',
  },
  '& .MuiInputBase-input, & .MuiAutocomplete-input, & input, & textarea': {
    color: '#111827 !important',
    WebkitTextFillColor: '#111827 !important',
    padding: '10px 14px !important',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
    height: '36px !important',
    boxSizing: 'border-box !important',
  },
  '& .MuiInputBase-input::placeholder, & .MuiAutocomplete-input::placeholder, & input::placeholder, & textarea::placeholder': {
    color: '#374151 !important',
    opacity: '1 !important',
    WebkitTextFillColor: '#374151 !important',
  },
  '& .MuiSelect-select': {
    padding: '10px 14px !important',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
    boxSizing: 'border-box !important',
    display: 'flex !important',
    alignItems: 'center !important',
    color: '#111827 !important',
    WebkitTextFillColor: '#111827 !important',
    height: '36px !important',
    lineHeight: '36px !important',
  },
};

const tagsInputSx = {
  ...sharedInputSx,
  '&.MuiOutlinedInput-root, & .MuiOutlinedInput-root': {
    borderRadius: '4px !important',
    minHeight: '40px !important',
    height: 'auto !important',
    boxSizing: 'border-box !important',
  },
  '& .MuiAutocomplete-inputRoot': {
    padding: '3px 8px !important',
    borderRadius: '4px !important',
    minHeight: '40px !important',
    height: 'auto !important',
    boxSizing: 'border-box !important',
  },
  '& .MuiAutocomplete-input, & input': {
    height: '28px !important',
    padding: '0px 6px !important',
    color: '#111827 !important',
    WebkitTextFillColor: '#111827 !important',
  },
};

const multilineInputSx = {
  ...sharedInputSx,
  '&.MuiOutlinedInput-root, & .MuiOutlinedInput-root': {
    borderRadius: '4px !important',
    minHeight: '80px !important',
    height: 'auto !important',
    boxSizing: 'border-box !important',
  },
  '& .MuiInputBase-input, & textarea': {
    color: '#111827 !important',
    WebkitTextFillColor: '#111827 !important',
    padding: '10px 14px !important',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
    height: 'auto !important',
    boxSizing: 'border-box !important',
  },
};

const SUGGESTED_TAGS = [
  'urgent',
  'follow-up',
  'insurance',
  'lab',
  'imaging',
  'referral',
  'consent',
  'prescription',
  'medical-history',
  'vaccination',
];

const DocumentForm = ({
  mode = 'create',
  initialData = null,
  patientIdParam = null,
  appointmentIdParam = null,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const descriptionRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [prefilledPatient, setPrefilledPatient] = useState(null);
  const [prefilledAppointment, setPrefilledAppointment] = useState(null);

  const isEditMode = mode === 'edit';
  const isPrefilledFromUrl = !!(patientIdParam || appointmentIdParam);

  const [formData, setFormData] = useState({
    patientId: patientIdParam || initialData?.patientId || '',
    appointmentId: appointmentIdParam || initialData?.appointmentId || '',
    documentName: initialData?.documentName || '',
    documentType: initialData?.documentType || '',
    description: initialData?.description || '',
    isConfidential: initialData?.isConfidential || false,
    expirationDate: initialData?.expirationDate ? dayjs(initialData.expirationDate) : null,
    tags: initialData?.tags || [],
    enableOCR: initialData?.enableOCR || false,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        setInitialLoading(true);
        const result = await patientService.getAllPatients(1, 100);
        setPatients(result.patients || []);

        const patId = patientIdParam || initialData?.patientId;
        if (patId) {
          const patient = await patientService.getPatientById(patId);
          if (patient) {
            setPrefilledPatient(patient);
            if (!result.patients?.find(p => p._id === patient._id)) {
              setPatients(prev => [patient, ...prev]);
            }
          }
        }

        const aptId = appointmentIdParam || initialData?.appointmentId;
        if (aptId) {
          const appointment = await appointmentService.getAppointmentById(aptId);
          if (appointment) {
            setPrefilledAppointment(appointment);
            const appointmentPatId = typeof appointment.patientId === 'object' 
              ? appointment.patientId._id 
              : appointment.patientId;
            setFormData(prev => ({ ...prev, patientId: appointmentPatId }));

            if (!prefilledPatient) {
              const patient = await patientService.getPatientById(appointmentPatId);
              if (patient) {
                setPrefilledPatient(patient);
                if (!result.patients?.find(p => p._id === patient._id)) {
                  setPatients(prev => [patient, ...prev]);
                }
              }
            }
          }
        }
      } catch (err) {
        showSnackbar('Failed to load initial data', 'error');
      } finally {
        setInitialLoading(false);
      }
    };
    initializeData();
  }, [patientIdParam, appointmentIdParam, initialData, showSnackbar]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (formData.patientId) {
        try {
          const result = await appointmentService.getAppointmentsByPatient(formData.patientId);
          const appointmentsArray = Array.isArray(result) ? result : result?.appointments || [];
          setAppointments(appointmentsArray);

          if (prefilledAppointment && !appointmentsArray.find(a => a._id === prefilledAppointment._id)) {
            setAppointments(prev => [prefilledAppointment, ...prev]);
          }
        } catch (err) {
          console.error('Failed to fetch appointments', err);
        }
      } else {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [formData.patientId, prefilledAppointment]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.documentName) {
        const sanitizedName = sanitizeFileName(file.name);
        setFormData((prev) => ({ ...prev, documentName: sanitizedName }));
      }
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  const sanitizeFileName = (name) => {
    return name.replace(ILLEGAL_CHARS_PATTERN, '_');
  };

  const handleDocumentNameChange = (event) => {
    let value = event.target.value;
    value = sanitizeFileName(value);
    
    if (value.length > MAX_DOCUMENT_NAME_LENGTH) {
      value = value.substring(0, MAX_DOCUMENT_NAME_LENGTH);
    }
    
    setFormData((prev) => ({ ...prev, documentName: value }));
    
    if (!DOCUMENT_NAME_PATTERN.test(value) && value.length > 0) {
      setErrors((prev) => ({ 
        ...prev, 
        documentName: 'Only letters, numbers, spaces, and -_.(),  are allowed' 
      }));
    } else if (errors.documentName) {
      setErrors((prev) => ({ ...prev, documentName: undefined }));
    }
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setFormData((prev) => ({ ...prev, description: value }));
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: undefined }));
      }
    }
  };

  const handlePatientChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      patientId: newValue?._id || '',
      appointmentId: '',
    }));
    if (errors.patientId) {
      setErrors((prev) => ({ ...prev, patientId: undefined }));
    }
  };

  const handleTagsChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, tags: newValue }));
  };

  const handleExpirationDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, expirationDate: newValue }));
    
    if (newValue && dayjs(newValue).isBefore(dayjs(), 'day')) {
      setErrors((prev) => ({ ...prev, expirationDate: 'Expiration date cannot be in the past' }));
    } else if (errors.expirationDate) {
      setErrors((prev) => ({ ...prev, expirationDate: undefined }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.patientId) {
      validationErrors.patientId = 'Patient is required';
    }

    const trimmedName = formData.documentName.trim();
    if (!trimmedName) {
      validationErrors.documentName = 'Document name is required';
    } else if (trimmedName.length < 3) {
      validationErrors.documentName = 'Document name must be at least 3 characters';
    } else if (trimmedName.length > MAX_DOCUMENT_NAME_LENGTH) {
      validationErrors.documentName = `Document name cannot exceed ${MAX_DOCUMENT_NAME_LENGTH} characters`;
    } else if (!DOCUMENT_NAME_PATTERN.test(trimmedName)) {
      validationErrors.documentName = 'Only letters, numbers, spaces, and -_.(), are allowed';
    }

    if (!formData.documentType) {
      validationErrors.documentType = 'Document type is required';
    }

    if (formData.description && formData.description.length > MAX_DESCRIPTION_LENGTH) {
      validationErrors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (formData.expirationDate && dayjs(formData.expirationDate).isBefore(dayjs(), 'day')) {
      validationErrors.expirationDate = 'Expiration date cannot be in the past';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showSnackbar('Please fix the validation errors', 'error');
      return;
    }

    try {
      setLoading(true);

      const documentData = {
        patientId: formData.patientId,
        documentName: sanitizeFileName(formData.documentName.trim()),
        documentType: formData.documentType,
        isConfidential: formData.isConfidential,
        enableOCR: formData.enableOCR,
        tags: formData.tags,
      };

      if (formData.appointmentId) {
        documentData.appointmentId = formData.appointmentId;
      }
      if (formData.description?.trim()) {
        documentData.description = formData.description.trim();
      }
      if (formData.expirationDate) {
        documentData.expirationDate = formData.expirationDate.toISOString();
      }

      if (isEditMode && initialData?._id) {
        await documentService.updateDocument(initialData._id, documentData);
        showSnackbar('Document updated successfully', 'success');
      } else if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('patientId', formData.patientId);
        uploadData.append('documentType', formData.documentType || 'other');
        uploadData.append('documentName', sanitizeFileName(formData.documentName.trim()));
        if (formData.appointmentId) uploadData.append('appointmentId', formData.appointmentId);
        if (formData.description?.trim()) uploadData.append('description', formData.description.trim());
        if (formData.isConfidential) uploadData.append('isConfidential', 'true');
        if (formData.tags?.length) uploadData.append('tags', Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags);

        await documentService.uploadDocument(uploadData);
        showSnackbar('Document uploaded successfully', 'success');
      } else {
        await documentService.createDocument(documentData);
        showSnackbar('Document created successfully', 'success');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/patients/${formData.patientId}`);
      }
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || `Failed to ${isEditMode ? 'update' : 'create'} document`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  const selectedPatient = patients.find((p) => p._id === formData.patientId) || null;
  const descriptionCharCount = formData.description?.length || 0;

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Patient</Label>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={selectedPatient}
            onChange={handlePatientChange}
            disabled={!!prefilledPatient || isEditMode}
            sx={sharedInputSx}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search patient..."
                error={!!errors.patientId}
                helperText={errors.patientId || (prefilledPatient ? 'Pre-selected from context' : '')}
                FormHelperTextProps={{ sx: { ml: 0.5, mt: 0.25 } }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>Appointment (Optional)</Label>
          <Select
            fullWidth
            size="small"
            value={formData.appointmentId}
            onChange={handleChange('appointmentId')}
            disabled={!formData.patientId || !!prefilledAppointment}
            displayEmpty
            sx={sharedInputSx}
          >
            <MenuItem value="">No Appointment</MenuItem>
            {appointments.map((apt) => (
              <MenuItem key={apt._id} value={apt._id}>
                {new Date(apt.appointmentDate).toLocaleDateString()} - {apt.startTime || 'N/A'}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Document Name</Label>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter document name..."
            value={formData.documentName}
            onChange={handleDocumentNameChange}
            error={!!errors.documentName}
            helperText={
              errors.documentName || 
              `${formData.documentName.length}/${MAX_DOCUMENT_NAME_LENGTH} characters. Only letters, numbers, spaces, and -_.(), allowed.`
            }
            inputProps={{ maxLength: MAX_DOCUMENT_NAME_LENGTH }}
            sx={sharedInputSx}
            FormHelperTextProps={{ sx: { ml: 0.5, mt: 0.25 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Document Type</Label>
          <Select
            fullWidth
            size="small"
            value={formData.documentType}
            onChange={handleChange('documentType')}
            displayEmpty
            sx={sharedInputSx}
            error={!!errors.documentType}
          >
            <MenuItem value="" disabled>Select document type...</MenuItem>
            {DOCUMENT_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {errors.documentType && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 0.5, display: 'block' }}>
              {errors.documentType}
            </Typography>
          )}
        </Grid>

        {!isEditMode && (
          <Grid size={12}>
            <Label required>File</Label>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{
                p: 1.5,
                justifyContent: 'center',
                borderStyle: errors.file ? 'solid' : 'dashed',
                borderColor: errors.file ? 'error.main' : '#E5E7EB',
                borderRadius: '8px',
                color: '#4b5563',
                backgroundColor: '#f9fafb',
                fontFamily: 'Inter',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#2563EB',
                  backgroundColor: '#f3f8fd',
                }
              }}
            >
              {selectedFile ? selectedFile.name : 'Click to select file'}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              />
            </Button>
            {errors.file && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 0.5, display: 'block' }}>
                {errors.file}
              </Typography>
            )}
            {selectedFile && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 0.5, display: 'block' }}>
                File size: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            )}
          </Grid>
        )}

        <Grid size={12}>
          <Label>Description</Label>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
            placeholder="Add description..."
            value={formData.description}
            onChange={handleDescriptionChange}
            error={!!errors.description}
            helperText={errors.description}
            inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
            sx={multilineInputSx}
            FormHelperTextProps={{ sx: { ml: 0.5, mt: 0.25 } }}
          />
          <Typography
            variant="caption"
            color={descriptionCharCount > MAX_DESCRIPTION_LENGTH ? 'error' : 'text.secondary'}
            sx={{ display: 'block', textAlign: 'right', mt: 0.5, mr: 0.5 }}
          >
            {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH} characters
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>Tags</Label>
          <Autocomplete
            multiple
            freeSolo
            options={SUGGESTED_TAGS}
            value={formData.tags}
            onChange={handleTagsChange}
            sx={tagsInputSx}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                  sx={{ borderRadius: '6px', fontFamily: 'Inter', fontSize: '0.75rem' }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={formData.tags.length === 0 ? "Add tags..." : ""}
                helperText="Press Enter to add custom tags"
                FormHelperTextProps={{ sx: { ml: 0.5, mt: 0.25 } }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>Expiration Date</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.expirationDate}
              onChange={handleExpirationDateChange}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  placeholder: 'MM/DD/YYYY',
                  error: !!errors.expirationDate,
                  helperText: errors.expirationDate,
                  sx: sharedInputSx,
                  FormHelperTextProps: { sx: { ml: 0.5, mt: 0.25 } }
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isConfidential}
                onChange={handleChange('isConfidential')}
                color="primary"
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Mark as Confidential
              </Typography>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableOCR}
                onChange={handleChange('enableOCR')}
                color="primary"
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Enable OCR (Optical Character Recognition)
              </Typography>
            }
          />
          <Typography variant="caption" sx={{ color: '#6b7280', ml: 7, display: 'block', mt: -0.5 }}>
            Extract text from images and PDFs automatically
          </Typography>
        </Grid>

        <Grid size={12} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancelClick}
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '8px',
                px: 3,
                borderColor: '#DFE5EC',
                color: '#374151',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: '#f9fafb',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '8px',
                px: 3,
                backgroundColor: '#2563EB',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: 'none',
                }
              }}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Document')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default DocumentForm;
