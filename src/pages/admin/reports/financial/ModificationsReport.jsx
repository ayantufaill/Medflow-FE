import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ModificationsReportFilters from '../../../../components/reports/financial/ModificationsReportFilters';
import ModificationsReportTable from '../../../../components/reports/financial/ModificationsReportTable';
import {
  fetchModificationsReport,
  selectModificationsData,
  selectModificationsLoading
} from '../../../../store/slices/billingSlice';

const ModificationsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectModificationsData);
  const loading = useSelector(selectModificationsLoading);

  const [affectedDate, setAffectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    dispatch(fetchModificationsReport({ date: affectedDate, range: 'Daily' }));
  }, [dispatch, affectedDate]);

  const mappedModifications = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return [];
    }

    return reportData.map(item => {
      // If backend returns modifications log: { timestamp, modifiedBy, field, originalValue, newValue }
      if (item.timestamp && item.modifiedBy) {
        return {
          action: item.field || 'Modify',
          trans: item.modifiedBy || 'System',
          proc: item.field || 'Log Entry',
          rendering: 'Admin',
          billing: 'Admin',
          fees: `$${parseFloat(item.originalValue || 0).toFixed(2)}`,
          creditAdj: `-$${Math.abs(parseFloat(item.newValue || 0) - parseFloat(item.originalValue || 0)).toFixed(2)}`,
          debitAdj: '$0.00',
          collection: '$0.00',
          accountCredit: '$0.00'
        };
      }
      return item;
    });
  }, [reportData]);

  // Derived values for CSV exporting
  const totalFees = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.fees || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCreditAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.creditAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalDebitAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.debitAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCollection = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.collection || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalAccountCredit = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.accountCredit || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const netProd = totalFees + totalCreditAdj + totalDebitAdj;

  const formatAmount = (val, prefix = '') => {
    if (val === 0) return '$0.00';
    if (val < 0) return `-$${Math.abs(val).toFixed(2)}`;
    return `${prefix}$${val.toFixed(2)}`;
  };

  const handleExportCSV = () => {
    const headers = [
      'Action',
      'Transaction #',
      'Procedures',
      'Rendering Prov / Internal Code',
      'Billing Prov / Internal Code',
      'Fees',
      'Credit Adj',
      'Debit Adj',
      'Collection',
      'Account Credit'
    ];

    const rows = mappedModifications.map(row => [
      row.action,
      row.trans,
      row.proc,
      row.rendering,
      row.billing,
      row.fees,
      row.creditAdj,
      row.debitAdj,
      row.collection,
      row.accountCredit
    ]);

    rows.push([
      'totals modifications',
      '',
      '',
      '',
      '',
      formatAmount(totalFees),
      formatAmount(totalCreditAdj),
      formatAmount(totalDebitAdj),
      formatAmount(totalCollection, '+'),
      formatAmount(totalAccountCredit, '+')
    ]);

    rows.push([
      'net prod modification',
      '',
      '',
      '(prod + adj)',
      '',
      formatAmount(netProd),
      '',
      '',
      '',
      ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Modifications_Report_${affectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('modifications-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Modifications Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Modifications Report</h2>');
    printWindow.document.write(`<p>Affected Date: ${affectedDate}</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleApply = () => {
    dispatch(fetchModificationsReport({ date: affectedDate, range: 'Daily' }));
  };

  const handleClear = () => {
    setAffectedDate(dayjs().format('YYYY-MM-DD'));
  };

  return (
    <ReportLayout title="Modifications Report:">
      <ModificationsReportFilters
        affectedDate={affectedDate}
        setAffectedDate={setAffectedDate}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
      />

      <ModificationsReportTable
        mappedModifications={mappedModifications}
        loading={loading}
      />
    </ReportLayout>
  );
};

export default ModificationsReport;
