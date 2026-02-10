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
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear,
  FilterAltOff,
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  cancelled: 'default',
};

const SecondaryClaimsPage = () => {
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

  const fetchSecondaryClaims = useCallback(
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
          insuranceType: 'secondary', // Filter for secondary insurance only
        };

        const result = await claimService.getAllClaims(params);
        setClaims(result.claims || []);
        setTotalClaims(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch secondary claims. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, statusFilter, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchSecondaryClaims(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchSecondaryClaims(search);
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

  const getStatusChip = (status) => {
    const color = STATUS_COLORS[status] || 'default';
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    return (
      <Chip
        label={label}
        color={color}
        size="small"
        variant={status === 'draft' ? 'outlined' : 'filled'}
      />
    );
  };

  // Calculate COB (Coordination of Benefits) summary
  const cobSummary = {
    totalClaims: totalClaims,
    totalAmount: claims.reduce((sum, claim) => sum + (claim.claimAmount || claim.totalAmount || 0), 0),
    totalPaid: claims.reduce((sum, claim) => sum + (claim.paidAmount || 0), 0),
    pendingAmount: claims
      .filter((c) => c.status === 'pending' || c.status === 'submitted')
      .reduce((sum, claim) => sum + (claim.claimAmount || claim.totalAmount || 0), 0),
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
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Secondary Insurance Claims
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage secondary insurance billing and coordination of benefits (COB)
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/claims')}
            startIcon={<AccountBalanceIcon />}
          >
            View All Claims
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* COB Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Secondary Claims
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {cobSummary.totalClaims}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Claim Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatPrice(cobSummary.totalAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Paid
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatPrice(cobSummary.totalPaid)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pending Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {formatPrice(cobSummary.pendingAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={2}>
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
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
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
            <Grid item xs={12} sm={6} md={2.5}>
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
            <Grid item xs={12} sm={6} md={2}>
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
                    <IconButton onClick={() => fetchSecondaryClaims(search)} disabled={loading} color="primary">
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
                      <TableCell>Primary Insurance</TableCell>
                      <TableCell>Secondary Insurance</TableCell>
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
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No secondary claims found</Typography>
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
                            {claim.primaryInsurance?.name || claim.primaryInsuranceId?.name || '-'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={claim.insuranceCompany?.name || claim.insuranceCompanyId?.name || 'Secondary'}
                              size="small"
                              color="secondary"
                            />
                          </TableCell>
                          <TableCell>{formatDate(claim.submittedDate || claim.createdAt)}</TableCell>
                          <TableCell align="right">{formatPrice(claim.claimAmount || claim.totalAmount)}</TableCell>
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

export default SecondaryClaimsPage;
