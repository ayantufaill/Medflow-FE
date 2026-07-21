import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';

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
    const fetchKey = `${filters.dateRange}-${filters.startDate}-${filters.endDate}`;
    if (lastFetchedRef.current === fetchKey) return;
    lastFetchedRef.current = fetchKey;

    try {
      setLoading(true);
      const rangeParam = filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production-collection', {
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
    if (filters.provider !== 'all') {
      const renderLower = (row.render || '').toLowerCase();
      const billLower = (row.bill || '').toLowerCase();
      const abbrLower = selectedProvAbbr.toLowerCase();
      const initialsLower = selectedProvInitials.toLowerCase();
      
      const match = (abbrLower && (renderLower === abbrLower || billLower === abbrLower)) ||
                    (initialsLower && (renderLower === initialsLower || billLower === initialsLower));
      if (!match) return false;
    }

    if (codes.length > 0) {
      const rowCode = (row.code || '').toLowerCase();
      const matches = codes.some(c => rowCode.includes(c));
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

    if (filters.filterByDOS) {
      const targetDateStr = row.dos || row.date;
      if (targetDateStr) {
        const targetDate = new Date(targetDateStr);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        if (targetDate < start || targetDate > end) return false;
      }
    }

    return true;
  });

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
      const aAmt = a.charge || (a.ins + a.pt + a.actual) || 0;
      const bAmt = b.charge || (b.ins + b.pt + b.actual) || 0;
      return bAmt - aAmt;
    }
    return 0; 
  });

  const transformedReportData = sortedReportData.map(row => ({
    ...row,
    fee: row.charge || (row.ins + row.pt + row.actual) || 0,
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
  }));

  const handleExportCSV = () => {
    const headers = [
      'Date',
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

    const rows = transformedReportData.map(row => {
      return [
        row.date ? new Date(row.date).toLocaleDateString() : '',
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
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
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
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production & Collection Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; font-size: 12px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Report</h2>');
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

  const handleExportGroupCSV = (groupName, groupRows) => {
    const headers = [
      'Date',
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
        row.date ? new Date(row.date).toLocaleDateString() : '',
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
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Report_${groupName.replace(/\\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production & Collection Report - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; font-size: 12px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Report - ' + groupName + '</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return {
    filters,
    setFilters,
    loading,
    dropdownProviders,
    transformedReportData,
    handleExportCSV,
    handlePrint,
    handleExportGroupCSV,
    handlePrintGroup
  };
};
