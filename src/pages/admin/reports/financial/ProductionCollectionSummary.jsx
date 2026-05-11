import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

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

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production & Collection Summary Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Date Range:</Typography>
            <Select size="small" defaultValue="daily" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
              <MenuItem value="daily">Daily</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="primary">⬅ May 08, 2026 ⮕ Date: 05/08/2026</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Provider:</Typography>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#4a90e2' }}>Select Provider ⌄</Button>
          </Grid>
          <Grid item sx={{ ml: 2 }}>
            <RadioGroup row defaultValue="no-grouping">
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Show Summary Per Day</Typography>} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#ef4444' }}>Print</Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={8} sx={{ px: 4 }}>
        <Grid item xs={12} md={5}>
          {productionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 180, color: stat.isFormula ? 'primary.main' : 'inherit' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.isFormula || stat.value !== '$0.00' ? 700 : 400 }}>{stat.value}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={7}>
          {collectionStats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 260, color: 'primary.main' }}>{stat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: stat.value !== '$0.00' ? 700 : 400, ml: 2 }}>{rowValue(stat.value)}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>

      {/* Footer Calculation */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>Collection Percentage:</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          (Total Collection + Collection Adjustment) / Net est. Production * 100 = 0%
        </Typography>
      </Box>
    </Box>
  );
};

// Helper to format values for bolding and color if necessary
const rowValue = (val) => {
  return val;
};

export default ProductionCollectionSummary;
