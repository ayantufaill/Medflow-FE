import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';

export const useProviderCollectionPaymentType = () => {
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

  const totals = {
    totalIns,
    totalPt,
    totalActualWriteOff,
    totalCollAdj,
    totalAdj,
    totalPtRef,
    totalInsRef,
    totalPayFrom,
    totalRefundTo
  };

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

  return {
    dateRange,
    startDate,
    endDate,
    provider,
    showFlags,
    flagFilter,
    sortBy,
    loading,
    dropdownProviders,
    sortedReportData,
    summaryStats,
    totals,
    getProviderLabel,
    handleFilterChange,
    handleFilterModeChange,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
