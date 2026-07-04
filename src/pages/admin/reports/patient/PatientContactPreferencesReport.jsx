import React, { useState } from 'react';
import { TableCell, TableRow, Button } from '@mui/material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { firstName: 'Sarah', lastName: 'Miller', email: 'sarah.m@gmail.com', phone: '+1 234 567 8901', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'James', lastName: 'Wilson', email: 'j.wilson@yahoo.com', phone: '+1 234 567 8902', text: 'Yes', emailPerm: 'Yes', review: 'No' },
  { firstName: 'Mary', lastName: 'Davis', email: 'maryd@outlook.com', phone: '+1 234 567 8903', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', phone: '+1 234 567 8904', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'Jane', lastName: 'Smith', email: 'jsmith@health.org', phone: '+1 234 567 8905', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
  { firstName: 'Robert', lastName: 'Brown', email: 'rbrown@tech.net', phone: '+1 234 567 8906', text: 'Yes', emailPerm: 'Yes', review: 'Yes' },
];

const PatientContactPreferencesReport = () => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

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

  const columns = [
    { label: 'First Name' },
    { label: 'Last Name' },
    { label: 'Email' },
    { label: 'Phone Number' },
    { label: 'Permission to Text' },
    { label: 'Permission to Email' },
    { label: 'Request Review' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.firstName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.lastName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.email}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.phone}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.text}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.emailPerm}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.review}</TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient By Contact Preferences Report">
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

export default PatientContactPreferencesReport;
