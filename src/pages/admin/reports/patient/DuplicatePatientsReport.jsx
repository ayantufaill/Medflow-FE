import React, { useState } from 'react';
import { TableCell, TableRow, Button } from '@mui/material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';

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

  const columns = [
    { label: 'ID' },
    { label: 'First Name' },
    { label: 'Last Name' },
    { label: 'Date of Birth' },
    { label: 'Status' },
    { label: 'Subscriber' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 4 < 2 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.firstName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.lastName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.dob}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.subscriber}</TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Duplicate Patients Report">
        <ReportFilterBar 
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={handleExportCSV}
          onPrint={handlePrint}
        />

        <ReportDataTable 
          columns={columns} 
          data={DUMMY_DATA} 
          renderRow={renderRow} 
        />
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </React.Fragment>
  );
};

export default DuplicatePatientsReport;
