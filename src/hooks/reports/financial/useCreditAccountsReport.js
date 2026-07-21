import { useState, useEffect } from 'react';
import { reportingService } from '../../../services/reporting.service';

export const useCreditAccountsReport = () => {
  const [filter, setFilter] = useState('All patients');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupByCredit, setGroupByCredit] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('credit-accounts', {
        filter,
        includeInactive,
        groupByCredit
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
  }, []);

  const handlePrint = () => {
    const tableEl = document.getElementById('credit-accounts-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Credit Accounts Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Credit Accounts Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleClear = () => {
    setFilter('All patients');
    setIncludeInactive(false);
    setGroupByCredit(false);
  };

  const handleApply = () => {
    fetchData();
  };

  const handleExportCSV = () => {
    alert('Exporting CSV...');
  };

  return {
    filter, setFilter,
    includeInactive, setIncludeInactive,
    groupByCredit, setGroupByCredit,
    reportData, loading,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
