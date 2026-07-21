import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

// Services & Store
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';

// UI Components
import { 
  ReportLayout, 
  ReportFilterBar, 
  ReportSelect, 
  ReportCheckbox,
  ReportDivider
} from '../../../../components/reports/ui'; 
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const ProviderCollectionPerPaymentType = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [provider, setProvider] = useState('all');
  const [showFlags, setShowFlags] = useState(true);
  const [flagFilter, setFlagFilter] = useState('pts');
  const [sortBy, setSortBy] = useState('default');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLocalDateString = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'showFlags':
        setShowFlags(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'endDate':
        setEndDate(value);
        break;
      case 'provider':
        setProvider(value);
        break;
      case 'flagFilter':
        setFlagFilter(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      default:
        break;
    }
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    
    if (newMode === 'range') return;

    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (newMode) {
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today);
        start.setDate(diff);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month':
      case 'month_to_date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = newMode === 'this_month' ? new Date(today.getFullYear(), today.getMonth() + 1, 0) : new Date(today);
        break;
      }
      case 'last_7_days': {
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diffToLastWeekStart = today.getDate() - day - 7 + (day === 0 ? -6 : 1);
        start = new Date(today);
        start.setDate(diffToLastWeekStart);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start = new Date(today);
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        break;
      }
      case 'last_12_months': {
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
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
        break;
    }
    
    setStartDate(getLocalDateString(start));
    setEndDate(getLocalDateString(end));
  };

  const lastFetchedRef = useRef(null);

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
    if (provider !== 'all') {
      const renderLower = (row.render || '').toLowerCase();
      const billLower = (row.bill || '').toLowerCase();
      const abbrLower = selectedProvAbbr.toLowerCase();
      const initialsLower = selectedProvInitials.toLowerCase();
      
      const match = (abbrLower && (renderLower === abbrLower || billLower === abbrLower)) ||
                    (initialsLower && (renderLower === initialsLower || billLower === initialsLower));
      if (!match) return false;
    }

    if (flagFilter === 'with_flags') {
      if (!row.flags || row.flags.length === 0) return false;
    } else if (flagFilter === 'without_flags') {
      if (row.flags && row.flags.length > 0) return false;
    }

    return true;
  });

  const handleApply = () => {
    lastFetchedRef.current = null;
    fetchData();
  };

  const handleClear = () => {
    setDateRange('daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setProvider('all');
    setShowFlags(true);
    setFlagFilter('pts');
    setSortBy('default');

    lastFetchedRef.current = null;
    fetchData();
  };

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
      const aAmt = (a.ins || 0) + (a.pt || 0);
      const bAmt = (b.ins || 0) + (b.pt || 0);
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

  const handleExportCSV = () => {
    const headers = [
      'Date',
      showFlags ? 'Flags' : null,
      'Patient',
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Insurance Payment',
      'Patient Payment',
      'Actual Write-off',
      'Adjustment',
      'Pt. Refund',
      'Ins. Refund',
      'Pay From Credit',
      'New Credit'
    ].filter(Boolean);

    const rows = sortedReportData.map(row => {
      const rowData = [
        row.date ? new Date(row.date).toLocaleDateString() : '',
        showFlags ? (row.flags ? row.flags.length : 0) : null,
        row.patient || '',
        row.code || '',
        row.procedure || '',
        row.render || '',
        row.bill || '',
        `$${(row.ins || 0).toFixed(2)}`,
        `$${(row.pt || 0).toFixed(2)}`,
        `$${(row.actual || 0).toFixed(2)}`,
        `$${(row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0).toFixed(2)}`,
        `$${(row.ptRef || 0).toFixed(2)}`,
        `$${(row.insRef || 0).toFixed(2)}`,
        `$${(row.payFrom || 0).toFixed(2)}`,
        `$${(row.newCredit || 0).toFixed(2)}`
      ].filter(val => val !== null);
      return rowData;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Provider_Collection_Per_Payment_Type_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('provider-collection-payment-table');
    const footerEl = document.getElementById('provider-collection-payment-footer');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Provider Collection Per Payment Type</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Provider Collection Per Payment Type</h2>');
    printWindow.document.write(tableEl.outerHTML);
    if (footerEl) {
      printWindow.document.write('<div style="font-family: sans-serif; font-size: 12px; margin-top: 20px;">' + footerEl.innerHTML + '</div>');
    }
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const topFilters = (
    <>
      <ReportSelect 
        label="DATE RANGE"
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'range', label: 'Range' },
          { value: 'this_week', label: 'This Week' },
          { value: 'this_month', label: 'This Month' },
          { value: 'last_7_days', label: 'Last 7 days' },
          { value: 'last_week', label: 'Last Week' },
          { value: 'last_4_weeks', label: 'Last 4 Weeks' },
          { value: 'last_month', label: 'Last Month' },
          { value: 'last_3_months', label: 'Last 3 Months' },
          { value: 'last_12_months', label: 'Last 12 Months' },
          { value: 'month_to_date', label: 'Month to date' },
          { value: 'quarter_to_date', label: 'Quarter to date' },
          { value: 'year_to_date', label: 'Year to date' },
          { value: 'last_year', label: 'Last Year' },
        ]}
        value={dateRange}
        onChange={handleFilterModeChange}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '160px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={dayjs(endDate)}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '160px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>

      <ReportDivider />

      <ReportSelect 
        label="FILTER REPORT BY PROVIDER" 
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          ...dropdownProviders.map((p) => ({
            value: p._id || p.id,
            label: getProviderLabel(p)
          }))
        ]}
      />
      <ReportSelect 
        label="FLAG FILTER" 
        value={flagFilter}
        onChange={(e) => setFlagFilter(e.target.value)}
        options={[
          { value: 'pts', label: 'Pts With Or Without Flags' },
          { value: 'with_flags', label: 'Pts With Flags Only' },
          { value: 'without_flags', label: 'Pts Without Flags Only' },
        ]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="SORT REPORT BY" 
        labelPosition='left'
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'date_asc', label: 'Date: Ascending' },
          { value: 'date_desc', label: 'Date: Descending' },
          { value: 'patient', label: 'Patient Name' },
          { value: 'amount_desc', label: 'Amount: High to Low' },
        ]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <ReportCheckbox 
          label="Show Flags in Report" 
          checked={showFlags} 
          onChange={(e) => handleFilterChange('showFlags', typeof e === 'boolean' ? e : e?.target?.checked)} 
        />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Provider Collection Per Payment Type:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={handleApply}
        onClearAll={handleClear}
        onCreateTemplate={() => {}}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Styled Card Wrapper matching AgingReportTable */}
      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
        <TableContainer 
          id="provider-collection-payment-table" 
          elevation={0} 
          sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
              <CircularProgress size={30} />
            </Box>
          )}
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell rowSpan={2}>Date</TableCell>
                <TableCell rowSpan={2}>Flags</TableCell>
                <TableCell rowSpan={2}>Patient</TableCell>
                <TableCell rowSpan={2}>Code</TableCell>
                <TableCell rowSpan={2}>Procedure</TableCell>
                <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e2e8f0' }}>Provider / Internal Code</TableCell>
                <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e2e8f0' }}>Collection</TableCell>
                <TableCell align="right" rowSpan={2} sx={{ borderLeft: '1px solid #e2e8f0' }}>Adjustment</TableCell>
                <TableCell align="right" rowSpan={2}>Pt. Refund</TableCell>
                <TableCell align="right" rowSpan={2}>Ins. Refund</TableCell>
                <TableCell align="right" rowSpan={2}>Pay From Credit</TableCell>
                <TableCell align="right" rowSpan={2}>New Credit</TableCell>
              </TableRow>
              <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell align="center" sx={{ borderLeft: '1px solid #e2e8f0' }}>Render</TableCell>
                <TableCell align="center">Bill</TableCell>
                <TableCell align="right" sx={{ borderLeft: '1px solid #e2e8f0' }}>Insurance Payment</TableCell>
                <TableCell align="right">Patient Payment</TableCell>
                <TableCell align="right">Actual Write-off</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReportData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No records found matching current criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedReportData.map((row, idx) => (
                  <TableRow 
                    key={idx} 
                    sx={{ 
                      '& td': { 
                        fontSize: '0.75rem', 
                        py: 1.5, 
                        verticalAlign: 'middle', 
                        borderBottom: '1px solid #e2e8f0', 
                        color: '#1e293b' 
                      } 
                    }}
                  >
                    <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {showFlags && row.flags && row.flags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {row.flags.map((color, i) => (
                            <Box key={i} sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color, flexShrink: 0 }} />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient || 'Patient'}</TableCell>
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
              <TableRow sx={{ '& td': { fontWeight: 700, fontSize: '0.75rem', color: '#1e293b', borderTop: '2px solid #e0e0e0', py: 1.5 } }}>
                <TableCell colSpan={7} align="right">Total:</TableCell>
                <TableCell align="right">${totalIns.toFixed(2)}</TableCell>
                <TableCell align="right">${totalPt.toFixed(2)}</TableCell>
                <TableCell align="right">${totalActualWriteOff.toFixed(2)}</TableCell>
                <TableCell align="right">${totalCollAdj.toFixed(2)}</TableCell>
                <TableCell align="right">${totalPtRef.toFixed(2)}</TableCell>
                <TableCell align="right">${totalInsRef.toFixed(2)}</TableCell>
                <TableCell align="right">${totalPayFrom.toFixed(2)}</TableCell>
                <TableCell align="right">${totalRefundTo.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer Summary Section */}
      <Box id="provider-collection-payment-footer" sx={{ mt: 3, ml: 4 }}>
        {summaryStats.map((stat, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 260, color: '#3b82f6' }}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>
    </ReportLayout>
  );
};

export default ProviderCollectionPerPaymentType;