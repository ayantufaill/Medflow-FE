import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, Button, IconButton, CircularProgress, Tooltip, Snackbar, Alert
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import apiClient from '../../config/api';
import refreshIcon from '../../assets/claimicons/refreshicon.svg';

const EraReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeEraTab, setActiveEraTab] = useState('active'); // 'active' or 'voided'
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState({ active: 0, voided: 0 });
  const [generatingId, setGeneratingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadData();
  }, [activeEraTab]);

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    try {
      const [activeData, voidedData] = await Promise.all([
        claimService.getEraReports({ eraTab: 'active', limit: 1 }),
        claimService.getEraReports({ eraTab: 'voided', limit: 1 })
      ]);
      setCounts({
        active: activeData.pagination?.total || activeData.reports?.length || 0,
        voided: voidedData.pagination?.total || voidedData.reports?.length || 0,
      });
    } catch (err) {
      console.error('Failed to load ERA tab counts', err);
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const data = await claimService.getEraReports({
        eraTab: activeEraTab,
        search: search,
        limit: 100,
      });
      setReports(data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

  // Filter based on search input manually if backend doesn't handle it well
  const filteredReports = reports.filter((report) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (report.patientName && report.patientName.toLowerCase().includes(q)) ||
      (report.claimNumber && report.claimNumber.toLowerCase().includes(q)) ||
      (report.patientId && report.patientId.toLowerCase().includes(q))
    );
  });

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
            onClick={() => setActiveEraTab('active')}
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
            onClick={() => setActiveEraTab('voided')}
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
        <Button
          variant="outlined"
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
          onClick={loadData}
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
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    No ERA reports found matching the selection criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((era) => {
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
