import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
import { appointmentTypeKeys, useAppointmentTypes } from '../../hooks/queries/useAppointmentTypes';
import { ConfirmationDialog } from '../../components/shared';

const AppointmentTypesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, typeId: null, typeName: '' });
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, typeId: null, typeName: '', isActive: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const isActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null;

  const { data, isLoading, isError, refetch } = useAppointmentTypes({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch.trim(),
    isActive,
  });

  const appointmentTypes = data?.appointmentTypes || [];
  const total = data?.total || 0;

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: appointmentTypeKeys.lists() });

  const closeActionMenu = () =>
    setActionMenu({ anchorEl: null, typeId: null, typeName: '', isActive: null });

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await appointmentTypeService.deleteAppointmentType(deleteDialog.typeId);
      showSnackbar('Appointment type deleted successfully', 'success');
      setDeleteDialog({ open: false, typeId: null, typeName: '' });
      invalidateList();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete appointment type.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (typeId, currentStatus) => {
    try {
      setToggleLoading(true);
      const newStatus = !currentStatus;
      await appointmentTypeService.updateAppointmentType(typeId, { isActive: newStatus });
      showSnackbar(
        `Appointment type ${newStatus ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
      invalidateList();
      closeActionMenu();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to update status.',
        'error'
      );
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">Appointment Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/appointment-types/new')}>
          Add Appointment Type
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>Failed to load appointment types. Please try again.</Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid size={7}>
            <TextField
              fullWidth
              placeholder="Search by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value=""><em>All Status</em></MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Clear filters">
                <span>
                  <IconButton
                    onClick={() => { setSearch(''); setStatusFilter(''); setPage(0); }}
                    color="primary"
                    disabled={isLoading || (!search && !statusFilter)}
                  >
                    <FilterAltOff />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={refetch} disabled={isLoading} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
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
                        <Typography color="text.secondary">No appointment types found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointmentTypes.map((type) => (
                      <TableRow key={type._id || type.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300', color: 'grey.700', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              {type.name ? type.name.substring(0, 2).toUpperCase() : 'AT'}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">{type.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{type.defaultDuration || '-'}</TableCell>
                        <TableCell>{type.defaultPrice ? `$${type.defaultPrice.toFixed(2)}` : '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={type.requiresAuthorization ? 'Yes' : 'No'}
                            color={type.requiresAuthorization ? 'warning' : 'default'}
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
                            onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, typeId: type._id || type.id, typeName: type.name, isActive: type.isActive })}
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
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={closeActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { closeActionMenu(); navigate(`/appointment-types/${actionMenu.typeId}`); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { closeActionMenu(); navigate(`/appointment-types/${actionMenu.typeId}/edit`); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleToggleActive(actionMenu.typeId, actionMenu.isActive)} disabled={toggleLoading}>
          <ListItemIcon>
            {actionMenu.isActive ? <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{actionMenu.isActive ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => { closeActionMenu(); setDeleteDialog({ open: true, typeId: actionMenu.typeId, typeName: actionMenu.typeName }); }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, typeId: null, typeName: '' })}
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
