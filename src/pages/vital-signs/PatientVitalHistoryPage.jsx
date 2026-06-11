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
  ReferenceArea,
} from 'recharts';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import {
  usePatientVitalSigns,
  usePatientVitalsTrend,
  useLatestPatientVitals,
  useVitalNormalRanges,
} from '../../hooks/queries/useVitalSigns';
import {
  getBloodPressureCategory,
  getBMICategory,
} from '../../validations/vitalSignValidations';

const PatientVitalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientError, setPatientError] = useState('');
  const [viewMode, setViewMode] = useState('chart');
  const [trendDays, setTrendDays] = useState(30);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Fetch patient info (not a vital-sign query, stays manual)
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setPatientLoading(true);
        const patientData = await patientService.getPatientById(patientId);
        setPatient(patientData);
      } catch (err) {
        const errorMessage = err.response?.data?.error?.message || 
          err.response?.data?.message || 
          'Failed to load patient';
        
        if (err.response?.status === 403) {
          setPatientError('You do not have permission to view this patient\'s vital signs history. Please contact your administrator.');
        } else if (err.response?.status === 401) {
          setPatientError('Your session has expired. Please log in again.');
        } else {
          setPatientError(errorMessage);
        }
        showSnackbar(errorMessage, 'error');
      } finally {
        setPatientLoading(false);
      }
    };
    fetchPatient();
  }, [patientId, showSnackbar]);

  // React Query hooks for vitals data
  const {
    data: vitalsData,
    isLoading: vitalsLoading,
    isError: vitalsError,
  } = usePatientVitalSigns(patientId, pagination.page, pagination.limit);

  const {
    data: trendData,
    isLoading: trendLoading,
  } = usePatientVitalsTrend(patientId, trendDays);

  const {
    data: latestVitals,
  } = useLatestPatientVitals(patientId);

  const { data: normalRanges } = useVitalNormalRanges();

  const vitalSigns = vitalsData?.vitalSigns || [];
  const totalVitals = vitalsData?.pagination?.total || 0;
  const trendVitals = trendData || [];

  const loading = patientLoading || vitalsLoading;
  const error = patientError;

  const chartData = useMemo(() => {
    return trendVitals.map((vital) => ({
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
  }, [trendVitals]);

  // Custom dot renderer that highlights out-of-range values in red
  const CustomDot = (props) => {
    const { cx, cy, value, dataKey, stroke } = props;
    if (value === undefined || value === null || !normalRanges || !cx || !cy) return null;
    
    let isOut = false;
    const ranges = {
      systolic: normalRanges.bloodPressureSystolic,
      diastolic: normalRanges.bloodPressureDiastolic,
      heartRate: normalRanges.heartRate,
      temperature: normalRanges.temperature,
      oxygenSaturation: normalRanges.oxygenSaturation,
    };
    
    const range = ranges[dataKey];
    if (range) {
      isOut = value < range.min || value > range.max;
    }
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isOut ? 6 : 4}
        fill={isOut ? '#ff1744' : stroke}
        stroke={isOut ? '#ff1744' : stroke}
        strokeWidth={isOut ? 2 : 1}
      />
    );
  };

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
                <YAxis yAxisId="left" domain={[40, 200]} />
                <YAxis yAxisId="right" orientation="right" domain={[40, 120]} />
                <ChartTooltip />
                <Legend />
                {normalRanges?.bloodPressureSystolic && (
                  <ReferenceArea
                    yAxisId="left"
                    y1={normalRanges.bloodPressureSystolic.min}
                    y2={normalRanges.bloodPressureSystolic.max}
                    fill="#4caf50"
                    fillOpacity={0.08}
                    label=""
                  />
                )}
                {normalRanges?.heartRate && (
                  <ReferenceArea
                    yAxisId="right"
                    y1={normalRanges.heartRate.min}
                    y2={normalRanges.heartRate.max}
                    fill="#4caf50"
                    fillOpacity={0.08}
                    label=""
                  />
                )}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="systolic"
                  stroke="#f44336"
                  name="Systolic"
                  strokeWidth={2}
                  dot={<CustomDot />}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#2196f3"
                  name="Diastolic"
                  strokeWidth={2}
                  dot={<CustomDot />}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#4caf50"
                  name="Heart Rate"
                  strokeWidth={2}
                  dot={<CustomDot />}
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
                <YAxis yAxisId="right" orientation="right" domain={[93, 105]} />
                <ChartTooltip />
                <Legend />
                {normalRanges?.temperature && (
                  <ReferenceArea
                    yAxisId="right"
                    y1={normalRanges.temperature.min}
                    y2={normalRanges.temperature.max}
                    fill="#ff9800"
                    fillOpacity={0.1}
                    label=""
                  />
                )}
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
                  dot={<CustomDot />}
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
                      {vitalSigns.map((vital) => {
                        // Check if any vitals are out of range
                        const isOutOfRange = normalRanges && (
                          (vital.bloodPressureSystolic && (vital.bloodPressureSystolic < normalRanges.bloodPressureSystolic?.min || vital.bloodPressureSystolic > normalRanges.bloodPressureSystolic?.max)) ||
                          (vital.bloodPressureDiastolic && (vital.bloodPressureDiastolic < normalRanges.bloodPressureDiastolic?.min || vital.bloodPressureDiastolic > normalRanges.bloodPressureDiastolic?.max)) ||
                          (vital.heartRate && (vital.heartRate < normalRanges.heartRate?.min || vital.heartRate > normalRanges.heartRate?.max)) ||
                          (vital.temperature && (vital.temperature < normalRanges.temperature?.min || vital.temperature > normalRanges.temperature?.max)) ||
                          (vital.oxygenSaturation && vital.oxygenSaturation < normalRanges.oxygenSaturation?.min)
                        );

                        return (
                          <TableRow
                            key={vital._id}
                            hover
                            sx={isOutOfRange ? { bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } } : {}}
                          >
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={totalVitals}
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
