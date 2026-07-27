import React, { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import PaymentLinesFilters from '../../../../components/reports/financial/PaymentLinesFilters';
import PaymentLinesTable from '../../../../components/reports/financial/PaymentLinesTable';
import { reportingService } from '../../../../services/reporting.service';

const PaymentLines = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedStatus, setSelectedStatus] = useState('Scheduled');
  const [includeArchived, setIncludeArchived] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('payment-lines', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch payment lines report:', err);
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
    setSelectedStatus('Scheduled');
    setIncludeArchived(false);
  };

  const filteredData = useMemo(() => {
    let list = reportData;

    // Filter by status
    if (selectedStatus !== 'All') {
      list = list.filter(row => row.status?.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Filter by archived
    if (!includeArchived) {
      list = list.filter(row => row.status?.toLowerCase() !== 'archived');
    }

    return list;
  }, [reportData, selectedStatus, includeArchived]);

  const handleExportCSV = () => {
    const headers = ['Patient ID', 'Patient', 'Amount', 'Down Payment', 'Due Date', 'Charged On', 'Failed On', 'Failed Attempts', 'Status', 'Error Message'];
    const rows = filteredData.map(row => [
      row.id || row.patientId || '',
      row.patient,
      row.amount,
      row.downPayment,
      row.dueDate,
      row.chargedOn || '',
      row.failedOn || '',
      row.failedAttempts ?? 0,
      row.status,
      row.error || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Payment_Lines_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Payment Lines Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Payment Lines Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);
    printWindow.document.write('<table><thead><tr><th>Patient ID</th><th>Patient</th><th>Amount</th><th>Down Payment</th><th>Due Date</th><th>Charged On</th><th>Failed On</th><th>Failed Attempts</th><th>Status</th><th>Error Message</th></tr></thead><tbody>');
    filteredData.forEach(row => {
      printWindow.document.write(`<tr><td>${row.id || row.patientId || '-'}</td><td>${row.patient}</td><td>${row.amount}</td><td>${row.downPayment}</td><td>${row.dueDate}</td><td>${row.chargedOn || '-'}</td><td>${row.failedOn || '-'}</td><td>${row.failedAttempts ?? 0}</td><td>${row.status}</td><td>${row.error || '-'}</td></tr>`);
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
    <ReportLayout title="Payment Lines Report:">
      <PaymentLinesFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        selectedStatus={selectedStatus}
        includeArchived={includeArchived}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSelectedStatus={setSelectedStatus}
        setIncludeArchived={setIncludeArchived}
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
        <PaymentLinesTable data={filteredData} />
      )}
    </ReportLayout>
  );
};

export default PaymentLines;

