import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const AgingReport = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const agingBuckets = [
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ];

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [balanceFilter, setBalanceFilter] = useState('Any Balance');
  const [owingFilter, setOwingFilter] = useState('Any Type of Owing');
  const [providerFilter, setProviderFilter] = useState('All Providers');
  const [filteredData, setFilteredData] = useState([]);
  const [hideNames, setHideNames] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [archivedDateFilter, setArchivedDateFilter] = useState('');

  const archivedDatesList = [
    '05/07/2026', '05/06/2026', '05/05/2026', '05/04/2026', '05/03/2026',
    '05/02/2026', '05/01/2026', '04/30/2026', '04/29/2026', '04/28/2026',
    '04/27/2026', '04/26/2026', '04/25/2026', '04/24/2026', '04/23/2026',
    '04/22/2026'
  ];

  const filteredArchivedDates = archivedDatesList.filter(d => {
    if (!archivedDateFilter) return true;
    const [month, day, year] = d.split('/');
    return `${year}-${month}-${day}` === archivedDateFilter;
  });

  useEffect(() => {
    fetchAgingReport();
  }, []);

  const fetchAgingReport = async (selectedDate = null) => {
    setLoading(true);
    try {
      const params = selectedDate ? { date: selectedDate } : {};
      const data = await reportingService.getFinancialReport('aging', params);
      setReportData(data || []);
      setFilteredData(data || []);
    } catch (error) {
      console.error('Failed to fetch aging report', error);
      setReportData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reportData];
    
    if (balanceFilter !== 'Any Balance') {
      if (balanceFilter === '> $0') filtered = filtered.filter(row => row.total > 0);
      else if (balanceFilter === '< $0 (Credit)') filtered = filtered.filter(row => row.total < 0);
    }
    
    // In a full implementation, owingFilter and providerFilter logic would map to specific data fields
    setFilteredData(filtered);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Patient Name," + agingBuckets.join(",") + ",Total,Total Owings,Payment Plan Owing,Credit,Last Billed On\n";
    
    const dataToExport = selectedRows.length > 0 ? filteredData.filter((_, idx) => selectedRows.includes(idx)) : filteredData;

    dataToExport.forEach(row => {
      const name = `"${hideNames ? 'HIDDEN' : row.name}"`;
      const buckets = agingBuckets.map(b => row.buckets && row.buckets[b] ? `"${row.buckets[b].pt + row.buckets[b].ins}"` : '"0"').join(",");
      const total = `"${row.total || 0}"`;
      const owings = `"${row.totalOwings || 0}"`;
      const plan = `"${row.paymentPlan || 0}"`;
      const credit = `"${row.credit || 0}"`;
      const billed = `"${row.lastBilled || ''}"`;
      
      csvContent += `${name},${buckets},${total},${owings},${plan},${credit},${billed}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aging_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (idx) => {
    if (selectedRows.includes(idx)) {
      setSelectedRows(selectedRows.filter(i => i !== idx));
    } else {
      setSelectedRows([...selectedRows, idx]);
    }
  };

  const calculateTotals = () => {
    const totals = { buckets: {}, totalOwings: 0, credit: 0 };
    agingBuckets.forEach(b => totals.buckets[b] = 0);
    
    filteredData.forEach(row => {
      agingBuckets.forEach(b => {
        if (row.buckets && row.buckets[b]) {
          totals.buckets[b] += (row.buckets[b].pt || 0) + (row.buckets[b].ins || 0);
        }
      });
      totals.totalOwings += (row.totalOwings || 0);
      totals.credit += (row.credit || 0);
    });
    return totals;
  };

  const totals = calculateTotals();

  const renderFilterSelect = (label, options, value, onChange) => (
    <Select
      size="small"
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff' }}
    >
      <MenuItem value={label}>{label}</MenuItem>
      {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
    </Select>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Aging Report:
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 36 }}>
          <Tab label="Current Report" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
          <Tab label="Archived Reports" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          {/* Filter Section */}
          <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary' }}>Filter Report By</Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item>{renderFilterSelect('Any Balance', ['> $0', '< $0 (Credit)'], balanceFilter, setBalanceFilter)}</Grid>
              <Grid item>{renderFilterSelect('Any Type of Owing', ['Patient Owings', 'Insurance Owings'], owingFilter, setOwingFilter)}</Grid>
              <Grid item>{renderFilterSelect('Any Billing Date', [], 'Any Billing Date', () => {})}</Grid>
              <Grid item>{renderFilterSelect('With OR Without Open Claims', [], 'With OR Without Open Claims', () => {})}</Grid>
              <Grid item>{renderFilterSelect('Active Patients Only', [], 'Active Patients Only', () => {})}</Grid>
              <Grid item>{renderFilterSelect('All Providers', ['Dr. Sabour', 'Sabour Ortho'], providerFilter, setProviderFilter)}</Grid>
              <Grid item>{renderFilterSelect('Any AR Range', [], 'Any AR Range', () => {})}</Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Select size="small" defaultValue="pts" sx={{ minWidth: 200, fontSize: '0.75rem', backgroundColor: '#fff' }}>
                <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
              </Select>
              <FormControlLabel 
                control={<Checkbox size="small" defaultChecked />} 
                label={<Typography variant="caption">Show Flags in Report</Typography>} 
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" defaultValue="high-low" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
                <MenuItem value="high-low">High to Low Owings</MenuItem>
              </Select>
              <FormControlLabel 
                control={<Checkbox size="small" defaultChecked />} 
                label={<Typography variant="caption">Show Payment Plan Owing</Typography>} 
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Reset Invoice outstanding balance age to 0 days: 
                <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'help' }}>ⓘ</Box>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption">On Patient Payment:</Typography>
                <Select size="small" defaultValue="dont" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
                  <MenuItem value="dont">Don't reset invoice age</MenuItem>
                </Select>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption">On Insurance Payment:</Typography>
                <Select size="small" defaultValue="dont" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
                  <MenuItem value="dont">Don't reset invoice age</MenuItem>
                </Select>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" size="small" onClick={applyFilters} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#94a3b8' }}>Generate Batch Statement</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>View generated statements</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel 
                control={<Checkbox size="small" checked={hideNames} onChange={(e) => setHideNames(e.target.checked)} />} 
                label={<Typography variant="caption">Hide Patient Names</Typography>} 
              />
              <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
              <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
            </Box>
          </Box>

          {/* Table Section */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      size="small" 
                      checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Flags</TableCell>
                  <TableCell>Patient Name</TableCell>
                  {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket}</TableCell>)}
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Total owings</TableCell>
                  <TableCell align="right">Payment Plan Owing</TableCell>
                  <TableCell align="right">Credit</TableCell>
                  <TableCell>Last Billed On</TableCell>
                  <TableCell>Notes</TableCell>
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
                      No data matches current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <TableRow sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
                        <TableCell padding="checkbox">
                          <Checkbox 
                            size="small" 
                            checked={selectedRows.includes(idx)}
                            onChange={() => handleSelectRow(idx)}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                            </Box>
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>{hideNames ? 'HIDDEN' : row.name}</Typography>
                          </Box>
                        </TableCell>
                        {agingBuckets.map(bucket => (
                          <TableCell key={bucket} align="right">
                            <Box>
                              <Typography variant="caption" sx={{ display: 'block' }}>Pt. ${(row.buckets && row.buckets[bucket] ? row.buckets[bucket].pt : 0).toFixed(2)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>Ins. ${(row.buckets && row.buckets[bucket] ? row.buckets[bucket].ins : 0).toFixed(2)}</Typography>
                            </Box>
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          <Typography variant="caption" sx={{ display: 'block' }}>${(row.total || 0).toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.totalOwings || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">${(row.paymentPlan || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                        <TableCell>{row.lastBilled || ''}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer' }}>
                            <NoteAddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            <Typography variant="caption">add account note</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Footer */}
          <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ width: '25%', fontWeight: 600 }}>Total Patients Balances</TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} align="right" sx={{ width: '8%', fontWeight: 600 }}>
                      ${totals.buckets[bucket].toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>${totals.totalOwings.toFixed(2)}</TableCell>
                  <TableCell sx={{ width: '15%' }}></TableCell>
                </TableRow>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
                  {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
                  <TableCell></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${totals.credit.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Select report by date:</Typography>
            <input 
              type="date" 
              value={archivedDateFilter}
              onChange={(e) => setArchivedDateFilter(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                padding: '4px 0',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#666',
                background: 'transparent',
                width: 150
              }}
            />
            {archivedDateFilter && (
              <Button 
                size="small" 
                onClick={() => setArchivedDateFilter('')}
                sx={{ minWidth: 'auto', p: 0, textTransform: 'none', ml: 1, color: '#e55353' }}
              >
                Clear
              </Button>
            )}
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 700, py: 1 }}>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArchivedDates.length === 0 ? (
                  <TableRow>
                    <TableCell align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                      No archived reports found for this date.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArchivedDates.map((date) => (
                    <TableRow key={date} sx={{ '&:hover': { backgroundColor: '#f1f5f9' } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography 
                          variant="caption" 
                          color="primary" 
                          sx={{ fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => {
                            fetchAgingReport(new Date(date).toISOString().split('T')[0]);
                            setTabValue(0);
                          }}
                        >
                          Report - {date}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AgingReport;

