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
import { serviceCatalogService } from '../../services/service-catalog.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ServicesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalServices, setTotalServices] = useState(0);
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
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || categoryFilter || statusFilter;

  const fetchServices = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue?.trim() || undefined,
        category: categoryFilter || undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      };

      const result = await serviceCatalogService.getAllServices(params);
      setServices(result.services || []);
      setTotalServices(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch services. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, categoryFilter, statusFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchServices(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchServices(search);
  }, [page, rowsPerPage, categoryFilter, statusFilter]);

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
    
    // Validate service ID format (should be a string, not empty)
    const serviceId = String(deleteDialog.serviceId).trim();
    if (!serviceId || serviceId.length === 0) {
      showSnackbar('Invalid service ID format', 'error');
      return;
    }
    
    // Debug: Log the service ID being sent
    console.log('Deleting service with ID:', serviceId);
    
    try {
      setDeleteLoading(true);
      await serviceCatalogService.deleteService(serviceId);
      showSnackbar('Service deleted successfully', 'success');
      setDeleteDialog({ open: false, serviceId: null, serviceName: '' });
      await fetchServices(search);
    } catch (err) {
      console.error('Delete service error:', err);
      console.error('Service ID used:', serviceId);
      const errorMsg = err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to delete service. Please try again.';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, serviceId: null, serviceName: '' });
  };

  const handleActionMenuOpen = (event, serviceId, serviceName, isActive) => {
    // Ensure we have a valid service ID (use _id if id is not available)
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
      setLoading(true);
      await serviceCatalogService.updateService(serviceId, { isActive: !currentStatus });
      showSnackbar(
        `Service "${serviceName}" ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        'success'
      );
      await fetchServices(search);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update service status. Please try again.';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid size={5}>
            <TextField
              fullWidth
              placeholder="Search by name, CPT code..."
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
                    onClick={() => fetchServices(search)}
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
                  {services.length === 0 ? (
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
                              // Ensure we get the correct service ID - check both id and _id
                              const serviceId = service.id || service._id;
                              console.log('Service object:', service);
                              console.log('Service ID extracted:', serviceId);
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
