import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';
import ProductionReportTable from './ProductionReportTable';
import ProductionReportSummary from './ProductionReportSummary';

const ProductionReport = () => {
  const topFilters = (
    <>
      <ReportSelect label="Daily" prefix="Date Range:" defaultValue="daily" options={[{ value: 'daily', label: 'Daily' }]} />
      <Typography variant="caption" sx={{ color: '#337ab7', whiteSpace: 'nowrap', mx: 1 }}>⬅ May 08, 2026 ⮕ Date: 05/08/2026</Typography>
      <ReportSelect label="Provider: All" prefix="Filter Report by:" defaultValue="all" options={[{ value: 'all', label: 'Provider: All' }]} />
      <RadioGroup row defaultValue="no-grouping" sx={{ flexWrap: 'nowrap' }}>
        <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>No Grouping</Typography>} sx={{ m: 0, mr: 1 }} />
        <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Group By Provider</Typography>} sx={{ m: 0 }} />
      </RadioGroup>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row defaultValue="filter" sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Filter Codes</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Exclude Codes</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
        <TextField 
          size="small" 
          placeholder="Enter code or procedure" 
          sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } }} 
        />
      </Box>

      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      <ReportSelect defaultValue="pts" options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]} width="180px" />
      <ReportSelect label="Default" prefix="Sort Report By" defaultValue="default" options={[{ value: 'default', label: 'Default' }]} width="140px" />
    </>
  );

  return (
    <ReportLayout title="Production Report">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onCreateTemplate={() => console.log('Create Template')}
        onExportCsv={() => alert('Exporting as CSV...')}
        onPrint={() => window.print()}
      />
      <ProductionReportTable />
      <ProductionReportSummary />
    </ReportLayout>
  );
};

export default ProductionReport;
