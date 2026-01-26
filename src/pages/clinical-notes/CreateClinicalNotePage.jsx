import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon, Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { clinicalNoteService } from '../../services/clinical-note.service';
import { noteTemplateService } from '../../services/note-template.service';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';
import { appointmentService } from '../../services/appointment.service';
import {
  clinicalNoteValidations,
  NOTE_TYPES,
} from '../../validations/clinicalNoteValidations';
import { sanitizeSOAPFields } from '../../utils/sanitize';

const CreateClinicalNotePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [signDialog, setSignDialog] = useState(false);
  const [signLoading, setSignLoading] = useState(false);

  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientId: patientId || '',
      appointmentId: appointmentId || '',
      providerId: '',
      templateId: '',
      noteType: 'soap',
      chiefComplaint: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      historyOfPresentIllness: '',
      physicalExam: '',
      diagnosisCodes: [],
      requiresFollowUp: false,
      followUpDate: '',
    },
  });

  const watchedPatientId = watch('patientId');
  const watchedTemplateId = watch('templateId');
  const watchedRequiresFollowUp = watch('requiresFollowUp');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [templatesRes, patientsRes, providersRes] = await Promise.all([
          noteTemplateService.getActiveTemplates(),
          patientService.getAllPatients(1, 100),
          providerService.getAllProviders(1, 100),
        ]);
        setTemplates(templatesRes || []);
        setAllTemplates(templatesRes || []);
        setPatients(patientsRes?.patients || []);
        setAllPatients(patientsRes?.patients || []);
        setProviders(providersRes?.providers || []);
        setAllProviders(providersRes?.providers || []);
      } catch (err) {
        setError('Failed to load initial data');
        showSnackbar('Failed to load initial data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [showSnackbar]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (watchedPatientId) {
        try {
          setAppointmentLoading(true);
          const result = await appointmentService.getAppointmentsByPatient(
            watchedPatientId
          );
          setAppointments(Array.isArray(result) ? result : result?.appointments || []);
        } catch (err) {
          console.error('Failed to fetch appointments', err);
          setAppointments([]);
        } finally {
          setAppointmentLoading(false);
        }
      } else {
        setAppointments([]);
        setValue('appointmentId', '');
      }
    };
    fetchAppointments();
  }, [watchedPatientId, setValue]);

  const debouncedPatientSearch = useDebouncedCallback(async (search) => {
    if (!search || search.length < 2) {
      setPatients(allPatients);
      return;
    }
    try {
      setPatientLoading(true);
      const result = await patientService.getAllPatients(1, 50, search);
      setPatients(result?.patients || []);
    } catch (err) {
      console.error('Failed to search patients', err);
    } finally {
      setPatientLoading(false);
    }
  }, 300);

  const debouncedProviderSearch = useDebouncedCallback(async (search) => {
    if (!search || search.length < 2) {
      setProviders(allProviders);
      return;
    }
    try {
      setProviderLoading(true);
      const result = await providerService.getAllProviders(1, 50, search);
      setProviders(result?.providers || []);
    } catch (err) {
      console.error('Failed to search providers', err);
    } finally {
      setProviderLoading(false);
    }
  }, 300);

  const debouncedTemplateSearch = useDebouncedCallback(async (search) => {
    if (!search || search.length < 2) {
      setTemplates(allTemplates);
      return;
    }
    try {
      setTemplateLoading(true);
      const filtered = allTemplates.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase())
      );
      setTemplates(filtered);
    } catch (err) {
      console.error('Failed to search templates', err);
    } finally {
      setTemplateLoading(false);
    }
  }, 300);

  useEffect(() => {
    const loadTemplate = async () => {
      if (watchedTemplateId) {
        try {
          const template = await noteTemplateService.getNoteTemplateById(
            watchedTemplateId
          );
          setSelectedTemplate(template);
          if (template.defaultContent) {
            if (template.defaultContent.subjective) {
              setValue('subjective', template.defaultContent.subjective);
            }
            if (template.defaultContent.objective) {
              setValue('objective', template.defaultContent.objective);
            }
            if (template.defaultContent.assessment) {
              setValue('assessment', template.defaultContent.assessment);
            }
            if (template.defaultContent.plan) {
              setValue('plan', template.defaultContent.plan);
            }
          }
        } catch (err) {
          console.error('Failed to load template', err);
        }
      } else {
        setSelectedTemplate(null);
      }
    };
    loadTemplate();
  }, [watchedTemplateId, setValue]);

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      setError('');
      const data = watch();
      const sanitizedData = sanitizeSOAPFields(data);

      const noteData = {
        patientId: sanitizedData.patientId || undefined,
        appointmentId: sanitizedData.appointmentId || undefined,
        providerId: sanitizedData.providerId || undefined,
        templateId: sanitizedData.templateId || undefined,
        noteType: sanitizedData.noteType || 'soap',
        chiefComplaint: sanitizedData.chiefComplaint,
        subjective: sanitizedData.subjective,
        objective: sanitizedData.objective,
        assessment: sanitizedData.assessment,
        plan: sanitizedData.plan,
        historyOfPresentIllness: sanitizedData.historyOfPresentIllness,
        physicalExam: sanitizedData.physicalExam,
        diagnosisCodes: sanitizedData.diagnosisCodes?.length > 0 ? sanitizedData.diagnosisCodes : undefined,
        requiresFollowUp: Boolean(sanitizedData.requiresFollowUp),
        followUpDate: sanitizedData.followUpDate ? new Date(sanitizedData.followUpDate).toISOString() : undefined,
      };

      if (data.templateId) {
        await clinicalNoteService.createNoteFromTemplate(data.templateId, noteData);
      } else {
        await clinicalNoteService.createClinicalNote(noteData);
      }

      showSnackbar('Clinical note saved as draft', 'success');
      navigate('/clinical-notes');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to save draft';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSignAndCreate = async () => {
    try {
      setSignLoading(true);
      setError('');
      const data = watch();
      const sanitizedData = sanitizeSOAPFields(data);

      const noteData = {
        patientId: sanitizedData.patientId || undefined,
        appointmentId: sanitizedData.appointmentId || undefined,
        providerId: sanitizedData.providerId || undefined,
        templateId: sanitizedData.templateId || undefined,
        noteType: sanitizedData.noteType || 'soap',
        chiefComplaint: sanitizedData.chiefComplaint,
        subjective: sanitizedData.subjective,
        objective: sanitizedData.objective,
        assessment: sanitizedData.assessment,
        plan: sanitizedData.plan,
        historyOfPresentIllness: sanitizedData.historyOfPresentIllness,
        physicalExam: sanitizedData.physicalExam,
        diagnosisCodes: sanitizedData.diagnosisCodes?.length > 0 ? sanitizedData.diagnosisCodes : undefined,
        requiresFollowUp: Boolean(sanitizedData.requiresFollowUp),
        followUpDate: sanitizedData.followUpDate ? new Date(sanitizedData.followUpDate).toISOString() : undefined,
      };

      let clinicalNote;
      if (data.templateId) {
        clinicalNote = await clinicalNoteService.createNoteFromTemplate(data.templateId, noteData);
      } else {
        clinicalNote = await clinicalNoteService.createClinicalNote(noteData);
      }

      await clinicalNoteService.signClinicalNote(clinicalNote._id || clinicalNote.data?.clinicalNote?._id);
      showSnackbar('Clinical note created and signed successfully', 'success');
      setSignDialog(false);
      navigate('/clinical-notes');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create and sign clinical note';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSignLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSignDialog(true);
  };

  if (loading) {
    return (
      <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create Clinical Note
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new SOAP note for patient documentation
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="patientId"
                control={control}
                rules={clinicalNoteValidations.patientId}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={patients.find(p => p._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        debouncedPatientSearch(newInputValue);
                      } else if (reason === 'clear') {
                        setPatients(allPatients);
                      }
                    }}
                    options={patients}
                    loading={patientLoading}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.patientCode || 'N/A'})`}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient *"
                        placeholder="Type to search patients..."
                        error={!!errors.patientId}
                        helperText={errors.patientId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {patientLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="appointmentId"
                control={control}
                rules={clinicalNoteValidations.appointmentId}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={appointments.find(a => a._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    options={appointments}
                    loading={appointmentLoading}
                    disabled={!watchedPatientId}
                    getOptionLabel={(option) => `${new Date(option.appointmentDate).toLocaleDateString()} - ${option.startTime}`}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    noOptionsText={!watchedPatientId ? 'Select a patient first' : 'No appointments found'}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Appointment *"
                        error={!!errors.appointmentId}
                        helperText={errors.appointmentId?.message || (!watchedPatientId ? 'Select a patient first' : '')}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {appointmentLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="providerId"
                control={control}
                rules={clinicalNoteValidations.providerId}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={providers.find(p => p._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        debouncedProviderSearch(newInputValue);
                      } else if (reason === 'clear') {
                        setProviders(allProviders);
                      }
                    }}
                    options={providers}
                    loading={providerLoading}
                    getOptionLabel={(option) => `${option.userId.firstName} ${option.userId.lastName} (${option.providerCode || 'N/A'})`}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Provider *"
                        placeholder="Type to search providers..."
                        error={!!errors.providerId}
                        helperText={errors.providerId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {providerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="templateId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    value={templates.find(t => t._id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue?._id || '');
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        debouncedTemplateSearch(newInputValue);
                      } else if (reason === 'clear') {
                        setTemplates(allTemplates);
                      }
                    }}
                    options={templates}
                    loading={templateLoading}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, val) => option._id === val._id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Template (Optional)"
                        placeholder="Type to search templates..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {templateLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="noteType"
                control={control}
                rules={clinicalNoteValidations.noteType}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.noteType}>
                    <InputLabel>Note Type *</InputLabel>
                    <Select {...field} label="Note Type *">
                      {NOTE_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.noteType && (
                      <FormHelperText>{errors.noteType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="chiefComplaint"
                control={control}
                rules={clinicalNoteValidations.chiefComplaint}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Chief Complaint"
                    error={!!errors.chiefComplaint}
                    helperText={errors.chiefComplaint?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            SOAP Documentation
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Controller
                name="subjective"
                control={control}
                rules={clinicalNoteValidations.subjective}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={12}
                    label="Subjective"
                    placeholder="Patient's symptoms, history, and complaints in their own words..."
                    error={!!errors.subjective}
                    helperText={errors.subjective?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="objective"
                control={control}
                rules={clinicalNoteValidations.objective}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={12}
                    label="Objective"
                    placeholder="Physical examination findings, vital signs, test results..."
                    error={!!errors.objective}
                    helperText={errors.objective?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="assessment"
                control={control}
                rules={clinicalNoteValidations.assessment}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={12}
                    label="Assessment"
                    placeholder="Diagnosis, differential diagnoses, clinical reasoning..."
                    error={!!errors.assessment}
                    helperText={errors.assessment?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="plan"
                control={control}
                rules={clinicalNoteValidations.plan}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={12}
                    label="Plan"
                    placeholder="Treatment plan, medications, referrals, follow-up instructions..."
                    error={!!errors.plan}
                    helperText={errors.plan?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Controller
                name="historyOfPresentIllness"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={10}
                    label="History of Present Illness"
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="physicalExam"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={10}
                    label="Physical Exam Details"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="requiresFollowUp"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Requires Follow-up"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="followUpDate"
                control={control}
                rules={clinicalNoteValidations.followUpDate}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Follow-up Date"
                      value={value ? dayjs(value) : null}
                      onChange={(newValue) => {
                        onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                      }}
                      disabled={!watchedRequiresFollowUp}
                      minDate={dayjs().add(1, 'day')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.followUpDate,
                          helperText: errors.followUpDate?.message || (!watchedRequiresFollowUp ? 'Enable "Requires Follow-up" to set date' : ''),
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/clinical-notes')}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={savingDraft ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveDraft}
            disabled={savingDraft || submitting}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={savingDraft || submitting}
          >
            Create Note
          </Button>
        </Box>
      </form>

      <ConfirmationDialog
        open={signDialog}
        title="Finalize Clinical Note"
        message="Do you want to finalize this note? Once finalized, the note cannot be edited."
        onConfirm={handleSignAndCreate}
        onCancel={() => setSignDialog(false)}
        confirmText="Sign & Finalize"
        cancelText="Cancel"
        loading={signLoading}
        severity="warning"
      />
    </Box>
  );
};

export default CreateClinicalNotePage;
