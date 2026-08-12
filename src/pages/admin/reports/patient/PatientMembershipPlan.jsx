import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientMembershipPlanReport, selectMembershipPlanData, selectMembershipPlanDataLoading } from '../../../../store/slices/patientReportSlice';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { ReportLayout, ReportFilterBar, ReportSearchInput, ReportSelect, ReportCheckbox, ReportDataTable, ReportDivider } from '../../../../components/reports/ui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';



const PatientMembershipPlan = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector(selectMembershipPlanData) || [];
  const loading = useSelector(selectMembershipPlanDataLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [grouping, setGrouping] = useState('no');
  const [renewalMonth, setRenewalMonth] = useState('');

  const [apptFilterType, setApptFilterType] = useState('no');
  const [apptStartDate, setApptStartDate] = useState('');
  const [apptEndDate, setApptEndDate] = useState('');
  const [apptSingleDate, setApptSingleDate] = useState('');
  
  const [showNoPlan, setShowNoPlan] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const availablePlans = useMemo(() => {
    const plans = reduxData.map(item => item.planName).filter(Boolean);
    return [...new Set(plans)].sort().map(plan => ({ planName: plan }));
  }, [reduxData]);

  const handleSearch = (val) => {
    setSearchQuery(val);
    const searchLower = val.toLowerCase();
    
    let filtered = availablePlans;
    if (val) {
      filtered = availablePlans.filter(item => 
        (item.planName || '').toLowerCase().includes(searchLower)
      );
    }
    
    setSearchResults(filtered);
    setShowDropdown(true);
  };
  useEffect(() => {
    dispatch(fetchPatientMembershipPlanReport({
      searchQuery,
      renewalMonth,
      apptFilterType,
      apptStartDate,
      apptEndDate,
      apptSingleDate,
      showNoPlan
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduxData) {
      setData(reduxData);
    }
  }, [reduxData]);

  const handleApplyFilters = () => {
    dispatch(fetchPatientMembershipPlanReport({
      searchQuery,
      renewalMonth,
      apptFilterType,
      apptStartDate,
      apptEndDate,
      apptSingleDate,
      showNoPlan
    }));
  };

  const groupedData = useMemo(() => {
    if (grouping === 'no') return null;
    const groups = {};
    data.forEach((row) => {
      let key = 'Unassigned';
      if (grouping === 'plan') {
        key = row.planName || 'No Plan';
      } else if (grouping === 'renewalMonth') {
        key = row.renewalMonth || 'No Renewal Month';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return groups;
  }, [data, grouping]);

  const generateCSVContent = (targetData) => {
    const headers = [
      'Patient Number',
      'Patient',
      'Email',
      'Plan Name',
      'Last Appointment',
      'Plan Renewal Month',
    ];

    return [
      headers.join(','),
      ...targetData.map((row) =>
        [
          row.number,
          `"${row.patient}"`,
          row.email,
          `"${row.planName}"`,
          row.lastAppointment,
          row.renewalMonth,
        ].join(',')
      ),
    ].join('\n');
  };

  const handleExportCSV = () => {
    const csvContent = generateCSVContent(data);
    downloadCSV(csvContent, 'patient_membership_plan');
  };

  const handleExportGroupCSV = (groupName, groupData) => {
    const csvContent = generateCSVContent(groupData);
    const safeGroupName = groupName.replace(/[^a-zA-Z0-9]/g, '_');
    downloadCSV(csvContent, `patient_membership_plan_${safeGroupName}`);
  };

  const downloadCSV = (csvContent, filenamePrefix) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    handlePrintGroup('patient-membership-plan-table', 'All Patients');
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Patient Membership Plan - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Patient Membership Plan - ' + groupName + '</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);

  const handleClearFilters = () => {
    setSearchQuery('');
    setGrouping('no');
    setRenewalMonth('');
    setApptFilterType('no');
    setApptStartDate('');
    setApptEndDate('');
    setApptSingleDate('');
    setShowNoPlan(false);
  };

  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <RadioGroup row value={apptFilterType} onChange={(e) => setApptFilterType(e.target.value)}>
          <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>No Appt Filter</Typography>} />
          <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Range</Typography>} />
          <FormControlLabel value="before" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Before</Typography>} />
          <FormControlLabel value="after" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>After</Typography>} />
        </RadioGroup>
      </Box>

      {apptFilterType === 'range' && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>from date</Typography>
            <DatePicker
              value={apptStartDate ? dayjs(apptStartDate) : null}
              onChange={(newValue) => setApptStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>to date</Typography>
            <DatePicker
              value={apptEndDate ? dayjs(apptEndDate) : null}
              onChange={(newValue) => setApptEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
        </>
      )}

      {(apptFilterType === 'before' || apptFilterType === 'after') && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>date</Typography>
          <DatePicker
            value={apptSingleDate ? dayjs(apptSingleDate) : null}
            onChange={(newValue) => setApptSingleDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
      )}

      <ReportDivider />

      <ReportSelect 
        label="RENEWAL MONTH" 
        options={[
          { value: '', label: 'Select month' },
          ...['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => ({ value: m, label: m }))
        ]} 
        value={renewalMonth} 
        onChange={(e) => setRenewalMonth(e.target.value)} 
        width="160px" 
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="GROUPING" 
        options={[
          { value: 'no', label: 'No Grouping' },
          { value: 'plan', label: 'Group By Plan' },
          { value: 'renewalMonth', label: 'Group By Renewal Month' }
        ]} 
        value={grouping} 
        onChange={(e) => setGrouping(e.target.value)} 
        width="180px" 
      />

      <ReportDivider />

      <ReportCheckbox 
        label="Show patients with no membership plan" 
        checked={showNoPlan} 
        onChange={(e) => setShowNoPlan(e.target.checked)} 
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>SEARCH BY PLAN NAME:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative', width: 300 }}>
            <TextField 
              fullWidth
              size="small" 
              placeholder="Search for plan or patient" 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => handleSearch(searchQuery)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  height: 36,
                  fontSize: '0.75rem',
                  '& fieldset': { borderColor: '#e2e8f0' },
                }
              }}
            />

            {showDropdown && searchResults.length > 0 && (
              <Paper 
                elevation={8} 
                sx={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  zIndex: 9999, 
                  maxHeight: '400px', 
                  overflowY: 'auto', 
                  border: '1px solid #ddd',
                  width: '300px',
                  mt: 0.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              >
                <Table size="small" stickyHeader>
                  <TableBody>
                    <TableRow sx={{ bgcolor: '#eef4ff' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Plan Name</TableCell>
                    </TableRow>
                    {searchResults.map((item, idx) => (
                      <TableRow 
                        key={idx} 
                        hover 
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }}
                        onClick={() => {
                          setSearchQuery(item.planName || '');
                          setShowDropdown(false);
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.planName || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Email' },
    { label: 'Plan name' },
    { label: 'Last Appointment' },
    { label: 'Plan Renewal Month' }
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
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.planName}</TableCell>
      <TableCell>{row.lastAppointment || 'N/A'}</TableCell>
      <TableCell>{row.renewalMonth || 'N/A'}</TableCell>
    </TableRow>
  );

  const renderTable = (tableData, tableId) => (
    <div id={tableId}>
      <ReportDataTable 
        columns={columns} 
        data={tableData} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No patient membership records found"
      />
    </div>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient by Membership Plan:">
      <Box className="hide-on-print" sx={{ mb: 2 }}>
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          onApplyFilters={handleApplyFilters}
          onClearAll={handleClearFilters}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
        />
      </Box>

      {/* Summary Text and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
          (number of patient policies = {data.length})
        </Typography>
        {grouping === 'no' && (
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={handleExportCSV}
              onPrint={handlePrint}
              hasData={data.length > 0}
            />
          </Box>
        )}
      </Box>

      {/* Table Section */}
      {grouping === 'no' ? (
        renderTable(data, 'patient-membership-plan-table')
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(groupedData).map(([groupName, groupData]) => {
            const tableId = `table-${groupName.replace(/[^a-zA-Z0-9]/g, '-')}`;
            return (
              <Box key={groupName} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {grouping === 'plan' ? 'Plan' : 'Renewal Month'}: {groupName} ({groupData.length} patients)
                  </Typography>
                  <Box sx={{ transform: 'translateY(-4px)' }}>
                    <ProductionReportActions
                      onExportCsv={() => handleExportGroupCSV(groupName, groupData)}
                      onPrint={() => handlePrintGroup(tableId, groupName)}
                      hasData={groupData.length > 0}
                    />
                  </Box>
                </Box>
                {renderTable(groupData, tableId)}
              </Box>
            );
          })}
        </Box>
      )}

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
      </ReportLayout>
    </React.Fragment>
  );
};
export default PatientMembershipPlan;
