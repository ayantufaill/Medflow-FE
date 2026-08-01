import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import FamilyMigratedBalancesTable from '../../../../components/reports/financial/FamilyMigratedBalancesTable';
import { reportingService } from '../../../../services/reporting.service';

const FamilyMigratedBalances = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('family-migrated-balances');
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch family migrated balances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Patient', 'Patient Owing', 'Insurance Owing', 'Total Owing', 'Migration Date'];
    const rows = reportData.map(row => [
      row.patient,
      row.patientOwing,
      row.insuranceOwing,
      row.totalOwing,
      row.migrationDate
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Family_Migrated_Balances.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Family Migrated Balances Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Family Migrated Balances Report</h2>');
    printWindow.document.write('<table><thead><tr><th>Patient</th><th>Patient Owing</th><th>Insurance Owing</th><th>Total Owing</th><th>Migration Date</th></tr></thead><tbody>');
    reportData.forEach(row => {
      printWindow.document.write(`<tr><td>${row.patient}</td><td>$${(row.patientOwing || 0).toFixed(2)}</td><td>$${(row.insuranceOwing || 0).toFixed(2)}</td><td>$${(row.totalOwing || 0).toFixed(2)}</td><td>${row.migrationDate}</td></tr>`);
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
    <ReportLayout title="Family Migrated Balances:">
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
          No data available.
        </Typography>
      ) : (
        <FamilyMigratedBalancesTable data={reportData} />
      )}
    </ReportLayout>
  );
};

export default FamilyMigratedBalances;
