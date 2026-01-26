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
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Description as DocIcon,
  Download as DownloadIcon,
  Lock as ConfidentialIcon,
  CalendarToday as DateIcon,
  Person as UploadedByIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { documentService } from '../../services/document.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const DOCUMENT_TYPE_LABELS = {
  insurance_card: 'Insurance Card',
  id: 'ID Document',
  lab_result: 'Lab Result',
  imaging: 'Imaging/X-Ray',
  consent_form: 'Consent Form',
  treatment_plan: 'Treatment Plan',
  referral: 'Referral',
  prescription: 'Prescription',
  other: 'Other',
};

const DOCUMENT_TYPE_COLORS = {
  insurance_card: 'primary',
  id: 'secondary',
  lab_result: 'error',
  imaging: 'warning',
  consent_form: 'info',
  treatment_plan: 'success',
  referral: 'default',
  prescription: 'primary',
  other: 'default',
};

const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PatientDocumentsTab = ({ patientId }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, document: null });
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await documentService.getDocumentsByPatient(patientId, 1, 50);
      setDocuments(result.documents || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDocuments();
    }
  }, [patientId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const handleDownload = (document) => {
    if (document.storagePath) {
      window.open(document.storagePath, '_blank');
    }
  };

  const getUploadedByName = (doc) => {
    if (doc.uploadedBy?.firstName && doc.uploadedBy?.lastName) {
      return `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`;
    }
    return 'Unknown';
  };

  const handleDeleteClick = (doc) => {
    setDeleteDialog({ open: true, document: doc });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.document) return;
    try {
      setDeleting(true);
      await documentService.deleteDocument(deleteDialog.document._id);
      showSnackbar('Document deleted successfully', 'success');
      setDeleteDialog({ open: false, document: null });
      fetchDocuments();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete document',
        'error'
      );
    } finally {
      setDeleting(false);
    }
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
          Documents ({documents.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchDocuments} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/documents/upload?patientId=${patientId}`)}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <Alert severity="info">No documents uploaded for this patient.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {documents.map((doc) => (
            <Card 
              key={doc._id} 
              variant="outlined"
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DocIcon color="action" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {doc.documentName}
                      </Typography>
                      {doc.isConfidential && (
                        <Tooltip title="Confidential Document">
                          <ConfidentialIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="caption" color="text.secondary">
                          Type
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                            color={DOCUMENT_TYPE_COLORS[doc.documentType] || 'default'}
                            size="small"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="caption" color="text.secondary">
                          Size
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatFileSize(doc.fileSizeInBytes)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DateIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Uploaded
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(doc.createdAt)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <UploadedByIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Uploaded By
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {getUploadedByName(doc)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="caption" color="text.secondary">
                          Expires
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={doc.expirationDate && dayjs(doc.expirationDate).isBefore(dayjs()) ? 'error.main' : 'inherit'}
                        >
                          {doc.expirationDate ? formatDate(doc.expirationDate) : '-'}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="caption" color="text.secondary">
                          OCR Enabled
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {doc.enableOCR ? 'Yes' : 'No'}
                        </Typography>
                      </Grid>

                      {doc.tags && doc.tags.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <TagIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              Tags
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {doc.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      {doc.description && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Description
                          </Typography>
                          <Typography variant="body2">
                            {doc.description}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {doc.storagePath && (
                      <Tooltip title="Download">
                        <IconButton
                          onClick={() => handleDownload(doc)}
                          size="small"
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/documents/${doc._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(doc)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteDialog.document?.documentName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, document: null })}
      />
    </Box>
  );
};

export default PatientDocumentsTab;
