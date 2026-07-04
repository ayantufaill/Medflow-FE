import React from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Radio, RadioGroup, FormControlLabel, Checkbox, Button
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';

const ProductionCollectionSummary = () => {
  const productionStats = [
    { label: 'Gross Production:', value: '$0.00' },
    { label: 'Net est. Production:', value: 'Total Charge + Adj(+/-) - Est Write Off = $0.00', isFormula: true },
    { label: 'Number of Seen Patients:', value: '0' },
    { label: 'Average Production Per Patient:', value: '$0.00' },
  ];

  const collectionStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: '$1,769.00' },
    { label: 'Total Collection Excl. Pay From Credit:', value: '$1,769.00' },
    { label: 'Collection From Credit:', value: '$0.00' },
    { label: 'Total Prepayments:', value: '$107.70' },
    { label: 'Total Prepayments Excluding Refunds:', value: '$107.70' },
    { label: 'Actual Write-Off:', value: '-$2,574.00' },
    { label: 'Total Collection Adjustments:', value: '$0.00' },
    { label: 'Total Production Adjustments:', value: '$0.00' },
    { label: 'Adjusted Collection Incl. Pay From Credit:', value: '$1,759.10' },
    { label: 'Adjusted Collection Excl. Pay From Credit:', value: '$1,759.10' },
    { label: 'Total Patient Refund:', value: '$0.00' },
    { label: 'Total Insurance Refund:', value: '$0.00' },
    { label: 'Total Overpayment to Credit:', value: '$9.90' },
    { label: 'Total Deposit Slip:', value: '$1,866.80' },
    { label: 'Total Adjustments:', value: '-$2,574.00' },
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
        label="All" 
        prefix="Provider:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'Select Provider' }]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <RadioGroup row defaultValue="no-grouping">
        <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>No Grouping</Typography>} />
        <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Provider</Typography>} />
      </RadioGroup>
      <Box sx={{ ml: 2 }}>
        <ReportCheckbox label="Show Summary Per Day" />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Production & Collection Summary Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Stats Section */}
      <Grid container spacing={4} sx={{ px: 2, py: 3, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Grid item xs={12} md={5}>
          {productionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 180, color: stat.isFormula ? '#337ab7' : 'text.primary' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.isFormula || stat.value !== '$0.00' ? 700 : 400 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={7}>
          {collectionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 260, color: '#337ab7' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.value !== '$0.00' ? 700 : 400, ml: 2 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>

        {/* Footer Calculation */}
        <Grid item xs={12} sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#337ab7' }}>Collection Percentage:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            (Total Collection + Collection Adjustment) / Net est. Production * 100 = 0%
          </Typography>
        </Grid>
      </Grid>
    </ReportLayout>
  );
};

export default ProductionCollectionSummary;

