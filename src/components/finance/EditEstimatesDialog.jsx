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
  CircularProgress,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { invoiceService } from '../../services/invoice.service';
import CurrencyInput from './CurrencyInput';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const EditEstimatesDialog = ({ onClose, invoiceId }) => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [primaryInsName, setPrimaryInsName] = useState('');
  const [secondaryInsName, setSecondaryInsName] = useState('');
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
      // Prefer the patient's active coverages (what the estimator priced
      // against), keyed by ordinal. Fall back to the invoice's own recorded
      // carriers, which are only populated for some creation paths.
      const coverages = data?.coverages || [];
      const byType = (type) =>
        coverages.find((c) => String(c.insuranceType || '').toLowerCase() === type)?.name || '';
      setPrimaryInsName(
        byType('primary') || data?.insuranceCompany?.name || ''
      );
      setSecondaryInsName(
        byType('secondary') || data?.secondaryInsuranceCompany?.name || ''
      );
      // Map line items to local state for editing
      const initialItems = (data.lineItems || []).map(item => ({
        ...item,
        editWriteoff: Number(item.writeoff || 0).toFixed(2),
        editPtPortion: Number(item.ptPortion || 0).toFixed(2),
        editPrimaryInsPortion: Number(item.primaryInsPortion || 0).toFixed(2),
        editSecondaryInsPortion: Number(item.secondaryInsPortion || 0).toFixed(2),
        // Deductible is a real calculated value on the line (deductibleApplied);
        // it was previously hardcoded to 0.00 and never surfaced.
        editDeductible: Number(item.deductibleApplied || 0).toFixed(2),
        editTotalCharge: Number(item.totalPrice || item.total || 0).toFixed(2),
        // Write-off starts applied. Unticking it zeroes the stored write-off on
        // save rather than merely hiding it, so the toggle means something.
        applyInsWriteoff: true
      }));
      setItems(initialItems);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (itemId, field, value) => {
    // Booleans (the Apply Ins Writeoff toggle) pass through untouched; only the
    // currency fields get the non-numeric strip.
    const val = typeof value === 'boolean' ? value : value.replace(/[^0-9.-]/g, '');
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
          // Unticking "Apply Ins Writeoff" writes a zero write-off rather than
          // leaving the previous one in place.
          writeoff: item.applyInsWriteoff ? Number(item.editWriteoff) || 0 : 0,
          ptPortion: Number(item.editPtPortion) || 0,
          // The two coverages are stored as separate portions, matching how the
          // rows are now displayed and how EditInvoiceDetailsDialog saves.
          insPortion: Number(item.editPrimaryInsPortion) || 0,
          secondaryInsPortion: Number(item.editSecondaryInsPortion) || 0,
          unitPrice: Number(item.editTotalCharge) || 0, // In backend unitPrice * qty = total, assuming qty=1
        };

        await invoiceService.updateInvoiceItem(invoiceId, itemId, updates);
      }

      await invoiceService.recalculateInvoice(invoiceId);
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
      onClose(); // Close on success
    } catch (err) {
      console.error('Error saving invoice items:', err);
      // optionally show toast
    } finally {
      setIsSaving(false);
    }
  };


  /**
   * The coverage rows to render for one procedure.
   *
   * A procedure is split into one row per coverage that actually applied to it,
   * primary first. Insurance amounts decide this: a line with no secondary
   * portion gets a single primary row (which also covers a self-pay line, where
   * the insurance name simply shows as a dash), and a secondary portion adds a
   * second row. A line where only the secondary paid gets just that row.
   */
  const coverageRowsFor = (item) => {
    const primary = Number(item.editPrimaryInsPortion || 0);
    const secondary = Number(item.editSecondaryInsPortion || 0);
    const hasSecondary = secondary > 0;
    const hasPrimary = primary > 0 || !hasSecondary;

    // A line that no insurance actually paid for must not be labelled with a
    // carrier name, even on an invoice that has one — otherwise a self-pay
    // procedure reads as if coverage applied.
    const isSelfPay = primary + secondary <= 0;

    const rows = [];
    if (hasPrimary) {
      rows.push({
        key: 'primary',
        label: isSelfPay ? 'No insurance applied' : 'Primary',
        name: isSelfPay ? 'Self-Pay' : (primaryInsName || '—'),
        insPortion: primary,
        // Procedure-level figures are attributed to the primary coverage and
        // left blank on the secondary row, so nothing is double-counted.
        showProcedureFields: true,
      });
    }
    if (hasSecondary) {
      rows.push({
        key: 'secondary',
        label: 'Secondary',
        name: secondaryInsName || '—',
        insPortion: secondary,
        showProcedureFields: false,
      });
    }
    return rows;
  };

  if (loading) {
    return (
      <Box sx={{ width: '1600px', maxWidth: '95vw', height: '400px', bgcolor: COLORS.WHITE, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const date = invoice?.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A';
  const patientName = invoice?.patient ? `${invoice.patient.firstName || ''} ${invoice.patient.lastName || ''}` : 'Patient';

  return (
    <Box sx={{ width: '1600px', maxWidth: '95vw', bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
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
        <Typography sx={{ fontSize: '15px', fontWeight: "bold", color: COLORS.TEXT_PRIMARY, flex: 1 }}>
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
                <TableCell>Insurance</TableCell>
                <TableCell>Ins Writeoff</TableCell>
                <TableCell align="center">Apply Ins Writeoff</TableCell>
                <TableCell>Pt. Portion</TableCell>
                <TableCell>Deductible</TableCell>
                <TableCell>In. Portion</TableCell>
                {/* Divider separating the per-coverage money columns from the
                    procedure-level total. */}
                <TableCell align="right" sx={{ borderLeft: `1px solid ${COLORS.BORDER}` }}>
                  Total Charge
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4, color: COLORS.TEXT_SECONDARY }}>
                    No items found on this invoice.
                  </TableCell>
                </TableRow>
              ) : items.flatMap((item, index) => {
                const itemId = item.id || item._id;
                const rows = coverageRowsFor(item);
                const isLastItem = index === items.length - 1;

                return rows.map((row, rowIdx) => {
                  const isLastRowOfItem = rowIdx === rows.length - 1;
                  const editField = (field, value) => handleFieldChange(itemId, field, value);
                  const moneyInput = (field) => (
                    <CurrencyInput
                      value={item[field]}
                      onChange={(v) => editField(field, v)}
                    />
                  );
                  // Placeholder dash occupying the same box as a real input, so
                  // a column holding an input on one row and a dash on the next
                  // stays aligned.
                  const blank = <CurrencyInput blank />;

                  return (
                    <TableRow
                      key={`${itemId}-${row.key}`}
                      sx={{
                        '& td': {
                          borderBottom:
                            isLastItem && isLastRowOfItem ? 'none' : `1px solid ${COLORS.BORDER_LIGHT}`,
                          py: 1.5,
                          fontSize: '13px',
                        },
                      }}
                    >
                      {/* DOS / Code / Treatment / Provider identify the
                          PROCEDURE, so they are printed once, on the first
                          coverage row. Keying off rowIdx rather than
                          row.key === 'primary' matters: a procedure where only
                          the secondary paid has no primary row, and would
                          otherwise show no identity at all. */}
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>{rowIdx === 0 ? date : ''}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>{rowIdx === 0 ? (item.cptCode || '-') : ''}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>{rowIdx === 0 ? (item.description || 'Service') : ''}</TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY }}>{rowIdx === 0 ? (item.provider || '-') : ''}</TableCell>

                      <TableCell>
                        <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>{row.name}</Typography>
                        <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_SECONDARY }}>{row.label}</Typography>
                      </TableCell>

                      <TableCell>
                        {row.showProcedureFields ? (
                          <CurrencyInput
                            value={item.editWriteoff}
                            onChange={(v) => editField('editWriteoff', v)}
                            disabled={!item.applyInsWriteoff}
                          />
                        ) : blank}
                      </TableCell>

                      <TableCell align="center">
                        {row.showProcedureFields ? (
                          <Checkbox
                            size="small"
                            checked={Boolean(item.applyInsWriteoff)}
                            onChange={(e) => editField('applyInsWriteoff', e.target.checked)}
                            sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
                          />
                        ) : null}
                      </TableCell>

                      <TableCell>{row.showProcedureFields ? moneyInput('editPtPortion') : blank}</TableCell>

                      <TableCell>
                        {row.showProcedureFields ? (
                          <CurrencyInput value={item.editDeductible} disabled />
                        ) : blank}
                      </TableCell>

                      <TableCell>
                        {row.key === 'primary'
                          ? moneyInput('editPrimaryInsPortion')
                          : moneyInput('editSecondaryInsPortion')}
                      </TableCell>

                      {/* Total Charge belongs to the procedure, not to a
                          coverage, so it appears once on the final row. */}
                      <TableCell align="right" sx={{ borderLeft: `1px solid ${COLORS.BORDER}` }}>
                        {isLastRowOfItem ? (
                          <CurrencyInput
                            value={item.editTotalCharge}
                            onChange={(v) => editField('editTotalCharge', v)}
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
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
