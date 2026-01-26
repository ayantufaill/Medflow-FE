import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
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
  Avatar,
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
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  FilterAltOff,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const PatientsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dobStartDate, setDobStartDate] = useState(null);
  const [dobEndDate, setDobEndDate] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    patientId: null,
    patientName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    patientId: null,
    patientName: '',
    isActive: null,
  });

  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  // Memoize today's date to prevent creating new dayjs objects on every render
  const today = useMemo(() => dayjs(), []);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      let sanitizedSearch = debouncedSearch;
      if (sanitizedSearch) {
        sanitizedSearch = sanitizedSearch.replace(/^\+/, '').trim();
      }

      const dobStart = dobStartDate
        ? dayjs(dobStartDate).format('YYYY-MM-DD')
        : '';
      const dobEnd = dobEndDate ? dayjs(dobEndDate).format('YYYY-MM-DD') : '';

      const result = await patientService.getAllPatients(
        page + 1,
        rowsPerPage,
        sanitizedSearch,
        statusFilter,
        dobStart,
        dobEnd
      );
      setPatients(result.patients || []);
      setTotalPatients(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch patients. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, statusFilter, dobStartDate, dobEndDate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (patientId, patientName) => {
    setDeleteDialog({
      open: true,
      patientId,
      patientName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await patientService.deletePatient(deleteDialog.patientId);
      showSnackbar('Patient deleted successfully', 'success');
      setDeleteDialog({ open: false, patientId: null, patientName: '' });
      await fetchPatients();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete patient. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete patient. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, patientId: null, patientName: '' });
  };

  const handleActionMenuOpen = (event, patientId, patientName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      patientId,
      patientName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      patientId: null,
      patientName: '',
      isActive: null,
    });
  };

  const handleViewDetails = (patientId) => {
    handleActionMenuClose();
    navigate(`/patients/${patientId}`);
  };

  const handleEdit = (patientId) => {
    handleActionMenuClose();
    navigate(`/patients/${patientId}/edit`);
  };

  const handleDelete = (patientId, patientName) => {
    handleActionMenuClose();
    handleDeleteClick(patientId, patientName);
  };

  const getPatientInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'P';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDobStartDate(null);
    setDobEndDate(null);
    setPage(0);
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
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
        >
          Add Patient
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid size={8}>
              <TextField
                fullWidth
                placeholder="Search by name, email, phone, or patient code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearch('')}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">
                  Filter by Status
                </InputLabel>
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
            <Grid size={5}>
              <DatePicker
                label="DOB Start Date"
                value={dobStartDate}
                onChange={(newValue) => {
                  setDobStartDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                maxDate={dobEndDate || today}
              />
            </Grid>
            <Grid size={5}>
              <DatePicker
                label="DOB End Date"
                value={dobEndDate}
                onChange={(newValue) => {
                  setDobEndDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                minDate={dobStartDate}
                maxDate={today}
              />
            </Grid>
            <Grid size={2}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Tooltip title="Refresh">
                  <span>
                  <IconButton
                    onClick={fetchPatients}
                    disabled={loading}
                    color="primary"
                    sx={{ flexShrink: 0 }}
                  >
                    <RefreshIcon />
                  </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Reset Filters">
                  <span>
                  <IconButton
                    onClick={handleResetFilters}
                    disabled={loading || (!dobStartDate && !dobEndDate && !statusFilter)}
                    color="primary"
                    sx={{ flexShrink: 0 }}
                  >
                    <FilterAltOff />
                  </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative' }}>
              {statusLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No patients found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((patient) => (
                        <TableRow 
                          key={patient._id || patient.id} 
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/patients/${patient._id || patient.id}`)}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'primary.main',
                                  fontSize: '1rem',
                                }}
                              >
                                {getPatientInitials(
                                  patient.firstName,
                                  patient.lastName
                                )}
                              </Avatar>
                              <Typography variant="body2">
                                {patient.firstName} {patient.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{patient.patientCode || '-'}</TableCell>
                          <TableCell>
                            {formatDate(patient.dateOfBirth)}
                          </TableCell>
                          <TableCell>{patient.phonePrimary || '-'}</TableCell>
                          <TableCell>{patient.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={patient.isActive ? 'Active' : 'Inactive'}
                              color={patient.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleActionMenuOpen(
                                  e,
                                  patient._id || patient.id,
                                  `${patient.firstName} ${patient.lastName}`,
                                  patient.isActive
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
            </Box>
            <TablePagination
              component="div"
              count={totalPatients}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.patientId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.patientId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {/* <MenuItem
          key="delete"
          onClick={() =>
            handleDelete(actionMenu.patientId, actionMenu.patientName)
          }
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem> */}
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message={`Are you sure you want to delete patient "${deleteDialog.patientName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default PatientsListPage;
