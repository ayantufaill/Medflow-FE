import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
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
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const ProductionPerCode = () => {
  const tableHeaders = [
    { label: 'Code', align: 'left' },
    { label: 'Procedure', align: 'left' },
    { label: 'Quantity', align: 'right' },
    { label: 'Total Production', align: 'right' },
    { label: 'Average Production', align: 'right' },
    { label: 'Percent Production', align: 'right' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production per code:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
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

            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
                <Select size="small" defaultValue="all" sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                  <MenuItem value="all">Provider: All</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Select size="small" defaultValue="all" sx={{ minWidth: 160, fontSize: '0.75rem' }}>
                  <MenuItem value="all">Referral Provider: All</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Select size="small" defaultValue="none" sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                  <MenuItem value="none">Group by: None</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textDecoration: 'underline' }}>Enter Code</Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="Enter code or procedure" 
              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Show collection per code</Typography>} />
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
            <TableRow sx={{ '& th': { fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary', py: 1.5 } }}>
              {tableHeaders.map((header) => (
                <TableCell key={header.label} align={header.align}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: header.align === 'right' ? 'flex-end' : 'flex-start' }}>
                    {header.label}
                    <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Total Production Charges:</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 700 }}>$0.00</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Average Charge For All Procedures:</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', py: 1, fontWeight: 700 }}>$0.00</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionPerCode;
