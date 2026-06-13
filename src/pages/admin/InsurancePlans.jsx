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
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import { insurancePlanService } from '../../services/insurance.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import AuditInsurancePlanHistory from '../../components/insurance/AuditInsurancePlanHistory';
import PlanFeeGuideDialog from '../../components/insurance/PlanFeeGuideDialog';
import { 
  fetchPlansList, 
  deletePlanThunk, 
  addPlanOptimistic, 
  selectPlansList, 
  selectPlansListLoading,
  fetchCarriersList,
  selectCarriersList
} from '../../store/slices/insuranceSlice';


const InsurancePlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const plans = useSelector(selectPlansList);
  const loading = useSelector(selectPlansListLoading);
  const carriersList = useSelector(selectCarriersList);

  const [searchCarrier, setSearchCarrier] = useState('');
  const [searchGeneral, setSearchGeneral] = useState('');
  const [debouncedSearchCarrier] = useDebounce(searchCarrier, 500);
  const [debouncedSearchGeneral] = useDebounce(searchGeneral, 500);
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add'
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  const [isFeeGuideDialogOpen, setIsFeeGuideDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    planId: null,
    groupName: '',
  });

  const [newPlan, setNewPlan] = useState({
    groupNumber: '',
    groupName: '',
    employer: '',
    templateName: '',
    payerName: '',
    payerId: '',
    phone: '',
    notes: '',
    isHealthPlan: false,
    isCopayPlan: false,
    assignment: 'Assignment',
    individualMax: '0.00',
    individualMaxUnlimited: true,
    familyMax: '0.00',
    familyMaxUnlimited: true,
  });

  const lastFetchRef = React.useRef(null);

  const fetchPlans = useCallback(async () => {
    const searchTerm = debouncedSearchCarrier || debouncedSearchGeneral;
    const params = { page: 1, limit: 100, search: searchTerm };
    const paramsStr = JSON.stringify(params);
    if (lastFetchRef.current === paramsStr) return;
    lastFetchRef.current = paramsStr;

    setTimeout(() => {
      if (lastFetchRef.current === paramsStr) lastFetchRef.current = null;
    }, 100);

    dispatch(fetchPlansList(params));
  }, [dispatch, debouncedSearchGeneral, debouncedSearchCarrier]);

  useEffect(() => {
    fetchPlans();
    // Also fetch carriers if they aren't loaded yet
    if (carriersList.length === 0) {
      dispatch(fetchCarriersList({ page: 1, limit: 100, search: '' }));
    }
  }, [fetchPlans, dispatch, carriersList.length]);

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, planId: id, groupName: name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePlanThunk(deleteDialog.planId)).unwrap();
      showSnackbar('Insurance plan deleted successfully', 'success');
      setDeleteDialog({ open: false, planId: null, groupName: '' });
    } catch (err) {
      showSnackbar('Failed to delete plan', 'error');
    }
  };

  const handleSavePlan = async () => {
    try {
      if (!newPlan.groupName || !newPlan.groupNumber || !newPlan.payerId) {
        showSnackbar('Group Name, Group #, and Payer ID (Insurance Company ID) are required', 'error');
        return;
      }
      
      const createdPlan = {
        ...newPlan,
        id: Date.now().toString(),
        groupNumber: newPlan.groupNumber,
        groupName: newPlan.groupName,
        employer: newPlan.employer,
        templateName: newPlan.templateName || 'Standard',
        phone: newPlan.phone,
        carrier: newPlan.payerName || 'Manual Entry',
        electronicId: newPlan.payerId || 'N/A',
        feeGuide: 'none',
        subscribers: 0
      };

      try {
        const response = await insurancePlanService.createInsurancePlan({
          name: newPlan.groupName || newPlan.employer,
          insuranceCompanyId: Number(newPlan.payerId),
          groupNumber: newPlan.groupNumber,
          groupName: newPlan.groupName,
          employer: newPlan.employer,
          phone: newPlan.phone,
          payerName: newPlan.payerName,
          payerId: newPlan.payerId,
          notes: newPlan.notes
        });
        if (response) {
          createdPlan.id = response._id || response.id;
        }
        dispatch(addPlanOptimistic(createdPlan));
        showSnackbar('Insurance plan added successfully', 'success');
        setViewMode('list');
        setNewPlan({
          groupNumber: '', groupName: '', employer: '', templateName: '', payerName: '', payerId: '', phone: '',
          notes: '', isHealthPlan: false, isCopayPlan: false, assignment: 'Assignment',
          individualMax: '0.00', individualMaxUnlimited: true, familyMax: '0.00', familyMaxUnlimited: true,
        });
      } catch (apiErr) {
        console.error(apiErr);
        showSnackbar('Failed to add insurance plan. Please try again.', 'error');
      }
    } catch (err) {
      showSnackbar('Failed to add insurance plan', 'error');
    }
  };

  if (viewMode === 'add') {
    return (
      <Box sx={{ p: 2 }}>
        {/* Breadcrumbs for Add View */}
        <Breadcrumbs sx={{ mb: 3, fontSize: '0.85rem', color: 'text.secondary' }}>
          <Link underline="hover" color="inherit" onClick={() => setViewMode('list')} sx={{ cursor: 'pointer' }}>
            Insurance Management
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>Insurance Plan</Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid item xs={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Select Payer (Carrier)*:</Typography>
              <Autocomplete
                size="small"
                options={carriersList || []}
                getOptionLabel={(option) => option.name || ''}
                value={carriersList.find(c => (c._id || c.id) === newPlan.payerId) || null}
                onChange={(event, newValue) => {
                  setNewPlan({
                    ...newPlan,
                    payerName: newValue ? newValue.name : '',
                    payerId: newValue ? (newValue._id || newValue.id) : ''
                  });
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Search for an insurance company" 
                    sx={{ '& .MuiOutlinedInput-root': { height: 35, py: 0 } }}
                  />
                )}
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography sx={{ fontSize: '0.75rem' }}>Exclude System Carriers</Typography>}
              />
            </Box>
            {/* Removed standalone Payer ID textfield since it's handled by the Autocomplete */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Group Name*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={newPlan.groupName}
                onChange={(e) => setNewPlan({...newPlan, groupName: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { height: 35 } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Group Number*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={newPlan.groupNumber}
                onChange={(e) => setNewPlan({...newPlan, groupNumber: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { height: 35 } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600}>Notes</Typography>
              <TextField 
                fullWidth multiline rows={4} placeholder="Add notes"
                value={newPlan.notes}
                onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
              />
            </Box>
          </Grid>

          {/* Middle Column */}
          <Grid item xs={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Plan or employer's name*:</Typography>
              <TextField 
                fullWidth variant="standard" 
                value={newPlan.employer}
                onChange={(e) => setNewPlan({...newPlan, employer: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Plan or employer's phone:</Typography>
              <TextField 
                fullWidth variant="standard" 
                value={newPlan.phone}
                onChange={(e) => setNewPlan({...newPlan, phone: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Plan Fee Guide:</Typography>
              <FormControl fullWidth size="small" variant="standard">
                <Select value="None">
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600}>Providers Plan Fee Guides:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', cursor: 'pointer', mt: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>+ Add</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Health Plan</Typography>} />
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>CoPay/Fixed Benefits Plan</Typography>} />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <FormControlLabel 
                control={<Checkbox checked={newPlan.assignment === 'Assignment'} size="small" />} 
                label={<Typography sx={{ fontSize: '0.75rem' }}>Assignment</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox checked={newPlan.assignment === 'Non-Assignment'} size="small" />} 
                label={<Typography sx={{ fontSize: '0.75rem' }}>Non-Assignment</Typography>} 
              />
            </Box>
          </Grid>

          {/* Right Column - Coverage */}
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ color: '#1a73e8', fontWeight: 600, mb: 1 }}>Coverage</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" fontWeight={600}>Individual annual max amount:</Typography>
                <Typography sx={{ fontSize: '0.85rem' }}>${newPlan.individualMax}</Typography>
                <FormControlLabel control={<Checkbox size="small" checked={newPlan.individualMaxUnlimited} />} label={<Typography sx={{ fontSize: '0.75rem' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" fontWeight={600}>Family annual max amount:</Typography>
                <Typography sx={{ fontSize: '0.85rem' }}>${newPlan.familyMax}</Typography>
                <FormControlLabel control={<Checkbox size="small" checked={newPlan.familyMaxUnlimited} />} label={<Typography sx={{ fontSize: '0.75rem' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" fontWeight={600}>Ortho lifetime limit:</Typography>
                <Button size="small" variant="contained" sx={{ textTransform: 'none', bgcolor: '#6b8fb9', fontSize: '0.7rem' }}>Add Limit</Button>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography>} />
            </Box>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Save as template</Typography>} />
            </Box>
          </Grid>
        </Grid>

        {/* Form Footer Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, gap: 2 }}>
          <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#6b8fb9', minWidth: 120 }}>Edit Coverage</Button>
          <Button variant="contained" onClick={handleSavePlan} sx={{ textTransform: 'none', bgcolor: '#6b8fb9', minWidth: 120 }}>Save New Plan</Button>
          <Button variant="contained" onClick={() => setViewMode('list')} sx={{ textTransform: 'none', bgcolor: '#a0aec0', minWidth: 100 }}>Cancel</Button>
        </Box>
      </Box>
    );
  }

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
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Insurance Plan</Typography>
      </Breadcrumbs>

      {/* Control Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2, gap: 1.5 }}>
        <TextField
          size="small"
          placeholder="search by carrier name"
          value={searchCarrier}
          onChange={(e) => setSearchCarrier(e.target.value)}
          sx={{ 
            width: 220,
            '& .MuiOutlinedInput-root': {
              height: 32,
              fontSize: '0.8rem',
              backgroundColor: '#fff'
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          placeholder="search by grp name & #, emp name and template name"
          value={searchGeneral}
          onChange={(e) => setSearchGeneral(e.target.value)}
          sx={{ 
            width: 320,
            '& .MuiOutlinedInput-root': {
              height: 32,
              fontSize: '0.8rem',
              backgroundColor: '#fff'
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box 
          onClick={() => setIsSyncDialogOpen(true)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { color: '#1a3a6b' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.8rem' }}>Sync</Typography>
        </Box>

        <Link
          component="button"
          onClick={() => setViewMode('add')}
          sx={{ 
            fontSize: '0.85rem', 
            color: '#1a3a6b', 
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Add Plan +
        </Link>
      </Box>

      {/* Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1a3a6b' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Group #</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Group Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Employer</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Template Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Phone</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Carrier</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>E-ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Plan Fee Guides</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}>Subscribers</TableCell>
              <TableCell align="center" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No insurance plans found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.groupNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1a3a6b' }}>{plan.groupName}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.employer || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.templateName || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.phone || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.carrier}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{plan.electronicId}</TableCell>
                  <TableCell>
                    <Link 
                      href="#" 
                      underline="hover" 
                      onClick={(e) => { e.preventDefault(); setActivePlan(plan); setIsFeeGuideDialogOpen(true); }}
                      sx={{ 
                        fontSize: '0.8rem', 
                        color: plan.feeGuide === 'none' ? 'text.secondary' : '#1976d2' 
                      }}
                    >
                      {plan.feeGuide}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }} align="center">{plan.subscribers}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                      <Box 
                        onClick={() => setIsSyncDialogOpen(true)}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'text.secondary' }}
                      >
                        <SyncIcon sx={{ fontSize: '1rem' }} />
                        <Typography sx={{ fontSize: '0.65rem' }}>Sync</Typography>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => { setActivePlan(plan); setIsAuditDialogOpen(true); }}
                        sx={{ color: 'text.secondary' }}
                      >
                        <RestoreIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>

                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(plan.id, plan.groupName)}
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
        onClose={() => setDeleteDialog({ open: false, planId: null, groupName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Insurance Plan"
        message={`Are you sure you want to delete plan "${deleteDialog.groupName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

      <Dialog
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ backgroundColor: '#0c345d', color: '#fff', fontSize: '1rem', py: 2 }}>
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>Source Office:</Typography>
            <TextField 
              fullWidth size="small" value="thedentalstudio" disabled 
              sx={{ 
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }} 
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>Target Offices</Typography>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setIsSyncDialogOpen(false)} sx={{ textTransform: 'none', bgcolor: '#e0e0e0', color: '#333' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setIsSyncDialogOpen(false)} sx={{ textTransform: 'none', bgcolor: '#6b8fb9' }}>
            Sync
          </Button>
        </DialogActions>
      </Dialog>

      <AuditInsurancePlanHistory 
        open={isAuditDialogOpen}
        onClose={() => setIsAuditDialogOpen(false)}
        planName={activePlan?.groupName}
      />

      <PlanFeeGuideDialog
        open={isFeeGuideDialogOpen}
        onClose={() => setIsFeeGuideDialogOpen(false)}
        planName={activePlan?.groupName}
      />
    </Box>
  );
};

export default InsurancePlans;
