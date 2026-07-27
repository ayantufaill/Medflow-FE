import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';

export const useProductionPerCode = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [provider, setProvider] = useState('all');
  const [referralProvider, setReferralProvider] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');
  const [showCollection, setShowCollection] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLocalDateString = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const handleFilterChange = (key, value) => {
    switch(key) {
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;
      case 'provider': setProvider(value); break;
      case 'referralProvider': setReferralProvider(value); break;
      case 'groupBy': setGroupBy(value); break;
      case 'codeFilter': setCodeFilter(value); break;
      case 'codeText': setCodeText(value); break;
      case 'showCollection': setShowCollection(value); break;
      default: break;
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
      const res = await reportingService.getFinancialReport('production-per-code', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch production per code report:', err);
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

  const handleApply = () => {
    lastFetchedRef.current = null;
    fetchData();
  };

  const handleClear = () => {
    setDateRange('daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setProvider('all');
    setReferralProvider('all');
    setGroupBy('none');
    setCodeFilter('filter');
    setCodeText('');
    setShowCollection(false);

    lastFetchedRef.current = null;
    fetchData();
  };

  const codes = codeText ? codeText.toLowerCase().split(/[,\s]+/).map(c => c.trim()).filter(Boolean) : [];

  const filteredReportData = reportData.filter(row => {
    if (codes.length > 0) {
      const rowCode = (row.code || '').toLowerCase();
      const matches = codes.some(c => rowCode.includes(c));
      if (codeFilter === 'filter' && !matches) return false;
      if (codeFilter === 'exclude' && matches) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Code', 'Procedure', 'Quantity', 'Total Production', 'Average Production', 'Percent Production'];
    const rows = filteredReportData.map(row => [
      row.code || '',
      row.procedure || '',
      row.quantity || 0,
      `$${(row.totalProduction || 0).toFixed(2)}`,
      `$${(row.avgProduction || 0).toFixed(2)}`,
      `${(row.percentProduction || 0).toFixed(2)}%`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Per_Code_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('production-per-code-table');
    const footerEl = document.getElementById('production-per-code-footer');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production Per Code</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Production Per Code</h2>');
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
    referralProvider,
    groupBy,
    codeFilter,
    codeText,
    showCollection,
    reportData: filteredReportData,
    loading,
    dropdownProviders,
    getProviderLabel,
    handleFilterChange,
    handleFilterModeChange,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
