import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { estimateService } from '../../services/estimate.service';
import { appointmentService } from '../../services/appointment.service';

const STATUS_COLORS = {
  draft: 'default',
  sent: 'info',
  approved: 'success',
  expired: 'warning',
  converted: 'secondary',
};

const ViewEstimatePage = () => {
  const navigate = useNavigate();
  const { estimateId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);
  const [sending, setSending] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [convertAppointmentId, setConvertAppointmentId] = useState('');
  const [convertDueDate, setConvertDueDate] = useState(dayjs().add(14, 'day'));
  const [appointments, setAppointments] = useState([]);

  const fetchEstimate = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const data = await estimateService.getEstimateById(estimateId);
        setEstimate(data);
      } catch (err) {
        if (showLoading) {
          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              'Failed to load estimate.'
          );
        }
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [estimateId]
  );

  useEffect(() => {
    fetchEstimate(true);
  }, [fetchEstimate]);

  // Open convert dialog when coming from list "Convert to Invoice" (?openConvert=1)
  useEffect(() => {
    if (!estimate || estimate?.status !== 'approved' || searchParams.get('openConvert') !== '1') return;
    const patientId = estimate?.patient?._id || estimate?.patientId;
    if (!patientId) return;
    setSearchParams({}, { replace: true });
    setConvertDialogOpen(true);
    appointmentService.getAppointmentsByPatient(patientId, 1, 50).then((result) => {
      setAppointments(Array.isArray(result) ? result : (result?.appointments || []));
    }).catch(() => setAppointments([]));
  }, [estimate, estimate?.status, searchParams, setSearchParams]);

  // Auto-refresh when patient approves/declines from email (tab focus + poll when status is Sent)
  useEffect(() => {
    if (!estimateId || !estimate) return;
    const isPendingResponse = estimate?.status === 'sent';
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchEstimate(false);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    const pollInterval = isPendingResponse ? setInterval(() => fetchEstimate(false), 30000) : null;
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [estimateId, estimate?.status, fetchEstimate]);

  const handleSendToPatient = async () => {
    try {
      setSending(true);
      await estimateService.sendToPatient(estimateId);
      showSnackbar('Estimate sent to patient successfully', 'success');
      const data = await estimateService.getEstimateById(estimateId);
      setEstimate(data);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to send estimate to patient',
        'error'
      );
    } finally {
      setSending(false);
    }
  };

  const handleOpenConvertDialog = async () => {
    const patientId = estimate?.patient?._id || estimate?.patientId;
    if (!patientId) {
      showSnackbar('Patient not found', 'error');
      return;
    }
    setConvertDialogOpen(true);
    try {
      const result = await appointmentService.getAppointmentsByPatient(patientId, 1, 50);
      setAppointments(Array.isArray(result) ? result : (result?.appointments || []));
    } catch {
      setAppointments([]);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!convertAppointmentId || !convertDueDate) {
      showSnackbar('Please select appointment and due date', 'error');
      return;
    }
    try {
      setConverting(true);
      await estimateService.convertToInvoice(estimateId, {
        appointmentId: convertAppointmentId,
        dueDate: dayjs(convertDueDate).toISOString(),
      });
      showSnackbar('Estimate converted to invoice successfully', 'success');
      setConvertDialogOpen(false);
      navigate('/invoices');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to convert estimate',
        'error'
      );
    } finally {
      setConverting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/estimates')} sx={{ mb: 2 }}>
          Back to Estimates
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const canConvert = estimate?.status === 'approved';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/estimates')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Estimate {estimate?.estimateNumber}
          </Typography>
          <Chip
            label={estimate?.status?.charAt(0).toUpperCase() + estimate?.status?.slice(1)}
            color={STATUS_COLORS[estimate?.status] || 'default'}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {(estimate?.status === 'draft' || estimate?.status === 'expired') && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/estimates/${estimateId}/edit`)}
            >
              Edit
            </Button>
          )}
          {estimate?.status === 'draft' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={handleSendToPatient}
              disabled={sending}
            >
              Send to Patient
            </Button>
          )}
          {canConvert && (
            <Button
              variant="contained"
              startIcon={converting ? <CircularProgress size={20} color="inherit" /> : <ReceiptIcon />}
              onClick={handleOpenConvertDialog}
              disabled={converting}
            >
              Convert to Invoice
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Patient
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {estimate?.patient?.firstName || estimate?.patientId?.firstName}{' '}
              {estimate?.patient?.lastName || estimate?.patientId?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Created Date
            </Typography>
            <Typography variant="body1">
              {formatDate(estimate?.estimateDate || estimate?.createdDate || estimate?.createdAt)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Valid Until
            </Typography>
            <Typography variant="body1">
              {formatDate(estimate?.validUntil || estimate?.expirationDate)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Line Items */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Estimated Services
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimate?.lineItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
              {(!estimate?.lineItems || estimate.lineItems.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">No services listed</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Estimate vs Actual (when converted) */}
      {estimate?.status === 'converted' && (estimate?.actualPaidAmount != null || estimate?.convertedInvoiceId) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Estimate vs Actual
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">Estimated Amount</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(estimate?.totalAmount ?? estimate?.estimatedAmount)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">Actual Paid (Claim)</Typography>
              <Typography variant="body1" fontWeight="medium" color="success.main">
                {formatCurrency(estimate?.actualPaidAmount ?? 0)}
              </Typography>
            </Grid>
            {estimate?.linkedClaimId && (
              <Grid size={{ xs: 12 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/claims/${estimate.linkedClaimId}`)}
                >
                  View Claim
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Summary */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            {estimate?.notes && (
              <>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body2">{estimate.notes}</Typography>
              </>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <Typography fontWeight="bold">Total Estimate:</Typography>
                <Typography fontWeight="bold" color="primary" variant="h6">
                  {formatCurrency(estimate?.totalAmount ?? estimate?.estimatedAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Convert to Invoice Dialog */}
      <Dialog open={convertDialogOpen} onClose={() => setConvertDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Convert Estimate to Invoice</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Appointment</InputLabel>
              <Select
                value={convertAppointmentId}
                label="Appointment"
                onChange={(e) => setConvertAppointmentId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select appointment</em>
                </MenuItem>
                {appointments.map((apt) => (
                  <MenuItem key={apt._id || apt.id} value={apt._id || apt.id}>
                    {apt.appointmentCode || apt.code || apt._id} - {formatDate(apt.appointmentDate || apt.date)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={convertDueDate}
                onChange={(v) => setConvertDueDate(v)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConvertToInvoice}
            disabled={converting || !convertAppointmentId || !convertDueDate}
            startIcon={converting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {converting ? 'Converting...' : 'Convert'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewEstimatePage;
