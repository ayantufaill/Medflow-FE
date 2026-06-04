import React, { useState, useEffect, useMemo } from 'react';
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
  Tooltip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const AdjustmentReport = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMode, setDateMode] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [providerFilter, setProviderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFlags, setShowFlags] = useState(true);

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
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('adjustment', { startDate, endDate });
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
    
    if (providerFilter !== 'all') {
      data = data.filter(r => r.provider === providerFilter);
    }
    
    if (typeFilter !== 'all') {
      data = data.filter(r => r.notes === typeFilter);
    }
    
    return data;
  }, [reportData, providerFilter, typeFilter]);

  const uniqueProviders = Array.from(new Set(reportData.map(r => r.provider).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(reportData.map(r => r.notes).filter(Boolean)));

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Patient,Transaction,Provider,Adjustment,Type\n";
    filteredData.forEach(row => {
      csvContent += `"${row.date}","${row.patient}","${row.id}","${row.provider}","${row.amount}","${row.notes}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "adjustment_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
          Adjustment Report:
        </Typography>
        <Tooltip title="Adjustment Details">
          <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary', cursor: 'pointer' }} />
        </Tooltip>
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
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Provider:</Typography>
            <Select size="small" value={providerFilter} onChange={e => setProviderFilter(e.target.value)} sx={{ minWidth: 140, fontSize: '0.75rem' }}>
              <MenuItem value="all">Provider: All</MenuItem>
              {uniqueProviders.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Adjustment Type:</Typography>
            <Select size="small" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} sx={{ minWidth: 160, fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
              {uniqueTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row defaultValue="no-grouping">
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
              <FormControlLabel value="group-adj" control={<Radio size="small" />} label={<Typography variant="caption">Group By Adjustment</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item>
            <RadioGroup row defaultValue="filter">
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 0.5 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by Production Date</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={showFlags} onChange={e => setShowFlags(e.target.checked)} />} label={<Typography variant="caption">Show Flags in Report</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Date of Birth</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Provider</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by DOS</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" defaultValue="pts" sx={{ minWidth: 180, fontSize: '0.75rem' }}>
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" defaultValue="default" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchAdjustments} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Area */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Transaction #</TableCell>
              <TableCell>ADA</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
              <TableCell>Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell>Adjustment Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No adjustments found for this period
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    {showFlags && row.flags && (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        {row.flags.map((color, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.ada || '-'}</TableCell>
                  <TableCell>{row.site || '-'}</TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell>{row.provider}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: row.amount < 0 ? '#e11d48' : 'inherit' }}>
                    {row.amount < 0 ? `-$${Math.abs(row.amount).toFixed(2)}` : `$${row.amount.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdjustmentReport;
