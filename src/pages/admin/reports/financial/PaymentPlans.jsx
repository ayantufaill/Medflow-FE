import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Checkbox, FormControlLabel,
  Button, Table, TableBody, TableCell, TableHead, TableRow, Radio, RadioGroup,
  IconButton, Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

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

const Row = ({ row, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
            </IconButton>
            <Typography sx={{ fontSize: '0.75rem', color: '#337ab7', textDecoration: 'underline', ml: 1, cursor: 'pointer' }}>{row.patient}</Typography>
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
        <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Failed' ? '#d93025' : '#000', fontWeight: 500 }}>{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fff' }}>
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
                    <TableRow key={i} sx={{ backgroundColor: '#fff' }}>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.amount}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', color: h.status === 'Paid' ? '#166534' : '#d93025', fontWeight: 500 }}>{h.status}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.created}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.due}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.downPayment}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.charged}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.failed}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{h.error}</TableCell>
                    </TableRow>
                  ))}
                  {row.history.length === 0 && (
                    <TableRow sx={{ backgroundColor: '#fff' }}>
                      <TableCell colSpan={8} align="center" sx={{ fontSize: '0.75rem', py: 2, color: 'text.secondary' }}>No history available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const PaymentPlans = () => {
  const [filterType, setFilterType] = useState('All');

  const columns = [
    { label: 'Patient' },
    { label: 'Created On' },
    { label: 'Payment Amount' },
    { label: 'Total Payments' },
    { label: 'Remaining Payments' },
    { label: 'Remaining Balance' },
    { label: 'Next Payment Due' },
    { label: 'Missed Payments' },
    { label: 'Last Billed On' },
    { label: 'Last Payment Due' },
    { label: 'Type' },
    { label: 'Status' },
  ];

  const topFilters = (
    <>
      <ReportSelect defaultValue="Range" prefix="Created On Date Filter:" options={[{ value: 'Range', label: 'Range' }]} width="100px" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', borderBottom: '1px solid #ccc', pb: 0.5 }}>05/08/2025</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', borderBottom: '1px solid #ccc', pb: 0.5 }}>05/08/2026</Typography>
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportSelect defaultValue="Select Status" prefix="Filter by Status:" options={[{ value: 'Select Status', label: 'Select Status' }]} width="160px" />
        <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#4a89dc', color: '#4a89dc', textTransform: 'none', '&:hover': { backgroundColor: '#f0f7ff' } }}>Failed</Button>
        <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#4a89dc', color: '#4a89dc', textTransform: 'none', '&:hover': { backgroundColor: '#f0f7ff' } }}>Pending</Button>
        <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#4a89dc', color: '#4a89dc', textTransform: 'none', '&:hover': { backgroundColor: '#f0f7ff' } }}>Scheduled</Button>
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter by Type:</Typography>
        <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="All" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>All</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="Manual" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Manual Fee</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="Regular" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Regular Invoices</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="Membership" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Membership Plans</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
      </Box>
      <ReportCheckbox label="Include Archived" />
    </>
  );

  return (
    <ReportLayout title="Payment Plans Report">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onPrint={() => window.print()}
        onExportCsv={() => console.log('Exporting CSV...')}
      />

      {/* Shared Data Table */}
      <ReportDataTable 
        columns={columns} 
        data={MOCK_PAYMENT_PLANS} 
        renderRow={(row, idx) => <Row key={idx} index={idx} row={row} />} 
      />
    </ReportLayout>
  );
};

export default PaymentPlans;
