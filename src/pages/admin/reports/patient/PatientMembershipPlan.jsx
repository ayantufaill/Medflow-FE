import React, { useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Radio, RadioGroup, FormControlLabel, Checkbox, Button, TableCell, TableRow, Select, MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSearchInput, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const INITIAL_DATA = [
  { number: '1249', patient: 'John Doe', email: 'john.doe@example.com', planName: 'Foundations (Perio) Program - New Patient', lastAppointment: '', renewalMonth: 'April' },
  { number: '1210', patient: 'Jane Smith', email: 'jane.smith@example.com', planName: 'Foundations (Perio) Program - New Patient', lastAppointment: '', renewalMonth: 'February' },
  { number: '540', patient: 'Robert Brown', email: 'robert.b@example.com', planName: 'Clean + Confident - Existing Patient', lastAppointment: '', renewalMonth: 'March' },
];

const PatientMembershipPlan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
  const [grouping, setGrouping] = useState('no');
  const [renewalMonth, setRenewalMonth] = useState('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

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

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Email' },
    { label: 'Plan name' },
    { label: 'Last Appointment' },
    { label: 'Plan Renewal Month' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.number}</TableCell>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.email}</TableCell>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planName}</TableCell>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.lastAppointment}</TableCell>
      <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.renewalMonth}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Search by plan name:</Typography>
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
          <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ color: '#1e293b' }}>Group By Plan</Typography>} />
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
        <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600, color: '#1e293b' }}>Filter by plan renewal month:</Typography>
        <ReportSelect 
          value={renewalMonth}
          onChange={(e) => setRenewalMonth(e.target.value)}
          options={[
            { value: '', label: 'Select month' },
            ...['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => ({ value: m, label: m }))
          ]}
          width="150px"
        />
      </Box>

      <Box sx={{ mt: 0.5 }}>
        <ReportCheckbox label="Show patients with no membership plan" />
      </Box>
    </Box>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient by Membership Plan:">
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
export default PatientMembershipPlan;
