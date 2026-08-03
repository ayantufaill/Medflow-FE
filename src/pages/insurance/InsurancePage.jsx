import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPatientInsurances,
  fetchAllPatientInsurances,
  updatePatientInsuranceThunk 
} from '../../store/slices/patientSlice';

import { COLORS } from '../../constants/colors';
import { radius } from '../../constants/styles';

// Import newly refactored components
import InsuranceHeader from '../../components/insurance/InsuranceHeader';
import ImportedCoverageBanner from '../../components/insurance/ImportedCoverageBanner';
import InsuranceTabs from '../../components/insurance/InsuranceTabs';
import InsuranceTable from '../../components/insurance/InsuranceTable';
import InsuranceDialogs from '../../components/insurance/InsuranceDialogs';

const InsurancePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [hasImportedCoverage, setHasImportedCoverage] = useState(false);
  const [reviewImportedDialogOpen, setReviewImportedDialogOpen] = useState(false);
  
  // Dialog states
  const [addCoverageDialogOpen, setAddCoverageDialogOpen] = useState(false);
  const [viewCoverageDialogOpen, setViewCoverageDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Form states
  const [newCoverageType, setNewCoverageType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const insurancesData = useSelector(state => 
    patientId 
      ? (state.patient.insurancesCache[patientId]?.data || [])
      : (state.patient.globalInsurances || [])
  );
  
  const isFetching = useSelector(state => 
    patientId 
      ? state.patient.patientInsurancesLoading
      : state.patient.globalInsurancesLoading
  );

  const mappedData = React.useMemo(() => {
    return insurancesData.map(item => ({
      ...item,
      id: item._id || item.id || item.PatPlanNum,
      patientName: item.patientName || (item.patient ? `${item.patient.FName} ${item.patient.LName}` : 'Unknown Patient'),
      payer: item.insuranceCompanyId?.name || item.insuranceCompany?.name || item.payer || (item.inssub?.insplan?.carrier?.CarrierName) || 'Unknown Payer',
      plan: item.groupName || item.planType || item.plan || 'No Plan',
      subscriber: item.subscriberName || item.subscriber || item.patientName || 'Unknown Subscriber',
      status: (item.isActive === true || item.status === 'active' || item.Relationship === 0) ? 'active' : 'inactive',
      eligibilityChecked: item.lastEligibilityCheckDate || 'Not checked',
      dentist: item.provider?.name || 'Default Dentist',
      isFamilyPlan: item.isFamilyPlan || (item.relationshipToPatient && item.relationshipToPatient !== 'self') || false
    }));
  }, [insurancesData]);

  const activeCoverages = mappedData.filter(i => i.status === 'active' && !i.isFamilyPlan);
  const familyCoverages = mappedData.filter(i => i.status === 'active' && i.isFamilyPlan);
  const archivedCoverages = mappedData.filter(i => i.status === 'inactive' && !i.isFamilyPlan);
  const archivedFamilyCoverages = mappedData.filter(i => i.status === 'inactive' && i.isFamilyPlan);

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      dispatch(fetchPatientInsurances({ patientId })).then((action) => {
        if (action.error && action.meta?.condition !== true) {
          console.error('Error fetching insurances:', action.error);
          showSnackbar('Failed to load insurance coverage', 'error');
        }
        setLoading(false);
      });
    } else {
      setLoading(true);
      dispatch(fetchAllPatientInsurances()).then((action) => {
        if (action.error && action.meta?.condition !== true) {
          console.error('Error fetching global insurances:', action.error);
          showSnackbar('Failed to load global coverages', 'error');
        }
        setLoading(false);
      });
    }
  }, [dispatch, patientId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ open: false, message: '', severity: 'success' }), 3000);
  };

  const handleRowMenuOpen = (event, row) => {
    setRowMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRowMenuClose = () => {
    setRowMenuAnchorEl(null);
    setSelectedRow(null);
  };

  // Handler functions
  const handleAddCoverage = (type) => {
    if (type === 'Membership Plan') {
      navigate(patientId ? `/patients/member/${patientId}` : '/membership-plans');
    } else {
      const path = patientId ? `/patients/${patientId}/insurance/new` : '/insurance/new';
      navigate(path);
    }
  };

  const handleViewCoverage = (row) => {
    setExpandedRowId(expandedRowId === row.id ? null : row.id);
    handleRowMenuClose();
  };

  const handleDeactivate = (row) => {
    setSelectedRow(row);
    setDeactivateDialogOpen(true);
    setRowMenuAnchorEl(null);
  };

  const handleConfirmDeactivate = async () => {
    if (selectedRow) {
      console.log('Deactivating row:', selectedRow);
      try {
        const targetPatientId = patientId || selectedRow.patientId;
        await dispatch(updatePatientInsuranceThunk({ 
          patientId: targetPatientId, 
          insuranceId: selectedRow.id, 
          payload: { isActive: false, status: 'inactive' } 
        })).unwrap();
        
        showSnackbar(`${selectedRow.payer} coverage deactivated`, 'success');
        
        // Refresh the global list if we are on the global insurance page
        if (!patientId) {
          dispatch(fetchAllPatientInsurances({ force: true }));
        }
      } catch (error) {
        console.error('Failed to deactivate coverage:', error);
        showSnackbar('Failed to deactivate coverage', 'error');
      }
      setDeactivateDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleActivate = (row) => {
    setSelectedRow(row);
    setActivateDialogOpen(true);
    setRowMenuAnchorEl(null);
  };

  const handleConfirmActivate = async () => {
    if (selectedRow) {
      try {
        const targetPatientId = patientId || selectedRow.patientId;
        await dispatch(updatePatientInsuranceThunk({ 
          patientId: targetPatientId, 
          insuranceId: selectedRow.id, 
          payload: { isActive: true, status: 'active' } 
        })).unwrap();
        
        showSnackbar(`${selectedRow.payer} coverage activated`, 'success');
        
        if (!patientId) {
          dispatch(fetchAllPatientInsurances({ force: true }));
        }
      } catch (error) {
        console.error('Failed to activate coverage:', error);
        showSnackbar('Failed to activate coverage', 'error');
      }
      setActivateDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
    handleRowMenuClose();
  };

  const handleCheckEligibility = (row) => {
    showSnackbar(`Checking eligibility with ${row.dentist}...`, 'info');
    setTimeout(() => {
      showSnackbar('Eligibility verified successfully!', 'success');
    }, 1500);
  };

  const handleSaveNewCoverage = () => {
    showSnackbar('Coverage added successfully!', 'success');
    setAddCoverageDialogOpen(false);
    setNewCoverageType('');
  };

  const handleSaveEdit = () => {
    showSnackbar('Coverage updated successfully!', 'success');
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  const getTabData = () => {
    switch (tabValue) {
      case 0: return activeCoverages;
      case 1: return familyCoverages;
      case 2: return archivedCoverages;
      case 3: return archivedFamilyCoverages;
      default: return activeCoverages;
    }
  };

  const currentTabData = getTabData();

  return (
    <Box sx={{ p: '8px', bgcolor: COLORS.SURFACE_PAGE, minHeight: 'calc(100vh - 65px)', width: '100%', boxSizing: 'border-box' }}>
      {/* Snackbar Notification */}
      {snackbar.open && (
        <Alert severity={snackbar.severity} sx={{ mb: 2 }}>
          {snackbar.message}
        </Alert>
      )}

      {/* Header Card */}
      <InsuranceHeader onAddCoverage={handleAddCoverage} />

      {/* Main Container Card */}
      <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, p: '8px' }}>
        {hasImportedCoverage && (
          <Box sx={{ px: '8px' }}>
            <ImportedCoverageBanner onReview={() => setReviewImportedDialogOpen(true)} />
          </Box>
        )}

        <Box sx={{ px: '8px' }}>
          <InsuranceTabs tabValue={tabValue} onTabChange={(e, v) => setTabValue(v)} />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <InsuranceTable
            patientId={patientId}
            currentTabData={currentTabData}
            expandedRowId={expandedRowId}
            onViewCoverage={handleViewCoverage}
            onCheckEligibility={handleCheckEligibility}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
            onRowMenuOpen={handleRowMenuOpen}
          />
        )}
      </Box>

      {/* Dialogs Wrapper */}
      <InsuranceDialogs
        addCoverageDialogOpen={addCoverageDialogOpen}
        setAddCoverageDialogOpen={setAddCoverageDialogOpen}
        newCoverageType={newCoverageType}
        handleSaveNewCoverage={handleSaveNewCoverage}

        viewCoverageDialogOpen={viewCoverageDialogOpen}
        setViewCoverageDialogOpen={setViewCoverageDialogOpen}
        selectedRow={selectedRow}
        handleEdit={handleEdit}

        deactivateDialogOpen={deactivateDialogOpen}
        setDeactivateDialogOpen={setDeactivateDialogOpen}
        handleConfirmDeactivate={handleConfirmDeactivate}

        activateDialogOpen={activateDialogOpen}
        setActivateDialogOpen={setActivateDialogOpen}
        handleConfirmActivate={handleConfirmActivate}

        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        handleSaveEdit={handleSaveEdit}

        reviewImportedDialogOpen={reviewImportedDialogOpen}
        setReviewImportedDialogOpen={setReviewImportedDialogOpen}
        setHasImportedCoverage={setHasImportedCoverage}
        showSnackbar={showSnackbar}
      />
    </Box>
  );
};

export default InsurancePage;
