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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  AttachFile as AttachIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Description as DocIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { documentService } from '../../services/document.service';
import { clinicalNoteService } from '../../services/clinical-note.service';
import {
  getDocumentTypeLabel,
  getDocumentTypeColor,
  formatFileSize,
} from '../../validations/documentValidations';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ViewDocumentPage = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [document, setDocument] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [attachDialog, setAttachDialog] = useState(false);
  const [attachLoading, setAttachLoading] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await documentService.getDocumentById(documentId);
        setDocument(data);

        if (data.patientId?._id) {
          const notesResult = await clinicalNoteService.getClinicalNotesByPatient(
            data.patientId._id,
            1,
            50
          );
          setClinicalNotes(
            (notesResult.clinicalNotes || []).filter((n) => !n.isSigned)
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load document'
        );
        showSnackbar('Failed to load document', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId, showSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await documentService.deleteDocument(documentId);
      showSnackbar('Document deleted successfully', 'success');
      navigate('/documents');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete document',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const handleAttachToNote = async () => {
    if (!selectedNoteId) {
      showSnackbar('Please select a clinical note', 'warning');
      return;
    }

    try {
      setAttachLoading(true);
      await documentService.attachToNote(documentId, selectedNoteId);
      showSnackbar('Document attached to clinical note successfully', 'success');
      setAttachDialog(false);
      setSelectedNoteId('');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to attach document',
        'error'
      );
    } finally {
      setAttachLoading(false);
    }
  };

  const getPatientName = () => {
    if (document?.patientId?.firstName && document?.patientId?.lastName) {
      return `${document.patientId.firstName} ${document.patientId.lastName}`;
    }
    return 'Unknown Patient';
  };

  const getUploadedByName = () => {
    if (document?.uploadedBy?.firstName && document?.uploadedBy?.lastName) {
      return `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`;
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

  if (error || !document) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          Back to Documents
        </Button>
        <Alert severity="error">{error || 'Document not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/documents')}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {document.documentName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <Chip
                label={getDocumentTypeLabel(document.documentType)}
                color={getDocumentTypeColor(document.documentType)}
              />
              {document.isConfidential && (
                <Chip icon={<LockIcon />} label="Confidential" color="error" />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {document.storagePath && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              component="a"
              href={document.storagePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<AttachIcon />}
            onClick={() => setAttachDialog(true)}
            disabled={clinicalNotes.length === 0}
          >
            Attach to Note
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getPatientName()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DocIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body1">
                    {formatFileSize(document.fileSizeInBytes)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EventIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded On
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(document.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded By
                  </Typography>
                  <Typography variant="body1">
                    {getUploadedByName()}
                  </Typography>
                </Box>
              </Box>

              {document.expirationDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Expiration Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(document.expirationDate)}
                  </Typography>
                </Box>
              )}

              {document.mimeType && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    File Type
                  </Typography>
                  <Typography variant="body1">
                    {document.mimeType}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {document.description && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {document.description}
              </Typography>
            </Paper>
          )}

          {document.tags?.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {document.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}

          {document.storagePath && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              {document.mimeType?.startsWith('image/') ? (
                <Box
                  component="img"
                  src={document.storagePath}
                  alt={document.documentName}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 500,
                    objectFit: 'contain',
                  }}
                />
              ) : document.mimeType === 'application/pdf' ? (
                <Box
                  component="iframe"
                  src={document.storagePath}
                  sx={{
                    width: '100%',
                    height: 500,
                    border: 'none',
                  }}
                />
              ) : (
                <Alert severity="info">
                  Preview not available for this file type. Please download to view.
                </Alert>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteDialog}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />

      <Dialog open={attachDialog} onClose={() => setAttachDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attach Document to Clinical Note</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {clinicalNotes.length === 0 ? (
              <Alert severity="info">
                No unsigned clinical notes available for this patient.
              </Alert>
            ) : (
              <FormControl fullWidth>
                <InputLabel>Select Clinical Note</InputLabel>
                <Select
                  value={selectedNoteId}
                  onChange={(e) => setSelectedNoteId(e.target.value)}
                  label="Select Clinical Note"
                >
                  {clinicalNotes.map((note) => (
                    <MenuItem key={note._id} value={note._id}>
                      {formatDate(note.createdAt)} - {note.chiefComplaint || 'No Chief Complaint'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttachDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAttachToNote}
            variant="contained"
            disabled={attachLoading || !selectedNoteId}
          >
            {attachLoading ? <CircularProgress size={20} /> : 'Attach'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewDocumentPage;
