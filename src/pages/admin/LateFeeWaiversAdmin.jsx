import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { lateFeeService } from '../../services/lateFee.service';
import { useBranch } from '../../hooks/redux/useBranch';

const REASON_CODES = ['HARDSHIP', 'GOODWILL', 'BILLING_ERROR', 'INSURANCE_DELAY', 'OTHER'];

const money = (value) => (value == null ? '--' : `$${(Number(value) || 0).toFixed(2)}`);

const formatDate = (value) => {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

const LateFeeWaiversAdmin = () => {
  const { currentBranchId, branches } = useBranch();
  const clinicId = currentBranchId || branches?.[0]?.id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 25, totalPages: 1 });
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);

  const [actionMsg, setActionMsg] = useState(null);
  const [runningJob, setRunningJob] = useState(false);

  // Waiver report state
  const [reportRows, setReportRows] = useState([]);
  const [reportMeta, setReportMeta] = useState({ total: 0, page: 1, limit: 25, totalPages: 1 });
  const [reportPage, setReportPage] = useState(0);
  const [reportLimit, setReportLimit] = useState(25);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportFilters, setReportFilters] = useState({ staffId: '', from: '', to: '', reasonCode: '' });
  const [reportTouched, setReportTouched] = useState(false);

  const loadReport = useCallback(async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const res = await lateFeeService.getWaiverReport({
        staffId: reportFilters.staffId || undefined,
        from: reportFilters.from || undefined,
        to: reportFilters.to || undefined,
        reasonCode: reportFilters.reasonCode || undefined,
        page: reportPage + 1,
        limit: reportLimit,
      });
      setReportRows(res.data ?? []);
      setReportMeta(res.meta ?? { total: 0, page: 1, limit: reportLimit, totalPages: 1 });
    } catch (err) {
      setReportError(err?.response?.data?.error?.message || err?.message || 'Could not load waiver report.');
    } finally {
      setReportLoading(false);
    }
  }, [reportFilters.staffId, reportFilters.from, reportFilters.to, reportFilters.reasonCode, reportPage, reportLimit]);

  useEffect(() => {
    if (reportTouched) loadReport();
  }, [loadReport, reportTouched]);

  // Waive dialog state
  const [waiveTarget, setWaiveTarget] = useState(null);
  const [waiveForm, setWaiveForm] = useState({ waivedAmount: '', reasonCode: 'HARDSHIP', reasonNote: '' });
  const [waiveSaving, setWaiveSaving] = useState(false);
  const [waiveError, setWaiveError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await lateFeeService.getApplications({
        clinicId,
        status: status || undefined,
        page: page + 1,
        limit,
      });
      setRows(res.data ?? []);
      setMeta(res.meta ?? { total: 0, page: 1, limit, totalPages: 1 });
    } catch (err) {
      setLoadError(err?.response?.data?.error?.message || err?.message || 'Could not load late-fee applications.');
    } finally {
      setLoading(false);
    }
  }, [clinicId, status, page, limit]);

  useEffect(() => {
    if (clinicId) load();
  }, [load, clinicId]);

  const handleRunJob = async () => {
    setRunningJob(true);
    setActionMsg(null);
    try {
      const res = await lateFeeService.runJob();
      setActionMsg({
        severity: 'success',
        text: `Job ran: ${res.totalFeesApplied} applied, ${res.totalFeesSkipped} skipped, ${res.errors.length} errors.`,
      });
      await load();
    } catch (err) {
      setActionMsg({ severity: 'error', text: err?.response?.data?.error?.message || 'Failed to run late-fee job.' });
    } finally {
      setRunningJob(false);
    }
  };

  const openWaive = (row) => {
    const remaining = Math.round(((Number(row.feeAmount) || 0) - (Number(row.totalWaived) || 0)) * 100) / 100;
    setWaiveTarget(row);
    setWaiveForm({ waivedAmount: String(remaining), reasonCode: 'HARDSHIP', reasonNote: '' });
    setWaiveError(null);
  };

  const handleWaive = async () => {
    if (!waiveTarget) return;
    const amount = Number(waiveForm.waivedAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setWaiveError('Enter a waived amount greater than 0.');
      return;
    }
    if (waiveForm.reasonCode === 'OTHER' && !waiveForm.reasonNote?.trim()) {
      setWaiveError('A note is required when the reason is OTHER.');
      return;
    }
    setWaiveSaving(true);
    setWaiveError(null);
    try {
      await lateFeeService.waiveFee(waiveTarget.id, {
        waivedAmount: amount,
        reasonCode: waiveForm.reasonCode,
        reasonNote: waiveForm.reasonNote,
      });
      setWaiveTarget(null);
      setActionMsg({ severity: 'success', text: `Waived ${money(amount)} on application #${waiveTarget.id}.` });
      await load();
    } catch (err) {
      setWaiveError(err?.response?.data?.error?.message || 'Failed to waive fee.');
    } finally {
      setWaiveSaving(false);
    }
  };

  const statusChip = (row) => {
    if (row.status === 'waived') return <Chip size="small" color="warning" label={`Waived ${money(row.totalWaived)}`} sx={{ fontWeight: 600 }} />;
    if (row.status === 'applied') {
      const remaining = (Number(row.feeAmount) || 0) - (Number(row.totalWaived) || 0);
      return remaining <= 0
        ? <Chip size="small" color="warning" label="Waived" sx={{ fontWeight: 600 }} />
        : <Chip size="small" color="primary" label={money(row.feeAmount)} sx={{ fontWeight: 600 }} />;
    }
    return <Chip size="small" label={row.skipReason || 'Skipped'} variant="outlined" sx={{ fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>Late Fee Waivers</Typography>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          disabled={runningJob}
          onClick={handleRunJob}
          sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#fff' }, textTransform: 'none', px: 3, boxShadow: 'none' }}
        >
          {runningJob ? 'Running…' : 'Run job now'}
        </Button>
      </Box>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 3 }}>
        Fees applied by the automatic late-fee job. Waive in full or partially.
      </Typography>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      {actionMsg && <Alert severity={actionMsg.severity} sx={{ mb: 2 }}>{actionMsg.text}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="waived">Waived</MenuItem>
            <MenuItem value="skipped">Skipped</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E9F2', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { color: '#334155', fontWeight: 600, fontSize: '0.85rem', bgcolor: '#f8fafc' } }}>
              <TableCell>Applied</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell align="right">Fee</TableCell>
              <TableCell align="right">Base</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={8}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={24} /></Box></TableCell></TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow><TableCell colSpan={8} sx={{ color: '#64748b' }}>No fee applications match this filter.</TableCell></TableRow>
            )}
            {!loading && rows.map((row) => {
              const remaining = (Number(row.feeAmount) || 0) - (Number(row.totalWaived) || 0);
              return (
                <TableRow key={row.id} hover>
                  <TableCell>{formatDate(row.appliedAt)}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.patientName || row.patientId}</TableCell>
                  <TableCell>{row.invoiceId}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{money(row.feeAmount)}</TableCell>
                  <TableCell align="right">{money(row.baseAmount)}</TableCell>
                  <TableCell>{statusChip(row)}</TableCell>
                  <TableCell>v{row.policyVersion ?? '–'}</TableCell>
                  <TableCell align="right">
                    {row.status === 'applied' && remaining > 0 && (
                      <Button size="small" variant="outlined" onClick={() => openWaive(row)} sx={{ color: '#1e293b', borderColor: '#cbd5e1', textTransform: 'none', fontSize: '0.8rem', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
                        Waive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={meta.total ?? 0}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(0);
        }}
      />

      {/* Waiver report */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, mb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>Waiver Report</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
          Waived fees, filterable by staff, date and reason
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Staff ID"
          value={reportFilters.staffId}
          onChange={(e) => setReportFilters((p) => ({ ...p, staffId: e.target.value }))}
          sx={{ width: 140 }}
        />
        <TextField
          size="small"
          label="From"
          type="date"
          value={reportFilters.from}
          onChange={(e) => setReportFilters((p) => ({ ...p, from: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          label="To"
          type="date"
          value={reportFilters.to}
          onChange={(e) => setReportFilters((p) => ({ ...p, to: e.target.value }))}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Reason</InputLabel>
          <Select
            value={reportFilters.reasonCode}
            label="Reason"
            onChange={(e) => setReportFilters((p) => ({ ...p, reasonCode: e.target.value }))}
          >
            <MenuItem value="">All reasons</MenuItem>
            {REASON_CODES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => {
            setReportTouched(true);
            setReportPage(0);
          }}
          sx={{ color: '#2563eb', borderColor: '#c7d7f7', textTransform: 'none', px: 3, '&:hover': { borderColor: '#2563eb', bgcolor: '#f0f6ff' } }}
        >
          Search
        </Button>
      </Box>

      {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E9F2', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { color: '#334155', fontWeight: 600, fontSize: '0.85rem', bgcolor: '#f8fafc' } }}>
              <TableCell>Waived</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Staff ID</TableCell>
              <TableCell>Policy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportLoading && (
              <TableRow><TableCell colSpan={7}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={24} /></Box></TableCell></TableRow>
            )}
            {!reportLoading && reportRows.length === 0 && (
              <TableRow><TableCell colSpan={7} sx={{ color: '#64748b' }}>No waivers match the report filters.</TableCell></TableRow>
            )}
            {!reportLoading && reportRows.map((w) => (
              <TableRow key={w.id} hover>
                <TableCell>{formatDate(w.waivedAt)}</TableCell>
                <TableCell>{w.invoiceId}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{money(w.waivedAmount)}</TableCell>
                <TableCell><Chip size="small" label={w.reasonCode} variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                <TableCell sx={{ maxWidth: 260 }}><Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.reasonNote || '—'}</Box></TableCell>
                <TableCell>{w.waivedBy}</TableCell>
                <TableCell>v{w.policyVersion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={reportMeta.total ?? 0}
        page={reportPage}
        rowsPerPage={reportLimit}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_, p) => setReportPage(p)}
        onRowsPerPageChange={(e) => {
          setReportLimit(Number(e.target.value));
          setReportPage(0);
        }}
      />

      {/* Waive dialog */}
      <Dialog open={Boolean(waiveTarget)} onClose={() => setWaiveTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Waive Late Fee</Typography>
          <IconButton size="small" onClick={() => setWaiveTarget(null)} sx={{ color: '#64748b' }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {waiveTarget && (
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ color: '#334155', fontSize: '0.9rem' }}>
                  Application #{waiveTarget.id} — {waiveTarget.patientName || `patient ${waiveTarget.patientId}`}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Invoice {waiveTarget.invoiceId} · Fee {money(waiveTarget.feeAmount)} · Already waived {money(waiveTarget.totalWaived)}
                </Typography>
              </Box>
              <TextField
                size="small"
                label="Waived amount ($)"
                type="number"
                value={waiveForm.waivedAmount}
                onChange={(e) => setWaiveForm((p) => ({ ...p, waivedAmount: e.target.value }))}
              />
              <TextField
                size="small"
                label="Reason"
                select
                value={waiveForm.reasonCode}
                onChange={(e) => setWaiveForm((p) => ({ ...p, reasonCode: e.target.value }))}
              >
                {REASON_CODES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              {waiveForm.reasonCode === 'OTHER' && (
                <TextField
                  size="small"
                  label="Note (required)"
                  multiline
                  minRows={2}
                  value={waiveForm.reasonNote}
                  onChange={(e) => setWaiveForm((p) => ({ ...p, reasonNote: e.target.value }))}
                />
              )}
              {waiveError && <Alert severity="error">{waiveError}</Alert>}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWaiveTarget(null)} variant="outlined" sx={{ color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', px: 3, '&:hover': { borderColor: '#94a3b8' } }}>
            Cancel
          </Button>
          <Button onClick={handleWaive} disabled={waiveSaving} variant="contained" sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#fff' }, textTransform: 'none', px: 3, boxShadow: 'none' }}>
            {waiveSaving ? 'Waiving…' : 'Waive fee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LateFeeWaiversAdmin;