import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Button,
  Tabs,
  Tab,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Stack,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  FilterAltOff,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  CameraAlt as CameraAltIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { insuranceCompanyService } from '../../services/insurance.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { useForm, Controller } from 'react-hook-form';
import {
  extractTextFromImage,
  parseInsuranceCard,
} from '../../services/ocr.service';
import {
  PatientVitalsTab,
  PatientNotesTab,
  PatientDocumentsTab,
} from '../../components/patient-tabs';

const ViewPatientPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState(null);
  
  // Initialize tab from URL query param, default to 0
  const initialTab = searchParams.get('tab') === 'insurance' ? 1 : 
                     searchParams.get('tab') === 'notes' ? 2 :
                     searchParams.get('tab') === 'documents' ? 3 :
                     searchParams.get('tab') === 'vitals' ? 4 : 0;
  const [tabValue, setTabValue] = useState(initialTab);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Insurance state
  const [insurances, setInsurances] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [insuranceSearch, setInsuranceSearch] = useState('');
  const [insuranceStatusFilter, setInsuranceStatusFilter] = useState('');
  const [insuranceVerificationFilter, setInsuranceVerificationFilter] =
    useState('');
  const [insuranceEffectiveDateStart, setInsuranceEffectiveDateStart] =
    useState(null);
  const [insuranceEffectiveDateEnd, setInsuranceEffectiveDateEnd] =
    useState(null);
  const [insuranceDialog, setInsuranceDialog] = useState({
    open: false,
    mode: 'add',
    insurance: null,
  });
  const [insuranceMenu, setInsuranceMenu] = useState({
    anchorEl: null,
    insurance: null,
  });
  const [insuranceSaving, setInsuranceSaving] = useState(false);
  const [insuranceDeleteDialog, setInsuranceDeleteDialog] = useState({
    open: false,
    insurance: null,
  });

  // Allergy state
  const [allergies, setAllergies] = useState([]);
  const [allergySearch, setAllergySearch] = useState('');
  const [allergySeverityFilter, setAllergySeverityFilter] = useState('');
  const [allergyStatusFilter, setAllergyStatusFilter] = useState('');
  const [allergyDocumentedDateStart, setAllergyDocumentedDateStart] =
    useState(null);
  const [allergyDocumentedDateEnd, setAllergyDocumentedDateEnd] =
    useState(null);
  const [allergyDialog, setAllergyDialog] = useState({
    open: false,
    mode: 'add',
    allergy: null,
  });
  const [allergyMenu, setAllergyMenu] = useState({
    anchorEl: null,
    allergy: null,
  });
  const [allergySaving, setAllergySaving] = useState(false);
  const [allergyDeleteDialog, setAllergyDeleteDialog] = useState({
    open: false,
    allergy: null,
  });

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError('');
      // Include SSN in the response for view mode
      const data = await patientService.getPatientById(patientId, true);
      setPatient(data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load patient. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInsurancesAndCompanies = async () => {
    try {
      const [insList, companies] = await Promise.all([
        patientService.getPatientInsurances(patientId, undefined), // Get all insurances (active and inactive)
        insuranceCompanyService.getAllInsuranceCompanies(true),
      ]);
      setInsurances(insList || []);
      setAllCompanies(companies || []);
    } catch (err) {
      console.error('Failed to load insurance data', err);
    }
  };

  const fetchAllergies = async () => {
    try {
      const list = await patientService.getPatientAllergies(patientId, true);
      setAllergies(list || []);
    } catch (err) {
      console.error('Failed to load allergies', err);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatient();
      fetchInsurancesAndCompanies();
      fetchAllergies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  // Update tab when URL query param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'insurance') {
      setTabValue(1);
    } else if (tabParam === 'notes') {
      setTabValue(2);
    } else if (tabParam === 'documents') {
      setTabValue(3);
    } else if (tabParam === 'vitals') {
      setTabValue(4);
    } else if (!tabParam) {
      setTabValue(0);
    }
  }, [searchParams]);

  const handleBack = () => {
    window.history.back();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getPatientInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'P';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const getInsuranceCompanyName = (insuranceCompanyId) => {
    // If insuranceCompanyId is an object (populated from backend), use the name directly
    if (insuranceCompanyId && typeof insuranceCompanyId === 'object') {
      return insuranceCompanyId.name || 'Unknown';
    }
    // If it's a string ID, look it up in the companies array
    if (typeof insuranceCompanyId === 'string') {
      const company = allCompanies.find(
        (c) => (c._id || c.id) === insuranceCompanyId
      );
      return company?.name || 'Unknown';
    }
    return 'Unknown';
  };

  const filteredInsurances = insurances.filter((ins) => {
    if (insuranceSearch.trim()) {
      const q = insuranceSearch.toLowerCase();
      const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
      const matchesSearch =
        (ins.policyNumber || '').toLowerCase().includes(q) ||
        (ins.insuranceType || '').toLowerCase().includes(q) ||
        companyName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (insuranceStatusFilter) {
      const isActive = insuranceStatusFilter === 'active';
      if (ins.isActive !== isActive) return false;
    }
    if (insuranceVerificationFilter) {
      if ((ins.verificationStatus || 'pending') !== insuranceVerificationFilter)
        return false;
    }
    if (insuranceEffectiveDateStart) {
      const effectiveDate = ins.effectiveDate ? dayjs(ins.effectiveDate) : null;
      if (
        !effectiveDate ||
        effectiveDate.isBefore(dayjs(insuranceEffectiveDateStart), 'day')
      )
        return false;
    }
    if (insuranceEffectiveDateEnd) {
      const effectiveDate = ins.effectiveDate ? dayjs(ins.effectiveDate) : null;
      if (
        !effectiveDate ||
        effectiveDate.isAfter(dayjs(insuranceEffectiveDateEnd), 'day')
      )
        return false;
    }
    return true;
  });

  const handleResetInsuranceFilters = () => {
    setInsuranceStatusFilter('');
    setInsuranceVerificationFilter('');
    setInsuranceEffectiveDateStart(null);
    setInsuranceEffectiveDateEnd(null);
    setInsuranceSearch('');
  };

  const hasInsuranceFilters =
    insuranceStatusFilter ||
    insuranceVerificationFilter ||
    insuranceEffectiveDateStart ||
    insuranceEffectiveDateEnd;

  const filteredAllergies = allergies.filter((all) => {
    if (allergySearch.trim()) {
      const q = allergySearch.toLowerCase();
      const matchesSearch =
        (all.allergen || '').toLowerCase().includes(q) ||
        (all.reaction || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (allergySeverityFilter) {
      if ((all.severity || '') !== allergySeverityFilter) return false;
    }
    if (allergyStatusFilter) {
      const isActive = allergyStatusFilter === 'active';
      if (all.isActive !== isActive) return false;
    }
    if (allergyDocumentedDateStart && all.documentedDate) {
      if (
        dayjs(all.documentedDate).isBefore(
          dayjs(allergyDocumentedDateStart),
          'day'
        )
      )
        return false;
    }
    if (allergyDocumentedDateEnd && all.documentedDate) {
      if (
        dayjs(all.documentedDate).isAfter(
          dayjs(allergyDocumentedDateEnd),
          'day'
        )
      )
        return false;
    }
    return true;
  });

  const handleResetAllergyFilters = () => {
    setAllergySearch('');
    setAllergySeverityFilter('');
    setAllergyStatusFilter('');
    setAllergyDocumentedDateStart(null);
    setAllergyDocumentedDateEnd(null);
  };

  const hasAllergyFilters =
    allergySearch ||
    allergySeverityFilter ||
    allergyStatusFilter ||
    allergyDocumentedDateStart ||
    allergyDocumentedDateEnd;

  // Insurance handlers
  const handleInsuranceAdd = () => {
    setInsuranceDialog({ open: true, mode: 'add', insurance: null });
  };

  const handleInsuranceEdit = (insurance) => {
    setInsuranceDialog({ open: true, mode: 'edit', insurance });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };

  const handleInsuranceDelete = (insurance) => {
    setInsuranceDeleteDialog({ open: true, insurance });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };

  const handleInsuranceActivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await patientService.updatePatientInsurance(
        patientId,
        insurance._id || insurance.id,
        { isActive: true }
      );
      showSnackbar('Insurance activated successfully', 'success');
      await fetchInsurancesAndCompanies();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to activate insurance',
        'error'
      );
    }
  };

  const handleInsuranceDeactivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await patientService.updatePatientInsurance(
        patientId,
        insurance._id || insurance.id,
        { isActive: false }
      );
      showSnackbar('Insurance deactivated successfully', 'success');
      await fetchInsurancesAndCompanies();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to deactivate insurance',
        'error'
      );
    }
  };

  const handleInsuranceMenuOpen = (event, insurance) => {
    setInsuranceMenu({ anchorEl: event.currentTarget, insurance });
  };

  const handleInsuranceMenuClose = () => {
    setInsuranceMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleInsuranceMenuExited = () => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };

  // Allergy handlers
  const handleAllergyAdd = () => {
    setAllergyDialog({ open: true, mode: 'add', allergy: null });
  };

  const handleAllergyEdit = (allergy) => {
    setAllergyDialog({ open: true, mode: 'edit', allergy });
    setAllergyMenu({ anchorEl: null, allergy: null });
  };

  const handleAllergyDelete = (allergy) => {
    setAllergyDeleteDialog({ open: true, allergy });
    setAllergyMenu({ anchorEl: null, allergy: null });
  };

  const handleAllergyMenuOpen = (event, allergy) => {
    setAllergyMenu({ anchorEl: event.currentTarget, allergy });
  };

  const handleAllergyMenuClose = () => {
    setAllergyMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleAllergyMenuExited = () => {
    setAllergyMenu({ anchorEl: null, allergy: null });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !patient) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box>
        <Alert severity="error">Patient not found</Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Details'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {patient?.patientCode ? `Code: ${patient.patientCode} | ` : ''}View demographics, insurance, and allergies
            </Typography>
          </Box>
          <Box sx={{alignSelf: "start"}}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/patients/${patientId}/edit`)}
            >
              Edit Patient
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Primary Details Section */}
        {/* <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 3,
              flexWrap: 'wrap',
            }}
          > */}
        {/* Left: Profile Picture and Info */}
        {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                minWidth: 300,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {getPatientInitials(patient.firstName, patient.lastName)}
                </Avatar>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Patient Code: {patient.patientCode || '-'}
                </Typography>
                <Typography
                  variant="body2"
                  color={patient.isActive ? 'success.main' : 'error.main'}
                >
                  {patient.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper> */}

        {/* Tabs Section */}
        <Paper sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Details" />
              <Tab label="Insurance" />
              <Tab label="Allergies" />
              <Tab label="Vitals" />
              <Tab label="Clinical Notes" />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          {/* Details Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              {/* Personal Information Card */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Personal Information
                </Typography>
              </Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Personal Information */}
                <Grid item size={{ xs: 12, sm: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.firstName || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.lastName || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Middle Name
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.middleName || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Preferred Name
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.preferredName || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(patient.dateOfBirth)}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.gender
                          ? patient.gender
                              .split('_')
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(' ')
                          : '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        SSN
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.ssn
                          ? patient.ssn.replace(
                              /(\d{3})(\d{2})(\d{4})/,
                              '$1-$2-$3'
                            )
                          : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* </Card> */}
                </Grid>

                {/* Contact Information */}
                <Grid item size={{ xs: 12, sm: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Primary Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.phonePrimary || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Secondary Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.phoneSecondary || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.email || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Preferred Language
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.preferredLanguage
                          ? patient.preferredLanguage.toUpperCase()
                          : '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Communication Preference
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.communicationPreference
                          ? patient.communicationPreference
                              .charAt(0)
                              .toUpperCase() +
                            patient.communicationPreference
                              .slice(1)
                              .toLowerCase()
                          : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* </Card> */}
                </Grid>

                {/* Address */}
                <Grid item size={{ xs: 12, md: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Address Line 1
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.address?.line1 || '-'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Address Line 2
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.address?.line2 || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.address?.city || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        State
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.address?.state || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Postal Code
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.address?.postalCode || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* </Card> */}
                </Grid>

                {/* Emergency Contact */}
                <Grid item size={{ xs: 12, md: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    Emergency Contact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.emergencyContact?.name || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Relationship
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.emergencyContact?.relationship || '-'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.emergencyContact?.phone || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* </Card> */}
                </Grid>

                {/* Additional Information */}
                <Grid item size={{ xs: 12, md: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Portal Access Enabled
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.portalAccessEnabled ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last Visit Date
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(patient.lastVisitDate)}
                      </Typography>
                    </Grid>
                    <Grid item size={{ xs: 3, md: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Referral Source
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {patient.referralSource || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* </Card> */}
                </Grid>

                {/* Notes */}
                <Grid item size={{ xs: 12, md: 12 }}>
                  {/* <Card sx={{ p: 2.5, height: '100%' }}> */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
                  >
                    Notes
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {patient.notes || '-'}
                  </Typography>
                  {/* </Card> */}
                </Grid>
                {/* Custom Fields */}
                {patient.customFields &&
                  Object.keys(patient.customFields).length > 0 && (
                    <Grid item size={{ xs: 12, md: 12 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          mb: 2,
                          color: 'primary.main',
                        }}
                      >
                        Custom Fields
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        {Object.entries(patient.customFields).map(
                          ([key, value]) => (
                            <Box
                              key={key}
                              sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                gutterBottom
                              >
                                {key}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {String(value || '-')}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Grid>
                  )}
              </Grid>
            </Box>
          )}

          {/* Insurance Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Insurance
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleInsuranceAdd}
                >
                  Add Insurance
                </Button>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{ mb: 3, alignItems: 'flex-end' }}
              >
                <Grid size={9}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search insurance..."
                    value={insuranceSearch}
                    onChange={(e) => setInsuranceSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: insuranceSearch && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setInsuranceSearch('')}
                            edge="end"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="insurance-status-filter-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="insurance-status-filter-label"
                      value={insuranceStatusFilter}
                      label="Status"
                      onChange={(e) => setInsuranceStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="insurance-verification-filter-label">
                      Verification
                    </InputLabel>
                    <Select
                      labelId="insurance-verification-filter-label"
                      value={insuranceVerificationFilter}
                      label="Verification"
                      onChange={(e) =>
                        setInsuranceVerificationFilter(e.target.value)
                      }
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={3.5}>
                  <DatePicker
                    label="Effective From"
                    value={insuranceEffectiveDateStart}
                    onChange={(newValue) =>
                      setInsuranceEffectiveDateStart(newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                    maxDate={insuranceEffectiveDateEnd || undefined}
                  />
                </Grid>
                <Grid size={3.5}>
                  <DatePicker
                    label="Effective To"
                    value={insuranceEffectiveDateEnd}
                    onChange={(newValue) =>
                      setInsuranceEffectiveDateEnd(newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                    minDate={insuranceEffectiveDateStart || undefined}
                  />
                </Grid>
                <Grid size={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                  >
                    <Tooltip title="Clear Filters">
                      <span>
                        <IconButton
                          onClick={handleResetInsuranceFilters}
                          disabled={!hasInsuranceFilters}
                          color="primary"
                        >
                          <FilterAltOff />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Refresh">
                      <span>
                        <IconButton
                          onClick={fetchInsurancesAndCompanies}
                          color="primary"
                        >
                          <RefreshIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>

              {filteredInsurances.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No insurance records found.
                </Typography>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Insurance Company
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Insurance Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Policy Number
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Subscriber Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Effective Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Expiration Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Status
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInsurances.map((ins) => (
                        <TableRow
                          key={ins._id || ins.id}
                          hover
                          sx={{
                            '&:hover': { backgroundColor: 'action.hover' },
                            opacity: ins.isActive === false ? 0.7 : 1,
                            backgroundColor:
                              ins.isActive === false
                                ? 'action.hover'
                                : 'transparent',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {getInsuranceCompanyName(ins.insuranceCompanyId)}
                          </TableCell>
                          <TableCell>
                            {ins.insuranceType?.toUpperCase() || '-'}
                          </TableCell>
                          <TableCell>{ins.policyNumber || '-'}</TableCell>
                          <TableCell>{ins.subscriberName || '-'}</TableCell>
                          <TableCell>
                            {ins.effectiveDate
                              ? dayjs(ins.effectiveDate).format('MM/DD/YYYY')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {ins.expirationDate
                              ? dayjs(ins.expirationDate).format('MM/DD/YYYY')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                              }}
                            >
                              <Chip
                                label={ins.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={ins.isActive ? 'success' : 'default'}
                                sx={{ fontWeight: 500, width: 'fit-content' }}
                              />
                              <Chip
                                label={
                                  ins.verificationStatus
                                    ? ins.verificationStatus
                                        .charAt(0)
                                        .toUpperCase() +
                                      ins.verificationStatus.slice(1)
                                    : 'Pending'
                                }
                                size="small"
                                color={
                                  ins.verificationStatus === 'verified'
                                    ? 'success'
                                    : ins.verificationStatus === 'failed'
                                    ? 'error'
                                    : 'default'
                                }
                                variant="outlined"
                                sx={{ fontWeight: 500, width: 'fit-content' }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleInsuranceMenuOpen(e, ins)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Allergies Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Allergies
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAllergyAdd}
                >
                  Add Allergy
                </Button>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{ mb: 3, alignItems: 'flex-end' }}
              >
                <Grid size={9}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search allergies..."
                    value={allergySearch}
                    onChange={(e) => setAllergySearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: allergySearch && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setAllergySearch('')}
                            edge="end"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="allergy-severity-filter-label">
                      Severity
                    </InputLabel>
                    <Select
                      labelId="allergy-severity-filter-label"
                      value={allergySeverityFilter}
                      label="Severity"
                      onChange={(e) => setAllergySeverityFilter(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="mild">Mild</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="severe">Severe</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid size={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="allergy-status-filter-label">Status</InputLabel>
                    <Select
                      labelId="allergy-status-filter-label"
                      value={allergyStatusFilter}
                      label="Status"
                      onChange={(e) => setAllergyStatusFilter(e.target.value)}
                    >
                      <MenuItem value=""><em>All</em></MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                <Grid size={4}>
                  <DatePicker
                    label="Documented From"
                    value={allergyDocumentedDateStart}
                    onChange={(newValue) =>
                      setAllergyDocumentedDateStart(newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                    maxDate={allergyDocumentedDateEnd || undefined}
                  />
                </Grid>
                <Grid size={4}>
                  <DatePicker
                    label="Documented To"
                    value={allergyDocumentedDateEnd}
                    onChange={(newValue) =>
                      setAllergyDocumentedDateEnd(newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                    minDate={allergyDocumentedDateStart || undefined}
                  />
                </Grid>
                <Grid size={4}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                  >
                    <Tooltip title="Clear Filters">
                      <span>
                        <IconButton
                          onClick={handleResetAllergyFilters}
                          disabled={!hasAllergyFilters}
                          color="primary"
                        >
                          <FilterAltOff />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Refresh">
                      <span>
                        <IconButton onClick={fetchAllergies} color="primary">
                          <RefreshIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>

              {filteredAllergies.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No active allergies documented.
                </Typography>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Allergen
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Reaction
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Severity
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Documented By
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Documented Date
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAllergies.map((all) => (
                        <TableRow
                          key={all._id || all.id}
                          hover
                          sx={{
                            '&:hover': { backgroundColor: 'action.hover' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {all.allergen}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 300 }}>
                              {all.reaction || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                all.severity?.charAt(0).toUpperCase() +
                                  all.severity?.slice(1) || 'Unknown'
                              }
                              size="small"
                              color={
                                all.severity === 'severe'
                                  ? 'error'
                                  : all.severity === 'moderate'
                                  ? 'warning'
                                  : 'default'
                              }
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            {all.documentedBy
                              ? `${all.documentedBy.firstName || ''} ${
                                  all.documentedBy.lastName || ''
                                }`.trim() || '-'
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {all.documentedDate
                              ? dayjs(all.documentedDate).format('MM/DD/YYYY')
                              : '-'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleAllergyMenuOpen(e, all)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Vitals Tab */}
          {tabValue === 3 && (
            <Box sx={{ p: 3 }}>
              <PatientVitalsTab patientId={patientId} />
            </Box>
          )}

          {/* Clinical Notes Tab */}
          {tabValue === 4 && (
            <Box sx={{ p: 3 }}>
              <PatientNotesTab patientId={patientId} />
            </Box>
          )}

          {/* Documents Tab */}
          {tabValue === 5 && (
            <Box sx={{ p: 3 }}>
              <PatientDocumentsTab patientId={patientId} />
            </Box>
          )}
        </Paper>

        {/* Insurance Dialog */}
        <InsuranceDialog
          open={insuranceDialog.open}
          onClose={() =>
            setInsuranceDialog({ open: false, mode: 'add', insurance: null })
          }
          patientId={patientId}
          insurance={insuranceDialog.insurance}
          mode={insuranceDialog.mode}
          companies={allCompanies.companies}
          existingInsurances={insurances}
          onSave={async () => {
            await fetchInsurancesAndCompanies();
            setInsuranceDialog({ open: false, mode: 'add', insurance: null });
          }}
          saving={insuranceSaving}
          setSaving={setInsuranceSaving}
        />

        {/* Allergy Dialog */}
        <AllergyDialog
          open={allergyDialog.open}
          onClose={() =>
            setAllergyDialog({ open: false, mode: 'add', allergy: null })
          }
          patientId={patientId}
          allergy={allergyDialog.allergy}
          mode={allergyDialog.mode}
          onSave={async () => {
            await fetchAllergies();
            setAllergyDialog({ open: false, mode: 'add', allergy: null });
          }}
          saving={allergySaving}
          setSaving={setAllergySaving}
        />

        {/* Insurance Menu */}
        <Menu
          anchorEl={insuranceMenu.anchorEl}
          open={Boolean(insuranceMenu.anchorEl)}
          onClose={handleInsuranceMenuClose}
          TransitionProps={{ onExited: handleInsuranceMenuExited }}
        >
          <MuiMenuItem
            onClick={() => {
              handleInsuranceMenuClose();
              navigate(
                `/patients/${patientId}/insurance/${
                  insuranceMenu.insurance?._id || insuranceMenu.insurance?.id
                }`
              );
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => handleInsuranceEdit(insuranceMenu.insurance)}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MuiMenuItem>
          {insuranceMenu.insurance?.isActive ? (
            <MuiMenuItem
              onClick={() => handleInsuranceDeactivate(insuranceMenu.insurance)}
            >
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Deactivate</ListItemText>
            </MuiMenuItem>
          ) : (
            <MuiMenuItem
              onClick={() => handleInsuranceActivate(insuranceMenu.insurance)}
            >
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </MuiMenuItem>
          )}
          <MuiMenuItem
            onClick={() => handleInsuranceDelete(insuranceMenu.insurance)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MuiMenuItem>
        </Menu>

        {/* Allergy Menu */}
        <Menu
          anchorEl={allergyMenu.anchorEl}
          open={Boolean(allergyMenu.anchorEl)}
          onClose={handleAllergyMenuClose}
          TransitionProps={{ onExited: handleAllergyMenuExited }}
        >
          <MuiMenuItem
            onClick={() => {
              handleAllergyMenuClose();
              navigate(
                `/patients/${patientId}/allergies/${
                  allergyMenu.allergy?._id || allergyMenu.allergy?.id
                }`
              );
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MuiMenuItem>
          <MuiMenuItem onClick={() => handleAllergyEdit(allergyMenu.allergy)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => handleAllergyDelete(allergyMenu.allergy)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MuiMenuItem>
        </Menu>

        {/* Insurance Delete Confirmation */}
        <ConfirmationDialog
          open={insuranceDeleteDialog.open}
          onClose={() =>
            setInsuranceDeleteDialog({ open: false, insurance: null })
          }
          onConfirm={async () => {
            setDeleteLoading(true);
            try {
              await patientService.deletePatientInsurance(
                patientId,
                insuranceDeleteDialog.insurance._id ||
                  insuranceDeleteDialog.insurance.id
              );
              showSnackbar('Insurance deleted successfully', 'success');
              setInsuranceDeleteDialog({ open: false, insurance: null });
              await fetchInsurancesAndCompanies();
            } catch (err) {
              showSnackbar(
                err.response?.data?.error?.message ||
                  err.response?.data?.message ||
                  'Failed to delete insurance',
                'error'
              );
            } finally {
              setDeleteLoading(false);
            }
          }}
          title="Delete Insurance"
          message={`Are you sure you want to delete this insurance record?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          loading={deleteLoading}
        />

        {/* Allergy Delete Confirmation */}
        <ConfirmationDialog
          open={allergyDeleteDialog.open}
          onClose={() => setAllergyDeleteDialog({ open: false, allergy: null })}
          onConfirm={async () => {
            setDeleteLoading(true);
            try {
              await patientService.deletePatientAllergy(
                patientId,
                allergyDeleteDialog.allergy._id ||
                  allergyDeleteDialog.allergy.id
              );
              showSnackbar('Allergy deleted successfully', 'success');
              setAllergyDeleteDialog({ open: false, allergy: null });
              await fetchAllergies();
            } catch (err) {
              showSnackbar(
                err.response?.data?.error?.message ||
                  err.response?.data?.message ||
                  'Failed to delete allergy',
                'error'
              );
            } finally {
              setDeleteLoading(false);
            }
          }}
          title="Delete Allergy"
          message={`Are you sure you want to delete this allergy record?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="error"
          loading={deleteLoading}
        />
      </Box>
    </LocalizationProvider>
  );
};

// Insurance Dialog Component
const InsuranceDialog = ({
  open,
  onClose,
  patientId,
  insurance,
  mode,
  companies,
  existingInsurances = [],
  onSave,
  saving,
  setSaving,
}) => {
  const { showSnackbar } = useSnackbar();

  // Memoize today's date to prevent creating new dayjs objects on every render
  const today = useMemo(() => dayjs(), []);

  // OCR state
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [cardPreview, setCardPreview] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [showOcrText, setShowOcrText] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: insurance || {
      insuranceCompanyId: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      subscriberDateOfBirth: null,
      relationshipToPatient: 'self',
      insuranceType: 'primary',
      effectiveDate: null,
      expirationDate: null,
      copayAmount: '',
      deductibleAmount: '',
      isActive: true,
      autoVerify: true,
      verificationStatus: 'pending',
      verificationDate: null,
      notes: '',
    },
  });

  const previousInsuranceIdRef = useRef(null);
  const previousOpenRef = useRef(false);

  // Reset form when dialog opens/closes or insurance changes
  useEffect(() => {
    if (!open) {
      // Dialog closed - reset everything
      previousInsuranceIdRef.current = null;
      previousOpenRef.current = false;
      setCardPreview(null);
      setOcrText(null);
      setShowOcrText(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Get stable ID value
    const currentInsuranceId = insurance?._id || insurance?.id || null;

    // Dialog opened
    if (!previousOpenRef.current) {
      previousOpenRef.current = true;
    }

    if (insurance && currentInsuranceId) {
      if (previousInsuranceIdRef.current === currentInsuranceId) {
        return; // Same insurance, skip reset
      }
      previousInsuranceIdRef.current = currentInsuranceId;

      // Handle insuranceCompanyId - it might be populated or just an ID
      const companyId =
        insurance.insuranceCompanyId?._id ||
        insurance.insuranceCompanyId?.id ||
        insurance.insuranceCompanyId;

      reset({
        ...insurance,
        insuranceCompanyId: companyId || '',
        subscriberDateOfBirth: insurance.subscriberDateOfBirth
          ? dayjs(insurance.subscriberDateOfBirth)
          : null,
        effectiveDate: insurance.effectiveDate
          ? dayjs(insurance.effectiveDate)
          : null,
        expirationDate: insurance.expirationDate
          ? dayjs(insurance.expirationDate)
          : null,
        verificationDate: insurance.verificationDate
          ? dayjs(insurance.verificationDate)
          : null,
      });
    } else {
      // Add mode - check if we already reset
      if (previousInsuranceIdRef.current === null) {
        return; // Already reset to empty
      }
      previousInsuranceIdRef.current = null;

      reset({
        insuranceCompanyId: '',
        policyNumber: '',
        groupNumber: '',
        subscriberName: '',
        subscriberDateOfBirth: null,
        relationshipToPatient: 'self',
        insuranceType: 'primary',
        effectiveDate: null,
        expirationDate: null,
        copayAmount: '',
        deductibleAmount: '',
        isActive: true,
        autoVerify: true,
        verificationStatus: 'pending',
        verificationDate: null,
        notes: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, insurance?._id, insurance?.id]);

  // Handle insurance card scan
  const handleInsuranceCardScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar(
        'Please upload a valid image file (JPEG, PNG, or WebP)',
        'error'
      );
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('Image file size must be less than 10MB', 'error');
      return;
    }

    try {
      setOcrProcessing(true);
      setOcrProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Extract text using OCR with progress tracking
      const extractedText = await extractTextFromImage(file, (progress) => {
        setOcrProgress(Math.round(progress * 100));
      });

      // Store OCR text for debugging
      setOcrText(extractedText);

      if (!extractedText || extractedText.trim().length < 10) {
        showSnackbar(
          'Could not extract text from image. Please ensure the image is clear and try again.',
          'warning'
        );
        setOcrProcessing(false);
        setOcrProgress(0);
        setOcrText(null);
        return;
      }

      // Parse insurance card data
      const parsedData = parseInsuranceCard(extractedText);

      // Auto-populate form fields - only populate if field is currently empty
      const currentValues = watch();
      const updatedValues = {};
      const extractedFields = [];

      if (parsedData.subscriberName && !currentValues.subscriberName) {
        updatedValues.subscriberName = parsedData.subscriberName;
        setValue('subscriberName', parsedData.subscriberName);
        extractedFields.push('Subscriber Name');
      }

      if (parsedData.policyNumber && !currentValues.policyNumber) {
        updatedValues.policyNumber = parsedData.policyNumber;
        setValue('policyNumber', parsedData.policyNumber);
        extractedFields.push('Policy Number');
      }

      if (parsedData.groupNumber && !currentValues.groupNumber) {
        updatedValues.groupNumber = parsedData.groupNumber;
        setValue('groupNumber', parsedData.groupNumber);
        extractedFields.push('Group Number');
      }

      if (
        parsedData.subscriberDateOfBirth &&
        !currentValues.subscriberDateOfBirth
      ) {
        updatedValues.subscriberDateOfBirth = dayjs(
          parsedData.subscriberDateOfBirth
        );
        setValue(
          'subscriberDateOfBirth',
          dayjs(parsedData.subscriberDateOfBirth)
        );
        extractedFields.push('Subscriber Date of Birth');
      }

      if (parsedData.effectiveDate && !currentValues.effectiveDate) {
        updatedValues.effectiveDate = dayjs(parsedData.effectiveDate);
        setValue('effectiveDate', dayjs(parsedData.effectiveDate));
        extractedFields.push('Effective Date');
      }

      if (parsedData.expirationDate && !currentValues.expirationDate) {
        updatedValues.expirationDate = dayjs(parsedData.expirationDate);
        setValue('expirationDate', dayjs(parsedData.expirationDate));
        extractedFields.push('Expiration Date');
      }

      // Try to match insurance company name
      if (
        parsedData.insuranceCompanyName &&
        !currentValues.insuranceCompanyId
      ) {
        const matchedCompany = companies.find(
          (company) =>
            company.name
              .toLowerCase()
              .includes(parsedData.insuranceCompanyName.toLowerCase()) ||
            parsedData.insuranceCompanyName
              .toLowerCase()
              .includes(company.name.toLowerCase())
        );
        if (matchedCompany) {
          updatedValues.insuranceCompanyId =
            matchedCompany._id || matchedCompany.id;
          setValue(
            'insuranceCompanyId',
            matchedCompany._id || matchedCompany.id
          );
          extractedFields.push('Insurance Company');
        }
      }

      if (extractedFields.length > 0) {
        showSnackbar(
          `Successfully extracted ${
            extractedFields.length
          } field(s): ${extractedFields.join(
            ', '
          )}. Please review and complete remaining fields.`,
          'success'
        );
      } else {
        showSnackbar(
          'Text extracted but could not parse insurance information. Please check the image quality and try again, or enter information manually.',
          'warning'
        );
        // Log OCR text for debugging
        console.log('OCR Text (for debugging):', extractedText);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      showSnackbar(
        error.message ||
          'Failed to process insurance card. Please try again or enter information manually.',
        'error'
      );
    } finally {
      setOcrProcessing(false);
      setOcrProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        patientId,
        subscriberDateOfBirth: data.subscriberDateOfBirth
          ? dayjs(data.subscriberDateOfBirth).toISOString()
          : undefined,
        effectiveDate: data.effectiveDate
          ? dayjs(data.effectiveDate).toISOString()
          : undefined,
        expirationDate: data.expirationDate
          ? dayjs(data.expirationDate).toISOString()
          : undefined,
        copayAmount: data.copayAmount
          ? parseFloat(data.copayAmount)
          : undefined,
        deductibleAmount: data.deductibleAmount
          ? parseFloat(data.deductibleAmount)
          : undefined,
        verificationDate: data.verificationDate
          ? dayjs(data.verificationDate).toISOString()
          : undefined,
      };

      if (mode === 'add') {
        await patientService.createPatientInsurance(patientId, payload);
        showSnackbar('Insurance added successfully', 'success');
        // Reset form to default values after successful add
        reset({
          insuranceCompanyId: '',
          policyNumber: '',
          groupNumber: '',
          subscriberName: '',
          subscriberDateOfBirth: null,
          relationshipToPatient: 'self',
          insuranceType: 'primary',
          effectiveDate: null,
          expirationDate: null,
          copayAmount: '',
          deductibleAmount: '',
          isActive: true,
          autoVerify: true,
          verificationStatus: 'pending',
          verificationDate: null,
          notes: '',
        });
        // Reset OCR-related state
        setCardPreview(null);
        setOcrText(null);
        setShowOcrText(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        await patientService.updatePatientInsurance(
          patientId,
          insurance._id || insurance.id,
          payload
        );
        showSnackbar('Insurance updated successfully', 'success');
      }
      await onSave();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          `Failed to ${mode === 'add' ? 'add' : 'update'} insurance`,
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // Watch form values for cross-field validation
  const effectiveDateValue = watch('effectiveDate');
  const expirationDateValue = watch('expirationDate');
  const insuranceTypeValue = watch('insuranceType');

  // Check for duplicate insurance type and all three types already present
  const validateInsuranceType = (value) => {
    if (mode === 'add' && value) {
      const activeInsurances = existingInsurances.filter((ins) => ins.isActive);
      const activeTypes = activeInsurances.map((ins) =>
        (ins.insuranceType || '').toLowerCase()
      );

      // Check if all three types are already present
      const hasPrimary = activeTypes.includes('primary');
      const hasSecondary = activeTypes.includes('secondary');
      const hasTertiary = activeTypes.includes('tertiary');
      const allTypesPresent = hasPrimary && hasSecondary && hasTertiary;

      if (allTypesPresent) {
        return 'Patient already has all three insurance types (Primary, Secondary, and Tertiary). Please deactivate an existing insurance before adding a new one, or update an existing insurance instead.';
      }

      // Check if the selected type already exists
      const selectedType = value.toLowerCase();
      const hasSelectedType = activeTypes.includes(selectedType);

      if (hasSelectedType) {
        const typeName =
          selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
        return `Patient already has an active ${typeName} insurance. Please deactivate it first or select a different type.`;
      }
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="span">
            {mode === 'add' ? 'Add Insurance' : 'Edit Insurance'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Insurance Card OCR Scanner */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleInsuranceCardScan}
              style={{ display: 'none' }}
              id="insurance-card-upload"
              disabled={ocrProcessing}
            />
            <label htmlFor="insurance-card-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={
                  ocrProcessing ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CameraAltIcon />
                  )
                }
                disabled={ocrProcessing || saving}
                sx={{ mb: 1 }}
              >
                {ocrProcessing
                  ? 'Scanning Insurance Card...'
                  : 'Scan Insurance Card (OCR)'}
              </Button>
            </label>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: 'text.secondary' }}
            >
              Upload a clear photo of the insurance card to auto-populate policy
              information
            </Typography>
            {ocrProcessing && (
              <Box sx={{ mt: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Processing image...{' '}
                  {ocrProgress > 0
                    ? `${ocrProgress}%`
                    : 'This may take a few moments.'}
                </Typography>
              </Box>
            )}
            {cardPreview && !ocrProcessing && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={cardPreview}
                  alt="Insurance card preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setCardPreview(null);
                      setOcrText(null);
                      setShowOcrText(false);
                    }}
                  >
                    Remove Preview
                  </Button>
                  {ocrText && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setShowOcrText(!showOcrText)}
                    >
                      {showOcrText ? 'Hide' : 'Show'} OCR Text
                    </Button>
                  )}
                </Box>
                {showOcrText && ocrText && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      maxHeight: '200px',
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      display="block"
                      sx={{ mb: 1 }}
                    >
                      Extracted OCR Text (for debugging):
                    </Typography>
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {ocrText}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 6 }}>
              <FormControl fullWidth error={!!errors.insuranceCompanyId}>
                <InputLabel>Insurance Company *</InputLabel>
                <Controller
                  name="insuranceCompanyId"
                  control={control}
                  rules={{ required: 'Insurance company is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Insurance Company">
                      {companies.map((company) => (
                        <MenuItem
                          key={company._id || company.id}
                          value={company._id || company.id}
                        >
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.insuranceCompanyId && (
                  <FormHelperText>
                    {errors.insuranceCompanyId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Policy Number *"
                {...register('policyNumber', {
                  required: 'Policy number is required',
                  minLength: {
                    value: 5,
                    message: 'Policy number must be at least 5 characters',
                  },
                  maxLength: {
                    value: 30,
                    message: 'Policy number must not exceed 30 characters',
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message:
                      'Policy number must be alphanumeric only (no special symbols)',
                  },
                })}
                error={!!errors.policyNumber}
                helperText={errors.policyNumber?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Group Number"
                {...register('groupNumber', {
                  maxLength: {
                    value: 30,
                    message: 'Group number must not exceed 30 characters',
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]*$/,
                    message: 'Group number must be alphanumeric only',
                  },
                })}
                error={!!errors.groupNumber}
                helperText={errors.groupNumber?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Subscriber Name *"
                {...register('subscriberName', {
                  required: 'Subscriber name is required',
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message:
                      'Subscriber name can only contain letters, hyphens, and apostrophes',
                  },
                })}
                error={!!errors.subscriberName}
                helperText={errors.subscriberName?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="subscriberDateOfBirth"
                control={control}
                rules={{
                  required: 'Subscriber date of birth is required',
                  validate: (value) => {
                    if (!value) return true;
                    const dob = dayjs(value);
                    if (dob.isAfter(today)) {
                      return 'Date of birth must be in the past';
                    }
                    // Calculate age accurately
                    const age = today.diff(dob, 'year', true);
                    if (age >= 120) {
                      return 'Subscriber age must be less than 120 years';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Subscriber Date of Birth *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.subscriberDateOfBirth,
                        helperText: errors.subscriberDateOfBirth?.message,
                      },
                    }}
                    maxDate={today}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.relationshipToPatient}>
                <InputLabel>Relationship to Patient *</InputLabel>
                <Controller
                  name="relationshipToPatient"
                  control={control}
                  rules={{ required: 'Relationship to patient is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Relationship to Patient *">
                      <MenuItem value="self">Self</MenuItem>
                      <MenuItem value="spouse">Spouse</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
                {errors.relationshipToPatient && (
                  <FormHelperText>
                    {errors.relationshipToPatient.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.insuranceType}>
                <InputLabel>Insurance Type *</InputLabel>
                <Controller
                  name="insuranceType"
                  control={control}
                  rules={{
                    required: 'Insurance type is required',
                    validate: validateInsuranceType,
                  }}
                  render={({ field }) => (
                    <Select {...field} label="Insurance Type *">
                      <MenuItem value="primary">Primary</MenuItem>
                      <MenuItem value="secondary">Secondary</MenuItem>
                      <MenuItem value="tertiary">Tertiary</MenuItem>
                    </Select>
                  )}
                />
                {errors.insuranceType && (
                  <FormHelperText>
                    {errors.insuranceType.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="effectiveDate"
                control={control}
                rules={{
                  required: 'Effective date is required',
                  validate: (value) => {
                    if (!value) return true;
                    if (
                      expirationDateValue &&
                      dayjs(value).isAfter(dayjs(expirationDateValue))
                    ) {
                      return 'Effective date must be before expiration date';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Effective Date *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.effectiveDate,
                        helperText: errors.effectiveDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return true; // Optional
                    if (
                      effectiveDateValue &&
                      dayjs(value).isBefore(dayjs(effectiveDateValue))
                    ) {
                      return 'Expiration date must be after effective date';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Expiration Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expirationDate,
                        helperText: errors.expirationDate?.message,
                      },
                    }}
                    minDate={
                      effectiveDateValue ? dayjs(effectiveDateValue) : undefined
                    }
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Copay Amount"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                {...register('copayAmount', {
                  validate: (value) => {
                    if (!value || value === '') return true; // Optional
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0) {
                      return 'Copay amount must be a positive number';
                    }
                    if (num > 10000) {
                      return 'Copay amount must not exceed $10,000';
                    }
                    // Check decimal places
                    const parts = value.toString().split('.');
                    if (parts.length > 1 && parts[1].length > 2) {
                      return 'Copay amount can have maximum 2 decimal places';
                    }
                    return true;
                  },
                })}
                error={!!errors.copayAmount}
                helperText={errors.copayAmount?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Deductible Amount"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                {...register('deductibleAmount', {
                  validate: (value) => {
                    if (!value || value === '') return true; // Optional
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0) {
                      return 'Deductible amount must be a positive number';
                    }
                    if (num > 1000000) {
                      return 'Deductible amount must not exceed $1,000,000';
                    }
                    // Check decimal places
                    const parts = value.toString().split('.');
                    if (parts.length > 1 && parts[1].length > 2) {
                      return 'Deductible amount can have maximum 2 decimal places';
                    }
                    return true;
                  },
                })}
                error={!!errors.deductibleAmount}
                helperText={errors.deductibleAmount?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.verificationStatus}>
                <InputLabel>Verification Status</InputLabel>
                <Controller
                  name="verificationStatus"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Verification Status">
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Controller
                name="verificationDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Verification Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.verificationDate,
                        helperText: errors.verificationDate?.message,
                      },
                    }}
                    maxDate={today}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value ?? true} />
                    )}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="autoVerify"
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value ?? true} />
                    )}
                  />
                }
                label="Auto Verify"
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                {...register('notes', {
                  maxLength: {
                    value: 500,
                    message: 'Notes must not exceed 500 characters',
                  },
                })}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Allergy Dialog Component
const AllergyDialog = ({
  open,
  onClose,
  patientId,
  allergy,
  mode,
  onSave,
  saving,
  setSaving,
}) => {
  const { showSnackbar } = useSnackbar();

  // Memoize today's date to prevent creating new dayjs objects on every render
  const today = useMemo(() => dayjs(), []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: allergy || {
      allergen: '',
      reaction: '',
      severity: 'mild',
      isActive: true,
      documentedDate: null,
    },
  });

  const previousAllergyIdRef = useRef(null);
  const previousOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      // Dialog closed - reset refs
      previousAllergyIdRef.current = null;
      previousOpenRef.current = false;
      return;
    }

    // Get stable ID value
    const currentAllergyId = allergy?._id || allergy?.id || null;

    // Dialog opened
    if (!previousOpenRef.current) {
      previousOpenRef.current = true;
    }

    if (allergy && currentAllergyId) {
      if (previousAllergyIdRef.current === currentAllergyId) {
        return; // Same allergy, skip reset
      }
      previousAllergyIdRef.current = currentAllergyId;

      reset({
        ...allergy,
        documentedDate: allergy.documentedDate
          ? dayjs(allergy.documentedDate)
          : null,
      });
    } else {
      if (previousAllergyIdRef.current === null) {
        return; // Already reset to empty
      }
      previousAllergyIdRef.current = null;

      reset({
        allergen: '',
        reaction: '',
        severity: 'mild',
        isActive: true,
        documentedDate: dayjs(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, allergy?._id, allergy?.id]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        patientId,
        documentedDate: data.documentedDate
          ? dayjs(data.documentedDate).toISOString()
          : dayjs().toISOString(),
      };

      if (mode === 'add') {
        await patientService.createPatientAllergy(patientId, payload);
        showSnackbar('Allergy added successfully', 'success');
        // Reset form after successful add
        previousAllergyIdRef.current = null;
        reset({
          allergen: '',
          reaction: '',
          severity: 'mild',
          isActive: true,
          documentedDate: dayjs(),
        });
      } else {
        await patientService.updatePatientAllergy(
          patientId,
          allergy._id || allergy.id,
          payload
        );
        showSnackbar('Allergy updated successfully', 'success');
      }
      await onSave();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          `Failed to ${mode === 'add' ? 'add' : 'update'} allergy`,
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add Allergy' : 'Edit Allergy'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Allergen *"
                {...register('allergen', { required: 'Allergen is required' })}
                error={!!errors.allergen}
                helperText={errors.allergen?.message}
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.severity}>
                <InputLabel>Severity</InputLabel>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Severity">
                      <MenuItem value="mild">Mild</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="severe">Severe</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Controller
                name="documentedDate"
                control={control}
                rules={{ required: 'Documented date is required' }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Documented Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.documentedDate,
                        helperText: errors.documentedDate?.message,
                      },
                    }}
                    maxDate={today}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Reaction *"
                multiline
                rows={3}
                {...register('reaction', { required: 'Reaction is required' })}
                error={!!errors.reaction}
                helperText={errors.reaction?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {saving ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ViewPatientPage;
