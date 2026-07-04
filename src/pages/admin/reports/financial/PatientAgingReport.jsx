import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';
import PatientAgingReportTable from './PatientAgingReportTable';

const PatientAgingReport = () => {
  const [hidePatientNames, setHidePatientNames] = useState(false);

  const agingBuckets = [
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ];

  const dummyData = [
    {
      flags: [],
      name: 'John Doe',
      buckets: {
        '0 - 30 days': { pt: 1904.33, ins: 0 },
        '31 - 60 days': { pt: 0, ins: 0 },
        '61 - 90 days': { pt: 0, ins: 0 },
        '91 - 120 days': { pt: 0, ins: 0 },
        '121 - 150 days': { pt: 0, ins: 0 },
        '151 - 180 days': { pt: 0, ins: 0 },
        '> 180 day': { pt: 0, ins: 0 },
      },
      total: 1904.33,
      totalOwings: 3904.33,
      paymentPlan: 0,
      credit: 0,
      lastBilled: '',
    },
    {
      flags: [],
      name: 'Jane Smith',
      buckets: {
        '0 - 30 days': { pt: 1724.00, ins: 0 },
        '31 - 60 days': { pt: 0, ins: 0 },
        '61 - 90 days': { pt: 0, ins: 0 },
        '91 - 120 days': { pt: 0, ins: 0 },
        '121 - 150 days': { pt: 0, ins: 0 },
        '151 - 180 days': { pt: 0, ins: 0 },
        '> 180 day': { pt: 0, ins: 0 },
      },
      total: 1724.00,
      totalOwings: 3724.00,
      paymentPlan: 0,
      credit: 0,
      lastBilled: '',
    }
  ];

  const topFilters = (
    <>
      <ReportSelect defaultValue="any" options={[{ value: 'any', label: 'Any AR Range' }]} width="140px" />
      <ReportSelect defaultValue="pts" options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]} width="180px" />
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      <ReportSelect label="High to Low Owings" prefix="Sort Report By" defaultValue="high-low" options={[{ value: 'high-low', label: 'High to Low Owings' }]} width="180px" />
      <ReportCheckbox label="Show Payment Plan Owing" defaultChecked />
    </>
  );

  const bottomFilters = (
    <>
      <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>
        Reset Invoice outstanding balance age to 0 days: 
        <Box component="span" sx={{ ml: 1, color: '#3CA2E0', cursor: 'help' }}>ⓘ</Box>
      </Typography>
      <ReportSelect label="Don't reset invoice age" prefix="On Patient Payment:" defaultValue="dont" options={[{ value: 'dont', label: "Don't reset invoice age" }]} width="200px" />
      
      <Box sx={{ width: '20px' }} />
      <ReportCheckbox 
        label="Hide Patient Names" 
        checked={hidePatientNames}
        onChange={(e) => setHidePatientNames(e.target.checked)}
      />
    </>
  );

  const bottomRowLeftActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#3CA2E0', '&:hover': { bgcolor: '#2d84bb' } }}>Generate Batch Statement</Button>
      <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#00BBAB', '&:hover': { bgcolor: '#009b8e' } }}>View generated statements</Button>
    </Box>
  );

  return (
    <ReportLayout title="Patient Aging Report">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        bottomRowLeftActions={bottomRowLeftActions}
        onApplyFilters={() => console.log('Apply Filters')}
        onCreateTemplate={() => console.log('Create Template')}
        onExportCsv={() => alert('Exporting as CSV...')}
        onPrint={() => window.print()}
      />

      <PatientAgingReportTable 
        reportData={dummyData}
        agingBuckets={agingBuckets}
        hidePatientNames={hidePatientNames}
      />

      {/* Summary Footer */}
      <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
        <Table size="small">
          <TableBody>
            {[
              { label: 'Total Outstanding Balances', values: ['28,802.75', '10,452.94', '2,808.96', '764.50', '903.50', '7,677.87', '6,146.28'], total: '57,556.80' },
              { label: 'Total Patients Balances', values: ['7,452.05', '1,074.18', '935.56', '764.50', '83.00', '2,482.12', '3,951.58'], total: '16,742.99' },
              { label: 'Total Insurance Balances', values: ['21,350.70', '9,378.76', '1,873.40', '0.00', '820.50', '5,195.75', '2,194.70'], total: '40,813.81' }
            ].map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                <TableCell sx={{ width: '25%', fontWeight: 600 }}>{row.label}</TableCell>
                {row.values.map((val, i) => (
                  <TableCell key={i} align="right" sx={{ width: '8%', fontWeight: 600 }}>${val}</TableCell>
                ))}
                <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>${row.total}</TableCell>
                <TableCell sx={{ width: '15%' }}></TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>$10,546.81</TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>$47,009.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </ReportLayout>
  );
};

export default PatientAgingReport;
