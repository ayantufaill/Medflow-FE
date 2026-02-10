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
  Add as AddIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { authorizationService } from '../../services/authorization.service';

const STATUS_COLORS = {
  requested: 'info',
  pending: 'warning',
  approved: 'success',
  denied: 'error',
  expired: 'error',
  cancelled: 'default',
};

const STATUS_ICONS = {
  requested: PendingIcon,
  pending: PendingIcon,
  approved: CheckCircleIcon,
  denied: CancelIcon,
  expired: WarningIcon,
  cancelled: CancelIcon,
};

const AuthorizationsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [authorizations, setAuthorizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAuthorizations, setTotalAuthorizations] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    authorizationId: null,
  });
  const [printing, setPrinting] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter || startDate || endDate;

  const fetchAuthorizations = useCallback(
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

        const result = await authorizationService.getAllAuthorizations(params);
        setAuthorizations(result.authorizations || []);
        setTotalAuthorizations(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch authorizations. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, statusFilter, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchAuthorizations(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchAuthorizations(search);
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

  const handleActionMenuOpen = (event, authorizationId) => {
    setActionMenu({ anchorEl: event.currentTarget, authorizationId });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, authorizationId: null });
  };

  const handleViewDetails = (authorizationId) => {
    handleActionMenuClose();
    navigate(`/authorizations/${authorizationId}`);
  };

  const handlePrint = async (authorizationId) => {
    handleActionMenuClose();
    try {
      setPrinting(true);
      const blob = await authorizationService.printAuthorizationForm(authorizationId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `authorization-${authorizationId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSnackbar('Authorization form downloaded successfully', 'success');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to print authorization form',
        'error'
      );
    } finally {
      setPrinting(false);
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  const getStatusChip = (status) => {
    const StatusIcon = STATUS_ICONS[status] || PendingIcon;
    const color = STATUS_COLORS[status] || 'default';

    return (
      <Chip
        icon={<StatusIcon fontSize="small" />}
        label={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        color={color}
        size="small"
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
            Insurance Authorizations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/authorizations/new')}
          >
            Request Authorization
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search by patient name, auth #..."
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
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="denied">Denied</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
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
                    <IconButton onClick={() => fetchAuthorizations(search)} disabled={loading} color="primary">
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
                      <TableCell>Auth #</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Insurance</TableCell>
                      <TableCell>Service/Procedure</TableCell>
                      <TableCell>Requested Date</TableCell>
                      <TableCell>Expiration Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {authorizations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No authorizations found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      authorizations.map((auth) => (
                        <TableRow key={auth._id || auth.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {auth.authorizationNumber || auth.authNumber || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {auth.patient?.firstName && auth.patient?.lastName
                              ? `${auth.patient.firstName} ${auth.patient.lastName}`
                              : auth.patientId?.firstName && auth.patientId?.lastName
                              ? `${auth.patientId.firstName} ${auth.patientId.lastName}`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {auth.insuranceCompany?.name || auth.insuranceCompanyId?.name || '-'}
                          </TableCell>
                          <TableCell>
                            {(auth.service?.name || auth.serviceId?.name)
                              ? `${auth.service?.name || auth.serviceId?.name}${(auth.service?.cptCode || auth.serviceId?.cptCode) ? ` (${auth.service?.cptCode || auth.serviceId?.cptCode})` : ''}`
                              : '-'}
                          </TableCell>
                          <TableCell>{formatDate(auth.requestedDate || auth.createdAt)}</TableCell>
                          <TableCell>
                            {auth.expirationDate ? (
                              dayjs(auth.expirationDate).isBefore(dayjs()) ? (
                                <Typography variant="body2" color="error">
                                  {formatDate(auth.expirationDate)} (Expired)
                                </Typography>
                              ) : (
                                formatDate(auth.expirationDate)
                              )
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{getStatusChip(auth.status)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, auth._id || auth.id)}
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
                count={totalAuthorizations}
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
          <MenuItem onClick={() => handleViewDetails(actionMenu.authorizationId)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handlePrint(actionMenu.authorizationId)} disabled={printing}>
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print Form</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default AuthorizationsListPage;
