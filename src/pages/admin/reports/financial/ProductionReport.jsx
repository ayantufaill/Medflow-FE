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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const ProductionReport = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
            <Select size="small" defaultValue="all" sx={{ minWidth: 140, fontSize: '0.75rem' }}>
              <MenuItem value="all">Provider: All</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row defaultValue="no-grouping">
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item>
            <RadioGroup row defaultValue="filter">
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 1 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked />} 
            label={<Typography variant="caption">Show Flags in Report</Typography>} 
          />
          <Select size="small" defaultValue="pts" sx={{ minWidth: 200, fontSize: '0.75rem' }}>
            <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
            <Select size="small" defaultValue="default" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
              <MenuItem value="default">Default</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Production</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
              <TableCell colSpan={5}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Procedure Charge</TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell align="right">Estimate write off ⓘ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total:</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Summary */}
      <Box sx={{ mt: 3, ml: 4 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>Net est. Production:</Box> 
          <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>Total Charge + Adj(+/-) - Est Write Off = $0.00</Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          Number of Seen Patients: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>0</Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Average Production Per Patient: <Box component="span" sx={{ ml: 2, fontWeight: 700 }}>$0.00</Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Switch to new</Typography>
      </Box>
    </Box>
  );
};

export default ProductionReport;
