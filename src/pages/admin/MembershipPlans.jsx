import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectMembershipPlansList,
  selectMembershipPlansLoading,
  deleteMembershipPlanThunk,
  fetchMembershipPlansThunk,
  createMembershipPlanThunk
} from '../../store/slices/insuranceSlice';

import MembershipPlansActionBar from '../../components/admin/insurance-management/membership-plans/MembershipPlansActionBar';
import MembershipPlansTable from '../../components/admin/insurance-management/membership-plans/MembershipPlansTable';
import MembershipPlanFormDialog from '../../components/admin/insurance-management/membership-plans/MembershipPlanFormDialog';
import MembershipAuditDialog from '../../components/admin/insurance-management/membership-plans/MembershipAuditDialog';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';
import medflowLogo from '../../assets/medflow-logo.png';

const MembershipPlans = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const plans = useSelector(selectMembershipPlansList);
  const loading = useSelector(selectMembershipPlansLoading);

  useEffect(() => {
    dispatch(fetchMembershipPlansThunk());
  }, [dispatch]);

  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');

  const filteredPlans = plans.filter((plan) => {
    const query = search.toLowerCase();
    return (
      plan.name?.toLowerCase().includes(query) ||
      plan.templateName?.toLowerCase().includes(query)
    );
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);

  const initialNewPlanState = {
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
  };

  const [newPlan, setNewPlan] = useState(initialNewPlanState);

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
    setIsAddDialogOpen(false);
    setNewPlan(initialNewPlanState);
  };

  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#FBFCFE', 
      borderRadius: '12px', 
      border: '1px solid #E5E9F2', 
      minHeight: '100vh',
      '@media print': {
        p: 0,
        backgroundColor: 'transparent',
        border: 'none',
        minHeight: 'auto'
      }
    }}>
      
      <MembershipPlansActionBar 
        search={search}
        setSearch={setSearch}
        onAddPlan={() => setIsAddDialogOpen(true)}
        view={view}
        setView={setView}
      />

      <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', mb: 3 } }}>
        <img src={medflowLogo} alt="Medflow Logo" style={{ height: '48px' }} />
      </Box>

      <MembershipPlansTable 
        plans={filteredPlans}
        loading={loading}
        view={view}
        onDelete={handleDeleteClick}
        onSync={() => setIsSyncDialogOpen(true)}
        onAudit={() => setIsAuditDialogOpen(true)}
      />

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

      <SyncOfficesDialog 
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />

      <MembershipPlanFormDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        formData={newPlan}
        setFormData={setNewPlan}
        onSave={handleCreatePlan}
      />

      <MembershipAuditDialog 
        open={isAuditDialogOpen}
        onClose={() => setIsAuditDialogOpen(false)}
      />
    </Box>
  );
};

export default MembershipPlans;
