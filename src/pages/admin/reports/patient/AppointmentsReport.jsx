import React, { useState, useEffect } from 'react';
import { Box, Typography, TableCell, TableRow, CircularProgress, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import AppointmentsFilters from '../../../../components/reports/patient/AppointmentsFilters';
import { useAppointmentsReport } from '../../../../hooks/reports/patient/useAppointmentsReport';
import { fetchAllProvidersForDropdown } from '../../../../store/slices/providerSlice';

const AppointmentsReport = () => {
  const dispatch = useDispatch();
  const {
    reportData,
    loading,
    handleApply,
    handleExportCSV,
    handlePrint
  } = useAppointmentsReport();

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const columns = [
    { label: 'Patient' },
    { label: 'Flags' },
    { label: 'Type' },
    { label: 'Status' },
    { label: 'Providers' },
    { label: 'Operatory' },
    { label: 'Apt. Date' },
    { label: 'Time' },
    { label: 'Duration' },
    { label: 'Procedures' },
    { label: 'Next Apt. Date' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {Array.isArray(row.flags) && row.flags.map((flag, idx) => {
            const flagObj = typeof flag === 'object' ? flag : { name: String(flag), color: '#3b82f6' };
            return (
              <Tooltip title={flagObj.name || flagObj.label || 'Flag'} key={idx}>
                <div 
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    backgroundColor: flagObj.color || '#cccccc', 
                    borderRadius: '3px',
                    display: 'inline-block',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }} 
                />
              </Tooltip>
            );
          })}
        </div>
      </TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.providers}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.operatory}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.aptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.time}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', maxWidth: 150 }}>{row.procedures}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAptDate}</TableCell>
    </TableRow>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Appointments Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <AppointmentsFilters 
              onApplyFilters={handleApply}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of appointments = {reportData ? reportData.length : 0})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={handleExportCSV}
                onPrint={handlePrint}
                hasData={reportData && reportData.length > 0}
              />
            </Box>
          </Box>

          <Box id="appointments-print-area">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ReportDataTable 
                columns={columns} 
                data={reportData || []} 
                renderRow={renderRow} 
              />
            )}
          </Box>
        </ReportLayout>

        <CreateTemplateDialog 
          open={templateDialogOpen} 
          onClose={() => setTemplateDialogOpen(false)} 
          onSave={(name) => alert(`Template "${name}" saved!`)} 
        />
      </React.Fragment>
    </LocalizationProvider>
  );
};

export default AppointmentsReport;
