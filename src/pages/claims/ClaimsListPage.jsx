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
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear,
  FilterAltOff,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { claimService } from '../../services/claim.service';

// Claim status colors mapping
const STATUS_COLORS = {
  draft: 'default',
  submitted: 'info',
  pending: 'warning',
  paid: 'success',
  partial: 'secondary',
  partially_paid: 'secondary',
  accepted: 'info',
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
  partially_paid: CheckCircleIcon,
  accepted: PendingIcon,
  denied: CancelIcon,
  rejected: CancelIcon,
  cancelled: CancelIcon,
};

const ClaimsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalClaims, setTotalClaims] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    claimId: null,
  });

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter || startDate || endDate;

  const fetchClaims = useCallback(
    async (searchValue) => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchValue?.trim() || undefined,
          status: statusFilter || undefined,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
        };

        const result = await claimService.getAllClaims(params);
        setClaims(result.claims || []);
        setTotalClaims(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch claims. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, statusFilter, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchClaims(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchClaims(search);
  }, [page, rowsPerPage, statusFilter, startDate, endDate]);

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

  const handleActionMenuOpen = (event, claimId) => {
    setActionMenu({ anchorEl: event.currentTarget, claimId });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, claimId: null });
  };

  const handleViewDetails = (claimId) => {
    handleActionMenuClose();
    navigate(`/claims/${claimId}`);
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

  const formatDateTime = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY HH:mm') : '-';
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusChip = (status) => {
    const StatusIcon = STATUS_ICONS[status] || AssignmentIcon;
    const color = STATUS_COLORS[status] || 'default';

    return (
      <Chip
        icon={<StatusIcon fontSize="small" />}
        label={getStatusLabel(status)}
        color={color}
        size="small"
        variant={status === 'draft' ? 'outlined' : 'filled'}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            Insurance Claims
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/claims/denied')}
              startIcon={<CancelIcon />}
            >
              View Denied Claims
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by claim #, patient name..."
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
            <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
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
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="denied">Denied</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 2.5 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 2.5 }}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(0);
                }}
                minDate={startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
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
                    <IconButton onClick={() => fetchClaims(search)} disabled={loading} color="primary">
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
                      <TableCell>Claim #</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Insurance</TableCell>
                      <TableCell>Submitted Date</TableCell>
                      <TableCell align="right">Claim Amount</TableCell>
                      <TableCell align="right">Paid Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {claims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No claims found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      claims.map((claim) => (
                        <TableRow key={claim._id || claim.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {claim.claimNumber || claim.claimCode || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {claim.patient?.firstName && claim.patient?.lastName
                              ? `${claim.patient.firstName} ${claim.patient.lastName}`
                              : claim.patientId?.firstName && claim.patientId?.lastName
                              ? `${claim.patientId.firstName} ${claim.patientId.lastName}`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {claim.insuranceCompany?.name || claim.insuranceCompanyId?.name || '-'}
                          </TableCell>
                          <TableCell>{formatDate(claim.submissionDate || claim.submittedDate || claim.createdAt)}</TableCell>
                          <TableCell align="right">{formatPrice(claim.submittedAmount ?? claim.claimAmount ?? claim.totalAmount)}</TableCell>
                          <TableCell align="right">{formatPrice(claim.paidAmount || 0)}</TableCell>
                          <TableCell>{getStatusChip(claim.status)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, claim._id || claim.id)}
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
                count={totalClaims}
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
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleViewDetails(actionMenu.claimId)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default ClaimsListPage;
