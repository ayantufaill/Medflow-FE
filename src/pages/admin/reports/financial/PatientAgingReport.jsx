import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';
import PatientAgingReportTable from './PatientAgingReportTable';

const PatientAgingReport = () => {
  const [hidePatientNames, setHidePatientNames] = useState(false);

  const agingBuckets = ([
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ], []);

  const totals = useMemo(() => {
    const sums = {
      buckets: {},
      totalOutstanding: 0,
      totalPt: 0,
      totalIns: 0,
      totalCredit: 0
    };
    
    agingBuckets.forEach(b => {
      sums.buckets[b] = { total: 0, pt: 0, ins: 0 };
    });

    filteredReportData.forEach(row => {
      let rowPtTotal = 0;
      let rowInsTotal = 0;
      
      agingBuckets.forEach(b => {
        const bData = row.buckets?.[b];
        if (bData) {
          const ptVal = bData.pt || 0;
          const insVal = bData.ins || 0;
          sums.buckets[b].pt += ptVal;
          sums.buckets[b].ins += insVal;
          sums.buckets[b].total += (ptVal + insVal);
          
          rowPtTotal += ptVal;
          rowInsTotal += insVal;
        }
      });
      sums.totalPt += rowPtTotal;
      sums.totalIns += rowInsTotal;
      sums.totalOutstanding += (rowPtTotal + rowInsTotal);
      sums.totalCredit += (row.credit || 0);
    });
    return sums;
  }, [filteredReportData, agingBuckets]);

  const netOutstandingBalance = useMemo(() => {
    return Math.max(0, totals.totalOutstanding - totals.totalCredit);
  }, [totals]);

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
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ width: '25%', fontWeight: 600 }}>Total Outstanding Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ width: '8%', fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>
                ${totals.totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell sx={{ width: '15%' }}></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Patients Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.pt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalPt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Insurance Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.ins.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalIns.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
                ${netOutstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </ReportLayout>
  );
};

export default PatientAgingReport;
