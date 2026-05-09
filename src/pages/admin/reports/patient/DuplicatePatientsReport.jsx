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
} from '@mui/material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  { id: '1049', firstName: 'Sarah', lastName: 'Miller', dob: 'Feb 03, 1983', status: 'Inactive', subscriber: 'False' },
  { id: '1071', firstName: 'Sarah', lastName: 'Miller', dob: 'Feb 03, 1983', status: 'Inactive', subscriber: 'False' },
  { id: '997', firstName: 'James', lastName: 'Wilson', dob: 'Feb 23, 1984', status: 'Active', subscriber: 'False' },
  { id: '998', firstName: 'James', lastName: 'Wilson', dob: 'Feb 23, 1984', status: 'Inactive', subscriber: 'True' },
  { id: '252', firstName: 'Mary', lastName: 'Davis', dob: 'Sep 16, 1968', status: 'Inactive', subscriber: 'False' },
  { id: '253', firstName: 'Mary', lastName: 'Davis', dob: 'Sep 16, 1968', status: 'Active', subscriber: 'False' },
  { id: '1024', firstName: 'John', lastName: 'Doe', dob: 'Sep 07, 1994', status: 'Active', subscriber: 'False' },
  { id: '1025', firstName: 'John', lastName: 'Doe', dob: 'Sep 07, 1994', status: 'Inactive', subscriber: 'False' },
];

const DuplicatePatientsReport = () => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  const handlePrint = () => window.print();
  
  const handleExportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Status', 'Subscriber'];
    const csvRows = [
      headers.join(','),
      ...DUMMY_DATA.map((row) =>
        [row.id, row.firstName, row.lastName, row.dob, row.status, row.subscriber].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `duplicate_patients_${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Duplicate Patients Report:
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setTemplateDialogOpen(true)}
          sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Create Template
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleExportCSV}
          sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handlePrint}
          sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['ID', 'First Name', 'Last Name', 'Date of Birth', 'Status', 'Subscriber'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_DATA.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 4 < 2 ? '#fff' : '#fcfcfc' }}>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.firstName}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.lastName}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.dob}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.subscriber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default DuplicatePatientsReport;
