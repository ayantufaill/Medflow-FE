import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as SignedIcon,
  Description as NoteIcon,
  Person as ProviderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as DraftIcon,
  Event as FollowUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { clinicalNoteService } from '../../services/clinical-note.service';

const NOTE_TYPE_LABELS = {
  soap: 'SOAP Note',
  progress: 'Progress Note',
  initial_evaluation: 'Initial Evaluation',
  follow_up: 'Follow Up',
  procedure: 'Procedure Note',
  consultation: 'Consultation',
  discharge_summary: 'Discharge Summary',
  other: 'Other',
};

const NOTE_TYPE_COLORS = {
  soap: 'primary',
  progress: 'info',
  initial_evaluation: 'success',
  follow_up: 'secondary',
  procedure: 'warning',
  consultation: 'default',
  discharge_summary: 'error',
  other: 'default',
};

const PatientNotesTab = ({ patientId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await clinicalNoteService.getAllClinicalNotes(1, 50, { patientId });
      setNotes(result.clinicalNotes || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load clinical notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchNotes();
    }
  }, [patientId]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MMM DD, YYYY h:mm A');
  };

  const getProviderName = (note) => {
    if (note.providerId?.userId?.firstName && note.providerId?.userId?.lastName) {
      return `Dr. ${note.providerId.userId.firstName} ${note.providerId.userId.lastName}`;
    }
    if (note.providerId?.firstName && note.providerId?.lastName) {
      return `Dr. ${note.providerId.firstName} ${note.providerId.lastName}`;
    }
    return 'Unknown Provider';
  };

  const handleEditNote = (e, noteId) => {
    e.stopPropagation();
    navigate(`/clinical-notes/${noteId}/edit`);
  };

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="medium">
          Clinical Notes ({notes.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchNotes} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/clinical-notes/create?patientId=${patientId}`)}
          >
            Create Note
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notes.length === 0 ? (
        <Alert severity="info">No clinical notes recorded for this patient.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notes.map((note) => (
            <Card 
              key={note._id} 
              variant="outlined"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', boxShadow: 1 }
              }}
              onClick={() => navigate(`/clinical-notes/${note._id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <NoteIcon color="action" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {note.chiefComplaint || 'Clinical Note'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ProviderIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {getProviderName(note)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={NOTE_TYPE_LABELS[note.noteType] || note.noteType}
                      color={NOTE_TYPE_COLORS[note.noteType] || 'default'}
                      size="small"
                    />
                    {note.isSigned ? (
                      <Chip
                        icon={<SignedIcon />}
                        label="Signed"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<DraftIcon />}
                        label="Draft"
                        color="warning"
                        size="small"
                      />
                    )}
                    {!note.isSigned && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={(e) => handleEditNote(e, note._id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Note Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDateTime(note.noteDate)}
                    </Typography>
                  </Grid>

                  {note.appointmentId && (
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Appointment
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {dayjs(note.appointmentId.appointmentDate).format('MMM DD, YYYY')}
                      </Typography>
                    </Grid>
                  )}

                  {note.isSigned && note.signedAt && (
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Signed At
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDateTime(note.signedAt)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {note.requiresFollowUp && note.followUpDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <FollowUpIcon fontSize="small" color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      Follow-up: <strong>{dayjs(note.followUpDate).format('MMM DD, YYYY')}</strong>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PatientNotesTab;
