import React, { useState, useMemo } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Paper } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const PlanRow = ({ row, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
            </IconButton>
            <Typography sx={{ fontSize: '0.75rem', color: '#2262ef', textDecoration: 'underline', ml: 1, cursor: 'pointer', fontWeight: 600 }}>
              {row.patient}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.createdOn}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.amount}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.totalPayments}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.remainingPayments}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.remainingBalance}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.nextDue || '-'}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: row.missed > 0 ? '#d93025' : '#1e293b' }}>{row.missed}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastBilled || '-'}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastPayment || '-'}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.type}</TableCell>
        <TableCell sx={{ 
          fontSize: '0.75rem', 
          color: row.status === 'Failed' ? '#d93025' : row.status === 'Paid' ? '#166534' : '#1e293b', 
          fontWeight: 600 
        }}>{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: '#f8fafc', p: 2, borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Payment History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Down Payment</TableCell>
                    <TableCell>Charged On</TableCell>
                    <TableCell>Failed On</TableCell>
                    <TableCell>Error Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history && row.history.map((h, i) => (
                    <TableRow key={i} sx={{ backgroundColor: '#fff', '& td': { fontSize: '0.7rem', py: 1 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{h.amount}</TableCell>
                      <TableCell sx={{ color: h.status === 'Paid' ? '#166534' : h.status === 'Failed' ? '#d93025' : '#1e293b', fontWeight: 600 }}>
                        {h.status}
                      </TableCell>
                      <TableCell>{h.created}</TableCell>
                      <TableCell>{h.dueDate || h.due}</TableCell>
                      <TableCell>{h.downPayment}</TableCell>
                      <TableCell>{h.chargedOn || h.charged || '-'}</TableCell>
                      <TableCell>{h.failedOn || h.failed || '-'}</TableCell>
                      <TableCell sx={{ color: '#dc2626' }}>{h.error || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {(!row.history || row.history.length === 0) && (
                    <TableRow sx={{ backgroundColor: '#fff' }}>
                      <TableCell colSpan={8} align="center" sx={{ fontSize: '0.7rem', py: 2, color: 'text.secondary' }}>
                        No history available
                      </TableCell>
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

const PaymentPlansTable = ({ data = [] }) => {
  const totals = useMemo(() => {
    let amtSum = 0;
    let balSum = 0;

    data.forEach(row => {
      amtSum += parseFloat((row.amount || '0').replace(/[$,]/g, '')) || 0;
      balSum += parseFloat((row.remainingBalance || '0').replace(/[$,]/g, '')) || 0;
    });

    const fmt = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return {
      amount: fmt(amtSum),
      balance: fmt(balSum)
    };
  }, [data]);

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Patient</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Payment Amount</TableCell>
              <TableCell>Total Payments</TableCell>
              <TableCell>Remaining Payments</TableCell>
              <TableCell>Remaining Balance</TableCell>
              <TableCell>Next Payment Due</TableCell>
              <TableCell>Missed Payments</TableCell>
              <TableCell>Last Billed On</TableCell>
              <TableCell>Last Payment Due</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <PlanRow key={idx} index={idx} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentPlansTable;
