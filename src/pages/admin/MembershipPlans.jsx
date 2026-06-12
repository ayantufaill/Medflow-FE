import { useState, useEffect } from 'react';
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
  InputAdornment,
  Link,
  Paper,
  CircularProgress,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PrintOutlined as PrintIcon,
  InfoOutlined as InfoIcon,
  Close as CloseIcon,
  Sync as SyncIcon,
  AssignmentTurnedIn as AuditIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControlLabel,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  selectMembershipPlansList,
  selectMembershipPlansLoading,
  deleteMembershipPlanThunk,
  fetchMembershipPlansThunk,
  createMembershipPlanThunk
} from '../../store/slices/insuranceSlice';


const MembershipPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const plans = useSelector(selectMembershipPlansList);
  const loading = useSelector(selectMembershipPlansLoading);

  useEffect(() => {
    dispatch(fetchMembershipPlansThunk());
  }, [dispatch]);

  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'grid'
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add'
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  
  const [newPlan, setNewPlan] = useState({
    name: '',
    annualFee: '',
    monthlyFee: '',
    isCoPay: false,
    autoRenewal: false,
    individualMax: '',
    isIndividualMaxUnlimited: true,
    familyMax: '',
    isFamilyMaxUnlimited: true,
    orthoLimit: '',
    notes: '',
    saveAsTemplate: false
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    planId: null,
    planName: '',
  });

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, planId: id, planName: name });
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteMembershipPlanThunk(deleteDialog.planId)).unwrap();
    showSnackbar('Membership plan deleted successfully', 'success');
    setDeleteDialog({ open: false, planId: null, planName: '' });
  };

  const handleCreatePlan = () => {
    if (!newPlan.name) {
      showSnackbar('Please enter a plan name', 'error');
      return;
    }
    const planToAdd = {
      id: Date.now().toString(),
      name: newPlan.name,
      templateName: newPlan.saveAsTemplate ? 'Template' : '',
      subscribers: 0,
      annualFee: `$${newPlan.annualFee || '0.00'}`,
      monthlyFee: `$${newPlan.monthlyFee || '0.00'}`,
    };
    dispatch(createMembershipPlanThunk(planToAdd));
    showSnackbar('Membership plan created successfully', 'success');
    setViewMode('list');
    setNewPlan({
      name: '',
      annualFee: '',
      monthlyFee: '',
      isCoPay: false,
      autoRenewal: false,
      individualMax: '',
      isIndividualMaxUnlimited: true,
      familyMax: '',
      isFamilyMaxUnlimited: true,
      orthoLimit: '',
      notes: '',
      saveAsTemplate: false
    });
  };

  if (viewMode === 'add') {
    return (
      <Box sx={{ p: 0, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Add Plan Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: '#fff', 
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a3a6b' }}>ADD NEW PLAN</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              onClick={() => setViewMode('list')}
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCreatePlan}
              sx={{ bgcolor: '#1a3a6b', textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Create New Plan
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
          {/* Plan Details Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 3, color: '#333' }}>Membership Plan Details</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>MEMBERSHIP PLAN NAME *</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Enter plan name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>MEMBERSHIP PLAN ANNUAL FEE *</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Enter annual fee"
                  value={newPlan.annualFee}
                  onChange={(e) => setNewPlan({...newPlan, annualFee: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>MEMBERSHIP PLAN MONTHLY FEE *</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Enter monthly fee"
                  value={newPlan.monthlyFee}
                  onChange={(e) => setNewPlan({...newPlan, monthlyFee: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={newPlan.isCoPay} onChange={(e) => setNewPlan({...newPlan, isCoPay: e.target.checked})} />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>CoPay/Fixed Benefits Plan <InfoIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', ml: 0.5, color: '#999' }} /></Typography>}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={newPlan.autoRenewal} onChange={(e) => setNewPlan({...newPlan, autoRenewal: e.target.checked})} />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>Auto Renewal</Typography>}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Coverage Details Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 3, color: '#333' }}>Coverage Details</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>INDIVIDUAL ANNUAL MAX AMOUNT *</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Enter amount"
                    disabled={newPlan.isIndividualMaxUnlimited}
                    value={newPlan.individualMax}
                    onChange={(e) => setNewPlan({...newPlan, individualMax: e.target.value})}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={newPlan.isIndividualMaxUnlimited} onChange={(e) => setNewPlan({...newPlan, isIndividualMaxUnlimited: e.target.checked})} />}
                    label={<Typography sx={{ fontSize: '0.85rem' }}>Unlimited</Typography>}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>FAMILY ANNUAL MAX AMOUNT *</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Enter amount"
                    disabled={newPlan.isFamilyMaxUnlimited}
                    value={newPlan.familyMax}
                    onChange={(e) => setNewPlan({...newPlan, familyMax: e.target.value})}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={newPlan.isFamilyMaxUnlimited} onChange={(e) => setNewPlan({...newPlan, isFamilyMaxUnlimited: e.target.checked})} />}
                    label={<Typography sx={{ fontSize: '0.85rem' }}>Unlimited</Typography>}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', mb: 1 }}>ORTHO LIFETIME LIMIT</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Enter amount"
                  value={newPlan.orthoLimit}
                  onChange={(e) => setNewPlan({...newPlan, orthoLimit: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Link component="button" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', textDecoration: 'none' }}>+ Add Note</Link>
          </Box>

          <FormControlLabel
            control={<Checkbox size="small" checked={newPlan.saveAsTemplate} onChange={(e) => setNewPlan({...newPlan, saveAsTemplate: e.target.checked})} />}
            label={<Typography sx={{ fontSize: '0.85rem' }}>Save as template</Typography>}
          />
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
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Membership Plan</Typography>
      </Breadcrumbs>

      {/* Top Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, gap: 2 }}>
        <Link
          component="button"
          sx={{
            fontSize: '0.85rem',
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            mr: 1
          }}
        >
          <PrintIcon sx={{ fontSize: '1.2rem' }} />
          Print Membership Plan
        </Link>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setViewMode('add')}
          sx={{
            bgcolor: '#1a3a6b',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#0c244d' }
          }}
        >
          Add New Plan
        </Button>

        <TextField
          size="small"
          placeholder="Search by membership..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 240,
            '& .MuiOutlinedInput-root': {
              height: 36,
              fontSize: '0.85rem',
              backgroundColor: '#fff'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* View Toggles Icons */}
        <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fff', overflow: 'hidden' }}>
          <IconButton
            size="small"
            onClick={() => setView('grid')}
            sx={{
              borderRadius: 0,
              borderRight: '1px solid #e0e0e0',
              p: 0.75,
              bgcolor: view === 'grid' ? '#1a76d2' : 'transparent',
              color: view === 'grid' ? '#fff' : 'inherit',
              '&:hover': { bgcolor: view === 'grid' ? '#1a76d2' : '#f5f5f5' }
            }}
          >
            <Box sx={{ width: 16, height: 16, border: `1.5px solid ${view === 'grid' ? '#fff' : '#666'}`, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px', p: '1px' }}>
              {[1, 2, 3, 4].map(i => <Box key={i} sx={{ bgcolor: view === 'grid' ? '#fff' : '#666' }} />)}
            </Box>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setView('list')}
            sx={{
              borderRadius: 0,
              p: 0.75,
              bgcolor: view === 'list' ? '#1a76d2' : 'transparent',
              color: view === 'list' ? '#fff' : 'inherit',
              '&:hover': { bgcolor: view === 'list' ? '#1a76d2' : '#f5f5f5' }
            }}
          >
            <Box sx={{ width: 16, height: 16, display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
              {[1, 2, 3].map(i => <Box key={i} sx={{ height: '2px', bgcolor: view === 'list' ? '#fff' : '#666', width: '100%' }} />)}
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Banner */}
      {/* {showBanner && (
        <Alert
          severity="info"
          icon={<InfoIcon sx={{ color: '#1a73e8' }} />}
          onClose={() => setShowBanner(false)}
          sx={{
            mb: 3,
            borderRadius: 5,
            border: '1.5px solid #1a73e8',
            bgcolor: '#fff',
            color: '#333',
            fontSize: '0.8rem',
            '& .MuiAlert-message': { width: '100%' },
            '& .MuiAlert-icon': { pt: 1 }
          }}
        >
          You haven't added custom benefits yet. To include special instructions, membership details, or other important information, hover over a card and click the 'Customize' icon button.
        </Alert>
      )} */}

      {view === 'list' ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '1.5px solid #e0e0e0' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1.5 }}>MEMBERSHIP PLAN NAME</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1.5 }}>TEMPLATE NAME</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1.5 }}>SUBSCRIBERS</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1.5 }}>ANNUAL FEE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', py: 1.5 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No membership plans found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id} sx={{ '& td': { py: 2, borderBottom: '1px solid #f5f5f5' } }}>
                    <TableCell sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 500 }}>
                      {plan.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                      {plan.templateName || '-'}
                    </TableCell>
                    <TableCell>
                      <Link
                        href="#"
                        underline="none"
                        sx={{ fontSize: '0.85rem', color: '#1976d2', fontWeight: 600 }}
                      >
                        {plan.subscribers}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {plan.annualFee}
                    </TableCell>
                    <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Box 
                        onClick={() => setIsSyncDialogOpen(true)}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#1a3a6b' }}
                      >
                        <SyncIcon sx={{ fontSize: '1rem' }} />
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>Sync</Typography>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => setIsAuditDialogOpen(true)}
                        sx={{ color: '#1a3a6b' }}
                      >
                        <AuditIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(plan.id, plan.name)}
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
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 3,
          width: '100%'
        }}>
          {plans.map((plan) => (
            <Card key={plan.id} sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: 'none',
              border: '1px solid #eef4ff',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }
            }}>
              <Box sx={{ bgcolor: '#eef4ff', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#000' }}>
                  {plan.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => setIsSyncDialogOpen(true)} sx={{ color: '#1a3a6b', p: 0.5 }}>
                    <SyncIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => setIsAuditDialogOpen(true)}
                    sx={{ color: '#1a3a6b', p: 0.5 }}
                  >
                    <AuditIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(plan.id, plan.name)} sx={{ color: '#d32f2f', p: 0.5 }}>
                    <DeleteIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{plan.monthlyFee}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>/month for a year</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mx: 0.5 }}>or</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{plan.annualFee}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>/year</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, planId: null, planName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Membership Plan"
        message={`Are you sure you want to delete "${deleteDialog.planName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#4b71a1', 
            color: '#fff',
            fontSize: '1rem', 
            fontWeight: 500,
            py: 1.5,
            px: 3,
            lineHeight: 1.3,
            textAlign: 'center'
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

      {/* Audit History Dialog */}
      <Dialog
        open={isAuditDialogOpen}
        onClose={() => setIsAuditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#4b71a1', 
            color: '#fff',
            fontSize: '1rem', 
            fontWeight: 500,
            py: 1.5,
            px: 3,
            textAlign: 'center'
          }}
        >
          Audit MembershipPlan History
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fff' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>Difference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((item, index) => (
                  <TableRow key={index} sx={{ verticalAlign: 'top' }}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 2 }}>
                      {index === 0 ? 'Jan 05 2026' : index === 1 ? 'Jan 04 2026' : 'Jan 02 2026'}<br/>
                      <Typography variant="caption" color="text.secondary">11:37:42 AM</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 2 }}>System Admin</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 2 }}>MembershipPlan</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 2 }}>
                      <Typography sx={{ 
                        fontSize: '0.75rem', 
                        color: index === 0 ? '#2e7d32' : '#ed6c02',
                        fontWeight: 600 
                      }}>
                        {index === 0 ? 'Add' : 'Update'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 0 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ '& th': { borderBottom: 'none', py: 0.5, fontSize: '0.7rem', color: '#999' } }}>
                            <TableCell align="center">Key</TableCell>
                            <TableCell align="center">Old</TableCell>
                            <TableCell align="center">New</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {index === 0 ? (
                             <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem' } }}>
                               <TableCell align="center">/planName</TableCell>
                               <TableCell align="center">-</TableCell>
                               <TableCell align="center">Bright Beginning</TableCell>
                             </TableRow>
                          ) : (
                            <>
                              <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem' } }}>
                                <TableCell align="center">/planMonthlyFee</TableCell>
                                <TableCell align="center">45</TableCell>
                                <TableCell align="center">46</TableCell>
                              </TableRow>
                              <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem' } }}>
                                <TableCell align="center">/planAnnualFee</TableCell>
                                <TableCell align="center">540</TableCell>
                                <TableCell align="center">550</TableCell>
                              </TableRow>
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsAuditDialogOpen(false)}
            variant="contained"
            sx={{ bgcolor: '#999', '&:hover': { bgcolor: '#888' }, textTransform: 'none', px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipPlans;
