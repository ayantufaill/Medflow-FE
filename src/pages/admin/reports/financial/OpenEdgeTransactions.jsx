import React, { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import OpenEdgeTransactionsFilters from '../../../../components/reports/financial/OpenEdgeTransactionsFilters';
import OpenEdgeTransactionsTable from '../../../../components/reports/financial/OpenEdgeTransactionsTable';
import { reportingService } from '../../../../services/reporting.service';

const OpenEdgeTransactions = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [statusFilter, setStatusFilter] = useState('All');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('openedge-transactions', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch openedge transactions report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleFilterModeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleApply = () => {
    fetchData();
  };

  const handleClear = () => {
    setDateRange('Daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setStatusFilter('All');
  };

  const filteredData = useMemo(() => {
    if (statusFilter === 'All') return reportData;
    return reportData.filter(row => row.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [reportData, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Patient ID', 'Created On', 'Transaction Type', 'Transaction Number', 'Status'];
    const rows = filteredData.map(row => [
      row.id,
      row.created,
      row.type,
      row.number,
      row.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OpenEdge_Transactions_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>OpenEdge Transactions Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>OpenEdge Transactions Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);
    printWindow.document.write('<table><thead><tr><th>Patient ID</th><th>Created On</th><th>Transaction Type</th><th>Transaction Number</th><th>Status</th></tr></thead><tbody>');
    filteredData.forEach(row => {
      printWindow.document.write(`<tr><td>${row.id}</td><td>${row.created}</td><td>${row.type}</td><td>${row.number}</td><td>${row.status}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <ReportLayout title="Open Edge Transactions Report:">
      <OpenEdgeTransactionsFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        statusFilter={statusFilter}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStatusFilter={setStatusFilter}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={filteredData.length > 0}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : filteredData.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available for the selected filters.
        </Typography>
      ) : (
        <OpenEdgeTransactionsTable data={filteredData} />
      )}
    </ReportLayout>
  );
};

export default OpenEdgeTransactions;

