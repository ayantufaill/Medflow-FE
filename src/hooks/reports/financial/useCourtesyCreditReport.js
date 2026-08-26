import { useState, useEffect } from 'react';
import { reportingService } from '../../../services/reporting.service';
import { exportToCSV } from '../../../utils/exportUtils';

export const useCourtesyCreditReport = () => {
  const [outstandingFilter, setOutstandingFilter] = useState('all');
  const [patientFilter, setPatientFilter] = useState('all');
  const [flagFilter, setFlagFilter] = useState('pts');
  const [searchText, setSearchText] = useState('');
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('courtesy-credit', {
        outstandingFilter,
        patientFilter,
        flagFilter,
        searchText
      });
      setReportData(data || []);
    } catch (error) {
      console.error("Failed to fetch Courtesy Credit Report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = () => {
    const tableEl = document.getElementById('courtesy-credit-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Courtesy Credit Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Courtesy Credit Report</h2>');
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
    setOutstandingFilter('all');
    setPatientFilter('all');
    setFlagFilter('pts');
    setSearchText('');
  };

  const handleApply = () => {
    fetchData();
  };

  const handleExportCSV = () => {
    exportToCSV(reportData, [
      { header: 'Patient ID', key: (row) => row.id || row.date },
      { header: 'Patient Name', key: (row) => row.name || row.patient },
      { header: 'Amount', key: (row) => (row.amount || row.creditAmount || 0).toFixed(2) },
    ], 'Courtesy_Credit_Report');
  };

  const totalAmount = reportData.reduce((sum, row) => sum + (row.amount || row.creditAmount || 0), 0);

  return {
    outstandingFilter, setOutstandingFilter,
    patientFilter, setPatientFilter,
    flagFilter, setFlagFilter,
    searchText, setSearchText,
    reportData, totalAmount, loading,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
