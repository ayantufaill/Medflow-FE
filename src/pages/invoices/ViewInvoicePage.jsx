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
  Edit as EditIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { invoiceService } from '../../services/invoice.service';

const STATUS_COLORS = {
  draft: 'default',
  pending: 'warning',
  sent: 'info',
  paid: 'success',
  partial: 'secondary',
  overdue: 'error',
  cancelled: 'default',
};

const ViewInvoicePage = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await invoiceService.getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load invoice.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')} sx={{ mb: 2 }}>
          Back to Invoices
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const canEdit = invoice?.status === 'draft' || invoice?.status === 'pending';
  const canPay = invoice?.status !== 'paid' && invoice?.status !== 'cancelled';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Invoice {invoice?.invoiceNumber}
          </Typography>
          <Chip
            label={invoice?.status?.charAt(0).toUpperCase() + invoice?.status?.slice(1)}
            color={STATUS_COLORS[invoice?.status] || 'default'}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canPay && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PaymentIcon />}
              onClick={() => navigate(`/payments/new?invoiceId=${invoiceId}`)}
            >
              Record Payment
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/invoices/${invoiceId}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Patient
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {invoice?.patient?.firstName} {invoice?.patient?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Provider
            </Typography>
            <Typography variant="body1">
              {invoice?.provider?.userId?.firstName} {invoice?.provider?.userId?.lastName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Date of Service
            </Typography>
            <Typography variant="body1">
              {formatDate(invoice?.dateOfService)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {formatDate(invoice?.dueDate)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Line Items */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Line Items
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
              {invoice?.lineItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
              {(!invoice?.lineItems || invoice.lineItems.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">No line items</Typography>
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
            {invoice?.notes && (
              <>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body2">{invoice.notes}</Typography>
              </>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography>{formatCurrency(invoice?.totalAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <Typography color="text.secondary">Paid:</Typography>
                <Typography color="success.main">
                  -{formatCurrency((invoice?.totalAmount || 0) - (invoice?.balanceDue || 0))}
                </Typography>
              </Box>
              <Divider sx={{ width: '200px' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <Typography fontWeight="bold">Balance Due:</Typography>
                <Typography fontWeight="bold" color="primary">
                  {formatCurrency(invoice?.balanceDue)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewInvoicePage;
