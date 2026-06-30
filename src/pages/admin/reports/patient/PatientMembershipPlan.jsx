import React, { useState, useMemo, useEffect } from 'react';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const INITIAL_DATA = [
  {
    number: '1249',
    patient: 'John Doe',
    email: 'john.doe@example.com',
    planName: 'Foundations (Perio) Program - New Patient',
    lastAppointment: '',
    renewalMonth: 'April',
  },
  {
    number: '1210',
    patient: 'Jane Smith',
    email: 'jane.smith@example.com',
    planName: 'Foundations (Perio) Program - New Patient',
    lastAppointment: '',
    renewalMonth: 'February',
  },
  {
    number: '540',
    patient: 'Robert Brown',
    email: 'robert.b@example.com',
    planName: 'Clean + Confident - Existing Patient',
    lastAppointment: '',
    renewalMonth: 'March',
  },
  {
    number: '185',
    patient: 'Michael Johnson',
    email: 'm.johnson@example.com',
    planName: 'Foundations (Perio) Program Existing Patient',
    lastAppointment: '',
    renewalMonth: 'April',
  },
  {
    number: '181',
    patient: 'William Davis',
    email: 'w.davis@example.com',
    planName: 'Foundations (Perio) Program - New Patient',
    lastAppointment: '',
    renewalMonth: 'May',
  },
  {
    number: '62',
    patient: 'Elizabeth Garcia',
    email: 'e.garcia@example.com',
    planName: 'Bright Beginning',
    lastAppointment: '',
    renewalMonth: 'February',
  },
  {
    number: '4',
    patient: 'David Martinez',
    email: 'd.martinez@example.com',
    planName: 'Clean + Confident - Existing Patient',
    lastAppointment: '',
    renewalMonth: 'February',
  },
];

