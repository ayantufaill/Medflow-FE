import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Button, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';
import { fetchPatientContactPreferencesReport, selectContactPreferencesData, selectContactPreferencesDataLoading } from '../../../../store/slices/patientReportSlice';



const PatientContactPreferencesReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectContactPreferencesData) || [];
  const loading = useSelector(selectContactPreferencesDataLoading);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientContactPreferencesReport());
  }, [dispatch]);

  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  const handlePrint = () => window.print();
  
  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Permission to Text', 'Permission to Email', 'Request Review'];
    const csvRows = [
      headers.join(','),
      ...reportData.map((row) =>
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReportDataTable 
            columns={columns} 
            data={reportData} 
            renderRow={renderRow} 
          />
        )}
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
