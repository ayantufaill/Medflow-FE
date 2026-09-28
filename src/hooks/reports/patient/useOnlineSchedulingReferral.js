import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnlineSchedulingReferralReport, selectOnlineSchedulingReferralData, selectOnlineSchedulingReferralDataLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';
import { exportToCSV } from '../../../utils/exportUtils';

export const useOnlineSchedulingReferral = () => {
  const dispatch = useDispatch();
  const rawData = useSelector(selectOnlineSchedulingReferralData) || [];
  const loading = useSelector(selectOnlineSchedulingReferralDataLoading);

  const initialStartDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'this_year',
    startDate: initialStartDate,
    endDate: initialEndDate
  });

  const handleApply = (filters) => {
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    setAppliedFilters({
      dateRange: 'this_year',
      startDate: initialStartDate,
      endDate: initialEndDate
    });
  };

  useEffect(() => {
    if (appliedFilters.startDate && appliedFilters.endDate) {
      dispatch(fetchOnlineSchedulingReferralReport({
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
        range: 'Range'
      }));
    }
  }, [dispatch, appliedFilters.startDate, appliedFilters.endDate]);

  const handleExportCSV = () => {
    if (!rawData || !rawData.length) return;
    
    exportToCSV(rawData, [
      { header: 'Referral', key: 'referral' },
      { header: 'UTM Source', key: 'utmSource' },
      { header: 'UTM Medium', key: 'utmMedium' },
      { header: 'UTM Campaign', key: 'utmCampaign' },
      { header: 'Number of Clicks', key: 'clicks' },
    ], 'Online_Scheduling_Referral_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('online-referral-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Online Scheduling Referral Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .no-print, button, svg.MuiSvgIcon-root { display: none !important; }
            .MuiTablePagination-root { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Online Scheduling Referral Report</h2>
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
    appliedFilters,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
