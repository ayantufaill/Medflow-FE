import { useState, useEffect, useRef, useCallback } from 'react';
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
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterAltOff as FilterAltOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { recurringAppointmentService } from '../../services/recurring-appointment.service';
import dayjs from 'dayjs';

const RecurringAppointmentsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [recurringAppointments, setRecurringAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    entryId: null,
  });


  const fetchRecurringAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const isActive = isActiveFilter === '' ? null : isActiveFilter === 'true';
      const result =
        await recurringAppointmentService.getAllRecurringAppointments(
          page + 1,
          rowsPerPage,
          '',
          '',
          isActive,
          searchQuery || '',
          startDateFilter ? dayjs(startDateFilter).format('YYYY-MM-DD') : '',
          endDateFilter ? dayjs(endDateFilter).format('YYYY-MM-DD') : ''
        );
      setRecurringAppointments(result.recurringAppointments || []);
      setTotalEntries(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch recurring appointments. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, isActiveFilter, searchQuery, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchRecurringAppointments();
  }, [fetchRecurringAppointments]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, entryId) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      entryId,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      entryId: null,
    });
  };

  const handleViewDetails = (entryId) => {
    handleActionMenuClose();
    navigate(`/recurring-appointments/${entryId}`);
  };

  const handleEdit = (entryId) => {
    handleActionMenuClose();
    navigate(`/recurring-appointments/${entryId}/edit`);
  };

  const handleDeleteClick = (entryId) => {
    handleActionMenuClose();
    setDeleteEntryId(entryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEntryId) return;
    try {
      await recurringAppointmentService.deleteRecurringAppointment(deleteEntryId);
      showSnackbar('Recurring appointment deleted successfully', 'success');
      fetchRecurringAppointments();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete recurring appointment',
        'error'
      );
    } finally {
      setDeleteDialogOpen(false);
      setDeleteEntryId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteEntryId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setIsActiveFilter('');
    setStartDateFilter(null);
    setEndDateFilter(null);
    setPage(0);
  };

  const hasActiveFilters = searchQuery || isActiveFilter || startDateFilter || endDateFilter;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return dayjs(dateString).format('MMM DD, YYYY');
    } catch {
      return '-';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getFrequencyLabel = (frequency, frequencyValue) => {
    if (!frequency) return '-';
    const value = frequencyValue || 1;
    const labels = {
      daily: value === 1 ? 'Daily' : `Every ${value} days`,
      weekly: value === 1 ? 'Weekly' : `Every ${value} weeks`,
      monthly: value === 1 ? 'Monthly' : `Every ${value} months`,
    };
    return labels[frequency] || frequency;
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
          Recurring Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/recurring-appointments/new')}
        >
          Create Recurring Appointment
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
          <Grid size={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchQuery && (
                  <IconButton size="small" onClick={() => { setSearchQuery(''); setPage(0); }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={isActiveFilter}
                label="Status"
                onChange={(e) => {
                  setIsActiveFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2.5}>
            <DatePicker
              label="Start Date From"
              value={startDateFilter}
              onChange={(newValue) => {
                setStartDateFilter(newValue);
                setPage(0);
              }}
              slotProps={{
                textField: { size: 'small', fullWidth: true },
              }}
            />
          </Grid>
          <Grid size={2.5}>
            <DatePicker
              label="Start Date To"
              value={endDateFilter}
              onChange={(newValue) => {
                setEndDateFilter(newValue);
                setPage(0);
              }}
              minDate={startDateFilter || undefined}
              slotProps={{
                textField: { size: 'small', fullWidth: true },
              }}
            />
          </Grid>
          <Grid size={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchRecurringAppointments}
                  disabled={loading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset filters">
                <IconButton
                  onClick={handleResetFilters}
                  disabled={loading || !hasActiveFilters}
                  color="primary"
                >
                  <FilterAltOffIcon />
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
                    <TableCell>Patient</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Preferred Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recurringAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No recurring appointments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recurringAppointments.map((entry) => (
                      <TableRow key={entry._id || entry.id} hover>
                        <TableCell>
                          {entry.patientId?.firstName}{' '}
                          {entry.patientId?.lastName}
                        </TableCell>
                        <TableCell>
                          {entry.providerId?.userId?.firstName}{' '}
                          {entry.providerId?.userId?.lastName}
                        </TableCell>
                        <TableCell>
                          {getFrequencyLabel(
                            entry.frequency,
                            entry.frequencyValue
                          )}
                        </TableCell>
                        <TableCell>{formatDate(entry.startDate)}</TableCell>
                        <TableCell>
                          {formatDate(entry.endDate) || '-'}
                        </TableCell>
                        <TableCell>{formatTime(entry.preferredTime)}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.isActive ? 'Active' : 'Inactive'}
                            color={entry.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(e, entry._id || entry.id)
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
              count={totalEntries}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </LocalizationProvider>
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.entryId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.entryId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(actionMenu.entryId)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this recurring appointment series?
            This will also delete the actual appointments in this series.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color='inherit' onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecurringAppointmentsListPage;
