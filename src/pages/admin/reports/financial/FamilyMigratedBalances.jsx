import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import FamilyMigratedBalancesTable from '../../../../components/reports/financial/FamilyMigratedBalancesTable';
import { reportingService } from '../../../../services/reporting.service';
import medflowLogo from '../../../../assets/medflow-logo.png';

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
    const printContent = document.getElementById('family-migrated-balances-print-area');
    if (!printContent) return;

    const htmlContent = `
      <html>
        <head>
          <title>Family Migrated Balances Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Family Migrated Balances Report</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
            ${printContent.outerHTML}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = htmlContent;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  };

  return (
    <ReportLayout title="Family Migrated Balances:">
      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      <Box id="family-migrated-balances-print-area">
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
      </Box>
    </ReportLayout>
  );
};

export default FamilyMigratedBalances;
