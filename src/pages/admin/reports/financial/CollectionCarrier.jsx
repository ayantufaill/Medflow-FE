import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CollectionCarrierFilters from '../../../../components/reports/financial/CollectionCarrierFilters';
import CollectionCarrierTable from '../../../../components/reports/financial/CollectionCarrierTable';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { reportingService } from '../../../../services/reporting.service';

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
        endDate
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
  }, [startDate, endDate]);

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

  const handleFilterModeChange = (e) => {
    setDateRange(e.target.value);
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
    let list = rawReportData;

    // Filter by network
    if (networkFilter === 'In') {
      list = list.filter(c => ['cigna', 'delta dental', 'blue cross'].some(n => c.name.toLowerCase().includes(n)));
    } else if (networkFilter === 'Out') {
      list = list.filter(c => !['cigna', 'delta dental', 'blue cross'].some(n => c.name.toLowerCase().includes(n)));
    }

    // Filter by Payer
    if (payerFilter === 'Payer' && payerText.trim() !== '') {
      const q = payerText.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    // Filter by Plan
    if (payerFilter === 'Plan' && planText.trim() !== '') {
      const q = planText.toLowerCase();
      list = list.map(c => {
        if (c.name.toLowerCase().includes(q)) return c;
        const filteredPats = c.patients.filter(p => p.name.toLowerCase().includes(q));
        if (filteredPats.length > 0) {
          return { ...c, patients: filteredPats };
        }
        return null;
      }).filter(Boolean);
    }

    return list;
  }, [rawReportData, networkFilter, payerFilter, payerText, planText]);

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
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Collection Per Carrier Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('.summary-box { display: flex; gap: 20px; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px; font-size: 11px; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Collection Per Carrier Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);

    filteredCarriers.forEach(carrier => {
      printWindow.document.write(`<h3>${carrier.name}</h3>`);
      printWindow.document.write(`
        <div class="summary-box">
          <span><strong>Total Collection:</strong> ${carrier.collection}</span>
          <span><strong>Total Production:</strong> ${carrier.production}</span>
          <span><strong>Total Write-off:</strong> ${carrier.writeoff}</span>
        </div>
      `);
      printWindow.document.write('<table><thead><tr><th>Patient</th><th>Collection</th><th>Production</th><th>Write-off</th></tr></thead><tbody>');
      carrier.patients.forEach(p => {
        printWindow.document.write(`<tr><td>${p.name}</td><td>${p.collection}</td><td>${p.production}</td><td>${p.writeoff}</td></tr>`);
      });
      printWindow.document.write('</tbody></table>');
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
        <CollectionCarrierTable carriers={filteredCarriers} />
      )}
    </ReportLayout>
  );
};

export default CollectionCarrier;
