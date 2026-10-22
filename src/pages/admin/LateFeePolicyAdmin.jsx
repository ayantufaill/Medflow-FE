import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { lateFeeService } from '../../services/lateFee.service';
import { useBranch } from '../../hooks/redux/useBranch';

const MAX = (v, max) => Math.min(Number(v) || 0, max);

const LateFeePolicyAdmin = () => {
  const { branches, currentBranchId, fetchBranches, setBranch } = useBranch();
  const clinicId = currentBranchId || branches?.[0]?.id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const [active, setActive] = useState(null);
  const [history, setHistory] = useState([]);
  const [enabled, setEnabled] = useState(false);

  const [form, setForm] = useState({
    termsText: '',
    paymentTermsDays: 30,
    gracePeriodDays: 15,
    feeType: 'flat',
    patientFeeAmount: 50,
    corporateFeePct: 1.5,
    capPct: 10,
    enabled: false,
  });
  const [baseVersion, setBaseVersion] = useState(null);

  useEffect(() => {
    if (!fetchBranches) return;
    if (!branches || branches.length === 0) fetchBranches();
  }, [fetchBranches, branches]);

  const load = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [policyData, settingsData] = await Promise.all([
        lateFeeService.getPolicy(clinicId),
        lateFeeService.getSettings(clinicId),
      ]);
      setActive(policyData.active ?? null);
      setHistory(policyData.history ?? []);
      setEnabled(settingsData.enabled ?? false);
    } catch (err) {
      setLoadError(err?.response?.data?.error?.message || err?.message || 'Could not load late-fee policy.');
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  useEffect(() => {
    load();
  }, [load]);

  // Prefill the form from the active policy (or a selected version) so editing
  // creates the next immutable version based on it.
  const beginEdit = useCallback((fromPolicy) => {
    if (!fromPolicy) {
      setForm({
        termsText: '',
        paymentTermsDays: 30,
        gracePeriodDays: 15,
        feeType: 'flat',
        patientFeeAmount: 50,
        corporateFeePct: 1.5,
        capPct: 10,
        enabled: true,
      });
      setBaseVersion(null);
      return;
    }
    setForm({
      termsText: fromPolicy.termsText ?? '',
      paymentTermsDays: fromPolicy.paymentTermsDays ?? 30,
      gracePeriodDays: fromPolicy.gracePeriodDays ?? 15,
      feeType: fromPolicy.feeType ?? 'flat',
      patientFeeAmount: fromPolicy.patientFeeAmount ?? 0,
      corporateFeePct: fromPolicy.corporateFeePct ?? 0,
      capPct: fromPolicy.capPct ?? 10,
      enabled: fromPolicy.enabled ?? true,
    });
    setBaseVersion(fromPolicy.version);
  }, []);

  useEffect(() => {
    if (active && baseVersion === null) {
      beginEdit(active);
    }
  }, [active, baseVersion, beginEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!clinicId) return;
    setSaving(true);
    setSaveMsg(null);
    const payload = {
      termsText: form.termsText,
      paymentTermsDays: MAX(form.paymentTermsDays, 120),
      gracePeriodDays: MAX(form.gracePeriodDays, 90),
      feeType: form.feeType,
      patientFeeAmount: Number(form.patientFeeAmount) || 0,
      corporateFeePct: MAX(form.corporateFeePct, 100),
      capPct: MAX(form.capPct, 100),
      enabled: form.enabled,
    };
    try {
      if (baseVersion) {
        await lateFeeService.updatePolicy(clinicId, baseVersion, payload);
        setSaveMsg({ severity: 'success', text: `Policy v${baseVersion + 1} created from v${baseVersion}.` });
      } else {
        await lateFeeService.createPolicy(clinicId, payload);
        setSaveMsg({ severity: 'success', text: 'Late-fee policy created.' });
      }
      await load();
      setBaseVersion(null);
    } catch (err) {
      setSaveMsg({ severity: 'error', text: err?.response?.data?.error?.message || 'Failed to save policy.' });
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (version) => {
    if (!clinicId) return;
    setSaveMsg(null);
    try {
      await lateFeeService.activatePolicy(clinicId, version);
      setSaveMsg({ severity: 'success', text: `Policy v${version} activated.` });
      await load();
    } catch (err) {
      setSaveMsg({ severity: 'error', text: err?.response?.data?.error?.message || 'Failed to activate policy.' });
    }
  };

  const handleToggleEnabled = async (checked) => {
    if (!clinicId) return;
    setEnabled(checked);
    setSaveMsg(null);
    try {
      const res = await lateFeeService.updateSettings(clinicId, checked);
      setEnabled(res.enabled ?? checked);
      setSaveMsg({ severity: 'success', text: checked ? 'Late fees enabled for this clinic.' : 'Late fees disabled for this clinic.' });
    } catch (err) {
      setEnabled(!checked);
      setSaveMsg({ severity: 'error', text: err?.response?.data?.error?.message || 'Failed to update master switch.' });
    }
  };

  if (!clinicId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, backgroundColor: '#FBFCFE' }}>
        <Alert severity="info">No clinic selected yet.</Alert>
      </Box>
    );
  }

  if (loading && !active && history.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '60vh', backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Late Fee Policy
        </Typography>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Clinic</InputLabel>
          <Select
            value={clinicId}
            label="Clinic"
            onChange={(e) => setBranch && setBranch(e.target.value)}
          >
            {(branches || []).map((b) => (
              <MenuItem key={b.id} value={b.id}>{b.name || `Clinic ${b.id}`}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      {saveMsg && <Alert severity={saveMsg.severity} sx={{ mb: 2 }}>{saveMsg.text}</Alert>}

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #E5E9F2', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>Program Switch</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={(e) => handleToggleEnabled(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } }}
              />
            }
            label={enabled ? 'Enabled' : 'Disabled'}
          />
        </Box>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
          Master gate for the automatic late-fee job for this clinic. The active policy must also be enabled for fees to apply.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Active policy summary */}
        <Paper elevation={0} sx={{ flex: '1 1 320px', p: 3, border: '1px solid #E5E9F2', borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', mb: 2 }}>Active Policy</Typography>
          {!active ? (
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>No active policy for this clinic yet.</Typography>
          ) : (
            <>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip size="small" label={`v${active.version}`} sx={{ fontWeight: 600 }} color={active.enabled ? 'primary' : 'default'} />
                <Chip size="small" label={active.enabled ? 'Enabled' : 'Disabled'} sx={{ fontWeight: 600 }} />
                {active.enabled && <Chip size="small" color="success" label="Active" sx={{ fontWeight: 600 }} />}
              </Stack>
              <Typography sx={{ color: '#334155', fontSize: '0.95rem', mb: 0.5 }}>
                Fee: <strong>{active.feeType === 'percentage' ? `${active.corporateFeePct}% of balance` : `$${Number(active.patientFeeAmount).toFixed(2)} per invoice`}</strong>
              </Typography>
              <Typography sx={{ color: '#334155', fontSize: '0.95rem', mb: 0.5 }}>
                Payment due after <strong>{active.paymentTermsDays}</strong> days, <strong>{active.gracePeriodDays}</strong>-day grace.
              </Typography>
              <Typography sx={{ color: '#334155', fontSize: '0.95rem', mb: 1 }}>
                Cap: <strong>{active.capPct}%</strong> of outstanding balance
              </Typography>
              {active.termsText && (
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', mt: 1 }}>
                  “{active.termsText}”
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => beginEdit(active)} sx={{ color: '#1e293b', borderColor: '#cbd5e1', textTransform: 'none', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
                  Edit (new version)
                </Button>
              </Box>
            </>
          )}
        </Paper>

        {/* Edit / create form */}
        <Paper elevation={0} sx={{ flex: '1 1 480px', p: 3, border: '1px solid #E5E9F2', borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', mb: 2 }}>
            {baseVersion ? `New version from v${baseVersion}` : 'Create first version'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              size="small"
              label="Fee type"
              select
              value={form.feeType}
              onChange={handleChange('feeType')}
            >
              <MenuItem value="flat">Flat fee</MenuItem>
              <MenuItem value="percentage">Percentage of balance</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField size="small" label="Payment terms (days)" type="number" value={form.paymentTermsDays} onChange={handleChange('paymentTermsDays')} sx={{ flex: 1, minWidth: 140 }} />
              <TextField size="small" label="Grace (days)" type="number" value={form.gracePeriodDays} onChange={handleChange('gracePeriodDays')} sx={{ flex: 1, minWidth: 140 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {form.feeType === 'flat' ? (
                <TextField size="small" label="Flat fee ($)" type="number" value={form.patientFeeAmount} onChange={handleChange('patientFeeAmount')} sx={{ flex: 1, minWidth: 140 }} />
              ) : (
                <TextField size="small" label="Percentage (%)" type="number" value={form.corporateFeePct} onChange={handleChange('corporateFeePct')} sx={{ flex: 1, minWidth: 140 }} />
              )}
              <TextField size="small" label="Cap (% of balance)" type="number" value={form.capPct} onChange={handleChange('capPct')} sx={{ flex: 1, minWidth: 140 }} />
            </Box>
            <TextField
              size="small"
              label="Terms text"
              multiline
              minRows={3}
              value={form.termsText}
              onChange={handleChange('termsText')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.enabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563eb' } }}
                />
              }
              label="Policy enabled"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button onClick={() => beginEdit(active)} variant="outlined" sx={{ color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', px: 3, '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.termsText?.trim()}
                variant="contained"
                sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#fff' }, textTransform: 'none', px: 4, boxShadow: 'none' }}
              >
                {saving ? 'Saving…' : (baseVersion ? 'Create version' : 'Create policy')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Version history */}
      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', mb: 2 }}>Version History</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E9F2', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { color: '#334155', fontWeight: 600, fontSize: '0.85rem', bgcolor: '#f8fafc' } }}>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Cap</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 && (
              <TableRow><TableCell colSpan={5} sx={{ color: '#64748b' }}>No versions yet.</TableCell></TableRow>
            )}
            {(history || []).map((v) => (
              <TableRow key={v.version} hover>
                <TableCell sx={{ fontWeight: 600 }}>v{v.version}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {v.isActive && <Chip size="small" color="success" label="Active" sx={{ fontWeight: 600 }} />}
                    <Chip size="small" label={v.enabled ? 'Enabled' : 'Disabled'} sx={{ fontWeight: 600 }} />
                  </Stack>
                </TableCell>
                <TableCell>
                  {v.feeType === 'percentage' ? `${v.corporateFeePct}% of balance` : `$${Number(v.patientFeeAmount).toFixed(2)}`}
                </TableCell>
                <TableCell>{v.capPct}%</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" variant="outlined" onClick={() => beginEdit(v)} sx={{ color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', fontSize: '0.8rem', '&:hover': { borderColor: '#94a3b8' } }}>
                      Edit
                    </Button>
                    {!v.isActive && (
                      <Button size="small" variant="contained" onClick={() => handleActivate(v.version)} sx={{ bgcolor: '#2563eb', textTransform: 'none', fontSize: '0.8rem', boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}>
                        Activate
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LateFeePolicyAdmin;