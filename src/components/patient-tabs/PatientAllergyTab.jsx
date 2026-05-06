import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  MenuItem as MuiMenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterAltOff,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import ConfirmationDialog from '../shared/ConfirmationDialog';

// ─── AllergyDialog ────────────────────────────────────────────────────────────

const ALLERGY_DEFAULTS = { allergen: '', reaction: '', severity: 'mild', isActive: true, documentedDate: null };

const AllergyDialog = ({ open, onClose, patientId, allergy, mode, onSave, saving, setSaving }) => {
  const { showSnackbar } = useSnackbar();
  const today = useMemo(() => dayjs(), []);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: allergy || ALLERGY_DEFAULTS,
  });

  const previousAllergyIdRef = useRef(null);
  const previousOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      previousAllergyIdRef.current = null;
      previousOpenRef.current = false;
      return;
    }
    const currentAllergyId = allergy?._id || allergy?.id || null;
    if (!previousOpenRef.current) previousOpenRef.current = true;

    if (allergy && currentAllergyId) {
      if (previousAllergyIdRef.current === currentAllergyId) return;
      previousAllergyIdRef.current = currentAllergyId;
      reset({ ...allergy, documentedDate: allergy.documentedDate ? dayjs(allergy.documentedDate) : null });
    } else {
      if (previousAllergyIdRef.current === null) return;
      previousAllergyIdRef.current = null;
      reset({ ...ALLERGY_DEFAULTS, documentedDate: dayjs() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, allergy?._id, allergy?.id]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        patientId,
        documentedDate: data.documentedDate ? dayjs(data.documentedDate).toISOString() : dayjs().toISOString(),
      };
      if (mode === 'add') {
        await patientService.createPatientAllergy(patientId, payload);
        showSnackbar('Allergy added successfully', 'success');
        previousAllergyIdRef.current = null;
        reset({ ...ALLERGY_DEFAULTS, documentedDate: dayjs() });
      } else {
        await patientService.updatePatientAllergy(patientId, allergy._id || allergy.id, payload);
        showSnackbar('Allergy updated successfully', 'success');
      }
      await onSave();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || `Failed to ${mode === 'add' ? 'add' : 'update'} allergy`,
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add Allergy' : 'Edit Allergy'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth label="Allergen *"
                {...register('allergen', { required: 'Allergen is required' })}
                error={!!errors.allergen} helperText={errors.allergen?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Controller
                  name="severity" control={control}
                  render={({ field }) => (
                    <Select {...field} label="Severity">
                      <MenuItem value="mild">Mild</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="severe">Severe</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Controller
                name="documentedDate" control={control}
                rules={{ required: 'Documented date is required' }}
                render={({ field }) => (
                  <DatePicker
                    {...field} label="Documented Date"
                    slotProps={{ textField: { fullWidth: true, error: !!errors.documentedDate, helperText: errors.documentedDate?.message } }}
                    maxDate={today}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth label="Reaction *" multiline rows={3}
                {...register('reaction', { required: 'Reaction is required' })}
                error={!!errors.reaction} helperText={errors.reaction?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            type="submit" variant="contained" disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {saving ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// ─── PatientAllergyTab ────────────────────────────────────────────────────────

const PatientAllergyTab = ({ patientId }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [allergies, setAllergies] = useState([]);
  const [allergySearch, setAllergySearch] = useState('');
  const [allergySeverityFilter, setAllergySeverityFilter] = useState('');
  const [allergyDocumentedDateStart, setAllergyDocumentedDateStart] = useState(null);
  const [allergyDocumentedDateEnd, setAllergyDocumentedDateEnd] = useState(null);
  const [allergyDialog, setAllergyDialog] = useState({ open: false, mode: 'add', allergy: null });
  const [allergyMenu, setAllergyMenu] = useState({ anchorEl: null, allergy: null });
  const [allergySaving, setAllergySaving] = useState(false);
  const [allergyDeleteDialog, setAllergyDeleteDialog] = useState({ open: false, allergy: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllergies = async () => {
    try {
      const list = await patientService.getPatientAllergies(patientId, true);
      setAllergies(list || []);
    } catch (err) {
      console.error('Failed to load allergies', err);
    }
  };

  useEffect(() => {
    if (patientId) fetchAllergies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const filteredAllergies = allergies.filter((all) => {
    if (allergySearch.trim()) {
      const q = allergySearch.toLowerCase();
      if (!(all.allergen || '').toLowerCase().includes(q) && !(all.reaction || '').toLowerCase().includes(q)) return false;
    }
    if (allergySeverityFilter && (all.severity || '') !== allergySeverityFilter) return false;
    if (allergyDocumentedDateStart && all.documentedDate && dayjs(all.documentedDate).isBefore(dayjs(allergyDocumentedDateStart), 'day')) return false;
    if (allergyDocumentedDateEnd && all.documentedDate && dayjs(all.documentedDate).isAfter(dayjs(allergyDocumentedDateEnd), 'day')) return false;
    return true;
  });

  const hasAllergyFilters = allergySearch || allergySeverityFilter || allergyDocumentedDateStart || allergyDocumentedDateEnd;

  const handleMenuOpen = (event, allergy) => setAllergyMenu({ anchorEl: event.currentTarget, allergy });
  const handleMenuClose = () => setAllergyMenu((prev) => ({ ...prev, anchorEl: null }));
  const handleMenuExited = () => setAllergyMenu({ anchorEl: null, allergy: null });

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await patientService.deletePatientAllergy(patientId, allergyDeleteDialog.allergy._id || allergyDeleteDialog.allergy.id);
      showSnackbar('Allergy deleted successfully', 'success');
      setAllergyDeleteDialog({ open: false, allergy: null });
      await fetchAllergies();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete allergy',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>Allergies</Typography>
          <Button
            variant="contained" size="small" startIcon={<AddIcon />}
            onClick={() => setAllergyDialog({ open: true, mode: 'add', allergy: null })}
          >
            Add Allergy
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
          <Grid size={9}>
            <TextField
              fullWidth size="small" placeholder="Search allergies..."
              value={allergySearch} onChange={(e) => setAllergySearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                endAdornment: allergySearch && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setAllergySearch('')} edge="end"><ClearIcon /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Severity</InputLabel>
              <Select value={allergySeverityFilter} label="Severity" onChange={(e) => setAllergySeverityFilter(e.target.value)}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="mild">Mild</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="severe">Severe</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={4}>
            <DatePicker
              label="Documented From" value={allergyDocumentedDateStart}
              onChange={setAllergyDocumentedDateStart}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              maxDate={allergyDocumentedDateEnd || undefined}
            />
          </Grid>
          <Grid size={4}>
            <DatePicker
              label="Documented To" value={allergyDocumentedDateEnd}
              onChange={setAllergyDocumentedDateEnd}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              minDate={allergyDocumentedDateStart || undefined}
            />
          </Grid>
          <Grid size={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Tooltip title="Clear Filters">
                <span>
                  <IconButton onClick={() => { setAllergySearch(''); setAllergySeverityFilter(''); setAllergyDocumentedDateStart(null); setAllergyDocumentedDateEnd(null); }} disabled={!hasAllergyFilters} color="primary">
                    <FilterAltOff />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refresh">
                <span>
                  <IconButton onClick={fetchAllergies} color="primary"><RefreshIcon /></IconButton>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {filteredAllergies.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No active allergies documented.</Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Allergen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reaction</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Documented By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Documented Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAllergies.map((all) => (
                  <TableRow key={all._id || all.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{all.allergen}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>{all.reaction || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={(all.severity?.charAt(0).toUpperCase() + all.severity?.slice(1)) || 'Unknown'}
                        size="small"
                        color={all.severity === 'severe' ? 'error' : all.severity === 'moderate' ? 'warning' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      {all.documentedBy
                        ? `${all.documentedBy.firstName || ''} ${all.documentedBy.lastName || ''}`.trim() || '-'
                        : '-'}
                    </TableCell>
                    <TableCell>{all.documentedDate ? dayjs(all.documentedDate).format('MM/DD/YYYY') : '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, all)}><MoreVertIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <AllergyDialog
        open={allergyDialog.open}
        onClose={() => setAllergyDialog({ open: false, mode: 'add', allergy: null })}
        patientId={patientId}
        allergy={allergyDialog.allergy}
        mode={allergyDialog.mode}
        onSave={async () => { await fetchAllergies(); setAllergyDialog({ open: false, mode: 'add', allergy: null }); }}
        saving={allergySaving}
        setSaving={setAllergySaving}
      />

      <Menu
        anchorEl={allergyMenu.anchorEl}
        open={Boolean(allergyMenu.anchorEl)}
        onClose={handleMenuClose}
        TransitionProps={{ onExited: handleMenuExited }}
      >
        <MuiMenuItem onClick={() => { handleMenuClose(); navigate(`/patients/${patientId}/allergies/${allergyMenu.allergy?._id || allergyMenu.allergy?.id}`); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem onClick={() => { setAllergyDialog({ open: true, mode: 'edit', allergy: allergyMenu.allergy }); setAllergyMenu({ anchorEl: null, allergy: null }); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => { setAllergyDeleteDialog({ open: true, allergy: allergyMenu.allergy }); setAllergyMenu({ anchorEl: null, allergy: null }); }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MuiMenuItem>
      </Menu>

      <ConfirmationDialog
        open={allergyDeleteDialog.open}
        onClose={() => setAllergyDeleteDialog({ open: false, allergy: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Allergy"
        message="Are you sure you want to delete this allergy record?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </LocalizationProvider>
  );
};

export default PatientAllergyTab;
