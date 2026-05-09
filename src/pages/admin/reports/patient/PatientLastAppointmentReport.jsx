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
  Select,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DUMMY_DATA = [
  { id: '254', patient: 'Alice Smith', status: 'Active', apptDate: 'Jul 03, 2025', type: 'Recare', apptStatus: 'CheckedoutCompleted', nextAppt: '', newPatient: 'No', provider: 'Christina Sabour', email: 'alice@example.com', phone: '123-456-7890', text: 'Yes', emailPerm: 'Yes', review: 'No' },
  { id: '770', patient: 'Bob Johnson', status: 'Active', apptDate: 'Sep 16, 2025', type: 'Treatment', apptStatus: 'Cancelled', nextAppt: '', newPatient: 'No', provider: 'Christina Sabour', email: 'bob@example.com', phone: '123-456-7891', text: 'Yes', emailPerm: 'No', review: 'No' },
  { id: '192', patient: 'Charlie Brown', status: 'Active', apptDate: 'Feb 17, 2026', type: 'Treatment', apptStatus: 'CheckedoutCompleted', nextAppt: 'Jul 21, 2026', newPatient: 'No', provider: 'Christina Sabour', email: 'charlie@example.com', phone: '123-456-7892', text: 'Yes', emailPerm: 'Yes', review: 'No' },
  { id: '1137', patient: 'David Lee', status: 'Active', apptDate: 'Dec 16, 2025', type: 'Recare', apptStatus: 'Unconfirmed', nextAppt: '', newPatient: 'Yes', provider: 'Temporary', email: 'david@example.com', phone: '123-456-7893', text: 'Yes', emailPerm: 'Yes', review: 'No' },
];

const PatientLastAppointmentReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Patient By Last Appointment Report:
        </Typography>

        {/* Filter Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Start Date:</Typography>
              <DatePicker
                value={startDate}
                onChange={(v) => setStartDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
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
                  textField: { variant: 'standard', size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600 }}>Filter Report By:</Typography>
            <Select size="small" defaultValue="active" sx={{ height: 26, fontSize: '0.75rem', minWidth: 140 }}>
              <MenuItem value="active">Active Patients Only</MenuItem>
            </Select>
            <Select size="small" defaultValue="all" sx={{ height: 26, fontSize: '0.75rem', minWidth: 120 }}>
              <MenuItem value="all">All Providers</MenuItem>
            </Select>
            <Select size="small" defaultValue="all" sx={{ height: 26, fontSize: '0.75rem', minWidth: 160 }}>
              <MenuItem value="all">All Appointment Status</MenuItem>
            </Select>

            <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600, ml: 2 }}>Sort Report By:</Typography>
            <Select size="small" defaultValue="default" sx={{ height: 26, fontSize: '0.75rem', minWidth: 100 }}>
              <MenuItem value="default">Default</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox size="small" sx={{ p: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Show Flags in Report</Typography>
            </Box>
            <Select size="small" defaultValue="all" sx={{ height: 26, fontSize: '0.75rem', minWidth: 180 }}>
              <MenuItem value="all">Pts With Or Without Flags</MenuItem>
            </Select>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#ff5252', fontSize: '0.75rem', boxShadow: 'none' }}>Print</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>Export as CSV</Button>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>Patient Count:547</Typography>

        {/* Table Section */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={9} sx={{ borderBottom: 'none', p: 0 }} />
                <TableCell colSpan={5} align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5, borderBottom: '1px solid #ddd' }}>Patient Contact Preferences</TableCell>
              </TableRow>
              <TableRow>
                {['ID', 'Patient', 'Patient Status', 'Appt Date', 'Appt Type', 'Appt Status', 'Next Appt Date', 'New Patient Appt', 'Provider'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
                {['Email', 'Phone Number', 'Permission to Text', 'Permission to Email', 'Request Review'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptStatus}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAppt}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.newPatient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.email}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.phone}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.text}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.emailPerm}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.review}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default PatientLastAppointmentReport;
