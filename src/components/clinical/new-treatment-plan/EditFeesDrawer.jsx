import React, { useState } from 'react';
import { Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, roundedSelectMenuProps, standardFieldSx } from '../../../constants/styles';

const amount = (value) => {
  if (value === null || value === undefined || value === '-') return '';
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(number) ? String(number) : '';
};

const labelSx = { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: 0.75 };
const sectionSx = { p: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, bgcolor: COLORS.SURFACE_CARD };
const moneySx = { ...standardFieldSx, '& .MuiOutlinedInput-root': { ...standardFieldSx['& .MuiOutlinedInput-root'], bgcolor: COLORS.SURFACE_INPUT } };
const drawerMenuProps = {
  ...roundedSelectMenuProps,
  sx: { zIndex: 1500 },
  PaperProps: {
    ...roundedSelectMenuProps.PaperProps,
    sx: { ...roundedSelectMenuProps.PaperProps?.sx, zIndex: 1501 },
  },
};

const initialForm = (procedure) => ({
  ucrFee: amount(procedure?.ucrFee),
  negotiatedRate: amount(procedure?.negotiatedRate ?? procedure?.negRate),
  insuranceEstimate: amount(procedure?.insuranceEstimate ?? procedure?.insEst),
  patientEstimate: amount(procedure?.patientEstimate ?? procedure?.ptEst),
  deductible: amount(procedure?.deductible ?? 0),
  noBillInsurance: Boolean(procedure?.noBillInsurance),
  preAuthStatus: procedure?.preAuthStatus || '',
  preAuthNumber: procedure?.preAuthNumber || procedure?.preAuthId || '',
  downgradedCode: procedure?.downgradedCode || '',
});

