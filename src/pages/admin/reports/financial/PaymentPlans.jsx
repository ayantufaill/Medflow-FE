import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Radio,
  RadioGroup,
  IconButton,
  Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const MOCK_PAYMENT_PLANS = [
  {
    patient: 'Patient One',
    createdOn: '09/18/2025',
    amount: '$2,147.20',
    totalPayments: 6,
    remainingPayments: 3,
    remainingBalance: '$1,073.59',
    nextDue: '12/18/2025',
    missed: 3,
    lastBilled: '',
    lastPayment: '',
    type: 'Regular Invoice',
    status: 'Failed',
    history: [
      { amount: '$357.87', status: 'Paid', created: '09/18/2025', due: '09/18/2025', downPayment: 'No', charged: '09/18/2025', failed: '', error: '' },
      { amount: '$357.87', status: 'Paid', created: '09/18/2025', due: '10/18/2025', downPayment: 'No', charged: '10/18/2025', failed: '', error: '' },
      { amount: '$357.87', status: 'Paid', created: '09/18/2025', due: '11/18/2025', downPayment: 'No', charged: '11/18/2025', failed: '', error: '' },
      { amount: '$357.87', status: 'Failed', created: '09/18/2025', due: '12/18/2025', downPayment: 'No', charged: '', failed: '12/24/2025', error: 'Transaction declined: Insufficient Funds' },
    ]
  },
  {
    patient: 'Patient Two',
    createdOn: '12/15/2025',
    amount: '$420.00',
    totalPayments: 10,
    remainingPayments: 5,
    remainingBalance: '$210.00',
    nextDue: '05/24/2026',
    missed: 0,
    lastBilled: '',
    lastPayment: '',
    type: 'Regular Invoice',
    status: 'Scheduled',
    history: []
  }
];

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
            <Typography sx={{ fontSize: '0.75rem', color: '#0052cc', textDecoration: 'underline', ml: 1 }}>{row.patient}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.createdOn}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.amount}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.totalPayments}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.remainingPayments}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.remainingBalance}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.nextDue}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.missed}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastBilled}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastPayment}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.type}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000' }}>{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: '#f9f9f9', p: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Date Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Down Payment</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Charged On</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Failed On</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Error Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((h, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.amount}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', color: h.status === 'Paid' ? '#007b3e' : '#d93025' }}>{h.status}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.created}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.due}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.downPayment}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.charged}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.failed}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.error}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PaymentPlans = () => {
  const [filterType, setFilterType] = useState('All');

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Payment Plans Report:
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Created On Date Filter:</Typography>
          <Select value="Range" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
            <MenuItem value="Range">Range</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <Typography sx={{ fontSize: '0.85rem', borderBottom: '1px solid #ccc' }}>05/08/2025</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <Typography sx={{ fontSize: '0.85rem', borderBottom: '1px solid #ccc' }}>05/08/2026</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Filter by Status:</Typography>
          <Select value="Select Status" size="small" sx={{ fontSize: '0.85rem', minWidth: 120, height: 32, backgroundColor: '#5c85bb', color: '#fff' }}>
            <MenuItem value="Select Status">Select Status</MenuItem>
          </Select>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28 }}>Failed</Button>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28 }}>Pending</Button>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28 }}>Scheduled</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter by Type:</Typography>
        <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <FormControlLabel value="All" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>All</Typography>} />
          <FormControlLabel value="Manual" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Manual Fee</Typography>} />
          <FormControlLabel value="Regular" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Regular Invoices</Typography>} />
          <FormControlLabel value="Membership" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Membership Plans</Typography>} />
        </RadioGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.85rem' }}>Include Archived</Typography>} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Apply Filters</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Create Template</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Created On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Payment Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Total Payments</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Remaining Payments</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Remaining Balance</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Next Payment Due</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Missed Payments</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Billed On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Payment Due</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_PAYMENT_PLANS.map((row, index) => <Row key={index} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentPlans;

