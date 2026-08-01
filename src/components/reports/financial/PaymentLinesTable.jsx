import React, { useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PaymentLinesTable = ({ data = [] }) => {
  const totalAmount = useMemo(() => {
    const sum = data.reduce((acc, row) => {
      const val = parseFloat((row.amount || '0').replace(/[$,]/g, '')) || 0;
      return acc + val;
    }, 0);
    return `$${sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [data]);

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Down Payment</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Charged On</TableCell>
              <TableCell>Failed On</TableCell>
              <TableCell>Failed Attempts</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Error Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                <TableCell>{row.id || row.patientId || '-'}</TableCell>
                <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {row.patient}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.amount}</TableCell>
                <TableCell>{row.downPayment}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.chargedOn || '-'}</TableCell>
                <TableCell>{row.failedOn || '-'}</TableCell>
                <TableCell>{row.failedAttempts ?? 0}</TableCell>
                <TableCell sx={{ 
                  color: row.status === 'Failed' ? '#d93025' : row.status === 'Paid' ? '#166534' : '#1e293b', 
                  fontWeight: 500 
                }}>
                  {row.status}
                </TableCell>
                <TableCell sx={{ color: '#dc2626', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.error || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentLinesTable;
