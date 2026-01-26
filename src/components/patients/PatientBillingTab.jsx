import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { invoiceService } from '../../services/invoice.service';
import { paymentService } from '../../services/payment.service';
import { INVOICE_STATUSES } from '../../validations/invoiceValidations';
import { PAYMENT_METHODS } from '../../validations/paymentValidations';

const PatientBillingTab = ({ patient }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState({
    totalBilled: 0,
    totalPaid: 0,
    outstanding: 0,
    accountCredit: 0,
  });

  const patientId = patient?._id || patient?.id;

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        setError('');

        const [invoicesResult, paymentsResult, balanceResult] = await Promise.all([
          invoiceService.getInvoicesByPatient(patientId),
          paymentService.getPaymentsByPatient(patientId),
          invoiceService.getPatientBalance(patientId),
        ]);

        setInvoices(invoicesResult.invoices || []);
        setPayments(paymentsResult.payments || []);
        setBalance(balanceResult || {
          totalBilled: 0,
          totalPaid: 0,
          outstanding: 0,
          accountCredit: 0,
        });
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load billing information.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [patientId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return dayjs(date).format('MMM DD, YYYY');
  };

  const getStatusChip = (status) => {
    const statusConfig = INVOICE_STATUSES.find(s => s.value === status) || {
      label: status,
      color: 'default',
    };
    return <Chip label={statusConfig.label} color={statusConfig.color} size="small" />;
  };

  const getPaymentMethodLabel = (method) => {
    const methodConfig = PAYMENT_METHODS.find(m => m.value === method);
    return methodConfig ? `${methodConfig.icon} ${methodConfig.label}` : method;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Account Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Account Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total Billed
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(balance.totalBilled)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total Paid
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(balance.totalPaid)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: balance.outstanding > 0 ? 'error.50' : 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Outstanding Balance
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={balance.outstanding > 0 ? 'error.main' : 'text.primary'}
              >
                {formatCurrency(balance.outstanding)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: balance.accountCredit > 0 ? 'info.50' : 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Account Credit
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                color={balance.accountCredit > 0 ? 'info.main' : 'text.primary'}
              >
                {formatCurrency(balance.accountCredit)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate(`/invoices/new?patientId=${patientId}`)}
          >
            Create Invoice
          </Button>
          {balance.outstanding > 0 && (
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={() => navigate(`/payments/new?patientId=${patientId}`)}
            >
              Record Payment
            </Button>
          )}
        </Box>
      </Paper>

      {/* Invoices and Payments Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label={`Invoices (${invoices.length})`} />
          <Tab label={`Payments (${payments.length})`} />
        </Tabs>
        <Divider />

        {activeTab === 0 && (
          <Box>
            {invoices.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  No invoices found for this patient.
                </Typography>
                <Button
                  sx={{ mt: 2 }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/invoices/new?patientId=${patientId}`)}
                >
                  Create First Invoice
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Balance Due</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.slice(0, 10).map((invoice) => (
                      <TableRow key={invoice._id || invoice.id} hover>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {invoice.invoiceNumber || `INV-${(invoice._id || invoice.id)?.slice(-6)}`}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(invoice.dateOfService)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight="medium"
                            color={invoice.balanceDue > 0 ? 'error.main' : 'success.main'}
                          >
                            {formatCurrency(invoice.balanceDue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{getStatusChip(invoice.status)}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/invoices/${invoice._id || invoice.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {invoices.length > 10 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button onClick={() => navigate(`/invoices?patientId=${patientId}`)}>
                  View All {invoices.length} Invoices
                </Button>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {payments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <PaymentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  No payments recorded for this patient.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.slice(0, 10).map((payment) => (
                      <TableRow key={payment._id || payment.id} hover>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentMethodLabel(payment.paymentMethod)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{payment.referenceNumber || '-'}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="success.main">
                            {formatCurrency(payment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/payments/${payment._id || payment.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {payments.length > 10 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button onClick={() => navigate(`/payments?patientId=${patientId}`)}>
                  View All {payments.length} Payments
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PatientBillingTab;
