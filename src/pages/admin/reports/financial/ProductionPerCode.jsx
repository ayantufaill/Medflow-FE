import React from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Checkbox, FormControlLabel, Button, TableCell, TableRow, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const ProductionPerCode = () => {
  const tableHeaders = [
    { label: 'Code' },
    { label: 'Procedure' },
    { label: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Quantity <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box>, align: 'right' },
    { label: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Total Production <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box>, align: 'right' },
    { label: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Average Production <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box>, align: 'right' },
    { label: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Percent Production <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box>, align: 'right' },
  ];

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
        label="all" 
        prefix="Filter Report by:" 
        defaultValue="all"
        options={[{ value: 'all', label: 'Provider: All' }]}
      />
      
      <ReportSelect 
        label="all" 
        defaultValue="all"
        options={[{ value: 'all', label: 'Referral Provider: All' }]}
      />

      <ReportSelect 
        label="none" 
        defaultValue="none"
        options={[{ value: 'none', label: 'Group by: None' }]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show collection per code" />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 600, textDecoration: 'underline' }}>Enter Code</Typography>
        <TextField 
          size="small" 
          variant="outlined"
          placeholder="Enter code or procedure" 
          sx={{ width: 200, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.75rem', backgroundColor: '#fff' } }} 
        />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Production per code:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Table Section */}
      <ReportDataTable 
        columns={tableHeaders} 
        data={[]} 
        renderRow={() => null} 
      />
      <Box sx={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderTop: 'none', py: 1.5, px: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex' }}>
             <Typography sx={{ fontSize: '0.8rem', minWidth: 240 }}>Total Production Charges:</Typography>
             <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>$0.00</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex' }}>
             <Typography sx={{ fontSize: '0.8rem', minWidth: 240 }}>Average Charge For All Procedures:</Typography>
             <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>$0.00</Typography>
          </Grid>
        </Grid>
      </Box>
    </ReportLayout>
  );
};

export default ProductionPerCode;

