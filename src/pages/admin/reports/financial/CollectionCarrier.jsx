import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CollectionCarrierFilters from '../../../../components/reports/financial/CollectionCarrierFilters';
import CollectionCarrierTable from '../../../../components/reports/financial/CollectionCarrierTable';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { reportingService } from '../../../../services/reporting.service';
import medflowLogo from '../../../../assets/medflow-logo.png';

const CollectionCarrier = () => {
  const dispatch = useDispatch();
  const rawProviders = useSelector(selectProviderDropdownList);

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [provider, setProvider] = useState('All');
  const [networkFilter, setNetworkFilter] = useState('None');
  const [payerFilter, setPayerFilter] = useState('Payer');
  const [payerText, setPayerText] = useState('');
  const [planText, setPlanText] = useState('');

  const [rawReportData, setRawReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('collection-carrier', {
        startDate,
        endDate,
        provider: provider !== 'All' ? provider : undefined,
        payer: payerFilter === 'Payer' && payerText.trim() ? payerText : undefined,
        plan: payerFilter === 'Plan' && planText.trim() ? planText : undefined,
        network: networkFilter !== 'None' ? networkFilter : undefined
      });
      setRawReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch collection carrier report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const providerOptions = useMemo(() => {
    return [
      { value: 'All', label: 'All' },
      ...rawProviders.map(p => {
        const name = (p?.userId?.firstName || p?.userId?.lastName)
          ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim()
          : `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.name || 'Unknown';
        return {
          value: String(p._id || p.id),
          label: name
        };
      })
    ];
  }, [rawProviders]);

  const applyModeDates = (mode) => {
    const today = new Date();
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const m = mode.toLowerCase();
    if (m === 'daily') {
      const todayStr = getLocalDateString(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (m === 'weekly' || m === 'this_week') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      setStartDate(getLocalDateString(startOfWeek));
      setEndDate(getLocalDateString(endOfWeek));
    } else if (m === 'monthly' || m === 'this_month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(getLocalDateString(startOfMonth));
      setEndDate(getLocalDateString(endOfMonth));
    } else if (m === 'last_7_days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      setStartDate(getLocalDateString(start));
      setEndDate(getLocalDateString(today));
    } else if (m === 'last_month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      setStartDate(getLocalDateString(startOfMonth));
      setEndDate(getLocalDateString(endOfMonth));
    } else if (m === 'year_to_date') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      setStartDate(getLocalDateString(startOfYear));
      setEndDate(getLocalDateString(today));
    } else if (m === 'range') {
      setEndDate(getLocalDateString(today));
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      setStartDate(getLocalDateString(lastMonth));
    }
  };

  const handleFilterModeChange = (e) => {
    setDateRange(e.target.value);
    applyModeDates(e.target.value);
  };

  const handleApply = () => {
    fetchData();
  };

  const handleClear = () => {
    setNetworkFilter('None');
    setPayerFilter('Payer');
    setDateRange('Daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setProvider('All');
    setPayerText('');
    setPlanText('');
  };

  const filteredCarriers = useMemo(() => {
    return rawReportData;
  }, [rawReportData]);

  const handleExportCSV = () => {
    const headers = ['Carrier / Patient', 'Collection', 'Production', 'Write-off'];
    const rows = [];

    filteredCarriers.forEach(carrier => {
      // Carrier summary row
      rows.push([
        carrier.name.toUpperCase(),
        carrier.collection,
        carrier.production,
        carrier.writeoff
      ]);

      // Patient rows
      carrier.patients.forEach(p => {
        rows.push([
          `  ${p.name}`,
          p.collection,
          p.production,
          p.writeoff
        ]);
      });

      // Blank spacing row
      rows.push(['', '', '', '']);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Collection_Per_Carrier_Report_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('collection-carrier-print-area');
    if (!printContent) return;

    const htmlContent = `
      <html>
        <head>
          <title>Collection Per Carrier Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Collection Per Carrier Report</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${startDate} to ${endDate}</p>
          <p style="text-align: center; margin-bottom: 20px;">Provider: ${providerOptions.find(p => p.value === String(provider))?.label || 'All'}</p>
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
    <ReportLayout title="Collection Per Carrier Report:">
      <CollectionCarrierFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilterModeChange={handleFilterModeChange}
        networkFilter={networkFilter}
        setNetworkFilter={setNetworkFilter}
        payerFilter={payerFilter}
        setPayerFilter={setPayerFilter}
        payerText={payerText}
        setPayerText={setPayerText}
        planText={planText}
        setPlanText={setPlanText}
        provider={provider}
        setProvider={setProvider}
        providers={providerOptions}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={filteredCarriers.length > 0}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : filteredCarriers.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available for the selected filters.
        </Typography>
      ) : (
        <Box id="collection-carrier-print-area">
                <CollectionCarrierTable carriers={filteredCarriers} />
              </Box>
      )}
    </ReportLayout>
  );
};

export default CollectionCarrier;
