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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear,
  FilterAltOff,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { invoiceService } from '../../services/invoice.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import dayjs from 'dayjs';

const STATUS_COLORS = {
  draft: 'default',
  pending: 'warning',
  sent: 'info',
  paid: 'success',
  partial: 'secondary',
  overdue: 'error',
  cancelled: 'default',
};

const InvoicesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    invoiceId: null,
    invoiceNumber: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    invoiceId: null,
    invoiceNumber: '',
    status: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter;

  const fetchInvoices = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue?.trim() || undefined,
        status: statusFilter || undefined,
      };

      const result = await invoiceService.getAllInvoices(params);
      setInvoices(result.invoices || []);
      setTotalInvoices(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch invoices.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchInvoices(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchInvoices(search);
  }, [page, rowsPerPage, statusFilter]);

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

  const handleDeleteClick = (invoiceId, invoiceNumber) => {
    setDeleteDialog({ open: true, invoiceId, invoiceNumber });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await invoiceService.deleteInvoice(deleteDialog.invoiceId);
      showSnackbar('Invoice deleted successfully', 'success');
      setDeleteDialog({ open: false, invoiceId: null, invoiceNumber: '' });
      await fetchInvoices(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete invoice',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, invoiceId: null, invoiceNumber: '' });
  };

  const handleActionMenuOpen = (event, invoiceId, invoiceNumber, status) => {
    setActionMenu({ anchorEl: event.currentTarget, invoiceId, invoiceNumber, status });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleViewDetails = (invoiceId) => {
    handleActionMenuClose();
    navigate(`/invoices/${invoiceId}`);
  };

  const handleEdit = (invoiceId) => {
    handleActionMenuClose();
    navigate(`/invoices/${invoiceId}/edit`);
  };

  const handleDelete = (invoiceId, invoiceNumber) => {
    handleActionMenuClose();
    handleDeleteClick(invoiceId, invoiceNumber);
  };

  const handleRecordPayment = (invoiceId) => {
    handleActionMenuClose();
    navigate(`/payments/new?invoiceId=${invoiceId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
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
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoices/new')}
        >
          Create Invoice
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
              placeholder="Search by invoice #, patient name..."
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
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
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
                  <IconButton onClick={() => fetchInvoices(search)} disabled={loading} color="primary">
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
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No invoices found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice._id || invoice.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {invoice.patient?.firstName && invoice.patient?.lastName
                            ? `${invoice.patient.firstName} ${invoice.patient.lastName}`
                            : invoice.patientId?.firstName && invoice.patientId?.lastName
                            ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell align="right">{formatPrice(invoice.totalAmount)}</TableCell>
                        <TableCell align="right">{formatPrice(invoice.balanceDue)}</TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                            color={STATUS_COLORS[invoice.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                invoice._id || invoice.id,
                                invoice.invoiceNumber,
                                invoice.status
                              )
                            }
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
              count={totalInvoices}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.invoiceId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {actionMenu.status !== 'paid' && actionMenu.status !== 'cancelled' && (
          <MenuItem onClick={() => handleEdit(actionMenu.invoiceId)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {actionMenu.status !== 'paid' && actionMenu.status !== 'cancelled' && (
          <MenuItem onClick={() => handleRecordPayment(actionMenu.invoiceId)}>
            <ListItemIcon>
              <PaymentIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Record Payment</ListItemText>
          </MenuItem>
        )}
        {actionMenu.status === 'draft' && (
          <MenuItem
            onClick={() => handleDelete(actionMenu.invoiceId, actionMenu.invoiceNumber)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice "${deleteDialog.invoiceNumber}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default InvoicesListPage;
