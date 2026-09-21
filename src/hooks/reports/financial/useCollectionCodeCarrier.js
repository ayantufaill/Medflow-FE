import { useState, useEffect, useRef } from 'react';
import { reportingService } from '../../../services/reporting.service';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useCollectionCodeCarrier = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'daily',
    startDate: initialStartDate,
    endDate: initialEndDate,
    codeFilter: 'filter',
    codeText: ''
  });

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const lastFetchedRef = useRef(null);

  const fetchData = async (filters) => {
    const { dateRange, startDate, endDate } = filters;
    const paramsKey = `${dateRange}_${startDate}_${endDate}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);
      const res = await reportingService.getFinancialReport('collection-code-carrier', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch collection code carrier report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (newFilters) => {
    setAppliedFilters(newFilters);
    fetchData(newFilters);
  };

  const handleClear = () => {
    lastFetchedRef.current = null;
  };

  const { codeFilter, codeText } = appliedFilters;
  const codes = codeText ? codeText.toLowerCase().split(/[,\s]+/).map(c => c.trim()).filter(Boolean) : [];

  const applyCodeFilter = (rows) => {
    if (!Array.isArray(rows)) return [];
    return rows.filter(row => {
      if (codes.length > 0) {
        const rowCode = (row.code || '').toLowerCase();
        const rowProc = (row.procedure || '').toLowerCase();
        const matches = codes.some(c => rowCode.includes(c) || rowProc.includes(c));
        if (codeFilter === 'filter' && !matches) return false;
        if (codeFilter === 'exclude' && matches) return false;
      }
      return true;
    });
  };

  const filteredReportData = applyCodeFilter(Array.isArray(reportData) ? reportData : []);

  const handleExportCSV = () => {
    const headers = ['Code', 'Procedure', 'Carrier', 'Collection'];
    const rows = filteredReportData.map(row => [
      row.code || '',
      row.procedure || '',
      row.carrier || '',
      `$${(row.collection || 0).toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Collection_Per_Code_Carrier_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('collection-carrier-table');
    const footerEl = document.getElementById('collection-carrier-footer');
    if (!tableEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>Collection Per Code Per Carrier</title>
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
          <h2 style="text-align: center; margin-top: 0;">Collection Per Code Per Carrier</h2>
          ${tableEl.outerHTML}
          ${footerEl ? `<div style="font-family: sans-serif; font-size: 12px; margin-top: 20px;">${footerEl.innerHTML}</div>` : ''}
          <div style="font-family: sans-serif; font-size: 10px; margin-top: 20px;">
            <strong>Disclaimers:</strong><br/>
            • Dual coverage excluded from the total collections and average per code<br/>
            • Carrier (in network or out of network) is based on the current status of the insurance per provider.
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

  return {
    rawReportData: reportData,
    reportData: filteredReportData,
    loading,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