const PatientMembershipPlan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
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
    const plans = INITIAL_DATA.map(item => item.planName).filter(Boolean);
    return [...new Set(plans)].sort().map(plan => ({ planName: plan }));
  }, []);

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

  const handleApplyFilters = () => {
    const filtered = INITIAL_DATA.filter((item) => {
      // 1. Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || (
        (item.patient && item.patient.toLowerCase().includes(searchLower)) ||
        (item.planName && item.planName.toLowerCase().includes(searchLower)) ||
        (item.number && String(item.number).toLowerCase().includes(searchLower))
      );

      // 2. Renewal Month
      const matchesMonth = !renewalMonth || item.renewalMonth === renewalMonth;

      // 3. Appt Date
      let matchesApptDate = true;
      if (apptFilterType !== 'no') {
        if (!item.lastAppointment) {
          matchesApptDate = false;
        } else {
          const apptDate = new Date(item.lastAppointment);
          if (apptFilterType === 'range') {
            const start = apptStartDate ? new Date(apptStartDate) : null;
            const end = apptEndDate ? new Date(apptEndDate) : null;
            if (start && apptDate < start) matchesApptDate = false;
            if (end && apptDate > end) matchesApptDate = false;
          } else if (apptFilterType === 'before') {
            const single = apptSingleDate ? new Date(apptSingleDate) : null;
            if (single && apptDate >= single) matchesApptDate = false;
          } else if (apptFilterType === 'after') {
            const single = apptSingleDate ? new Date(apptSingleDate) : null;
            if (single && apptDate <= single) matchesApptDate = false;
          }
        }
      }

      // 4. Show patients with no plan
      const hasPlan = Boolean(item.planName && item.planName !== 'N/A' && item.planName.trim() !== '');
      const matchesPlan = showNoPlan ? !hasPlan : hasPlan;

      return matchesSearch && matchesMonth && matchesApptDate && matchesPlan;
    });

    setData(filtered);
  };

  useEffect(() => {
    handleApplyFilters();
  }, [
    searchQuery,
    renewalMonth,
    apptFilterType,
    apptStartDate,
    apptEndDate,
    apptSingleDate,
    showNoPlan
  ]);

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

  const renderTable = (tableData, tableId) => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
      <Table id={tableId} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {[
              'Patient Number', 
              'Patient', 
              'Email', 
              'Plan name', 
              'Last Appointment', 
              'Plan Renewal Month'
            ].map((header) => (
              <TableCell 
                key={header} 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.72rem', 
                  py: 1,
                  px: 1,
                  borderBottom: '1px solid #ddd',
                  backgroundColor: '#fff'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow 
              key={index} 
              sx={{ 
                backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', 
                '& td': { borderBottom: '1px solid #eee' } 
              }}
            >
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.number}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.email}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planName}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.lastAppointment || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.renewalMonth || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Patient by Membership Plan:
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Search by plan name:</Typography>
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
                  fontSize: '0.8rem',
                  backgroundColor: '#f9f9f9',
                  '& fieldset': { borderColor: '#ccc' }
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

        {/* Grouping */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Grouping:</Typography>
          <RadioGroup 
            row 
            value={grouping} 
            onChange={(e) => setGrouping(e.target.value)}
          >
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No Grouping</Typography>} />
            <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Plan</Typography>} />
            <FormControlLabel value="renewalMonth" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Renewal Month</Typography>} />
          </RadioGroup>
        </Box>

        {/* Filter by past appointment date */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by past appointment date:</Typography>
            <RadioGroup row value={apptFilterType} onChange={(e) => setApptFilterType(e.target.value)}>
              <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
              <FormControlLabel value="range" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Range</Typography>} />
              <FormControlLabel value="before" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Before specific date</Typography>} />
              <FormControlLabel value="after" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">After specific date</Typography>} />
            </RadioGroup>
          </Box>
          {apptFilterType === 'range' && (
            <Box sx={{ display: 'flex', gap: 2, pl: 21 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Start Date:
                <input 
                  type="date" 
                  value={apptStartDate} 
                  onChange={(e) => setApptStartDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                End Date:
                <input 
                  type="date" 
                  value={apptEndDate} 
                  onChange={(e) => setApptEndDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
            </Box>
          )}
          {(apptFilterType === 'before' || apptFilterType === 'after') && (
            <Box sx={{ display: 'flex', gap: 2, pl: 21 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Date:
                <input 
                  type="date" 
                  value={apptSingleDate} 
                  onChange={(e) => setApptSingleDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
            </Box>
          )}
        </Box>

        {/* Filter by Renewal Month */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by plan renewal month:</Typography>
          <Select
            size="small"
            value={renewalMonth}
            onChange={(e) => setRenewalMonth(e.target.value)}
            displayEmpty
            sx={{ height: 25, fontSize: '0.75rem', width: 150 }}
          >
            <MenuItem value=""><Typography variant="caption">Select month</Typography></MenuItem>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <MenuItem key={m} value={m}><Typography variant="caption">{m}</Typography></MenuItem>
            ))}
          </Select>
        </Box>

        {/* Checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Checkbox 
            size="small" 
            sx={{ p: 0.5 }} 
            checked={showNoPlan}
            onChange={(e) => setShowNoPlan(e.target.checked)}
          />
          <Typography variant="caption">Show patients with no membership plan</Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleApplyFilters}
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#4a89dc', 
            fontSize: '0.75rem',
            padding: '4px 12px'
          }}
        >
          Apply Filters
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          disabled
          onClick={handleCreateTemplate}
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#d9a366', 
            color: '#fff',
            fontSize: '0.75rem',
            padding: '4px 12px'
          }}
        >
          Create Template
        </Button>
        {grouping === 'no' && (
          <>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleExportCSV}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#4a89dc', 
                fontSize: '0.75rem',
                padding: '4px 12px'
              }}
            >
              Export as CSV
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handlePrint}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#da4453', 
                fontSize: '0.75rem',
                padding: '4px 12px'
              }}
            >
              Print
            </Button>
          </>
        )}
      </Box>

      {/* Summary Text */}
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
        (number of patient policies = {data.length})
      </Typography>

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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => handleExportGroupCSV(groupName, groupData)}
                      sx={{ fontSize: '0.7rem', py: 0.2 }}
                    >
                      Export CSV
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => handlePrintGroup(tableId, groupName)}
                      sx={{ fontSize: '0.7rem', py: 0.2 }}
                    >
                      Print
                    </Button>
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
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default PatientMembershipPlan;
