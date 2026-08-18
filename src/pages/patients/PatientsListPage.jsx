import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { usePatients, useDropdownData } from '../../hooks/redux';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import PatientSearchActionsBar from '../../components/patients/list/PatientSearchActionsBar';
import PatientFiltersBar from '../../components/patients/list/PatientFiltersBar';
import PatientRow from '../../components/patients/list/PatientRow';
import PatientActionMenu from '../../components/patients/list/PatientActionMenu';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from '../../constants/styles';
import { validatePhoneNumber, validateDateOfBirth } from '../../components/patients/list/patientListUtils';

const EMPTY_PROVIDER_LIST = [];

const PatientsListPage = ({ embedded = false, onPatientSelect }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // ─── Redux State ─────────────────────────────────────────
  const {
    patients,
    pagination,
    loading,
    error: reduxError,
    fetch: fetchPatientsRedux,
    removeFromList,
    updateInList,
  } = usePatients();

  const { providers: providerList = EMPTY_PROVIDER_LIST } = useDropdownData({ providers: true });

  // ─── Local UI State ──────────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patientId: null, patientName: '' });
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, patientId: null, patientName: '', isActive: null });
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortByName, setSortByName] = useState(true);
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, count: 0 });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);
  // Debounce delays every search-as-you-type keystroke by 300ms, but that
  // same delay makes clearing the box (backspacing to empty, or the X
  // button) feel like it "didn't work" for a third of a second. Bypass the
  // debounce specifically when the box is empty so the full list comes back
  // immediately, while normal typing still debounces as before.
  const effectiveSearch = search === '' ? '' : debouncedSearch;

  // Inline editing state
  const [editingField, setEditingField] = useState(null); // { patientId, field, originalValue }
  const [editValue, setEditValue] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // handleInlineSave/handleNameSave/handleInlineCancel need the LATEST
  // editingField/editValue when the user clicks Save, but we don't want those
  // (they change on every keystroke) in the handlers' own useCallback deps —
  // that would recreate the callback every keystroke and defeat PatientRow's
  // memoization for every row, not just the one being edited. Refs give the
  // handlers a live read without becoming a dependency.
  const editingFieldRef = useRef(editingField);
  const editValueRef = useRef(editValue);
  editingFieldRef.current = editingField;
  editValueRef.current = editValue;

  // usePatients()'s own `refetch` re-fetches using REDUX's `filters`/`pagination`
  // state, which this page never writes to — it keeps its own local
  // page/statusFilter/genderFilter/providerFilter state instead and calls
  // `fetch` (fetchPatientsRedux) directly with those values. That means
  // `refetch()` silently ignores whatever the user has selected in the UI
  // (e.g. re-fetching with no status filter after toggling a patient active,
  // even while "Inactive" is selected). buildFetchParams + the ref below let
  // every mutation handler re-fetch with the params actually shown on screen,
  // via a callback whose identity stays stable across renders.
  const buildFetchParams = () => {
    let sanitizedSearch = effectiveSearch;
    if (sanitizedSearch) sanitizedSearch = sanitizedSearch.replace(/^\+/, '').trim();
    return {
      page: page + 1,
      limit: rowsPerPage,
      search: sanitizedSearch,
      status: statusFilter,
      gender: genderFilter,
      providerId: providerFilter,
      dobStart: '',
      dobEnd: '',
      sortBy: sortByName ? 'name' : '',
      sortOrder: sortByName ? 'asc' : '',
    };
  };
  const fetchParamsRef = useRef();
  fetchParamsRef.current = buildFetchParams();

  const refetchList = useCallback(() => fetchPatientsRedux(fetchParamsRef.current), [fetchPatientsRedux]);

  // ─── Fetch via Redux (only when params change) ──────────
  useEffect(() => {
    const promise = fetchPatientsRedux(fetchParamsRef.current);

    return () => {
      if (promise && promise.abort) promise.abort();
    };
  }, [page, rowsPerPage, effectiveSearch, statusFilter, genderFilter, providerFilter, sortByName, fetchPatientsRedux]);

  // Sync Redux error to local error for display
  useEffect(() => {
    if (reduxError) setError(reduxError);
  }, [reduxError]);

  const handleChangePage = useCallback((event, newPage) => setPage(newPage), []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Search is debounced, but the page index should reset the instant the user
  // types — otherwise a new search can silently request a page number that
  // doesn't exist in the filtered result set (e.g. searching while on page 4).
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(0);
  }, []);

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

  const handleActionMenuOpen = useCallback((event, patientId, patientName, isActive) => {
    setActionMenu({ anchorEl: event.currentTarget, patientId, patientName, isActive });
  }, []);

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

  const handleToggleInactive = async (patientId, patientName, isActive) => {
    handleActionMenuClose();
    try {
      setSaveLoading(true);
      await patientService.updatePatient(patientId, { isActive: !isActive });
      showSnackbar(`Patient ${!isActive ? 'marked inactive' : 'activated'} successfully`, 'success');
      updateInList({ _id: patientId, isActive: !isActive });
      refetchList();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update patient status.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Inline editing handlers
  const handleDoubleClick = useCallback((e, patient, field, currentValue) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingField({ patientId: patient._id || patient.id, field, originalValue: currentValue });
    // The name field edits firstName/lastName together, so its draft is an
    // object instead of a plain string like every other field.
    if (field === 'name') {
      setEditValue({ firstName: currentValue.firstName || '', lastName: currentValue.lastName || '' });
    } else {
      setEditValue(currentValue || '');
    }
  }, []);

  const handleInlineCancel = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  const handleInlineSave = useCallback(async () => {
    const currentEditingField = editingFieldRef.current;
    const currentEditValue = editValueRef.current;
    try {
      setSaveLoading(true);
      if (!currentEditingField) return;

      let updateData = {};
      if (currentEditingField.field === 'phonePrimary' && currentEditValue) {
        const digits = currentEditValue.replace(/\D/g, '');
        if (!validatePhoneNumber(currentEditValue)) {
          setError('Phone number must be 10 digits or 1 followed by 10 digits');
          showSnackbar('Phone number must be 10 digits or 1 followed by 10 digits', 'error');
          return;
        }
        updateData = { [currentEditingField.field]: digits }; // Store as digits only (backend requirement)
        await patientService.updatePatient(currentEditingField.patientId, updateData);
      } else if (currentEditingField.field === 'dateOfBirth' && currentEditValue) {
        if (!validateDateOfBirth(currentEditValue)) {
          setError('Invalid date of birth');
          showSnackbar('Invalid date of birth', 'error');
          return;
        }
        const isoDate = new Date(currentEditValue).toISOString();
        updateData = { [currentEditingField.field]: isoDate };
        await patientService.updatePatient(currentEditingField.patientId, updateData);
      } else {
        updateData = { [currentEditingField.field]: currentEditValue };
        await patientService.updatePatient(currentEditingField.patientId, updateData);
      }

      showSnackbar('Patient updated successfully', 'success');
      updateInList({ _id: currentEditingField.patientId, ...updateData });
      refetchList();
      setEditingField(null);
      setEditValue('');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update patient.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaveLoading(false);
    }
  }, [updateInList, refetchList, showSnackbar]);

  // Separate from handleInlineSave because the name column edits two backend
  // fields (firstName/lastName) at once instead of one.
  const handleNameSave = useCallback(async () => {
    const currentEditingField = editingFieldRef.current;
    const currentEditValue = editValueRef.current;
    try {
      setSaveLoading(true);
      if (!currentEditingField || currentEditingField.field !== 'name') return;

      const updateData = { firstName: currentEditValue.firstName || '', lastName: currentEditValue.lastName || '' };
      await patientService.updatePatient(currentEditingField.patientId, updateData);
      showSnackbar('Patient name updated successfully', 'success');
      updateInList({ _id: currentEditingField.patientId, ...updateData });
      refetchList();
      setEditingField(null);
      setEditValue({ firstName: '', lastName: '' });
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update patient name.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaveLoading(false);
    }
  }, [updateInList, refetchList, showSnackbar]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setGenderFilter('');
    setProviderFilter('');
    setPage(0);
  };

  const handleRefresh = () => refetchList();

  const handleSelectAll = useCallback((event) => {
    setSelectedIds(event.target.checked ? patients.map((p) => p._id || p.id) : []);
  }, [patients]);

  const handleSelectOne = useCallback((patientId) => {
    setSelectedIds((prev) => (prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]));
  }, []);

  const handlePatientClick = useCallback((patientId, patientObj) => {
    if (embedded && onPatientSelect) {
      onPatientSelect(patientId, patientObj);
    } else {
      navigate(`/patients/details/${patientId}`, { state: { patient: patientObj } });
    }
  }, [embedded, onPatientSelect, navigate]);

  const handleDeactivateSelected = () => {
    setDeactivateDialog({ open: true, count: selectedIds.length });
  };

  const handleDeactivateConfirm = async () => {
    try {
      setDeactivateLoading(true);
      for (const id of selectedIds) {
        await patientService.updatePatient(id, { isActive: false });
        updateInList({ _id: id, isActive: false });
      }
      showSnackbar(`Deactivated ${selectedIds.length} patient(s)`, 'success');
      setSelectedIds([]);
      setDeactivateDialog({ open: false, count: 0 });
      refetchList();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate.';
      showSnackbar(msg, 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleImportPatient = () => navigate('/patients/import');

  const displayPatients = useMemo(() => patients, [patients]);

  // Reset to page 0 and re-fetch when sort changes
  const handleSortByNameChange = useCallback((checked) => {
    setSortByName(checked);
    setPage(0);
  }, []);

  const totalPatients = pagination?.total || 0;
  const allSelected = displayPatients.length > 0 && selectedIds.length === displayPatients.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < displayPatients.length;

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_PAGE, p: embedded ? 0 : '16px' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, p: '16px' }}>
        <PatientSearchActionsBar
          search={search}
          onSearchChange={handleSearchChange}
          loading={loading}
          onAddPatient={() => navigate('/patients/new')}
          onImportPatient={handleImportPatient}
          onDeactivateSelected={handleDeactivateSelected}
          deactivateDisabled={selectedIds.length === 0}
        />

        <PatientFiltersBar
          statusFilter={statusFilter}
          onStatusFilterChange={(v) => { setStatusFilter(v); setPage(0); }}
          genderFilter={genderFilter}
          onGenderFilterChange={(v) => { setGenderFilter(v); setPage(0); }}
          providerFilter={providerFilter}
          onProviderFilterChange={(v) => { setProviderFilter(v); setPage(0); }}
          providerList={providerList}
          sortByName={sortByName}
          onSortByNameChange={handleSortByNameChange}
          loading={loading}
          onRefresh={handleRefresh}
          onResetFilters={handleResetFilters}
        />

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
                    <TableRow sx={{
                      '& .MuiTableCell-head': {
                        py: '10px',
                        fontFamily: 'Inter',
                        fontSize: fontSize.sm,
                        fontWeight: fontWeight.semibold,
                        color: COLORS.TEXT_MUTED,
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        borderBottom: `1px solid ${COLORS.BORDER}`,
                      },
                    }}>
                      <TableCell padding="checkbox">
                        <Checkbox size="small" indeterminate={someSelected} checked={allSelected} onChange={handleSelectAll} />
                      </TableCell>
                      <TableCell>Patient Number</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Telephone Number</TableCell>
                      <TableCell>Sex</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
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
                        const isEditingThisRow = editingField?.patientId === pid;
                        return (
                          <PatientRow
                            key={pid}
                            patient={patient}
                            isSelected={selectedIds.includes(pid)}
                            // Only the row actually being edited receives the live
                            // editingField/editValue — every other row gets stable
                            // `null`/`''` references so PatientRow's React.memo can
                            // skip re-rendering them on every keystroke.
                            editingField={isEditingThisRow ? editingField : null}
                            editValue={isEditingThisRow ? editValue : ''}
                            setEditValue={setEditValue}
                            saveLoading={isEditingThisRow ? saveLoading : false}
                            onSelectOne={handleSelectOne}
                            onRowClick={handlePatientClick}
                            onDoubleClick={handleDoubleClick}
                            onInlineSave={handleInlineSave}
                            onNameSave={handleNameSave}
                            onInlineCancel={handleInlineCancel}
                            onActionMenuOpen={handleActionMenuOpen}
                          />
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
              labelRowsPerPage="Rows per page:"
              SelectProps={{
                MenuProps: roundedSelectMenuProps,
              }}
              sx={{
                borderTop: `1px solid ${COLORS.BORDER}`,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED,
                  textTransform: 'uppercase', letterSpacing: '0.3px',
                },
                '& .MuiTablePagination-select': { fontFamily: 'Inter', fontSize: fontSize.sm },
              }}
            />
          </>
        )}
      </Box>

      <PatientActionMenu
        actionMenu={actionMenu}
        onClose={handleActionMenuClose}
        onViewDetails={handleViewDetails}
        onToggleInactive={handleToggleInactive}
      />

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
