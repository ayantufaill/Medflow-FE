import React, { useState, useEffect } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginReport } from '../../../../store/slices/othersReportSlice';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import LoginReportFilters from '../../../../components/reports/others/LoginReportFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { exportToCSV } from '../../../../utils/exportUtils';
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
        onPrint={() => window.print()} 
      />

      <ReportDataTable 
        columns={columns} 
        data={filteredData} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No login logs found for this date range"
      />
    </ReportLayout>
  );
};

export default LoginReport;

