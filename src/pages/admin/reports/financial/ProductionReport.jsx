import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
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
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const ProductionReport = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMode, setDateMode] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [providerFilter, setProviderFilter] = useState('all');
  const [grouping, setGrouping] = useState('no-grouping');
  const [codeFilterMode, setCodeFilterMode] = useState('filter');
  const [codeInput, setCodeInput] = useState('');
  const [showFlags, setShowFlags] = useState(true);
  const [ptsFlagFilter, setPtsFlagFilter] = useState('pts');
  const [sortReportBy, setSortReportBy] = useState('default');

  const filteredData = React.useMemo(() => {
    let data = [...reportData];
    
    if (providerFilter !== 'all') {
      data = data.filter(r => r.provider === providerFilter);
    }
    
    if (codeInput.trim()) {
      const codes = codeInput.split(',').map(c => c.trim().toLowerCase());
      if (codeFilterMode === 'filter') {
        data = data.filter(r => codes.includes((r.code || '').toLowerCase()));
      } else {
        data = data.filter(r => !codes.includes((r.code || '').toLowerCase()));
      }
    }
    
    if (grouping === 'group-provider') {
      data.sort((a, b) => (a.provider || '').localeCompare(b.provider || ''));
    }
    
    return data;
  }, [reportData, providerFilter, grouping, codeFilterMode, codeInput]);

  const uniqueProviders = Array.from(new Set(reportData.map(r => r.provider).filter(Boolean)));

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
    fetchProductionReport();
  }, []);

  const fetchProductionReport = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('production', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch production report', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalCharge = filteredData.reduce((acc, row) => acc + (row.fee || 0), 0);
  const seenPatients = new Set(filteredData.map(r => r.patient || 'Unknown')).size;
  const avgProduction = seenPatients > 0 ? (totalCharge / seenPatients) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Patient,Code,Procedure,Provider,Procedure Charge\n";
    filteredData.forEach(row => {
      const line = `"${row.date}","${row.patient || 'Unknown'}","${row.code}","${row.procedureName || 'Exam'}","${row.provider}","${(row.fee || 0).toFixed(2)}"`;
      csvContent += line + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
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

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
            <Select size="small" value={providerFilter} onChange={e => setProviderFilter(e.target.value)} sx={{ minWidth: 140, fontSize: '0.75rem' }}>
              <MenuItem value="all">Provider: All</MenuItem>
              {uniqueProviders.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row value={grouping} onChange={e => setGrouping(e.target.value)}>
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item>
            <RadioGroup row value={codeFilterMode} onChange={e => setCodeFilterMode(e.target.value)}>
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 1 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel 
            control={<Checkbox size="small" checked={showFlags} onChange={e => setShowFlags(e.target.checked)} />} 
            label={<Typography variant="caption">Show Flags in Report</Typography>} 
          />
          <Select size="small" value={ptsFlagFilter} onChange={e => setPtsFlagFilter(e.target.value)} sx={{ minWidth: 200, fontSize: '0.75rem' }}>
            <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
            <Select size="small" value={sortReportBy} onChange={e => setSortReportBy(e.target.value)} sx={{ minWidth: 100, fontSize: '0.75rem' }}>
              <MenuItem value="default">Default</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchProductionReport} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
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
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Production</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
              <TableCell colSpan={5}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Procedure Charge</TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell align="right">Estimate write off ⓘ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No production data found for this period
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{row.patient || 'Unknown'}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.procedureName || 'Exam'}</TableCell>
                  <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>{row.provider}</TableCell>
                  <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>${(row.fee || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">$0.00</TableCell>
                  <TableCell align="right">$0.00</TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total:</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', borderLeft: '1px solid #e0e0e0' }}>${totalCharge.toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Summary */}
      <Box sx={{ mt: 3, ml: 4 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>Net est. Production:</Box> 
          <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>Total Charge + Adj(+/-) - Est Write Off = ${totalCharge.toFixed(2)}</Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          Number of Seen Patients: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>{seenPatients}</Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Average Production Per Patient: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>${avgProduction.toFixed(2)}</Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Switch to new</Typography>
      </Box>
    </Box>
  );
};

export default ProductionReport;
