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
    providers: 'KAR',
    duration: '60 mins',
    prefDay: 'Thurs',
    prefTime: '11:30 AM',
    procedures: 'BW4, fl, hygiene',
    aptDate: 'Apr 09, 2026',
    nextAptDate: '',
    reason: 'She is out of the country.',
  },
  {
    patient: 'Bob Johnson',
    type: 'Recare',
    providers: 'SAB',
    duration: '85 mins',
    prefDay: 'Thurs',
    prefTime: '12:35 PM',
    procedures: 'fl, Maintenance, BW4, periodic ex',
    aptDate: 'Apr 16, 2026',
    nextAptDate: '',
    reason: 'pt has a meeting and will call to resched',
  },
  {
    patient: 'Charlie Brown',
    type: 'Treatment',
    providers: 'SAB',
    duration: '135 mins',
    prefDay: 'Tues',
    prefTime: '12:45 PM',
    procedures: '#1 SRP, #17 SRP, #9 SRP, #25 SRP, URQ, ULQ, LLQ, LRQ...',
    aptDate: 'Apr 21, 2026',
    nextAptDate: '',
    reason: 'pt called saying he is going back to his old DDS office...',
  },
  {
    patient: 'Diana Prince',
    type: 'Treatment',
    providers: 'SAB',
    duration: '60 mins',
    prefDay: 'Thurs',
    prefTime: '02:00 PM',
    procedures: 'ortho',
    aptDate: 'Apr 30, 2026',
    nextAptDate: 'Sep 02, 2026',
    reason: 'will call back to resch',
  },
  {
    patient: 'Edward Norton',
    type: 'Recare',
    providers: 'KAR',
    duration: '70 mins',
    prefDay: 'Tues',
    prefTime: '09:50 AM',
    procedures: 'FMX, compex, 3d scan',
    aptDate: 'May 05, 2026',
    nextAptDate: '',
    reason: 'pt mom will cal back',
  },
];

const CancelledAppointmentsReport = () => {
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
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cancelled_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateTemplate = () => {
    alert('Create Template feature is coming soon!');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Cancelled Appointments Report:
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
                  sx: { 
                    width: 140,
                    '& .MuiInputBase-root': { 
                      height: 26, 
                      fontSize: '0.75rem',
                      backgroundColor: '#fff'
                    },
                    '& .MuiInputBase-input': { px: 1, py: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                    '& .MuiIconButton-root': { p: 0.2 }
                  } 
                },
                openPickerIcon: { sx: { fontSize: 16 } },
                desktopPaper: { sx: { transform: 'scale(0.9)', transformOrigin: 'top left' } }
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
                  sx: { 
                    width: 140,
                    '& .MuiInputBase-root': { 
                      height: 26, 
                      fontSize: '0.75rem',
                      backgroundColor: '#fff'
                    },
                    '& .MuiInputBase-input': { px: 1, py: 0 },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                    '& .MuiIconButton-root': { p: 0.2 }
                  } 
                },
                openPickerIcon: { sx: { fontSize: 16 } },
                desktopPaper: { sx: { transform: 'scale(0.9)', transformOrigin: 'top left' } }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox size="small" sx={{ p: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Show Inactive Patients</Typography>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleApply}
              sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}
            >
              Apply
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateTemplate}
              sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}
            >
              Create Template
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#e67e22', opacity: 0.3 }} />

        {/* Action Buttons Row */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleExportCSV}
            sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}
          >
            Export as CSV
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handlePrint}
            sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}
          >
            Print
          </Button>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  'Patient', 'Type', 'Providers', 'Duration', 'Pref. day', 
                  'Pref. time', 'Procedures', 'Apt. Date', 'Next Apt. Date', 'Cancellation Reason'
                ].map((header) => (
                  <TableCell 
                    key={header} 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.72rem', 
                      py: 1, 
                      px: 0.5, 
                      borderBottom: '1px solid #ddd', 
                      backgroundColor: '#fff',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc',
                    '& td': { borderBottom: '1px solid #eee' }
                  }}
                >
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.providers}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.duration}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.prefDay}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.prefTime}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5, maxWidth: 150 }}>{row.procedures}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.aptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5 }}>{row.nextAptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', py: 1, px: 0.5, maxWidth: 200, fontStyle: 'italic' }}>{row.reason}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No records found for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default CancelledAppointmentsReport;
