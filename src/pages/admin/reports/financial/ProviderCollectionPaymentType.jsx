import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';

const ProviderCollectionPerPaymentType = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [provider, setProvider] = useState('all');
  const [showFlags, setShowFlags] = useState(true);
  const [flagFilter, setFlagFilter] = useState('pts');
  const [sortBy, setSortBy] = useState('default');

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
      const res = await reportingService.getFinancialReport('provider-collection-payment-type', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch provider collection per payment type report:', err);
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
    // 1. Provider Filter
    if (provider !== 'all') {
      const renderLower = (row.render || '').toLowerCase();
      const billLower = (row.bill || '').toLowerCase();
      const abbrLower = selectedProvAbbr.toLowerCase();
      const initialsLower = selectedProvInitials.toLowerCase();
      
      const match = (abbrLower && (renderLower === abbrLower || billLower === abbrLower)) ||
                    (initialsLower && (renderLower === initialsLower || billLower === initialsLower));
      if (!match) return false;
    }

    // 2. Flag Filter
    if (flagFilter === 'with_flags') {
      if (!row.flags || row.flags.length === 0) return false;
    } else if (flagFilter === 'without_flags') {
      if (row.flags && row.flags.length > 0) return false;
    }

    return true;
  });

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
      const aAmt = a.ins + a.pt;
      const bAmt = b.ins + b.pt;
      return bAmt - aAmt;
    }
    return 0;
  });

  const totalIns = filteredReportData.reduce((sum, row) => sum + (row.ins || 0), 0);
  const totalPt = filteredReportData.reduce((sum, row) => sum + (row.pt || 0), 0);
  const totalActualWriteOff = filteredReportData.reduce((sum, row) => sum + (row.actual || 0), 0);
  const totalCollAdj = filteredReportData.reduce((sum, row) => sum + (row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0), 0);
  const totalAdj = filteredReportData.reduce((sum, row) => sum + (row.paymentType === 'Adjustment' ? (row.adj || 0) : 0), 0);
  const totalPtRef = filteredReportData.reduce((sum, row) => sum + (row.ptRef || 0), 0);
  const totalInsRef = filteredReportData.reduce((sum, row) => sum + (row.insRef || 0), 0);
  const totalPayFrom = filteredReportData.reduce((sum, row) => sum + (row.payFrom || 0), 0);
  const totalRefundTo = filteredReportData.reduce((sum, row) => sum + (row.newCredit || 0), 0);

  const summaryStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: `$${(totalIns + totalPt + totalPayFrom).toFixed(2)}` },
    { label: 'Total Collection Excl. Pay From Credit:', value: `$${(totalIns + totalPt).toFixed(2)}` },
    { label: 'Total Prepayments:', value: `$${totalPayFrom.toFixed(2)}` },
    { label: 'Actual Write-off:', value: `$${totalActualWriteOff.toFixed(2)}` },
    { label: 'Total Collection Adjustments:', value: `$${totalCollAdj.toFixed(2)}` },
    { label: 'Total Production Adjustments:', value: `$${totalAdj.toFixed(2)}` },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Provider Collection Per Payment Type:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
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
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel 
              control={<Checkbox size="small" checked={showFlags} onChange={(e) => setShowFlags(e.target.checked)} />} 
              label={<Typography variant="caption">Show Flags in Report</Typography>} 
            />
            <Select 
              size="small" 
              value={flagFilter} 
              onChange={(e) => setFlagFilter(e.target.value)} 
              sx={{ minWidth: 180, fontSize: '0.75rem' }}
            >
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
              <MenuItem value="with_flags">Pts With Flags Only</MenuItem>
              <MenuItem value="without_flags">Pts Without Flags Only</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select 
                size="small" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                sx={{ minWidth: 120, fontSize: '0.75rem' }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="date_asc">Date: Ascending</MenuItem>
                <MenuItem value="date_desc">Date: Descending</MenuItem>
                <MenuItem value="patient">Patient Name</MenuItem>
                <MenuItem value="amount_desc">Amount: High to Low</MenuItem>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', position: 'relative' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Collection</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Adjustment</TableCell>
              <TableCell align="right">Pt. Refund</TableCell>
              <TableCell align="right">Ins. Refund</TableCell>
              <TableCell align="right">Pay From Credit</TableCell>
              <TableCell align="right">New Credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700 } }}>
              <TableCell colSpan={5}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Insurance Payment</TableCell>
              <TableCell align="right">Patient Payment</TableCell>
              <TableCell align="right">Actual Write-off</TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedReportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
                  No records found matching current criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedReportData.map((row, idx) => (
                <TableRow key={idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5 } }}>
                  <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {showFlags && row.flags && row.flags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        {row.flags.map((color, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient || 'Patient'}</TableCell>
                  <TableCell>{row.code || '-'}</TableCell>
                  <TableCell>{row.procedure || '-'}</TableCell>
                  <TableCell align="center">{row.render || '-'}</TableCell>
                  <TableCell align="center">{row.bill || '-'}</TableCell>
                  <TableCell align="right">${(row.ins || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.pt || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.actual || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.ptRef || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.insRef || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.payFrom || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.newCredit || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            <TableRow sx={{ fontWeight: 700, backgroundColor: '#fafafa', '& td': { fontWeight: 700, fontSize: '0.7rem' } }}>
              <TableCell colSpan={7} align="right">Total:</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>${totalIns.toFixed(2)}</TableCell>
              <TableCell align="right">${totalPt.toFixed(2)}</TableCell>
              <TableCell align="right">${totalActualWriteOff.toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>${totalCollAdj.toFixed(2)}</TableCell>
              <TableCell align="right">${totalPtRef.toFixed(2)}</TableCell>
              <TableCell align="right">${totalInsRef.toFixed(2)}</TableCell>
              <TableCell align="right">${totalPayFrom.toFixed(2)}</TableCell>
              <TableCell align="right">${totalRefundTo.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Summary Section */}
      <Box sx={{ mt: 3, ml: 4 }}>
        {summaryStats.map((stat, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 240, color: 'primary.main' }}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProviderCollectionPerPaymentType;
