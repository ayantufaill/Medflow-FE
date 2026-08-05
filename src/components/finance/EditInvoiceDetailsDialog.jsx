import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import EditEstimatesDialog from './EditEstimatesDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { invoiceService } from '../../services/invoice.service';

const EditInvoiceDetailsDialog = ({ onClose, invoiceId = '25136' }) => {
  const [showEstimates, setShowEstimates] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

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
          date: item.editDate || undefined,
          cptCode: item.editCptCode || undefined,
          site: item.editSite || undefined,
          description: item.editDescription || undefined,
          provider: item.editProvider || undefined,
          unitPrice: Number(item.editTotalCharge) || 0,
          dbi: item.editDbi
        };

        await invoiceService.updateInvoiceItem(invoiceId, itemId, updates);
      }

      onClose();
    } catch (err) {
      console.error('Error saving invoice details:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: '1000px', bgcolor: '#fff', borderRadius: radius.md, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: COLORS.SURFACE_TINT, borderBottom: `1px solid ${COLORS.BORDER}`, p: 2, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <Typography variant="subtitle1" sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semiBold, fontSize: '15px' }}>
          Edit invoice #{invoiceId}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: '24px', flex: 1, overflowY: 'auto' }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowEstimates(true)}
            sx={{ 
              bgcolor: COLORS.ACCENT, 
              color: COLORS.WHITE, 
              textTransform: 'none', 
              px: 2, 
              height: '32px',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              boxShadow: 'none',
              borderRadius: radius.sm,
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            Edit Estimates
          </Button>
        </Stack>

        <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '6px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.SURFACE_TINT, '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', whiteSpace: 'nowrap' } }}>
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
                    <TableRow key={id} sx={{ '& td': { borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5, fontSize: '13px', color: COLORS.TEXT_PRIMARY }, bgcolor: item.editDbi ? 'rgba(239, 68, 68, 0.05)' : 'inherit' }}>
                      <TableCell padding="checkbox">
                        <Checkbox 
                          size="small" 
                          checked={isSelected}
                          onChange={() => handleToggleSelection(id)}
                          sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          size="small" 
                          value={item.editDate} 
                          onChange={(e) => handleFieldChange(id, 'editDate', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            width: '100px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          size="small" 
                          value={item.editCptCode} 
                          onChange={(e) => handleFieldChange(id, 'editCptCode', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            width: '80px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          size="small" 
                          value={item.editSite} 
                          onChange={(e) => handleFieldChange(id, 'editSite', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            width: '70px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          size="small" 
                          value={item.editDescription} 
                          onChange={(e) => handleFieldChange(id, 'editDescription', e.target.value)}
                          variant="outlined"
                          fullWidth
                          sx={{ 
                            minWidth: '200px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          size="small" 
                          value={item.editProvider} 
                          onChange={(e) => handleFieldChange(id, 'editProvider', e.target.value)}
                          variant="outlined"
                          placeholder="e.g. SAB"
                          sx={{ 
                            width: '80px',
                            '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                          }} 
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
              variant="outlined" 
              sx={{ 
                borderColor: COLORS.ACCENT, 
                color: COLORS.ACCENT, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                '&:hover': { borderColor: COLORS.ACCENT_HOVER, bgcolor: 'rgba(59, 130, 246, 0.04)' }
              }}
            >
              Re-estimate
            </Button>
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
