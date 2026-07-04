import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput } from '../../../../components/reports/ui';

const ProceduresInsurance = () => {
  const [payerName, setPayerName] = useState('');

  const topFilters = (
    <>
      <ReportSelect 
        label="Daily" 
        prefix="Date Range:" 
        defaultValue="Daily"
        options={[{ value: 'Daily', label: 'Daily' }]}
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
        options={[{ value: 'All', label: 'All' }]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Search by Payer:</Typography>
        <ReportSearchInput 
          placeholder="Enter Name"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          width="220px"
        />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Procedures By Insurance Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onPrint={() => window.print()}
      />

      <Box sx={{ pt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography sx={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>Please select a payer</Typography>
        </Box>
      </Box>
    </ReportLayout>
  );
};

export default ProceduresInsurance;

