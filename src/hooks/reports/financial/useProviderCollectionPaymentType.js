import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useProviderCollectionPaymentType = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    dateRange: 'daily',
    startDate: initialStartDate,
    endDate: initialEndDate,
    provider: 'all',
    showFlags: true,
    flagFilter: 'pts',
    sortBy: 'default'
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastFetchedRef = useRef(null);

  const fetchData = async (overrideFilters = null) => {
    const active = overrideFilters || filters;
    const activeDateRange = active.dateRange;
    const activeStartDate = active.startDate;
    const activeEndDate = active.endDate;

    const paramsKey = `${activeDateRange}_${activeStartDate}_${activeEndDate}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = activeDateRange.charAt(0).toUpperCase() + activeDateRange.slice(1);
      const res = await reportingService.getFinancialReport('provider-collection-payment-type', {
        date: activeStartDate,
        range: rangeParam,
        startDate: activeStartDate,
        endDate: activeEndDate,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateRange, filters.startDate, filters.endDate]);

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

  const filteredReportData = reportData.filter(row => {
    if (filters.provider !== 'all' && row.providerId !== filters.provider) return false;

    if (filters.flagFilter === 'with_flags') {
      if (!row.flags || row.flags.length === 0) return false;
    } else if (filters.flagFilter === 'without_flags') {
      if (row.flags && row.flags.length > 0) return false;
    }

    return true;
  });

  const handleApply = (newFilters) => {
    if (newFilters) {
      setFilters(newFilters);
      // Only re-fetch if dates changed
      const dateChanged =
        newFilters.dateRange !== filters.dateRange ||
        newFilters.startDate !== filters.startDate ||
        newFilters.endDate !== filters.endDate;
      if (dateChanged) {
        lastFetchedRef.current = null;
        fetchData(newFilters);
      }
    }
  };

  const handleClear = () => {
    const defaultFilters = {
      dateRange: 'daily',
      startDate: initialStartDate,
      endDate: initialEndDate,
      provider: 'all',
      showFlags: true,
      flagFilter: 'pts',
      sortBy: 'default'
    };
    setFilters(defaultFilters);
    lastFetchedRef.current = null;
    fetchData(defaultFilters);
  };

  const sortedReportData = [...filteredReportData].sort((a, b) => {
    if (filters.sortBy === 'date_asc') {
      return new Date(a.date || 0) - new Date(b.date || 0);
    }
    if (filters.sortBy === 'date_desc') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    }
    if (filters.sortBy === 'patient') {
      return (a.patient || '').localeCompare(b.patient || '');
    }
    if (filters.sortBy === 'amount_desc') {
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
      filters.showFlags ? 'Flags' : null,
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
        filters.showFlags ? (row.flags ? row.flags.length : 0) : null,
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

    const htmlContent = `
      <html>
        <head>
          <title>Provider Collection Per Payment Type</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; }
            table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .hide-on-print, .no-print, svg { display: none !important; }
            h6, h5 { font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0;">Provider Collection Per Payment Type</h2>
          ${tableEl.outerHTML}
          ${footerEl ? `<div style="font-family: sans-serif; font-size: 12px; margin-top: 20px;">${footerEl.innerHTML}</div>` : ''}
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = htmlContent;

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };

    document.body.appendChild(iframe);
  };

  return {
    filters,
    loading,
    dropdownProviders,
    sortedReportData,
    summaryStats,
    totals,
    getProviderLabel,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
