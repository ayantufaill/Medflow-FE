import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Radio, RadioGroup,
  FormControlLabel, Checkbox, Button, TextField, Tooltip, TableCell, TableRow
} from '@mui/material';
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

  const columns = [
    { label: 'Date' },
    { label: 'Flags' },
    { label: 'Patient' },
    { label: 'Transaction #' },
    { label: 'ADA' },
    { label: 'Site' },
    { label: 'Description' },
    { label: <React.Fragment key="rendering">Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment> },
    { label: <React.Fragment key="billing">Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment> },
    { label: 'Adj', align: 'right' },
    { label: 'Adjustment Type' },
  ];

  const renderRow = (row, idx) => (
    <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.2 }}>
          {row.flags.map((color, i) => (
            <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
          ))}
        </Box>
      </TableCell>
      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
      <TableCell>{row.transaction}</TableCell>
      <TableCell>{row.ada}</TableCell>
      <TableCell>{row.site}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.rendering}</TableCell>
      <TableCell>{row.billing}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>-${Math.abs(row.adj).toFixed(2)}</TableCell>
      <TableCell>{row.type}</TableCell>
    </TableRow>
  );

  const Title = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      Adjustment Report
      <Tooltip title="Adjustment Details">
        <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary', cursor: 'pointer' }} />
      </Tooltip>
    </Box>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="daily" 
        prefix="Date Range:" 
        defaultValue="daily"
        options={[{ value: 'daily', label: 'Daily' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600 }}>⬅ May 08, 2026 ⮕</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2026</Typography>
      </Box>

      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'Select Provider' }]}
      />
      
      <ReportSelect 
        label="all" 
        prefix="Adjustment Type:" 
        defaultValue="all"
        options={[{ value: 'all', label: 'All' }]}
      />

      <RadioGroup row defaultValue="no-grouping" sx={{ ml: 2 }}>
        <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>No Grouping</Typography>} />
        <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Provider</Typography>} />
        <FormControlLabel value="group-adj" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Adjustment</Typography>} />
      </RadioGroup>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
        <RadioGroup row defaultValue="filter">
          <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter Codes</Typography>} />
          <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Enter Codes to Exclude</Typography>} />
        </RadioGroup>
        <TextField 
          size="small" 
          variant="outlined"
          placeholder="Enter code or procedure" 
          sx={{ width: 220, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.75rem', backgroundColor: '#fff' } }} 
        />
      </Box>

      <ReportCheckbox label="Filter by Production Date" />
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      <ReportCheckbox label="Show Date of Birth" defaultChecked />
      <ReportCheckbox label="Show Provider" defaultChecked />
      <ReportCheckbox label="Filter by DOS" />

      <ReportSelect 
        label="pts" 
        defaultValue="pts"
        options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]}
        sx={{ ml: 2 }}
      />
      <ReportSelect 
        label="default" 
        prefix="Sort Report By:" 
        defaultValue="default"
        options={[{ value: 'default', label: 'Default' }]}
      />
    </>
  );

  return (
    <ReportLayout title={Title}>
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => console.log('Exporting CSV...')}
        onPrint={() => window.print()}
        customLeftActions={
          <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#3CA2E0', '&:hover': { backgroundColor: '#2d8ac1' }, ml: 2 }}>
            Create Template
          </Button>
        }
      />

      {/* Shared Data Table */}
      <ReportDataTable 
        columns={columns} 
        data={dummyData} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default AdjustmentReport;

