import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const DUMMY_DATA = [
  {
    patient: 'Alice Smith',
    type: 'Recare',
    providers: 'SAB',
    duration: '70 mins',
    prefDay: 'Thurs',
    prefTime: '09:30 AM',
    procedures: 'BW4, hygiene, fl, PA1, compex, PAadd...',
    aptDate: 'Apr 23, 2026',
    nextAptDate: '',
    reason: 'No show - please take deposit next time scheduling. KMH',
  },
  {
    patient: 'Bob Johnson',
    type: 'Recare',
    providers: 'SAB',
    duration: '85 mins',
    prefDay: 'Thurs',
    prefTime: '08:15 AM',
    procedures: 'FMX, compex, 3d scan',
    aptDate: 'Apr 23, 2026',
    nextAptDate: '',
    reason: 'no show please take deposit yf',
  },
  {
    patient: 'Charlie Brown',
    type: 'Treatment',
    providers: 'SAB',
    duration: '60 mins',
    prefDay: 'Tues',
    prefTime: '12:30 PM',
    procedures: '',
    aptDate: 'May 05, 2026',
    nextAptDate: '',
    reason: '',
  },
];

const NoShowAppointmentsReport = () => {
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [data, setData] = useState(DUMMY_DATA);

  const handleApply = () => {
    if (!startDate || !endDate) return;
    const filtered = DUMMY_DATA.filter((item) => {
      const itemDate = dayjs(item.aptDate, 'MMM DD, YYYY');
      if (!itemDate.isValid()) return false;
      return (
        (itemDate.isSame(startDate, 'day') || itemDate.isAfter(startDate, 'day')) &&
        (itemDate.isSame(endDate, 'day') || itemDate.isBefore(endDate, 'day'))
      );
    });
    setData(filtered);
  };

  const handleExportCSV = () => {
    const headers = [
      'Patient', 'Type', 'Providers', 'Duration', 'Pref. day', 
      'Pref. time', 'Procedures', 'Apt. Date', 'Next Apt. Date', 'Cancellation Reason'
    ];
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        [
          `"${row.patient}"`,
          row.type,
          row.providers,
          row.duration,
          row.prefDay,
          row.prefTime,
          `"${row.procedures}"`,
          row.aptDate,
          row.nextAptDate,
          `"${row.reason.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `noshow_appointments_${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
  };

  const handlePrint = () => window.print();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          NoShow Appointments Report:
        </Typography>

        {/* Filter Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Start Date:</Typography>
            <DatePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              format="MM/DD/YYYY"
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem' }, '& .MuiInputBase-input': { px: 1, py: 0 } } 
                },
                openPickerIcon: { sx: { fontSize: 16 } }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>End Date:</Typography>
            <DatePicker
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              format="MM/DD/YYYY"
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem' }, '& .MuiInputBase-input': { px: 1, py: 0 } } 
                },
                openPickerIcon: { sx: { fontSize: 16 } }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox size="small" sx={{ p: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Show Inactive Patients</Typography>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={handleApply} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>
              Apply
            </Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}>
              Create Template
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#e67e22', opacity: 0.3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>
            Export as CSV
          </Button>
          <Button variant="contained" size="small" onClick={handlePrint} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}>
            Print
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Patient', 'Type', 'Providers', 'Duration', 'Pref. day', 'Pref. time', 'Procedures', 'Apt. Date', 'Next Apt. Date', 'Cancellation Reason'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', backgroundColor: '#fff', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.providers}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.prefDay}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.prefTime}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', maxWidth: 150 }}>{row.procedures}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.aptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', maxWidth: 200, fontStyle: 'italic' }}>{row.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default NoShowAppointmentsReport;
