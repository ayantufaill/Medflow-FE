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
import medflowLogo from '../../../../assets/medflow-logo.png';

const ModificationsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectModificationsData);
  const loading = useSelector(selectModificationsLoading);

  const [affectedDate, setAffectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [appliedDate, setAppliedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    dispatch(fetchModificationsReport({ date: appliedDate, range: 'Daily' }));
  }, [dispatch, appliedDate]);

  const formatAmount = (val, prefix = '') => {
    const num = parseFloat(val) || 0;
    if (num === 0) return '$0.00';
    if (num < 0) return `-$${Math.abs(num).toFixed(2)}`;
    return `${prefix}$${num.toFixed(2)}`;
  };

  const mappedModifications = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return [];
    }

    return reportData.map(item => {
      if (item.action !== undefined && item.fees !== undefined) {
        return {
          action: item.action,
          trans: item.trans,
          proc: item.proc,
          rendering: item.rendering,
          billing: item.billing,
          fees: formatAmount(item.fees),
          creditAdj: formatAmount(item.creditAdj, item.creditAdj > 0 ? '-' : ''),
          debitAdj: formatAmount(item.debitAdj),
          collection: formatAmount(item.collection),
          accountCredit: formatAmount(item.accountCredit)
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
    
    const htmlContent = `
      <html>
        <head>
          <title>Modifications Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Modifications Report</h2>
          <p style="text-align: center; margin-bottom: 20px;">Affected Date: ${appliedDate}</p>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${tableEl.outerHTML}
          </div>
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

  const handleApply = () => {
    setAppliedDate(affectedDate);
  };

  const handleClear = () => {
    const today = dayjs().format('YYYY-MM-DD');
    setAffectedDate(today);
    setAppliedDate(today);
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
