import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useProductionCollection = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    provider: 'all',
    grouping: 'no-grouping',
    codeFilter: 'filter',
    codeText: '',
    showFlags: true,
    showDOB: true,
    showProvider: true,
    displayOnlyCollection: false,
    excludeProducts: false,
    filterByDOS: false,
    flagFilter: 'pts',
    sortBy: 'default'
  });

  const lastFetchedRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const fetchData = async () => {
    let fetchKey;
    try {
      fetchKey = JSON.stringify(filters);
    } catch (e) {
      console.warn('Failed to stringify filters (circular structure?), skipping dedupe:', e);
      fetchKey = Date.now().toString(); // Fallback so it doesn't break
    }
    if (lastFetchedRef.current === fetchKey) return;
    lastFetchedRef.current = fetchKey;

    try {
      setLoading(true);
      const rangeParam = filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production-collection', {
        ...filters,
        date: filters.startDate,
        range: rangeParam,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch production & collection report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === filters.provider);
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

  const codes = filters.codeText ? filters.codeText.toLowerCase().split(/[,\s]+/).map(c => c.trim()).filter(Boolean) : [];

  const filteredReportData = reportData.filter(row => {
    if (filters.provider !== 'all' && row.providerId !== filters.provider) return false;

    if (codes.length > 0) {
      const rowCode = (row.code || '').toLowerCase();
      const rowProc = (row.procedure || '').toLowerCase();
      const matches = codes.some(c => rowCode.includes(c) || rowProc.includes(c));

      if (filters.codeFilter === 'filter' && !matches) return false;
      if (filters.codeFilter === 'exclude' && matches) return false;
    }

    if (filters.flagFilter === 'with_flags') {
      if (!row.flags || row.flags.length === 0) return false;
    } else if (filters.flagFilter === 'without_flags') {
      if (row.flags && row.flags.length > 0) return false;
    }

    if (filters.displayOnlyCollection) {
      const collectionAmt = (row.ins || 0) + (row.pt || 0);
      if (collectionAmt <= 0) return false;
    }

    if (filters.excludeProducts) {
      const rowCode = (row.code || '').toUpperCase();
      if (!rowCode.startsWith('D')) return false;
    }

    // Fallback to post date if dos is null (e.g. standalone payment with no linked procedure)
    const targetDateStr = filters.filterByDOS ? (row.dos || row.date) : row.date;
    if (targetDateStr) {
      const targetDate = new Date(targetDateStr);
      targetDate.setHours(0, 0, 0, 0);
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      if (targetDate < start || targetDate > end) return false;
    }

    return true;
  });

  const transformedReportData = filteredReportData.map(row => {
    let normalizedAmount = 0;
    if (row.type === 'production' || row.paymentType === 'Production') {
      normalizedAmount = row.charge || 0;
    } else if (row.type === 'adjustment' || row.paymentType === 'Adjustment') {
      normalizedAmount = Math.abs(row.adj || 0) + Math.abs(row.actual || 0);
    } else if (row.type === 'ptPay' || row.type === 'insPay' || row.paymentType === 'Payment' || row.paymentType === 'Insurance') {
      normalizedAmount = Math.abs(row.ins || 0) + Math.abs(row.pt || 0) + Math.abs(row.ptRef || 0) + Math.abs(row.insRef || 0);
    } else {
      normalizedAmount = row.charge !== undefined ? row.charge : (
        Math.abs(row.ins || 0) + Math.abs(row.pt || 0) + Math.abs(row.actual || 0) +
        Math.abs(row.adj || 0) + Math.abs(row.ptRef || 0) + Math.abs(row.insRef || 0)
      );
    }

    return {
      ...row,
      displayDate: filters.filterByDOS ? (row.dos || row.date) : row.date,
      fee: normalizedAmount,
      adj: row.paymentType === 'Adjustment' ? (row.adj || 0) : 0,
      estWriteOff: row.estWriteOff || 0,
      insPay: row.ins || 0,
      ptPay: row.pt || 0,
      actualWriteOff: row.actual || 0,
      collectionAdj: row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0,
      ptRefund: row.ptRef || 0,
      insRefund: row.insRef || 0,
      payFromCredit: row.payFrom || 0,
      refundToCredit: row.newCredit || 0,
      credit: row.credit || 0,
      overpaymentToCredit: row.overpayment || 0,
    };
  });

  const sortedReportData = [...transformedReportData].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date_asc':
        return new Date(a.dateRaw || a.date || 0) - new Date(b.dateRaw || b.date || 0);
      case 'date_desc':
        return new Date(b.dateRaw || b.date || 0) - new Date(a.dateRaw || a.date || 0);
      case 'patient':
        return (a.patient || '').localeCompare(b.patient || '');
      case 'amount_desc':
        return (b.fee || 0) - (a.fee || 0);
      default:
        return 0;
    }
  });

  console.log("=== DEBUG SORTING ===");
  console.log("filters.sortBy:", filters.sortBy);
  console.log("First element after sort:", sortedReportData[0]);
  console.log("=====================");


  const handleExportCSV = () => {
    const headers = [
      filters.filterByDOS ? 'Date of Service' : 'Date',
      'Patient',
      filters.showDOB ? 'Date of Birth' : null,
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Procedure Charge',
      'Production Adj',
      'Estimate write off',
      'Insurance Payment',
      'Patient Payment',
      'Actual Write-off',
      'Collection Adj',
      'Pt. Refund',
      'Ins. Refund',
      'Pay From Credit',
      'Refund To Credit',
      'Credit (+/-)',
      'Overpayment To Credit'
    ].filter(Boolean);

    const rows = sortedReportData.map(row => {
      return [
        row.displayDate ? new Date(row.displayDate).toLocaleDateString() : '',
        row.patient || '',
        filters.showDOB ? row.dob || '' : null,
        row.code || '',
        row.procedure || '',
        row.render || '',
        row.bill || '',
        `$${(row.fee || 0).toFixed(2)}`,
        `$${(row.adj || 0).toFixed(2)}`,
        `$${(row.estWriteOff || 0).toFixed(2)}`,
        `$${(row.insPay || 0).toFixed(2)}`,
        `$${(row.ptPay || 0).toFixed(2)}`,
        `$${(row.actualWriteOff || 0).toFixed(2)}`,
        `$${(row.collectionAdj || 0).toFixed(2)}`,
        `$${(row.ptRefund || 0).toFixed(2)}`,
        `$${(row.insRefund || 0).toFixed(2)}`,
        `$${(row.payFromCredit || 0).toFixed(2)}`,
        `$${(row.refundToCredit || 0).toFixed(2)}`,
        `$${(row.credit || 0).toFixed(2)}`,
        `$${(row.overpaymentToCredit || 0).toFixed(2)}`
      ].filter(val => val !== null);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('production-report-table');
    const footerEl = document.getElementById('production-report-footer');
    if (!tableEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>Production & Collection Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0;">Production & Collection Report</h2>
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

  const handleExportGroupCSV = (groupName, groupRows) => {
    const headers = [
      filters.filterByDOS ? 'Date of Service' : 'Date',
      'Patient',
      filters.showDOB ? 'Date of Birth' : null,
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Procedure Charge',
      'Production Adj',
      'Estimate write off',
      'Insurance Payment',
      'Patient Payment',
      'Actual Write-off',
      'Collection Adj',
      'Pt. Refund',
      'Ins. Refund',
      'Pay From Credit',
      'Refund To Credit',
      'Credit (+/-)',
      'Overpayment To Credit'
    ].filter(Boolean);

    const rows = groupRows.map(row => {
      return [
        row.displayDate ? new Date(row.displayDate).toLocaleDateString() : '',
        row.patient || '',
        filters.showDOB ? row.dob || '' : null,
        row.code || '',
        row.procedure || '',
        row.render || '',
        row.bill || '',
        `$${(row.fee || 0).toFixed(2)}`,
        `$${(row.adj || 0).toFixed(2)}`,
        `$${(row.estWriteOff || 0).toFixed(2)}`,
        `$${(row.insPay || 0).toFixed(2)}`,
        `$${(row.ptPay || 0).toFixed(2)}`,
        `$${(row.actualWriteOff || 0).toFixed(2)}`,
        `$${(row.collectionAdj || 0).toFixed(2)}`,
        `$${(row.ptRefund || 0).toFixed(2)}`,
        `$${(row.insRefund || 0).toFixed(2)}`,
        `$${(row.payFromCredit || 0).toFixed(2)}`,
        `$${(row.refundToCredit || 0).toFixed(2)}`,
        `$${(row.credit || 0).toFixed(2)}`,
        `$${(row.overpaymentToCredit || 0).toFixed(2)}`
      ].filter(val => val !== null);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Report_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>Production & Collection Report - ${groupName}</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0;">Production & Collection Report - ${groupName}</h2>
          ${tableEl.outerHTML}
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
    setFilters,
    loading,
    dropdownProviders,
    reportData,
    transformedReportData: sortedReportData,
    handleExportCSV,
    handlePrint,
    handleExportGroupCSV,
    handlePrintGroup
  };
};
