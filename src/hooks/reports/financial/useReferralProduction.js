import { useState, useRef } from 'react';
import { reportingService } from '../../../services/reporting.service';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useReferralProduction = () => {
  const initialStartDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]; // this_year default
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'this_year',
    startDate: initialStartDate,
    endDate: initialEndDate,
    showTrend: false,
  });

  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const lastFetchedRef = useRef(null);

  const fetchData = async (filters) => {
    const { dateRange, startDate, endDate } = filters;
    const paramsKey = `${dateRange}_${startDate}_${endDate}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = dateRange.charAt(0).toUpperCase() + dateRange.slice(1);

      const res = await reportingService.getFinancialReport('referral-production', {
        date: startDate,
        range: rangeParam,
        startDate: startDate,
        endDate: endDate
      });

      // Handle structured response
      if (res && res.summary && Array.isArray(res.summary)) {
        if (res.summary.length > 0) {
          setSummaryData(res.summary);
          setDetailData(res.detail || {});
          setTrendData(res.trend || []);
          return;
        }
      }

      // Handle flat array response
      if (res && Array.isArray(res) && res.length > 0 && !res[0].description) {
        const sourceMap = {};
        const detailMap = {};

        res.forEach(r => {
          const s = r.source || r.referralSource || 'Other';
          if (!sourceMap[s]) {
            sourceMap[s] = { source: s, production: 0, count: 0 };
            detailMap[s] = [];
          }
          sourceMap[s].production += r.production || r.charge || 0;
          sourceMap[s].count += 1;

          if (r.patient || r.patientName || r.PatNum) {
            detailMap[s].push({
              id: r.PatNum || r.id || r.patientId || 0,
              name: r.patient || r.patientName || 'Unknown',
              production: r.production || r.charge || 0,
            });
          }
        });

        const groupedSummary = Object.values(sourceMap).sort((a, b) => b.production - a.production);
        setSummaryData(groupedSummary);
        setDetailData(detailMap);
        return;
      }

      // If API returns empty or success, ensure empty data is set
      setSummaryData([]);
      setDetailData({});

    } catch (err) {
      console.error('Failed to fetch referral production report:', err);
      lastFetchedRef.current = null;
      setSummaryData([]);
      setDetailData({});
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (newFilters) => {
    setAppliedFilters(newFilters);
    fetchData(newFilters);
  };

  const handleClear = () => {
    lastFetchedRef.current = null;
  };

  const handleExportCSV = () => {
    const headers = ['Referral Source', 'Count', 'Production'];
    const rows = summaryData.map(r => [
      r.source,
      r.count,
      `$${r.production.toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Referral_Production_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const contentEl = document.getElementById('referral-production-print-area');
    if (!contentEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>Referral Production Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Referral Production Report</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${contentEl.outerHTML}
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
