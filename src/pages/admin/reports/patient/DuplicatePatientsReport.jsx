import React, { useState } from 'react';
import { TableCell, TableRow, CircularProgress, Box } from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';
import { useDuplicatePatientsReport } from '../../../../hooks/reports/patient/useDuplicatePatientsReport';

const DuplicatePatientsReport = () => {
  const { reportData, loading, handleExportCSV, handlePrint } = useDuplicatePatientsReport();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

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
          <div id="duplicate-patients-print-area">
            <ReportDataTable 
              columns={columns} 
              data={reportData} 
              renderRow={renderRow} 
            />
          </div>
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
