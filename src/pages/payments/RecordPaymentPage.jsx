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
  InputAdornment,
  FormHelperText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Divider,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { paymentService } from '../../services/payment.service';
import { invoiceService } from '../../services/invoice.service';
import { patientService } from '../../services/patient.service';

const PAYMENT_METHODS = [
  {
    value: 'card_on_file',
    label: 'Online card on file',
    icon: <CreditCardIcon />,
    disabled: true,
    description: 'Use a saved payment method'
  },
  {
    value: 'cash',
    label: 'Cash',
    icon: <AttachMoneyIcon />,
    disabled: false
  },
  {
    value: 'check',
    label: 'Check',
    icon: <AccountBalanceWalletIcon />,
    disabled: false
  },
  {
    value: 'card',
    label: 'External card',
    icon: <PaymentIcon />,
    disabled: false,
    description: 'Record a payment collected using an external payment processor'
  },
];

const RecordPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [invoiceAmounts, setInvoiceAmounts] = useState({});

  const invoiceIdFromUrl = searchParams.get('invoiceId');

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      paymentMethod: '',
      paymentDate: dayjs(),
      referenceNumber: '',
      processorFee: '',
      notes: '',
    },
  });

  const paymentMethod = watch('paymentMethod');

  // Fetch patients with pending bills
  useEffect(() => {
    const fetchPatientsWithBills = async () => {
      try {
        setLoadingPatients(true);
        // Use limit 100 (backend maximum) instead of 1000
        const result = await patientService.getAllPatients(1, 100);
        const allPatients = result.patients || [];
        
        // Get all invoices to calculate outstanding balances (use limit 100)
        const invoicesResult = await invoiceService.getAllInvoices({ page: 1, limit: 100 });
        const allInvoices = invoicesResult.invoices || [];
        
        // Calculate outstanding balance for each patient
        const patientsWithBalances = allPatients.map(patient => {
          const patientInvoices = allInvoices.filter(
            inv => (inv.patientId?._id || inv.patientId?.id || inv.patientId) === (patient._id || patient.id)
          );
          const outstandingBalance = patientInvoices.reduce((sum, inv) => {
            return sum + (inv.balanceDue || inv.totalAmount - (inv.paidAmount || 0));
          }, 0);
          
          return {
            ...patient,
            outstandingBalance: outstandingBalance > 0 ? outstandingBalance : 0
          };
        });
        
        // Filter to only show patients with pending bills
        const patientsWithBills = patientsWithBalances.filter(p => p.outstandingBalance > 0);
        setPatients(patientsWithBills);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatientsWithBills();
  }, []);

  // Fetch invoices when patient is selected
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!selectedPatient) {
        setInvoices([]);
        setSelectedInvoices([]);
        return;
      }
      try {
        setLoadingInvoices(true);
        const patientId = selectedPatient._id || selectedPatient.id;
        const result = await invoiceService.getAllInvoices({ page: 1, limit: 100, patientId });
        // Filter to show only unpaid or partially paid invoices
        const unpaidInvoices = (result.invoices || []).filter(
          (inv) => inv.status !== 'paid' && inv.status !== 'void'
        );
        setInvoices(unpaidInvoices);
        
        // Pre-select invoice if provided in URL
        if (invoiceIdFromUrl && unpaidInvoices.length > 0) {
          const inv = unpaidInvoices.find((i) => (i._id || i.id) === invoiceIdFromUrl);
          if (inv) {
            setSelectedInvoices([inv]);
            setInvoiceAmounts({ [inv._id || inv.id]: inv.balanceDue || inv.totalAmount });
          }
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchInvoices();
  }, [selectedPatient, invoiceIdFromUrl]);

  const handleInvoiceToggle = (invoice) => {
    const invoiceId = invoice._id || invoice.id;
    const isSelected = selectedInvoices.some(inv => (inv._id || inv.id) === invoiceId);
    
    if (isSelected) {
      setSelectedInvoices(selectedInvoices.filter(inv => (inv._id || inv.id) !== invoiceId));
      const newAmounts = { ...invoiceAmounts };
      delete newAmounts[invoiceId];
      setInvoiceAmounts(newAmounts);
    } else {
      setSelectedInvoices([...selectedInvoices, invoice]);
      setInvoiceAmounts({
        ...invoiceAmounts,
        [invoiceId]: invoice.balanceDue || invoice.totalAmount
      });
    }
  };

  const handleAmountChange = (invoiceId, amount) => {
    setInvoiceAmounts({
      ...invoiceAmounts,
      [invoiceId]: parseFloat(amount) || 0
    });
  };

  const calculateTotalAmount = () => {
    return Object.values(invoiceAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const handleFormSubmit = async (data) => {
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    if (selectedInvoices.length === 0) {
      setError('Please select at least one invoice');
      return;
    }
    if (!data.paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      setError('Total payment amount must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Create payment for the first selected invoice (or combine if multiple)
      const primaryInvoice = selectedInvoices[0];
      const paymentData = {
        invoiceId: primaryInvoice._id || primaryInvoice.id,
        patientId: selectedPatient._id || selectedPatient.id,
        amount: totalAmount,
        paymentMethod: data.paymentMethod === 'card_on_file' ? 'card' : data.paymentMethod, // Map card_on_file to card for backend
        paymentSource: 'patient',
        paymentDate: dayjs(data.paymentDate).toISOString(),
        referenceNumber: data.referenceNumber || undefined,
        processorFee: data.processorFee ? parseFloat(data.processorFee) : undefined,
        notes: data.notes || undefined,
      };

      const payment = await paymentService.createPayment(paymentData);
      showSnackbar('Payment recorded successfully', 'success');
      navigate('/payments');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to record payment.';
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

  const totalAmount = calculateTotalAmount();
  const selectedPatientBalance = selectedPatient?.outstandingBalance || 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/payments')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Record Payment
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
          {/* Left Column - Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={2.5}>
                  {/* Patient Selection */}
                  <Grid size={12}>
                    <Autocomplete
                      options={patients}
                      loading={loadingPatients}
                      getOptionLabel={(option) =>
                        option
                          ? `${option.firstName} ${option.lastName} ${option.outstandingBalance > 0 ? `(${formatCurrency(option.outstandingBalance)} due)` : ''}`
                          : ''
                      }
                      value={selectedPatient}
                      onChange={(_, newValue) => {
                        setSelectedPatient(newValue);
                        setSelectedInvoices([]);
                        setInvoiceAmounts({});
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Patient *"
                          placeholder="Select a patient with pending bills"
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
                      noOptionsText="No patients with pending bills found"
                    />
                  </Grid>

                  {/* Invoice Selection */}
                  {selectedPatient && (
                    <Grid size={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                        Select Invoices *
                      </Typography>
                      {loadingInvoices ? (
                        <Box display="flex" justifyContent="center" p={2}>
                          <CircularProgress />
                        </Box>
                      ) : invoices.length === 0 ? (
                        <Alert severity="info">No unpaid invoices found for this patient.</Alert>
                      ) : (
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                          {invoices.map((invoice) => {
                            const invoiceId = invoice._id || invoice.id;
                            const isSelected = selectedInvoices.some(inv => (inv._id || inv.id) === invoiceId);
                            const balanceDue = invoice.balanceDue || invoice.totalAmount - (invoice.paidAmount || 0);
                            
                            return (
                              <Box key={invoiceId} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleInvoiceToggle(invoice)}
                                  />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" fontWeight="medium">
                                      {invoice.invoiceNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Due: {formatCurrency(balanceDue)} • Status: {invoice.status?.toUpperCase()}
                                    </Typography>
                                  </Box>
                                </Box>
                                {isSelected && (
                                  <Box sx={{ ml: 5 }}>
                                    <TextField
                                      label="Payment Amount"
                                      type="number"
                                      size="small"
                                      fullWidth
                                      value={invoiceAmounts[invoiceId] || balanceDue}
                                      onChange={(e) => handleAmountChange(invoiceId, e.target.value)}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                      inputProps={{ min: 0.01, max: balanceDue, step: 0.01 }}
                                      helperText={`Max: ${formatCurrency(balanceDue)}`}
                                    />
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Grid>
                  )}

                  {/* Payment Method */}
                  <Grid size={12}>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      rules={{ required: 'Payment method is required' }}
                      render={({ field }) => (
                        <FormControl error={!!errors.paymentMethod} fullWidth>
                          <FormLabel sx={{ mb: 1.5, fontWeight: 500 }}>Select a payment method</FormLabel>
                          <RadioGroup
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              field.onChange(e);
                              setValue('paymentMethod', e.target.value);
                            }}
                          >
                            {PAYMENT_METHODS.map((method) => {
                              const isSelected = paymentMethod === method.value;
                              return (
                                <FormControlLabel
                                  key={method.value}
                                  value={method.value}
                                  control={
                                    <Radio
                                      disabled={method.disabled}
                                      sx={{
                                        mr: 2,
                                        '&.Mui-disabled': {
                                          color: 'action.disabled'
                                        }
                                      }}
                                    />
                                  }
                                  label={
                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: 36,
                                          height: 36,
                                          borderRadius: 1,
                                          bgcolor: isSelected ? 'primary.main' : 'grey.100',
                                          color: isSelected ? 'white' : 'text.secondary',
                                          transition: 'all 0.2s ease-in-out',
                                        }}
                                      >
                                        {method.icon}
                                      </Box>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography
                                          variant="body1"
                                          fontWeight={isSelected ? 600 : 500}
                                          color={method.disabled ? 'text.disabled' : 'text.primary'}
                                        >
                                          {method.label}
                                        </Typography>
                                        {method.description && (
                                          <Typography
                                            variant="body2"
                                            color={method.disabled ? 'text.disabled' : 'text.secondary'}
                                            sx={{ lineHeight: 1.5 }}
                                          >
                                            {method.description}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  }
                                  disabled={method.disabled}
                                  sx={{
                                    m: 0,
                                    width: '100%',
                                    alignItems: 'flex-start',
                                    '& .MuiFormControlLabel-label': {
                                      width: '100%',
                                    },
                                  }}
                                />
                              );
                            })}
                          </RadioGroup>
                          {errors.paymentMethod && (
                            <FormHelperText>{errors.paymentMethod.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Payment Date and Reference Number - Same Row */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="paymentDate"
                      control={control}
                      rules={{ required: 'Payment date is required' }}
                      render={({ field }) => (
                        <DatePicker
                          label="Payment Date *"
                          value={field.value}
                          onChange={field.onChange}
                          maxDate={dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.paymentDate,
                              helperText: errors.paymentDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('referenceNumber')}
                      label="Reference Number"
                      fullWidth
                      placeholder="Check #, Transaction ID, etc."
                    />
                  </Grid>

                  {/* Processor Fee */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('processorFee')}
                      label="Processing Fee"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 0.01 }}
                      sx={{ mb: 0 }}
                    />
                  </Grid>

                  {/* Notes */}
                  <Grid size={12}>
                    <TextField
                      {...register('notes')}
                      label="Notes"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Additional notes about this payment..."
                      sx={{ mb: 0 }}
                    />
                  </Grid>

                  {/* Buttons */}
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                      <Button variant="outlined" onClick={() => navigate('/payments')} disabled={saving}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={saving || !selectedPatient || selectedInvoices.length === 0 || !paymentMethod}
                      >
                        {saving ? 'Recording...' : 'Record Payment'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Right Column - Summary Panel (Sticky) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                position: { md: 'sticky' },
                top: { md: 100 },
                maxHeight: { md: 'calc(100vh - 120px)' },
                overflow: 'auto',
                height: 'fit-content',
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Payment Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {selectedPatient ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Patient
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Outstanding Balance: <strong>{formatCurrency(selectedPatientBalance)}</strong>
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Selected Invoices
                    </Typography>
                    {selectedInvoices.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No invoices selected
                      </Typography>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        {selectedInvoices.map((invoice) => {
                          const invoiceId = invoice._id || invoice.id;
                          const amount = invoiceAmounts[invoiceId] || 0;
                          return (
                            <Box key={invoiceId} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2">{invoice.invoiceNumber}</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(amount)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        Total Payment
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {formatCurrency(totalAmount)}
                      </Typography>
                    </Box>
                    {paymentMethod && (
                      <Chip
                        label={PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label || paymentMethod}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Select a patient to see payment summary
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default RecordPaymentPage;
