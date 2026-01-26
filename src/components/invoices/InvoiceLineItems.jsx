import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Autocomplete,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { serviceCatalogService } from '../../services/service-catalog.service';

const InvoiceLineItems = ({ lineItems, onChange, disabled = false }) => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const result = await serviceCatalogService.getAllServices(1, 100, '', '', true);
        setServices(result.services || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddLine = () => {
    const newLine = {
      id: Date.now(),
      serviceId: '',
      service: null,
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
    };
    onChange([...lineItems, newLine]);
  };

  const handleRemoveLine = (index) => {
    const updated = lineItems.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleServiceChange = (index, service) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      serviceId: service?._id || service?.id || '',
      service: service,
      description: service?.name || '',
      unitPrice: service?.price || 0,
      total: calculateLineTotal(1, service?.price || 0, updated[index].discount),
    };
    onChange(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    // Recalculate total
    updated[index].total = calculateLineTotal(
      updated[index].quantity,
      updated[index].unitPrice,
      updated[index].discount
    );
    onChange(updated);
  };

  const calculateLineTotal = (quantity, unitPrice, discount) => {
    const subtotal = (quantity || 0) * (unitPrice || 0);
    return subtotal - (discount || 0);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, line) => sum + (line.total || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Line Items
        </Typography>
        {!disabled && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLine}
            variant="outlined"
            size="small"
          >
            Add Item
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ width: '35%' }}>Service</TableCell>
              <TableCell sx={{ width: '15%' }} align="center">Qty</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">Unit Price</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">Discount</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">Total</TableCell>
              {!disabled && <TableCell sx={{ width: '5%' }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={disabled ? 5 : 6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No items added. Click "Add Item" to add services.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              lineItems.map((line, index) => (
                <TableRow key={line.id || index}>
                  <TableCell>
                    {disabled ? (
                      <Typography>{line.description || line.service?.name || '-'}</Typography>
                    ) : (
                      <Autocomplete
                        size="small"
                        options={services}
                        loading={loadingServices}
                        getOptionLabel={(option) =>
                          option ? `${option.cptCode} - ${option.name}` : ''
                        }
                        value={line.service || null}
                        onChange={(_, newValue) => handleServiceChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search service..."
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          (option?._id || option?.id) === (value?._id || value?.id)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {disabled ? (
                      <Typography>{line.quantity}</Typography>
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        value={line.quantity}
                        onChange={(e) =>
                          handleFieldChange(index, 'quantity', parseInt(e.target.value, 10) || 1)
                        }
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        sx={{ width: 70 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {disabled ? (
                      <Typography>{formatCurrency(line.unitPrice)}</Typography>
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) =>
                          handleFieldChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                        sx={{ width: 120 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {disabled ? (
                      <Typography>{formatCurrency(line.discount)}</Typography>
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        value={line.discount}
                        onChange={(e) =>
                          handleFieldChange(index, 'discount', parseFloat(e.target.value) || 0)
                        }
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                        sx={{ width: 100 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {formatCurrency(line.total)}
                    </Typography>
                  </TableCell>
                  {!disabled && (
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveLine(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
            {lineItems.length > 0 && (
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell colSpan={disabled ? 3 : 4} align="right">
                  <Typography fontWeight="bold">Subtotal:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold" fontSize="1.1rem">
                    {formatCurrency(calculateSubtotal())}
                  </Typography>
                </TableCell>
                {!disabled && <TableCell />}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoiceLineItems;
