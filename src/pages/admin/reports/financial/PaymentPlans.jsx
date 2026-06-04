import React, { useState, useMemo } from 'react';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');

  const filteredPlans = useMemo(() => {
    let filtered = MOCK_PAYMENT_PLANS;
    if (selectedStatus !== 'Select Status') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }
    if (startDate || endDate) {
      const sDate = startDate ? new Date(startDate) : new Date('1900-01-01');
      const eDate = endDate ? new Date(endDate) : new Date('2100-01-01');
      filtered = filtered.filter(p => {
        const itemDate = new Date(p.createdOn);
        return itemDate >= sDate && itemDate <= eDate;
      });
    }
    return filtered;
  }, [selectedStatus, startDate, endDate]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Patient,Created On,Payment Amount,Total Payments,Remaining Payments,Remaining Balance,Next Payment Due,Missed Payments,Last Billed On,Last Payment Due,Type,Status\n";
    MOCK_PAYMENT_PLANS.forEach(row => {
      csvContent += `"${row.patient}","${row.createdOn}","${row.amount}","${row.totalPayments}","${row.remainingPayments}","${row.remainingBalance}","${row.nextDue}","${row.missed}","${row.lastBilled}","${row.lastPayment}","${row.type}","${row.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_plans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Payment Plans Report:
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: '0.85rem' }}>Filter by Status:</Typography>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          size="small"
          sx={{ fontSize: '0.85rem', minWidth: 120, height: 32, backgroundColor: '#5c85bb', color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
        >
          <MenuItem value="Select Status">Select Status</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
        </Select>
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
        <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
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
            {filteredPlans.map((row, index) => <Row key={index} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentPlans;

