import { useState } from 'react';

export const useCollectionCodeCarrier = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const handleFilterModeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleClearAll = () => {
    setDateRange('daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setCodeFilter('filter');
    setCodeText('');
  };

  const handleApply = () => {
    console.log('Apply filters');
  };

  const handleExportCSV = () => {
    console.log('Export CSV');
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('collection-carrier-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Collection per code per carrier</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Collection per code per carrier</h2>');
    printWindow.document.write(tableEl.outerHTML);
    
    // Include Disclaimers in Print
    const disclaimers = `
      <div style="font-family: sans-serif; font-size: 10px; margin-top: 20px;">
        <strong>Disclaimers:</strong><br/>
        • Dual coverage excluded from the total collections and average per code<br/>
        • Carrier (in network or out of network) is based on the current status of the insurance per provider. ie. If you were in network during the selected range and the carrier is currently out of network, the results will show the carrier out of network
      </div>
    `;
    printWindow.document.write(disclaimers);
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return {
    dateRange,
    startDate,
    endDate,
    codeFilter,
    codeText,
    loading,
    reportData,
    setStartDate,
    setEndDate,
    setCodeFilter,
    setCodeText,
    handleFilterModeChange,
    handleClearAll,
    handleApply,
    handleExportCSV,
    handlePrint
  };
};