const EditFeesDrawer = ({ open, procedure, onClose, onSave, onRevert, saving, downgradeCodes = [] }) => {
  const [form, setForm] = useState(() => initialForm(procedure));
  const [error, setError] = useState('');

  const change = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));
  const save = () => {
    if (!form) return;
    const required = ['negotiatedRate', 'insuranceEstimate', 'patientEstimate', 'deductible'];
    if (required.some((key) => form[key] === '' || !Number.isFinite(Number(form[key])) || Number(form[key]) < 0)
      || (form.ucrFee !== '' && (!Number.isFinite(Number(form.ucrFee)) || Number(form.ucrFee) < 0))) {
      setError('Enter valid, nonnegative amounts in all required fee fields.');
      return;
    }
    const negotiatedRate = Number(form.negotiatedRate);
    const insuranceEstimate = form.noBillInsurance ? 0 : Number(form.insuranceEstimate);
    const patientEstimate = Number(form.patientEstimate);
    if (insuranceEstimate + patientEstimate > negotiatedRate + 0.01) {
      setError('Insurance estimate and patient estimate cannot exceed the negotiated rate.');
      return;
    }
    onSave({
      ...form,
      ucrFee: form.ucrFee === '' ? null : Number(form.ucrFee),
      negotiatedRate,
      insuranceEstimate,
      patientEstimate,
      deductible: Number(form.deductible),
    });
  };

  const moneyField = (label, key, required = false) => (
    <Box>
      <Typography sx={labelSx}>{label}{required ? ' *' : ''}</Typography>
      <TextField fullWidth size="small" type="number" inputProps={{ min: 0, step: '0.01' }} value={form?.[key] ?? ''}
        onChange={(event) => change(key, event.target.value)} sx={moneySx} disabled={saving || (key === 'insuranceEstimate' && form?.noBillInsurance)} />
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={saving ? undefined : onClose} sx={{ zIndex: 1400 }}
      PaperProps={{ sx: { width: { xs: '100%', md: 860 }, maxWidth: '100%', bgcolor: COLORS.SURFACE_PAGE } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>Edit Fees</Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: fontSize.base }}>Update this procedure's fees and insurance estimates</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={saving} aria-label="Close Edit Fees"><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={sectionSx}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold }}>{procedure?.code || '-' } {procedure?.site && procedure.site !== '-' ? procedure.site : ''}</Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>{procedure?.description || 'Description unavailable'}</Typography>
          </Box>
          <Box sx={sectionSx}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, mb: 2 }}>Procedure Fees</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {moneyField('UCR Fee', 'ucrFee')}
              {moneyField('Negotiated Rate', 'negotiatedRate', true)}
            </Box>
            {form?.ucrFee === '' && <Typography sx={{ mt: 1, color: COLORS.TEXT_MUTED, fontSize: fontSize.base }}>UCR fee is unavailable for this procedure. Enter it only if known.</Typography>}
          </Box>
          <Box sx={sectionSx}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, mb: 1.5 }}>Insurance</Typography>
            <Typography sx={labelSx}>Do Not Bill to Insurance</Typography>
            <FormControlLabel control={<Checkbox checked={Boolean(form?.noBillInsurance)} disabled={saving}
              onChange={(event) => setForm((previous) => ({
                ...previous,
                noBillInsurance: event.target.checked,
                insuranceEstimate: event.target.checked ? '0' : previous.insuranceEstimate,
                patientEstimate: event.target.checked ? previous.negotiatedRate : previous.patientEstimate,
              }))} />}
              label="Do not add this procedure to an insurance claim" />
            <Typography sx={{ ...labelSx, mt: 2 }}>Primary · {procedure?.preAuth && procedure.preAuth !== '-' ? procedure.preAuth : 'No Pre-Auth'}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box><Typography sx={labelSx}>Pre-Auth Status</Typography><TextField select fullWidth size="small" value={form?.preAuthStatus || ''}
                SelectProps={{ MenuProps: drawerMenuProps }}
                onChange={(event) => change('preAuthStatus', event.target.value)} sx={moneySx} disabled={saving}>
                <MenuItem value="">None</MenuItem><MenuItem value="Requested">Requested</MenuItem><MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem><MenuItem value="Denied">Denied</MenuItem>
                {form?.preAuthStatus && !['Requested', 'Pending', 'Approved', 'Denied'].includes(form.preAuthStatus) &&
                  <MenuItem value={form.preAuthStatus}>{form.preAuthStatus}</MenuItem>}
              </TextField></Box>
              <Box><Typography sx={labelSx}>Pre-Auth Number</Typography><TextField fullWidth size="small" value={form?.preAuthNumber || ''}
                onChange={(event) => change('preAuthNumber', event.target.value)} sx={moneySx} disabled={saving} /></Box>
              <Box><Typography sx={labelSx}>Downgraded CDT Code</Typography><TextField select fullWidth size="small" value={form?.downgradedCode || ''}
                SelectProps={{ MenuProps: drawerMenuProps }}
                onChange={(event) => change('downgradedCode', event.target.value)} sx={moneySx} disabled={saving}>
                <MenuItem value="">None</MenuItem>
                {form?.downgradedCode && !downgradeCodes.some((dg) => dg.code === form.downgradedCode) &&
                  <MenuItem value={form.downgradedCode}>{form.downgradedCode}</MenuItem>}
                {downgradeCodes.map((dg) => <MenuItem key={dg.code} value={dg.code}>
                  {dg.code} · Downgrade from {dg.fromCode}
                </MenuItem>)}
              </TextField></Box>
              {moneyField('Insurance Estimate', 'insuranceEstimate', true)}
              {moneyField('Patient Estimate', 'patientEstimate', true)}
              {moneyField('Deductible', 'deductible', true)}
            </Box>
          </Box>
          <Box sx={sectionSx}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, mb: 1.5 }}>Patient Estimates</Typography>
            <Typography sx={labelSx}>Patient Amount</Typography>
            <Typography sx={{ mb: 1.5 }}>{form?.patientEstimate === '' ? 'Unavailable' : `$${Number(form?.patientEstimate || 0).toFixed(2)}`}</Typography>
            <Typography sx={labelSx}>Estimate By</Typography>
            <Typography>{procedure?.estimateSource || 'Auto'}</Typography>
            {onRevert && procedure?.estimateSource === 'Manual' && (
              <Button onClick={onRevert} disabled={saving} sx={{ mt: 1, textTransform: 'none' }}>Revert to Auto-Estimates</Button>
            )}
          </Box>
          {error && <Typography role="alert" sx={{ color: COLORS.ERROR || '#dc2626' }}>{error}</Typography>}
        </Box>
        <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_FOOTER, display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
          <Button onClick={onClose} disabled={saving} variant="outlined" sx={{ borderRadius: radius.md, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={save} disabled={saving || !form} variant="contained" sx={{ bgcolor: COLORS.ACCENT, borderRadius: radius.md, textTransform: 'none' }}>{saving ? 'Saving…' : 'Save'}</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditFeesDrawer;

