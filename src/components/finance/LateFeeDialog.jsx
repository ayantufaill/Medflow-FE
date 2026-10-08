import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { invoiceService } from '../../services/invoice.service';

const money = (value) => (value == null ? '--' : `$${(Number(value) || 0).toFixed(2)}`);

const formatDate = (value) => {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Late-fee dialog.
 *
 * Everything shown and everything charged is decided on the backend: the
 * eligible invoice list, the policy that applies to this clinic, the amount
 * (flat fee or percentage — including any cap), and the terms text. This dialog
 * only renders what the eligibility endpoint returns — no $50/30-day constants,
 * no per-tier math — and on submit it re-sends the backend-provided rate/mode
 * (or nothing for tiered adjustments, where the tier decides server-side).
 */
const LateFeeDialog = ({ onClose, onAddFee, adjustmentType, patientId, tier }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [policy, setPolicy] = useState(null);

  const [outstandingType, setOutstandingType] = useState('patient');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await invoiceService.getLateFeeEligibility(patientId, tier);
        if (cancelled) return;
        const rows = data?.invoices || [];
        setInvoices(rows);
        setPolicy(data?.policy ?? null);
        // Default to everything that is genuinely chargeable: no outstanding
        // balance, or a fee for this tier already on the invoice.
        setSelected(rows.filter((r) => !r.alreadyCharged).map((r) => r.id));
      } catch (err) {
        if (!cancelled) {
          setInvoices([]);
          setPolicy(null);
          setLoadError(err?.response?.data?.error?.message || err?.message || 'Could not load invoices.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (patientId) load();
    else {
      setLoading(false);
      setLoadError('Missing patient.');
    }
    return () => { cancelled = true; };
  }, [patientId, tier]);

  const selectable = useMemo(() => invoices.filter((r) => !r.alreadyCharged), [invoices]);
  const selectableIds = useMemo(() => selectable.map((r) => r.id), [selectable]);

  const isTiered = Boolean(tier);

  // The per-invoice fee for the currently selected basis comes straight from
  // the server (flat amount, or % of the basis balance). Nothing is calculated
  // here.
  const feeFor = (invoice) => (outstandingType === 'patient' ? invoice.feePatient : invoice.feeTotal);
  const hasFeeSource = isTiered || Boolean(policy);

  const selectedInvoices = invoices.filter((inv) => selected.includes(inv.id));
  const selectedHaveFees = selectedInvoices.length > 0 && selected.length > 0
    && selectedInvoices.every((inv) => feeFor(inv) != null && Number(feeFor(inv)) > 0);
  const totalFee = selectedInvoices.reduce((sum, inv) => sum + (Number(feeFor(inv)) || 0), 0);

  const toggleInvoice = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.includes(id));
  const toggleAll = () => {
    setSelected(allSelected ? [] : selectableIds);
  };

  const canSubmit = !loading && !loadError && selected.length > 0 && hasFeeSource && selectedHaveFees;

  const policySummary = policy
    ? `Policy v${policy.policyVersion} — ${policy.feeType === 'percentage'
        ? `${policy.corporateFeePct}% of the ${outstandingType === 'patient' ? 'patient' : 'total'} balance`
        : `Flat ${money(policy.patientFeeAmount)} per invoice`} after ${policy.paymentTermsDays} days (${policy.gracePeriodDays}-day grace).`
    : isTiered
      ? `Fee per invoice is decided server-side for the ${tier}-day tier.`
      : 'No active late-fee policy is configured for this clinic.';

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Backend-provided amounts only. Tiered adjustments send no rate (the tier
    // decides server-side); un-tiered ones relay the active policy's rate/mode.
    const feeConfig = isTiered
      ? {}
      : {
          mode: policy?.feeType ?? 'flat',
          rate: policy?.feeType === 'percentage'
            ? policy?.corporateFeePct
            : policy?.patientFeeAmount,
        };
    onAddFee({
      invoiceIds: selected,
      basis: outstandingType,
      ...feeConfig,
    });
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${COLORS.BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
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
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Invoices {adjustmentType ? `— ${adjustmentType}` : ''}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : loadError ? (
          <Alert severity="error" sx={{ my: 1 }}>{loadError}</Alert>
        ) : (
          <>
            {policy?.termsText && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {policySummary}<Box component="span" sx={{ display: 'block', mt: 0.5, color: COLORS.TEXT_BODY, fontSize: '12px' }}>{policy.termsText}</Box>
              </Alert>
            )}
            {!policy?.termsText && policySummary && (
              <Alert severity="info" sx={{ mb: 2 }}>{policySummary}</Alert>
            )}
            {!hasFeeSource && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                This patient has no active late-fee policy, so no fee can be calculated. Ask an admin to configure one.
              </Alert>
            )}
            {invoices.length === 0 ? (
              <Alert severity="info" sx={{ my: 1 }}>
                No eligible invoices for the late-fee policy yet.
              </Alert>
            ) : (
              <>
                {invoices.some((r) => r.alreadyCharged) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Already-charged invoices are shown greyed out and cannot be selected again.
                  </Alert>
                )}
                <TableContainer component={Box} sx={{ border: 'none', boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_PRIMARY, fontWeight: 600, fontSize: '13px' } }}>
                        <TableCell padding="checkbox">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Checkbox
                              size="small"
                              checked={allSelected}
                              indeterminate={selected.length > 0 && !allSelected}
                              disabled={selectableIds.length === 0}
                              onChange={toggleAll}
                              sx={{ p: 0, color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT }, '&.MuiCheckbox-indeterminate': { color: COLORS.ACCENT } }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>All</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>Invoice</TableCell>
                        <TableCell>Days Past Due</TableCell>
                        <TableCell align="right">Ins. W/O</TableCell>
                        <TableCell align="right">Patient</TableCell>
                        <TableCell align="right">Insurance</TableCell>
                        <TableCell align="right">Total Owing</TableCell>
                        <TableCell align="right">Fee</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow
                          key={inv.id}
                          sx={{
                            opacity: inv.alreadyCharged ? 0.5 : 1,
                            '& td': { borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.2, fontSize: '13px', color: COLORS.TEXT_BODY },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Checkbox
                                size="small"
                                checked={selected.includes(inv.id)}
                                disabled={inv.alreadyCharged}
                                onChange={() => toggleInvoice(inv.id)}
                                sx={{ p: 0, color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }}
                              />
                              <Typography sx={{ color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap', fontSize: '13px' }}>
                                {inv.invoiceNumber || `Invoice #${inv.id}`}
                                {inv.alreadyCharged && (
                                  <Typography component="span" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '12px', ml: 1 }}>
                                    (fee already charged)
                                  </Typography>
                                )}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{formatDate(inv.invoiceDate)}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600, color: COLORS.ACCENT, fontSize: '13px' }}>
                              {inv.daysOutstanding} {inv.daysOutstanding === 1 ? 'day' : 'days'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{money(inv.insuranceWriteOff)}</TableCell>
                          <TableCell align="right">{money(inv.patientBalance)}</TableCell>
                          <TableCell align="right">{money(inv.insuranceBalance)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: COLORS.ACCENT }}>{money(inv.totalBalance)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: COLORS.ACCENT }}>{money(feeFor(inv))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </DialogContent>

      {/* Footer. The total sits on the left; the basis selection and the actions
          are grouped on the right. */}
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, px: 3, py: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff' }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          {canSubmit && totalFee > 0 && (
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>
              Total fee: <strong>{money(totalFee)}</strong>
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <RadioGroup
            row
            value={outstandingType}
            onChange={(e) => setOutstandingType(e.target.value)}
          >
            <FormControlLabel
              value="total"
              control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />}
              label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>Total Outstanding</Typography>}
            />
            <FormControlLabel
              value="patient"
              control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />}
              label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>Patient Outstanding</Typography>}
            />
          </RadioGroup>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={handleSubmit}
              sx={{
                bgcolor: COLORS.ACCENT,
                color: '#fff',
                textTransform: 'none',
                px: 3,
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: 'none',
                borderRadius: '6px',
                '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
              }}
            >
              {adjustmentType || 'Add Fee'}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                color: COLORS.TEXT_SECONDARY,
                borderColor: COLORS.BORDER,
                bgcolor: 'white',
                textTransform: 'none',
                px: 3,
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: 'none',
                borderRadius: '6px',
                '&:hover': { bgcolor: '#f5f5f5', boxShadow: 'none' },
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default LateFeeDialog;