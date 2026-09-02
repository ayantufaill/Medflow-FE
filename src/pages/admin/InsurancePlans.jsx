import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Popover,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import { insurancePlanService } from '../../services/insurance.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import AuditInsurancePlanHistory from '../../components/insurance/components/AuditInsurancePlanHistory';
import PlanFeeGuideDialog from '../../components/insurance/components/PlanFeeGuideDialog';
import { 
  fetchPlansList, 
  deletePlanThunk, 
  addPlanOptimistic, 
  selectPlansList, 
  selectPlansListLoading,
  fetchCarriersList,
  selectCarriersList
} from '../../store/slices/insuranceSlice';

import InsurancePlansActionBar from '../../components/admin/insurance-management/insurance-plans/InsurancePlansActionBar';
import InsurancePlansTable from '../../components/admin/insurance-management/insurance-plans/InsurancePlansTable';
import PlanFormDialog from '../../components/admin/insurance-management/insurance-plans/PlanFormDialog';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

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
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  const [isFeeGuideDialogOpen, setIsFeeGuideDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  
  const [activePlan, setActivePlan] = useState(null);
  const [editPlan, setEditPlan] = useState(null);

  const [subscribersAnchorEl, setSubscribersAnchorEl] = useState(null);
  const [activeSubscribers, setActiveSubscribers] = useState([]);
  
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    planId: null,
    groupName: '',
  });

  const initialNewPlanState = {
    groupNumber: '', groupName: '', employer: '', templateName: '', payerName: '', payerId: '', phone: '',
    notes: '', isHealthPlan: false, isCopayPlan: false, assignment: 'Assignment',
    individualMax: '0.00', individualMaxUnlimited: true, familyMax: '0.00', familyMaxUnlimited: true,
  };

  const [newPlan, setNewPlan] = useState(initialNewPlanState);

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
  }, [fetchPlans]);

  useEffect(() => {
    dispatch(fetchCarriersList({ page: 1, limit: 100, search: '' }));
  }, [dispatch]);

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

  const handleUpdatePlan = async () => {
    try {
      if (!editPlan.groupName || !editPlan.groupNumber || !editPlan.payerId) {
        showSnackbar('Group Name, Group #, and Payer ID (Insurance Company ID) are required', 'error');
        return;
      }
      
      showSnackbar('Insurance plan updated successfully', 'success');
      setIsEditDialogOpen(false);
      setEditPlan(null);
      fetchPlans();
    } catch (err) {
      showSnackbar('Failed to update insurance plan', 'error');
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
        setIsAddDialogOpen(false);
        setNewPlan(initialNewPlanState);
      } catch (apiErr) {
        console.error(apiErr);
        showSnackbar('Failed to add insurance plan. Please try again.', 'error');
      }
    } catch (err) {
      showSnackbar('Failed to add insurance plan', 'error');
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      
      <InsurancePlansActionBar 
        searchCarrier={searchCarrier}
        setSearchCarrier={setSearchCarrier}
        searchGeneral={searchGeneral}
        setSearchGeneral={setSearchGeneral}
        onAddPlan={() => setIsAddDialogOpen(true)}
        onSync={() => setIsSyncDialogOpen(true)}
      />

      <InsurancePlansTable 
        plans={plans}
        loading={loading}
        onEdit={(plan) => { setEditPlan(plan); setIsEditDialogOpen(true); }}
        onDelete={handleDeleteClick}
        onSync={() => setIsSyncDialogOpen(true)}
        onAudit={(plan) => { setActivePlan(plan); setIsAuditDialogOpen(true); }}
        onFeeGuide={(plan) => { setActivePlan(plan); setIsFeeGuideDialogOpen(true); }}
        onSubscribersClick={(e, plan) => {
          setActiveSubscribers(plan.subscriberList || []); 
          setSubscribersAnchorEl(e.currentTarget);
        }}
      />

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

      <SyncOfficesDialog 
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />

      <PlanFormDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add New Plan"
        formData={newPlan}
        setFormData={setNewPlan}
        onSave={handleSavePlan}
        carriersList={carriersList}
      />

      <PlanFormDialog 
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Plan"
        formData={editPlan}
        setFormData={setEditPlan}
        onSave={handleUpdatePlan}
        carriersList={carriersList}
      />

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

      <Popover
        open={Boolean(subscribersAnchorEl)}
        anchorEl={subscribersAnchorEl}
        onClose={(e) => { e.stopPropagation(); setSubscribersAnchorEl(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { p: 2, minWidth: 200, borderRadius: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" } }}
        disableRestoreFocus
      >
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: '#374151', display: 'block', mb: 1 }}>
          Subscribers:
        </Typography>
        {!Array.isArray(activeSubscribers) ? (
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>Invalid subscriber data</Typography>
        ) : activeSubscribers.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>No subscribers details available</Typography>
        ) : (
          activeSubscribers.map((sub, i) => {
            let displayName = 'Unknown Subscriber';
            if (!sub) displayName = 'Unknown Subscriber';
            else if (typeof sub === 'string') displayName = sub;
            else if (sub.name) displayName = sub.name;
            else if (sub.firstName || sub.lastName) displayName = `${sub.firstName || ''} ${sub.lastName || ''}`.trim();
            else if (sub.subscriberName) displayName = sub.subscriberName;
            
            return (
              <Typography key={i} sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151", ml: 1, mb: 0.5 }}>
                - {displayName}
              </Typography>
            );
          })
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "16px", py: "5px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            }} 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.currentTarget.blur();
              setSubscribersAnchorEl(null); 
            }}
          >
            OK
          </Button>
        </Box>
      </Popover>

    </Box>
  );
};

export default InsurancePlans;
