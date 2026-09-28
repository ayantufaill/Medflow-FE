import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsReferralReport, selectPatientsReferralData, selectPatientReportLoading } from '../../../store/slices/patientReportSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

export const usePatientsReferral = () => {
  const dispatch = useDispatch();
  const rawData = useSelector(selectPatientsReferralData);
  const loading = useSelector(selectPatientReportLoading);

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'this_year',
    startDate: '',
    endDate: '',
    showTrend: false
  });

  const handleApply = (filters) => {
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    setAppliedFilters({
      dateRange: 'this_year',
      startDate: '',
      endDate: '',
      showTrend: false
    });
  };

  useEffect(() => {
    if (appliedFilters.startDate && appliedFilters.endDate) {
      dispatch(fetchPatientsReferralReport({
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
        range: 'Range'
      }));
    }
  }, [dispatch, appliedFilters.startDate, appliedFilters.endDate]);

  const { summaryData, detailData, trendData } = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) {
      return { summaryData: [], detailData: {}, trendData: [] };
    }

    const sourceMap = {};
    const dateMap = {};

    rawData.forEach(item => {
      const source = item.referredBy || 'Unknown';
      const dateStr = item.date ? item.date.split('T')[0] : 'Unknown Date';
      
      // Detail data (Patients per source)
      if (!sourceMap[source]) {
        sourceMap[source] = { count: 0, patients: [] };
      }
      sourceMap[source].count += 1;
      // Map to the format needed by dialog
      sourceMap[source].patients.push({
        name: item.referred,
        phone: item.phone,
        email: item.email,
        date: dateStr
      });

      // Trend data (Counts per date per source)
      if (dateStr !== 'Unknown Date') {
        if (!dateMap[dateStr]) dateMap[dateStr] = {};
        if (!dateMap[dateStr][source]) dateMap[dateStr][source] = 0;
        dateMap[dateStr][source] += 1;
      }
    });

    const summary = Object.entries(sourceMap).map(([source, data]) => ({
      source,
      value: data.count,
      count: data.count
    })).sort((a, b) => b.count - a.count);

    const details = {};
    Object.keys(sourceMap).forEach(source => {
      details[source] = sourceMap[source].patients;
    });

    const sortedDates = Object.keys(dateMap).sort();
    const trend = sortedDates.map(date => {
      const entry = { name: date };
      Object.keys(dateMap[date]).forEach(source => {
        entry[source] = dateMap[date][source];
      });
      return entry;
    });

    return { summaryData: summary, detailData: details, trendData: trend };
  }, [rawData]);

  const handleExportCSV = () => {
    if (!summaryData.length) return;
    const headers = ['Referral Source', 'Total Referrals'];
    const rows = summaryData.map(d => [d.source, d.count]);
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Patients_Referral_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printArea = document.getElementById('referral-production-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Patients Referral Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .no-print, button, svg.MuiSvgIcon-root { display: none !important; }
            .chart-layout-wrapper { display: flex; align-items: center; justify-content: space-between; height: 450px; }
            .chart-legend-container { width: 45%; max-width: 45%; display: flex; flex-direction: column; gap: 4px; }
            .chart-pie-container { width: 55%; max-width: 55%; display: flex; justify-content: center; height: 450px; }
            .recharts-wrapper, .recharts-surface { page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Patients Referral Report</h2>
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
    summaryData,
    detailData,
    trendData,
    loading,
    appliedFilters,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  };
};
