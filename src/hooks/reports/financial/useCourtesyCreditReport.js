import { useState, useEffect } from 'react';
import { reportingService } from '../../../services/reporting.service';
import { exportToCSV } from '../../../utils/exportUtils';
import medflowLogo from '../../../assets/medflow-logo.png';

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
    
    const htmlContent = `
      <html>
        <head>
          <title>Courtesy Credit Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Courtesy Credit Report</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${tableEl.outerHTML}
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

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };

    document.body.appendChild(iframe);
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
