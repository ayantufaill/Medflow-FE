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

  const lastFetchedRef = React.useRef(null);

  const fetchData = async () => {
    const paramsKey = `${dateRange}_${startDate}_${endDate}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production-collection-summary', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch summary report:', err);
      lastFetchedRef.current = null; // Reset ref on error to allow retry
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
    // Provider Filter
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

  const totalCharge = filteredReportData.reduce((sum, row) => sum + (row.production || 0), 0);
  const totalAdj = filteredReportData.reduce((sum, row) => sum + (row.paymentType === 'Adjustment' ? (row.adj || 0) : 0), 0);
  const totalWriteOff = filteredReportData.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
  const totalIns = filteredReportData.reduce((sum, row) => sum + (row.ins || 0), 0);
  const totalPt = filteredReportData.reduce((sum, row) => sum + (row.collection || 0), 0);
  const totalActualWriteOff = filteredReportData.reduce((sum, row) => sum + (row.actual || 0), 0);
  const totalCollAdj = filteredReportData.reduce((sum, row) => sum + (row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0), 0);
  const totalPtRef = filteredReportData.reduce((sum, row) => sum + (row.ptRef || 0), 0);
  const totalInsRef = filteredReportData.reduce((sum, row) => sum + (row.insRef || 0), 0);
  const totalPayFrom = filteredReportData.reduce((sum, row) => sum + (row.payFrom || 0), 0);
  const totalRefundTo = filteredReportData.reduce((sum, row) => sum + (row.newCredit || 0), 0);
  const totalOverpayment = filteredReportData.reduce((sum, row) => sum + (row.overpayment || 0), 0);

  const uniquePatients = new Set(filteredReportData.map(r => r.patient).filter(Boolean)).size;
  const netProduction = totalCharge + totalAdj - totalWriteOff;
  const avgProdPerPat = uniquePatients > 0 ? netProduction / uniquePatients : 0;

  const collectionPercent = netProduction !== 0 ? ((totalIns + totalPt + totalCollAdj) / netProduction) * 100 : 0;

  const productionStats = [
    { label: 'Gross Production:', value: `$${totalCharge.toFixed(2)}` },
    { label: 'Net est. Production:', value: `Total Charge + Adj(+/-) - Est Write Off = $${netProduction.toFixed(2)}`, isFormula: true },
    { label: 'Number of Seen Patients:', value: String(uniquePatients) },
    { label: 'Average Production Per Patient:', value: `$${avgProdPerPat.toFixed(2)}` },
  ];

  const collectionStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: `$${(totalIns + totalPt + totalPayFrom).toFixed(2)}` },
    { label: 'Total Collection Excl. Pay From Credit:', value: `$${(totalIns + totalPt).toFixed(2)}` },
    { label: 'Collection From Credit:', value: `$${totalPayFrom.toFixed(2)}` },
    { label: 'Total Prepayments:', value: `$${totalPayFrom.toFixed(2)}` },
    { label: 'Total Prepayments Excluding Refunds:', value: `$${(totalPayFrom - totalRefundTo).toFixed(2)}` },
    { label: 'Actual Write-Off:', value: `$${totalActualWriteOff.toFixed(2)}` },
    { label: 'Total Collection Adjustments:', value: `$${totalCollAdj.toFixed(2)}` },
    { label: 'Total Production Adjustments:', value: `$${totalAdj.toFixed(2)}` },
    { label: 'Adjusted Collection Incl. Pay From Credit:', value: `$${(totalIns + totalPt + totalPayFrom + totalCollAdj).toFixed(2)}` },
    { label: 'Adjusted Collection Excl. Pay From Credit:', value: `$${(totalIns + totalPt + totalCollAdj).toFixed(2)}` },
    { label: 'Total Patient Refund:', value: `$${totalPtRef.toFixed(2)}` },
    { label: 'Total Insurance Refund:', value: `$${totalInsRef.toFixed(2)}` },
    { label: 'Total Overpayment to Credit:', value: `$${totalOverpayment.toFixed(2)}` },
    { label: 'Total Deposit Slip:', value: `$${(totalIns + totalPt - totalPtRef - totalInsRef).toFixed(2)}` },
    { label: 'Total Adjustments:', value: `$${(totalAdj + totalCollAdj).toFixed(2)}` },
  ];

  const handleExportCSV = () => {
    const headers = ['Statistic / Metric', 'Value'];
    const rows = [
      ...productionStats.map(s => [s.label, s.value]),
      ...collectionStats.map(s => [s.label, s.value]),
      ['Collection Percentage', `(Total Collection + Collection Adjustment) / Net est. Production * 100 = ${collectionPercent.toFixed(1)}%`]
    ];

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
    printWindow.document.write('.stats-container { display: flex; flex-direction: row; gap: 40px; }');
    printWindow.document.write('.stats-column { flex: 1; }');
    printWindow.document.write('.stat-row { display: flex; margin-bottom: 6px; }');
    printWindow.document.write('.stat-label { font-weight: 500; min-width: 260px; color: #1976d2; }');
    printWindow.document.write('.stat-value { font-weight: bold; }');
    printWindow.document.write('.footer-calc { margin-top: 40px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Summary Report</h2>');
    
    printWindow.document.write('<div class="stats-container">');
    
    // Column 1
    printWindow.document.write('<div class="stats-column">');
    productionStats.forEach(stat => {
      printWindow.document.write(`
        <div class="stat-row">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
        </div>
      `);
    });
    printWindow.document.write('</div>');
    
    // Column 2
    printWindow.document.write('<div class="stats-column">');
    collectionStats.forEach(stat => {
      printWindow.document.write(`
        <div class="stat-row">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
        </div>
      `);
    });
    printWindow.document.write('</div>');
    
    printWindow.document.write('</div>');
    
    // Footer Percentage
    printWindow.document.write(`
      <div class="footer-calc">
        Collection Percentage: (Total Collection + Collection Adjustment) / Net est. Production * 100 = ${collectionPercent.toFixed(1)}%
      </div>
    `);
    
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

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production & Collection Summary Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Date Range:</Typography>
            <Select 
              size="small" 
              value={dateRange} 
              onChange={handleFilterModeChange} 
              sx={{ minWidth: 100, fontSize: '0.75rem' }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="this_week">This Week</MenuItem>
              <MenuItem value="this_month">This Month</MenuItem>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#ef4444' }}>Print</Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={8} sx={{ px: 4 }}>
        <Grid item xs={12} md={5}>
          {productionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 180, color: stat.isFormula ? 'primary.main' : 'inherit' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.isFormula || stat.value !== '$0.00' ? 700 : 400 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={7}>
          {collectionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 260, color: 'primary.main' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.value !== '$0.00' ? 700 : 400, ml: 2 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>

      {/* Footer Calculation */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>Collection Percentage:</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          (Total Collection + Collection Adjustment) / Net est. Production * 100 = {collectionPercent.toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductionCollectionSummary;
