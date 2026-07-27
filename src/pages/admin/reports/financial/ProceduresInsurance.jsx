import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProceduresInsuranceFilters from '../../../../components/reports/financial/ProceduresInsuranceFilters';
import ProceduresInsuranceTable from '../../../../components/reports/financial/ProceduresInsuranceTable';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { reportingService } from '../../../../services/reporting.service';

const ProceduresInsurance = () => {
  const dispatch = useDispatch();
  const rawProviders = useSelector(selectProviderDropdownList);

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [provider, setProvider] = useState('All');
  const [payerName, setPayerName] = useState('');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reportingService.getFinancialReport('procedures-insurance', {
        startDate,
        endDate
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch procedures insurance report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleFilterModeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleApply = () => {
    fetchData();
  };

  const handleClear = () => {
    setDateRange('Daily');
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setProvider('All');
    setPayerName('');
  };

  const filteredData = useMemo(() => {
    if (!payerName.trim()) return reportData;
    return reportData.filter(row => 
      row.patient?.toLowerCase().includes(payerName.toLowerCase()) || 
      row.insurance?.toLowerCase().includes(payerName.toLowerCase())
    );
  }, [reportData, payerName]);

  const handleExportCSV = () => {
    const headers = ['Code', 'Patient', 'Insurance', 'Claim Status'];
    const rows = filteredData.map(row => [
      row.code,
      row.patient,
      row.insurance,
      row.claimStatus
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Procedures_By_Insurance_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Procedures By Insurance Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; padding: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #2262ef; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Procedures By Insurance Report</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);
    printWindow.document.write('<table><thead><tr><th>Code</th><th>Patient</th><th>Insurance</th><th>Claim Status</th></tr></thead><tbody>');
    filteredData.forEach(row => {
      printWindow.document.write(`<tr><td>${row.code}</td><td>${row.patient}</td><td>${row.insurance}</td><td>${row.claimStatus}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <ReportLayout title="Procedures By Insurance Report:">
      <ProceduresInsuranceFilters
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        provider={provider}
        payerName={payerName}
        providers={providerOptions}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setProvider={setProvider}
        setPayerName={setPayerName}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={filteredData.length > 0}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : !payerName.trim() ? (
        <Box sx={{ pt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography sx={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Please enter a payer name to filter results
            </Typography>
          </Box>
        </Box>
      ) : filteredData.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available for the selected payer.
        </Typography>
      ) : (
        <ProceduresInsuranceTable data={filteredData} />
      )}
    </ReportLayout>
  );
};

export default ProceduresInsurance;

