import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportDivider } from '../../../../components/reports/ui';

const AgingReportFilters = () => {
  const topFilters = (
    <>
      <ReportSelect label="BALANCE" defaultValue="BALANCE" />
      <ReportSelect label="OWING" defaultValue="OWING" />
      <ReportSelect label="BILLING DATE" defaultValue="BILLING DATE" />
      <ReportSelect label="CLAIMS" defaultValue="CLAIMS" />
      <ReportSelect label="PATIENTS" defaultValue="PATIENTS" />
      <ReportSelect label="PROVIDER" defaultValue="PROVIDER" />
      <ReportSelect label="AR RANGE" defaultValue="AR RANGE" />
      <ReportSelect label="PTS FLAGS" defaultValue="PTS FLAGS" />
      <ReportSelect label="SORT REPORT" defaultValue="SORT REPORT" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags" defaultChecked />
      <ReportCheckbox label="Payment Plan Owing" defaultChecked />
      <ReportDivider />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
          RESET AGE ON 
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Pt</Typography>
        <ReportSelect defaultValue="dont" options={[{ value: 'dont', label: "Don't reset" }]} sx={{ height: 32, borderRadius: '20px' }} width="120px" />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Ins</Typography>
        <ReportSelect defaultValue="dont" options={[{ value: 'dont', label: "Don't reset" }]} sx={{ height: 32, borderRadius: '20px' }} width="120px" />
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={() => console.log('apply')}
      onCreateTemplate={() => console.log('create')}
      onClearAll={() => console.log('clear')}
    />
  );
};

export default AgingReportFilters;
