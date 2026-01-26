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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { paymentService } from '../../services/payment.service';

const METHOD_LABELS = {
  cash: 'Cash',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  check: 'Check',
  insurance: 'Insurance',
  bank_transfer: 'Bank Transfer',
  other: 'Other',
};

const ViewPaymentPage = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentById(paymentId);
        setPayment(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load payment details.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY h:mm A') : '-';
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/payments')} sx={{ mb: 2 }}>
          Back to Payments
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/payments')}>
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Payment Details
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Receipt Number
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {payment?.receiptNumber || '-'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {formatCurrency(payment?.amount)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Payment Method
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={METHOD_LABELS[payment?.paymentMethod] || payment?.paymentMethod}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Patient
            </Typography>
            <Typography variant="body1">
              {payment?.patient?.firstName} {payment?.patient?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Invoice
            </Typography>
            <Typography variant="body1">
              {payment?.invoice?.invoiceNumber || 'No invoice linked'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Payment Date
            </Typography>
            <Typography variant="body1">
              {formatDate(payment?.paymentDate)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Reference Number
            </Typography>
            <Typography variant="body1">
              {payment?.referenceNumber || '-'}
            </Typography>
          </Grid>

          {payment?.notes && (
            <Grid size={12}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body1">{payment.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewPaymentPage;
