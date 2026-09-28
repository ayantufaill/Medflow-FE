import React, { useState } from 'react';
import { Box, Typography, TableCell, TableRow, CircularProgress } from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import PatientFlagsFilters from '../../../../components/reports/patient/PatientFlagsFilters';
import { usePatientFlagsReport } from '../../../../hooks/reports/patient/usePatientFlagsReport';
import { useSelector } from 'react-redux';
import { selectPracticeInfo } from '../../../../store/slices/practiceInfoSlice';
import Tooltip from '@mui/material/Tooltip';

const PatientFlagsReport = () => {
  const {
    reportData,
    loading,
    showData,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = usePatientFlagsReport();

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Flags' },
    { label: 'Last Appointment' },
  ];

  const getFlagColor = (flagName) => {
    const found = globalFlags.find(f => (f.name || '').toLowerCase() === (flagName || '').toLowerCase());
    return found ? found.color : '#ccc';
  };

  const renderRow = (row, index) => {
    const flagNames = Array.isArray(row.flags) ? row.flags : (row.flags ? row.flags.split(',').map(f => f.trim()) : []);
    
    return (
      <TableRow 
        key={index} 
        hover
        sx={{ 
          '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
          '&:hover': { backgroundColor: '#f1f5f9' }
        }}
      >
        <TableCell>{row.number}</TableCell>
        <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.patient}</TableCell>
        <TableCell>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {flagNames.map((flagName, i) => (
              <Tooltip title={flagName} key={i}>
                <div 
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    backgroundColor: getFlagColor(flagName), 
                    borderRadius: '3px',
                    display: 'inline-block',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }} 
                />
              </Tooltip>
            ))}
          </div>
        </TableCell>
        <TableCell>{row.lastAppointment}</TableCell>
      </TableRow>
    );
  };

  return (
    <React.Fragment>
      <ReportLayout title="Patient Flags Report:">
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <PatientFlagsFilters 
            onApplyFilters={handleApply}
            onClearAll={handleClear}
            onCreateTemplate={() => setTemplateDialogOpen(true)}
          />
        </Box>

        {/* Summary Text and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
            (number of patients = {showData ? reportData.length : 0})
          </Typography>
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={handleExportCSV}
              onPrint={handlePrint}
              hasData={showData && reportData.length > 0}
            />
          </Box>
        </Box>

        <Box id="patient-flags-print-area">
          {!showData ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body2" color="text.secondary">
                Please select which flags you would like to include/exclude, then click on "apply filters"
              </Typography>
            </Box>
          ) : loading ? (
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
        </Box>
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </React.Fragment>
  );
};

export default PatientFlagsReport;
