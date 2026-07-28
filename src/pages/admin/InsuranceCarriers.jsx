import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
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
  selectCarriersLoading,
  updateCarrierThunk
} from '../../store/slices/insuranceSlice';
import { 
  fetchAllProvidersForDropdown, 
  selectProviderDropdownList 
} from '../../store/slices/providerSlice';

import InsuranceCarriersActionBar from '../../components/admin/insurance-management/insurance-carriers/InsuranceCarriersActionBar';
import InsuranceCarriersTable from '../../components/admin/insurance-management/insurance-carriers/InsuranceCarriersTable';
import CarrierFormDialog from '../../components/admin/insurance-management/insurance-carriers/CarrierFormDialog';
import CarrierSyncDialog from '../../components/admin/insurance-management/insurance-carriers/CarrierSyncDialog';

const InsuranceCarriers = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const companies = useSelector(selectCarriersList);
  const loading = useSelector(selectCarriersLoading);
  const providersList = useSelector(selectProviderDropdownList);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCarrier, setEditCarrier] = useState(null);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    companyId: null,
    companyName: '',
  });

  const initialNewCarrierState = {
    name: '', payerId: '', phone: '', email: '', fax: '', website: '',
    address: '', address2: '', city: '', state: '', zipCode: '', country: 'United States',
    notes: '', claimType: '', providersOutOfNetwork: [],
  };

  const [newCarrier, setNewCarrier] = useState(initialNewCarrierState);

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

  const getProviderName = useCallback((provider) => {
    const first = provider?.userId?.firstName || provider?.firstName || '';
    const last = provider?.userId?.lastName || provider?.lastName || '';
    return `${first} ${last}`.trim() || 'Unknown Provider';
  }, []);

  useEffect(() => {
    fetchCompanies();
    dispatch(fetchAllProvidersForDropdown());
  }, [fetchCompanies, dispatch]);

  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, companyId: id, companyName: name });
  };

  const handleEditClick = (company) => {
    setEditCarrier({
      ...company,
      providersOutOfNetwork: company.providersOutOfNetwork || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCarrier = async () => {
    try {
      if (!editCarrier.name || !editCarrier.payerId) {
        showSnackbar('Carrier Name and Electronic ID are required', 'error');
        return;
      }
      
      await dispatch(updateCarrierThunk({ 
        id: editCarrier._id || editCarrier.id, 
        payload: editCarrier 
      })).unwrap();
      
      showSnackbar('Insurance carrier updated successfully', 'success');
      setIsEditDialogOpen(false);
      setEditCarrier(null);
    } catch (err) {
      showSnackbar('Failed to update carrier', 'error');
    }
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

  const handleSaveCarrier = async () => {
    try {
      if (!newCarrier.name || !newCarrier.payerId) {
        showSnackbar('Carrier Name and Electronic ID are required', 'error');
        return;
      }

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

      const response = await insuranceCompanyService.createInsuranceCompany(sanitizedCarrier);

      const createdCarrier = {
        ...newCarrier,
        id: response?._id || response?.id || Date.now().toString(),
        plansCount: 0
      };

      dispatch(addCarrierOptimistic(createdCarrier));
      showSnackbar('Insurance carrier added successfully', 'success');
      setIsAddDialogOpen(false);
      setNewCarrier(initialNewCarrierState);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to add insurance carrier';
      showSnackbar(errorMessage, 'error');
      console.error('Failed to save carrier:', err);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <InsuranceCarriersActionBar 
        search={search}
        setSearch={setSearch}
        onAddCarrier={() => setIsAddDialogOpen(true)}
        onSync={() => setIsSyncDialogOpen(true)}
      />

      <InsuranceCarriersTable 
        companies={companies}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSync={() => setIsSyncDialogOpen(true)}
      />

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

      <CarrierFormDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add New Carrier"
        carrier={newCarrier}
        setCarrier={setNewCarrier}
        onSave={handleSaveCarrier}
        providersList={providersList}
        getProviderName={getProviderName}
      />

      <CarrierFormDialog 
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title={`Edit ${editCarrier?.name || 'Carrier'}`}
        carrier={editCarrier}
        setCarrier={setEditCarrier}
        onSave={handleUpdateCarrier}
        providersList={providersList}
        getProviderName={getProviderName}
      />

      <CarrierSyncDialog 
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />
    </Box>
  );
};

export default InsuranceCarriers;
