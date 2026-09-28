import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useProductionPerCode = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'daily',
    startDate: initialStartDate,
    endDate: initialEndDate,
    provider: 'all',
    referralProvider: 'all',
    groupBy: 'none',
    codeFilter: 'filter',
    codeText: '',
    showCollection: false
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastFetchedRef = useRef(null);

  const fetchData = async (filters) => {
    const { dateRange, startDate, endDate, provider, referralProvider, groupBy, showCollection } = filters;
    const paramsKey = `${dateRange}_${startDate}_${endDate}_${provider}_${referralProvider}_${groupBy}_${showCollection}`;
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
        provider: provider,
        referralProvider: referralProvider,
        groupBy: groupBy,
        showCollection: showCollection
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

  // Handle both flat array and grouped response
  const isGrouped = reportData && reportData.grouped === true && Array.isArray(reportData.groups);
  const isFlatObj = reportData && reportData.showCollection === true && Array.isArray(reportData.rows);

  const filteredReportData = isGrouped
    ? {
        ...reportData,
        groups: reportData.groups.map(g => ({
          ...g,
          rows: applyCodeFilter(g.rows)
        }))
      }
    : isFlatObj
      ? {
          ...reportData,
          rows: applyCodeFilter(reportData.rows)
        }
      : applyCodeFilter(Array.isArray(reportData) ? reportData : []);

  // Flatten rows for CSV export
  const flatRowsForExport = isGrouped
    ? filteredReportData.groups.flatMap(g => g.rows)
    : isFlatObj
      ? filteredReportData.rows
      : filteredReportData;

  const handleExportCSV = () => {
    const headers = ['Code', 'Procedure', 'Quantity', 'Total Production'];
    if (appliedFilters.showCollection) {
      headers.push('Total Collection');
    }
    headers.push('Average Production', 'Percent Production');

    const rows = flatRowsForExport.map(row => {
      const exportRow = [
        row.code || '',
        row.procedure || '',
        row.quantity || 0,
        `$${(row.totalProduction || 0).toFixed(2)}`
      ];
      if (appliedFilters.showCollection) {
        exportRow.push(`$${(row.totalCollection || 0).toFixed(2)}`);
      }
      exportRow.push(`$${(row.avgProduction || 0).toFixed(2)}`, `${(row.percentProduction || 0).toFixed(2)}%`);
      return exportRow;
    });

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

    const htmlContent = `
      <html>
        <head>
          <title>Production Per Code</title>
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
          <h2 style="text-align: center; margin-top: 0;">Production Per Code</h2>
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
    rawReportData: reportData,
    reportData: filteredReportData,
    loading,
    dropdownProviders,
    getProviderLabel,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
