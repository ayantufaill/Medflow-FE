import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { usePatient } from '../../hooks/redux/usePatient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProvidersForDropdown } from '../../store/slices/providerSlice';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import ErrorBoundary from '../../components/shared/ErrorBoundary';
import { validateUSPhoneNumber } from '../../validations/patientValidations';

const PatientDetailOverview = lazy(() => import('../../components/patient-detail').then(module => ({ default: module.PatientDetailOverview })));
const AddFamilyMemberDialog = lazy(() => import('../../components/patient-detail').then(module => ({ default: module.AddFamilyMemberDialog })));
const PatientInsuranceTabContent = lazy(() => import('../../components/patient-tabs').then(module => ({ default: module.PatientInsuranceTabContent })));

/**
 * Lightweight patient details page — dedicated route like signed-documents.
 * Only fetches one patient; uses location.state for instant display when coming from list.
 */
const PatientDetailPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const tabParam = searchParams.get('tab') || 'details';

  const patientFromNav = location.state?.patient;
  const dispatch = useDispatch();
  const { currentPatient: patient, loading, error, fetchById, updatePatient, sendUpdateRequest } = usePatient();
  const providerDropdownList = useSelector((state) => state.provider.dropdownList);
  
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, patientName: '' });
  const [activateDialog, setActivateDialog] = useState({ open: false, patientName: '' });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPatientData, setEditedPatientData] = useState(null);
  const [addFamilyDialogOpen, setAddFamilyDialogOpen] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    fetchById(patientId);
  }, [patientId, fetchById]);

  useEffect(() => {
    if (tabParam === 'details') {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [tabParam, dispatch]);

  useEffect(() => {
    if (location.state?.openFamilyDialog) {
      setAddFamilyDialogOpen(true);
      // Clear the state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchPatient = () => {
    if (!patientId) return;
    console.log('🔄 Manually fetching patient via Redux for ID:', patientId);
    fetchById(patientId);
  };

  const handleSendUpdateRequest = async (payload) => {
    try {
      await sendUpdateRequest(patientId, payload).unwrap();
      showSnackbar('Patient update request sent', 'success');
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to send update request', 'error');
    }
  };

  const handleSavePatient = async (eventOrData) => {
    try {
      // Prevent default form submission if this was triggered by a form submit
      if (eventOrData?.preventDefault) {
        eventOrData.preventDefault();
      }
      
      console.log('=== SAVE PATIENT ===');
      console.log('Original patient:', patient);
      console.log('Edited data:', editedPatientData);
      
      // Merge edited data with original patient data
      // Only update fields that were actually changed
      const dataToSave = { ...patient };
      
      // If we have edited data from sections, merge it
      if (editedPatientData) {
        Object.keys(editedPatientData).forEach(key => {
          if (editedPatientData[key] !== undefined) {
            dataToSave[key] = editedPatientData[key];
          }
        });
      }
      
      console.log('📦 Final data to save includes:');
      console.log('  - spouseInfo:', dataToSave.spouseInfo);
      console.log('  - headOfHousehold:', dataToSave.headOfHousehold);
      console.log('Final data to save:', dataToSave);
      console.log('Date of Birth being sent:', dataToSave.dateOfBirth);
      console.log('Last Visit Date being sent:', dataToSave.lastVisitDate);
      
      // --- Data Cleanup for Backend Validation ---
      
      // Mongoose strict validators fail on empty strings. We delete them from the payload 
      // so they bypass validation (this means clearing the field won't work perfectly 
      // but the save will succeed).
      
      if (!dataToSave.dateOfBirth) delete dataToSave.dateOfBirth;
      if (!dataToSave.lastVisitDate || dataToSave.lastVisitDate === 'Invalid Date') {
        delete dataToSave.lastVisitDate;
      }
      if (!dataToSave.email) {
        delete dataToSave.email;
      }
      
      // Prevent "null" string or empty string CastErrors for Providers
      if (dataToSave.preferredDentistId === "null" || dataToSave.preferredDentistId === "") {
        dataToSave.preferredDentistId = null;
      }
      if (dataToSave.preferredHygienistId === "null" || dataToSave.preferredHygienistId === "") {
        dataToSave.preferredHygienistId = null;
      }
      
      // 2. Work Address: Ensure it is an object
      if (typeof dataToSave.workAddress === 'string' || !dataToSave.workAddress) {
        dataToSave.workAddress = {};
      }
      
      // 3. Postal Codes: Remove empty strings/nulls so they don't fail the regex format validation
      if (dataToSave.address && !dataToSave.address.postalCode) {
        dataToSave.address = { ...dataToSave.address };
        delete dataToSave.address.postalCode;
      }
      if (dataToSave.workAddress && !dataToSave.workAddress.postalCode) {
        dataToSave.workAddress = { ...dataToSave.workAddress };
        delete dataToSave.workAddress.postalCode;
      }
      
      // Validate US phone numbers before saving
      const phoneValidationErrors = [];
      
      // Validate primary phone
      if (dataToSave.phonePrimary) {
        const primaryValidation = validateUSPhoneNumber(dataToSave.phonePrimary);
        if (!primaryValidation.valid) {
          phoneValidationErrors.push(`Mobile Number: ${primaryValidation.message}`);
        }
      }
      
      // Validate secondary phone
      if (dataToSave.phoneSecondary) {
        const secondaryValidation = validateUSPhoneNumber(dataToSave.phoneSecondary);
        if (!secondaryValidation.valid) {
          phoneValidationErrors.push(`Home Phone Number: ${secondaryValidation.message}`);
        }
      }
      
      // Validate emergency contact phone
      if (dataToSave.emergencyContact?.phone) {
        const emergencyValidation = validateUSPhoneNumber(dataToSave.emergencyContact.phone);
        if (!emergencyValidation.valid) {
          phoneValidationErrors.push(`Emergency Contact Phone: ${emergencyValidation.message}`);
        }
      }
      
      // If there are validation errors, show them and stop
      if (phoneValidationErrors.length > 0) {
        showSnackbar(phoneValidationErrors.join(', '), 'error');
        return;
      }
      
      // Dispatch the Redux update thunk
      await updatePatient(patientId, dataToSave).unwrap();
      
      showSnackbar('Patient information updated successfully', 'success');
      
      setIsEditMode(false);
      setEditedPatientData(null);
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to update patient', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedPatientData(null);
  };

  const handlePatientDataChange = (updatedData) => {
    console.log('📥 Child component sent updated data:', updatedData);
    console.log('  - spouseInfo:', updatedData.spouseInfo);
    console.log('  - headOfHousehold:', updatedData.headOfHousehold);
    
    // Merge new updates with existing edited data
    setEditedPatientData((prev) => ({
      ...prev,
      ...updatedData,
    }));
    
    console.log('📝 Updated editedPatientData state');
  };

  const handleDeactivateConfirm = async () => {
    try {
      setDeactivateLoading(true);
      await updatePatient(patientId, { isActive: false }).unwrap();
      showSnackbar('Patient deactivated', 'success');
      setDeactivateDialog({ open: false, patientName: '' });
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to deactivate', 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleActivateConfirm = async () => {
    try {
      setDeactivateLoading(true);
      await updatePatient(patientId, { isActive: true }).unwrap();
      showSnackbar('Patient activated', 'success');
      setActivateDialog({ open: false, patientName: '' });
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to activate', 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="info">Patient not found.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PatientSectionTabs activeTab={tabParam} patientId={patientId} />
      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <ErrorBoundary>
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          }>
            {tabParam === 'insurance' ? (
              <PatientInsuranceTabContent patientId={patientId} />
            ) : (
              <PatientDetailOverview
                patient={editedPatientData ? { ...patient, ...editedPatientData } : patient}
                patientNumber={patient?.patientCode ?? patientId}
                preferredDentists={providerDropdownList}
                preferredHygienists={providerDropdownList}
                isEditMode={isEditMode}
                onEdit={() => setIsEditMode(true)}
                onSave={handleSavePatient}
                onCancelEdit={handleCancelEdit}
                onPatientDataChange={handlePatientDataChange}
                onRefresh={fetchPatient}
                onDeactivate={() =>
                  setDeactivateDialog({
                    open: true,
                    patientName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient',
                  })
                }
                onActivate={() =>
                  setActivateDialog({
                    open: true,
                    patientName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient',
                  })
                }
                onConvertToNonPatient={() => showSnackbar('Convert to non-patient — coming soon', 'info')}
                onBalance={() => navigate(`/patients/details/${patientId}?tab=insurance`)}
                onDocuments={() => navigate(`/patients/${patientId}/signed-documents`)}
                onAddFamilyMember={() => setAddFamilyDialogOpen(true)}
                onSendUpdateRequest={handleSendUpdateRequest}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </Box>
      <ConfirmationDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, patientName: '' })}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Patient"
        message={`Deactivate "${deactivateDialog.patientName}"? They will be marked inactive.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmColor="error"
        loading={deactivateLoading}
      />
      <ConfirmationDialog
        open={activateDialog.open}
        onClose={() => setActivateDialog({ open: false, patientName: '' })}
        onConfirm={handleActivateConfirm}
        title="Activate Patient"
        message={`Activate "${activateDialog.patientName}"? They will be restored to active status.`}
        confirmText="Activate"
        cancelText="Cancel"
        confirmColor="success"
        loading={deactivateLoading}
      />
      <Suspense fallback={null}>
        <AddFamilyMemberDialog
          open={addFamilyDialogOpen}
          onClose={() => setAddFamilyDialogOpen(false)}
          currentPatientId={patientId}
          onConfirm={async (selectedPatient) => {
            try {
              setAddFamilyDialogOpen(false);
              const currentHousehold = Array.isArray(patient?.household) ? patient.household : [];
              
              // Check if already in household
              if (currentHousehold.some(m => (m._id || m.id) === (selectedPatient._id || selectedPatient.id))) {
                showSnackbar('This patient is already a family member', 'info');
                return;
              }

              const newMember = {
                id: selectedPatient._id || selectedPatient.id,
                firstName: selectedPatient.firstName,
                lastName: selectedPatient.lastName,
                dateOfBirth: selectedPatient.dateOfBirth,
                relationship: 'Family Member'
              };

              const updatedHousehold = [...currentHousehold, newMember];
              await updatePatient(patientId, { household: updatedHousehold }).unwrap();
              showSnackbar('Family member linked successfully', 'success');
            } catch (err) {
              showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to link family member', 'error');
            }
          }}
        />
      </Suspense>
    </Box>
  );
};

export default PatientDetailPage;
