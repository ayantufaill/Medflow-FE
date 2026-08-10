import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TextField, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientTrackersReport, selectPatientTrackersData, selectPatientTrackersDataLoading } from '../../../../store/slices/patientReportSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';



const PatientTrackersReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectPatientTrackersData) || [];
  const loading = useSelector(selectPatientTrackersDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2027-01-01'));
  const [patientSearch, setPatientSearch] = useState('');
  const [createdBy, setCreatedBy] = useState('all');
  const [status, setStatus] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchPatientTrackersReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      patientSearch,
      createdBy,
      status
    }));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchPatientTrackersReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      patientSearch,
      createdBy,
      status
    }));
  };

  const columns = [
    { label: 'Patient' },
    { label: 'Tracker Name' },
    { label: 'Start Date' },
    { label: 'End Date' },
    { label: 'Duration' },
    { label: 'Description' },
    { label: 'Status' },
    { label: 'Created By' },
    { label: 'Completed By' },
    { label: 'Deleted By' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.trackerName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.startDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.endDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', maxWidth: 300, whiteSpace: 'normal' }}>{row.description}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.createdBy}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.completedBy}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.deletedBy}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter by Patient:</Typography>
        <ReportSearchInput placeholder="Search patient" width="180px" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
      </Box>

      <ReportSelect 
        value={createdBy} 
        onChange={(e) => setCreatedBy(e.target.value)}
        prefix="Created By:"
        options={[
          { value: 'all', label: 'All Users' },
          { value: 'admin', label: 'Admin' }
        ]}
        width="140px"
      />

      <ReportSelect 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        prefix="Status:"
        options={[
          { value: 'all', label: 'All' },
          { value: 'ontrack', label: 'On Track' },
          { value: 'completed', label: 'Completed' }
        ]}
        width="120px"
      />
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
          }}
        />
      </Box>
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Patient Trackers Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              bottomRowFilters={bottomFilters}
              onApplyFilters={handleApplyFilters}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of patient trackers = {reportData.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={() => alert('Exporting CSV...')}
                onPrint={() => window.print()}
                hasData={reportData.length > 0}
              />
            </Box>
          </Box>

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
          onSave={(name) => alert(`Template "${name}" saved!`)} 
        />
      </React.Fragment>
    </LocalizationProvider>
  );
};
export default PatientTrackersReport;
