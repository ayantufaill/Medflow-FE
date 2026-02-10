import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { authorizationService } from '../../services/authorization.service';
import { patientService } from '../../services/patient.service';
import { insuranceCompanyService } from '../../services/insurance.service';
import { serviceCatalogService } from '../../services/service-catalog.service';

const CreateAuthorizationPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingInsurance, setLoadingInsurance] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceCode: '',
      procedureCode: '',
      serviceDescription: '',
      requestedDate: dayjs(),
      expectedServiceDate: null,
      units: 1,
      notes: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPatients(true);
        setLoadingInsurance(true);
        setLoadingServices(true);
        const [patientsResult, insuranceResult, servicesResult] = await Promise.all([
          patientService.getAllPatients(1, 100).catch(() => ({ patients: [] })),
          insuranceCompanyService.getAllInsuranceCompanies(1, 100, '', 'active').catch(() => ({ companies: [] })),
          serviceCatalogService.getAllServices({ page: 1, limit: 200, isActive: true }).catch(() => ({ services: [] })),
        ]);
        setPatients(patientsResult?.patients || []);
        setInsuranceCompanies(insuranceResult?.companies || insuranceResult?.insuranceCompanies || []);
        setServices(servicesResult?.services || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoadingPatients(false);
        setLoadingInsurance(false);
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  // Auto-fill insurance when patient with primary insurance is selected
  useEffect(() => {
    if (selectedPatient?.primaryInsurance?.insuranceCompanyId) {
      const ins = selectedPatient.primaryInsurance.insuranceCompanyId;
      const company = insuranceCompanies.find((ic) => (ic._id || ic.id) === (ins._id || ins));
      if (company) setSelectedInsurance(company);
    }
  }, [selectedPatient, insuranceCompanies]);

  const onSubmit = async (data) => {
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    if (!selectedInsurance) {
      setError('Please select an insurance company');
      return;
    }
    if (!selectedService) {
      setError('Please select a service');
      return;
    }
    try {
      setSaving(true);
      setError('');

      const authorizationData = {
        patientId: selectedPatient._id || selectedPatient.id,
        insuranceCompanyId: selectedInsurance._id || selectedInsurance.id,
        serviceId: selectedService._id || selectedService.id,
        requestedDate: data.requestedDate ? dayjs(data.requestedDate).toISOString() : undefined,
        expirationDate: data.expectedServiceDate ? dayjs(data.expectedServiceDate).toISOString() : undefined,
        unitsAuthorized: data.units || 1,
        notes: data.notes || undefined,
      };

      await authorizationService.requestAuthorization(authorizationData);
      showSnackbar('Authorization requested successfully', 'success');
      navigate('/authorizations');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to request authorization';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ overflow: 'visible' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/authorizations')} size="small">
            Back to Authorizations
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Request Insurance Authorization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new authorization request to insurance company
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 1, overflow: 'visible' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="subtitle1" fontWeight="600" color="text.secondary" sx={{ mb: 2 }}>
              Patient & Insurance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={patients}
                  loading={loadingPatients}
                  getOptionLabel={(option) =>
                    option ? `${(option.firstName || '')} ${(option.lastName || '')}`.trim() || option.patientCode || 'Unknown' : ''
                  }
                  value={selectedPatient}
                  onChange={(_, newValue) => setSelectedPatient(newValue)}
                  isOptionEqualToValue={(option, value) => (option?._id || option?.id) === (value?._id || value?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Patient *"
                      placeholder="Search patient..."
                      error={!selectedPatient && !!error}
                      helperText={!selectedPatient && error ? error : ''}
                      sx={{ '& .MuiInputBase-root': { minHeight: 56 }, '& .MuiInputBase-input': { py: 2, fontSize: '1.1rem' } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingPatients && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={loadingPatients ? 'Loading...' : 'No patients found. Add patients from Patients section.'}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={insuranceCompanies}
                  loading={loadingInsurance}
                  getOptionLabel={(option) => (option ? option.name : '')}
                  value={selectedInsurance}
                  onChange={(_, newValue) => setSelectedInsurance(newValue)}
                  isOptionEqualToValue={(option, value) => (option?._id || option?.id) === (value?._id || value?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Insurance Company *"
                      placeholder="Select insurance..."
                      error={!selectedInsurance && !!error}
                      helperText={!selectedInsurance && error ? error : ''}
                      sx={{ '& .MuiInputBase-root': { minHeight: 56 }, '& .MuiInputBase-input': { py: 2, fontSize: '1.1rem' } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingInsurance && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={loadingInsurance ? 'Loading...' : 'No insurance companies found.'}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="600" color="text.secondary" sx={{ mb: 2 }}>
              Service Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={services}
                  loading={loadingServices}
                  getOptionLabel={(option) =>
                    option ? (`${option.name || ''}${option.cptCode ? ` (${option.cptCode})` : ''}`.trim() || 'Unknown') : ''
                  }
                  value={selectedService}
                  onChange={(_, newValue) => setSelectedService(newValue)}
                  isOptionEqualToValue={(option, value) => (option?._id || option?.id) === (value?._id || value?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Service *"
                      placeholder="Select service..."
                      error={!selectedService && !!error}
                      helperText={!selectedService && error ? error : ''}
                      sx={{ '& .MuiInputBase-root': { minHeight: 56 }, '& .MuiInputBase-input': { py: 2, fontSize: '1.1rem' } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingServices && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={loadingServices ? 'Loading...' : 'No services found. Add services from Service Catalog.'}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="procedureCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Procedure Code"
                      placeholder="e.g., 36415"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="serviceDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Service Description"
                      placeholder="e.g., Office visit, Lab test"
                      multiline
                      rows={4}
                      sx={{ '& .MuiInputBase-root': { minHeight: 110 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notes"
                      placeholder="Additional information..."
                      multiline
                      rows={4}
                      sx={{ '& .MuiInputBase-root': { minHeight: 110 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="600" color="text.secondary" sx={{ mb: 2 }}>
              Dates & Units
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="requestedDate"
                  control={control}
                  rules={{ required: 'Requested date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Requested Date *"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.requestedDate,
                          helperText: errors.requestedDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="expectedServiceDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Expected Service Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => field.onChange(newValue)}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="units"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Units"
                      inputProps={{ min: 1 }}
                      value={field.value || 1}
                    />
                  )}
                />
              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/authorizations')} disabled={saving}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Requesting...' : 'Request Authorization'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAuthorizationPage;
