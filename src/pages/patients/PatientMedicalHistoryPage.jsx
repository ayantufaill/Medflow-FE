import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Timeline as TimelineIcon,
  LocalHospital as AllergyIcon,
  Favorite as VitalIcon,
  Medication as PrescriptionIcon,
  Science as LabIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { clinicalNoteService } from '../../services/clinical-note.service';
import { patientService } from '../../services/patient.service';

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [patient, setPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    includeAllergies: true,
    includeVitals: true,
    includePrescriptions: true,
    includeLabOrders: true,
    includeLabResults: true,
    includeDocuments: true,
    includeNotes: true,
    limit: 50,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [historyData, patientData] = await Promise.all([
        clinicalNoteService.getPatientMedicalHistory(patientId, {
          startDate: filters.startDate ? dayjs(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? dayjs(filters.endDate).toISOString() : undefined,
          includeAllergies: filters.includeAllergies,
          includeVitals: filters.includeVitals,
          includePrescriptions: filters.includePrescriptions,
          includeLabOrders: filters.includeLabOrders,
          includeLabResults: filters.includeLabResults,
          includeDocuments: filters.includeDocuments,
          includeNotes: filters.includeNotes,
          limit: filters.limit,
        }),
        patientService.getPatientById(patientId),
      ]);
      setMedicalHistory(historyData);
      setPatient(patientData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load medical history'
      );
      showSnackbar('Failed to load medical history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const historyData = await clinicalNoteService.getPatientMedicalHistory(patientId, {
        startDate: filters.startDate ? dayjs(filters.startDate).toISOString() : undefined,
        endDate: filters.endDate ? dayjs(filters.endDate).toISOString() : undefined,
        includeAllergies: filters.includeAllergies,
        includeVitals: filters.includeVitals,
        includePrescriptions: filters.includePrescriptions,
        includeLabOrders: filters.includeLabOrders,
        includeLabResults: filters.includeLabResults,
        includeDocuments: filters.includeDocuments,
        includeNotes: filters.includeNotes,
        limit: filters.limit,
      });
      setMedicalHistory(historyData);
      showSnackbar('Medical history refreshed', 'success');
    } catch (err) {
      showSnackbar('Failed to refresh medical history', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      includeAllergies: true,
      includeVitals: true,
      includePrescriptions: true,
      includeLabOrders: true,
      includeLabResults: true,
      includeDocuments: true,
      includeNotes: true,
      limit: 50,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MMM DD, YYYY h:mm A');
  };

  const getTypeIcon = (type) => {
    const icons = {
      allergy: <AllergyIcon fontSize="small" />,
      vital: <VitalIcon fontSize="small" />,
      prescription: <PrescriptionIcon fontSize="small" />,
      labOrder: <LabIcon fontSize="small" />,
      labResult: <LabIcon fontSize="small" />,
      document: <DocumentIcon fontSize="small" />,
      clinicalNote: <NoteIcon fontSize="small" />,
    };
    return icons[type] || <NoteIcon fontSize="small" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      allergy: 'error',
      vital: 'success',
      prescription: 'primary',
      labOrder: 'info',
      labResult: 'warning',
      document: 'secondary',
      clinicalNote: 'default',
    };
    return colors[type] || 'default';
  };

  const getTypeLabel = (type) => {
    const labels = {
      allergy: 'Allergy',
      vital: 'Vital Signs',
      prescription: 'Prescription',
      labOrder: 'Lab Order',
      labResult: 'Lab Result',
      document: 'Document',
      clinicalNote: 'Clinical Note',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !medicalHistory) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/patients/${patientId}`)}
          sx={{ mb: 2 }}
        >
          Back to Patient
        </Button>
        <Alert severity="error">{error || 'Medical history not found'}</Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/patients/${patientId}`)}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Medical History
              </Typography>
              {patient && (
                <Typography variant="body1" color="text.secondary">
                  {patient.firstName} {patient.lastName} - DOB: {formatDate(patient.dateOfBirth)}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filter Medical History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(newValue) => setFilters({ ...filters, startDate: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(newValue) => setFilters({ ...filters, endDate: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Include Sections:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="Allergies"
                    color={filters.includeAllergies ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeAllergies: !filters.includeAllergies })}
                    variant={filters.includeAllergies ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Vitals"
                    color={filters.includeVitals ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeVitals: !filters.includeVitals })}
                    variant={filters.includeVitals ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Prescriptions"
                    color={filters.includePrescriptions ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includePrescriptions: !filters.includePrescriptions })}
                    variant={filters.includePrescriptions ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Lab Orders"
                    color={filters.includeLabOrders ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeLabOrders: !filters.includeLabOrders })}
                    variant={filters.includeLabOrders ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Lab Results"
                    color={filters.includeLabResults ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeLabResults: !filters.includeLabResults })}
                    variant={filters.includeLabResults ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Documents"
                    color={filters.includeDocuments ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeDocuments: !filters.includeDocuments })}
                    variant={filters.includeDocuments ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="Clinical Notes"
                    color={filters.includeNotes ? 'primary' : 'default'}
                    onClick={() => setFilters({ ...filters, includeNotes: !filters.includeNotes })}
                    variant={filters.includeNotes ? 'filled' : 'outlined'}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={handleResetFilters}>
                    Reset
                  </Button>
                  <Button variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab 
                label="Timeline" 
                icon={<TimelineIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={
                  <Badge badgeContent={medicalHistory.summary?.totalAllergies || 0} color="error">
                    Allergies
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={medicalHistory.summary?.totalVitals || 0} color="success">
                    Vitals
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={medicalHistory.summary?.totalPrescriptions || 0} color="primary">
                    Medications
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={medicalHistory.summary?.totalLabResults || 0} color="warning">
                    Labs
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={medicalHistory.summary?.totalClinicalNotes || 0} color="info">
                    Notes
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <TimelineView timeline={medicalHistory.timeline || []} formatDateTime={formatDateTime} getTypeIcon={getTypeIcon} getTypeColor={getTypeColor} getTypeLabel={getTypeLabel} />
            )}
            {tabValue === 1 && (
              <AllergiesView allergies={medicalHistory.allergies || []} formatDate={formatDate} />
            )}
            {tabValue === 2 && (
              <VitalsView vitals={medicalHistory.vitals || []} formatDateTime={formatDateTime} />
            )}
            {tabValue === 3 && (
              <PrescriptionsView prescriptions={medicalHistory.prescriptions || []} formatDate={formatDate} />
            )}
            {tabValue === 4 && (
              <LabsView 
                labOrders={medicalHistory.labOrders || []} 
                labResults={medicalHistory.labResults || []} 
                formatDate={formatDate} 
                formatDateTime={formatDateTime}
              />
            )}
            {tabValue === 5 && (
              <ClinicalNotesView notes={medicalHistory.clinicalNotes || []} formatDateTime={formatDateTime} navigate={navigate} />
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Allergies
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalAllergies || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Vital Signs
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalVitals || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Prescriptions
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalPrescriptions || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Lab Results
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalLabResults || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Documents
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalDocuments || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Clinical Notes
                  </Typography>
                  <Typography variant="h5">
                    {medicalHistory.summary?.totalClinicalNotes || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

const TimelineView = ({ timeline, formatDateTime, getTypeIcon, getTypeColor, getTypeLabel }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <Alert severity="info">
        No timeline data available for the selected filters.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chronological Timeline
      </Typography>
      <List>
        {timeline.map((item, index) => (
          <ListItem key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 2, borderBottom: index < timeline.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(item.date)}
              </Typography>
            </Box>
            <Chip
              icon={getTypeIcon(item.type)}
              label={getTypeLabel(item.type)}
              color={getTypeColor(item.type)}
              size="small"
              sx={{ minWidth: 140 }}
            />
            <Box sx={{ flex: 1 }}>
              <TimelineItemContent item={item} />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const TimelineItemContent = ({ item }) => {
  const { type, data } = item;

  switch (type) {
    case 'allergy':
      return (
        <Typography variant="body2">
          <strong>{data.allergen}</strong> - {data.reaction} (Severity: {data.severity})
        </Typography>
      );
    case 'vital':
      return (
        <Typography variant="body2">
          BP: {data.bloodPressureSystolic}/{data.bloodPressureDiastolic} | 
          Temp: {data.temperature}°F | 
          HR: {data.heartRate} bpm | 
          Weight: {data.weight} lbs
        </Typography>
      );
    case 'prescription':
      return (
        <Typography variant="body2">
          <strong>{data.medicationId?.name || 'Unknown'}</strong> - {data.dosage} 
          {data.status && ` (${data.status})`}
        </Typography>
      );
    case 'labOrder':
      return (
        <Typography variant="body2">
          <strong>Order #{data.orderNumber}</strong> - {data.testsRequested?.join(', ')} ({data.status})
        </Typography>
      );
    case 'labResult':
      return (
        <Typography variant="body2">
          <strong>{data.testName}</strong>: {data.resultValue} {data.units} ({data.status})
        </Typography>
      );
    case 'document':
      return (
        <Typography variant="body2">
          <strong>{data.documentName}</strong> ({data.documentType})
        </Typography>
      );
    case 'clinicalNote':
      return (
        <Typography variant="body2">
          {data.chiefComplaint || 'Clinical Note'} - 
          Dr. {data.providerId?.firstName} {data.providerId?.lastName}
          {data.isSigned && <Chip label="Signed" size="small" color="success" sx={{ ml: 1 }} />}
        </Typography>
      );
    default:
      return <Typography variant="body2">Unknown item type</Typography>;
  }
};

const AllergiesView = ({ allergies, formatDate }) => {
  if (!allergies || allergies.length === 0) {
    return <Alert severity="info">No allergies recorded.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Allergies ({allergies.length})
      </Typography>
      <Grid container spacing={2}>
        {allergies.map((allergy) => (
          <Grid item xs={12} md={6} key={allergy._id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" color="error.main">
                    {allergy.allergen}
                  </Typography>
                  <Chip 
                    label={allergy.severity} 
                    size="small" 
                    color={
                      allergy.severity === 'severe' ? 'error' :
                      allergy.severity === 'moderate' ? 'warning' : 'default'
                    }
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reaction: {allergy.reaction}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Documented: {formatDate(allergy.documentedDate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const VitalsView = ({ vitals, formatDateTime }) => {
  if (!vitals || vitals.length === 0) {
    return <Alert severity="info">No vital signs recorded.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vital Signs History ({vitals.length})
      </Typography>
      {vitals.map((vital, index) => (
        <Accordion key={vital._id || index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{formatDateTime(vital.recordedDate)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                <Typography variant="body1">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} mmHg</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">Temperature</Typography>
                <Typography variant="body1">{vital.temperature}°F</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                <Typography variant="body1">{vital.heartRate} bpm</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">Weight</Typography>
                <Typography variant="body1">{vital.weight} lbs</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">Height</Typography>
                <Typography variant="body1">{vital.height} in</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">O2 Saturation</Typography>
                <Typography variant="body1">{vital.oxygenSaturation}%</Typography>
              </Grid>
              {vital.notes && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Notes</Typography>
                  <Typography variant="body1">{vital.notes}</Typography>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

const PrescriptionsView = ({ prescriptions, formatDate }) => {
  if (!prescriptions || prescriptions.length === 0) {
    return <Alert severity="info">No prescriptions recorded.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Medication History ({prescriptions.length})
      </Typography>
      <Grid container spacing={2}>
        {prescriptions.map((prescription) => (
          <Grid item xs={12} key={prescription._id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6">
                      {prescription.medicationId?.name || 'Unknown Medication'}
                    </Typography>
                    {prescription.medicationId?.genericName && (
                      <Typography variant="body2" color="text.secondary">
                        Generic: {prescription.medicationId.genericName}
                      </Typography>
                    )}
                  </Box>
                  <Chip 
                    label={prescription.status} 
                    size="small" 
                    color={prescription.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Dosage</Typography>
                    <Typography variant="body1">{prescription.dosage}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Quantity</Typography>
                    <Typography variant="body1">{prescription.quantity}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Refills</Typography>
                    <Typography variant="body1">{prescription.refillsRemaining}/{prescription.refillsAllowed}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Prescribed</Typography>
                    <Typography variant="body1">{formatDate(prescription.prescribedDate)}</Typography>
                  </Grid>
                  {prescription.instructions && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Instructions</Typography>
                      <Typography variant="body1">{prescription.instructions}</Typography>
                    </Grid>
                  )}
                  {prescription.providerId && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Provider: Dr. {prescription.providerId.firstName} {prescription.providerId.lastName}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const LabsView = ({ labOrders, labResults, formatDate, formatDateTime }) => {
  if ((!labOrders || labOrders.length === 0) && (!labResults || labResults.length === 0)) {
    return <Alert severity="info">No lab orders or results recorded.</Alert>;
  }

  return (
    <Box>
      {labResults && labResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Lab Results ({labResults.length})
          </Typography>
          <Grid container spacing={2}>
            {labResults.map((result) => (
              <Grid item xs={12} md={6} key={result._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6">
                        {result.testName}
                      </Typography>
                      <Chip 
                        label={result.status} 
                        size="small" 
                        color={
                          result.status === 'critical' ? 'error' :
                          result.status === 'abnormal' ? 'warning' : 'success'
                        }
                      />
                    </Box>
                    <Typography variant="h5" color="primary.main" gutterBottom>
                      {result.resultValue} {result.units}
                    </Typography>
                    {result.normalRange && (
                      <Typography variant="body2" color="text.secondary">
                        Normal Range: {result.normalRange}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Result Date: {formatDateTime(result.resultDate)}
                    </Typography>
                    {result.providerNotes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Notes: {result.providerNotes}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {labOrders && labOrders.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Lab Orders ({labOrders.length})
          </Typography>
          {labOrders.map((order, index) => (
            <Accordion key={order._id || index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                  <Typography>Order #{order.orderNumber}</Typography>
                  <Chip label={order.status} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    {formatDate(order.orderedDate)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Tests Requested</Typography>
                    <Typography variant="body1">{order.testsRequested?.join(', ')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Priority</Typography>
                    <Typography variant="body1">{order.priority}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Lab Facility</Typography>
                    <Typography variant="body1">{order.labFacility || '-'}</Typography>
                  </Grid>
                  {order.instructions && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Instructions</Typography>
                      <Typography variant="body1">{order.instructions}</Typography>
                    </Grid>
                  )}
                  {order.providerId && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Ordered by: Dr. {order.providerId.firstName} {order.providerId.lastName}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

const ClinicalNotesView = ({ notes, formatDateTime, navigate }) => {
  if (!notes || notes.length === 0) {
    return <Alert severity="info">No clinical notes recorded.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Clinical Notes ({notes.length})
      </Typography>
      <Grid container spacing={2}>
        {notes.map((note) => (
          <Grid item xs={12} key={note._id}>
            <Card 
              variant="outlined" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 2,
                  borderColor: 'primary.main',
                }
              }}
              onClick={() => navigate(`/clinical-notes/${note._id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6">
                      {note.chiefComplaint || 'Clinical Note'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(note.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={note.noteType || 'SOAP'} 
                      size="small" 
                      variant="outlined"
                    />
                    {note.isSigned ? (
                      <Chip 
                        label="Signed" 
                        size="small" 
                        color="success"
                      />
                    ) : (
                      <Chip 
                        label="Draft" 
                        size="small" 
                        color="warning"
                      />
                    )}
                  </Box>
                </Box>
                {note.providerId && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Provider: Dr. {note.providerId.firstName} {note.providerId.lastName}
                    {note.providerId.specialty && ` - ${note.providerId.specialty}`}
                  </Typography>
                )}
                {note.subjective && (
                  <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                    {note.subjective.substring(0, 150)}{note.subjective.length > 150 && '...'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PatientMedicalHistoryPage;
