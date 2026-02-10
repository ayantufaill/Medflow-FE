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
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { eraService } from '../../services/era.service';

const STATUS_COLORS = {
  imported: 'info',
  processing: 'warning',
  processed: 'success',
  error: 'error',
  partial: 'secondary',
};

const ERAListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [eras, setERAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalERAs, setTotalERAs] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    eraId: null,
  });
  const [posting, setPosting] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter || startDate || endDate;

  const fetchERAs = useCallback(
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

        const result = await eraService.getAllERAs(params);
        setERAs(result.eras || result.eraRecords || []);
        setTotalERAs(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch ERA records. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, statusFilter, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchERAs(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchERAs(search);
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

  const handleActionMenuOpen = (event, eraId) => {
    setActionMenu({ anchorEl: event.currentTarget, eraId });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, eraId: null });
  };

  const handleViewDetails = (eraId) => {
    handleActionMenuClose();
    navigate(`/era/${eraId}`);
  };

  const handleAutoPost = async (eraId) => {
    handleActionMenuClose();
    try {
      setPosting(true);
      const result = await eraService.autoPostPayments(eraId);
      showSnackbar(
        `Successfully posted ${result.postedCount || 0} payment(s)`,
        'success'
      );
      fetchERAs(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to auto-post payments',
        'error'
      );
    } finally {
      setPosting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  const getStatusChip = (status) => {
    const color = STATUS_COLORS[status] || 'default';
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    
    let icon = null;
    if (status === 'processed') icon = <CheckCircleIcon fontSize="small" />;
    else if (status === 'processing') icon = <PendingIcon fontSize="small" />;
    else if (status === 'error') icon = <WarningIcon fontSize="small" />;

    return (
      <Chip
        icon={icon}
        label={label}
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
            ERA/EOB Records
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/era/unmatched')}
              startIcon={<WarningIcon />}
            >
              Unmatched Items
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate('/era/import')}
            >
              Import ERA File
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search by file name, claim #..."
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
                  <MenuItem value="imported">Imported</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="processed">Processed</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
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
                    <IconButton onClick={() => fetchERAs(search)} disabled={loading} color="primary">
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
                      <TableCell>File Name</TableCell>
                      <TableCell>Import Date</TableCell>
                      <TableCell>Total Records</TableCell>
                      <TableCell>Matched</TableCell>
                      <TableCell>Unmatched</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eras.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No ERA records found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      eras.map((era) => (
                        <TableRow key={era._id || era.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {era.fileName || era.filename || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(era.importDate || era.createdAt)}</TableCell>
                          <TableCell>{era.totalRecords || 0}</TableCell>
                          <TableCell>
                            <Chip
                              label={era.matchedCount || 0}
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {era.unmatchedCount > 0 ? (
                              <Chip
                                label={era.unmatchedCount}
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Chip label="0" size="small" />
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(era.totalAmount || 0)}</TableCell>
                          <TableCell>{getStatusChip(era.status)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, era._id || era.id)}
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
                count={totalERAs}
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
          <MenuItem onClick={() => handleViewDetails(actionMenu.eraId)}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleAutoPost(actionMenu.eraId)}
            disabled={posting}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Auto-Post Payments</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default ERAListPage;
