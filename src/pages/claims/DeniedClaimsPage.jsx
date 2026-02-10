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
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { claimService } from '../../services/claim.service';

const DeniedClaimsPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalClaims, setTotalClaims] = useState(0);
  const [search, setSearch] = useState('');
  const [denialReasonFilter, setDenialReasonFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    claimId: null,
  });

  const handleResetFilters = () => {
    setSearch('');
    setDenialReasonFilter('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || denialReasonFilter || startDate || endDate;

  const fetchDeniedClaims = useCallback(
    async (searchValue) => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchValue?.trim() || undefined,
          status: 'denied',
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
        };

        const result = await claimService.getDeniedClaims(params);
        setClaims(result.claims || []);
        setTotalClaims(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch denied claims. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchDeniedClaims(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchDeniedClaims(search);
  }, [page, rowsPerPage, startDate, endDate]);

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

  const handleResubmit = (claimId) => {
    handleActionMenuClose();
    navigate(`/claims/${claimId}/resubmit`);
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

  // Get unique denial reasons for filter
  const denialReasons = [...new Set(claims.map((claim) => claim.denialReason).filter(Boolean))];

  // Filter claims by denial reason
  const filteredClaims = denialReasonFilter
    ? claims.filter((claim) => claim.denialReason === denialReasonFilter)
    : claims;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <IconButton onClick={() => navigate('/claims')}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              Denied Claims
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage denied insurance claims
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Summary Card */}
        <Card sx={{ mb: 3, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.light' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="error" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {totalClaims} Denied Claim{totalClaims !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total denied claims requiring attention
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

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
            <Grid item size={{ xs: 12, sm: 6, md: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Denial Reason</InputLabel>
                <Select
                  value={denialReasonFilter}
                  label="Denial Reason"
                  onChange={(e) => {
                    setDenialReasonFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">
                    <em>All Reasons</em>
                  </MenuItem>
                  {denialReasons.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
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
            <Grid item size={{ xs: 12, sm: 6, md: 1.5 }}>
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
                    <IconButton onClick={() => fetchDeniedClaims(search)} disabled={loading} color="primary">
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
                      <TableCell>Denied Date</TableCell>
                      <TableCell>Denial Reason</TableCell>
                      <TableCell align="right">Claim Amount</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No denied claims found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClaims.map((claim) => (
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
                          <TableCell>{formatDate(claim.deniedDate || claim.updatedAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={claim.denialReason || 'Not specified'}
                              color="error"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">{formatPrice(claim.submittedAmount ?? claim.claimAmount ?? claim.totalAmount)}</TableCell>
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
                count={denialReasonFilter ? filteredClaims.length : totalClaims}
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
          <MenuItem onClick={() => handleResubmit(actionMenu.claimId)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resubmit Claim</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default DeniedClaimsPage;
