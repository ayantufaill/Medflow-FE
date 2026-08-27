import { useState, useEffect } from 'react';
import { reportingService } from '../../../services/reporting.service';
import { exportToCSV } from '../../../utils/exportUtils';

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
    reportData, loading,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
