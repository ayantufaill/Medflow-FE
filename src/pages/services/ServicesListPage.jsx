import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Skeleton,
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
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import {
  fetchServices,
  deleteService,
  toggleServiceStatus,
  selectServices,
  selectTotalServices,
  selectServicesLoading,
  selectServicesError
} from '../../store/slices/serviceSlice';

const ServicesListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const services = useSelector(selectServices);
  const totalServices = useSelector(selectTotalServices);
  const loading = useSelector(selectServicesLoading);
  const reduxError = useSelector(selectServicesError);
  
  const [localError, setLocalError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    serviceId: null,
    serviceName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    serviceId: null,
    serviceName: '',
    isActive: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || categoryFilter || statusFilter;

  const loadData = useCallback(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search: search?.trim() || undefined,
      category: categoryFilter || undefined,
      isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    };
    dispatch(fetchServices(params));
  }, [dispatch, page, rowsPerPage, search, categoryFilter, statusFilter]);

  const debouncedSetSearch = useDebouncedCallback((value) => {
    setSearch(value);
    setPage(0);
  }, 500);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (serviceId, serviceName) => {
    setDeleteDialog({
      open: true,
      serviceId,
      serviceName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.serviceId) {
      showSnackbar('No service selected', 'error');
      return;
    }
    const serviceId = String(deleteDialog.serviceId).trim();
    if (!serviceId || serviceId.length === 0) {
      showSnackbar('Invalid service ID format', 'error');
      return;
    }
    
    try {
      setDeleteLoading(true);
      await dispatch(deleteService(serviceId)).unwrap();
      showSnackbar('Service deleted successfully', 'success');
      setDeleteDialog({ open: false, serviceId: null, serviceName: '' });
      loadData();
    } catch (err) {
      const errorMsg = err || 'Failed to delete service. Please try again.';
      setLocalError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, serviceId: null, serviceName: '' });
  };

  const handleActionMenuOpen = (event, serviceId, serviceName, isActive) => {
    const validServiceId = serviceId || event.currentTarget.closest('tr')?.dataset?.serviceId;
    if (!validServiceId) {
      showSnackbar('Service ID is missing', 'error');
      return;
    }
    setActionMenu({
      anchorEl: event.currentTarget,
      serviceId: validServiceId,
      serviceName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleViewDetails = () => {
    const serviceId = actionMenu.serviceId;
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
    if (serviceId) {
      navigate(`/services/${serviceId}`);
    }
  };

  const handleEdit = () => {
    const serviceId = actionMenu.serviceId;
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
    if (serviceId) {
      navigate(`/services/${serviceId}/edit`);
    }
  };

  const handleDelete = () => {
    const { serviceId, serviceName } = actionMenu;
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
    if (serviceId) {
      handleDeleteClick(serviceId, serviceName);
    }
  };

  const handleToggleStatus = async () => {
    const { serviceId, serviceName, isActive: currentStatus } = actionMenu;
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
    if (!serviceId) return;
    try {
      await dispatch(toggleServiceStatus(serviceId)).unwrap();
      showSnackbar(
        `Service "${serviceName}" ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        'success'
      );
      // Data is optimally updated in slice, but can reload
    } catch (err) {
      const errorMsg = err || 'Failed to update service status. Please try again.';
      setLocalError(errorMsg);
      showSnackbar(errorMsg, 'error');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const error = localError || reduxError;

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
          Service Catalog
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/new')}
        >
          Add Service
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLocalError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid size={5}>
            <TextField
              fullWidth
              placeholder="Search by name, CPT code..."
              value={searchInput}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchInput.length > 0 && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                <MenuItem value="Office Visit">Office Visit</MenuItem>
                <MenuItem value="Lab">Lab</MenuItem>
                <MenuItem value="Imaging">Imaging</MenuItem>
                <MenuItem value="Procedure">Procedure</MenuItem>
                <MenuItem value="Surgery">Surgery</MenuItem>
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Therapy">Therapy</MenuItem>
                <MenuItem value="Preventive Care">Preventive Care</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}>
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
                    onClick={() => loadData()}
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPT Code</TableCell>
                <TableCell>Service Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton variant="text" width={50} sx={{ ml: 'auto' }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={40} sx={{ mx: 'auto' }} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={30} height={30} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No services found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => {
                  const serviceId = service.id || service._id;
                  return (
                  <TableRow 
                    key={serviceId} 
                    data-service-id={serviceId}
                    hover 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => serviceId && navigate(`/services/${serviceId}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {service.cptCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      <Chip label={service.category || '-'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{formatPrice(service.price)}</TableCell>
                    <TableCell align="center">
                      {service.duration ? `${service.duration} min` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.isActive ? 'Active' : 'Inactive'}
                        color={service.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          const serviceId = service.id || service._id;
                          if (!serviceId) {
                            showSnackbar('Service ID is missing', 'error');
                            return;
                          }
                          handleActionMenuOpen(
                            e,
                            serviceId,
                            service.name,
                            service.isActive
                          );
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalServices}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
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
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {actionMenu.isActive ? (
          <MenuItem onClick={handleToggleStatus} sx={{ color: 'warning.main' }}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleToggleStatus} sx={{ color: 'success.main' }}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
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
        title="Delete Service"
        message={`Are you sure you want to delete service "${deleteDialog.serviceName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default ServicesListPage;
