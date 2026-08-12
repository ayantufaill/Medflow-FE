import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow, CircularProgress, TextField, Autocomplete
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable, ReportDivider } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchPatientFlagsReport, selectPatientFlagsReportData, selectPatientFlagsReportDataLoading } from '../../../../store/slices/patientReportSlice';
import { fetchCurrentPracticeInfo, selectPracticeInfo } from '../../../../store/slices/practiceInfoSlice';



const PatientFlagsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectPatientFlagsReportData) || [];
  const loading = useSelector(selectPatientFlagsReportDataLoading);

  const [filterBy, setFilterBy] = useState('active');
  const [includeFlags, setIncludeFlags] = useState([]);
  const [excludeFlags, setExcludeFlags] = useState([]);
  const [showData, setShowData] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const practiceInfo = useSelector(selectPracticeInfo);
  
  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  const allFlags = practiceInfo?.patientFlags || [];

  const fetchReport = () => {
    dispatch(fetchPatientFlagsReport({ 
      filterBy, 
      includeFlags: includeFlags.map(f => f.name).join(','), 
      excludeFlags: excludeFlags.map(f => f.name).join(',') 
    }));
    setShowData(true);
  };

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Flags' },
    { label: 'Last Appointment' },
  ];

  const renderRow = (row, index) => (
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
      <TableCell>{row.flags}</TableCell>
      <TableCell>{row.lastAppointment}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="Active Patients Only" 
        prefix="Filter Report By" 
        value={filterBy} 
        onChange={(e) => setFilterBy(e.target.value)} 
        options={[
          { value: 'active', label: 'Active Patients Only' },
          { value: 'all', label: 'All Patients' },
          { value: 'inactive', label: 'Inactive Patients Only' }
        ]} 
        width="180px"
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Including Flags:</Typography>
        <Autocomplete
          multiple
          size="small"
          options={allFlags}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.name}
          value={includeFlags}
          onChange={(e, newValue) => setIncludeFlags(newValue)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Select flags" 
              sx={{ 
                width: '250px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                },
                '& fieldset': { borderColor: '#e2e8f0' }
              }}
            />
          )}
        />
      </Box>

      <ReportDivider />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Excluding Flags:</Typography>
        <Autocomplete
          multiple
          size="small"
          options={allFlags}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.name}
          value={excludeFlags}
          onChange={(e, newValue) => setExcludeFlags(newValue)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Select flags" 
              sx={{ 
                width: '250px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                },
                '& fieldset': { borderColor: '#e2e8f0' }
              }}
            />
          )}
        />
      </Box>
    </>
  );



  return (
    <React.Fragment>
      <ReportLayout title="Patient Flags Report:">
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <ReportFilterBar 
            topRowFilters={topFilters}
            onApplyFilters={fetchReport}
            onClearAll={() => { setFilterBy('active'); setIncludeFlags([]); setExcludeFlags([]); setShowData(false); }}
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
              onExportCsv={() => alert('Exporting CSV...')}
              onPrint={() => window.print()}
              hasData={showData && reportData.length > 0}
            />
          </Box>
        </Box>

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
