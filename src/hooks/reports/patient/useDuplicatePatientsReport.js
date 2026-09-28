import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDuplicatePatientsReport, selectDuplicatePatientsData, selectDuplicatePatientsDataLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';
import { exportToCSV } from '../../../utils/exportUtils';
import dayjs from 'dayjs';

export const useDuplicatePatientsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectDuplicatePatientsData) || [];
  const loading = useSelector(selectDuplicatePatientsDataLoading);

  useEffect(() => {
    dispatch(fetchDuplicatePatientsReport());
  }, [dispatch]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.length) return;
    
    exportToCSV(reportData, [
      { header: 'ID', key: 'id' },
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Date of Birth', key: 'dob' },
      { header: 'Status', key: 'status' },
      { header: 'Subscriber', key: 'subscriber' },
    ], `duplicate_patients_${dayjs().format('YYYY-MM-DD')}`);
  };

  const handlePrint = () => {
    const printArea = document.getElementById('duplicate-patients-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Duplicate Patients Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Duplicate Patients Report</h2>
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

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
  };

  return {
    reportData,
    loading,
    handleExportCSV,
    handlePrint
  };
};
