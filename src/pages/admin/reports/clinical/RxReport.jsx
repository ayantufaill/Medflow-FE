import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, TableRow, TableCell, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRxReport,
  selectRxData,
  selectClinicalReportLoading,
} from '../../../../store/slices/clinicalReportSlice';
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from '../../../../store/slices/providerSlice';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import medflowLogo from '../../../../assets/medflow-logo.png';

const RxReport = () => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRxData);
  const loading = useSelector(selectClinicalReportLoading);
  const providerList = useSelector(selectProviderDropdownList);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [provider, setProvider] = useState('All');

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchRxReport({ startDate, endDate }));
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  // Build provider display name helper
  const getProviderName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || '';
    const last = p.userId?.lastName || p.lastName || p.LName || '';
    return `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
  };

  // Provider dropdown options
  const providerOptions = useMemo(() => [
    { value: 'All', label: 'All' },
    ...(providerList || []).map((p) => ({
      value: getProviderName(p),
      label: getProviderName(p),
    })),
  ], [providerList]);

  // Process + filter data from Redux store
  const filteredRows = useMemo(() => {
    let rows = apiData || [];

    // Client-side provider filter — compare by provider name string
    if (provider !== 'All') {
      rows = rows.filter((r) => r.provider === provider);
    }

    return rows;
  }, [apiData, provider]);

  // Apply Filters — re-fetch from API with date params
  const handleApplyFilters = () => {
    dispatch(fetchRxReport({ startDate: startDate || undefined, endDate: endDate || undefined }));
  };

  // Export as CSV
  const handleExportCsv = () => {
    const headers = ['Rx #', 'Provider', 'Patient', 'Start Date', 'Dose', 'Refills', 'Duration', 'Long Term', 'Prints', 'Notes', 'Drug Name'];
    const csvRows = [
      headers.join(','),
      ...filteredRows.map((r) =>
        [
          r.id,
          `"${r.provider}"`,
          `"${r.patient}"`,
          r.startDate,
          `"${r.dose}"`,
          r.refills,
          `"${r.duration ?? ''}"`,
          r.longTerm,
          r.prints,
          `"${r.notes || ''}"`,
          `"${r.drugName ?? ''}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `rx_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // Print
  const handlePrint = () => {
    const printContent = document.getElementById('rx-report-print-area');
    if (!printContent) return;

    const sd = startDate || 'Start';
    const ed = endDate || 'Today';

    const htmlContent = `
      <html>
        <head>
          <title>RX Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            h6 { font-size: 16px !important; font-weight: bold !important; color: #337ab7 !important; margin: 15px 0 10px 0 !important; }
            .MuiTableContainer-root { overflow: visible !important; max-height: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">RX Report</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${sd} to ${ed}</p>
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

  const columns = [
    { label: 'Rx #' },
    { label: 'Provider' },
    { label: 'Patient' },
    { label: 'Start Date' },
    { label: 'Dose' },
    { label: 'Refills' },
    { label: 'Duration' },
    { label: 'Long Term' },
    { label: 'Prints' },
    { label: 'Notes' },
    { label: 'Drug Name' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={row.id} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.startDate}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.dose ?? '\u2014'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.refills ?? '\u2014'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.duration ?? '\u2014'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.longTerm ?? '\u2014'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.prints ?? '\u2014'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.notes}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.drugName ?? '\u2014'}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          from date
        </Typography>
        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '135px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '36px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          to date
        </Typography>
        <DatePicker
          value={endDate ? dayjs(endDate) : null}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '135px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '36px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
      <ReportSelect
        label="PROVIDER"
        options={providerOptions}
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        width="160px"
      />
    </LocalizationProvider>
  );

  return (
    <ReportLayout title="RX Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={handleApplyFilters}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
          ({filteredRows.length} Record/s)
        </Typography>
        <Box sx={{ transform: 'translateY(-8px)' }}>
          <ProductionReportActions
            onExportCsv={handleExportCsv}
            onPrint={handlePrint}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box id="rx-report-print-area">
          <ReportDataTable 
            columns={columns} 
            data={filteredRows} 
            renderRow={renderRow}
            emptyMessage="No prescriptions found for the selected date range" 
          />
        </Box>
      )}
    </ReportLayout>
  );
};

export default RxReport;
