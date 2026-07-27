import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import PaymentRequestFilters from '../../../../components/reports/financial/PaymentRequestFilters';
import PaymentRequestTable from '../../../../components/reports/financial/PaymentRequestTable';
import { reportingService } from '../../../../services/reporting.service';

const PaymentRequest = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('payment-request', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch payment request report:', err);
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
  };

  const handleExportCSV = () => {
    const headers = ['Patient', 'Created On', 'Amount Requested', 'Amount Paid', 'Date Paid', 'Status'];
    const rows = reportData.map(row => [
      row.patient,
      row.created,
      row.requested,
      row.paid,
      row.date || '',
      row.status || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Payment_Requests_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Payment Request Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Payment Request Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);
    printWindow.document.write('<table><thead><tr><th>Patient</th><th>Created On</th><th>Amount Requested</th><th>Amount Paid</th><th>Date Paid</th><th>Status</th></tr></thead><tbody>');
    reportData.forEach(row => {
      printWindow.document.write(`<tr><td>${row.patient}</td><td>${row.created}</td><td>${row.requested}</td><td>${row.paid}</td><td>${row.date || '-'}</td><td>${row.status || '-'}</td></tr>`);
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
    <ReportLayout title="Payment Request Report:">
      <PaymentRequestFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : reportData.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available for the selected filters.
        </Typography>
      ) : (
        <PaymentRequestTable data={reportData} />
      )}
    </ReportLayout>
  );
};

export default PaymentRequest;

