import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
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
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { reportingService } from '../../../../services/reporting.service';

const CourtesyCreditModifications = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const [adjTypeFilter, setAdjTypeFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [groupByAdj, setGroupByAdj] = useState(false);

  useEffect(() => {
    fetchModifications();
  }, []);

  const fetchModifications = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('courtesy-credit-modifications', { startDate, endDate });
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
    
    if (adjTypeFilter !== 'all') {
      data = data.filter(r => r.type === adjTypeFilter);
    }
    
    if (patientFilter !== 'all') {
      data = data.filter(r => r.patient === patientFilter);
    }

    if (userFilter !== 'all') {
      data = data.filter(r => r.authorizedBy === userFilter);
    }
    
    if (groupByAdj) {
      data.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
    }

    return data;
  }, [reportData, searchInput, adjTypeFilter, patientFilter, userFilter, groupByAdj]);

  const uniqueAdjTypes = Array.from(new Set(reportData.map(r => r.type).filter(Boolean)));
  const uniquePatients = Array.from(new Set(reportData.map(r => r.patient).filter(Boolean)));
  const uniqueUsers = Array.from(new Set(reportData.map(r => r.authorizedBy).filter(Boolean)));

  const totalAmount = filteredData.reduce((acc, row) => acc + (row.creditAmount || 0), 0);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Patient,Amount,Authorized By,Type\n";
    filteredData.forEach(row => {
      csvContent += `"${row.date}","${row.patient}","${row.creditAmount || 0}","${row.authorizedBy || ''}","${row.type || ''}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "courtesy_credit_modifications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Courtesy Credit Modifications Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={3} alignItems="flex-end" sx={{ mb: 2 }}>
          <Grid item xs={12} md={2}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>Start Date:</Typography>
            <Box sx={{ pb: 0.5 }}>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc', width: '100%' }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>End Date:</Typography>
            <Box sx={{ pb: 0.5 }}>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc', width: '100%' }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Adjustment Type:</Typography>
            <Select fullWidth size="small" variant="standard" value={adjTypeFilter} onChange={(e) => setAdjTypeFilter(e.target.value)} sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
              {uniqueAdjTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Action:</Typography>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Patients:</Typography>
            <Select fullWidth size="small" variant="standard" value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)} sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
              {uniquePatients.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Flags:</Typography>
            <Select fullWidth size="small" variant="standard" defaultValue="pts" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="pts">Patients with or without flags</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Users:</Typography>
            <Select fullWidth size="small" variant="standard" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
              {uniqueUsers.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Checkbox size="small" checked={groupByAdj} onChange={(e) => setGroupByAdj(e.target.checked)} />}
              label={<Typography variant="caption">Group By Adjustment Type</Typography>}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <TextField
            size="small"
            placeholder="Search by patient name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: 300, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.8 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchModifications} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2, borderTop: '1px solid #eee', pt: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export As CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff', '& th': { fontSize: '0.8rem', fontWeight: 600, py: 1.5 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Authorized By</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No modifications found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1 } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.authorizedBy}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.creditAmount || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            <TableRow sx={{ backgroundColor: '#fcfcfc', '& td': { fontWeight: 700, fontSize: '0.75rem' } }}>
              <TableCell align="right" colSpan={4}>Total Amount:</TableCell>
              <TableCell align="right">${totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditModifications;
