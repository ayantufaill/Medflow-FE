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
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';

const ProductionCollectionSummary = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [provider, setProvider] = useState('all');
  const [grouping, setGrouping] = useState('no-grouping');
  const [showSummaryPerDay, setShowSummaryPerDay] = useState(false);

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
      const res = await reportingService.getFinancialReport('provider-collection-payment-type', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch summary report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
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

  const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === provider);
  const selectedProvAbbr = selectedProvObj ? (selectedProvObj.abbr || selectedProvObj.Abbr || '').trim() : '';
  const selectedProvInitials = selectedProvObj ? (() => {
    const { firstName, lastName } = getProviderFirstAndLastName(selectedProvObj);
    const f = firstName.trim();
    const l = lastName.trim();
    if (f && l) {
      return (f[0] + l.substring(0, 2)).toUpperCase();
    }
    return (f ? f.substring(0, 3) : '').toUpperCase();
  })() : '';

  const filteredReportData = reportData.filter(row => {
    if (provider !== 'all') {
      const renderLower = (row.render || '').toLowerCase();
      const billLower = (row.bill || '').toLowerCase();
      const abbrLower = selectedProvAbbr.toLowerCase();
      const initialsLower = selectedProvInitials.toLowerCase();
      
      const match = (abbrLower && (renderLower === abbrLower || billLower === abbrLower)) ||
                    (initialsLower && (renderLower === initialsLower || billLower === initialsLower));
      if (!match) return false;
    }
    return true;
  });

  const getProviderForRow = (row) => {
    const renderVal = (row.render || '').trim().toLowerCase();
    const billVal = (row.bill || '').trim().toLowerCase();
    if (!renderVal && !billVal) return 'Unassigned';

    const found = dropdownProviders.find(p => {
      const abbr = (p.abbr || p.Abbr || '').trim().toLowerCase();
      const { firstName, lastName } = getProviderFirstAndLastName(p);
      const f = firstName.trim();
      const l = lastName.trim();
      let initials = '';
      if (f && l) {
        initials = (f[0] + l.substring(0, 2)).toLowerCase();
      } else {
        initials = (f ? f.substring(0, 3) : '').toLowerCase();
      }

      return (abbr && (renderVal === abbr || billVal === abbr)) ||
             (initials && (renderVal === initials || billVal === initials));
    });

    if (found) {
      return getProviderLabel(found);
    }
    return row.render || row.bill || 'Unassigned';
  };

  const calculateStats = (rows) => {
    const charge = rows.reduce((sum, row) => sum + (row.production || row.charge || (row.ins + (row.pt || row.collection || 0) + (row.actual || 0)) || 0), 0);
    const adj = rows.reduce((sum, row) => sum + (row.paymentType === 'Adjustment' ? (row.adj || 0) : 0), 0);
    const writeOff = rows.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
    const ins = rows.reduce((sum, row) => sum + (row.ins || 0), 0);
    const pt = rows.reduce((sum, row) => sum + (row.pt || row.collection || 0), 0);
    const actualWriteOff = rows.reduce((sum, row) => sum + (row.actual || 0), 0);
    const collAdj = rows.reduce((sum, row) => sum + (row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0), 0);
    const ptRef = rows.reduce((sum, row) => sum + (row.ptRef || 0), 0);
    const insRef = rows.reduce((sum, row) => sum + (row.insRef || 0), 0);
    const payFrom = rows.reduce((sum, row) => sum + (row.payFrom || 0), 0);
    const refundTo = rows.reduce((sum, row) => sum + (row.newCredit || 0), 0);
    const overpayment = rows.reduce((sum, row) => sum + (row.overpayment || 0), 0);

    const uniquePatients = new Set(rows.map(r => r.patient).filter(Boolean)).size;
    const netProduction = charge + adj - writeOff;
    const avgProdPerPat = uniquePatients > 0 ? netProduction / uniquePatients : 0;
    const collectionPercent = netProduction !== 0 ? ((ins + pt + collAdj) / netProduction) * 100 : 0;

    const prodStats = [
      { label: 'Gross Production:', value: `$${charge.toFixed(2)}` },
      { label: 'Net est. Production:', value: `Total Charge + Adj(+/-) - Est Write Off = $${netProduction.toFixed(2)}`, isFormula: true },
      { label: 'Number of Seen Patients:', value: String(uniquePatients) },
      { label: 'Average Production Per Patient:', value: `$${avgProdPerPat.toFixed(2)}` },
    ];

    const collStats = [
      { label: 'Total Collection Incl. Pay From Credit:', value: `$${(ins + pt + payFrom).toFixed(2)}` },
      { label: 'Total Collection Excl. Pay From Credit:', value: `$${(ins + pt).toFixed(2)}` },
      { label: 'Collection From Credit:', value: `$${payFrom.toFixed(2)}` },
      { label: 'Total Prepayments:', value: `$${payFrom.toFixed(2)}` },
      { label: 'Total Prepayments Excluding Refunds:', value: `$${(payFrom - refundTo).toFixed(2)}` },
      { label: 'Actual Write-Off:', value: `$${actualWriteOff.toFixed(2)}` },
      { label: 'Total Collection Adjustments:', value: `$${collAdj.toFixed(2)}` },
      { label: 'Total Production Adjustments:', value: `$${adj.toFixed(2)}` },
      { label: 'Adjusted Collection Incl. Pay From Credit:', value: `$${(ins + pt + payFrom + collAdj).toFixed(2)}` },
      { label: 'Adjusted Collection Excl. Pay From Credit:', value: `$${(ins + pt + collAdj).toFixed(2)}` },
      { label: 'Total Patient Refund:', value: `$${ptRef.toFixed(2)}` },
      { label: 'Total Insurance Refund:', value: `$${insRef.toFixed(2)}` },
      { label: 'Total Overpayment to Credit:', value: `$${overpayment.toFixed(2)}` },
      { label: 'Total Deposit Slip:', value: `$${(ins + pt - ptRef - insRef).toFixed(2)}` },
      { label: 'Total Adjustments:', value: `$${(adj + collAdj).toFixed(2)}` },
    ];

    return {
      prodStats,
      collStats,
      percent: collectionPercent,
    };
  };

  const globalStats = calculateStats(filteredReportData);

  const providerGroups = {};
  if (grouping === 'group-provider') {
    filteredReportData.forEach(row => {
      const provName = getProviderForRow(row);
      if (!providerGroups[provName]) {
        providerGroups[provName] = [];
      }
      providerGroups[provName].push(row);
    });
  }

  const handleExportCSV = () => {
    const headers = ['Statistic / Metric', 'Value'];
    let rows = [];

    if (grouping === 'group-provider') {
      Object.entries(providerGroups).forEach(([provName, groupRows]) => {
        const stats = calculateStats(groupRows);
        rows.push([`Provider: ${provName}`, '']);
        rows.push(...stats.prodStats.map(s => [s.label, s.value]));
        rows.push(...stats.collStats.map(s => [s.label, s.value]));
        rows.push(['Collection Percentage', `${stats.percent.toFixed(1)}%`]);
        rows.push(['', '']); // spacer
      });
      rows.push(['Grand Total', '']);
    }

    rows.push(...globalStats.prodStats.map(s => [s.label, s.value]));
    rows.push(...globalStats.collStats.map(s => [s.label, s.value]));
    rows.push(['Collection Percentage', `${globalStats.percent.toFixed(1)}%`]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production & Collection Summary</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; font-size: 11px; padding: 20px; }');
    printWindow.document.write('.provider-section { margin-bottom: 30px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }');
    printWindow.document.write('.section-title { font-size: 14px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }');
    printWindow.document.write('.stats-container { display: flex; flex-direction: row; gap: 40px; }');
    printWindow.document.write('.stats-column { flex: 1; }');
    printWindow.document.write('.stat-row { display: flex; margin-bottom: 4px; }');
    printWindow.document.write('.stat-label { font-weight: 500; min-width: 240px; color: #333; }');
    printWindow.document.write('.stat-value { font-weight: bold; color: #000; }');
    printWindow.document.write('.formula-label { color: #1976d2; }');
    printWindow.document.write('.percent-container { margin-top: 15px; text-align: center; font-size: 12px; font-weight: bold; color: #1976d2; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Summary Report</h2>');
    printWindow.document.write(`<p>Date Range: ${dateRange} (${startDate} to ${endDate})</p>`);

    const renderPrintSection = (prodStats, collStats, percent, heading = '') => {
      let html = '<div class="provider-section">';
      if (heading) {
        html += `<div class="section-title">${heading}</div>`;
      }
      html += '<div class="stats-container">';
      
      // Production Column
      html += '<div class="stats-column">';
      prodStats.forEach(s => {
        const labelClass = s.isFormula ? 'stat-label formula-label' : 'stat-label';
        html += `<div class="stat-row"><span class="${labelClass}">${s.label}</span><span class="stat-value">${s.value}</span></div>`;
      });
      html += '</div>';

      // Collection Column
      html += '<div class="stats-column">';
      collStats.forEach(s => {
        html += `<div class="stat-row"><span class="stat-label formula-label">${s.label}</span><span class="stat-value" style="margin-left:10px;">${s.value}</span></div>`;
      });
      html += '</div>';
      
      html += '</div>';
      html += `<div class="percent-container">Collection Percentage: ${percent.toFixed(1)}%</div>`;
      html += '</div>';
      return html;
    };

    if (grouping === 'group-provider') {
      Object.entries(providerGroups).forEach(([provName, groupRows]) => {
        const stats = calculateStats(groupRows);
        printWindow.document.write(renderPrintSection(stats.prodStats, stats.collStats, stats.percent, `Provider: ${provName}`));
      });
      printWindow.document.write('<h3>Grand Total</h3>');
    }

    printWindow.document.write(renderPrintSection(globalStats.prodStats, globalStats.collStats, globalStats.percent));

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportGroupCSV = (groupName, groupRows) => {
    const headers = ['Statistic / Metric', 'Value'];
    const stats = calculateStats(groupRows);
    const rows = [];
    rows.push([`Provider: ${groupName}`, '']);
    rows.push(...stats.prodStats.map(s => [s.label, s.value]));
    rows.push(...stats.collStats.map(s => [s.label, s.value]));
    rows.push(['Collection Percentage', `${stats.percent.toFixed(1)}%`]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Summary_Report_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGroup = (groupName, groupRows) => {
    const stats = calculateStats(groupRows);
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production & Collection Summary - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; font-size: 11px; padding: 20px; }');
    printWindow.document.write('.provider-section { margin-bottom: 30px; padding-bottom: 15px; }');
    printWindow.document.write('.section-title { font-size: 14px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }');
    printWindow.document.write('.stats-container { display: flex; flex-direction: row; gap: 40px; }');
    printWindow.document.write('.stats-column { flex: 1; }');
    printWindow.document.write('.stat-row { display: flex; margin-bottom: 4px; }');
    printWindow.document.write('.stat-label { font-weight: 500; min-width: 240px; color: #333; }');
    printWindow.document.write('.stat-value { font-weight: bold; color: #000; }');
    printWindow.document.write('.formula-label { color: #1976d2; }');
    printWindow.document.write('.percent-container { margin-top: 15px; text-align: center; font-size: 12px; font-weight: bold; color: #1976d2; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Summary Report - ' + groupName + '</h2>');
    printWindow.document.write(`<p>Date Range: ${dateRange} (${startDate} to ${endDate})</p>`);

    let html = '<div class="provider-section">';
    html += '<div class="stats-container">';
    
    // Production Column
    html += '<div class="stats-column">';
    stats.prodStats.forEach(s => {
      const labelClass = s.isFormula ? 'stat-label formula-label' : 'stat-label';
      html += `<div class="stat-row"><span class="${labelClass}">${s.label}</span><span class="stat-value">${s.value}</span></div>`;
    });
    html += '</div>';

    // Collection Column
    html += '<div class="stats-column">';
    stats.collStats.forEach(s => {
      html += `<div class="stat-row"><span class="stat-label formula-label">${s.label}</span><span class="stat-value" style="margin-left:10px;">${s.value}</span></div>`;
    });
    html += '</div>';
    
    html += '</div>';
    html += `<div class="percent-container">Collection Percentage: ${stats.percent.toFixed(1)}%</div>`;
    html += '</div>';

    printWindow.document.write(html);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const renderStatsGrid = (prodStats, collStats, percent, heading = '') => (
    <Box sx={{ mb: heading ? 6 : 0, p: heading ? 2 : 0, border: heading ? '1px dashed #ccc' : 'none', borderRadius: heading ? 1 : 0 }}>
      {heading && (
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          {heading}
        </Typography>
      )}
      <Grid container spacing={8} sx={{ px: heading ? 0 : 4 }}>
        <Grid item xs={12} md={5}>
          {prodStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 180, color: stat.isFormula ? 'primary.main' : 'inherit' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.isFormula || stat.value !== '$0.00' ? 700 : 400 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={7}>
          {collStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 260, color: 'primary.main' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.value !== '$0.00' ? 700 : 400, ml: 2 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>Collection Percentage:</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          (Total Collection + Collection Adjustment) / Net est. Production * 100 = {percent.toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 0, position: 'relative' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production & Collection Summary Report:
      </Typography>

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
                onChange={(e) => setDateRange('range') || setEndDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
              />
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
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
          <Grid item sx={{ ml: 2 }}>
            <RadioGroup row value={grouping} onChange={(e) => setGrouping(e.target.value)}>
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <FormControlLabel 
            control={<Checkbox size="small" checked={showSummaryPerDay} onChange={(e) => setShowSummaryPerDay(e.target.checked)} />} 
            label={<Typography variant="caption">Show Summary Per Day</Typography>} 
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" onClick={fetchData} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" disabled sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      {grouping === 'no-grouping' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
          <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#ef4444' }}>Print</Button>
        </Box>
      )}

      {/* Stats Section */}
      {grouping === 'group-provider' ? (
        <Box>
          {Object.entries(providerGroups).map(([provName, groupRows]) => {
            const groupStats = calculateStats(groupRows);
            return (
              <Box key={provName} sx={{ mb: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Provider: {provName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleExportGroupCSV(provName, groupRows)} 
                      startIcon={<FileDownloadIcon />} 
                      sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                    >
                      Export CSV
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handlePrintGroup(provName, groupRows)} 
                      startIcon={<PrintIcon />} 
                      sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                    >
                      Print
                    </Button>
                  </Box>
                </Box>
                {renderStatsGrid(groupStats.prodStats, groupStats.collStats, groupStats.percent)}
              </Box>
            );
          })}
          <Box sx={{ mt: 6, borderTop: '2px double #1976d2', pt: 4 }}>
            {renderStatsGrid(globalStats.prodStats, globalStats.collStats, globalStats.percent, 'Grand Total')}
          </Box>
        </Box>
      ) : (
        renderStatsGrid(globalStats.prodStats, globalStats.collStats, globalStats.percent)
      )}
    </Box>
  );
};

export default ProductionCollectionSummary;
