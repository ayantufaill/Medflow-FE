import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  IconButton,
  Button,
  CircularProgress,
  InputAdornment,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  FormHelperText,
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import { insuranceCompanyService } from '../../services/insurance.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { 
  fetchCarriersList, 
  deleteCarrierThunk, 
  addCarrierOptimistic, 
  selectCarriersList, 
  selectCarriersLoading 
} from '../../store/slices/insuranceSlice';


const InsuranceCarriers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const companies = useSelector(selectCarriersList);
  const loading = useSelector(selectCarriersLoading);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    companyId: null,
    companyName: '',
  });

  const [newCarrier, setNewCarrier] = useState({
    name: '',
    payerId: '',
    phone: '',
    email: '',
    fax: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    notes: '',
    claimType: '',
    providersOutOfNetwork: [],
  });
  
  const [errors, setErrors] = useState({});

  const lastFetchRef = React.useRef(null);

  const fetchCompanies = useCallback(async () => {
    const params = { page: 1, limit: 100, search: debouncedSearch };
    const paramsStr = JSON.stringify(params);
    if (lastFetchRef.current === paramsStr) return;
    lastFetchRef.current = paramsStr;

    setTimeout(() => {
      if (lastFetchRef.current === paramsStr) lastFetchRef.current = null;
    }, 100);

    dispatch(fetchCarriersList(params));
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, companyId: id, companyName: name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCarrierThunk(deleteDialog.companyId)).unwrap();
      showSnackbar('Insurance carrier deleted successfully', 'success');
      setDeleteDialog({ open: false, companyId: null, companyName: '' });
    } catch (err) {
      showSnackbar('Failed to delete carrier', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields
    if (!newCarrier.name?.trim()) {
      newErrors.name = 'Carrier Name is required';
      isValid = false;
    }
    if (!newCarrier.payerId?.trim()) {
      newErrors.payerId = 'Electronic Id is required';
      isValid = false;
    }

    // Phone & Fax validation (US Format)
    const validateUsPhone = (phoneStr) => {
      if (!phoneStr) return true;
      const cleanPhone = phoneStr.replace(/\D/g, '');
      if (cleanPhone.length === 0) return true;
      
      // Typical US formatting is 10 digits without country code, or 11 with country code (1)
      if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) return true;
      if (cleanPhone.length === 10) return true;
      return false;
    };

    if (newCarrier.phone && newCarrier.phone.replace(/\D/g, '').length > 0) {
      if (!validateUsPhone(newCarrier.phone)) {
        newErrors.phone = 'Phone number is incomplete or invalid';
        isValid = false;
      }
    }

    if (newCarrier.fax && newCarrier.fax.replace(/\D/g, '').length > 0) {
      if (!validateUsPhone(newCarrier.fax)) {
        newErrors.fax = 'Fax number is incomplete or invalid';
        isValid = false;
      }
    }

    if (newCarrier.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newCarrier.email.trim())) {
        newErrors.email = 'Invalid email format';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveCarrier = async () => {
    try {
      if (!validateForm()) {
        showSnackbar('Please fix the errors in the form', 'error');
        return;
      }

      // Sanitize the payload: omit empty optional fields so they satisfy backend validators
      const sanitizedCarrier = Object.entries(newCarrier).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed !== '') {
            acc[key] = trimmed;
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            acc[key] = value;
          }
        } else if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Await API response. If it fails, execution halts here and moves to the catch block.
      const response = await insuranceCompanyService.createInsuranceCompany(sanitizedCarrier);

      // Map successfully created carrier to state
      const createdCarrier = {
        ...newCarrier,
        id: response?._id || response?.id || Date.now().toString(),
        plansCount: 0
      };

      dispatch(addCarrierOptimistic(createdCarrier));
      showSnackbar('Insurance carrier added successfully', 'success');
      setIsAddDialogOpen(false);

      // Reset form state
      setNewCarrier({
        name: '', payerId: '', phone: '', email: '', fax: '', website: '',
        addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'United States',
        notes: '', claimType: '', providersOutOfNetwork: [],
      });
      setErrors({});
    } catch (err) {
      // Handle and display actual backend error details
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to add insurance carrier';
      showSnackbar(errorMessage, 'error');
      console.error('Failed to save carrier:', err);
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2, fontSize: '0.85rem', color: 'text.secondary' }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin/insurance-management');
          }}
          sx={{ cursor: 'pointer' }}
        >
          Insurance Management
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Insurance Carrier</Typography>
      </Breadcrumbs>

      {/* Control Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
        <Box
          onClick={() => setIsSyncDialogOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: '#1a3a6b',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Sync</Typography>
        </Box>

        <TextField
          size="small"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              height: 32,
              fontSize: '0.85rem',
              backgroundColor: '#fff'
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Link
          component="button"
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            fontSize: '0.85rem',
            color: '#1a3a6b',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Add Carrier +
        </Link>
      </Box>

      {/* Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1a3a6b' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 600, borderBottom: 'none' }}>Carrier</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, borderBottom: 'none' }}>Phone</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, borderBottom: 'none' }}>Address</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, borderBottom: 'none' }}>Electronic ID</TableCell>
              <TableCell align="center" sx={{ color: '#fff', fontWeight: 600, borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No insurance carriers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company._id || company.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 500 }}>{company.name}</TableCell>
                  <TableCell>{company.phone || '-'}</TableCell>
                  <TableCell>
                    {company.addressLine1 || company.city || company.state ? (
                      <Typography sx={{ fontSize: '0.85rem' }}>
                        {[company.addressLine1, company.city, company.state ? `${company.state} ${company.zipCode || ''}`.trim() : company.zipCode].filter(Boolean).join(', ')}
                      </Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{company.payerId || '-'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Box
                        onClick={() => setIsSyncDialogOpen(true)}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'text.secondary' }}
                      >
                        <SyncIcon sx={{ fontSize: '1rem' }} />
                        <Typography sx={{ fontSize: '0.65rem' }}>Sync</Typography>
                      </Box>

                      <Link
                        component="button"
                        sx={{ fontSize: '0.85rem', color: '#1976d2', textDecoration: 'none' }}
                      >
                        {company.plansCount || 1} Plan(s)
                      </Link>

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(company._id || company.id, company.name)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, companyId: null, companyName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Insurance Carrier"
        message={`Are you sure you want to delete "${deleteDialog.companyName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

      {/* Add New Carrier Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ backgroundColor: '#4b71a1', color: '#fff', fontSize: '1rem', py: 1, textAlign: 'center', fontWeight: 500 }}>
          Add New Carrier
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Carrier's Name *</Typography>
              <TextField
                fullWidth size="small" placeholder="Enter Name"
                value={newCarrier.name}
                onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Carrier's Electronic Id *</Typography>
              <TextField
                fullWidth size="small"
                value={newCarrier.payerId}
                onChange={(e) => setNewCarrier({ ...newCarrier, payerId: e.target.value })}
                error={!!errors.payerId}
                helperText={errors.payerId}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
              <FormControlLabel
                control={<Checkbox size="small" sx={{ p: 0.5 }} />}
                label={<Typography sx={{ fontSize: '0.75rem' }}>Not Applicable</Typography>}
                sx={{ mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Phone</Typography>
              <Box sx={{
                '& .react-tel-input .form-control': {
                  width: '100%',
                  height: '40px',
                  fontSize: '0.85rem',
                  borderColor: errors.phone ? '#d32f2f' : '#c4c4c4',
                  borderRadius: '4px',
                  paddingLeft: '14px',
                },
                '& .react-tel-input .flag-dropdown': {
                  display: 'none',
                }
              }}>
                <PhoneInput
                  country={'us'}
                  disableDropdown={true}
                  buttonStyle={{ display: 'none' }}
                  value={newCarrier.phone}
                  onChange={(phone) => setNewCarrier({ ...newCarrier, phone })}
                  enableSearch={true}
                  disableSearchIcon={false}
                  searchPlaceholder="Search country"
                />
                {errors.phone && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.phone}
                  </FormHelperText>
                )}
              </Box>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Email</Typography>
              <TextField
                fullWidth size="small"
                value={newCarrier.email}
                onChange={(e) => setNewCarrier({ ...newCarrier, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Fax</Typography>
              <Box sx={{
                '& .react-tel-input .form-control': {
                  width: '100%',
                  height: '40px',
                  fontSize: '0.85rem',
                  borderColor: errors.fax ? '#d32f2f' : '#c4c4c4',
                  borderRadius: '4px',
                  paddingLeft: '14px',
                },
                '& .react-tel-input .flag-dropdown': {
                  display: 'none',
                }
              }}>
                <PhoneInput
                  country={'us'}
                  disableDropdown={true}
                  buttonStyle={{ display: 'none' }}
                  value={newCarrier.fax}
                  onChange={(fax) => setNewCarrier({ ...newCarrier, fax })}
                  enableSearch={true}
                  disableSearchIcon={false}
                  searchPlaceholder="Search country"
                />
                {errors.fax && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.fax}
                  </FormHelperText>
                )}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Website</Typography>
              <TextField
                fullWidth size="small"
                value={newCarrier.website}
                onChange={(e) => setNewCarrier({ ...newCarrier, website: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            {/* Address Row Header */}
            {/* <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Address</Typography>
              </Box>
            </Grid> */}

            {/* Address Row 1 */}
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>Address Line 1:</Typography>
              <TextField
                fullWidth size="small" placeholder="Address line 1"
                value={newCarrier.addressLine1}
                onChange={(e) => setNewCarrier({ ...newCarrier, addressLine1: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>Address Line 2:</Typography>
              <TextField
                fullWidth size="small" placeholder="Address line 2"
                value={newCarrier.addressLine2}
                onChange={(e) => setNewCarrier({ ...newCarrier, addressLine2: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            {/* Address Row 2 */}
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>City:</Typography>
              <TextField
                fullWidth size="small" placeholder="City"
                value={newCarrier.city}
                onChange={(e) => setNewCarrier({ ...newCarrier, city: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>State/Province:</Typography>
              <TextField
                fullWidth size="small" placeholder="State/Province"
                value={newCarrier.state}
                onChange={(e) => setNewCarrier({ ...newCarrier, state: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>Zip/Postal Code:</Typography>
              <TextField
                fullWidth size="small" placeholder="Zip/Postal Code"
                value={newCarrier.zipCode}
                onChange={(e) => setNewCarrier({ ...newCarrier, zipCode: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            {/* Bottom Row */}
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Providers out of network</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <FormControlLabel
                  control={<Checkbox size="small" sx={{ p: 0.5 }} />}
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Christina Sabour</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" sx={{ p: 0.5 }} />}
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Test</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" sx={{ p: 0.5 }} />}
                  label={<Typography sx={{ fontSize: '0.75rem' }}>Saba’s Office</Typography>}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Claim Type</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={newCarrier.claimType || ''}
                  onChange={(e) => setNewCarrier({ ...newCarrier, claimType: e.target.value })}
                  sx={{ fontSize: '0.85rem' }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select Type</MenuItem>
                  <MenuItem value="Dental">Dental</MenuItem>
                  <MenuItem value="Medical">Medical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}></Grid>

            {/* Row 7: Notes */}
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Notes</Typography>
              <TextField
                fullWidth multiline rows={4}
                value={newCarrier.notes}
                onChange={(e) => setNewCarrier({ ...newCarrier, notes: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': { py: 1, fontSize: '0.85rem' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#eee' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleSaveCarrier}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#d1a97d',
              color: '#fff',
              fontSize: '0.85rem',
              px: 3,
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#c0986c' }
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(false)}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#a0aec0',
              color: '#fff',
              fontSize: '0.85rem',
              px: 3,
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#8a99a8' }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setIsSyncDialogOpen(false)}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setIsSyncDialogOpen(false)}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsuranceCarriers;
