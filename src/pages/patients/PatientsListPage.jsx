import { useState, useEffect, useMemo } from 'react';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Upload as UploadIcon,
  PersonOff as PersonOffIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  FilterAltOff,
  Info as InfoIcon,
  Event as CalendarIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { usePatients } from '../../hooks/redux/usePatient';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const PatientsListPage = ({ embedded = false, onPatientSelect }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handlePatientClick = (patientId, patientObj) => {
    if (embedded && onPatientSelect) {
      onPatientSelect(patientId, patientObj);
    } else {
      navigate(`/patients/details/${patientId}`, { state: { patient: patientObj } });
    }
  };

  // ─── Redux State ─────────────────────────────────────────
  const {
    patients,
    pagination,
    loading,
    error: reduxError,
    fetch: fetchPatientsRedux,
    refetch,
    removeFromList,
  } = usePatients();

  // ─── Local UI State ──────────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortByName, setSortByName] = useState(true);
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, count: 0 });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const effectiveStatus = statusFilter;

  // ─── Fetch via Redux (only when params change) ──────────
  useEffect(() => {
    let sanitizedSearch = debouncedSearch;
    if (sanitizedSearch) {
      sanitizedSearch = sanitizedSearch.replace(/^\+/, '').trim();
    }
    fetchPatientsRedux({
      page: page + 1,
      limit: rowsPerPage,
      search: sanitizedSearch,
      status: effectiveStatus,
      dobStart: '',
      dobEnd: '',
    });
  }, [page, rowsPerPage, debouncedSearch, effectiveStatus, fetchPatientsRedux]);

  // Sync Redux error to local error for display
  useEffect(() => {
    if (reduxError) setError(reduxError);
  }, [reduxError]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (patientId, patientName) => {
    setDeleteDialog({ open: true, patientId, patientName });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await patientService.deletePatient(deleteDialog.patientId);
      showSnackbar('Patient deleted successfully', 'success');
      removeFromList(deleteDialog.patientId); // Remove from Redux list instantly
      setDeleteDialog({ open: false, patientId: null, patientName: '' });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete patient.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, patientId: null, patientName: '' });
  };

  const handleActionMenuOpen = (event, patientId, patientName, isActive) => {
    setActionMenu({ anchorEl: event.currentTarget, patientId, patientName, isActive });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, patientId: null, patientName: '', isActive: null });
  };

  const handleViewDetails = (patientId) => {
    handleActionMenuClose();
    if (embedded && onPatientSelect) {
      const patientObj = displayPatients.find((p) => (p._id || p.id) === patientId);
      onPatientSelect(patientId, patientObj);
    } else {
      navigate(`/patients/details/${patientId}`);
    }
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
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return 'P';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try { return new Date(dateString).toLocaleDateString(); }
    catch { return '-'; }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(patients.map((p) => p._id || p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (patientId) => {
    setSelectedIds((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const handleDeactivateSelected = () => {
    setDeactivateDialog({ open: true, count: selectedIds.length });
  };

  const handleDeactivateConfirm = async () => {
    try {
      setDeactivateLoading(true);
      for (const id of selectedIds) {
        await patientService.updatePatient(id, { isActive: false });
      }
      showSnackbar(`Deactivated ${selectedIds.length} patient(s)`, 'success');
      setSelectedIds([]);
      setDeactivateDialog({ open: false, count: 0 });
      refetch();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate.';
      showSnackbar(msg, 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleImportPatient = () => {
    navigate('/patients/import');
  };

  const computeAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    try {
      const today = new Date();
      const dob = new Date(dateOfBirth);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age;
    } catch {
      return '-';
    }
  };

  const displayPatients = useMemo(() => {
    const list = [...patients];
    if (sortByName) {
      list.sort((a, b) => {
        const na = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        const nb = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
        return na.localeCompare(nb);
      });
    }
    return list;
  }, [patients, sortByName]);

  const totalPatients = pagination?.total || 0;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Row 1: Search + Action buttons (reference layout) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search Patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: '1 1 280px', maxWidth: 480 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')} edge="end" aria-label="clear">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Search help">
              <IconButton size="small" color="info"><InfoIcon /></IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 'auto' }}>
              <Button
                startIcon={<CalendarIcon />}
                onClick={() => navigate('/appointments/operatory-schedule')}
              >
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/patients/new')}
              >
                Add Patient
              </Button>
               <Button
                variant="contained"
                color="warning"
                startIcon={<UploadIcon />}
                onClick={handleImportPatient}
              >
                Import Patient
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<PersonOffIcon />}
                disabled={selectedIds.length === 0}
                onClick={handleDeactivateSelected}
              >
                Deactivate Patient(s)
              </Button>
            </Box>
          </Box>

          {/* Row 2: Filter checkboxes */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sortByName}
                  onChange={(e) => setSortByName(e.target.checked)}
                  size="small"
                />
              }
              label="Sort By Name"
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 1 }}>
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={handleRefresh} disabled={loading}><RefreshIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Reset Filters">
                <IconButton size="small" onClick={handleResetFilters}><FilterAltOff /></IconButton>
              </Tooltip>
            </Box>
          </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <>
            <Box sx={{ position: 'relative' }}>
              {statusLoading && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, borderRadius: 1 }}>
                  <CircularProgress />
                </Box>
              )}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& .MuiTableCell-head': { py: 0.75, fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' } }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          indeterminate={selectedIds.length > 0 && selectedIds.length < displayPatients.length}
                          checked={displayPatients.length > 0 && selectedIds.length === displayPatients.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Patient Number</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Telephone Number</TableCell>
                      <TableCell>Sex</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary" fontSize="0.8rem">No patients found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayPatients.map((patient) => {
                        const pid = patient._id || patient.id;
                        const isSelected = selectedIds.includes(pid);
                        return (
                          <TableRow
                            key={pid}
                            hover
                            selected={isSelected}
                            sx={{ cursor: 'pointer', '& .MuiTableCell-body': { py: 0.5, fontSize: '0.78rem' } }}
                            onClick={() => handlePatientClick(pid, patient)}
                          >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={() => handleSelectOne(pid)}
                              />
                            </TableCell>
                            <TableCell>{patient.patientCode || '-'}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.7rem' }}>
                                  {getPatientInitials(patient.firstName, patient.lastName)}
                                </Avatar>
                                <Typography fontSize="0.78rem">{patient.firstName} {patient.lastName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{computeAge(patient.dateOfBirth)}</TableCell>
                            <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                            <TableCell>{patient.email || '-'}</TableCell>
                            <TableCell>{patient.phonePrimary || '-'}</TableCell>
                            <TableCell>{patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : patient.gender || '-'}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={patient.isActive !== false ? 'Active' : 'Inactive'}
                                color={patient.isActive !== false ? 'success' : 'default'}
                                sx={{ height: 18, fontSize: '0.68rem' }}
                              />
                            </TableCell>
                            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                              <IconButton
                                size="small"
                                sx={{ p: 0.25 }}
                                onClick={(e) => handleActionMenuOpen(e, pid, `${patient.firstName} ${patient.lastName}`, patient.isActive)}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.patientId)}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.patientId)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
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

      <ConfirmationDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, count: 0 })}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Patient(s)"
        message={`Deactivate ${deactivateDialog.count} selected patient(s)? They will be marked inactive.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmColor="error"
        loading={deactivateLoading}
      />
    </Box>
  );
};

export default PatientsListPage;
