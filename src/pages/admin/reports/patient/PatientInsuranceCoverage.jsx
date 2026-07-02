import React, { useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Radio, RadioGroup, FormControlLabel, Checkbox, Button, TableCell, TableRow
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSearchInput, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const INITIAL_DATA = [
  { number: '1262', patient: 'John Doe', email: 'john.doe@example.com', planName: 'Standard Insurance (160-173134-1)', payer: 'Standard Insurance', lastAppointment: '', feeSchedule: '', planRenewalDate: 'January', assignmentStatus: 'Assignment' },
  { number: '1254', patient: 'Jane Smith', email: 'jane.smith@example.com', planName: 'Walmart (8000-00010000)', payer: 'Delta Dental of Arkansas', lastAppointment: '05/05/2026', feeSchedule: '', planRenewalDate: 'January', assignmentStatus: 'Assignment' },
  { number: '1247', patient: 'Robert Brown', email: 'robert.b@example.com', planName: 'Blue Cross Blue Shield of Texas (387291)', payer: 'Blue Cross Blue Shield of Texas', lastAppointment: '', feeSchedule: 'Careington PPO Platinum (directly in network)', planRenewalDate: 'January', assignmentStatus: 'Assignment' },
];

const PatientInsuranceCoverage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
  const [grouping, setGrouping] = useState('no');
  const [assignmentFilter, setAssignmentFilter] = useState('no');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handleApplyFilters = () => {
    let filtered = INITIAL_DATA.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        item.patient.toLowerCase().includes(searchLower) ||
        item.planName.toLowerCase().includes(searchLower) ||
        item.payer.toLowerCase().includes(searchLower) ||
        item.number.includes(searchLower)
      );

      const matchesAssignment = 
        assignmentFilter === 'no' || 
        (assignmentFilter === 'assignment' && item.assignmentStatus === 'Assignment') ||
        (assignmentFilter === 'non-assignment' && item.assignmentStatus !== 'Assignment');

      return matchesSearch && matchesAssignment;
    });

    if (grouping === 'payer') {
      filtered = [...filtered].sort((a, b) => a.payer.localeCompare(b.payer));
    } else if (grouping === 'plan') {
      filtered = [...filtered].sort((a, b) => a.planName.localeCompare(b.planName));
    } else if (grouping === 'fee') {
      filtered = [...filtered].sort((a, b) => (a.feeSchedule || '').localeCompare(b.feeSchedule || ''));
    }

    setData(filtered);
  };

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Email' },
    { label: 'Plan name(plan num)' },
    { label: 'Payer' },
    { label: 'Last Appointment' },
    { label: 'Fee Schedule' },
    { label: 'Plan Renewal Date' },
    { label: 'Assignment Status' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
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
  );

  const topFilters = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Search by payer or plan:</Typography>
        <ReportSearchInput 
          placeholder="Search for plan" 
          width="220px"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Grouping:</Typography>
        <RadioGroup row value={grouping} onChange={(e) => setGrouping(e.target.value)}>
          <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>No Grouping</Typography>} />
          <FormControlLabel value="payer" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Group By Payer</Typography>} />
          <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Group By Plan</Typography>} />
          <FormControlLabel value="fee" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Group By Fee Schedule</Typography>} />
        </RadioGroup>
      </Box>
    </Box>
  );

  const bottomFilters = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Filter by past appointment date:</Typography>
        <RadioGroup row defaultValue="no">
          <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>No filter</Typography>} />
          <FormControlLabel value="range" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Range</Typography>} />
          <FormControlLabel value="before" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Before specific date</Typography>} />
          <FormControlLabel value="after" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>After specific date</Typography>} />
        </RadioGroup>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Filter by Assignment:</Typography>
        <RadioGroup row value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)}>
          <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>No filter</Typography>} />
          <FormControlLabel value="assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Assignment</Typography>} />
          <FormControlLabel value="non-assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Non-Assignment</Typography>} />
        </RadioGroup>
      </Box>

      <Box sx={{ mt: 0.5 }}>
        <ReportCheckbox label="Show patients with no coverage" />
      </Box>
    </Box>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient by Insurance Coverage:">
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          onApplyFilters={handleApplyFilters}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting...')}
          onPrint={() => window.print()}
        />

        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
          (number of patient policies = {data.length})
        </Typography>

        <ReportDataTable 
          columns={columns} 
          data={data} 
          renderRow={renderRow} 
        />
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </React.Fragment>
  );
};
export default PatientInsuranceCoverage;
