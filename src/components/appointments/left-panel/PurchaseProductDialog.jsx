import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Box,
  Link,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Close as CloseIcon, ShoppingCart as ShoppingCartIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { patientService } from '../../../services/patient.service';
import { useSnackbar } from '../../../contexts/SnackbarContext';

import { usePatient, useScheduleState } from '../../../hooks/redux';

const PRODUCTS = [
  'FI- Varnish',
  'Environmental Therapy (Oral rinse)',
  'Toothpaste',
  'Caries management system',
  'Erosion management system',
  'Whitening',
  'Mechanical toothbrush',
  'Xerostomia management system',
  'TDS Membership',
  'Toothpaste (1.1% NaF)'
];

const PurchaseProductDialog = ({ open, onClose, patientId: propPatientId }) => {
  const dispatch = useDispatch();
  const providers = useSelector(selectProviderDropdownList) || [];
  const { showSnackbar } = useSnackbar();
  
  const { currentPatient } = usePatient();
  const { selectedAppointment } = useScheduleState();

  const resolvedPatientId = 
    propPatientId ||
    currentPatient?._id || 
    currentPatient?.id || 
    currentPatient?.PatNum ||
    (selectedAppointment?.patientId && typeof selectedAppointment.patientId === 'object' ? (selectedAppointment.patientId._id || selectedAppointment.patientId.id || selectedAppointment.patientId.PatNum) : selectedAppointment?.patientId) || 
    (selectedAppointment?.patient && typeof selectedAppointment.patient === 'object' ? (selectedAppointment.patient._id || selectedAppointment.patient.id || selectedAppointment.patient.PatNum) : selectedAppointment?.patient);

  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    if (open) {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [open, dispatch]);

  const handleClose = () => {
    setRows([]);
    onClose();
  };

  const getProviderName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || '';
    const last  = p.userId?.lastName  || p.lastName  || p.LName  || '';
    return `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
  };

  const getPrice = (product) => {
    if (product === 'Mechanical toothbrush') return 150;
    if (product === 'Toothpaste') return 25;
    return 0;
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), product: '', provider: '', quantity: '1', isBought: false }]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const [buyingRowId, setBuyingRowId] = useState(null);

  const handleBuy = async (row) => {
    if (!resolvedPatientId) {
      showSnackbar("Patient ID is missing. Cannot purchase.", "error");
      return;
    }
    try {
      setBuyingRowId(row.id);
      const unitPrice = getPrice(row.product);
      const parsedQuantity = parseInt(row.quantity, 10) || 0;
      
      const payload = {
        productName: row.product,
        providerName: row.provider,
        quantity: parsedQuantity,
        price: unitPrice
      };
      
      await patientService.purchaseProducts(resolvedPatientId, [payload]);
      showSnackbar(`Successfully purchased ${row.product}`, "success");
      updateRow(row.id, 'isBought', true);
    } catch (error) {
      console.error("Error purchasing product:", error);
      showSnackbar(error.response?.data?.message || "Failed to purchase product", "error");
    } finally {
      setBuyingRowId(null);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          m: 2,
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Select Products & Quantity
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: rows.length === 0 ? '0px' : '24px' }}>
        {rows.length === 0 ? (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: fontSize.base, mb: 1 }}>
              No suggested product to patient
            </Typography>
            <Link 
              component="button"
              variant="body2"
              onClick={handleAddRow}
              sx={{ 
                color: COLORS.ACCENT, 
                textDecoration: 'none',
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              + Add product
            </Link>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'hidden' }}>
            <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '24%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Product Name</TableCell>
                  <TableCell sx={{ width: '18%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Product Choice</TableCell>
                  <TableCell sx={{ width: '18%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Provider</TableCell>
                  <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Price</TableCell>
                  <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Quantity</TableCell>
                  <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>Total Price</TableCell>
                  <TableCell sx={{ width: '10%', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const unitPrice = getPrice(row.product);
                  const parsedQuantity = parseInt(row.quantity, 10) || 0;
                  const totalPrice = unitPrice * parsedQuantity;

                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Select
                          size="small"
                          displayEmpty
                          value={row.product}
                          onChange={(e) => updateRow(row.id, 'product', e.target.value)}
                          MenuProps={{ sx: { zIndex: 1600 } }}
                          sx={{ 
                            width: '100%', 
                            height: 36,
                            fontSize: '13px',
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            color: '#09121f',
                            backgroundColor: '#fafbfe',
                            borderRadius: '4px',
                            '& .MuiSelect-select': {
                              py: 1,
                              pl: 2,
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              pr: '32px !important'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0'
                            }
                          }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select product</MenuItem>
                          {PRODUCTS.map(p => (
                            <MenuItem key={p} value={p} sx={{ fontSize: '13px' }}>{p}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Typography sx={{ fontSize: fontSize.sm }}>
                          {row.product === 'Mechanical toothbrush' ? 'Sonicare' : 
                           row.product === 'Toothpaste' ? 'CariFree CTx4 Gel 5000' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Select
                          size="small"
                          displayEmpty
                          value={row.provider}
                          onChange={(e) => updateRow(row.id, 'provider', e.target.value)}
                          MenuProps={{ sx: { zIndex: 1600 } }}
                          sx={{ 
                            width: '100%', 
                            height: 36,
                            fontSize: '13px',
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            color: '#09121f',
                            backgroundColor: '#fafbfe',
                            borderRadius: '4px',
                            '& .MuiSelect-select': {
                              py: 1,
                              pl: 2,
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              pr: '32px !important'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0'
                            }
                          }}
                        >
                          <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select provider</MenuItem>
                          {providers.map(provider => {
                            const pName = getProviderName(provider);
                            return (
                              <MenuItem key={provider._id} value={pName} sx={{ fontSize: '13px' }}>
                                {pName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Typography sx={{ fontSize: fontSize.sm }}>
                          {unitPrice > 0 ? `$${unitPrice.toFixed(2)}` : '-------'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <TextField 
                          size="small" 
                          sx={{ width: '100%', minWidth: '60px' }} 
                          value={row.quantity}
                          onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Typography sx={{ fontSize: fontSize.sm }}>
                          {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : '-------'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        {row.product ? (
                          row.isBought ? (
                            <CheckCircleIcon sx={{ color: '#4ade80', fontSize: '24px', ml: 1 }} />
                          ) : (
                            <Button 
                              variant="contained"
                              onClick={() => handleBuy(row)}
                              disabled={buyingRowId === row.id || !row.product || !row.provider || !row.quantity}
                              sx={{ 
                                backgroundColor: '#cda87c', 
                                color: COLORS.WHITE,
                                textTransform: 'none',
                                minWidth: '60px',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#b89467', boxShadow: 'none' },
                                '&:disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' }
                              }}
                            >
                              {buyingRowId === row.id ? '...' : 'buy'}
                            </Button>
                          )
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, ml: 2, pb: 2 }}>
              <Link 
                component="button"
                variant="body2"
                onClick={handleAddRow}
                sx={{ 
                  color: COLORS.ACCENT, 
                  textDecoration: 'none',
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                + Add product
              </Link>
            </Box>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          p: '16px 24px', 
          borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, 
          backgroundColor: COLORS.SURFACE_CARD 
        }}
      >
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            backgroundColor: COLORS.ACCENT, 
            color: COLORS.WHITE,
            textTransform: 'none',
            fontWeight: fontWeight.semibold,
            px: 3,
            py: 0.75,
            borderRadius: radius.md,
            boxShadow: 'none',
            '&:hover': { 
              backgroundColor: COLORS.ACCENT_HOVER,
              boxShadow: 'none'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseProductDialog;
