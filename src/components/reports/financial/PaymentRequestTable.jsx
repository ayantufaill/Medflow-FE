import React, { useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PaymentRequestTable = ({ data = [] }) => {
  const totals = useMemo(() => {
    let reqSum = 0;
    let paidSum = 0;

    data.forEach(row => {
      reqSum += parseFloat((row.requested || '0').replace(/[$,]/g, '')) || 0;
      paidSum += parseFloat((row.paid || '0').replace(/[$,]/g, '')) || 0;
    });

    const fmt = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return {
      requested: fmt(reqSum),
      paid: fmt(paidSum)
    };
  }, [data]);

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Patient</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Amount Requested</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Date Paid</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {row.patient}
                </TableCell>
                <TableCell>{row.created}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.requested}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.paid}</TableCell>
                <TableCell>{row.date || '-'}</TableCell>
                <TableCell sx={{ 
                  color: (row.status || '').includes('Successful') ? '#166534' : '#64748b', 
                  fontWeight: 600 
                }}>
                  {row.status || '-'}
                </TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            {data.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell colSpan={2} sx={{ py: 1.5, fontWeight: 700, color: '#334155', borderBottom: 'none' }}>
                  Total
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.requested}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.paid}
                </TableCell>
                <TableCell colSpan={2} sx={{ borderBottom: 'none' }}></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentRequestTable;
