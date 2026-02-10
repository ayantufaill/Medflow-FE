import { useState, useEffect, useCallback, useRef } from 'react';
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
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear,
  FilterAltOff,
  Receipt as ReceiptIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { estimateService } from '../../services/estimate.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import dayjs from 'dayjs';

const STATUS_COLORS = {
  draft: 'default',
  sent: 'info',
  approved: 'success',
  expired: 'warning',
  converted: 'secondary',
};

const EstimatesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEstimates, setTotalEstimates] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    estimateId: null,
    estimateNumber: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    estimateId: null,
    estimateNumber: '',
    status: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sendingEstimateId, setSendingEstimateId] = useState(null);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter;

  const fetchEstimates = useCallback(async (searchValue, options = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) {
        setLoading(true);
        setError('');
      }
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue?.trim() || undefined,
        status: statusFilter || undefined,
      };
      const result = await estimateService.getAllEstimates(params);
      setEstimates(result.estimates || []);
      setTotalEstimates(result.pagination?.total || 0);
    } catch (err) {
      if (!silent) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch estimates.'
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchEstimates(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchEstimates(search);
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  // Auto-refresh so patient approve/decline from email shows without manual refresh
  const pollIntervalRef = useRef(null);
  useEffect(() => {
    const POLL_INTERVAL_MS = 45000; // 45 seconds
    const refreshIfVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchEstimates(search, { silent: true });
      }
    };
    pollIntervalRef.current = setInterval(refreshIfVisible, POLL_INTERVAL_MS);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [search, page, rowsPerPage, statusFilter, fetchEstimates]);

  // Refetch when user comes back to this tab
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEstimates(search, { silent: true });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [search, page, rowsPerPage, statusFilter, fetchEstimates]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (estimateId, estimateNumber) => {
    setDeleteDialog({ open: true, estimateId, estimateNumber });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await estimateService.deleteEstimate(deleteDialog.estimateId);
      showSnackbar('Estimate deleted successfully', 'success');
      setDeleteDialog({ open: false, estimateId: null, estimateNumber: '' });
      await fetchEstimates(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete estimate',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, estimateId: null, estimateNumber: '' });
  };

  const handleActionMenuOpen = (event, estimateId, estimateNumber, status) => {
    setActionMenu({ anchorEl: event.currentTarget, estimateId, estimateNumber, status });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleViewDetails = (estimateId) => {
    handleActionMenuClose();
    navigate(`/estimates/${estimateId}`);
  };

  const handleEdit = (estimateId) => {
    handleActionMenuClose();
    navigate(`/estimates/${estimateId}/edit`);
  };

  const handleDelete = (estimateId, estimateNumber) => {
    handleActionMenuClose();
    handleDeleteClick(estimateId, estimateNumber);
  };

  const handleSendToPatient = async (estimateId) => {
    if (!estimateId) {
      showSnackbar('Could not identify estimate', 'error');
      return;
    }
    setSendingEstimateId(estimateId);
    try {
      await estimateService.sendToPatient(estimateId);
      showSnackbar('Estimate sent to patient successfully', 'success');
      handleActionMenuClose();
      await fetchEstimates(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to send estimate to patient',
        'error'
      );
    } finally {
      setSendingEstimateId(null);
      handleActionMenuClose();
    }
  };

  const handleConvertToInvoice = (estimateId) => {
    handleActionMenuClose();
    navigate(`/estimates/${estimateId}?openConvert=1`);
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
          Cost Estimates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/estimates/new')}
        >
          Create Estimate
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
              placeholder="Search by estimate #, patient name..."
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
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
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
                  <IconButton onClick={() => fetchEstimates(search)} disabled={loading} color="primary">
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
                    <TableCell>Estimate #</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Valid Until</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Insurance</TableCell>
                    <TableCell align="right">Patient Portion</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estimates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No estimates found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    estimates.map((estimate) => (
                      <TableRow key={estimate._id || estimate.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {estimate.estimateNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const patientId =
                              estimate.patient?._id ||
                              estimate.patient?.id ||
                              (typeof estimate.patientId === 'object' ? estimate.patientId?._id : estimate.patientId);
                            const name = [
                              estimate.patient?.firstName || estimate.patientId?.firstName,
                              estimate.patient?.lastName || estimate.patientId?.lastName,
                            ]
                              .filter(Boolean)
                              .join(' ');
                            if (patientId && name) {
                              return (
                                <Link
                                  component="button"
                                  variant="body2"
                                  onClick={() => navigate(`/patients/${patientId}`)}
                                  sx={{
                                    fontWeight: 500,
                                    textAlign: 'left',
                                    '&:hover': { textDecoration: 'underline' },
                                  }}
                                >
                                  {name}
                                </Link>
                              );
                            }
                            return name || '—';
                          })()}
                        </TableCell>
                        <TableCell>{formatDate(estimate.estimateDate || estimate.createdDate)}</TableCell>
                        <TableCell>{formatDate(estimate.validUntil || estimate.expirationDate)}</TableCell>
                        <TableCell align="right">{formatPrice(estimate.totalAmount ?? estimate.estimatedAmount)}</TableCell>
                        <TableCell align="right">{formatPrice(estimate.insurancePortion)}</TableCell>
                        <TableCell align="right">{formatPrice((estimate.totalAmount ?? estimate.estimatedAmount ?? 0) - (estimate.insurancePortion || 0))}</TableCell>
                        <TableCell>
                          <Chip
                            label={estimate.status?.charAt(0).toUpperCase() + estimate.status?.slice(1)}
                            color={STATUS_COLORS[estimate.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                estimate._id || estimate.id,
                                estimate.estimateNumber,
                                estimate.status
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
              count={totalEstimates}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.estimateId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {actionMenu.status === 'draft' && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              const id = actionMenu.estimateId;
              handleSendToPatient(id);
            }}
            disabled={!!sendingEstimateId}
          >
            <ListItemIcon>
              {sendingEstimateId === actionMenu.estimateId ? (
                <CircularProgress size={20} color="primary" />
              ) : (
                <SendIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText>
              {sendingEstimateId === actionMenu.estimateId ? 'Sending…' : 'Send to Patient'}
            </ListItemText>
          </MenuItem>
        )}
        {(actionMenu.status === 'draft' || actionMenu.status === 'expired') && (
          <MenuItem onClick={() => handleEdit(actionMenu.estimateId)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {actionMenu.status === 'approved' && (
          <MenuItem onClick={() => handleConvertToInvoice(actionMenu.estimateId)}>
            <ListItemIcon>
              <ReceiptIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Convert to Invoice</ListItemText>
          </MenuItem>
        )}
        {(actionMenu.status === 'draft' || actionMenu.status === 'expired') && (
          <MenuItem
            onClick={() => handleDelete(actionMenu.estimateId, actionMenu.estimateNumber)}
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
        title="Delete Estimate"
        message={`Are you sure you want to delete estimate "${deleteDialog.estimateNumber}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default EstimatesListPage;
