import React, { useState, useEffect, useMemo } from 'react';
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
import { CircularProgress } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const ProductionCollectionSummary = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMode, setDateMode] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [providerFilter, setProviderFilter] = useState('all');

  useEffect(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (dateMode === 'daily') {
      // Just today
    } else if (dateMode === 'weekly') {
      start.setDate(today.getDate() - today.getDay());
      end.setDate(start.getDate() + 6);
    } else if (dateMode === 'monthly') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    if (dateMode !== 'range') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [dateMode]);

  useEffect(() => {
    fetchProductionCollectionSummary();
  }, []);

  const fetchProductionCollectionSummary = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('production-collection-summary', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = [...reportData];
    if (providerFilter !== 'all') {
      data = data.filter(r => r.provider === providerFilter);
    }
    return data;
  }, [reportData, providerFilter]);

  const uniqueProviders = Array.from(new Set(reportData.map(r => r.provider).filter(Boolean)));

  const totalGrossProduction = filteredData.reduce((acc, row) => acc + (row.production || 0), 0);
  const totalCollection = filteredData.reduce((acc, row) => acc + (row.collection || 0), 0);
  const seenPatients = filteredData.length; // Approximate from payments
  const avgProduction = seenPatients > 0 ? (totalGrossProduction / seenPatients) : 0;
  
  const netEstProduction = totalGrossProduction; // Assumed no adj/writeoff in mock
  const collPercent = netEstProduction > 0 ? ((totalCollection / netEstProduction) * 100) : 0;

  const productionStats = [
    { label: 'Gross Production:', value: `$${totalGrossProduction.toFixed(2)}` },
    { label: 'Net est. Production:', value: `Total Charge + Adj(+/-) - Est Write Off = $${netEstProduction.toFixed(2)}`, isFormula: true },
    { label: 'Number of Seen Patients:', value: `${seenPatients}` },
    { label: 'Average Production Per Patient:', value: `$${avgProduction.toFixed(2)}` },
  ];

  const collectionStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: `$${totalCollection.toFixed(2)}` },
    { label: 'Total Collection Excl. Pay From Credit:', value: `$${totalCollection.toFixed(2)}` },
    { label: 'Collection From Credit:', value: '$0.00' },
    { label: 'Total Prepayments:', value: '$0.00' },
    { label: 'Total Prepayments Excluding Refunds:', value: '$0.00' },
    { label: 'Actual Write-Off:', value: '$0.00' },
    { label: 'Total Collection Adjustments:', value: '$0.00' },
    { label: 'Total Production Adjustments:', value: '$0.00' },
    { label: 'Adjusted Collection Incl. Pay From Credit:', value: `$${totalCollection.toFixed(2)}` },
    { label: 'Adjusted Collection Excl. Pay From Credit:', value: `$${totalCollection.toFixed(2)}` },
    { label: 'Total Patient Refund:', value: '$0.00' },
    { label: 'Total Insurance Refund:', value: '$0.00' },
    { label: 'Total Overpayment to Credit:', value: '$0.00' },
    { label: 'Total Deposit Slip:', value: `$${totalCollection.toFixed(2)}` },
    { label: 'Total Adjustments:', value: '$0.00' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Metric,Value\n";
    productionStats.forEach(stat => {
      csvContent += `"${stat.label}","${stat.value.replace(/"/g, '""')}"\n`;
    });
    csvContent += `\n`;
    collectionStats.forEach(stat => {
      csvContent += `"${stat.label}","${stat.value.replace(/"/g, '""')}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_collection_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <Select size="small" value={dateMode} onChange={(e) => setDateMode(e.target.value)} sx={{ minWidth: 100, fontSize: '0.75rem' }}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="range">Range</MenuItem>
            </Select>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>From:</Typography>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => { setStartDate(e.target.value); setDateMode('range'); }} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
            <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>To:</Typography>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => { setEndDate(e.target.value); setDateMode('range'); }} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Provider:</Typography>
            <Select size="small" value={providerFilter} onChange={e => setProviderFilter(e.target.value)} sx={{ minWidth: 140, fontSize: '0.75rem' }}>
              <MenuItem value="all">Provider: All</MenuItem>
              {uniqueProviders.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
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
            <Button variant="contained" size="small" onClick={fetchProductionCollectionSummary} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#ef4444' }}>Print</Button>
      </Box>

      {/* Stats Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}

      {/* Footer Calculation */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>Collection Percentage:</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          (Total Collection + Collection Adjustment) / Net est. Production * 100 = {collPercent.toFixed(1)}%
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
