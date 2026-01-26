import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FavoriteBorder as HeartIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { vitalSignService } from '../../services/vital-sign.service';
import { patientService } from '../../services/patient.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const VitalSignsListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    patientId: searchParams.get('patientId') || '',
    startDate: '',
    endDate: '',
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vitalSignId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchVitalSigns = async () => {
    try {
      setLoading(true);
      const result = await vitalSignService.getAllVitalSigns(
        pagination.page,
        pagination.limit,
        filters
      );
      setVitalSigns(result.vitalSigns);
      setPagination(result.pagination);
    } catch (err) {
      showSnackbar('Failed to load vital signs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const result = await patientService.getAllPatients(1, 100);
      setPatients(result.patients || []);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchVitalSigns();
  }, [pagination.page, pagination.limit, filters]);

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

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await vitalSignService.deleteVitalSign(deleteDialog.vitalSignId);
      showSnackbar('Vital sign record deleted successfully', 'success');
      fetchVitalSigns();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete vital sign record',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, vitalSignId: null });
    }
  };

  const getPatientName = (vitalSign) => {
    if (vitalSign.patientId?.firstName && vitalSign.patientId?.lastName) {
      return `${vitalSign.patientId.firstName} ${vitalSign.patientId.lastName}`;
    }
    return 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatBloodPressure = (systolic, diastolic) => {
    if (!systolic && !diastolic) return '-';
    return `${systolic || '-'}/${diastolic || '-'}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Vital Signs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Record and manage patient vital signs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchVitalSigns}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vital-signs/create')}
          >
            Record Vitals
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Patient</InputLabel>
              <Select
                value={filters.patientId}
                onChange={handleFilterChange('patientId')}
                label="Patient"
              >
                <MenuItem value="">All Patients</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={handleFilterChange('startDate')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={handleFilterChange('endDate')}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : vitalSigns.length === 0 ? (
        <Alert severity="info">No vital sign records found</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>BP (mmHg)</TableCell>
                  <TableCell>HR (bpm)</TableCell>
                  <TableCell>Temp (°F)</TableCell>
                  <TableCell>SpO2 (%)</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vitalSigns.map((vitalSign) => (
                  <TableRow key={vitalSign._id} hover>
                    <TableCell>{getPatientName(vitalSign)}</TableCell>
                    <TableCell>{formatDate(vitalSign.recordedDate)}</TableCell>
                    <TableCell>{vitalSign.recordedTime || '-'}</TableCell>
                    <TableCell>
                      {formatBloodPressure(
                        vitalSign.bloodPressureSystolic,
                        vitalSign.bloodPressureDiastolic
                      )}
                    </TableCell>
                    <TableCell>
                      {vitalSign.heartRate ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <HeartIcon fontSize="small" color="error" />
                          {vitalSign.heartRate}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{vitalSign.temperature || '-'}</TableCell>
                    <TableCell>{vitalSign.oxygenSaturation || '-'}</TableCell>
                    <TableCell>{vitalSign.weight || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/vital-signs/${vitalSign._id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/vital-signs/${vitalSign._id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({ open: true, vitalSignId: vitalSign._id })
                          }
                        >
                          <DeleteIcon />
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
        </Paper>
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Vital Sign Record"
        message="Are you sure you want to delete this vital sign record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, vitalSignId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />
    </Box>
  );
};

export default VitalSignsListPage;
