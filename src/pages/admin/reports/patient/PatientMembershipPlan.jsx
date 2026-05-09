import React, { useState } from 'react';
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
  MenuItem,
  FormControl,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

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

  const handleApplyFilters = () => {
    let filtered = INITIAL_DATA.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        item.patient.toLowerCase().includes(searchLower) ||
        item.planName.toLowerCase().includes(searchLower) ||
        item.number.includes(searchLower)
      );

      const matchesMonth = !renewalMonth || item.renewalMonth === renewalMonth;

      return matchesSearch && matchesMonth;
    });

    if (grouping === 'plan') {
      filtered = [...filtered].sort((a, b) => a.planName.localeCompare(b.planName));
    }

    setData(filtered);
  };

  const handleExportCSV = () => {
    const headers = ['Patient Number', 'Patient', 'Email', 'Plan Name', 'Last Appointment', 'Plan Renewal Month'];
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        [row.number, `"${row.patient}"`, row.email, `"${row.planName}"`, row.lastAppointment, row.renewalMonth].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_membership_plan_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Patient by Membership Plan:
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Search by plan name:</Typography>
          <TextField
            size="small"
            placeholder="Search for plan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                </InputAdornment>
              ),
              sx: { height: 30, fontSize: '0.8rem', backgroundColor: '#f9f9f9', '& fieldset': { borderColor: '#ccc' } }
            }}
            sx={{ width: 220 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Grouping:</Typography>
          <RadioGroup row value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No Grouping</Typography>} />
            <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Plan</Typography>} />
          </RadioGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by past appointment date:</Typography>
          <RadioGroup row defaultValue="no">
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
            <FormControlLabel value="range" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Range</Typography>} />
            <FormControlLabel value="before" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Before specific date</Typography>} />
            <FormControlLabel value="after" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">After specific date</Typography>} />
          </RadioGroup>
        </Box>

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

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Checkbox size="small" sx={{ p: 0.5 }} />
          <Typography variant="caption">Show patients with no membership plan</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
        <Button variant="contained" size="small" onClick={handleApplyFilters} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem' }}>Apply Filters</Button>
        <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem' }}>Create Template</Button>
        <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={() => window.print()} sx={{ textTransform: 'none', backgroundColor: '#da4453', fontSize: '0.75rem' }}>Print</Button>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
        (number of patient policies = {data.length})
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {['Patient Number', 'Patient', 'Email', 'Plan name', 'Last Appointment', 'Plan Renewal Month'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600, fontSize: '0.72rem', py: 1, px: 1, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '& td': { borderBottom: '1px solid #eee' } }}>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.number}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.email}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planName}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.lastAppointment}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.renewalMonth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientMembershipPlan;
