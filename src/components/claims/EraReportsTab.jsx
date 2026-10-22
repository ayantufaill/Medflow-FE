import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, Button, IconButton, CircularProgress, Tooltip, Snackbar, Alert,
  TablePagination, Popover, FormControl, InputLabel, Select, MenuItem, Badge
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import apiClient from '../../config/api';
import refreshIcon from '../../assets/claimicons/refreshicon.svg';

const DEFAULT_FILTERS = {
  status: 'all',
  paymentType: 'all',
  carrier: '',
  startDate: '',
  endDate: '',
};

const EraReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  
  const [activeEraTab, setActiveEraTab] = useState('active'); // 'active' or 'voided'
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [counts, setCounts] = useState({ active: 0, voided: 0 });
  const [generatingId, setGeneratingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCounts = useCallback(async () => {
    try {
      const [activeData, voidedData] = await Promise.all([
        claimService.getEraReports({ eraTab: 'active', limit: 1 }),
        claimService.getEraReports({ eraTab: 'voided', limit: 1 })
      ]);
      setCounts({
        active: activeData?.pagination?.total ?? activeData?.reports?.length ?? 0,
        voided: voidedData?.pagination?.total ?? voidedData?.reports?.length ?? 0,
      });
    } catch (err) {
      console.error('Failed to load ERA tab counts', err);
    }
  }, []);

  const loadData = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const data = await claimService.getEraReports({
        eraTab: activeEraTab,
        search: debouncedSearch,
        page: page + 1,
        limit: rowsPerPage,
        status: filters.status !== 'all' ? filters.status : '',
        paymentType: filters.paymentType !== 'all' ? filters.paymentType : '',
        carrier: filters.carrier,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      if (currentRequest !== requestId.current) return;
      setReports(data?.reports || []);
      setTotal(data?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      if (currentRequest === requestId.current) {
        setReports([]);
        setTotal(0);
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [activeEraTab, debouncedSearch, page, rowsPerPage, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleRefresh = () => {
    loadData();
    fetchCounts();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
    setFilterAnchorEl(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenerateSecondary = async (targetId) => {
    if (!targetId) return;
    setGeneratingId(targetId);
    try {
      await apiClient.post(`/claims/${targetId}/generate-secondary`, {});
      setToast({ open: true, message: 'Secondary claim generated successfully!', severity: 'success' });
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to generate secondary claim',
        severity: 'error'
      });
    } finally {
      setGeneratingId(null);
    }
  };

  const activeFilterCount = (filters.status !== 'all' ? 1 : 0) +
    (filters.paymentType !== 'all' ? 1 : 0) +
    (filters.carrier ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          minWidth: 0,
        }}
      >
        {/* ERA Sub-tabs */}
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: '#f1f5f9', p: 0.5, borderRadius: '6px' }}>
          <Button
            onClick={() => { setActiveEraTab('active'); setPage(0); }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 2,
              py: 0.5,
              borderRadius: '4px',
              color: activeEraTab === 'active' ? '#ffffff' : '#64748b',
              backgroundColor: activeEraTab === 'active' ? '#3b82f6' : 'transparent',
              '&:hover': { backgroundColor: activeEraTab === 'active' ? '#3b82f6' : 'rgba(0,0,0,0.05)' },
            }}
          >
            Active ({counts.active})
          </Button>
          <Button
            onClick={() => { setActiveEraTab('voided'); setPage(0); }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 2,
              py: 0.5,
              borderRadius: '4px',
              color: activeEraTab === 'voided' ? '#ffffff' : '#64748b',
              backgroundColor: activeEraTab === 'voided' ? '#3b82f6' : 'transparent',
              '&:hover': { backgroundColor: activeEraTab === 'voided' ? '#3b82f6' : 'rgba(0,0,0,0.05)' },
            }}
          >
            Voided ({counts.voided})
          </Button>
        </Box>

        {/* Filter Button */}
        <Badge badgeContent={activeFilterCount} color="primary">
          <Button
            variant="outlined"
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            startIcon={<FilterIcon sx={{ color: '#3b82f6' }} />}
            sx={{
              textTransform: 'none',
              color: '#3b82f6',
              borderColor: '#e2e8f0',
              fontWeight: 600,
              fontSize: '0.85rem',
              backgroundColor: '#ffffff',
            }}
          >
            Filters
          </Button>
        </Badge>

        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={() => setFilterAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, width: 300, display: 'flex', flexDirection: 'column', gap: 1.5 } }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Filter ERA Reports</Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Partially_Paid">Partially Paid</MenuItem>
              <MenuItem value="Denial">Denial</MenuItem>
              <MenuItem value="Voided">Voided</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Payment Type</InputLabel>
            <Select
              value={filters.paymentType}
              label="Payment Type"
              onChange={(e) => handleFilterChange('paymentType', e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="EFT">EFT</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Carrier"
            placeholder="Search carrier..."
            value={filters.carrier}
            onChange={(e) => handleFilterChange('carrier', e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Button size="small" onClick={handleClearFilters} sx={{ textTransform: 'none', color: '#64748b' }}>
              Clear All
            </Button>
            <Button size="small" variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ textTransform: 'none' }}>
              Apply
            </Button>
          </Box>
        </Popover>

        {/* Search */}
        <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 360 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search ERA reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.85rem',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />
        </Box>

        <Button
          onClick={handleRefresh}
          sx={{
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#64748b',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            gap: 1,
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
          }}
        >
          <Box component="img" src={refreshIcon} alt="refresh" sx={{ width: 14, height: 14 }} />
          Refresh
        </Button>
      </Paper>

      {loading && <Typography sx={{ py: 1, fontSize: '0.85rem', color: '#64748b' }}>Loading ERA reports...</Typography>}

      {/* ERA REPORTS Table */}
      <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none", border: "1px solid #e2e8f0", borderRadius: "8px", width: "100%", overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 1600 }}>
          <TableHead sx={{ backgroundColor: "#f8f9fa", "& .MuiTableCell-root": { py: 1, px: 1, fontSize: "0.7rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", color: "inherit", whiteSpace: "nowrap" } }}>
            <TableRow>
              {['PATIENT ID', 'PATIENT NAME', 'CLAIM #', 'CARRIER', 'STATUS', 'AMOUNT SUBMITTED', 'AMOUNT PAID', 'PATIENT RESPONSIBILITY', 'WRITE OFF', 'DATE RECEIVED', 'PAYMENT TYPE'].map((head) => (
                <TableCell key={head} >
                  {head}
                </TableCell>
              ))}
              <TableCell align="right">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& .MuiTableCell-root": { py: 1.5, px: 1, fontSize: "0.75rem", verticalAlign: "middle", borderBottom: "1px solid #e2e8f0", color: "#1e293b", whiteSpace: "nowrap" } }}>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    No ERA reports found matching the selection criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((era) => {
                const isVoided = era.status === 'Voided';
                const isDenial = era.status === 'Denial';
                const targetClaimId = era.claimId || era.claimNumber || era.id;
                return (
                  <TableRow key={era.id} hover={false}>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>{era.patientId}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#3b82f6' }}>{era.patientName}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>{era.claimNumber}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>{era.carrier}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: isVoided ? '#e53e3e' : isDenial ? '#dd6b20' : '#319795' }}>{era.status}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>${(era.amountSubmitted || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700 }}>${(era.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>${(era.patientResponsibility || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>${(era.writeOff || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>{era.dateReceived}</Typography></TableCell>
                    <TableCell sx={{ py: 1.5 }}><Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>{era.paymentType}</Typography></TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      {era.status === 'Paid' || era.status === 'Accepted' || era.status === 'Partially_Paid' ? (
                        <Tooltip title="Generate Secondary Claim">
                          <span>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#3b82f6', '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.08)' } }} 
                              onClick={() => handleGenerateSecondary(targetClaimId)}
                              disabled={generatingId === targetClaimId}
                            >
                              {generatingId === targetClaimId ? (
                                <CircularProgress size={18} />
                              ) : (
                                <DescriptionIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EraReportsTab;
