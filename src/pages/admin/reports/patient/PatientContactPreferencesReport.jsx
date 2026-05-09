import React from 'react';
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
} from '@mui/material';
import dayjs from 'dayjs';

const DUMMY_DATA = [
  { firstName: 'Sarah', lastName: 'Miller', email: 'sarah.m@gmail.com', phone: '+1 234 567 8901', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'James', lastName: 'Wilson', email: 'j.wilson@yahoo.com', phone: '+1 234 567 8902', text: 'Yes', emailPerm: 'Yes', review: 'No' },
  { firstName: 'Mary', lastName: 'Davis', email: 'maryd@outlook.com', phone: '+1 234 567 8903', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', phone: '+1 234 567 8904', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'Jane', lastName: 'Smith', email: 'jsmith@health.org', phone: '+1 234 567 8905', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'Robert', lastName: 'Brown', email: 'rbrown@tech.net', phone: '+1 234 567 8906', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
];

const PatientContactPreferencesReport = () => {
  const handlePrint = () => window.print();
  
  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Permission to Text', 'Permission to Email', 'Request Review'];
    const csvRows = [
      headers.join(','),
      ...DUMMY_DATA.map((row) =>
        [row.firstName, row.lastName, row.email, row.phone, row.text, row.emailPerm, row.review].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contact_preferences_${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Patient By Contact Preferences Report:
      </Typography>

      {/* Action Buttons */}
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
          sx={{ textTransform: 'none', backgroundColor: '#ff5252', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['First Name', 'Last Name', 'Email', 'Phone Number', 'Permission to Text', 'Permission to Email', 'Request Review'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_DATA.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.firstName}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.lastName}</TableCell>
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
  );
};

export default PatientContactPreferencesReport;
