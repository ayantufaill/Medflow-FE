import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import EditEstimatesDialog from './EditEstimatesDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { invoiceService } from '../../services/invoice.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../store/slices/providerSlice';

const EditInvoiceDetailsDialog = ({ onClose, invoiceId = '25136' }) => {
  const [showEstimates, setShowEstimates] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const dispatch = useDispatch();
  const providersList = useSelector(selectProviderDropdownList);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching invoice ID:', invoiceId);
      const data = await invoiceService.getInvoiceById(invoiceId);
      console.log('Fetched invoice data:', data);
      const initialItems = (data.lineItems || []).map(item => ({
        ...item,
        editDate: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '',
        editCptCode: item.cptCode || item.code || '',
        editSite: item.site || '',
        editDescription: item.description || '',
        editProvider: item.provider || '',
        editTotalCharge: Number(item.totalPrice || item.unitPrice || item.total || 0).toFixed(2),
        editDbi: item.dbi || false
      }));
      setItems(initialItems);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      setError(err.message || 'Failed to load invoice items');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (itemId, field, value) => {
    setItems(prev => prev.map(item => {
      const id = item.id || item._id;
      if (id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleTotalChargeChange = (itemId, value) => {
    const val = value.replace(/[^0-9.-]/g, '');
    handleFieldChange(itemId, 'editTotalCharge', val);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(items.map(item => item.id || item._id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelection = (itemId) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleDbi = () => {
    setItems(prev => prev.map(item => {
      const id = item.id || item._id;
      if (selectedItemIds.includes(id)) {
        return { ...item, editDbi: !item.editDbi };
      }
      return item;
    }));
    // Optionally clear selection after toggling
    setSelectedItemIds([]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      for (const item of items) {
        const itemId = item.id || item._id;
        if (!itemId) continue;

        const updates = {
          provider: item.editProvider || undefined,
          unitPrice: Number(item.editTotalCharge) || 0,
          dbi: item.editDbi
        };

        await invoiceService.updateInvoiceItem(invoiceId, itemId, updates);
      }

      await invoiceService.recalculateInvoice(invoiceId);
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
      onClose();
    } catch (err) {
      console.error('Error saving invoice details:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const ProviderDropdown = ({ value, onChange }) => {
    return (
      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        variant="outlined"
        size="small"
        MenuProps={{ 
          style: { zIndex: 150000 }, 
          sx: { zIndex: 150000 },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" }
        }}
        renderValue={(selected) => {
          if (!selected) return "Sel";
          return selected.substring(0, 2).toUpperCase();
        }}
        sx={{
          bgcolor: "white",
          color: COLORS.TEXT_PRIMARY,
          borderRadius: "4px",
          fontSize: "12px",
          width: "70px",
          "& .MuiSelect-select": {
            py: 0.5,
            px: 1,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiSvgIcon-root": {
            color: COLORS.TEXT_SECONDARY,
            fontSize: "16px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.BORDER,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: '#9ca3af',
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.ACCENT,
          }
        }}
      >
        <MenuItem value="" disabled sx={{ fontSize: "12px" }}>
          <em>Select Provider</em>
        </MenuItem>
        {providersList.map((p) => {
          const firstName = p.userId?.firstName || p.firstName || "";
          const lastName = p.userId?.lastName || p.lastName || "";
          const name =
            `${firstName} ${lastName}`.trim() ||
            p.name ||
            `Provider ${p._id || p.id}`;
          return (
            <MenuItem
              key={p._id || p.id}
              value={name}
              sx={{ fontSize: "12px" }}
            >
              {name}
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  return (
    <Box sx={{ width: '1000px', bgcolor: '#fff', borderRadius: radius.md, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
      {/* Header */}
      <Box 
        sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <ReceiptIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Edit invoice #{invoiceId}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: '24px', flex: 1, overflowY: 'auto' }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowEstimates(true)}
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #f97316", color: "#f97316",
              px: "16px", py: "4px", bgcolor: 'white',
              "&:hover": { borderColor: "#ea6c00", backgroundColor: "#fff7ed" }
            }}
          >
            Re-estimate
          </Button>
        </Stack>

        <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.sm }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: COLORS.SURFACE_TINT }}>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '12px' } }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small" 
                    checked={items.length > 0 && selectedItemIds.length === items.length}
                    indeterminate={selectedItemIds.length > 0 && selectedItemIds.length < items.length}
                    onChange={handleSelectAll}
                    sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT }, '&.MuiCheckbox-indeterminate': { color: COLORS.ACCENT } }} 
                  />
                </TableCell>
                <TableCell>DOS</TableCell>
                <TableCell>Procedure</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="right">Total Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ color: COLORS.ACCENT }} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'red' }}>
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: COLORS.TEXT_SECONDARY }}>
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const id = item.id || item._id;
                  const isSelected = selectedItemIds.includes(id);

                  return (
                    <TableRow key={id} sx={{ '& td': { borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5, fontSize: '13px', color: COLORS.TEXT_PRIMARY } }}>
                      <TableCell padding="checkbox">
                        <Checkbox 
                          size="small" 
                          checked={isSelected}
                          onChange={() => handleToggleSelection(id)}
                          sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} 
                        />
                      </TableCell>
                      <TableCell>{item.editDate || '-'}</TableCell>
                      <TableCell>{item.editCptCode || '-'}</TableCell>
                      <TableCell>{item.editSite || '-'}</TableCell>
                      <TableCell>{item.editDescription || 'Service'}</TableCell>
                      <TableCell>
                        <ProviderDropdown 
                          value={item.editProvider} 
                          onChange={(val) => handleFieldChange(id, 'editProvider', val)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField 
                          size="small" 
                          value={item.editTotalCharge}
                          onChange={(e) => handleTotalChargeChange(id, e.target.value)}
                          variant="outlined"
                          sx={{ 
                            width: '80px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiInputBase-input': { textAlign: 'right' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3, pt: 2, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Button 
            variant="outlined" 
            onClick={handleToggleDbi}
            disabled={selectedItemIds.length === 0}
            sx={{ 
              borderColor: COLORS.BORDER, 
              color: COLORS.TEXT_PRIMARY, 
              textTransform: 'none', 
              minWidth: '60px',
              height: '36px',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
            }}
          >
            DBI
          </Button>

          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="contained"
              onClick={handleSave}
              disabled={isSaving || loading}
              sx={{ 
                bgcolor: COLORS.ACCENT, 
                color: COLORS.WHITE, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                boxShadow: 'none',
                borderRadius: radius.sm,
                '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: 'rgba(59, 130, 246, 0.5)', color: '#fff' }
              }}
            >
              {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                borderColor: COLORS.BORDER, 
                color: COLORS.TEXT_PRIMARY, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Edit Estimates Dialog Overlay */}
      {showEstimates && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 140000
          }}
          onClick={() => setShowEstimates(false)}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <EditEstimatesDialog 
              onClose={() => setShowEstimates(false)} 
              invoiceId={invoiceId}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditInvoiceDetailsDialog;
