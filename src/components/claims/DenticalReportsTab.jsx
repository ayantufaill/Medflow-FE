import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { DenticalReportsTable } from './DenticalReportsTable';
import { claimService } from '../../services/claim.service';
import refreshIcon from '../../assets/claimicons/refreshicon.svg';

const DenticalReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await claimService.getDenticalReports();
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter the reports based on search
  const filteredReports = reports.filter((report) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (report.patientName && report.patientName.toLowerCase().includes(q)) ||
      (report.claimNumber && report.claimNumber.toLowerCase().includes(q)) ||
      (report.date && report.date.toLowerCase().includes(q)) ||
      (report.reportType && report.reportType.toLowerCase().includes(q))
    );
  });

  return (
    <Box>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: 'none',
          border: '1px solid #e0e6ed',
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 400 }}>
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
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem' } }}
          />
        </Box>
        <Button
          onClick={loadData}
          sx={{
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#1a3a6b',
            padding: '4px 8px',
            minWidth: 'auto',
            gap: 0.5,
            '&:hover': { background: 'none', textDecoration: 'underline' },
          }}
        >
          <Box component="img" src={refreshIcon} alt="refresh" sx={{ width: 14, height: 14 }} />
          Refresh
        </Button>
      </Paper>

      <DenticalReportsTable filteredDenticalReports={filteredReports} />
    </Box>
  );
};

export default DenticalReportsTab;
