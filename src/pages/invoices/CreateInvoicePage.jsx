import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Chip,
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
import { invoiceService } from '../../services/invoice.service';
import { appointmentService } from '../../services/appointment.service';
import { insuranceCompanyService } from '../../services/insurance.service';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loadingInsurance, setLoadingInsurance] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const appointmentIdFromUrl = searchParams.get('appointmentId');

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      dueDate: dayjs().add(30, 'day'),
      notes: '',
    },
  });

  // Fetch insurance companies for dropdown
  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        setLoadingInsurance(true);
        const result = await insuranceCompanyService.getAllInsuranceCompanies(1, 100, '', 'active');
        setInsuranceCompanies(result.companies || []);
      } catch (err) {
        console.warn('Error fetching insurance companies:', err);
      } finally {
        setLoadingInsurance(false);
      }
    };
    fetchInsurance();
  }, []);

  // Fetch completed appointments that don't have invoices
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        setError('');
        
        // Get completed appointments
        const appointmentsResult = await appointmentService.getAllAppointments(1, 100, '', '', 'completed');
        const allCompletedAppointments = appointmentsResult.appointments || [];
        
        if (allCompletedAppointments.length === 0) {
          setAppointments([]);
          return;
        }
        
        // Get all invoices to check which appointments already have invoices
        const appointmentIdsWithInvoices = new Set();
        try {
          const invoicesResult = await invoiceService.getAllInvoices({ page: 1, limit: 500 });
          const invoices = invoicesResult.invoices || [];
          
          invoices.forEach((inv) => {
            // appointmentId can be: populated object { _id } or raw string
            const aptId = inv.appointmentId?._id ?? inv.appointmentId ?? inv.appointment?._id ?? inv.appointment?.id;
            if (aptId) {
              appointmentIdsWithInvoices.add(String(aptId));
            }
          });
        } catch (invoiceErr) {
          console.warn('Error fetching invoices for filtering:', invoiceErr);
          // Continue even if invoice fetch fails
        }
        
        // Filter out appointments that already have invoices
        const appointmentsWithoutInvoices = allCompletedAppointments.filter(
          (apt) => {
            const aptId = String(apt._id || apt.id);
            return !appointmentIdsWithInvoices.has(aptId);
          }
        );
        
        setAppointments(appointmentsWithoutInvoices);
        
        // Pre-select if appointmentId is in URL
        if (appointmentIdFromUrl) {
          const apt = appointmentsWithoutInvoices.find(
            (a) => String(a._id || a.id) === String(appointmentIdFromUrl)
          );
          if (apt) {
            setSelectedAppointment(apt);
          } else {
            // Check if appointment exists but has invoice
            const allApt = allCompletedAppointments.find(
              (a) => String(a._id || a.id) === String(appointmentIdFromUrl)
            );
            if (allApt && appointmentIdsWithInvoices.has(String(appointmentIdFromUrl))) {
              setError('Invoice already exists for this appointment');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        const errorMessage =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load appointments.';
        setError(errorMessage);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [appointmentIdFromUrl]);

  const handleFormSubmit = async (data) => {
    if (!selectedAppointment) {
      setError('Please select an appointment');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const invoiceData = {
        dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
        notes: data.notes || undefined,
        insuranceCompanyId: selectedInsurance ? (selectedInsurance._id || selectedInsurance.id) : undefined,
      };

      const invoice = await invoiceService.createInvoiceFromAppointment(
        selectedAppointment._id || selectedAppointment.id,
        invoiceData
      );
      
      showSnackbar('Invoice created successfully', 'success');
      navigate(`/invoices/${invoice._id || invoice.id}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create invoice.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatAppointmentLabel = (apt) => {
    if (!apt) return '';
    const patientName = apt.patientId
      ? `${apt.patientId.firstName} ${apt.patientId.lastName}`
      : 'Unknown Patient';
    const date = apt.appointmentDate
      ? dayjs(apt.appointmentDate).format('MMM DD, YYYY')
      : '';
    const type = apt.appointmentTypeId?.name || 'Appointment';
    return `${patientName} - ${type} (${date})`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Create Invoice from Appointment
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Only completed appointments without existing invoices are shown below.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
              {/* Appointment Selection and Due Date in one line */}
              <Grid size={{ xs: 12, sm: 8 }}>
                <Autocomplete
                  options={appointments}
                  loading={loadingAppointments}
                  getOptionLabel={formatAppointmentLabel}
                  value={selectedAppointment}
                  onChange={(_, newValue) => setSelectedAppointment(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Completed Appointment *"
                      placeholder="Search by patient name..."
                      error={!selectedAppointment && !!error}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingAppointments && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id || option.id}>
                      <Box>
                        <Typography variant="body1">
                          {option.patientId?.firstName} {option.patientId?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.appointmentTypeId?.name} • {dayjs(option.appointmentDate).format('MMM DD, YYYY')}
                          {option.providerId?.userId && (
                            <> • Dr. {option.providerId.userId.firstName} {option.providerId.userId.lastName}</>
                          )}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    (option?._id || option?.id) === (value?._id || value?.id)
                  }
                  noOptionsText={loadingAppointments ? 'Loading...' : 'No completed appointments without invoices found'}
                />
              </Grid>

              {/* Due Date */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="dueDate"
                  control={control}
                  rules={{ required: 'Due date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Due Date *"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dueDate,
                          helperText: errors.dueDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Insurance (optional) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={insuranceCompanies}
                  loading={loadingInsurance}
                  getOptionLabel={(opt) => (opt ? opt.name || '' : '')}
                  value={selectedInsurance}
                  onChange={(_, newValue) => setSelectedInsurance(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Insurance (optional)"
                      placeholder="Select insurance company..."
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
                  isOptionEqualToValue={(option, value) =>
                    (option?._id || option?.id) === (value?._id || value?.id)
                  }
                  noOptionsText={loadingInsurance ? 'Loading...' : 'No insurance companies found'}
                />
              </Grid>

              {/* Selected Appointment Info */}
              {selectedAppointment && (
                <Grid size={12}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Appointment Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Patient:</strong> {selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Date:</strong> {dayjs(selectedAppointment.appointmentDate).format('MMMM DD, YYYY')}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Type:</strong> {selectedAppointment.appointmentTypeId?.name || '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Provider:</strong>{' '}
                          {selectedAppointment.providerId?.userId
                            ? `Dr. ${selectedAppointment.providerId.userId.firstName} ${selectedAppointment.providerId.userId.lastName}`
                            : '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2">
                          <strong>Fee:</strong>{' '}
                          <Typography component="span" fontWeight="bold" color="primary.main">
                            ${selectedAppointment.appointmentTypeId?.defaultPrice?.toFixed(2) || '0.00'}
                          </Typography>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Chip label="Completed" color="success" size="small" />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Notes */}
              <Grid size={12}>
                <TextField
                  {...register('notes')}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Additional notes for the invoice..."
                />
              </Grid>

              {/* Buttons */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                  <Button variant="outlined" onClick={() => navigate('/invoices')} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving || !selectedAppointment}
                  >
                    {saving ? 'Creating...' : 'Create Invoice'}
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

export default CreateInvoicePage;
