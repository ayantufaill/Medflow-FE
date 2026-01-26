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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { providerService } from '../../services/provider.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ProvidersListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProviders, setTotalProviders] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    providerId: null,
    providerName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    providerId: null,
    providerName: '',
    isActive: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatSpecialty = (value) => {
    if (!value) return '-';
    if (Array.isArray(value)) {
      const cleaned = value
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .filter((v) => v.length > 0);
      return cleaned.length ? cleaned.join(', ') : '-';
    }
    if (typeof value === 'string') return value.trim() || '-';
    return '-';
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter;

  const fetchProviders = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      let isActive = undefined;
      if (statusFilter === 'active') {
        isActive = true;
      } else if (statusFilter === 'inactive') {
        isActive = false;
      }

      const result = await providerService.getAllProviders(
        page + 1,
        rowsPerPage,
        searchValue?.trim(),
        isActive
      );
      setProviders(result.providers || []);
      setTotalProviders(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch providers. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchProviders(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchProviders(search);
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

  const handleDeleteClick = (providerId, providerName) => {
    setDeleteDialog({
      open: true,
      providerId,
      providerName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await providerService.deleteProvider(deleteDialog.providerId);
      showSnackbar('Provider deleted successfully', 'success');
      setDeleteDialog({ open: false, providerId: null, providerName: '' });
      await fetchProviders();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete provider. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete provider. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, providerId: null, providerName: '' });
  };

  const handleActionMenuOpen = (event, providerId, providerName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      providerId,
      providerName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleViewDetails = (providerId) => {
    handleActionMenuClose();
    navigate(`/providers/${providerId}`);
  };

  const handleEdit = (providerId) => {
    handleActionMenuClose();
    navigate(`/providers/${providerId}/edit`);
  };

  const handleDelete = (providerId, providerName) => {
    handleActionMenuClose();
    handleDeleteClick(providerId, providerName);
  };

  const handleActivate = async (providerId, providerName) => {
    handleActionMenuClose();
    try {
      setLoading(true);
      await providerService.activateProvider(providerId);
      showSnackbar(`Provider "${providerName}" activated successfully`, 'success');
      await fetchProviders(search);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to activate provider. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to activate provider. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (providerId, providerName) => {
    handleActionMenuClose();
    try {
      setLoading(true);
      await providerService.deactivateProvider(providerId);
      showSnackbar(`Provider "${providerName}" deactivated successfully`, 'success');
      await fetchProviders(search);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to deactivate provider. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to deactivate provider. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
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
          Providers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/providers/new')}
        >
          Add Provider
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
              placeholder="Search by name, title, NPI, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  search.length > 0 && (
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <Clear />
                    </IconButton>
                  )
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
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
                  <IconButton
                    onClick={() => fetchProviders(search)}
                    disabled={loading}
                    color="primary"
                  >
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
                    <TableCell>Provider</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>NPI Number</TableCell>
                    <TableCell>Specialty</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No providers found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    providers.map((provider) => (
                      <TableRow key={provider._id || provider.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {provider.userId?.firstName}{' '}
                            {provider.userId?.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>{provider.providerCode || '-'}</TableCell>
                        <TableCell>{provider.npiNumber || '-'}</TableCell>
                        <TableCell>
                          {formatSpecialty(provider.specialty)}
                        </TableCell>
                        <TableCell>{provider.title || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={provider.isActive ? 'Active' : 'Inactive'}
                            color={provider.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                provider._id || provider.id,
                                `${provider.userId?.firstName} ${provider.userId?.lastName}`,
                                provider.isActive
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
              count={totalProviders}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.providerId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.providerId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {actionMenu.isActive ? (
          <MenuItem
            onClick={() =>
              handleDeactivate(actionMenu.providerId, actionMenu.providerName)
            }
            sx={{ color: 'warning.main' }}
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() =>
              handleActivate(actionMenu.providerId, actionMenu.providerName)
            }
            sx={{ color: 'success.main' }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() =>
            handleDelete(actionMenu.providerId, actionMenu.providerName)
          }
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Provider Permanently"
        message={`Are you sure you want to permanently delete provider "${deleteDialog.providerName}"? This action cannot be undone and all associated data will be lost.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default ProvidersListPage;
