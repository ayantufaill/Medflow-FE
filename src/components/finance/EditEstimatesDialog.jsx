import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  TextField,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { invoiceService } from '../../services/invoice.service';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const EditEstimatesDialog = ({ onClose, invoiceId }) => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(data);
      // Map line items to local state for editing
      const initialItems = (data.lineItems || []).map(item => ({
        ...item,
        editWriteoff: Number(item.writeoff || 0).toFixed(2),
        editPtPortion: Number(item.ptPortion || 0).toFixed(2),
        editInsPortion: Number(item.insPortion || 0).toFixed(2),
        editTotalCharge: Number(item.totalPrice || item.total || 0).toFixed(2),
        editDeductible: '0.00' // Assuming no backend field exists currently
      }));
      setItems(initialItems);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (itemId, field, value) => {
    // Strip non-numeric except dot and minus for clean state update if desired, but we can just let user type
    const val = value.replace(/[^0-9.-]/g, '');
    setItems(prev => prev.map(item => {
      if (item.id === itemId || item._id === itemId) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update each item
      for (const item of items) {
        const itemId = item.id || item._id;
        if (!itemId) continue;

        const updates = {
          writeoff: Number(item.editWriteoff) || 0,
          ptPortion: Number(item.editPtPortion) || 0,
          insPortion: Number(item.editInsPortion) || 0,
          unitPrice: Number(item.editTotalCharge) || 0, // In backend unitPrice * qty = total, assuming qty=1
        };

        await invoiceService.updateInvoiceItem(invoiceId, itemId, updates);
      }

      onClose(); // Close on success
    } catch (err) {
      console.error('Error saving invoice items:', err);
      // optionally show toast
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '1200px', height: '400px', bgcolor: COLORS.WHITE, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const date = invoice?.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A';
  const patientName = invoice?.patient ? `${invoice.patient.firstName || ''} ${invoice.patient.lastName || ''}` : 'Patient';

  return (
    <Box sx={{ width: '1200px', bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '24px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <EditNoteOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Edit invoice #{invoice?.invoiceNumber || invoiceId}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
      </DialogTitle>

      {/* Sub-header */}
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', fontWeight: fontWeight.semiBold }}>
          {date}
        </Typography>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', fontWeight: fontWeight.semiBold }}>
          Invoice #{invoice?.invoiceNumber || invoiceId}: 
        </Typography>
        <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px', fontWeight: fontWeight.medium }}>
          for {patientName}
        </Typography>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: '24px', overflowY: 'auto' }}>
        <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.sm }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: COLORS.SURFACE_TINT }}>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '12px' } }}>
                <TableCell>DOS</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="center">Insurance</TableCell>
                <TableCell>Ins Writeoff</TableCell>
                <TableCell>Pt. Portion</TableCell>
                <TableCell>Deductible</TableCell>
                <TableCell>In. Portion</TableCell>
                <TableCell align="right">Total Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4, color: COLORS.TEXT_SECONDARY }}>
                    No items found on this invoice.
                  </TableCell>
                </TableRow>
              ) : items.map((item, index) => (
                <TableRow key={item.id || item._id} sx={{ '& td': { borderBottom: index === items.length - 1 ? 'none' : `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5, fontSize: '13px' } }}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{item.cptCode || '-'}</TableCell>
                  <TableCell>{item.description || 'Service'}</TableCell>
                  <TableCell>{item.provider || '-'}</TableCell>
                  <TableCell align="center">()</TableCell>
                  <TableCell>
                    <TextField 
                      variant="outlined" 
                      size="small"
                      value={`$${item.editWriteoff}`}
                      onChange={(e) => handleFieldChange(item.id || item._id, 'editWriteoff', e.target.value)}
                      sx={{ width: '80px', '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT } }} 
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      variant="outlined" 
                      size="small" 
                      value={`$${item.editPtPortion}`}
                      onChange={(e) => handleFieldChange(item.id || item._id, 'editPtPortion', e.target.value)}
                      sx={{ width: '80px', '& .MuiInputBase-root': { height: '32px', fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, bgcolor: COLORS.SURFACE_TINT } }} 
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      variant="outlined" 
                      size="small" 
                      value={`$${item.editDeductible}`}
                      onChange={(e) => handleFieldChange(item.id || item._id, 'editDeductible', e.target.value)}
                      sx={{ width: '80px', '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT } }} 
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      variant="outlined" 
                      size="small" 
                      value={`$${item.editInsPortion}`}
                      onChange={(e) => handleFieldChange(item.id || item._id, 'editInsPortion', e.target.value)}
                      sx={{ width: '80px', '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT } }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField 
                      variant="outlined" 
                      size="small" 
                      value={`$${item.editTotalCharge}`}
                      onChange={(e) => handleFieldChange(item.id || item._id, 'editTotalCharge', e.target.value)}
                      sx={{ width: '80px', '& .MuiInputBase-root': { height: '32px', fontSize: '13px', textAlign: 'right', fontWeight: fontWeight.semiBold, bgcolor: COLORS.SURFACE_TINT } }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          sx={{ 
            color: COLORS.ACCENT, 
            textDecoration: 'none', 
            fontWeight: fontWeight.medium,
            fontSize: '13px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          + Add description
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isSaving}
            sx={{ 
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY, 
              textTransform: 'none', 
              px: 3,
              borderRadius: radius.sm,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              height: '36px',
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={isSaving}
            sx={{ 
              bgcolor: COLORS.ACCENT, 
              color: COLORS.WHITE, 
              textTransform: 'none', 
              px: 3,
              boxShadow: 'none',
              borderRadius: radius.sm,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              height: '36px',
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            {isSaving ? 'Saving...' : 'Edit Invoice & Save'}
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default EditEstimatesDialog;
