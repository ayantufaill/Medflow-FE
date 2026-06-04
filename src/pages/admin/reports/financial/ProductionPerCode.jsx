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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const ProductionPerCode = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMode, setDateMode] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' });

  useEffect(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (dateMode === 'daily') {
      // Just today
    } else if (dateMode === 'weekly') {
      start.setDate(today.getDate() - today.getDay());
      end.setDate(start.getDate() + 6);
    } else if (dateMode === 'monthly') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    if (dateMode !== 'range') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [dateMode]);

  useEffect(() => {
    fetchProductionPerCode();
  }, []);

  const fetchProductionPerCode = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('production-per-code', { startDate, endDate });
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
    
    if (codeInput.trim()) {
      const search = codeInput.toLowerCase();
      data = data.filter(r => (r.code || '').toLowerCase().includes(search));
    }

    if (sortConfig !== null) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'average') {
           valA = (a.count > 0 ? a.totalFee / a.count : 0);
           valB = (b.count > 0 ? b.totalFee / b.count : 0);
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [reportData, codeInput, sortConfig]);

  const totalProduction = reportData.reduce((acc, row) => acc + (row.totalFee || 0), 0);
  const totalQuantity = reportData.reduce((acc, row) => acc + (row.count || 0), 0);
  const averageAll = totalQuantity > 0 ? (totalProduction / totalQuantity) : 0;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Code,Procedure,Quantity,Total Production,Average Production,Percent Production\n";
    filteredData.forEach(row => {
      const avg = row.count > 0 ? row.totalFee / row.count : 0;
      const pct = totalProduction > 0 ? (row.totalFee / totalProduction) * 100 : 0;
      csvContent += `"${row.code}","Procedure","${row.count}","${row.totalFee.toFixed(2)}","${avg.toFixed(2)}","${pct.toFixed(2)}%"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_per_code.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const tableHeaders = [
    { label: 'Code', align: 'left', key: 'code' },
    { label: 'Procedure', align: 'left', key: 'code' },
    { label: 'Quantity', align: 'right', key: 'count' },
    { label: 'Total Production', align: 'right', key: 'totalFee' },
    { label: 'Average Production', align: 'right', key: 'average' },
    { label: 'Percent Production', align: 'right', key: 'totalFee' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production per code:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item>
                <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Date Range:</Typography>
                <Select size="small" value={dateMode} onChange={(e) => setDateMode(e.target.value)} sx={{ minWidth: 100, fontSize: '0.75rem' }}>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="range">Range</MenuItem>
                </Select>
              </Grid>
              <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>From:</Typography>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => { setStartDate(e.target.value); setDateMode('range'); }} 
                  style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
                />
                <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>To:</Typography>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => { setEndDate(e.target.value); setDateMode('range'); }} 
                  style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
                <Select size="small" defaultValue="all" sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                  <MenuItem value="all">Provider: All</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Select size="small" defaultValue="all" sx={{ minWidth: 160, fontSize: '0.75rem' }}>
                  <MenuItem value="all">Referral Provider: All</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Select size="small" defaultValue="none" sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                  <MenuItem value="none">Group by: None</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textDecoration: 'underline' }}>Enter Code</Typography>
            <TextField 
              size="small" 
              fullWidth 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Enter code or procedure" 
              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Show collection per code</Typography>} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchProductionPerCode} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary', py: 1.5 } }}>
              {tableHeaders.map((header) => (
                <TableCell key={header.label} align={header.align} sx={{ cursor: 'pointer' }} onClick={() => handleSort(header.key)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: header.align === 'right' ? 'flex-end' : 'flex-start' }}>
                    {header.label}
                    <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: sortConfig?.key === header.key ? '#1976d2' : '#94a3b8' }} />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No production data found for this period
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => {
                const avg = row.count > 0 ? row.totalFee / row.count : 0;
                const pct = totalProduction > 0 ? (row.totalFee / totalProduction) * 100 : 0;
                return (
                  <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1 } }}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Procedure</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">${row.totalFee.toFixed(2)}</TableCell>
                    <TableCell align="right">${avg.toFixed(2)}</TableCell>
                    <TableCell align="right">{pct.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })
            )}
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 600 }}>Total Production Charges:</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 700, color: 'primary.main' }}>${totalProduction.toFixed(2)}</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 600 }}>Average Charge For All Procedures:</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 700, color: 'primary.main' }}>${averageAll.toFixed(2)}</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionPerCode;
