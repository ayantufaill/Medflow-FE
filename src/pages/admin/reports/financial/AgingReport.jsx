import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const AgingReport = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        '0 - 30 days': { pt: 1904.33, ins: 2000.00 },
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
        '0 - 30 days': { pt: 1724.00, ins: 2000.00 },
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

  const renderFilterSelect = (label, options, defaultValue) => (
    <Select
      size="small"
      defaultValue={defaultValue}
      sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff' }}
    >
      <MenuItem value={defaultValue}>{label}</MenuItem>
      {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
    </Select>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Aging Report:
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 36 }}>
          <Tab label="Current Report" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
          <Tab label="Archived Reports" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          {/* Filter Section */}
          <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary' }}>Filter Report By</Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item>{renderFilterSelect('Any Balance', [], 'Any Balance')}</Grid>
              <Grid item>{renderFilterSelect('Any Type of Owing', [], 'Any Type of Owing')}</Grid>
              <Grid item>{renderFilterSelect('Any Billing Date', [], 'Any Billing Date')}</Grid>
              <Grid item>{renderFilterSelect('With OR Without Open Claims', [], 'With OR Without Open Claims')}</Grid>
              <Grid item>{renderFilterSelect('Active Patients Only', [], 'Active Patients Only')}</Grid>
              <Grid item>{renderFilterSelect('All Providers', [], 'All Providers')}</Grid>
              <Grid item>{renderFilterSelect('Any AR Range', [], 'Any AR Range')}</Grid>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption">On Insurance Payment:</Typography>
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
                  <React.Fragment key={idx}>
                    <TableRow sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
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
                            <Typography variant="caption" sx={{ display: 'block' }}>Ins. ${row.buckets[bucket].ins.toFixed(2)}</Typography>
                          </Box>
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ display: 'block' }}>${row.total.toFixed(2)}</Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>$2,000.00</Typography>
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
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Footer */}
          <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ width: '25%', fontWeight: 600 }}>Total Patients Balances</TableCell>
                  {agingBuckets.map((bucket, i) => (
                    <TableCell key={i} align="right" sx={{ width: '8%', fontWeight: 600 }}>
                      ${i === 0 ? '7,452.05' : i === 1 ? '1,074.18' : i === 2 ? '935.56' : i === 3 ? '764.50' : i === 4 ? '83.00' : i === 5 ? '2,482.12' : '3,951.58'}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>$16,742.99</TableCell>
                  <TableCell sx={{ width: '15%' }}></TableCell>
                </TableRow>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
                  {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
                  <TableCell></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>$10,546.81</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Select report by date:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', pb: 0.5, width: 200 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', flexGrow: 1 }}>Enter date</Typography>
              <Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>📅</Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 700, py: 1 }}>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  '05/07/2026', '05/06/2026', '05/05/2026', '05/04/2026', '05/03/2026',
                  '05/02/2026', '05/01/2026', '04/30/2026', '04/29/2026', '04/28/2026',
                  '04/27/2026', '04/26/2026', '04/25/2026', '04/24/2026', '04/23/2026',
                  '04/22/2026'
                ].map((date) => (
                  <TableRow key={date} sx={{ '&:hover': { backgroundColor: '#f1f5f9' } }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 500, cursor: 'pointer' }}>
                        Report - {date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AgingReport;

