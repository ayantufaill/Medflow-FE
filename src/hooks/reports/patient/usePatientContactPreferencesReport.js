import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientContactPreferencesReport, selectContactPreferencesData, selectContactPreferencesDataLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';
import { exportToCSV } from '../../../utils/exportUtils';
import dayjs from 'dayjs';

export const usePatientContactPreferencesReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectContactPreferencesData) || [];
  const loading = useSelector(selectContactPreferencesDataLoading);

  useEffect(() => {
    dispatch(fetchPatientContactPreferencesReport());
  }, [dispatch]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.length) return;
    
    exportToCSV(reportData, [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Email', key: 'email' },
      { header: 'Phone Number', key: 'phone' },
      { header: 'Permission to Text', key: 'text' },
      { header: 'Permission to Email', key: 'emailPerm' },
      { header: 'Request Review', key: 'review' },
    ], `contact_preferences_${dayjs().format('YYYY-MM-DD')}`);
  };

  const handlePrint = () => {
    const printArea = document.getElementById('contact-preferences-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Patient By Contact Preferences Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Patient By Contact Preferences Report</h2>
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
