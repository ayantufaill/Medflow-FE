import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const CourtesyCreditReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [patientFilter, setPatientFilter] = useState('all');

  useEffect(() => {
    fetchCourtesyCredits();
  }, []);

  const fetchCourtesyCredits = async () => {
    setLoading(true);
    try {
      // Assuming empty dates or defaults are handled by the backend if not provided.
      // Or we can just pass a wide range if required.
      const data = await reportingService.getFinancialReport('courtesy-credit');
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = [...reportData];
    if (searchInput.trim()) {
      const search = searchInput.toLowerCase();
      data = data.filter(r => (r.patient || '').toLowerCase().includes(search));
    }
    
    if (patientFilter !== 'all') {
      data = data.filter(r => r.patient === patientFilter);
    }
    
    if (sortConfig !== null) {
      data.sort((a, b) => {
        let valA = sortConfig.key === 'name' ? a.patient : a.creditAmount;
        let valB = sortConfig.key === 'name' ? b.patient : b.creditAmount;
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [reportData, searchInput, sortConfig, patientFilter]);

  const uniquePatients = Array.from(new Set(reportData.map(r => r.patient).filter(Boolean)));

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalAmount = filteredData.reduce((acc, row) => acc + (row.creditAmount || 0), 0);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Patient ID,Patient Name,Amount\n";
    filteredData.forEach(row => {
      csvContent += `"-","${row.patient}","${row.creditAmount || 0}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "courtesy_credit_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Courtesy Credit Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Outstanding:</Typography>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All patients</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Patients:</Typography>
            <Select fullWidth size="small" variant="standard" value={patientFilter} onChange={e => setPatientFilter(e.target.value)} sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
              {uniquePatients.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Flags:</Typography>
            <Select fullWidth size="small" variant="standard" defaultValue="pts" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="pts">Patients with or without flags</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <TextField
            size="small"
            placeholder="Search by patient name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: 250, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.8 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchCourtesyCredits} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export As CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff', '& th': { fontSize: '0.8rem', fontWeight: 600, py: 1.5 } }}>
              <TableCell>Flags</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Patient Name <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: sortConfig?.key === 'name' ? '#1976d2' : '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  Amount <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: sortConfig?.key === 'amount' ? '#1976d2' : '#94a3b8' }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No courtesy credits found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1 } }}>
                  <TableCell>
                    {row.flags && (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        {row.flags.map((color, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.creditAmount || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            <TableRow sx={{ backgroundColor: '#fcfcfc', '& td': { fontWeight: 700, fontSize: '0.75rem' } }}>
              <TableCell align="right" colSpan={2}>Total</TableCell>
              <TableCell>{filteredData.length} patients</TableCell>
              <TableCell align="right">${totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditReport;
