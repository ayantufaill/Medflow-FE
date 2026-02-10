import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { claimService } from '../../services/claim.service';

const STATUS_COLORS = {
  draft: 'default',
  submitted: 'info',
  pending: 'warning',
  paid: 'success',
  partial: 'secondary',
  denied: 'error',
  rejected: 'error',
  cancelled: 'default',
};

const STATUS_ICONS = {
  draft: AssignmentIcon,
  submitted: PendingIcon,
  pending: PendingIcon,
  paid: CheckCircleIcon,
  partial: CheckCircleIcon,
  denied: CancelIcon,
  rejected: CancelIcon,
  cancelled: CancelIcon,
};

const ViewClaimPage = () => {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [claim, setClaim] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [attachedDocuments, setAttachedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClaimDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      const documents = await claimService.getClaimDocuments(claimId);
      setAttachedDocuments(documents);
    } catch (err) {
      console.error('Failed to load claim documents:', err);
    } finally {
      setLoadingDocuments(false);
    }
  }, [claimId]);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const [claimData, historyData] = await Promise.all([
          claimService.getClaimById(claimId),
          claimService.getClaimStatusHistory(claimId).catch(() => []), // Gracefully handle if not available
        ]);
        setClaim(claimData);
        setStatusHistory(Array.isArray(historyData) ? historyData : (historyData?.statusHistory || []));
        // Fetch documents after claim is loaded
        fetchClaimDocuments();
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load claim.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [claimId, fetchClaimDocuments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  const formatDateTime = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY HH:mm') : '-';
  };

  const getStatusChip = (status) => {
    const StatusIcon = STATUS_ICONS[status] || AssignmentIcon;
    const color = STATUS_COLORS[status] || 'default';

    return (
      <Chip
        icon={<StatusIcon fontSize="small" />}
        label={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        color={color}
        size="medium"
        variant={status === 'draft' ? 'outlined' : 'filled'}
      />
    );
  };

  const getStatusTimelineIcon = (status) => {
    const StatusIcon = STATUS_ICONS[status] || AssignmentIcon;
    const color = STATUS_COLORS[status] || 'default';
    return <StatusIcon />;
  };

  const getStatusTimelineColor = (status) => {
    return STATUS_COLORS[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/claims')} sx={{ mb: 2 }}>
          Back to Claims
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/claims')} sx={{ mb: 2 }}>
          Back to Claims
        </Button>
        <Alert severity="warning">Claim not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/claims')}>
          Back to Claims
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Claim Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {claim.claimNumber || claim.claimCode || 'Claim Information'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {getStatusChip(claim.status)}
          {claim.status === 'draft' && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  try {
                    setValidating(true);
                    setValidationDialogOpen(true);
                    const result = await claimService.validateClaim(claimId);
                    setValidationResult(result);
                  } catch (err) {
                    showSnackbar(
                      err.response?.data?.error?.message || 'Failed to validate claim',
                      'error'
                    );
                    setValidationDialogOpen(false);
                  } finally {
                    setValidating(false);
                  }
                }}
                disabled={validating}
              >
                {validating ? 'Validating...' : 'Validate Claim'}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={async () => {
                  if (!validationResult) {
                    showSnackbar('Please validate the claim first', 'warning');
                    return;
                  }
                  if (validationResult.errors && validationResult.errors.length > 0) {
                    showSnackbar('Please fix validation errors before submitting', 'error');
                    setValidationDialogOpen(true);
                    return;
                  }
                  if (
                    window.confirm(
                      'Are you sure you want to submit this claim electronically? This action cannot be undone.'
                    )
                  ) {
                    try {
                      setSubmitting(true);
                      await claimService.submitClaim(claimId);
                      showSnackbar('Claim submitted successfully', 'success');
                      // Refresh claim data
                      const claimData = await claimService.getClaimById(claimId);
                      setClaim(claimData);
                    } catch (err) {
                      showSnackbar(
                        err.response?.data?.error?.message || 'Failed to submit claim',
                        'error'
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }
                }}
                disabled={submitting || !validationResult || (validationResult.errors && validationResult.errors.length > 0)}
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {claim.status === 'denied' && claim.denialReason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Claim Denied
          </Typography>
          <Typography variant="body2">Reason: {claim.denialReason}</Typography>
          {claim.denialDate && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Denied on: {formatDate(claim.denialDate)}
            </Typography>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Row 1: Claim Information | Patient Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Claim Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Claim Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {claim.claimNumber || claim.claimCode || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                {getStatusChip(claim.status)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(claim.submissionDate || claim.submittedDate || claim.createdAt)}
                </Typography>
              </Grid>
              {claim.paidDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Paid Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(claim.paidDate)}
                  </Typography>
                </Grid>
              )}
              {claim.deniedDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Denied Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="error">
                    {formatDate(claim.deniedDate)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {claim.patient?.firstName?.[0] || claim.patientId?.firstName?.[0] || '?'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Patient Name
                </Typography>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                  {claim.patient?.firstName || claim.patientId?.firstName
                    ? `${claim.patient?.firstName || claim.patientId?.firstName} ${claim.patient?.lastName || claim.patientId?.lastName || ''}`.trim()
                    : claim.invoiceId?.patientId?.firstName || claim.invoice?.patientId?.firstName
                    ? `${claim.invoiceId?.patientId?.firstName || claim.invoice?.patientId?.firstName} ${claim.invoiceId?.patientId?.lastName || claim.invoice?.patientId?.lastName || ''}`.trim()
                    : '—'}
                </Typography>
                {(claim.patient?.dateOfBirth || claim.patientId?.dateOfBirth) && (
                  <Typography variant="caption" color="text.secondary">
                    DOB: {formatDate(claim.patient?.dateOfBirth || claim.patientId?.dateOfBirth)}
                  </Typography>
                )}
              </Box>
              {(claim.patient?.firstName || claim.patientId?.firstName || claim.invoiceId?.patientId?.firstName || claim.invoice?.patientId?.firstName) && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const pid = claim.patient?._id || claim.patientId?._id || claim.patientId || claim.invoiceId?.patientId?._id || claim.invoice?.patientId?._id;
                    if (pid && typeof pid === 'string') navigate(`/patients/${pid}`);
                  }}
                >
                  View Patient
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Row 2: Insurance Information | Financial Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Insurance Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Insurance Company
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {claim.insuranceCompany?.name || claim.insuranceCompanyId?.name || '-'}
                </Typography>
              </Grid>
              {claim.policyNumber && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Policy Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.policyNumber}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Claim Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(claim.submittedAmount ?? claim.claimAmount ?? claim.totalAmount ?? 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Paid Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatCurrency(claim.paidAmount || 0)}
                </Typography>
              </Grid>
              {claim.patientResponsibility && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Patient Responsibility
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(claim.patientResponsibility)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Row 3: Attached Documents */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Attached Documents</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Attach Document
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {loadingDocuments ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : attachedDocuments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No documents attached to this claim
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Uploaded Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attachedDocuments.map((doc) => (
                      <TableRow key={doc._id || doc.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon fontSize="small" color="action" />
                            <Typography variant="body2">{doc.documentName || doc.name || 'Untitled'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={doc.documentType || 'Document'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{formatDate(doc.uploadedAt || doc.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            {doc.storagePath && (
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(doc.storagePath, '_blank')}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={async () => {
                                  if (window.confirm('Are you sure you want to remove this document?')) {
                                    try {
                                      await claimService.removeClaimDocument(claimId, doc._id || doc.id);
                                      showSnackbar('Document removed successfully', 'success');
                                      fetchClaimDocuments();
                                    } catch (err) {
                                      showSnackbar(
                                        err.response?.data?.error?.message || 'Failed to remove document',
                                        'error'
                                      );
                                    }
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Status History - sabse neeche, full width, vertical */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {statusHistory.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {statusHistory.map((historyItem, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, mr: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${getStatusTimelineColor(historyItem.status)}.main`,
                          width: 36,
                          height: 36,
                        }}
                      >
                        {getStatusTimelineIcon(historyItem.status)}
                      </Avatar>
                      {index < statusHistory.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            minHeight: 28,
                            bgcolor: 'divider',
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, py: 0.5, pb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {historyItem.status
                          ? historyItem.status.charAt(0).toUpperCase() + historyItem.status.slice(1)
                          : 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDateTime(historyItem.timestamp || historyItem.date)}
                      </Typography>
                      {historyItem.note && (
                        <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
                          {historyItem.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status
                </Typography>
                {getStatusChip(claim.status)}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {formatDateTime(claim.updatedAt || claim.createdAt)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Claim Validation Dialog */}
      <Dialog
        open={validationDialogOpen}
        onClose={() => {
          setValidationDialogOpen(false);
          setValidationResult(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {validationResult && validationResult.errors && validationResult.errors.length === 0 ? (
              <CheckCircleIcon color="success" />
            ) : (
              <ErrorIcon color="error" />
            )}
            <Typography variant="h6">
              Claim Validation Results
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {validating ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : validationResult ? (
            <Box>
              {validationResult.errors && validationResult.errors.length === 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Claim is valid and ready for submission!
                  </Typography>
                </Alert>
              )}
              {validationResult.errors && validationResult.errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {validationResult.errors.length} Error(s) Found
                  </Typography>
                  <List dense>
                    {validationResult.errors.map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ErrorIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={error.field ? `${error.field}: ${error.message}` : error.message}
                          secondary={error.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
              {validationResult.warnings && validationResult.warnings.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {validationResult.warnings.length} Warning(s)
                  </Typography>
                  <List dense>
                    {validationResult.warnings.map((warning, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={typeof warning === 'string' ? warning : (warning.field ? `${warning.field}: ${warning.message}` : warning.message)}
                          secondary={typeof warning === 'object' ? warning.description : undefined}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
              {validationResult.summary && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Validation Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {validationResult.summary}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setValidationDialogOpen(false);
              setValidationResult(null);
            }}
          >
            Close
          </Button>
          {validationResult &&
            validationResult.errors &&
            validationResult.errors.length === 0 && (
              <Button
                variant="contained"
                onClick={async () => {
                  setValidationDialogOpen(false);
                  if (
                    window.confirm(
                      'Are you sure you want to submit this claim electronically? This action cannot be undone.'
                    )
                  ) {
                    try {
                      setSubmitting(true);
                      await claimService.submitClaim(claimId);
                      showSnackbar('Claim submitted successfully', 'success');
                      const claimData = await claimService.getClaimById(claimId);
                      setClaim(claimData);
                      setValidationResult(null);
                    } catch (err) {
                      showSnackbar(
                        err.response?.data?.error?.message || 'Failed to submit claim',
                        'error'
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }
                }}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </Button>
            )}
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attach Document to Claim</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Diagnosis Codes, X-Ray Report"
              required
            />
            <Box>
              <input
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                style={{ display: 'none' }}
                id="claim-document-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    if (!documentName) {
                      setDocumentName(file.name);
                    }
                  }
                }}
              />
              <label htmlFor="claim-document-upload">
                <Button variant="outlined" component="span" fullWidth startIcon={<AttachFileIcon />}>
                  {selectedFile ? selectedFile.name : 'Select File'}
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!documentName || !selectedFile) {
                showSnackbar('Please provide document name and select a file', 'error');
                return;
              }

              try {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('documentName', documentName);
                formData.append('documentType', 'claim_attachment');
                formData.append('description', `Document attached to claim ${claim.claimNumber || claim.claimCode}`);

                await claimService.attachDocument(claimId, formData);
                showSnackbar('Document attached successfully', 'success');
                setUploadDialogOpen(false);
                setDocumentName('');
                setSelectedFile(null);
                fetchClaimDocuments();
              } catch (err) {
                showSnackbar(
                  err.response?.data?.error?.message || 'Failed to attach document',
                  'error'
                );
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading || !documentName || !selectedFile}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Attach'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewClaimPage;
