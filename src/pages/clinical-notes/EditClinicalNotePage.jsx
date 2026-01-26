import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  Save as SaveIcon,
  Draw as SignIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { clinicalNoteService } from '../../services/clinical-note.service';
import {
  clinicalNoteValidations,
  NOTE_TYPES,
  validateSOAPForSigning,
} from '../../validations/clinicalNoteValidations';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { sanitizeSOAPFields } from '../../utils/sanitize';

const EditClinicalNotePage = () => {
  const navigate = useNavigate();
  const { clinicalNoteId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clinicalNote, setClinicalNote] = useState(null);
  const [signDialog, setSignDialog] = useState(false);
  const [signLoading, setSignLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      chiefComplaint: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      historyOfPresentIllness: '',
      physicalExam: '',
      requiresFollowUp: false,
      followUpDate: '',
    },
  });

  const watchedRequiresFollowUp = watch('requiresFollowUp');

  useEffect(() => {
    const fetchClinicalNote = async () => {
      try {
        setLoading(true);
        const note = await clinicalNoteService.getClinicalNoteById(clinicalNoteId);
        setClinicalNote(note);

        if (note.isSigned) {
          showSnackbar('This note is signed and cannot be edited', 'warning');
          navigate(`/clinical-notes/${clinicalNoteId}`);
          return;
        }

        reset({
          chiefComplaint: note.chiefComplaint || '',
          subjective: note.subjective || '',
          objective: note.objective || '',
          assessment: note.assessment || '',
          plan: note.plan || '',
          historyOfPresentIllness: note.historyOfPresentIllness || '',
          physicalExam: note.physicalExam || '',
          requiresFollowUp: note.requiresFollowUp || false,
          followUpDate: note.followUpDate
            ? new Date(note.followUpDate).toISOString().split('T')[0]
            : '',
        });
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load clinical note'
        );
        showSnackbar('Failed to load clinical note', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchClinicalNote();
  }, [clinicalNoteId, reset, navigate, showSnackbar]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError('');

      const sanitizedData = sanitizeSOAPFields(data);

      const updates = {
        chiefComplaint: sanitizedData.chiefComplaint || undefined,
        subjective: sanitizedData.subjective || undefined,
        objective: sanitizedData.objective || undefined,
        assessment: sanitizedData.assessment || undefined,
        plan: sanitizedData.plan || undefined,
        historyOfPresentIllness: sanitizedData.historyOfPresentIllness || undefined,
        physicalExam: sanitizedData.physicalExam || undefined,
        requiresFollowUp: sanitizedData.requiresFollowUp,
        followUpDate: sanitizedData.followUpDate
          ? new Date(sanitizedData.followUpDate).toISOString()
          : undefined,
      };

      await clinicalNoteService.updateClinicalNote(clinicalNoteId, updates);
      showSnackbar('Clinical note updated successfully', 'success');
      navigate(`/clinical-notes`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update clinical note';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSubmitting(true);
      const data = getValues();
      await clinicalNoteService.saveDraft(clinicalNoteId, {
        chiefComplaint: data.chiefComplaint,
        subjective: data.subjective,
        objective: data.objective,
        assessment: data.assessment,
        plan: data.plan,
        historyOfPresentIllness: data.historyOfPresentIllness,
        physicalExam: data.physicalExam,
      });
      showSnackbar('Draft saved successfully', 'success');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to save draft',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignClick = () => {
    const data = getValues();
    const validationErrors = validateSOAPForSigning(data);
    if (validationErrors.length > 0) {
      showSnackbar(validationErrors[0], 'error');
      return;
    }
    setSignDialog(true);
  };

  const handleSignConfirm = async () => {
    try {
      setSignLoading(true);
      const data = getValues();
      
      if (isDirty) {
        await clinicalNoteService.updateClinicalNote(clinicalNoteId, {
          chiefComplaint: data.chiefComplaint,
          subjective: data.subjective,
          objective: data.objective,
          assessment: data.assessment,
          plan: data.plan,
          historyOfPresentIllness: data.historyOfPresentIllness,
          physicalExam: data.physicalExam,
          requiresFollowUp: data.requiresFollowUp,
          followUpDate: data.followUpDate
            ? new Date(data.followUpDate).toISOString()
            : undefined,
        });
      }

      await clinicalNoteService.signClinicalNote(clinicalNoteId);
      showSnackbar('Clinical note signed successfully', 'success');
      setSignDialog(false);
      navigate(`/clinical-notes/${clinicalNoteId}`);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to sign clinical note',
        'error'
      );
    } finally {
      setSignLoading(false);
    }
  };

  const getPatientName = () => {
    if (clinicalNote?.patientId?.firstName && clinicalNote?.patientId?.lastName) {
      return `${clinicalNote.patientId.firstName} ${clinicalNote.patientId.lastName}`;
    }
    return 'Unknown Patient';
  };

  const getProviderName = () => {
    if (clinicalNote?.providerId?.firstName && clinicalNote?.providerId?.lastName) {
      return `${clinicalNote.providerId.firstName} ${clinicalNote.providerId.lastName}`;
    }
    return 'Unknown Provider';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clinicalNote) {
    return (
      <Alert severity="error">Clinical note not found</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton
          onClick={() => window.history.back()}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Clinical Note
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Patient: <strong>{getPatientName()}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">|</Typography>
            <Typography variant="body2" color="text.secondary">
              Provider: <strong>{getProviderName()}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">|</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: <strong>{new Date(clinicalNote.createdAt).toLocaleDateString()}</strong>
            </Typography>
            <Chip
              label={NOTE_TYPES.find((t) => t.value === clinicalNote.noteType)?.label || clinicalNote.noteType}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chief Complaint
          </Typography>
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
            <Grid size={{xs:12, md:6}}>
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
            <Grid size={{xs:12, md:6}}>
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
            <Grid size={{xs:12, md:6}}>
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
            <Grid size={{xs:12, md:6}}>
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
          <Button
            variant="outlined"
            onClick={() => navigate(`/clinical-notes/${clinicalNoteId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={submitting}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditClinicalNotePage;
