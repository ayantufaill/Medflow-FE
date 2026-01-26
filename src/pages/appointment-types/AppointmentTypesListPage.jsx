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
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterAltOff,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { appointmentTypeService } from '../../services/appointment-type.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const AppointmentTypesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTypes, setTotalTypes] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    typeId: null,
    typeName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    typeId: null,
    typeName: '',
    isActive: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchAppointmentTypes = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      let isActive = undefined;
      if (statusFilter === 'active') {
        isActive = true;
      } else if (statusFilter === 'inactive') {
        isActive = false;
      }

      const result = await appointmentTypeService.getAllAppointmentTypes(
        page + 1,
        rowsPerPage,
        searchValue?.trim(),
        isActive
      );
      setAppointmentTypes(result.appointmentTypes || []);
      setTotalTypes(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch appointment types. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchAppointmentTypes(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchAppointmentTypes(search);
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

  const handleDeleteClick = (typeId, typeName) => {
    setDeleteDialog({
      open: true,
      typeId,
      typeName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await appointmentTypeService.deleteAppointmentType(deleteDialog.typeId);
      showSnackbar('Appointment type deleted successfully', 'success');
      setDeleteDialog({ open: false, typeId: null, typeName: '' });
      await fetchAppointmentTypes();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete appointment type. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete appointment type. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, typeId: null, typeName: '' });
  };

  const handleActionMenuOpen = (event, typeId, typeName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      typeId,
      typeName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      typeId: null,
      typeName: '',
      isActive: null,
    });
  };

  const handleViewDetails = (typeId) => {
    handleActionMenuClose();
    navigate(`/appointment-types/${typeId}`);
  };

  const handleEdit = (typeId) => {
    handleActionMenuClose();
    navigate(`/appointment-types/${typeId}/edit`);
  };

  const handleDelete = (typeId, typeName) => {
    handleActionMenuClose();
    handleDeleteClick(typeId, typeName);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const handleToggleActive = async (typeId, currentStatus) => {
    try {
      setToggleLoading(true);
      const newStatus = !currentStatus;
      await appointmentTypeService.updateAppointmentType(typeId, {
        isActive: newStatus,
      });
      showSnackbar(
        `Appointment type ${newStatus ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
      handleActionMenuClose();
      await fetchAppointmentTypes();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update appointment type status. Please try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setToggleLoading(false);
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
          Appointment Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointment-types/new')}
        >
          Add Appointment Type
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
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
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
                <IconButton onClick={handleClearFilters} color="primary" disabled={loading || !statusFilter}>
                  <FilterAltOff />
                </IconButton>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchAppointmentTypes}
                  disabled={loading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Duration (min)</TableCell>
                    <TableCell>Default Price</TableCell>
                    <TableCell>Requires Authorization</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointmentTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No appointment types found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointmentTypes.map((type) => (
                      <TableRow key={type._id || type.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'grey.300',
                                color: 'grey.700',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {type.name ? type.name.substring(0, 2).toUpperCase() : 'AT'}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {type.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{type.defaultDuration || '-'}</TableCell>
                        <TableCell>
                          {type.defaultPrice
                            ? `$${type.defaultPrice.toFixed(2)}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={type.requiresAuthorization ? 'Yes' : 'No'}
                            color={
                              type.requiresAuthorization ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={type.isActive ? 'Active' : 'Inactive'}
                            color={type.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                type._id || type.id,
                                type.name,
                                type.isActive
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
              count={totalTypes}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.typeId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.typeId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleToggleActive(actionMenu.typeId, actionMenu.isActive)
          }
          disabled={toggleLoading}
        >
          <ListItemIcon>
            {actionMenu.isActive ? (
              <CancelIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {actionMenu.isActive ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(actionMenu.typeId, actionMenu.typeName)}
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
        title="Delete Appointment Type"
        message={`Are you sure you want to delete appointment type "${deleteDialog.typeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default AppointmentTypesListPage;
