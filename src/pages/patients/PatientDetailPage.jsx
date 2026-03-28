import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { PatientDetailOverview } from '../../components/patient-detail';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import { PatientInsuranceTabContent } from '../../components/patient-tabs';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import ErrorBoundary from '../../components/shared/ErrorBoundary';
import { validateUSPhoneNumber } from '../../validations/patientValidations';

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
  // Always start with null to force fresh fetch on mount/refresh
  const [patient, setPatient] = useState(null);
  // Only use loading state if we don't have patient from nav
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, patientName: '' });
  const [activateDialog, setActivateDialog] = useState({ open: false, patientName: '' });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [adjacentIds, setAdjacentIds] = useState({ prev: null, next: null });
  const [preferredDentists, setPreferredDentists] = useState([]);
  const [preferredHygienists, setPreferredHygienists] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPatientData, setEditedPatientData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    patientService.getAllPatients(1, 500).then((data) => {
      if (cancelled || !data?.patients?.length) return;
      const list = data.patients;
      const idx = list.findIndex((p) => String(p._id ?? p.id) === String(patientId));
      if (idx < 0) return;
      const prevId = idx > 0 ? list[idx - 1]._id ?? list[idx - 1].id : null;
      const nextId = idx < list.length - 1 ? list[idx + 1]._id ?? list[idx + 1].id : null;
      setAdjacentIds({ prev: prevId, next: nextId });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    // Always fetch fresh data from API, ignore location.state.patient
    let cancelled = false;
    setLoading(true);
    setError('');
    console.log('🔍 Fetching patient workspace for ID:', patientId);
    Promise.all([
      patientService.getPatientWorkspace(patientId),
      providerService.getAllProviders(1, 100, '', true).catch(() => ({ providers: [] })),
    ])
      .then(([data, providerData]) => {
        console.log('📦 Raw patient data from API:', data);
        if (!cancelled && data) {
          setPatient(data);
          console.log('✅ Patient data set in state:', data);
        }
        if (!cancelled) {
          const providers = Array.isArray(providerData?.providers) ? providerData.providers : [];
          const options = providers.map((provider) => {
            const providerUser = provider?.userId || {};
            const name =
              [providerUser.firstName, providerUser.lastName].filter(Boolean).join(' ').trim() ||
              provider.providerCode ||
              `Provider ${provider._id}`;
            return {
              id: String(provider._id),
              name,
            };
          });
          setPreferredDentists(options);
          setPreferredHygienists(options);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('❌ Error fetching patient:', err);
          setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load patient');
          setPatient(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [patientId]);

  const fetchPatient = () => {
    if (!patientId) return;
    console.log('🔄 Manually fetching patient workspace for ID:', patientId);
    patientService.getPatientWorkspace(patientId).then((data) => {
      console.log('📦 Manual fetch - Raw API response:', data);
      console.log('📝 firstName from API:', data?.firstName);
      console.log('📅 dateOfBirth from API:', data?.dateOfBirth);
      data && setPatient(data);
      console.log('✅ Patient state updated to:', data);
    });
  };

  const handleSendUpdateRequest = async (payload) => {
    try {
      await patientService.createPatientUpdateRequest(patientId, payload);
      showSnackbar('Patient update request sent', 'success');
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to send update request';
      showSnackbar(message, 'error');
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
      
      const response = await patientService.updatePatient(patientId, dataToSave);
      console.log('✅ Backend response:', response);
      console.log('📝 Data we sent:', dataToSave);
      console.log('📥 Data received back:', response);
      
      showSnackbar('Patient information updated successfully', 'success');
      // Wait a moment for backend to process, then refresh
      setTimeout(() => {
        fetchPatient();
        console.log('🔄 Refreshed patient data from backend');
      }, 500);
      
      setIsEditMode(false);
      setEditedPatientData(null);
    } catch (err) {
      console.error('Update patient error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to update patient';
      showSnackbar(msg, 'error');
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
      await patientService.updatePatient(patientId, { isActive: false });
      showSnackbar('Patient deactivated', 'success');
      setDeactivateDialog({ open: false, patientName: '' });
      setPatient((prev) => (prev ? { ...prev, isActive: false } : null));
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate';
      showSnackbar(msg, 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleActivateConfirm = async () => {
    try {
      setDeactivateLoading(true);
      await patientService.updatePatient(patientId, { isActive: true });
      showSnackbar('Patient activated', 'success');
      setActivateDialog({ open: false, patientName: '' });
      setPatient((prev) => (prev ? { ...prev, isActive: true } : null));
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to activate';
      showSnackbar(msg, 'error');
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
          {tabParam === 'insurance' ? (
            <PatientInsuranceTabContent patientId={patientId} />
          ) : (
            <PatientDetailOverview
              patient={patient}
              patientNumber={patient?.patientCode ?? patientId}
              preferredDentists={preferredDentists}
              preferredHygienists={preferredHygienists}
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
              onAddFamilyMember={() => showSnackbar('Add family member — coming soon', 'info')}
              onSendUpdateRequest={handleSendUpdateRequest}
            />
          )}
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
    </Box>
  );
};

export default PatientDetailPage;
