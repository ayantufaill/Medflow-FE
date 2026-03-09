import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { PatientDetailOverview } from '../../components/patient-detail';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import { PatientInsuranceTabContent } from '../../components/patient-tabs';
import { patientService } from '../../services/patient.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import ErrorBoundary from '../../components/shared/ErrorBoundary';

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
  const [patient, setPatient] = useState(patientFromNav ?? null);
  const [loading, setLoading] = useState(!patientFromNav);
  const [error, setError] = useState('');
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, patientName: '' });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [adjacentIds, setAdjacentIds] = useState({ prev: null, next: null });

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
    if (patientFromNav && (patientFromNav._id === patientId || patientFromNav.id === patientId)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    patientService
      .getPatientById(patientId)
      .then((data) => {
        if (!cancelled && data) setPatient(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load patient');
          setPatient(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [patientId, patientFromNav]);

  const fetchPatient = () => {
    if (!patientId) return;
    patientService.getPatientById(patientId).then((data) => data && setPatient(data));
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
              preferredDentists={[]}
              preferredHygienists={[]}
              onEdit={() => navigate(`/patients/${patientId}/edit`)}
              onRefresh={fetchPatient}
              onDeactivate={() =>
                setDeactivateDialog({
                  open: true,
                  patientName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient',
                })
              }
              onConvertToNonPatient={() => showSnackbar('Convert to non-patient — coming soon', 'info')}
              onBalance={() => navigate(`/patients/details/${patientId}?tab=insurance`)}
              onDocuments={() => navigate(`/patients/${patientId}/signed-documents`)}
              onAddFamilyMember={() => showSnackbar('Add family member — coming soon', 'info')}
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
    </Box>
  );
};

export default PatientDetailPage;
