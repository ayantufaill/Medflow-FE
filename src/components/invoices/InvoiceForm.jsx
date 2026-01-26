import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { patientService } from '../../services/patient.service';
import { providerService } from '../../services/provider.service';

const InvoiceForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [lineItems, setLineItems] = useState(initialData?.lineItems || []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      dateOfService: dayjs(),
      dueDate: dayjs().add(30, 'day'),
      notes: '',
    },
  });

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const result = await patientService.getAllPatients(1, 100, '', 'active');
        setPatients(result.patients || []);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true);
        const result = await providerService.getAllProviders(1, 100, '', true);
        setProviders(result.providers || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  // Line item handlers
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), description: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const updateLineItem = (id, field, value) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Auto-calculate total
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeLineItem = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const handleFormSubmit = (data) => {
    const invoiceData = {
      ...data,
      patientId: selectedPatient?._id || selectedPatient?.id,
      providerId: selectedProvider?._id || selectedProvider?.id,
      dateOfService: dayjs(data.dateOfService).format('YYYY-MM-DD'),
      dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
      lineItems: lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      totalAmount: calculateTotal(),
    };
    onSubmit(invoiceData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          {/* Row 1: Patient, Provider */}
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
                  placeholder="Search patient..."
                  error={!selectedPatient && !!errors.patientId}
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={providers}
              loading={loadingProviders}
              getOptionLabel={(option) => {
                if (!option) return '';
                const firstName = option.userId?.firstName || '';
                const lastName = option.userId?.lastName || '';
                return `${firstName} ${lastName}`.trim();
              }}
              value={selectedProvider}
              onChange={(_, newValue) => setSelectedProvider(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Provider *"
                  placeholder="Search provider..."
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

          {/* Row 2: Dates */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dateOfService"
              control={control}
              rules={{ required: 'Date of service is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Date of Service *"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateOfService,
                      helperText: errors.dateOfService?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dueDate"
              control={control}
              rules={{ required: 'Due date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Due Date *"
                  value={field.value}
                  onChange={field.onChange}
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

          {/* Line Items Section */}
          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Line Items
              </Typography>
              <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={addLineItem}>
                Add Item
              </Button>
            </Box>

            {lineItems.length === 0 ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  bgcolor: 'grey.50',
                  borderStyle: 'dashed',
                }}
              >
                <Typography color="text.secondary" gutterBottom>
                  No items added yet
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addLineItem}>
                  Add First Item
                </Button>
              </Paper>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600, width: '30%' }}>Service / Description</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, width: '20%' }}>Unit Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, width: '20%' }}>Amount</TableCell>
                      <TableCell sx={{ width: '15%' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Enter service description"
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': { 
                                bgcolor: 'background.paper',
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            variant="outlined"
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            sx={{ width: '80px', mx: 'auto', display: 'block' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            variant="outlined"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{ width: '120px', ml: 'auto', display: 'block' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(item.total)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => removeLineItem(item.id)}
                            sx={{ '&:hover': { bgcolor: 'error.lighter' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Summary Section */}
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal ({lineItems.length} item{lineItems.length !== 1 ? 's' : ''})
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {formatCurrency(calculateTotal())}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TableContainer>
            )}
          </Grid>

          {/* Notes */}
          <Grid size={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Additional notes..."
                />
              )}
            />
          </Grid>

          {/* Buttons */}
          {!hideButtons && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button type="button" variant="outlined" onClick={handleBack} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading || !selectedPatient || lineItems.length === 0}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default InvoiceForm;
