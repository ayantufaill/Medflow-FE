import React, { useState, useMemo } from 'react';
import { Box, Typography, Checkbox, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const num = (v) => Number(String(v ?? 0).replace(/[^0-9.-]+/g, '')) || 0;
const money = (v) => `$${num(v).toFixed(2)}`;

/**
 * Voiding an invoice is a per-procedure decision, not an all-or-nothing one:
 * this lists everything on the invoice and reports the chosen procedure IDs.
 * Only those get voided; the rest of the invoice is left untouched.
 */
const VoidInvoiceProceduresDialog = ({ open, onClose, onConfirm, target }) => {
  const invoiceNum = target?.invoiceNumber || target?.id || 'N/A';
  const procedures = useMemo(
    () =>
      (target?.procedures || []).map((p) => ({
        id: p.id || p._id || p.ProcNum,
        code: p.code || p.cptCode || p.ProcCode || 'Item',
        description: p.description || p.name || p.Descript || '',
        provider: p.provider || 'Staff',
        // Already voided when the ledger was opened with "include voided
        // transactions" — shown for context but not selectable again.
        alreadyVoided: Boolean(p.isVoided),
        writeoff: num(p.writeoff || p.estimatedWriteOff || 0),
        patient: num(p.ptPortion || p.patientPortion || 0),
        insurance: num(p.totalInsPortion || p.insPortion || p.insurancePortion || 0),
        fee: num(p.totalPrice || p.total || p.charge || p.ProcFee || 0),
      })),
    [target],
  );

  // Selection is keyed by invoice so opening the dialog on a different invoice
  // Already-voided rows (listed when the ledger was opened with "include
  // voided transactions") are shown for context but never selectable.
  const selectableIds = procedures.filter((p) => !p.alreadyVoided).map((p) => p.id);

  // Selection is keyed by invoice so opening the dialog on a different invoice
  // starts fresh (all of ITS procedures selected) without a reset effect.
  // `undefined` means "no choice made yet", which defaults to everything
  // still voidable.
  const [selection, setSelection] = useState({});
  const selectedIds =
    selection[invoiceNum] === undefined ? selectableIds : selection[invoiceNum];

  const setSelectedIds = (ids) =>
    setSelection((prev) => ({ ...prev, [invoiceNum]: ids }));

  const toggleOne = (id) => {
    const current = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(current);
  };

  const allChecked =
    selectableIds.length > 0 && selectedIds.length === selectableIds.length;
  const someChecked = selectedIds.length > 0 && !allChecked;

  const toggleAll = () => setSelectedIds(allChecked ? [] : selectableIds);

  const totalFee = procedures.reduce((s, p) => s + p.fee, 0);
  const totalWriteoff = procedures.reduce((s, p) => s + p.writeoff, 0);

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Void Invoice #${invoiceNum} Procedures`}
      maxWidth="md"
      actions={
        <>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm?.(selectedIds)}
            disabled={selectedIds.length === 0}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#ef4444',
              color: COLORS.WHITE,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#dc2626', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: '#fca5a5', color: '#fff' },
            }}
          >
            {selectedIds.length === procedures.length
              ? 'Void All'
              : `Void ${selectedIds.length} ${selectedIds.length === 1 ? 'Procedure' : 'Procedures'}`}
          </Button>
        </>
      }
    >
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, mb: 2 }}>
          Select the procedures to void. Only the selected ones will be voided —
          the rest of the invoice stays as it is. This action cannot be undone.
        </Typography>

        {procedures.length === 0 ? (
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, textAlign: 'center', py: 3 }}>
            No procedures found on this invoice.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', borderRadius: radius.sm }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.SURFACE_TINT }}>
                  <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${COLORS.BORDER}` }}>
                    <Checkbox
                      size="small"
                      checked={allChecked}
                      indeterminate={someChecked}
                      onChange={toggleAll}
                      sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: '#ef4444' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Code</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Description</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Provider</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Ins WO</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Patient</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Insurance</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: COLORS.TEXT_SECONDARY, borderBottom: `1px solid ${COLORS.BORDER}` }}>Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.map((p) => {
                  const checked = selectedIds.includes(p.id);
                  return (
                    <TableRow
                      key={p.id}
                      hover={!p.alreadyVoided}
                      onClick={() => !p.alreadyVoided && toggleOne(p.id)}
                      sx={{
                        cursor: p.alreadyVoided ? 'default' : 'pointer',
                        opacity: p.alreadyVoided ? 0.6 : 1,
                        '&:last-child td': { borderBottom: 'none' },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={checked}
                          disabled={p.alreadyVoided}
                          onChange={() => toggleOne(p.id)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: '#ef4444' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>{p.code}</TableCell>
                      <TableCell sx={{ fontSize: '12px', color: COLORS.TEXT_BODY }}>{p.description}</TableCell>
                      <TableCell sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>{p.provider}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '12px', color: COLORS.TEXT_PRIMARY }}>{money(p.writeoff)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '12px', color: COLORS.TEXT_PRIMARY }}>{money(p.patient)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '12px', color: COLORS.TEXT_PRIMARY }}>{money(p.insurance)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '12px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{money(p.fee)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
          <Box
            component="button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAll();
            }}
            disabled={procedures.length === 0}
            sx={{
              border: 'none',
              background: 'none',
              p: 0,
              cursor: procedures.length === 0 ? 'default' : 'pointer',
              fontSize: '12px',
              fontWeight: fontWeight.semiBold,
              fontFamily: 'inherit',
              color: procedures.length === 0 ? COLORS.TEXT_MUTED : COLORS.ACCENT,
              '&:hover': { textDecoration: procedures.length === 0 ? 'none' : 'underline' },
            }}
          >
            {allChecked ? 'Clear all' : 'Select all'}
          </Box>
          <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
            Ins WO: <Box component="span" sx={{ fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{money(totalWriteoff)}</Box>
            {' · '}
            Total: <Box component="span" sx={{ fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{money(totalFee)}</Box>
            {' · '}
            {selectedIds.length} of {procedures.length} selected
          </Typography>
        </Stack>
      </Box>
    </BaseDialog>
  );
};

export default VoidInvoiceProceduresDialog;
