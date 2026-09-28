import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { fetchAppointmentsReport, selectAppointmentsData, selectAppointmentsDataLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';
import { exportToCSV } from '../../../utils/exportUtils';

export const useAppointmentsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectAppointmentsData) || [];
  const loading = useSelector(selectAppointmentsDataLoading);

  const [appliedFilters, setAppliedFilters] = useState({
    dateType: 'aptDate',
    startDate: dayjs('2026-04-08'),
    endDate: dayjs('2026-05-08'),
    provider: 'all',
    status: 'all',
    locationType: 'office',
    includeShortlisted: false,
    flagFilter: 'all'
  });

  const handleApply = (filters) => {
    setAppliedFilters(filters);
  };

  useEffect(() => {
    dispatch(fetchAppointmentsReport({
      dateType: appliedFilters.dateType,
      startDate: appliedFilters.startDate ? appliedFilters.startDate.format('YYYY-MM-DD') : undefined,
      endDate: appliedFilters.endDate ? appliedFilters.endDate.format('YYYY-MM-DD') : undefined,
      provider: appliedFilters.provider,
      status: appliedFilters.status,
      locationType: appliedFilters.locationType,
      includeShortlisted: appliedFilters.includeShortlisted,
      flagFilter: appliedFilters.flagFilter
    }));
  }, [
    dispatch, 
    appliedFilters.dateType, 
    appliedFilters.startDate, 
    appliedFilters.endDate, 
    appliedFilters.provider, 
    appliedFilters.status, 
    appliedFilters.locationType, 
    appliedFilters.includeShortlisted, 
    appliedFilters.flagFilter
  ]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.length) return;
    
    exportToCSV(reportData, [
      { header: 'Patient', key: 'patient' },
      { header: 'Flags', key: (row) => Array.isArray(row.flags) ? row.flags.map(f => typeof f === 'object' ? (f.name || f.label) : f).join(', ') : row.flags },
      { header: 'Type', key: 'type' },
      { header: 'Status', key: 'status' },
      { header: 'Providers', key: 'providers' },
      { header: 'Operatory', key: 'operatory' },
      { header: 'Apt. Date', key: 'aptDate' },
      { header: 'Time', key: 'time' },
      { header: 'Duration', key: 'duration' },
      { header: 'Procedures', key: 'procedures' },
      { header: 'Next Apt. Date', key: 'nextAptDate' },
    ], 'Appointments_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('appointments-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Appointments Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Appointments Report</h2>
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
    reportData,
    loading,
    handleApply,
    handleExportCSV,
    handlePrint
  };
};
