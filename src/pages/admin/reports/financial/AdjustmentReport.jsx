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
  Tooltip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AdjustmentReport = () => {
  const dummyData = [
    {
      date: '05/08/26',
      flags: ['#f5a623', '#4a90e2', '#e11d48'],
      patient: 'John Doe',
      transaction: '25199',
      ada: 'D1110',
      site: '',
      description: 'hygiene',
      rendering: 'Dr. Smith',
      billing: 'Office A',
      adj: -96.00,
      type: 'Insurance Write Off'
    },
    {
      date: '05/08/26',
      flags: ['#f5a623', '#4a90e2'],
      patient: 'Jane Smith',
      transaction: '25203',
      ada: 'D0220',
      site: '19',
      description: 'PA1',
      rendering: 'Dr. Brown',
      billing: 'Office B',
      adj: -27.00,
      type: 'Insurance Write Off'
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
          Adjustment Report:
        </Typography>
        <Tooltip title="Adjustment Details">
          <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary', cursor: 'pointer' }} />
        </Tooltip>
      </Box>

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
            <Button variant="contained" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#4a90e2', py: 0 }}>Select Provider ⌄</Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Adjustment Type:</Typography>
            <Select size="small" defaultValue="all" sx={{ minWidth: 160, fontSize: '0.75rem' }}>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <RadioGroup row defaultValue="no-grouping">
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
              <FormControlLabel value="group-adj" control={<Radio size="small" />} label={<Typography variant="caption">Group By Adjustment</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item>
            <RadioGroup row defaultValue="filter">
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 0.5 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by Production Date</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Flags in Report</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Date of Birth</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Provider</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by DOS</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" defaultValue="pts" sx={{ minWidth: 180, fontSize: '0.75rem' }}>
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" defaultValue="default" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Area */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Transaction #</TableCell>
              <TableCell>ADA</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Rendering Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
              <TableCell>Billing Provider <InfoOutlinedIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /></TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell>Adjustment Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.2 }}>
                    {row.flags.map((color, i) => (
                      <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                <TableCell>{row.transaction}</TableCell>
                <TableCell>{row.ada}</TableCell>
                <TableCell>{row.site}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.rendering}</TableCell>
                <TableCell>{row.billing}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>-${Math.abs(row.adj).toFixed(2)}</TableCell>
                <TableCell>{row.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdjustmentReport;
