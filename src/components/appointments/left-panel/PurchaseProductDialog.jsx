import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
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
import { fontSize, fontWeight } from '../../../constants/styles';
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

  const [rows, setRows] = useState([{ id: Date.now(), product: '', provider: '', quantity: '1', isBought: false }]);
  
  useEffect(() => {
    if (open) {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [open, dispatch]);

  const handleClose = () => {
    setRows([{ id: Date.now(), product: '', provider: '', quantity: '1', isBought: false }]);
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
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <ShoppingCartIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Select Products & Quantity
          </Typography>
        </Box>

        <IconButton onClick={handleClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: '24px', pt: '24px !important' }}>
        <TableContainer sx={{ overflowX: 'hidden', border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: '8px' }}>
          <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ width: '24%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Product Name</TableCell>
                <TableCell sx={{ width: '18%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Product Choice</TableCell>
                <TableCell sx={{ width: '18%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Provider</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Price</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Quantity</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 600, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, color: '#475569' }}>Total Price</TableCell>
                <TableCell sx={{ width: '10%', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 2 }}>
                      No suggested product to patient
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={handleAddRow}
                      sx={{ 
                        color: "#2262ef", 
                        borderColor: "#2262ef",
                        textTransform: 'none',
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        borderRadius: "6px",
                        '&:hover': { backgroundColor: "#eff6ff", borderColor: "#1b52cf" }
                      }}
                    >
                      + Add product
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
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
                          MenuProps={{ 
                            sx: { zIndex: 1600 },
                            PaperProps: {
                              sx: {
                                mt: 1,
                                borderRadius: '8px',
                                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                border: '1px solid #e0e5eb',
                                p: '4px',
                                '& .MuiMenuItem-root': {
                                  fontSize: '13px',
                                  fontFamily: 'Inter',
                                  color: '#374151',
                                  borderRadius: '6px',
                                  mx: '4px',
                                  my: '2px',
                                  '&:hover': { backgroundColor: '#f3f8fd', color: '#2262ef' },
                                  '&.Mui-selected': { backgroundColor: '#eff6ff', color: '#2262ef', fontWeight: 600 },
                                  '&.Mui-selected:hover': { backgroundColor: '#e0edff' }
                                }
                              }
                            }
                          }}
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
                          MenuProps={{ 
                            sx: { zIndex: 1600 },
                            PaperProps: {
                              sx: {
                                mt: 1,
                                borderRadius: '8px',
                                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                border: '1px solid #e0e5eb',
                                p: '4px',
                                '& .MuiMenuItem-root': {
                                  fontSize: '13px',
                                  fontFamily: 'Inter',
                                  color: '#374151',
                                  borderRadius: '6px',
                                  mx: '4px',
                                  my: '2px',
                                  '&:hover': { backgroundColor: '#f3f8fd', color: '#2262ef' },
                                  '&.Mui-selected': { backgroundColor: '#eff6ff', color: '#2262ef', fontWeight: 600 },
                                  '&.Mui-selected:hover': { backgroundColor: '#e0edff' }
                                }
                              }
                            }
                          }}
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
                                backgroundColor: '#2262ef', 
                                color: COLORS.WHITE,
                                textTransform: 'none',
                                minWidth: '60px',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#1b52cf', boxShadow: 'none' },
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
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="text" 
              onClick={handleAddRow}
              sx={{ 
                color: COLORS.ACCENT, 
                textTransform: 'none',
                fontWeight: fontWeight.semibold,
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
              }}
            >
              + Add product
            </Button>
          </Box>
        )}
      </DialogContent>
      
      <Box sx={{ p: "12px 24px", borderTop: '1px solid #e0e5eb', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', mt: 'auto', flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleClose}
          sx={{ 
            borderColor: "#d0d5dd",
            color: "#374151",
            fontFamily: "Inter",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            textTransform: "none",
            borderRadius: "8px",
            px: "16px", py: "7px",
            height: 36,
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default PurchaseProductDialog;
