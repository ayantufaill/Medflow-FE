import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  Grid,
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
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
import { estimateService } from '../../services/estimate.service';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';

const CreateEstimatePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    defaultValues: {
      description: '',
      estimatedAmount: '',
      insurancePortion: '',
      patientPortion: '',
      expirationDate: dayjs().add(30, 'day'),
    },
  });

  const estimatedAmount = watch('estimatedAmount');
  const insurancePortion = watch('insurancePortion');

  // Auto-calculate patient portion
  const calculatedPatientPortion = estimatedAmount && insurancePortion
    ? Math.max(0, parseFloat(estimatedAmount) - parseFloat(insurancePortion || 0))
    : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPatients(true);
        setLoadingProviders(true);
        
        const [patientsResult, providersResult] = await Promise.all([
          patientService.getAllPatients(1, 100),
          providerService.getAllProviders(1, 100),
        ]);
        
        setPatients(patientsResult.patients || []);
        setProviders(providersResult.providers || []);
      } catch (err) {
        // Error handled silently
      } finally {
        setLoadingPatients(false);
        setLoadingProviders(false);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (data) => {
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const estimateData = {
        patientId: selectedPatient._id || selectedPatient.id,
        providerId: selectedProvider ? (selectedProvider._id || selectedProvider.id) : undefined,
        description: data.description,
        estimatedAmount: parseFloat(data.estimatedAmount),
        insurancePortion: data.insurancePortion ? parseFloat(data.insurancePortion) : undefined,
        patientPortion: data.patientPortion ? parseFloat(data.patientPortion) : calculatedPatientPortion || undefined,
        expirationDate: dayjs(data.expirationDate).format('YYYY-MM-DD'),
      };

      const estimate = await estimateService.createEstimate(estimateData);
      showSnackbar('Estimate created successfully', 'success');
      navigate(`/estimates/${estimate._id || estimate.id}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create estimate.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/estimates')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Create Cost Estimate
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Create a cost estimate to provide patients with expected costs for services before treatment.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
              {/* Patient */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={patients}
                  loading={loadingPatients}
                  getOptionLabel={(option) =>
                    option ? `${option.firstName} ${option.lastName}` : ''
                  }
                  value={selectedPatient}
                  onChange={(_, newValue) => setSelectedPatient(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient *"
                      error={!selectedPatient && !!error}
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
                  isOptionEqualToValue={(option, value) =>
                    (option?._id || option?.id) === (value?._id || value?.id)
                  }
                />
              </Grid>

              {/* Provider */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={providers}
                  loading={loadingProviders}
                  getOptionLabel={(option) =>
                    option?.userId
                      ? `Dr. ${option.userId.firstName} ${option.userId.lastName}`
                      : ''
                  }
                  value={selectedProvider}
                  onChange={(_, newValue) => setSelectedProvider(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider (Optional)"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingProviders && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    (option?._id || option?.id) === (value?._id || value?.id)
                  }
                />
              </Grid>

              {/* Description */}
              <Grid size={12}>
                <TextField
                  {...register('description', { required: 'Description is required' })}
                  label="Description *"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Describe the services/procedures this estimate covers..."
                />
              </Grid>

              {/* Amounts */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...register('estimatedAmount', { 
                    required: 'Estimated amount is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  label="Estimated Total *"
                  type="number"
                  fullWidth
                  error={!!errors.estimatedAmount}
                  helperText={errors.estimatedAmount?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...register('insurancePortion', { min: { value: 0, message: 'Must be positive' } })}
                  label="Insurance Portion"
                  type="number"
                  fullWidth
                  error={!!errors.insurancePortion}
                  helperText={errors.insurancePortion?.message || 'Estimated insurance coverage'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Patient Portion"
                  type="number"
                  fullWidth
                  value={calculatedPatientPortion || ''}
                  disabled
                  helperText="Auto-calculated from total minus insurance"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Expiration Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="expirationDate"
                  control={control}
                  rules={{ required: 'Expiration date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Valid Until *"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.expirationDate,
                          helperText: errors.expirationDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Summary */}
              {estimatedAmount && (
                <Grid size={12}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Estimate Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Estimated Total:</Typography>
                      <Typography fontWeight="medium">{formatCurrency(estimatedAmount)}</Typography>
                    </Box>
                    {insurancePortion && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Insurance Coverage:</Typography>
                        <Typography color="success.main">-{formatCurrency(insurancePortion)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography fontWeight="bold">Patient Responsibility:</Typography>
                      <Typography fontWeight="bold" color="primary.main">
                        {formatCurrency(calculatedPatientPortion || estimatedAmount)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Buttons */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                  <Button variant="outlined" onClick={() => navigate('/estimates')} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving || !selectedPatient}
                  >
                    {saving ? 'Creating...' : 'Create Estimate'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEstimatePage;
