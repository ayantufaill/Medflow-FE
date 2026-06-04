import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  Link as MuiLink,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const ProductionCollection = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    fetchProductionCollection();
  }, []);

  const fetchProductionCollection = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('production-collection', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    let data = [...reportData];
    
    if (providerFilter !== 'all') {
      data = data.filter(r => r.provider === providerFilter);
    }
    
    if (codeInput.trim()) {
      const codes = codeInput.split(',').map(c => c.trim().toLowerCase());
      if (codeFilterMode === 'filter') {
        data = data.filter(r => codes.includes((r.code || 'PAYMENT').toLowerCase()));
      } else {
        data = data.filter(r => !codes.includes((r.code || 'PAYMENT').toLowerCase()));
      }
    }
    
    if (grouping === 'group-provider') {
      data.sort((a, b) => (a.provider || '').localeCompare(b.provider || ''));
    }
    
    return data;
  }, [reportData, providerFilter, grouping, codeFilterMode, codeInput]);

  const uniqueProviders = Array.from(new Set(reportData.map(r => r.provider).filter(Boolean)));

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Patient,DOB,Code,Procedure,Provider,Procedure Charge,Insurance Payment,Patient Payment\n";
    filteredData.forEach(row => {
      const line = `"${row.date}","${row.patient || 'Unknown'}","${row.dob || ''}","${row.code || 'PAYMENT'}","${row.procedure || row.paymentMethod || 'Payment'}","${row.provider || 'SAB'}","${(row.charge || row.production || 0).toFixed(2)}","${(row.insPayment || 0).toFixed(2)}","${(row.ptPayment || row.collection || 0).toFixed(2)}"`;
      csvContent += line + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_collection_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production & Collection Report:
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 36 }}>
          <Tab label="Current Report" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
          <Tab label="Generated Reports" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
        </Tabs>
      </Box>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
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

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
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

        <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item>
            <RadioGroup row value={codeFilterMode} onChange={e => setCodeFilterMode(e.target.value)}>
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 0.5 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Display Only Records with Collection</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Exclude Products</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={showFlags} onChange={e => setShowFlags(e.target.checked)} />} label={<Typography variant="caption">Show Flags in Report</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Date of Birth</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Provider</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by DOS</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" value={ptsFlagFilter} onChange={e => setPtsFlagFilter(e.target.value)} sx={{ minWidth: 200, fontSize: '0.75rem' }}>
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" value={sortReportBy} onChange={e => setSortReportBy(e.target.value)} sx={{ minWidth: 100, fontSize: '0.75rem' }}>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchProductionCollection} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <MuiLink sx={{ fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Office (no provider section)</MuiLink>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Production</TableCell>
              <TableCell align="center" colSpan={10} sx={{ borderLeft: '1px solid #e0e0e0' }}>Collection</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell colSpan={6}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Procedure Charge</TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell align="right">Estimate write off ⓘ</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Insurance Payment</TableCell>
              <TableCell align="right">Patient Payment</TableCell>
              <TableCell align="right">Actual Write-off ⓘ</TableCell>
              <TableCell align="right">Adj ⓘ</TableCell>
              <TableCell align="right">Pt. Refund ⓘ</TableCell>
              <TableCell align="right">Ins. Refund ⓘ</TableCell>
              <TableCell align="right">Pay From Credit ⓘ</TableCell>
              <TableCell align="right">Refund To Credit ⓘ</TableCell>
              <TableCell align="right">Credit (+/-) ⓘ</TableCell>
              <TableCell align="right">Overpayment To Credit ⓘ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={21} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={21} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No production or collection data found for this period
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5, whiteSpace: 'nowrap' } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                     {showFlags && <Box sx={{ width: 12, height: 12, bgcolor: '#f5a623', borderRadius: '2px' }} />}
                  </TableCell>
                  <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient || 'Unknown'}</TableCell>
                  <TableCell>{row.dob || ''}</TableCell>
                  <TableCell>{row.code || 'PAYMENT'}</TableCell>
                  <TableCell>{row.procedure || row.paymentMethod || 'Payment'}</TableCell>
                  <TableCell align="center" sx={{ borderLeft: '1px solid #f0f0f0' }}>{row.render || 'SAB'}</TableCell>
                  <TableCell align="center">{row.bill || 'SAB'}</TableCell>
                  <TableCell align="right" sx={{ borderLeft: '1px solid #f0f0f0' }}>${(row.charge || row.production || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.adj || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.estWriteOff || 0).toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ borderLeft: '1px solid #f0f0f0' }}>${(row.insPayment || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.ptPayment || row.collection || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.actualWriteOff || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.collAdj || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.ptRefund || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.insRefund || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.payFromCredit || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.refundToCredit || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.overpayment || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionCollection;
