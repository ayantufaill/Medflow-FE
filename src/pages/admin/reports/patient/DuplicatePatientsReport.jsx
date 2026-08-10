import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Button, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';
import { fetchDuplicatePatientsReport, selectDuplicatePatientsData, selectDuplicatePatientsDataLoading } from '../../../../store/slices/patientReportSlice';



const DuplicatePatientsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectDuplicatePatientsData) || [];
  const loading = useSelector(selectDuplicatePatientsDataLoading);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchDuplicatePatientsReport());
  }, [dispatch]);

  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  const handlePrint = () => window.print();
  
  const handleExportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Status', 'Subscriber'];
    const csvRows = [
      headers.join(','),
      ...reportData.map((row) =>
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

export default DuplicatePatientsReport;
