import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Divider,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DUMMY_DATA = [
  { 
    patient: 'Alice Smith (59)', 
    trackerName: 'UI with Dr. Miller', 
    startDate: 'May 12, 2026', 
    endDate: 'Jun 15, 2026', 
    duration: '34 days', 
    description: 'Having #12-15 + Impacted #11 EXT. Need full photo series, tx plan, wax up ready for her.', 
    status: 'On Track', 
    createdBy: 'C. Yasi Sabour on May 07, 2026', 
    completedBy: '--', 
    deletedBy: '--' 
  },
];

const PatientTrackersReport = () => {
  const [startDate, setStartDate] = useState(dayjs('2026-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2027-01-01'));
  const [createdBy, setCreatedBy] = useState('all');
  const [status, setStatus] = useState('all');

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Patient Trackers Report:
        </Typography>

        {/* Filter Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Filter by Patient:</Typography>
            <TextField 
              placeholder="Search patient"
              variant="standard"
              size="small"
              sx={{ width: 180, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Created By:</Typography>
            <Select 
              variant="standard"
              size="small" 
              value={createdBy} 
              onChange={(e) => setCreatedBy(e.target.value)}
              sx={{ fontSize: '0.75rem', width: 140, height: 24 }}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Start Date:</Typography>
              <DatePicker
                value={startDate}
                onChange={(v) => setStartDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>End Date:</Typography>
              <DatePicker
                value={endDate}
                onChange={(v) => setEndDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Status:</Typography>
            <Select 
              variant="standard"
              size="small" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              sx={{ fontSize: '0.75rem', width: 120, height: 24 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="ontrack">On Track</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Apply</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Create Template</Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button variant="contained" size="small" onClick={handleExport} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}>Print</Button>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Patient', 'Tracker Name', 'Start Date', 'End Date', 'Duration', 'Description', 'Status', 'Created By', 'Completed By', 'Deleted By'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.trackerName}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.startDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.endDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', maxWidth: 300, whiteSpace: 'normal' }}>{row.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.createdBy}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.completedBy}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.deletedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default PatientTrackersReport;
