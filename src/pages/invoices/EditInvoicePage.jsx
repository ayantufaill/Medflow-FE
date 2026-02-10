import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { invoiceService } from '../../services/invoice.service';
import { insuranceCompanyService } from '../../services/insurance.service';

const EditInvoicePage = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ description: '', quantity: '', unitPrice: '' });
  const [addingItem, setAddingItem] = useState(false);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loadingInsurance, setLoadingInsurance] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const [invoiceData, insResult] = await Promise.all([
          invoiceService.getInvoiceById(invoiceId),
          insuranceCompanyService.getAllInsuranceCompanies(1, 100, '', 'active').catch(() => ({ companies: [] })),
        ]);
        setInvoice(invoiceData);
        setInsuranceCompanies(insResult.companies || []);
        const ins = invoiceData?.insuranceCompany || invoiceData?.insuranceCompanyId;
        const insId = ins?._id ?? ins?.id ?? invoiceData?.insuranceCompanyId;
        const selected = ins && (ins.name || insId)
          ? (insResult.companies?.find((c) => (c._id || c.id) === insId) || ins)
          : null;
        setSelectedInsurance(selected);
        reset({
          dueDate: invoiceData.dueDate ? dayjs(invoiceData.dueDate) : dayjs().add(30, 'day'),
          notes: invoiceData.notes || '',
        });
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load invoice.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId, reset]);

  const handleFormSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await invoiceService.updateInvoice(invoiceId, {
        dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
        notes: data.notes || undefined,
        insuranceCompanyId: selectedInsurance ? (selectedInsurance._id || selectedInsurance.id) : undefined,
      });
      showSnackbar('Invoice updated successfully', 'success');
      navigate(`/invoices/${invoiceId}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update invoice.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    const quantity = parseInt(newItem.quantity) || 1;
    const unitPrice = parseFloat(newItem.unitPrice) || 0;

    if (!newItem.description || unitPrice <= 0) {
      showSnackbar('Please enter description and price', 'warning');
      return;
    }

    try {
      setAddingItem(true);
      await invoiceService.addInvoiceItem(invoiceId, {
        description: newItem.description,
        quantity: quantity,
        unitPrice: unitPrice,
      });
      // Refresh invoice
      const updatedInvoice = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(updatedInvoice);
      setNewItem({ description: '', quantity: '', unitPrice: '' });
      showSnackbar('Item added successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to add item', 'error');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await invoiceService.deleteInvoiceItem(invoiceId, itemId);
      // Refresh invoice
      const updatedInvoice = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(updatedInvoice);
      showSnackbar('Item deleted', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to delete item', 'error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  const canEdit = invoice?.status === 'draft' || invoice?.status === 'pending';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/invoices/${invoiceId}`)}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Edit Invoice {invoice?.invoiceNumber}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {!canEdit && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This invoice cannot be edited because its status is "{invoice?.status}".
          </Alert>
        )}

        {/* Invoice Info Header */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Patient</Typography>
              <Typography variant="body1" fontWeight="medium">
                {invoice?.patient?.firstName} {invoice?.patient?.lastName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Provider</Typography>
              <Typography variant="body1">
                {invoice?.provider?.userId?.firstName} {invoice?.provider?.userId?.lastName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Date of Service</Typography>
              <Typography variant="body1">
                {invoice?.dateOfService ? dayjs(invoice.dateOfService).format('MMM DD, YYYY') : '-'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {invoice?.status}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
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
                      disabled={!canEdit}
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={insuranceCompanies}
                  loading={loadingInsurance}
                  getOptionLabel={(opt) => (opt ? opt.name || '' : '')}
                  value={selectedInsurance}
                  onChange={(_, newValue) => setSelectedInsurance(newValue)}
                  disabled={!canEdit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Insurance"
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
                  noOptionsText="No insurance companies found"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  {...register('notes')}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  disabled={!canEdit}
                />
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={() => navigate(`/invoices/${invoiceId}`)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving || !canEdit}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Line Items Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Line Items
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, width: '100px' }}>Qty</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, width: '120px' }}>Unit Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, width: '120px' }}>Total</TableCell>
                  {canEdit && <TableCell sx={{ width: '60px' }}></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice?.lineItems?.map((item) => (
                  <TableRow key={item._id || item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.total || item.quantity * item.unitPrice)}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item._id || item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {(!invoice?.lineItems || invoice.lineItems.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 5 : 4} align="center">
                      <Typography color="text.secondary">No items</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Item */}
          {canEdit && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add New Item
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Qty"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    inputProps={{ min: 1 }}
                    placeholder="1"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Unit Price"
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="0.00"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={addingItem ? <CircularProgress size={16} /> : <AddIcon />}
                    onClick={handleAddItem}
                    disabled={addingItem}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {formatCurrency(invoice?.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default EditInvoicePage;
