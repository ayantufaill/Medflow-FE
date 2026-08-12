import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, Radio, RadioGroup, FormControlLabel, TableCell, TableRow, Select, MenuItem, TextField, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProceduresReport, selectProceduresData, selectProceduresDataLoading } from '../../../../store/slices/patientReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';



const ProceduresReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectProceduresData) || [];
  const loading = useSelector(selectProceduresDataLoading);
  const providerList = useSelector(selectProviderDropdownList) || [];

  const [dateType, setDateType] = useState('scheduled');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [createdStartDate, setCreatedStartDate] = useState(null);
  const [createdEndDate, setCreatedEndDate] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [adaCode, setAdaCode] = useState('');

  const fetchReport = () => {
    const activeDates = dateType === 'created'
      ? {
          startDate: createdStartDate ? createdStartDate.format('YYYY-MM-DD') : '',
          endDate: createdEndDate ? createdEndDate.format('YYYY-MM-DD') : ''
        }
      : {
          startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
          endDate: endDate ? endDate.format('YYYY-MM-DD') : ''
        };
    dispatch(fetchProceduresReport({
      dateType,
      ...activeDates,
      provider,
      status,
      adaCode
    }));
  };

  React.useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    fetchReport();
  }, [dispatch]);

  const handleApplyFilters = () => {
    fetchReport();
  };

  const columns = [
    { label: 'Patient' },
    { label: 'Procedure Code' },
    { label: 'Procedure Description' },
    { label: 'Status' },
    { label: 'Provider' },
    { label: 'Created Date' },
    { label: 'Scheduled Date' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.code}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.description}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.created}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.scheduled}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <RadioGroup value={dateType} onChange={(e) => setDateType(e.target.value)} sx={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <FormControlLabel 
            value="scheduled" 
            control={<Radio size="small" sx={{ p: 0.5 }} />} 
            label={<Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 600 }}>Procedure Scheduled Date :</Typography>} 
            sx={{ mr: 0 }}
          />
          <Select variant="standard" size="small" value="range" sx={{ fontSize: '0.75rem', width: 80, height: 24, backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }}>
            <MenuItem value="range">Range</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <FormControlLabel 
            value="created" 
            control={<Radio size="small" sx={{ p: 0.5 }} />} 
            label={<Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 600, opacity: dateType === 'created' ? 1 : 0.5 }}>Procedure Created Date :</Typography>} 
            sx={{ mr: 0 }}
          />
          <Select variant="standard" size="small" value="range" sx={{ fontSize: '0.75rem', width: 80, height: 24, opacity: dateType === 'created' ? 1 : 0.5, backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }}>
            <MenuItem value="range">Range</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={createdStartDate}
          onChange={(v) => setCreatedStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={createdEndDate}
          onChange={(v) => setCreatedEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
        </Box>
      </RadioGroup>
    </>
  );

  const providerOptions = useMemo(() => [
    { value: 'all', label: 'All Providers' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: String(p.id || p.ProvNum || name), label: name };
    }),
  ], [providerList]);

  const bottomFilters = (
    <>
      <ReportSelect 
        label="Select Provider" 
        prefix="Provider:" 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        options={providerOptions} 
      />
      <ReportSelect 
        label="Select Status" 
        prefix="Procedure Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'tp', label: 'Treatment Planned' },
          { value: 'completed', label: 'Completed' },
          { value: 'existingCurrent', label: 'Existing Current' },
          { value: 'existingOther', label: 'Existing Other' },
          { value: 'referredOut', label: 'Referred Out' },
          { value: 'deleted', label: 'Deleted' }
        ]} 
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Ada Code:</Typography>
        <ReportSearchInput placeholder="Enter code or procedure" width="200px" value={adaCode} onChange={(e) => setAdaCode(e.target.value)} />
      </Box>
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Procedures Report:">
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
              (number of procedures = {reportData.length})
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
export default ProceduresReport;
