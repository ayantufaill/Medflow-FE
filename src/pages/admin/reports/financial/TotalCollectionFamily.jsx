import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_FAMILIES = [
  {
    id: '196',
    name: 'Family One',
    patientCollection: '$0.00',
    insuranceCollection: '$216.00',
    totalCollection: '$216.00',
    members: [
      { id: '196', name: 'Member A', patientCollection: '$0.00', insuranceCollection: '$216.00', totalCollection: '$216.00' }
    ]
  },
  {
    id: '298',
    name: 'Family Two',
    patientCollection: '$0.00',
    insuranceCollection: '$119.00',
    totalCollection: '$119.00',
    members: [
      { id: '298', name: 'Member B', patientCollection: '$0.00', insuranceCollection: '$119.00', totalCollection: '$119.00' }
    ]
  },
  {
    id: '782',
    name: 'Family Three',
    patientCollection: '$0.00',
    insuranceCollection: '$99.00',
    totalCollection: '$99.00',
    members: [
      { id: '782', name: 'Member C', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' }
    ]
  }
];

const TotalCollectionFamily = () => {
  const [dateRange, setDateRange] = useState('Daily');

  const topFilters = (
    <>
      <ReportSelect 
        label={dateRange} 
        prefix="Date Range:" 
        value={dateRange} 
        onChange={(e) => setDateRange(e.target.value)}
        options={['Daily', 'Weekly']}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <ChevronLeft sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center', whiteSpace: 'nowrap' }}>
          May 08, 2026
        </Typography>
        <ChevronRight sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>
          05/08/2026
        </Typography>
      </Box>

      <ReportSelect 
        defaultValue="Default"
        prefix="Sort Report By:"
        options={[
          { value: 'Default', label: 'Default' },
          { value: 'Amount', label: 'Amount' }
        ]}
      />
    </>
  );

  const columns = [
    { label: 'ID', width: '80px' },
    { label: 'Patient' },
    { label: 'Patient Collection' },
    { label: 'Insurance Collection' },
    { label: 'Total Collection' },
  ];

  const renderRow = (member, mIdx) => (
    <TableRow key={mIdx} sx={{ backgroundColor: mIdx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer' }}>{member.name}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.patientCollection}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.insuranceCollection}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.totalCollection}</TableCell>
    </TableRow>
  );

  return (
    <ReportLayout title="Total Collection By Family Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Families List */}
      {MOCK_FAMILIES.map((family, fIdx) => (
        <Box key={fIdx} sx={{ mb: 5 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600 }}>
              Total Patient Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#333', ml: 1 }}>{family.patientCollection}</Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600 }}>
              Total Insurance Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#333', ml: 1 }}>{family.insuranceCollection}</Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600 }}>
              Total Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#333', ml: 1 }}>{family.totalCollection}</Typography>
            </Typography>
          </Box>

          <ReportDataTable 
            columns={columns} 
            data={family.members} 
            renderRow={renderRow} 
          />
        </Box>
      ))}
    </ReportLayout>
  );
};

export default TotalCollectionFamily;

