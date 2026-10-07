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
  TextField,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { invoiceService } from '../../services/invoice.service';

const money = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Late-fee dialog.
 *
 * The invoice list is fetched per tier rather than hardcoded, because which
 * invoices qualify depends on how long ago each one was sent. Eligibility and
 * the already-charged flag both come from the server so this dialog cannot
 * disagree with what the charge will actually accept.
 */
const LateFeeDialog = ({ onClose, onAddFee, adjustmentType, patientId, tier }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [defaultRate, setDefaultRate] = useState(null);

  const [outstandingType, setOutstandingType] = useState('patient');
  // Only used by the un-tiered adjustments, which have no tier default.
  const [rateValue, setRateValue] = useState('');

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
        setDefaultRate(data?.defaultRate ?? null);
        // Default to everything that is genuinely chargeable: no outstanding
        // balance, or a fee for this tier already on the invoice.
        setSelected(rows.filter((r) => !r.alreadyCharged).map((r) => r.id));
      } catch (err) {
        if (!cancelled) {
          setInvoices([]);
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

  // Tiered adjustments (30/60/90) have a fixed amount decided server-side.
  // The un-tiered Flat rate / Percentage menu items have no tier to read a
  // default from, so they keep their own amount field.
  const isTiered = Boolean(tier);
  const perInvoiceRate = isTiered ? (Number(defaultRate) || 0) : (parseFloat(rateValue) || 0);
  const totalFee = useMemo(
    () => selected.length * perInvoiceRate,
    [selected, perInvoiceRate],
  );

  const toggleInvoice = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.includes(id));
  const toggleAll = () => {
    setSelected(allSelected ? [] : selectableIds);
  };

  const canSubmit = !loading && !loadError && selected.length > 0 && perInvoiceRate > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // No rate is sent: the tier decides the amount server-side. The basis is
    // still sent because it decides which balance the invoice must have to be
    // chargeable, not the amount.
    onAddFee({
      invoiceIds: selected,
      basis: outstandingType,
      ...(isTiered ? {} : { rate: parseFloat(rateValue) }),
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
        ) : invoices.length === 0 ? (
          <Alert severity="info" sx={{ my: 1 }}>
            No invoices are {tier} or more days past the date they were sent.
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      {/* Footer. The amount field and the running total sit on the left; the
          basis selection and the actions are grouped on the right. */}
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, px: 3, py: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff' }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          {/* Only the un-tiered adjustments need an amount. The tiered ones
              charge a fixed amount decided server-side. */}
          {!isTiered && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>
                Rate:
              </Typography>
              <TextField
                variant="standard"
                size="small"
                type="number"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Typography sx={{ ml: 0.5, color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>$</Typography>
                  ),
                }}
                sx={{
                  width: '80px',
                  '& .MuiInput-underline:before': { borderBottomColor: COLORS.BORDER },
                  '& .MuiInput-underline:after': { borderBottomColor: COLORS.ACCENT },
                  '& .MuiInputBase-input': { fontSize: '13px', textAlign: 'center', color: COLORS.TEXT_PRIMARY },
                }}
              />
            </Stack>
          )}

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