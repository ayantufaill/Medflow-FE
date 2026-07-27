import React, { useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const FamilyMigratedBalancesTable = ({ data = [] }) => {
  const totals = useMemo(() => {
    let patSum = 0;
    let insSum = 0;
    let totalSum = 0;

    data.forEach(row => {
      patSum += Number(row.patientOwing) || 0;
      insSum += Number(row.insuranceOwing) || 0;
      totalSum += Number(row.totalOwing) || 0;
    });

    const fmt = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return {
      patient: fmt(patSum),
      insurance: fmt(insSum),
      total: fmt(totalSum)
    };
  }, [data]);

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Patient</TableCell>
              <TableCell>Patient Owing</TableCell>
              <TableCell>Insurance Owing</TableCell>
              <TableCell>Total Owing</TableCell>
              <TableCell>Migration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {row.patient}
                </TableCell>
                <TableCell>${(row.patientOwing || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>${(row.insuranceOwing || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>${(row.totalOwing || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>{row.migrationDate}</TableCell>
              </TableRow>
            ))}
            {/* Totals Summary Row */}
            {data.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#334155', borderBottom: 'none' }}>
                  Total
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.patient}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.insurance}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.total}
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FamilyMigratedBalancesTable;
