import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Description as DocIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { documentService } from '../../services/document.service';
import { patientService } from '../../services/patient.service';
import {
  DOCUMENT_TYPES,
  getDocumentTypeLabel,
  getDocumentTypeColor,
  formatFileSize,
} from '../../validations/documentValidations';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const PatientDocumentsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentType, setDocumentType] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, documentId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientData, docsResult] = await Promise.all([
        patientService.getPatientById(patientId),
        documentService.getDocumentsByPatient(
          patientId,
          pagination.page,
          pagination.limit,
          documentType || null
        ),
      ]);
      setPatient(patientData);
      setDocuments(docsResult.documents || []);
      setPagination(docsResult.pagination || pagination);
    } catch (err) {
      showSnackbar('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId, pagination.page, pagination.limit, documentType]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await documentService.deleteDocument(deleteDialog.documentId);
      showSnackbar('Document deleted successfully', 'success');
      fetchData();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete document',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, documentId: null });
    }
  };

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    return 'Unknown Patient';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Patient Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getPatientName()}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/documents/upload?patientId=${patientId}`)}
        >
          Upload Document
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Document Type</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => {
                  setDocumentType(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                label="Document Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {DOCUMENT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">No documents found for this patient</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Uploaded By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DocIcon color="action" />
                        <Typography variant="body2">
                          {document.documentName}
                        </Typography>
                        {document.isConfidential && (
                          <Chip label="Confidential" size="small" color="error" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getDocumentTypeLabel(document.documentType)}
                        size="small"
                        color={getDocumentTypeColor(document.documentType)}
                      />
                    </TableCell>
                    <TableCell>{formatFileSize(document.fileSizeInBytes)}</TableCell>
                    <TableCell>{formatDate(document.createdAt)}</TableCell>
                    <TableCell>
                      {document.uploadedBy?.firstName} {document.uploadedBy?.lastName}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/documents/${document._id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {document.storagePath && (
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            component="a"
                            href={document.storagePath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({ open: true, documentId: document._id })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, documentId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />
    </Box>
  );
};

export default PatientDocumentsPage;
