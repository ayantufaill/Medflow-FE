import React from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const PatientAgingReport = () => {
  const agingBuckets = [
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ];

  const dummyData = [
    {
      flags: [],
      name: 'John Doe',
      buckets: {
        '0 - 30 days': { pt: 1904.33, ins: 0 },
        '31 - 60 days': { pt: 0, ins: 0 },
        '61 - 90 days': { pt: 0, ins: 0 },
        '91 - 120 days': { pt: 0, ins: 0 },
        '121 - 150 days': { pt: 0, ins: 0 },
        '151 - 180 days': { pt: 0, ins: 0 },
        '> 180 day': { pt: 0, ins: 0 },
      },
      total: 1904.33,
      totalOwings: 3904.33,
      paymentPlan: 0,
      credit: 0,
      lastBilled: '',
    },
    {
      flags: [],
      name: 'Jane Smith',
      buckets: {
        '0 - 30 days': { pt: 1724.00, ins: 0 },
        '31 - 60 days': { pt: 0, ins: 0 },
        '61 - 90 days': { pt: 0, ins: 0 },
        '91 - 120 days': { pt: 0, ins: 0 },
        '121 - 150 days': { pt: 0, ins: 0 },
        '151 - 180 days': { pt: 0, ins: 0 },
        '> 180 day': { pt: 0, ins: 0 },
      },
      total: 1724.00,
      totalOwings: 3724.00,
      paymentPlan: 0,
      credit: 0,
      lastBilled: '',
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Patient Aging Report:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <Select size="small" defaultValue="any" sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff' }}>
              <MenuItem value="any">Any AR Range</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Select size="small" defaultValue="pts" sx={{ minWidth: 200, fontSize: '0.75rem', backgroundColor: '#fff' }}>
            <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
          </Select>
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked />} 
            label={<Typography variant="caption">Show Flags in Report</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
          <Select size="small" defaultValue="high-low" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
            <MenuItem value="high-low">High to Low Owings</MenuItem>
          </Select>
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked />} 
            label={<Typography variant="caption">Show Payment Plan Owing</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Reset Invoice outstanding balance age to 0 days: 
            <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'help' }}>ⓘ</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">On Patient Payment:</Typography>
            <Select size="small" defaultValue="dont" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
              <MenuItem value="dont">Don't reset invoice age</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#94a3b8' }}>Generate Batch Statement</Button>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>View generated statements</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel 
            control={<Checkbox size="small" />} 
            label={<Typography variant="caption">Hide Patient Names</Typography>} 
          />
          <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
              <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient Name</TableCell>
              {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket}</TableCell>)}
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Total owings</TableCell>
              <TableCell align="right">Payment Plan Owing</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell>Last Billed On</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
                <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                    </Box>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>{row.name}</Typography>
                  </Box>
                </TableCell>
                {agingBuckets.map(bucket => (
                  <TableCell key={bucket} align="right">
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block' }}>Pt. ${row.buckets[bucket].pt.toFixed(2)}</Typography>
                    </Box>
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Typography variant="caption" sx={{ display: 'block' }}>${row.total.toFixed(2)}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${row.totalOwings.toFixed(2)}</TableCell>
                <TableCell align="right">${row.paymentPlan.toFixed(2)}</TableCell>
                <TableCell align="right">${row.credit.toFixed(2)}</TableCell>
                <TableCell>{row.lastBilled}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer' }}>
                    <NoteAddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">add account note</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
        <Table size="small">
          <TableBody>
            {[
              { label: 'Total Outstanding Balances', values: ['28,802.75', '10,452.94', '2,808.96', '764.50', '903.50', '7,677.87', '6,146.28'], total: '57,556.80' },
              { label: 'Total Patients Balances', values: ['7,452.05', '1,074.18', '935.56', '764.50', '83.00', '2,482.12', '3,951.58'], total: '16,742.99' },
              { label: 'Total Insurance Balances', values: ['21,350.70', '9,378.76', '1,873.40', '0.00', '820.50', '5,195.75', '2,194.70'], total: '40,813.81' }
            ].map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                <TableCell sx={{ width: '25%', fontWeight: 600 }}>{row.label}</TableCell>
                {row.values.map((val, i) => (
                  <TableCell key={i} align="right" sx={{ width: '8%', fontWeight: 600 }}>${val}</TableCell>
                ))}
                <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>${row.total}</TableCell>
                <TableCell sx={{ width: '15%' }}></TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>$10,546.81</TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>$47,009.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default PatientAgingReport;
