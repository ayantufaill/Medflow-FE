import { useState, useEffect, useMemo } from 'react';
import { reportingService } from '../../../services/reporting.service';
import { exportToCSV } from '../../../utils/exportUtils';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useCreditAccountsReport = () => {
  const [filter, setFilter] = useState('All patients');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupByCredit, setGroupByCredit] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState({
    filter: 'All patients',
    includeInactive: false,
    groupByCredit: false
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('credit-accounts', {
        filter: appliedFilters.filter,
        includeInactive: appliedFilters.includeInactive,
        groupByCredit: appliedFilters.groupByCredit
      });
      setReportData(data || []);
    } catch (error) {
      console.error("Failed to fetch Credit Accounts Report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchTrigger, appliedFilters.filter, appliedFilters.includeInactive]);

  const groupedData = useMemo(() => {
    if (!appliedFilters.groupByCredit) return null;

    const groups = {
      'Patient Credit': [],
      'Insurance Credit': []
    };

    reportData.forEach(row => {
      if (row.credit && row.credit > 0) {
        groups['Patient Credit'].push(row);
      }
      if (row.insCredit && row.insCredit > 0) {
        groups['Insurance Credit'].push(row);
      }
    });

    // Remove empty groups
    if (groups['Patient Credit'].length === 0) delete groups['Patient Credit'];
    if (groups['Insurance Credit'].length === 0) delete groups['Insurance Credit'];

    return groups;
  }, [reportData, appliedFilters.groupByCredit]);

  const handlePrint = () => {
    const tableEl = document.getElementById('credit-accounts-table');
    if (!tableEl) return;
    
    const htmlContent = `
      <html>
        <head>
          <title>Credit Accounts Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Credit Accounts Report</h2>
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

  const handleClear = () => {
    setFilter('All patients');
    setIncludeInactive(false);
    setGroupByCredit(false);
    
    setAppliedFilters({
      filter: 'All patients',
      includeInactive: false,
      groupByCredit: false
    });
    setFetchTrigger(prev => prev + 1);
  };

  const handleApply = () => {
    setAppliedFilters({
      filter,
      includeInactive,
      groupByCredit
    });
    // fetch will trigger via useEffect dependency
  };

  const handleExportCSV = () => {
    exportToCSV(reportData, [
      { header: 'Patient Name', key: 'name' },
      { header: 'Birth Date', key: 'dob' },
      { header: 'Email', key: 'email' },
      { header: 'Phone Number', key: 'phone' },
      { header: 'Amount', key: (row) => (row.amount || 0).toFixed(2) },
      { header: 'Patient Credit', key: (row) => (row.credit || 0).toFixed(2) },
      { header: 'Insurance Credit', key: (row) => (row.insCredit || 0).toFixed(2) },
    ], 'Credit_Accounts_Report');
  };

  return {
    filter, setFilter,
    includeInactive, setIncludeInactive,
    groupByCredit, setGroupByCredit,
    reportData, loading, groupedData,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
