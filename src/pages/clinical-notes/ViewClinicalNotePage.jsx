import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Draw as SignIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocalHospital as ProviderIcon,
  Event as EventIcon,
  Print as PrintIcon,
  AttachFile as AttachIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { clinicalNoteService } from '../../services/clinical-note.service';
import { NOTE_TYPES } from '../../validations/clinicalNoteValidations';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ViewClinicalNotePage = () => {
  const navigate = useNavigate();
  const { clinicalNoteId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clinicalNote, setClinicalNote] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [signDialog, setSignDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchClinicalNote = async () => {
      try {
        setLoading(true);
        const note = await clinicalNoteService.getClinicalNoteById(clinicalNoteId);
        setClinicalNote(note);
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
  }, [clinicalNoteId, showSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await clinicalNoteService.deleteClinicalNote(clinicalNoteId);
      showSnackbar('Clinical note deleted successfully', 'success');
      navigate('/clinical-notes');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete clinical note',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const handleSign = async () => {
    try {
      setSignLoading(true);
      const signedNote = await clinicalNoteService.signClinicalNote(clinicalNoteId);
      setClinicalNote(signedNote);
      showSnackbar('Clinical note signed successfully', 'success');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to sign clinical note',
        'error'
      );
    } finally {
      setSignLoading(false);
      setSignDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPatientName = () => {
    if (clinicalNote?.patientId?.firstName && clinicalNote?.patientId?.lastName) {
      return `${clinicalNote.patientId.firstName} ${clinicalNote.patientId.lastName}`;
    }
    return 'Unknown Patient';
  };

  const getProviderName = () => {
    if (clinicalNote?.providerId?.userId?.firstName && clinicalNote?.providerId?.userId?.lastName) {
      return `Dr. ${clinicalNote.providerId.userId.firstName} ${clinicalNote.providerId.userId.lastName}`;
    }
    if (clinicalNote?.providerId?.firstName && clinicalNote?.providerId?.lastName) {
      return `Dr. ${clinicalNote.providerId.firstName} ${clinicalNote.providerId.lastName}`;
    }
    return 'Unknown Provider';
  };

  const getSignedByName = () => {
    if (clinicalNote?.signedBy?.firstName && clinicalNote?.signedBy?.lastName) {
      return `${clinicalNote.signedBy.firstName} ${clinicalNote.signedBy.lastName}`;
    }
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !clinicalNote) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/clinical-notes')}
          sx={{ mb: 2 }}
        >
          Back to Clinical Notes
        </Button>
        <Alert severity="error">{error || 'Clinical note not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Clinical Note
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <Chip
                label={NOTE_TYPES.find((t) => t.value === clinicalNote.noteType)?.label || clinicalNote.noteType}
                variant="outlined"
              />
              {clinicalNote.isSigned ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Signed"
                  color="success"
                />
              ) : (
                <Chip
                  icon={<ScheduleIcon />}
                  label="Draft"
                  color="warning"
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!clinicalNote.isSigned && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/clinical-notes/${clinicalNoteId}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<SignIcon />}
                onClick={() => setSignDialog(true)}
              >
                Sign
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{xs: 12, lg: 4}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Patient & Provider
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Patient
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getPatientName()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Provider
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getProviderName()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(clinicalNote.createdAt)}
                    </Typography>
                  </Box>

                  {clinicalNote.templateId && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Template Used
                      </Typography>
                      <Typography variant="body1">
                        {clinicalNote.templateId?.name || 'Unknown Template'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {clinicalNote.isSigned && (
              <Card sx={{ bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="success.dark" gutterBottom>
                    Electronically Signed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Signed by: <strong>{getSignedByName()}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {formatDateTime(clinicalNote.signedAt)}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {clinicalNote.requiresFollowUp && (
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.dark" gutterBottom>
                    Follow-up Required
                  </Typography>
                  {clinicalNote.followUpDate && (
                    <Typography variant="body2" color="text.secondary">
                      Scheduled: <strong>{formatDate(clinicalNote.followUpDate)}</strong>
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>

        <Grid size={{xs: 12, lg: 8}}>
          <Card>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'grey.50' }}
            >
              <Tab label="Clinical Documentation" />
              <Tab label="Additional Information" />
            </Tabs>
            
            {activeTab === 0 && (
              <CardContent sx={{ p: 3 }}>
                {clinicalNote.chiefComplaint && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderColor: 'primary.200' }}>
                    <Typography variant="overline" color="primary.main" fontWeight="bold">
                      Chief Complaint
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {clinicalNote.chiefComplaint}
                    </Typography>
                  </Paper>
                )}

                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                  SOAP Note
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold">
                      Subjective
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {clinicalNote.subjective || 'No subjective information recorded.'}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold">
                      Objective
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {clinicalNote.objective || 'No objective information recorded.'}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold">
                      Assessment
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {clinicalNote.assessment || 'No assessment recorded.'}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight="bold">
                      Plan
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                      {clinicalNote.plan || 'No plan recorded.'}
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            )}

            {activeTab === 1 && (
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {clinicalNote.historyOfPresentIllness && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="overline" color="text.secondary" fontWeight="bold">
                        History of Present Illness
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                        {clinicalNote.historyOfPresentIllness}
                      </Typography>
                    </Paper>
                  )}

                  {clinicalNote.physicalExam && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="overline" color="text.secondary" fontWeight="bold">
                        Physical Exam
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                        {clinicalNote.physicalExam}
                      </Typography>
                    </Paper>
                  )}

                  {clinicalNote.diagnosisCodes?.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="overline" color="text.secondary" fontWeight="bold">
                        Diagnosis Codes
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {clinicalNote.diagnosisCodes.map((code, index) => (
                          <Chip key={index} label={code} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </Paper>
                  )}

                  {clinicalNote.attachments?.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachIcon color="primary" fontSize="small" />
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                          Attachments ({clinicalNote.attachments.length})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {clinicalNote.attachments.map((attachment, index) => {
                          const fileName = attachment.split('/').pop() || `Attachment ${index + 1}`;
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1.5,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': { bgcolor: 'grey.100' },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileIcon color="action" />
                                <Typography variant="body2">{fileName}</Typography>
                              </Box>
                              <Tooltip title="Download/View">
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          );
                        })}
                      </Box>
                    </Paper>
                  )}

                  {!clinicalNote.historyOfPresentIllness && !clinicalNote.physicalExam && !clinicalNote.diagnosisCodes?.length && !clinicalNote.attachments?.length && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No additional information available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteDialog}
        title="Delete Clinical Note"
        message="Are you sure you want to delete this clinical note? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />

      <ConfirmationDialog
        open={signDialog}
        title="Finalize Clinical Note"
        message="Are you sure you want to finalize this note? You will not be able to edit it after signing."
        onConfirm={handleSign}
        onCancel={() => setSignDialog(false)}
        confirmText="Sign & Finalize"
        cancelText="Cancel"
        loading={signLoading}
        severity="warning"
      />
    </Box>
  );
};

export default ViewClinicalNotePage;
