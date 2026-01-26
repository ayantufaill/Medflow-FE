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
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={selectedPatient}
            onChange={handlePatientChange}
            disabled={!!prefilledPatient || isEditMode}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient *"
                error={!!errors.patientId}
                helperText={errors.patientId || (prefilledPatient ? 'Pre-selected from context' : '')}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Appointment (Optional)</InputLabel>
            <Select
              value={formData.appointmentId}
              onChange={handleChange('appointmentId')}
              label="Appointment (Optional)"
              disabled={!formData.patientId || !!prefilledAppointment}
            >
              <MenuItem value="">No Appointment</MenuItem>
              {appointments.map((apt) => (
                <MenuItem key={apt._id} value={apt._id}>
                  {new Date(apt.appointmentDate).toLocaleDateString()} - {apt.startTime || 'N/A'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Document Name *"
            value={formData.documentName}
            onChange={handleDocumentNameChange}
            error={!!errors.documentName}
            helperText={
              errors.documentName || 
              `${formData.documentName.length}/${MAX_DOCUMENT_NAME_LENGTH} characters. Only letters, numbers, spaces, and -_.(), allowed.`
            }
            inputProps={{ maxLength: MAX_DOCUMENT_NAME_LENGTH }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.documentType}>
            <InputLabel>Document Type *</InputLabel>
            <Select
              value={formData.documentType}
              onChange={handleChange('documentType')}
              label="Document Type *"
            >
              {DOCUMENT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.documentType && (
              <FormHelperText>{errors.documentType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {!isEditMode && (
          <Grid size={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{
                p: 2,
                justifyContent: 'flex-start',
                borderStyle: errors.file ? 'solid' : 'dashed',
                borderColor: errors.file ? 'error.main' : 'divider',
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
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.file}
              </Typography>
            )}
            {selectedFile && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                File size: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            )}
          </Grid>
        )}

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            label="Description"
            value={formData.description}
            onChange={handleDescriptionChange}
            error={!!errors.description}
            helperText={errors.description}
            inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
          />
          <Typography
            variant="caption"
            color={descriptionCharCount > MAX_DESCRIPTION_LENGTH ? 'error' : 'text.secondary'}
            sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
          >
            {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH} characters
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            multiple
            freeSolo
            options={SUGGESTED_TAGS}
            value={formData.tags}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                helperText="Press Enter to add custom tags"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiration Date"
              value={formData.expirationDate}
              onChange={handleExpirationDateChange}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.expirationDate,
                  helperText: errors.expirationDate,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isConfidential}
                onChange={handleChange('isConfidential')}
              />
            }
            label="Mark as Confidential"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableOCR}
                onChange={handleChange('enableOCR')}
              />
            }
            label="Enable OCR (Optical Character Recognition)"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            Extract text from images and PDFs automatically
          </Typography>
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Document' : 'Create Document')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default DocumentForm;
