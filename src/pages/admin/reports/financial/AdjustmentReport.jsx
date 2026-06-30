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
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { fetchAdjustmentTypes, selectAdjustmentTypes } from '../../../../store/slices/billingSlice';

const AdjustmentReport = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);
  const adjustmentTypes = useSelector(selectAdjustmentTypes);

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [provider, setProvider] = useState('all');
  const [adjustmentType, setAdjustmentType] = useState('all');
  const [grouping, setGrouping] = useState('no-grouping');
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');
  
  const [filterByProductionDate, setFilterByProductionDate] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [showDOB, setShowDOB] = useState(true);
  const [showProviderColumn, setShowProviderColumn] = useState(true);
  const [filterByDOS, setFilterByDOS] = useState(false);

  const [flagFilter, setFlagFilter] = useState('pts');
  const [sortBy, setSortBy] = useState('default');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const computeDates = (mode) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (mode) {
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'last_7_days': {
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diff = today.getDate() - day - 6 + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        break;
      }
      case 'last_12_months': {
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      }
      case 'month_to_date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      }
      case 'quarter_to_date': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'year_to_date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      case 'last_year': {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      default:
        return null;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    
    const dates = computeDates(newMode);
    if (dates) {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
  };

  const lastFetchedRef = React.useRef(null);

  const fetchData = async () => {
    const paramsKey = `${dateRange}_${startDate}_${endDate}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);
      const res = await reportingService.getFinancialReport('adjustment', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch adjustments report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    dispatch(fetchAdjustmentTypes());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [dateRange, startDate, endDate]);

  const getProviderFirstAndLastName = (p) => {
    if (p?.userId?.firstName || p?.userId?.lastName) {
      return {
        firstName: p.userId.firstName || '',
        lastName: p.userId.lastName || ''
      };
    }
    return {
      firstName: p?.firstName || '',
      lastName: p?.lastName || ''
    };
  };

  const getProviderLabel = (p) => {
    const { firstName, lastName } = getProviderFirstAndLastName(p);
    return `${firstName} ${lastName}`.trim() || p?.name || 'Unknown';
  };

  const filteredReportData = useMemo(() => {
    return reportData.filter(row => {
      // 1. Provider Filter
      if (provider !== 'all') {
        const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === provider);
        if (selectedProvObj) {
          const { firstName, lastName } = getProviderFirstAndLastName(selectedProvObj);
          const fullNameLower = `${firstName} ${lastName}`.toLowerCase().trim();
          const initialsLower = ((firstName ? firstName[0] : '') + (lastName ? lastName.substring(0, 2) : '')).toLowerCase();
          const abbrLower = (selectedProvObj.abbr || selectedProvObj.Abbr || '').toLowerCase();
          const rowProvLower = (row.provider || '').toLowerCase();

          const matches = rowProvLower.includes(fullNameLower) || 
                          fullNameLower.includes(rowProvLower) ||
                          (abbrLower && rowProvLower.includes(abbrLower)) ||
                          (initialsLower && rowProvLower.includes(initialsLower));
          if (!matches) return false;
        }
      }

      // 2. Adjustment Type filter
      if (adjustmentType !== 'all') {
        const rowTypeLower = (row.type || row.notes || 'Adjustment').toLowerCase();
        const selectedTypeLower = adjustmentType.toLowerCase();
        if (!rowTypeLower.includes(selectedTypeLower)) return false;
      }

      // 3. Search query
      if (codeText.trim()) {
        const queryLower = codeText.toLowerCase().trim();
        const patLower = (row.patient || '').toLowerCase();
        const notesLower = (row.notes || '').toLowerCase();
        const typeLower = (row.type || '').toLowerCase();
        const adaLower = (row.ada || '').toLowerCase();
        const transactionLower = (row.transaction || row.id || '').toLowerCase();

        const matches = patLower.includes(queryLower) ||
                        notesLower.includes(queryLower) ||
                        typeLower.includes(queryLower) ||
                        adaLower.includes(queryLower) ||
                        transactionLower.includes(queryLower);

        if (codeFilter === 'filter' && !matches) return false;
        if (codeFilter === 'exclude' && matches) return false;
      }

      // 4. Flag Filter
      if (flagFilter === 'with_flags') {
        if (!row.flags || row.flags.length === 0) return false;
      } else if (flagFilter === 'without_flags') {
        if (row.flags && row.flags.length > 0) return false;
      }

      return true;
    });
  }, [reportData, provider, adjustmentType, codeFilter, codeText, flagFilter, dropdownProviders]);

  // Sort
  const sortedReportData = useMemo(() => {
    return [...filteredReportData].sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === 'date_desc') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'amount_desc') {
        return Math.abs(b.amount || b.adj || 0) - Math.abs(a.amount || a.adj || 0);
      }
      if (sortBy === 'patient') {
        return (a.patient || '').localeCompare(b.patient || '');
      }
      return 0; // default
    });
  }, [filteredReportData, sortBy]);

  const groupedData = useMemo(() => {
    if (grouping === 'no-grouping') return null;

    const groups = {};
    sortedReportData.forEach(row => {
      let key = 'Unassigned';
      if (grouping === 'group-provider') {
        key = row.provider || 'Unassigned';
      } else if (grouping === 'group-adj') {
        key = row.type || row.notes || 'Adjustment';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return groups;
  }, [sortedReportData, grouping]);

  const getRowDisplayValues = (row) => {
    const amt = typeof row.amount !== 'undefined' ? row.amount : (row.adj ?? 0);
    const formattedAmt = amt < 0 ? `-$${Math.abs(amt).toFixed(2)}` : `$${amt.toFixed(2)}`;
    
    return {
      date: row.date || '',
      flags: row.flags || ['#f5a623'],
      patient: row.patient || 'Patient',
      transaction: row.transaction || row.id || '',
      ada: row.ada || 'D0000',
      site: row.site || '',
      description: row.notes || row.description || 'Adjustment',
      rendering: row.provider || row.rendering || 'Provider',
      billing: row.provider || row.billing || 'Office',
      adj: formattedAmt,
      type: row.type || row.notes || 'Office Adjustment',
      dob: row.dob || '05/10/1988'
    };
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Patient',
      'Transaction #',
      'ADA',
      'Site',
      'Description',
      'Rendering Provider',
      'Billing Provider',
      'Adj',
      'Adjustment Type'
    ];

    let rows = [];
    if (grouping !== 'no-grouping' && groupedData) {
      Object.entries(groupedData).forEach(([groupName, groupRows]) => {
        rows.push([`${grouping === 'group-provider' ? 'Provider' : 'Adjustment Type'}: ${groupName}`, ...Array(9).fill('')]);
        groupRows.forEach(row => {
          const display = getRowDisplayValues(row);
          rows.push([
            display.date,
            display.patient,
            display.transaction,
            display.ada,
            display.site,
            display.description,
            display.rendering,
            display.billing,
            display.adj,
            display.type
          ]);
        });
        const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
        rows.push(['Subtotal', ...Array(7).fill(''), `$${subtotal.toFixed(2)}`, '']);
        rows.push(Array(10).fill('')); // spacer
      });
    } else {
      sortedReportData.forEach(row => {
        const display = getRowDisplayValues(row);
        rows.push([
          display.date,
          display.patient,
          display.transaction,
          display.ada,
          display.site,
          display.description,
          display.rendering,
          display.billing,
          display.adj,
          display.type
        ]);
      });
    }

    const totalVal = sortedReportData.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
    rows.push(['Total', ...Array(7).fill(''), `$${totalVal.toFixed(2)}`, '']);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Adjustment_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('adjustment-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Adjustment Report Table Only</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Adjustment Report</h2>');
    printWindow.document.write(`<p>Date Range: ${dateRange} (${startDate} to ${endDate})</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportGroupCSV = (groupName, groupRows) => {
    const headers = [
      'Date',
      'Patient',
      'Transaction #',
      'ADA',
      'Site',
      'Description',
      'Rendering Provider',
      'Billing Provider',
      'Adj',
      'Adjustment Type'
    ];

    const rows = groupRows.map(row => {
      const display = getRowDisplayValues(row);
      return [
        display.date,
        display.patient,
        display.transaction,
        display.ada,
        display.site,
        display.description,
        display.rendering,
        display.billing,
        display.adj,
        display.type
      ];
    });

    const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
    rows.push(['Subtotal', ...Array(7).fill(''), `$${subtotal.toFixed(2)}`, '']);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Adjustment_Report_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Adjustment Report - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Adjustment Report - ' + groupName + '</h2>');
    printWindow.document.write(`<p>Date Range: ${dateRange} (${startDate} to ${endDate})</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Box sx={{ p: 0, position: 'relative' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
          <CircularProgress size={30} />
        </Box>
      )}

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
          <Grid item sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Start Date:
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
              />
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              End Date:
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
              />
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Provider:</Typography>
            <Select 
              size="small" 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)} 
              sx={{ minWidth: 140, fontSize: '0.75rem' }}
            >
              <MenuItem value="all">Provider: All</MenuItem>
              {dropdownProviders.map((p) => (
                <MenuItem key={p._id || p.id} value={p._id || p.id}>
                  {getProviderLabel(p)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Adjustment Type:</Typography>
            <Select 
              size="small" 
              value={adjustmentType} 
              onChange={(e) => setAdjustmentType(e.target.value)} 
              sx={{ minWidth: 160, fontSize: '0.75rem' }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {adjustmentTypes.map((t) => (
                <MenuItem key={t.id || t._id} value={t.name || t.itemName || t.type || t}>
                  {t.name || t.itemName || t.type || t}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row value={grouping} onChange={(e) => setGrouping(e.target.value)}>
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
              <FormControlLabel value="group-adj" control={<Radio size="small" />} label={<Typography variant="caption">Group By Adjustment</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item>
            <RadioGroup row value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)}>
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 0.5 }}>
              <TextField 
                size="small" 
                placeholder="Enter code, patient name, notes" 
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" checked={filterByProductionDate} onChange={(e) => setFilterByProductionDate(e.target.checked)} />} label={<Typography variant="caption">Filter by Production Date</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={showFlags} onChange={(e) => setShowFlags(e.target.checked)} />} label={<Typography variant="caption">Show Flags in Report</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={showDOB} onChange={(e) => setShowDOB(e.target.checked)} />} label={<Typography variant="caption">Show Date of Birth</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={showProviderColumn} onChange={(e) => setShowProviderColumn(e.target.checked)} />} label={<Typography variant="caption">Show Provider</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={filterByDOS} onChange={(e) => setFilterByDOS(e.target.checked)} />} label={<Typography variant="caption">Filter by DOS</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)} sx={{ minWidth: 180, fontSize: '0.75rem' }}>
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
              <MenuItem value="with_flags">Pts With Flags Only</MenuItem>
              <MenuItem value="without_flags">Pts Without Flags Only</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="date_asc">Date: Ascending</MenuItem>
                <MenuItem value="date_desc">Date: Descending</MenuItem>
                <MenuItem value="amount_desc">Amount: High to Low</MenuItem>
                <MenuItem value="patient">Patient Name</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchData} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" disabled sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      {grouping === 'no-grouping' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
        </Box>
      )}

      {/* Table Section */}
      {sortedReportData.length === 0 ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }} id="adjustment-report-table">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
                <TableCell>Date</TableCell>
                {showFlags && <TableCell>Flags</TableCell>}
                <TableCell>Patient</TableCell>
                <TableCell>Transaction #</TableCell>
                <TableCell>ADA</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Description</TableCell>
                {showProviderColumn && (
                  <>
                    <TableCell>Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                    <TableCell>Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                  </>
                )}
                <TableCell align="right">Adj</TableCell>
                <TableCell>Adjustment Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={showProviderColumn ? (showFlags ? 11 : 10) : (showFlags ? 9 : 8)} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
                  No records found matching current criteria.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : grouping !== 'no-grouping' && groupedData ? (
        <Box id="adjustment-report-table">
          {Object.entries(groupedData).map(([groupName, groupRows]) => {
            const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
            const subtotalFormatted = subtotal < 0 ? `-$${Math.abs(subtotal).toFixed(2)}` : `$${subtotal.toFixed(2)}`;

            let colSpanCount = 7;
            if (showFlags) colSpanCount += 1;
            if (showProviderColumn) colSpanCount += 2;
            const tableId = `adjustment-report-table-${groupName.replace(/\s+/g, '-')}`;

            return (
              <Box key={groupName} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {grouping === 'group-provider' ? 'Provider' : 'Adjustment Type'}: {groupName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleExportGroupCSV(groupName, groupRows)} 
                      startIcon={<FileDownloadIcon />} 
                      sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                    >
                      Export CSV
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handlePrintGroup(tableId, groupName)} 
                      startIcon={<PrintIcon />} 
                      sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                    >
                      Print
                    </Button>
                  </Box>
                </Box>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }} id={tableId}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
                        <TableCell>Date</TableCell>
                        {showFlags && <TableCell>Flags</TableCell>}
                        <TableCell>Patient</TableCell>
                        <TableCell>Transaction #</TableCell>
                        <TableCell>ADA</TableCell>
                        <TableCell>Site</TableCell>
                        <TableCell>Description</TableCell>
                        {showProviderColumn && (
                          <>
                            <TableCell>Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                            <TableCell>Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                          </>
                        )}
                        <TableCell align="right">Adj</TableCell>
                        <TableCell>Adjustment Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupRows.map((row, idx) => {
                        const display = getRowDisplayValues(row);
                        return (
                          <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                            <TableCell>{display.date}</TableCell>
                            {showFlags && (
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 0.2 }}>
                                  {display.flags.map((color, i) => (
                                    <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                                  ))}
                                </Box>
                              </TableCell>
                            )}
                            <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                              {display.patient}
                              {showDOB && (
                                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 400 }}>
                                  DOB: {display.dob}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{display.transaction}</TableCell>
                            <TableCell>{display.ada}</TableCell>
                            <TableCell>{display.site}</TableCell>
                            <TableCell>{display.description}</TableCell>
                            {showProviderColumn && (
                              <>
                                <TableCell>{display.rendering}</TableCell>
                                <TableCell>{display.billing}</TableCell>
                              </>
                            )}
                            <TableCell align="right" sx={{ fontWeight: 600 }}>{display.adj}</TableCell>
                            <TableCell>{display.type}</TableCell>
                          </TableRow>
                        );
                      })}
                      {/* Subtotal Row */}
                      <TableRow sx={{ backgroundColor: '#fcfcfc', '& td': { fontWeight: 600, fontSize: '0.75rem', py: 0.75 } }}>
                        <TableCell colSpan={colSpanCount - 1} align="right">Subtotal ({groupName}):</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{subtotalFormatted}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }} id="adjustment-report-table">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
                <TableCell>Date</TableCell>
                {showFlags && <TableCell>Flags</TableCell>}
                <TableCell>Patient</TableCell>
                <TableCell>Transaction #</TableCell>
                <TableCell>ADA</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Description</TableCell>
                {showProviderColumn && (
                  <>
                    <TableCell>Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                    <TableCell>Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
                  </>
                )}
                <TableCell align="right">Adj</TableCell>
                <TableCell>Adjustment Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReportData.map((row, idx) => {
                const display = getRowDisplayValues(row);
                return (
                  <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                    <TableCell>{display.date}</TableCell>
                    {showFlags && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.2 }}>
                          {display.flags.map((color, i) => (
                            <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                          ))}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {display.patient}
                      {showDOB && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 400 }}>
                          DOB: {display.dob}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{display.transaction}</TableCell>
                    <TableCell>{display.ada}</TableCell>
                    <TableCell>{display.site}</TableCell>
                    <TableCell>{display.description}</TableCell>
                    {showProviderColumn && (
                      <>
                        <TableCell>{display.rendering}</TableCell>
                        <TableCell>{display.billing}</TableCell>
                      </>
                    )}
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{display.adj}</TableCell>
                    <TableCell>{display.type}</TableCell>
                  </TableRow>
                );
              })}

              {/* Grand Total Row */}
              {sortedReportData.length > 0 && (() => {
                const grandTotal = sortedReportData.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
                const grandTotalFormatted = grandTotal < 0 ? `-$${Math.abs(grandTotal).toFixed(2)}` : `$${grandTotal.toFixed(2)}`;
                
                let colSpanCount = 7;
                if (showFlags) colSpanCount += 1;
                if (showProviderColumn) colSpanCount += 2;

                return (
                  <TableRow sx={{ backgroundColor: '#f5f5f5', '& td': { fontWeight: 700, fontSize: '0.75rem', py: 1 } }}>
                    <TableCell colSpan={colSpanCount - 1} align="right">Total Outstanding Adjustment Amount:</TableCell>
                    <TableCell align="right">{grandTotalFormatted}</TableCell>
                    <TableCell />
                  </TableRow>
                );
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdjustmentReport;
