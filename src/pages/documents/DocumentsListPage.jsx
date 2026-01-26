import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  TextField,
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
  Refresh as RefreshIcon,
  Description as DocIcon,
  Download as DownloadIcon,
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

const DocumentsListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    patientId: searchParams.get('patientId') || '',
    documentType: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, documentId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const result = await documentService.getAllDocuments(
        pagination.page,
        pagination.limit,
        filters
      );
      setDocuments(result.documents);
      setPagination(result.pagination);
    } catch (err) {
      showSnackbar('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const result = await patientService.getAllPatients(1, 100);
      setPatients(result.patients || []);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [pagination.page, pagination.limit, filters]);

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

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const debouncedSearch = useDebouncedCallback((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, 300);

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  const handleDownload = async (document) => {
    try {
      if (document.storagePath) {
        window.open(document.storagePath, '_blank');
      } else {
        showSnackbar('Document download link not available', 'error');
      }
    } catch (err) {
      showSnackbar('Failed to download document', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await documentService.deleteDocument(deleteDialog.documentId);
      showSnackbar('Document deleted successfully', 'success');
      fetchDocuments();
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

  const getPatientName = (document) => {
    if (document.patientId?.firstName && document.patientId?.lastName) {
      return `${document.patientId.firstName} ${document.patientId.lastName}`;
    }
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Documents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient documents and files
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDocuments}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/documents/upload')}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search documents"
              placeholder="Search by name, description..."
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Patient</InputLabel>
              <Select
                value={filters.patientId}
                onChange={handleFilterChange('patientId')}
                label="Patient"
              >
                <MenuItem value="">All Patients</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Document Type</InputLabel>
              <Select
                value={filters.documentType}
                onChange={handleFilterChange('documentType')}
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
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={handleFilterChange('startDate')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={handleFilterChange('endDate')}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">No documents found</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Patient</TableCell>
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
                    <TableCell>{getPatientName(document)}</TableCell>
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
                            onClick={() => handleDownload(document)}
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

export default DocumentsListPage;
