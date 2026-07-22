import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import ProductionReportFilters from '../../../../components/reports/financial/ProductionReportFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProductionReportTable from '../../../../components/reports/financial/ProductionReportTable';

const ProductionReport = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    provider: 'all',
    grouping: 'no-grouping',
    codeFilter: 'filter',
    codeText: '',
    showFlags: true,
    flagFilter: 'pts',
    sortBy: 'default'
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const rangeParam = appliedFilters.dateRange.charAt(0).toUpperCase() + appliedFilters.dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production', {
        date: appliedFilters.startDate,
        range: rangeParam,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch production report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters.dateRange, appliedFilters.startDate, appliedFilters.endDate]);

  const getProviderLabel = (p) => {
    if (p?.userId?.firstName || p?.userId?.lastName) {
      return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
    }
    return `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.name || 'Unknown';
  };

  const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === appliedFilters.provider);
  const selectedProvName = selectedProvObj ? getProviderLabel(selectedProvObj) : '';

  const codes = appliedFilters.codeText ? appliedFilters.codeText.toLowerCase().split(/[,\s]+/).map(c => c.trim()).filter(Boolean) : [];

  let filteredReportData = reportData.filter(row => {
    if (appliedFilters.provider !== 'all' && row.provider !== selectedProvName) return false;
    
    if (codes.length > 0) {
      const rowCode = (row.code || '').toLowerCase();
      const rowProc = (row.procedure || '').toLowerCase();
      const match = codes.some(c => rowCode.includes(c) || rowProc.includes(c));
      
      if (appliedFilters.codeFilter === 'filter' && !match) return false;
      if (appliedFilters.codeFilter === 'exclude' && match) return false;
    }
    
    if (appliedFilters.flagFilter !== 'pts') {
      const hasFlags = row.flags && row.flags.length > 0;
      if (appliedFilters.flagFilter === 'with_flags' && !hasFlags) return false;
      if (appliedFilters.flagFilter === 'without_flags' && hasFlags) return false;
    }
    
    return true;
  });

  const sortedReportData = [...filteredReportData].sort((a, b) => {
    switch (appliedFilters.sortBy) {
      case 'date_asc':
        return new Date(a.date || 0) - new Date(b.date || 0);
      case 'date_desc':
        return new Date(b.date || 0) - new Date(a.date || 0);
      case 'patient':
        return (a.patient || '').localeCompare(b.patient || '');
      case 'amount_desc':
        return (b.fee || b.charge || 0) - (a.fee || a.charge || 0);
      default:
        return 0;
    }
  });

  const handleExportCSV = async () => {
    const headers = [
      'Date',
      appliedFilters.showFlags ? 'Flags' : null,
      'Patient',
      'Date of Birth',
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Procedure Charge',
      'Adj',
      'Estimate write off',
      'Insurance Payment',
      'Patient Payment',
      'Actual Write-off',
      'Adj',
      'Pt. Refund',
      'Ins. Refund',
      'Pay From Credit',
      'Refund To Credit',
      'Credit (+/-)',
      'Overpayment To Credit'
    ].filter(Boolean);

    const rows = sortedReportData.map(row => {
      const rowData = [
        row.date ? new Date(row.date).toLocaleDateString() : '',
        appliedFilters.showFlags ? (row.flags ? row.flags.length : 0) : null,
        row.patient || '',
        row.dob || '-',
        row.code || '',
        row.procedure || '',
        row.provider || '',
        row.provider || '',
        `$${(row.fee || row.charge || 0).toFixed(2)}`,
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
    link.setAttribute('download', `Production_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
    printWindow.document.write('<html><head><title>Production Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Production Report</h2>');
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
      'Code',
      'Procedure',
      'Render Provider',
      'Bill Provider',
      'Procedure Charge',
      'Adj',
      'Estimate write off'
    ];

    const rows = groupRows.map(row => [
      row.date ? new Date(row.date).toLocaleDateString() : '',
      row.patient || '',
      row.code || '',
      row.procedure || '',
      row.provider || '',
      row.provider || '',
      `$${(row.fee || row.charge || 0).toFixed(2)}`,
      `$${(row.adj || 0).toFixed(2)}`,
      `$${(row.estWriteOff || 0).toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Report_${groupName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    const footerEl = document.getElementById('production-report-footer');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production Report - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production Report - ' + groupName + '</h2>');
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

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production Report:
      </Typography>

      <ProductionReportFilters 
        dropdownProviders={dropdownProviders}
        onApplyFilters={(filters) => setAppliedFilters(filters)}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
      />

      <ProductionReportTable 
        sortedReportData={sortedReportData}
        grouping={appliedFilters.grouping}
        showFlags={appliedFilters.showFlags}
        handleExportGroupCSV={handleExportGroupCSV}
        handlePrintGroup={handlePrintGroup}
      />
    </Box>
  );
};

export default ProductionReport;
