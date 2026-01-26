import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Timeline as TimelineIcon,
  TableChart as TableIcon,
  TrendingUp as TrendIcon,
  Visibility as ViewIcon,
  FavoriteBorder as HeartIcon,
  Thermostat as TempIcon,
  Speed as BPIcon,
  MonitorWeight as WeightIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import { patientService } from '../../services/patient.service';
import {
  getBloodPressureCategory,
  getBMICategory,
} from '../../validations/vitalSignValidations';

const PatientVitalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState(null);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [latestVitals, setLatestVitals] = useState(null);
  const [viewMode, setViewMode] = useState('chart');
  const [trendDays, setTrendDays] = useState(30);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const patientData = await patientService.getPatientById(patientId);
      setPatient(patientData);

      const [vitalsResult, trend, latest] = await Promise.all([
        vitalSignService.getVitalSignsByPatient(patientId, pagination.page, pagination.limit),
        vitalSignService.getVitalsTrend(patientId, trendDays),
        vitalSignService.getLatestVitalsByPatient(patientId),
      ]);
      
      setVitalSigns(vitalsResult.vitalSigns || []);
      setPagination(vitalsResult.pagination || pagination);
      setTrendData(trend || []);
      setLatestVitals(latest);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 
        err.response?.data?.message || 
        'Failed to load vital signs history';
      
      if (err.response?.status === 403) {
        setError('You do not have permission to view this patient\'s vital signs history. Please contact your administrator.');
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(errorMessage);
      }
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId, pagination.page, pagination.limit, trendDays]);

  const chartData = useMemo(() => {
    return trendData.map((vital) => ({
      date: new Date(vital.recordedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      systolic: vital.bloodPressureSystolic,
      diastolic: vital.bloodPressureDiastolic,
      heartRate: vital.heartRate,
      temperature: vital.temperature,
      weight: vital.weight,
      oxygenSaturation: vital.oxygenSaturation,
    }));
  }, [trendData]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatBloodPressure = (systolic, diastolic) => {
    if (!systolic && !diastolic) return '-';
    return `${systolic || '-'}/${diastolic || '-'}`;
  };

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    return 'Unknown Patient';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Vital Signs History
          </Typography>
        </Box>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const bpCategory = latestVitals
    ? getBloodPressureCategory(latestVitals.bloodPressureSystolic, latestVitals.bloodPressureDiastolic)
    : null;
  const bmiCategory = latestVitals?.bmi ? getBMICategory(latestVitals.bmi) : null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Vital Signs History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getPatientName()}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/vital-signs/create?patientId=${patientId}`)}
        >
          Record New Vitals
        </Button>
      </Box>

      {latestVitals && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Latest Vitals ({formatDate(latestVitals.recordedDate)})
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <BPIcon color="primary" />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Blood Pressure
                  </Typography>
                  <Typography variant="h6">
                    {formatBloodPressure(latestVitals.bloodPressureSystolic, latestVitals.bloodPressureDiastolic)}
                  </Typography>
                  {bpCategory && (
                    <Chip label={bpCategory.label} color={bpCategory.color} size="small" />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <HeartIcon color="error" />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Heart Rate
                  </Typography>
                  <Typography variant="h6">
                    {latestVitals.heartRate || '-'} <Typography component="span" variant="caption">bpm</Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <TempIcon color="warning" />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Temperature
                  </Typography>
                  <Typography variant="h6">
                    {latestVitals.temperature || '-'} <Typography component="span" variant="caption">°F</Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <WeightIcon color="info" />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="h6">
                    {latestVitals.weight || '-'} <Typography component="span" variant="caption">lbs</Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    SpO2
                  </Typography>
                  <Typography variant="h6">
                    {latestVitals.oxygenSaturation || '-'} <Typography component="span" variant="caption">%</Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={2}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    BMI
                  </Typography>
                  <Typography variant="h6">
                    {latestVitals.bmi || '-'}
                  </Typography>
                  {bmiCategory && (
                    <Chip label={bmiCategory.label} color={bmiCategory.color} size="small" />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendIcon color="primary" />
            <Typography variant="h6">Trends</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={trendDays}
                onChange={(e) => setTrendDays(e.target.value)}
                label="Time Period"
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
                <MenuItem value={180}>Last 6 months</MenuItem>
                <MenuItem value={365}>Last year</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
            >
              <ToggleButton value="chart">
                <TimelineIcon />
              </ToggleButton>
              <ToggleButton value="table">
                <TableIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {viewMode === 'chart' && chartData.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Blood Pressure & Heart Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[60, 200]} />
                <YAxis yAxisId="right" orientation="right" domain={[40, 120]} />
                <ChartTooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="systolic"
                  stroke="#f44336"
                  name="Systolic"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#2196f3"
                  name="Diastolic"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#4caf50"
                  name="Heart Rate"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Weight & Temperature
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" domain={[95, 105]} />
                <ChartTooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  stroke="#9c27b0"
                  name="Weight (lbs)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff9800"
                  name="Temp (°F)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : viewMode === 'chart' ? (
          <Alert severity="info">No trend data available for the selected period</Alert>
        ) : null}

        {viewMode === 'table' && (
          <>
            {vitalSigns.length === 0 ? (
              <Alert severity="info">No vital sign records found</Alert>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>BP (mmHg)</TableCell>
                        <TableCell>HR (bpm)</TableCell>
                        <TableCell>Temp (°F)</TableCell>
                        <TableCell>SpO2 (%)</TableCell>
                        <TableCell>Weight (lbs)</TableCell>
                        <TableCell>BMI</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vitalSigns.map((vital) => (
                        <TableRow key={vital._id} hover>
                          <TableCell>{formatDate(vital.recordedDate)}</TableCell>
                          <TableCell>{vital.recordedTime || '-'}</TableCell>
                          <TableCell>
                            {formatBloodPressure(vital.bloodPressureSystolic, vital.bloodPressureDiastolic)}
                          </TableCell>
                          <TableCell>{vital.heartRate || '-'}</TableCell>
                          <TableCell>{vital.temperature || '-'}</TableCell>
                          <TableCell>{vital.oxygenSaturation || '-'}</TableCell>
                          <TableCell>{vital.weight || '-'}</TableCell>
                          <TableCell>{vital.bmi || '-'}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/vital-signs/${vital._id}`)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={pagination.total}
                  page={pagination.page - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={pagination.limit}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PatientVitalHistoryPage;
