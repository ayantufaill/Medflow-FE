import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { estimateService } from '../../services/estimate.service';

const STATUS_COLORS = {
  draft: 'default',
  sent: 'info',
  accepted: 'success',
  declined: 'error',
  expired: 'warning',
  converted: 'secondary',
};

const ViewEstimatePage = () => {
  const navigate = useNavigate();
  const { estimateId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        setLoading(true);
        const data = await estimateService.getEstimateById(estimateId);
        setEstimate(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load estimate.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEstimate();
  }, [estimateId]);

  const handleConvertToInvoice = async () => {
    try {
      setConverting(true);
      await estimateService.convertToInvoice(estimateId);
      showSnackbar('Estimate converted to invoice successfully', 'success');
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

  const canConvert = estimate?.status === 'accepted';

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
        {canConvert && (
          <Button
            variant="contained"
            startIcon={converting ? <CircularProgress size={20} color="inherit" /> : <ReceiptIcon />}
            onClick={handleConvertToInvoice}
            disabled={converting}
          >
            Convert to Invoice
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Patient
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {estimate?.patient?.firstName} {estimate?.patient?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Created Date
            </Typography>
            <Typography variant="body1">
              {formatDate(estimate?.estimateDate || estimate?.createdAt)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Valid Until
            </Typography>
            <Typography variant="body1">
              {formatDate(estimate?.validUntil)}
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
                  {formatCurrency(estimate?.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewEstimatePage;
