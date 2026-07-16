import { useState, useEffect, useMemo, useCallback } from 'react';
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
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import TaskList from '../../components/appointments/right-panel/TaskList';
import Messages from '../../components/appointments/right-panel/Messages';
import LatestVitalsSection from '../../components/vital-signs/LatestVitalsSection';
import VitalTrendsSection from '../../components/vital-signs/VitalTrendsSection';
import RecordVitalsDialog from "../../components/vital-signs/RecordVitalsDialog";
import ViewVitalsDialog from "../../components/vital-signs/ViewVitalsDialog";
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { Add as AddIcon } from '@mui/icons-material';

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
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVitalSignId, setSelectedVitalSignId] = useState(null);
  const [editVitalSignId, setEditVitalSignId] = useState(null);

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
  const CustomDot = useCallback((props) => {
    const { cx, cy, value, dataKey, stroke } = props;
    if (value === undefined || value === null || cx === undefined || cy === undefined) return null;
    
    let isOut = false;
    if (normalRanges) {
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
  }, [normalRanges]);

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
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100%",
        pb: 4,
        position: "relative",
      }}
    >
      <PatientSectionTabs activeTab="vitals" patientId={patientId} />

      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          px: 2.5,
          py: 2,
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.xl,
          border: `0.8px solid ${COLORS.BORDER}`,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
            Vital Signs History
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
            {getPatientName()}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => {
              setEditVitalSignId(null);
              setIsRecordModalOpen(true);
            }}
            sx={{
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.base,
              borderRadius: radius.md,
              boxShadow: "none",
              backgroundColor: "#2262ef",
              "&:hover": { backgroundColor: "#1b4dbd" },
            }}
          >
            Record new Vitals
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" }, gap: 2, alignItems: "start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {latestVitals && (
            <LatestVitalsSection
              latestVitals={latestVitals}
              formatDate={formatDate}
              formatBloodPressure={formatBloodPressure}
              bpCategory={bpCategory}
              bmiCategory={bmiCategory}
            />
          )}

          <VitalTrendsSection
            chartData={chartData}
            trendDays={trendDays}
            setTrendDays={setTrendDays}
            viewMode={viewMode}
            setViewMode={setViewMode}
            vitalSigns={vitalSigns}
            totalVitals={totalVitals}
            pagination={pagination}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            normalRanges={normalRanges}
            formatDate={formatDate}
            formatBloodPressure={formatBloodPressure}
            CustomDot={CustomDot}
            onViewClick={(id) => {
              setSelectedVitalSignId(id);
              setViewDialogOpen(true);
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TaskList />
          <Messages />
        </Box>
      </Box>

      <RecordVitalsDialog
        open={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        patientId={patientId}
        editingVitalSignId={editVitalSignId}
        onSaved={() => {
          setIsRecordModalOpen(false);
        }}
      />

      <ViewVitalsDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        vitalSignId={selectedVitalSignId}
        onDeleted={() => {
          setViewDialogOpen(false);
          // React Query invalidation will handle the refetch or we can just let it be
        }}
        onEdit={(id) => {
          setEditVitalSignId(id);
          setIsRecordModalOpen(true);
        }}
      />
    </Box>
  );
};

export default PatientVitalHistoryPage;
