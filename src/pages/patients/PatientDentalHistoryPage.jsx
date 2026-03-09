import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Healing as DentalIcon,
  Build as ProcedureIcon,
  CalendarMonth as TimelineIcon,
  Image as XRayIcon,
  Note as NoteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { patientService } from '../../services/patient.service';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';

// Mock data for UI preview — replace with API when backend is ready
const MOCK_PROCEDURES = [
  { id: '1', date: '2025-01-15', procedure: 'D0120 - Periodic Oral Evaluation', tooth: '–', status: 'Completed', provider: 'Dr. Smith' },
  { id: '2', date: '2024-11-20', procedure: 'D1110 - Adult Prophy (Cleaning)', tooth: '–', status: 'Completed', provider: 'Dr. Smith' },
  { id: '3', date: '2024-08-10', procedure: 'D2391 - Resin Composite, 1 surface', tooth: '#3 (ULM)', status: 'Completed', provider: 'Dr. Jones' },
  { id: '4', date: '2024-05-05', procedure: 'D0274 - Bitewing - 2 films', tooth: '–', status: 'Completed', provider: 'Dr. Smith' },
  { id: '5', date: '2024-02-01', procedure: 'D0150 - Comprehensive Oral Eval', tooth: '–', status: 'Completed', provider: 'Dr. Jones' },
];

const MOCK_TIMELINE = [
  { id: '1', date: '2025-01-15', title: 'Periodic exam', type: 'procedure' },
  { id: '2', date: '2024-11-20', title: 'Prophy (cleaning)', type: 'procedure' },
  { id: '3', date: '2024-08-10', title: 'Filling #3', type: 'procedure' },
  { id: '4', date: '2024-05-05', title: 'Bitewing X-ray', type: 'xray' },
  { id: '5', date: '2024-02-01', title: 'New patient exam', type: 'exam' },
];

const MOCK_NOTES = [
  { id: '1', date: '2025-01-15', note: 'Patient reports no pain. Good OH. Recommended 6mo recall.' },
  { id: '2', date: '2024-08-10', note: 'MO composite #3 placed. Patient tolerated procedure well.' },
];

const formatDate = (d) => {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PatientDentalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientData = await patientService.getPatientById(patientId);
        if (!cancelled) setPatient(patientData);
      } catch {
        if (!cancelled) setPatient(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [patientId]);

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) return `${patient.firstName} ${patient.lastName}`;
    return 'Patient';
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PatientSectionTabs activeTab="dental" patientId={patientId} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/patients/details/${patientId}`)}
            size="small"
          >
            Back to patient
          </Button>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Dental History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getPatientName()}
              {patient?.dateOfBirth && ` · DOB: ${formatDate(patient.dateOfBirth)}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" size="small" startIcon={<FilterIcon />}>
            Filters
          </Button>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Procedures
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {MOCK_PROCEDURES.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Last Visit
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatDate(MOCK_PROCEDURES[0]?.date)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Clinical Notes
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {MOCK_NOTES.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                X-Rays
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs: Procedures | Timeline | Notes */}
      <Paper variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'grey.300', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Procedures" icon={<ProcedureIcon />} iconPosition="start" />
            <Tab label="Timeline" icon={<TimelineIcon />} iconPosition="start" />
            <Tab label="Clinical Notes" icon={<NoteIcon />} iconPosition="start" />
            <Tab label="X-Rays" icon={<XRayIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2.5 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                Treatment history (sample data)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Procedure</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tooth</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_PROCEDURES.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell>{row.procedure}</TableCell>
                      <TableCell>{row.tooth}</TableCell>
                      <TableCell>{row.provider}</TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" color="success" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                Chronological activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {MOCK_TIMELINE.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1.25,
                      px: 1.5,
                      borderRadius: 1,
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                      {formatDate(item.date)}
                    </Typography>
                    <Chip
                      label={item.type}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {item.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {tabValue === 2 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                Notes from visits
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {MOCK_NOTES.map((item) => (
                  <Paper key={item.id} variant="outlined" sx={{ p: 2, borderColor: 'grey.300' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(item.date)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {item.note}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
          {tabValue === 3 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <XRayIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                X-ray images will appear here when linked to the patient record.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        This is a UI preview with sample data. Connect your data source to show real dental history.
      </Typography>
    </Box>
  );
};

export default PatientDentalHistoryPage;
