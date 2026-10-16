import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, TextField, InputAdornment, Button, TablePagination, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { DenticalReportsTable } from './DenticalReportsTable';
import { claimService } from '../../services/claim.service';
import refreshIcon from '../../assets/claimicons/refreshicon.svg';

const DenticalReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const data = await claimService.getDenticalReports({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
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
  }, [page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        <Box sx={{ flex: 1, maxWidth: 300 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by patient, claim #, type"
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

      {loading && <Typography sx={{ py: 1, fontSize: '0.85rem', color: '#64748b' }}>Loading reports...</Typography>}

      <DenticalReportsTable filteredDenticalReports={reports} />

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};

export default DenticalReportsTab;
