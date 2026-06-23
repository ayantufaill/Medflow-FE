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
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';

const ProductionReport = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [provider, setProvider] = useState('all');
  const [grouping, setGrouping] = useState('no-grouping');
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');
  const [showFlags, setShowFlags] = useState(true);
  const [flagFilter, setFlagFilter] = useState('pts');
  const [sortBy, setSortBy] = useState('default');
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    const today = new Date();
    
    if (newMode === 'daily') {
      const todayStr = today.toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (newMode === 'weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      setStartDate(startOfWeek.toISOString().split('T')[0]);
      setEndDate(endOfWeek.toISOString().split('T')[0]);
    } else if (newMode === 'monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(startOfMonth.toISOString().split('T')[0]);
      setEndDate(endOfMonth.toISOString().split('T')[0]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const rangeParam = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch production report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, startDate, endDate]);

  const handlePrevRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const newStart = new Date(start);
    newStart.setDate(start.getDate() - diffDays);
    const newEnd = new Date(end);
    newEnd.setDate(end.getDate() - diffDays);
    
    setStartDate(newStart.toISOString().split('T')[0]);
    setEndDate(newEnd.toISOString().split('T')[0]);
  };

  const handleNextRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const newStart = new Date(start);
    newStart.setDate(start.getDate() + diffDays);
    const newEnd = new Date(end);
    newEnd.setDate(end.getDate() + diffDays);
    
    setStartDate(newStart.toISOString().split('T')[0]);
    setEndDate(newEnd.toISOString().split('T')[0]);
  };

  const getProviderLabel = (p) => {
    if (p?.userId?.firstName || p?.userId?.lastName) {
      return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
    }
    return `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.name || 'Unknown';
  };

  const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === provider);
  const selectedProvName = selectedProvObj ? getProviderLabel(selectedProvObj) : '';

  const codes = codeText ? codeText.toLowerCase().split(/[,\s]+/).map(c => c.trim()).filter(Boolean) : [];

  const filteredReportData = reportData.filter(row => {
    // 1. Provider Filter
    if (provider !== 'all') {
      if (!row.provider) return false;
      const match = row.provider.toLowerCase().includes(selectedProvName.toLowerCase()) || 
                    selectedProvName.toLowerCase().includes(row.provider.toLowerCase());
      if (!match) return false;
    }

    // 2. Code Filter
    if (codes.length > 0) {
      const rowCode = (row.code || '').toLowerCase();
      const matches = codes.some(c => rowCode.includes(c));
      if (codeFilter === 'filter' && !matches) return false;
      if (codeFilter === 'exclude' && matches) return false;
    }

    // 3. Flag Filter
    if (flagFilter === 'with_flags') {
      if (!row.flags || row.flags.length === 0) return false;
    } else if (flagFilter === 'without_flags') {
      if (row.flags && row.flags.length > 0) return false;
    }

    return true;
  });

  // 4. Sort Report Data
  const sortedReportData = [...filteredReportData].sort((a, b) => {
    if (sortBy === 'date_asc') {
      return new Date(a.date || 0) - new Date(b.date || 0);
    }
    if (sortBy === 'date_desc') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    }
    if (sortBy === 'patient') {
      return (a.patient || '').localeCompare(b.patient || '');
    }
    if (sortBy === 'amount_desc') {
      const aAmt = a.fee || a.charge || 0;
      const bAmt = b.fee || b.charge || 0;
      return bAmt - aAmt;
    }
    return 0; // default
  });

  // Calculate Totals
  const totalCharge = filteredReportData.reduce((sum, row) => sum + (row.fee || row.charge || 0), 0);
  const totalAdj = filteredReportData.reduce((sum, row) => sum + (row.adj || 0), 0);
  const totalWriteOff = filteredReportData.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
  const netProduction = totalCharge + totalAdj - totalWriteOff;
  
  const seenPatients = new Set(filteredReportData.map((row) => row.patientId || row.patient).filter(Boolean)).size;
  const avgProduction = seenPatients > 0 ? netProduction / seenPatients : 0;

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Patient',
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Procedure Charge',
      'Adj',
      'Estimate write off'
    ];

    const rows = sortedReportData.map(row => [
      row.date ? new Date(row.date).toLocaleDateString() : '',
      row.patient || '',
      row.code || '',
      row.procedure || '',
      row.provider || '',
      row.provider || '',
      `$${(row.fee || row.charge || 0).toFixed(2)}`,
      `$${(row.adj || 0).toFixed(2)}`,
      `$${(row.estWriteOff || 0).toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('production-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production Report Table Only</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Date Range:</Typography>
            <Select 
              size="small" 
              value={dateRange} 
              onChange={handleFilterModeChange} 
              sx={{ minWidth: 140, fontSize: '0.75rem' }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="this_week">This Week</MenuItem>
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="last_7_days">Last 7 days</MenuItem>
              <MenuItem value="last_week">Last Week</MenuItem>
              <MenuItem value="last_4_weeks">Last 4 Weeks</MenuItem>
              <MenuItem value="last_month">Last Month</MenuItem>
              <MenuItem value="last_3_months">Last 3 Months</MenuItem>
              <MenuItem value="last_12_months">Last 12 Months</MenuItem>
              <MenuItem value="month_to_date">Month to date</MenuItem>
              <MenuItem value="quarter_to_date">Quarter to date</MenuItem>
              <MenuItem value="year_to_date">Year to date</MenuItem>
              <MenuItem value="last_year">Last Year</MenuItem>
            </Select>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Start Date: 
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
              />
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              End Date: 
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
              />
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
            <Select 
              size="small" 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)} 
              sx={{ minWidth: 140, fontSize: '0.75rem' }}
            >
              <MenuItem value="all">Provider: All</MenuItem>
              {dropdownProviders.map((p) => {
                const label = getProviderLabel(p);
                return (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row value={grouping} onChange={(e) => setGrouping(e.target.value)}>
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item>
            <RadioGroup row value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)}>
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 1 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel 
            control={<Checkbox size="small" checked={showFlags} onChange={(e) => setShowFlags(e.target.checked)} />} 
            label={<Typography variant="caption">Show Flags in Report</Typography>} 
          />
          <Select 
            size="small" 
            value={flagFilter} 
            onChange={(e) => setFlagFilter(e.target.value)} 
            sx={{ minWidth: 200, fontSize: '0.75rem' }}
          >
            <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            <MenuItem value="with_flags">Pts With Flags Only</MenuItem>
            <MenuItem value="without_flags">Pts Without Flags Only</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
            <Select 
              size="small" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              sx={{ minWidth: 150, fontSize: '0.75rem' }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="date_asc">Date: Ascending</MenuItem>
              <MenuItem value="date_desc">Date: Descending</MenuItem>
              <MenuItem value="patient">Patient Name</MenuItem>
              <MenuItem value="amount_desc">Amount: High to Low</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchData} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" disabled sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', position: 'relative' }} id="production-report-table">
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress size={30} />
          </Box>
        )}
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
            {sortedReportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
                  No records found matching current criteria.
                </TableCell>
              </TableRow>
            ) : grouping === 'group-provider' ? (
              (() => {
                const groups = {};
                sortedReportData.forEach(row => {
                  const prov = row.provider || 'Unassigned';
                  if (!groups[prov]) groups[prov] = [];
                  groups[prov].push(row);
                });

                return Object.keys(groups).map((provName) => {
                  const groupRows = groups[provName];
                  const grpCharge = groupRows.reduce((sum, row) => sum + (row.fee || row.charge || 0), 0);
                  const grpAdj = groupRows.reduce((sum, row) => sum + (row.adj || 0), 0);
                  const grpWriteOff = groupRows.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);

                  return (
                    <React.Fragment key={provName}>
                      <TableRow sx={{ backgroundColor: '#eef2f6' }}>
                        <TableCell colSpan={10} sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1 }}>
                          Provider: {provName}
                        </TableCell>
                      </TableRow>
                      {groupRows.map((row, idx) => (
                        <TableRow key={row.procedureId || idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5 } }}>
                          <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            {showFlags && (row.flags && row.flags.length > 0 ? (
                              <Box sx={{ display: 'flex', gap: 0.2 }}>
                                {row.flags.map((color, i) => (
                                  <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                                ))}
                              </Box>
                            ) : (
                              <Box sx={{ width: 10, height: 10, bgcolor: '#f5a623', borderRadius: '2px' }} />
                            ))}
                          </TableCell>
                          <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient || 'Mock Patient'}</TableCell>
                          <TableCell>{row.code || 'D0120'}</TableCell>
                          <TableCell>{row.procedure || 'Periodic Exam'}</TableCell>
                          <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                          <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                          <TableCell align="right">${(row.fee || row.charge || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">${(row.adj || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">${(row.estWriteOff || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: '#fcfcfc', '& td': { fontWeight: 600, fontSize: '0.7rem' } }}>
                        <TableCell colSpan={7} align="right">Subtotal ({provName}):</TableCell>
                        <TableCell align="right">${grpCharge.toFixed(2)}</TableCell>
                        <TableCell align="right">${grpAdj.toFixed(2)}</TableCell>
                        <TableCell align="right">${grpWriteOff.toFixed(2)}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                });
              })()
            ) : (
              sortedReportData.map((row, idx) => (
                <TableRow key={row.procedureId || idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5 } }}>
                  <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {showFlags && (row.flags && row.flags.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        {row.flags.map((color, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ width: 10, height: 10, bgcolor: '#f5a623', borderRadius: '2px' }} />
                    ))}
                  </TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient || 'Mock Patient'}</TableCell>
                  <TableCell>{row.code || 'D0120'}</TableCell>
                  <TableCell>{row.procedure || 'Periodic Exam'}</TableCell>
                  <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                  <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                  <TableCell align="right">${(row.fee || row.charge || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.adj || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.estWriteOff || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total:</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>${totalCharge.toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>${totalAdj.toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>${totalWriteOff.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Summary */}
      <Box sx={{ mt: 3, ml: 4 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>Net est. Production:</Box> 
          <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>
            Total Charge + Adj(+/-) - Est Write Off = ${netProduction.toFixed(2)}
          </Box>
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
