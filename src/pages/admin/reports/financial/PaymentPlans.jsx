import React, { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import PaymentPlansFilters from '../../../../components/reports/financial/PaymentPlansFilters';
import PaymentPlansTable from '../../../../components/reports/financial/PaymentPlansTable';
import { reportingService } from '../../../../services/reporting.service';

const PaymentPlans = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedStatus, setSelectedStatus] = useState('Scheduled');
  const [filterType, setFilterType] = useState('All');
  const [includeArchived, setIncludeArchived] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('payment-plans', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch payment plans report:', err);
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
    setFilterType('All');
    setIncludeArchived(false);
  };

  const filteredData = useMemo(() => {
    let list = reportData;

    // Filter by status
    if (selectedStatus !== 'All') {
      list = list.filter(row => row.status?.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Filter by type
    if (filterType !== 'All') {
      list = list.filter(row => row.type?.toLowerCase() === filterType.toLowerCase());
    }

    // Filter by archived
    if (!includeArchived) {
      list = list.filter(row => row.status?.toLowerCase() !== 'closed');
    }

    return list;
  }, [reportData, selectedStatus, filterType, includeArchived]);

  const handleExportCSV = () => {
    const headers = ['Patient', 'Created On', 'Payment Amount', 'Total Payments', 'Remaining Payments', 'Remaining Balance', 'Next Payment Due', 'Missed Payments', 'Last Billed On', 'Last Payment Due', 'Type', 'Status'];
    const rows = [];

    filteredData.forEach(plan => {
      // Plan summary row
      rows.push([
        plan.patient,
        plan.createdOn,
        plan.amount,
        plan.totalPayments,
        plan.remainingPayments,
        plan.remainingBalance,
        plan.nextDue || '',
        plan.missed,
        plan.lastBilled || '',
        plan.lastPayment || '',
        plan.type,
        plan.status
      ]);

      // History rows
      if (plan.history && plan.history.length > 0) {
        rows.push(['  -- History --', '', '', '', '', '', '', '', '', '', '', '']);
        plan.history.forEach(h => {
          rows.push([
            `    Due: ${h.dueDate || h.due}`,
            h.amount,
            h.status,
            `Created: ${h.created}`,
            `Down: ${h.downPayment}`,
            `Charged: ${h.chargedOn || h.charged || ''}`,
            `Failed: ${h.failedOn || h.failed || ''}`,
            h.error || ''
          ]);
        });
      }

      // Blank spacing row
      rows.push(['', '', '', '', '', '', '', '', '', '', '', '']);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Payment_Plans_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Payment Plans Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('.plan-box { background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px; font-size: 11px; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Payment Plans Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);

    filteredData.forEach(plan => {
      printWindow.document.write(`<h3>${plan.patient}</h3>`);
      printWindow.document.write(`
        <div class="plan-box">
          <span><strong>Created On:</strong> ${plan.createdOn}</span> | 
          <span><strong>Amount:</strong> ${plan.amount}</span> | 
          <span><strong>Remaining Balance:</strong> ${plan.remainingBalance}</span> | 
          <span><strong>Status:</strong> ${plan.status}</span>
        </div>
      `);
      printWindow.document.write('<table><thead><tr><th>Amount</th><th>Status</th><th>Date Created</th><th>Due Date</th><th>Down Payment</th><th>Charged On</th><th>Failed On</th><th>Error Message</th></tr></thead><tbody>');
      if (plan.history && plan.history.length > 0) {
        plan.history.forEach(h => {
          printWindow.document.write(`<tr><td>${h.amount}</td><td>${h.status}</td><td>${h.created}</td><td>${h.dueDate || h.due}</td><td>${h.downPayment}</td><td>${h.chargedOn || h.charged || '-'}</td><td>${h.failedOn || h.failed || '-'}</td><td>${h.error || '-'}</td></tr>`);
        });
      } else {
        printWindow.document.write('<tr><td colspan="8" align="center">No history available</td></tr>');
      }
      printWindow.document.write('</tbody></table>');
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <ReportLayout title="Payment Plans Report:">
      <PaymentPlansFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        selectedStatus={selectedStatus}
        filterType={filterType}
        includeArchived={includeArchived}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSelectedStatus={setSelectedStatus}
        setFilterType={setFilterType}
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
        <PaymentPlansTable data={filteredData} />
      )}
    </ReportLayout>
  );
};

export default PaymentPlans;
