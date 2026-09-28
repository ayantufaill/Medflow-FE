import React, { useState, useEffect } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginReport } from '../../../../store/slices/othersReportSlice';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import LoginReportFilters from '../../../../components/reports/others/LoginReportFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { exportToCSV } from '../../../../utils/exportUtils';
import medflowLogo from '../../../../assets/medflow-logo.png';
import dayjs from 'dayjs';

const LoginReport = () => {
  const dispatch = useDispatch();
  const { loginData, loading } = useSelector((state) => state.othersReport);

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReportData = () => {
    dispatch(fetchLoginReport({
      startDate,
      endDate,
      range: dateRange,
      searchQuery: searchQuery || undefined,
    }));
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleApply = () => {
    fetchReportData();
  };

  const handleClear = () => {
    setDateRange('Daily');
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    setSearchQuery('');
    setTimeout(() => {
      dispatch(fetchLoginReport({
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        range: 'Daily',
      }));
    }, 0);
  };

  const columns = [
    { label: 'Username' },
    { label: 'Login date' },
    { label: 'Login status' },
    { label: 'IP address' },
    { label: 'Machine info' }
  ];

  const filteredData = (loginData || []).filter(row => {
    if (searchQuery && !row.username?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    exportToCSV(filteredData, [
      { header: 'Username', key: (row) => row.username || 'Unknown' },
      { header: 'Login date', key: (row) => row.date || (row.createdAt ? dayjs(row.createdAt).format('MM/DD/YYYY h:mm A') : 'N/A') },
      { header: 'Login status', key: (row) => row.status || 'Success' },
      { header: 'IP address', key: (row) => row.ip || 'N/A' },
      { header: 'Machine info', key: (row) => row.machine || row.userAgent || 'N/A' },
    ], 'Login_Report');
  };

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600 }}>{row.username || 'Unknown'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.date || (row.createdAt ? dayjs(row.createdAt).format('MM/DD/YYYY h:mm A') : 'N/A')}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Success' ? '#166534' : '#d93025', fontWeight: 500 }}>{row.status || 'Success'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.ip || 'N/A'}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', maxWidth: 400, wordBreak: 'break-all', color: '#666' }}>{row.machine || row.userAgent || 'N/A'}</TableCell>
    </TableRow>
  );

  const handlePrint = () => {
    const printArea = document.getElementById('login-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Login Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Login Report</h2>
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

  return (
    <ReportLayout title="Login Report:">
      <LoginReportFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        searchQuery={searchQuery}
        setDateRange={setDateRange}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSearchQuery={setSearchQuery}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCsv}
        onPrint={handlePrint} 
      />

      <div id="login-print-area">
        <ReportDataTable 
          columns={columns} 
          data={filteredData} 
          renderRow={renderRow} 
          loading={loading}
          emptyMessage="No login logs found for this date range"
        />
      </div>
    </ReportLayout>
  );
};

export default LoginReport;

