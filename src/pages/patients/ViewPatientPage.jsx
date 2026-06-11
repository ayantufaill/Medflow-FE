import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { PatientDetailOverview, AddFamilyMemberDialog } from '../../components/patient-detail';
import {
  PatientAllergyTab,
  PatientDocumentsTab,
  PatientInsuranceTabContent,
  PatientNotesTab,
  PatientVitalsTab,
} from '../../components/patient-tabs';
import { usePatient } from '../../hooks/queries/usePatients';

const TAB_PARAMS = { insurance: 1, allergies: 2, vitals: 3, notes: 4, documents: 5 };

const ViewPatientPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const initialTab = TAB_PARAMS[searchParams.get('tab')] ?? 0;
  const [tabValue, setTabValue] = useState(initialTab);
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, patientId: null, patientName: '' });
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [addFamilyDialogOpen, setAddFamilyDialogOpen] = useState(false);

  const { data: patient, isLoading, isError, refetch } = usePatient(patientId, { includeSsn: true });

  useEffect(() => {
    setTabValue(TAB_PARAMS[searchParams.get('tab')] ?? 0);
  }, [searchParams]);

  const handleDeactivateConfirm = async () => {
    if (!deactivateDialog.patientId) return;
    try {
      setDeactivateLoading(true);
      await patientService.updatePatient(deactivateDialog.patientId, { isActive: false });
      showSnackbar('Patient deactivated', 'success');
      setDeactivateDialog({ open: false, patientId: null, patientName: '' });
      refetch();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate',
        'error'
      );
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleAddFamilyMember = async (selectedPatient) => {
    try {
      setAddFamilyDialogOpen(false);
      const currentHousehold = Array.isArray(patient?.household) ? patient.household : [];
      if (currentHousehold.some((m) => (m._id || m.id) === (selectedPatient._id || selectedPatient.id))) {
        showSnackbar('This patient is already a family member', 'info');
        return;
      }
      const newMember = {
        id: selectedPatient._id || selectedPatient.id,
        firstName: selectedPatient.firstName,
        lastName: selectedPatient.lastName,
        dateOfBirth: selectedPatient.dateOfBirth,
        relationship: 'Family Member',
      };
      await patientService.updatePatient(patientId, { household: [...currentHousehold, newMember] });
      showSnackbar('Family member linked successfully', 'success');
      refetch();
    } catch (err) {
      showSnackbar('Failed to link family member', 'error');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !patient) {
    return <Alert severity="error">Patient not found</Alert>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => window.history.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {`${patient.firstName} ${patient.lastName}`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {patient.patientCode ? `Code: ${patient.patientCode} | ` : ''}View demographics, insurance, and allergies
            </Typography>
          </Box>
          <Box sx={{ alignSelf: 'start' }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/patients/${patientId}/edit`)}>
              Edit Patient
            </Button>
          </Box>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Details" />
              <Tab label="Insurance" />
              <Tab label="Allergies" />
              <Tab label="Vitals" />
              <Tab label="Clinical Notes" />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <PatientDetailOverview
                patient={patient}
                patientNumber={patient.patientCode ?? patientId}
                preferredDentists={[]}
                preferredHygienists={[]}
                onEdit={() => navigate(`/patients/${patientId}/edit`)}
                onRefresh={refetch}
                onDeactivate={() => setDeactivateDialog({ open: true, patientId, patientName: `${patient.firstName} ${patient.lastName}` })}
                onConvertToNonPatient={() => showSnackbar('Convert to non-patient — coming soon', 'info')}
                onBalance={() => setTabValue(1)}
                onDocuments={() => setTabValue(5)}
                onAddFamilyMember={() => setAddFamilyDialogOpen(true)}
              />
            </Box>
          )}
          {tabValue === 1 && <PatientInsuranceTabContent patientId={patientId} />}
          {tabValue === 2 && <PatientAllergyTab patientId={patientId} />}
          {tabValue === 3 && <Box sx={{ p: 3 }}><PatientVitalsTab patientId={patientId} /></Box>}
          {tabValue === 4 && <Box sx={{ p: 3 }}><PatientNotesTab patientId={patientId} /></Box>}
          {tabValue === 5 && <Box sx={{ p: 3 }}><PatientDocumentsTab patientId={patientId} /></Box>}
        </Paper>

        <ConfirmationDialog
          open={deactivateDialog.open}
          onClose={() => setDeactivateDialog({ open: false, patientId: null, patientName: '' })}
          onConfirm={handleDeactivateConfirm}
          title="Deactivate Patient"
          message={`Deactivate "${deactivateDialog.patientName}"? They will be marked inactive.`}
          confirmText="Deactivate"
          cancelText="Cancel"
          confirmColor="error"
          loading={deactivateLoading}
        />

        <AddFamilyMemberDialog
          open={addFamilyDialogOpen}
          onClose={() => setAddFamilyDialogOpen(false)}
          currentPatientId={patientId}
          onConfirm={handleAddFamilyMember}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ViewPatientPage;
