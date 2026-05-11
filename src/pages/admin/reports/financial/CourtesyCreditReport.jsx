import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const CourtesyCreditReport = () => {
  const dummyData = [
    {
      flags: ['#22c55e', '#ef4444', '#a855f7'],
      id: '6',
      name: 'Patient One',
      amount: 200.00
    },
    {
      flags: [],
      id: '701',
      name: 'Patient Two',
      amount: 149.60
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Courtesy Credit Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Outstanding: All patients</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Patients: All</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={4}>
            <Select fullWidth size="small" variant="standard" defaultValue="pts" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="pts">Filter by Flags: Patients with or without flags</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <TextField
            size="small"
            placeholder="Search by patient name"
            sx={{ width: 250, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.8 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export As CSV</Button>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff', '& th': { fontSize: '0.8rem', fontWeight: 600, py: 1.5 } }}>
              <TableCell>Flags</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Patient Name <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  Amount <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.2 }}>
                    {row.flags.map((color, i) => (
                      <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.name}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${row.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#fcfcfc', '& td': { fontWeight: 700, fontSize: '0.75rem' } }}>
              <TableCell align="right" colSpan={2}>Total</TableCell>
              <TableCell>2 patients</TableCell>
              <TableCell align="right">$349.60</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditReport;
