import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TableCell, TableRow, Radio, RadioGroup, FormControlLabel, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_CARRIERS = [
  {
    name: 'CIGNA',
    collection: '$1,236.00',
    production: '$2,713.00',
    writeoff: '$2,134.00',
    patients: [
      { name: 'Patient One', collection: '$1,017.00', production: '$2,494.00', writeoff: '$1,910.00' },
      { name: 'Patient Two', collection: '$148.00', production: '$148.00', writeoff: '$156.00' },
      { name: 'Patient Three', collection: '$71.00', production: '$71.00', writeoff: '$68.00' },
    ]
  },
  {
    name: 'United Healthcare',
    collection: '$216.00',
    production: '$216.00',
    writeoff: '$211.00',
    patients: [
      { name: 'Patient Four', collection: '$216.00', production: '$216.00', writeoff: '$211.00' },
    ]
  }
];

const CollectionCarrier = () => {
  const [networkFilter, setNetworkFilter] = useState('None');
  const [payerFilter, setPayerFilter] = useState('Payer');

  const columns = [
    { label: 'Patient' },
    { label: 'Collection' },
    { label: 'Production' },
    { label: 'Write-off' },
  ];

  const renderRow = (p, pIdx) => (
    <TableRow key={pIdx} sx={{ backgroundColor: pIdx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer' }}>{p.name}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.collection}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.production}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.writeoff}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportSelect label="Daily" prefix="Date Range:" defaultValue="Daily" />
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', ml: 1, whiteSpace: 'nowrap' }}>← May 08, 2026 →</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', color: '#1e293b' }}>Date: 05/08/2026</Typography>
      </Box>
      <ReportSelect label="All" prefix="Provider:" defaultValue="All" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Filter by:</Typography>
        <RadioGroup row value={networkFilter} onChange={(e) => setNetworkFilter(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="None" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>None</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="In" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>In Network</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="Out" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Out of Network</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="Payer" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Filter by Payer:</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
        <TextField size="small" variant="outlined" placeholder="Enter Name" sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="Plan" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Filter by Plan:</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
        <TextField size="small" variant="outlined" placeholder="Enter Name" sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } }} />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Collection Per Carrier Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Carrier Sections */}
      {MOCK_CARRIERS.map((carrier, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          <Typography sx={{ color: '#337ab7', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>{carrier.name}</Typography>
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.collection}</Typography></Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Production: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.production}</Typography></Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Write-off: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.writeoff}</Typography></Typography>
          </Box>

          <ReportDataTable 
            columns={columns} 
            data={carrier.patients} 
            renderRow={renderRow} 
          />
        </Box>
      ))}
    </ReportLayout>
  );
};

export default CollectionCarrier;
