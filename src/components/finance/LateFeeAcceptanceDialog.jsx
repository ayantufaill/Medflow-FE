import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { lateFeeService } from '../../services/lateFee.service';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const CHANNELS = [
  { value: 'verbal', label: 'Verbal (in-person or phone)' },
  { value: 'signed_consent', label: 'Signed consent' },
  { value: 'portal_checkbox', label: 'Patient portal checkbox' },
  { value: 'registration_form', label: 'Registration form' },
];

const LateFeeAcceptanceDialog = ({ open, onClose, patientId, clinicId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [history, setHistory] = useState([]);

  const [channel, setChannel] = useState('verbal');
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const load = useCallback(async () => {
    if (!open || !clinicId || !patientId) return;
    setLoading(true);
    setError(null);
    setConsent(false);
    try {
      const [policyRes, historyRes] = await Promise.all([
        lateFeeService.getPolicy(clinicId),
        lateFeeService.getAcceptanceHistory(patientId),
      ]);
      setPolicy(policyRes?.active ?? null);
      setHistory(historyRes ?? []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || 'Could not load the late fee policy.');
    } finally {
      setLoading(false);
    }
  }, [open, clinicId, patientId]);

  useEffect(() => {
    if (open) load();
  }, [load, open]);

  const handleRecord = async () => {
    if (!consent) return;
    setSaving(true);
    setSaveError(null);
    try {
      await lateFeeService.recordAcceptance({
        policyVersionId: policy.id,
        patientId,
        channel,
      });
      window.dispatchEvent(new CustomEvent('appointment-financials-updated', { detail: { patientId } }));
      await load();
    } catch (err) {
      setSaveError(err?.response?.data?.error?.message || 'Failed to record acceptance.');
    } finally {
      setSaving(false);
    }
  };

  const feeSummary = policy
    ? policy.feeType === 'percentage'
      ? `${policy.corporateFeePct}% of the overdue balance (cap ${policy.capPct}%)`
      : `A flat fee of ${money(policy.patientFeeAmount)}`
    : null;

  const noPolicy = !policy;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>Late Fee Policy Acceptance</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#64748b' }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!loading && error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <>
            {noPolicy ? (
              <Alert severity="warning">
                This clinic does not have an active late fee policy yet. Acceptance can only be
                recorded once one is published in Admin → Finance Management → Late Fee Policy.
              </Alert>
            ) : (
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E5E9F2', borderRadius: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                    Policy v{policy.version}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {feeSummary} · {policy.gracePeriodDays}-day grace · {policy.paymentTermsDays}-day terms
                  </Typography>
                </Box>
                <Typography sx={{ color: '#334155', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                  {policy.termsText}
                </Typography>
              </Paper>
            )}

            {!noPolicy && policy.enabled === false && (
              <Alert severity="info" sx={{ mb: 2 }}>
                The program is currently paused for this clinic (disabled), so it will not charge until it is turned on.
              </Alert>
            )}

            {!noPolicy && (
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  label="Consent channel"
                  select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {CHANNELS.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={policy.enabled === false}
                      sx={{ '&.Mui-checked': { color: '#2563eb' } }}
                    />
                  }
                  label="I reviewed the policy terms with the patient and obtained consent."
                />
              </Box>
            )}
            {saveError && <Alert severity="error" sx={{ mt: 1 }}>{saveError}</Alert>}

            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', mb: 1 }}>
              Acceptance history
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E9F2', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { color: '#334155', fontWeight: 600, fontSize: '0.8rem', bgcolor: '#F8FAFC' } }}>
                    <TableCell>Policy</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Recorded</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.length === 0 && (
                    <TableRow><TableCell colSpan={3} sx={{ color: '#64748b' }}>No recorded acceptances yet.</TableCell></TableRow>
                  )}
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>v{h.policyVersion}</TableCell>
                      <TableCell>{h.channel}</TableCell>
                      <TableCell>{formatDate(h.acceptedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', px: 3, '&:hover': { borderColor: '#94a3b8' } }}>
          Close
        </Button>
        <Button
          onClick={handleRecord}
          disabled={!consent || noPolicy || saving}
          variant="contained"
          sx={{
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' },
            '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#fff' },
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
          }}
        >
          {saving ? 'Recording…' : 'Record acceptance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LateFeeAcceptanceDialog;