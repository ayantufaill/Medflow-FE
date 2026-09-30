import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Button, CircularProgress, Alert, Grid, Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { securityService } from '../../services/security.service';
import dayjs from 'dayjs';

const AuditTrailPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [filters, setFilters] = useState({
    from: null,
    to: null,
    user: '',
    patNum: '',
    permType: '',
    source: '',
    page: 1
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await securityService.getAuditLogs({
        ...filters,
        from: filters.from ? filters.from.toISOString() : '',
        to: filters.to ? filters.to.toISOString() : ''
      });
      setLogs(response?.data?.logs || response?.logs || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters.page]); // Fetch on page change, otherwise wait for manual trigger

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setVerifyResult(null);
      const res = await securityService.verifyAudit();
      setVerifyResult(res?.data || res);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to verify audit logs');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Audit Trail</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleVerify}
            disabled={verifying}
            startIcon={verifying ? <CircularProgress size={20} /> : null}
          >
            Verify Integrity
          </Button>
        </Box>

        {verifyResult && (
          <Alert severity={verifyResult.valid ? "success" : "error"} sx={{ mb: 3 }}>
            {verifyResult.isValid ?? verifyResult.valid
              ? "Audit log chain is cryptographically intact." 
              : `Integrity check failed at SecurityLogNum: ${verifyResult.invalidRowNum || verifyResult.mismatches?.[0]?.logNum || 'unknown'}`}
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="From Date"
                value={filters.from}
                onChange={(date) => setFilters({ ...filters, from: date })}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="To Date"
                value={filters.to}
                onChange={(date) => setFilters({ ...filters, to: date })}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="User ID"
                size="small"
                fullWidth
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Permission Type"
                size="small"
                fullWidth
                value={filters.permType}
                onChange={(e) => setFilters({ ...filters, permType: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="contained" fullWidth onClick={() => fetchLogs()} disabled={loading}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No audit logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{dayjs(log.LogDateTime).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    <TableCell><Chip label={log.PermType} size="small" /></TableCell>
                    <TableCell>{log.UserNum}</TableCell>
                    <TableCell>{log.PatNum || '-'}</TableCell>
                    <TableCell>{log.LogSource}</TableCell>
                    <TableCell>{JSON.stringify(log.LogText)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default AuditTrailPage;
