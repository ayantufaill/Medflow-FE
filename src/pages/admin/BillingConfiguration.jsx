import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBillingConfiguration,
  saveBillingConfiguration,
  selectBillingConfiguration,
  selectBillingConfigLoading
} from '../../store/slices/billingSlice';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import PreviewStatementDialog from '../../components/admin/PreviewStatementDialog';

import BillingConfigGeneral from '../../components/admin/finance-management/billing-configuration/BillingConfigGeneral';
import BillingConfigAddress from '../../components/admin/finance-management/billing-configuration/BillingConfigAddress';
import BillingConfigDefaults from '../../components/admin/finance-management/billing-configuration/BillingConfigDefaults';
import BillingConfigPreferences from '../../components/admin/finance-management/billing-configuration/BillingConfigPreferences';

const BillingConfiguration = () => {
  const [formData, setFormData] = useState({
    // General Settings (Left side)
    assignmentAllBenefits: true,
    outOfNetworkByDefault: false,
    chronologicalInvoices: false,
    closeClaimsNonAssignment: true,
    closeClaimsZeroOwing: false,
    policiesForClaimsOnly: false,

    // Right Side
    useOfficeAddress: false,
    useForClaims: false,
    country: 'Country',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    defaultBillingType: 'Standard',
    defaultPracticeService: '',
    defaultBillingProvider: 'Treating Provider',
    estimateInsurance: 'Yes',
    bankAccountNumber: '',
    bankAccountInfo: '',
    billingMode: 'advanced',
    excludeClosedInvoices: true,
    hideBillingTransfers: false,
    hideVoidedInvoices: true,
    enableInsuranceCreditPayment: true,
    enableInsuranceCreditTowardsOutstanding: true,
    statementVersion: '2',
    defaultAddClaims: true,
    defaultClaimType: 'Electronic',
    useFamilyCredit: true,
    hideBillingEntity: false,
    clearingHouse: 'Vyne',
    autogenerateInvoice: false,
    autogenerateStatement: false,
    showSecondaryClaimPrompt: true,
    displayZeroPayments: false,
    applyMembershipAdjustment: true,
    includeUnpaidMembershipPlans: true,
    includeMembershipPortionsInReports: false,
    honorWriteOff: true,
  });

  const [isDirty, setIsDirty] = useState(false);

  const dispatch = useDispatch();
  const savedConfig = useSelector(selectBillingConfiguration);
  const loading = useSelector(selectBillingConfigLoading);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const promise = dispatch(fetchBillingConfiguration());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (savedConfig) {
      setFormData(prev => ({
        ...prev,
        ...savedConfig
      }));
      setIsDirty(false);
    }
  }, [savedConfig]);

  const handleSave = async () => {
    try {
      await dispatch(saveBillingConfiguration(formData)).unwrap();
      setToast({ open: true, message: 'Billing configuration saved successfully!', severity: 'success' });
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Failed to save configuration.', severity: 'error' });
    }
  };

  const handleCloseToast = () => setToast(prev => ({ ...prev, open: false }));

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      {/* Header Info */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
            Billing Configuration
          </Typography>
        </Box>
        <Button 
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          variant="contained" 
          onClick={handleSave} 
          disabled={loading || !isDirty}
          sx={{
            textTransform: 'none',
            backgroundColor: !isDirty ? '#e2e8f0' : '#2563eb',
            color: !isDirty ? '#94a3b8' : '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: !isDirty ? '#e2e8f0' : '#1d4ed8', boxShadow: 'none' }
          }}
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        
        {/* Left Column */}
        <Box sx={{ flex: '0 0 380px' }}>
          <BillingConfigGeneral 
            formData={formData} 
            handleChange={handleChange} 
            onPreviewStatement={() => setPreviewOpen(true)} 
          />
          <BillingConfigAddress 
            formData={formData} 
            handleChange={handleChange} 
            setFormData={setFormData} 
          />
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          <BillingConfigDefaults 
            formData={formData} 
            handleChange={handleChange} 
            setFormData={setFormData} 
          />
          <BillingConfigPreferences 
            formData={formData} 
            handleChange={handleChange} 
            setFormData={setFormData} 
          />
        </Box>

      </Box>

      {/* Dialogs & Toasts */}
      <PreviewStatementDialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillingConfiguration;
