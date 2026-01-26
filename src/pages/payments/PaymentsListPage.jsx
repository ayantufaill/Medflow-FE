import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear,
  FilterAltOff,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { paymentService } from '../../services/payment.service';
import dayjs from 'dayjs';

const METHOD_LABELS = {
  cash: 'Cash',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  check: 'Check',
  insurance: 'Insurance',
  bank_transfer: 'Bank Transfer',
  other: 'Other',
};

const PaymentsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    paymentId: null,
  });

  const handleResetFilters = () => {
    setSearch('');
    setMethodFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || methodFilter;

  const fetchPayments = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue?.trim() || undefined,
        paymentMethod: methodFilter || undefined,
      };

      const result = await paymentService.getAllPayments(params);
      setPayments(result.payments || []);
      setTotalPayments(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch payments.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, methodFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchPayments(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchPayments(search);
  }, [page, rowsPerPage, methodFilter]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, paymentId) => {
    setActionMenu({ anchorEl: event.currentTarget, paymentId });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleViewDetails = (paymentId) => {
    handleActionMenuClose();
    navigate(`/payments/${paymentId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY h:mm A') : '-';
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Payments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/payments/new')}
        >
          Record Payment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid size={7}>
            <TextField
              fullWidth
              placeholder="Search by receipt #, patient name, invoice #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search.length > 0 && (
                  <IconButton size="small" onClick={() => setSearch('')}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={methodFilter}
                label="Payment Method"
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Methods</em>
                </MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit_card">Credit Card</MenuItem>
                <MenuItem value="debit_card">Debit Card</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="insurance">Insurance</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title="Clear Filters">
                <span>
                  <IconButton
                    onClick={handleResetFilters}
                    disabled={loading || !hasActiveFilters}
                    color="primary"
                  >
                    <FilterAltOff />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refresh">
                <span>
                  <IconButton onClick={() => fetchPayments(search)} disabled={loading} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Receipt #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No payments found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment._id || payment.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {payment.receiptNumber || payment.paymentCode || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>
                          {payment.patient?.firstName && payment.patient?.lastName
                            ? `${payment.patient.firstName} ${payment.patient.lastName}`
                            : payment.patientId?.firstName && payment.patientId?.lastName
                            ? `${payment.patientId.firstName} ${payment.patientId.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell>{payment.invoice?.invoiceNumber || payment.invoiceId?.invoiceNumber || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatPrice(payment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionMenuOpen(e, payment._id || payment.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalPayments}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.paymentId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PaymentsListPage;
