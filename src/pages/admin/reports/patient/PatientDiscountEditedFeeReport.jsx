import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchPatientDiscountEditedFeeReport, selectDiscountEditedFeeData, selectDiscountEditedFeeDataLoading } from '../../../../store/slices/patientReportSlice';



const PatientDiscountEditedFeeReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectDiscountEditedFeeData) || [];
  const loading = useSelector(selectDiscountEditedFeeDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(dayjs());
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchPatientDiscountEditedFeeReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
    }));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

  const columns = [
    { label: 'Patient' },
    { label: 'Date' },
    { label: 'Code' },
    { label: 'Description' },
    { label: 'Original Fee' },
    { label: 'Edited Fee' },
    { label: 'Discount' },
    { label: 'Provider' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.code}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.description}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.fee}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.editedFee}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', color: '#d9534f' }}>{row.discount}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
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
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>End Date:</Typography>
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
        <ReportLayout title="Patient By Discount Or Edited Fee:">
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#999', fontStyle: 'italic', fontSize: '0.65rem' }}>
            Please note that Adjustment dates do not exist before 01/24/2023, so any data before that will not be displayed.
          </Typography>

          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              onApplyFilters={handleApply}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of patients = {reportData.length})
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

export default PatientDiscountEditedFeeReport;
