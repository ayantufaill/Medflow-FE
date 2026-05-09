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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const INITIAL_DATA = [
  {
    number: '1262',
    patient: 'John Doe',
    email: 'john.doe@example.com',
    planName: 'Standard Insurance (160-173134-1)',
    payer: 'Standard Insurance',
    lastAppointment: '',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1254',
    patient: 'Jane Smith',
    email: 'jane.smith@example.com',
    planName: 'Walmart (8000-00010000)',
    payer: 'Delta Dental of Arkansas',
    lastAppointment: '05/05/2026',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1247',
    patient: 'Robert Brown',
    email: 'robert.b@example.com',
    planName: 'Blue Cross Blue Shield of Texas (387291)',
    payer: 'Blue Cross Blue Shield of Texas',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1247',
    patient: 'Michael Johnson',
    email: 'm.johnson@example.com',
    planName: 'United Concordia (858527000)',
    payer: 'United Concordia',
    lastAppointment: '',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1246',
    patient: 'William Davis',
    email: 'w.davis@example.com',
    planName: 'CIGNA (3345155)',
    payer: 'CIGNA',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1241',
    patient: 'Elizabeth Garcia',
    email: 'e.garcia@example.com',
    planName: 'Delta Dental of Pennsylvania (20657-05048)',
    payer: 'Delta Dental of Pennsylvania',
    lastAppointment: '05/05/2026',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1239',
    patient: 'David Martinez',
    email: 'd.martinez@example.com',
    planName: 'CIGNA (0653848)',
    payer: 'CIGNA',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1238',
    patient: 'Susan Wilson',
    email: 's.wilson@example.com',
    planName: 'Aetna Dental Plans (014197501000001)',
    payer: 'Aetna Dental Plans',
    lastAppointment: '04/15/2026',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'June',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1236',
    patient: 'Joseph Anderson',
    email: 'j.anderson@example.com',
    planName: 'ERICSSON INC. (069802102100001)',
    payer: 'Aetna Dental Plans',
    lastAppointment: '04/08/2026',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
];

const PatientInsuranceCoverage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
  const [grouping, setGrouping] = useState('no');

  const handleApplyFilters = () => {
    const filtered = INITIAL_DATA.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.patient.toLowerCase().includes(searchLower) ||
        item.planName.toLowerCase().includes(searchLower) ||
        item.payer.toLowerCase().includes(searchLower) ||
        item.number.includes(searchLower)
      );
    });
    setData(filtered);
  };

  const handleExportCSV = () => {
    const headers = [
      'Patient Number',
      'Patient',
      'Email',
      'Plan Name',
      'Payer',
      'Last Appointment',
      'Fee Schedule',
      'Plan Renewal Date',
      'Assignment Status',
    ];

    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        [
          row.number,
          `"${row.patient}"`,
          row.email,
          `"${row.planName}"`,
          `"${row.payer}"`,
          row.lastAppointment,
          `"${row.feeSchedule}"`,
          row.planRenewalDate,
          row.assignmentStatus,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_insurance_coverage_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateTemplate = () => {
    alert('Create Template feature is coming soon!');
  };

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      {/* Title */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#337ab7', 
          fontWeight: 500, 
          mb: 2, 
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        Patient by Insurance Coverage:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Search by payer or plan:</Typography>
          <TextField
            size="small"
            placeholder="Search for plan"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                </InputAdornment>
              ),
              sx: { 
                height: 30, 
                fontSize: '0.8rem',
                backgroundColor: '#f9f9f9',
                '& fieldset': { borderColor: '#ccc' }
              }
            }}
            sx={{ width: 220 }}
          />
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
            <FormControlLabel value="payer" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Payer</Typography>} />
            <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Plan</Typography>} />
            <FormControlLabel value="fee" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Fee Schedule</Typography>} />
          </RadioGroup>
        </Box>

        {/* Filter by past appointment date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by past appointment date:</Typography>
          <RadioGroup row defaultValue="no">
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
            <FormControlLabel value="range" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Range</Typography>} />
            <FormControlLabel value="before" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Before specific date</Typography>} />
            <FormControlLabel value="after" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">After specific date</Typography>} />
          </RadioGroup>
        </Box>

        {/* Filter by Assignment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by Assignment:</Typography>
          <RadioGroup row defaultValue="no">
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
            <FormControlLabel value="assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Assignment</Typography>} />
            <FormControlLabel value="non-assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Non-Assignment</Typography>} />
          </RadioGroup>
        </Box>

        {/* Checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Checkbox size="small" sx={{ p: 0.5 }} />
          <Typography variant="caption">Show patients with no coverage</Typography>
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
      </Box>

      {/* Summary Text */}
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
        (number of patient policies = {data.length})
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'Patient Number', 
                'Patient', 
                'Email', 
                'Plan name(plan num)', 
                'Payer', 
                'Last Appointment', 
                'Fee Schedule', 
                'Plan Renewal Date', 
                'Assignment Status'
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
            {data.map((row, index) => (
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
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.payer}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.lastAppointment}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.feeSchedule}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planRenewalDate}</TableCell>
                <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.assignmentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientInsuranceCoverage;
