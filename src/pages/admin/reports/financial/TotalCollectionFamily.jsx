import React, { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import TotalCollectionFamilyFilters from '../../../../components/reports/financial/TotalCollectionFamilyFilters';
import TotalCollectionFamilyTable from '../../../../components/reports/financial/TotalCollectionFamilyTable';
import { reportingService } from '../../../../services/reporting.service';

const TotalCollectionFamily = () => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [sortBy, setSortBy] = useState('Default');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('total-collection-family', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch total collection family report:', err);
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
    setSortBy('Default');
  };

  const sortedData = useMemo(() => {
    if (sortBy === 'Amount') {
      return [...reportData].sort((a, b) => {
        const valA = parseFloat((a.totalCollection || '0').replace(/[$,]/g, '')) || 0;
        const valB = parseFloat((b.totalCollection || '0').replace(/[$,]/g, '')) || 0;
        return valB - valA;
      });
    }
    return reportData;
  }, [reportData, sortBy]);

  const handleExportCSV = () => {
    const headers = ['Family / Member ID', 'Name / Patient', 'Patient Collection', 'Insurance Collection', 'Total Collection'];
    const rows = [];

    sortedData.forEach(family => {
      // Family summary row
      rows.push([
        family.id,
        family.name.toUpperCase(),
        family.patientCollection,
        family.insuranceCollection,
        family.totalCollection
      ]);

      // Member rows
      family.members.forEach(member => {
        rows.push([
          `  ${member.id}`,
          member.name,
          member.patientCollection,
          member.insuranceCollection,
          member.totalCollection
        ]);
      });

      // Spacing row
      rows.push(['', '', '', '', '']);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Total_Collection_Family_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Total Collection Family Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('.family-box { display: flex; gap: 20px; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px; font-size: 11px; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Total Collection By Family Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);

    sortedData.forEach(family => {
      printWindow.document.write(`<h3>${family.name}</h3>`);
      printWindow.document.write(`
        <div class="family-box">
          <span><strong>Total Patient Collection:</strong> ${family.patientCollection}</span>
          <span><strong>Total Insurance Collection:</strong> ${family.insuranceCollection}</span>
          <span><strong>Total Collection:</strong> ${family.totalCollection}</span>
        </div>
      `);
      printWindow.document.write('<table><thead><tr><th>ID</th><th>Patient</th><th>Patient Collection</th><th>Insurance Collection</th><th>Total Collection</th></tr></thead><tbody>');
      family.members.forEach(member => {
        printWindow.document.write(`<tr><td>${member.id}</td><td>${member.name}</td><td>${member.patientCollection}</td><td>${member.insuranceCollection}</td><td>${member.totalCollection}</td></tr>`);
      });
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
    <ReportLayout title="Total Collection By Family Report:">
      <TotalCollectionFamilyFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        sortBy={sortBy}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSortBy={setSortBy}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={sortedData.length > 0}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : sortedData.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available for the selected filters.
        </Typography>
      ) : (
        <TotalCollectionFamilyTable families={sortedData} />
      )}
    </ReportLayout>
  );
};

export default TotalCollectionFamily;

