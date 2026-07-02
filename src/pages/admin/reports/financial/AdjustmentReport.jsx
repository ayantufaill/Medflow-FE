import React from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Radio, RadioGroup,
  FormControlLabel, Checkbox, Button, TextField, Tooltip, TableCell, TableRow
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const AdjustmentReport = () => {
  const dummyData = [
    {
      date: '05/08/26',
      flags: ['#f5a623', '#4a90e2', '#e11d48'],
      patient: 'John Doe',
      transaction: '25199',
      ada: 'D1110',
      site: '',
      description: 'hygiene',
      rendering: 'Dr. Smith',
      billing: 'Office A',
      adj: -96.00,
      type: 'Insurance Write Off'
    },
    {
      date: '05/08/26',
      flags: ['#f5a623', '#4a90e2'],
      patient: 'Jane Smith',
      transaction: '25203',
      ada: 'D0220',
      site: '19',
      description: 'PA1',
      rendering: 'Dr. Brown',
      billing: 'Office B',
      adj: -27.00,
      type: 'Insurance Write Off'
    }
  ];

  const columns = [
    { label: 'Date' },
    { label: 'Flags' },
    { label: 'Patient' },
    { label: 'Transaction #' },
    { label: 'ADA' },
    { label: 'Site' },
    { label: 'Description' },
    { label: <React.Fragment key="rendering">Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment> },
    { label: <React.Fragment key="billing">Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment> },
    { label: 'Adj', align: 'right' },
    { label: 'Adjustment Type' },
  ];

  const renderRow = (row, idx) => (
    <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.2 }}>
          {row.flags.map((color, i) => (
            <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
          ))}
        </Box>
      </TableCell>
      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
      <TableCell>{row.transaction}</TableCell>
      <TableCell>{row.ada}</TableCell>
      <TableCell>{row.site}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.rendering}</TableCell>
      <TableCell>{row.billing}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>-${Math.abs(row.adj).toFixed(2)}</TableCell>
      <TableCell>{row.type}</TableCell>
    </TableRow>
  );

  const Title = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      Adjustment Report
      <Tooltip title="Adjustment Details">
        <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary', cursor: 'pointer' }} />
      </Tooltip>
    </Box>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="daily" 
        prefix="Date Range:" 
        defaultValue="daily"
        options={[{ value: 'daily', label: 'Daily' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600 }}>⬅ May 08, 2026 ⮕</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2026</Typography>
      </Box>

      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'Select Provider' }]}
      />
      
      <ReportSelect 
        label="all" 
        prefix="Adjustment Type:" 
        defaultValue="all"
        options={[{ value: 'all', label: 'All' }]}
      />

      <RadioGroup row defaultValue="no-grouping" sx={{ ml: 2 }}>
        <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>No Grouping</Typography>} />
        <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Provider</Typography>} />
        <FormControlLabel value="group-adj" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Adjustment</Typography>} />
      </RadioGroup>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
        <RadioGroup row defaultValue="filter">
          <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter Codes</Typography>} />
          <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Enter Codes to Exclude</Typography>} />
        </RadioGroup>
        <TextField 
          size="small" 
          variant="outlined"
          placeholder="Enter code or procedure" 
          sx={{ width: 220, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.75rem', backgroundColor: '#fff' } }} 
        />
      </Box>

      <ReportCheckbox label="Filter by Production Date" />
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      <ReportCheckbox label="Show Date of Birth" defaultChecked />
      <ReportCheckbox label="Show Provider" defaultChecked />
      <ReportCheckbox label="Filter by DOS" />

      <ReportSelect 
        label="pts" 
        defaultValue="pts"
        options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]}
        sx={{ ml: 2 }}
      />
      <ReportSelect 
        label="default" 
        prefix="Sort Report By:" 
        defaultValue="default"
        options={[{ value: 'default', label: 'Default' }]}
      />
    </>
  );

  return (
    <ReportLayout title={Title}>
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => console.log('Exporting CSV...')}
        onPrint={() => window.print()}
        customLeftActions={
          <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#3CA2E0', '&:hover': { backgroundColor: '#2d8ac1' }, ml: 2 }}>
            Create Template
          </Button>
        }
      />

      {/* Shared Data Table */}
      <ReportDataTable 
        columns={columns} 
        data={dummyData} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default AdjustmentReport;

