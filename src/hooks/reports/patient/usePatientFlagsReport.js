import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientFlagsReport, selectPatientFlagsReportData, selectPatientFlagsReportDataLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';
import { exportToCSV } from '../../../utils/exportUtils';

export const usePatientFlagsReport = () => {
  const dispatch = useDispatch();
  const rawData = useSelector(selectPatientFlagsReportData) || [];
  const loading = useSelector(selectPatientFlagsReportDataLoading);

  const [appliedFilters, setAppliedFilters] = useState({
    filterBy: 'active',
    includeFlags: [],
    excludeFlags: []
  });

  const [showData, setShowData] = useState(false);

  const handleApply = (filters) => {
    setAppliedFilters(filters);
    setShowData(true);
  };

  const handleClear = () => {
    setAppliedFilters({
      filterBy: 'active',
      includeFlags: [],
      excludeFlags: []
    });
    setShowData(false);
  };

  useEffect(() => {
    if (showData) {
      dispatch(fetchPatientFlagsReport({ 
        filterBy: appliedFilters.filterBy, 
        includeFlags: appliedFilters.includeFlags.map(f => typeof f === 'string' ? f : f.name).join(','), 
        excludeFlags: appliedFilters.excludeFlags.map(f => typeof f === 'string' ? f : f.name).join(',') 
      }));
    }
  }, [dispatch, appliedFilters.filterBy, appliedFilters.includeFlags, appliedFilters.excludeFlags, showData]);

  const handleExportCSV = () => {
    if (!rawData || !rawData.length) return;
    
    exportToCSV(rawData, [
      { header: 'Patient Number', key: 'number' },
      { header: 'Patient', key: 'patient' },
      { header: 'Flags', key: (row) => Array.isArray(row.flags) ? row.flags.join(', ') : row.flags },
      { header: 'Last Appointment', key: 'lastAppointment' },
    ], 'Patient_Flags_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('patient-flags-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Patient Flags Report</title>
          <style>
            body { 
              font-family: sans-serif; 
              font-size: 12px; 
              background-color: #fff; 
              color: #000; 
              padding: 20px; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa !important; font-weight: bold; }
            .no-print, button, svg.MuiSvgIcon-root { display: none !important; }
            .MuiTablePagination-root { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Patient Flags Report</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${printArea.innerHTML}
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
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    document.body.appendChild(iframe);
  };

  return {
    reportData: rawData,
    loading,
    showData,
    appliedFilters,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
