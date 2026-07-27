import React, { useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TotalCollectionIndividualsTable = ({ data = [] }) => {
  const totals = useMemo(() => {
    let ptSum = 0;
    let insSum = 0;
    let totalSum = 0;

    data.forEach(row => {
      ptSum += parseFloat((row.patientCollection || '0').replace(/[$,]/g, '')) || 0;
      insSum += parseFloat((row.insuranceCollection || '0').replace(/[$,]/g, '')) || 0;
      totalSum += parseFloat((row.totalCollection || '0').replace(/[$,]/g, '')) || 0;
    });

    const fmt = (val) => {
      if (val === 0) return '$0.00';
      if (val < 0) return `-$${Math.abs(val).toFixed(2)}`;
      return `$${val.toFixed(2)}`;
    };

    return {
      patient: fmt(ptSum),
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
              <TableCell>ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Patient Collection</TableCell>
              <TableCell>Insurance Collection</TableCell>
              <TableCell>Total Collection</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {row.name}
                </TableCell>
                <TableCell sx={{ color: (row.patientCollection || '').startsWith('-') ? '#d93025' : '#1e293b' }}>
                  {row.patientCollection}
                </TableCell>
                <TableCell>{row.insuranceCollection}</TableCell>
                <TableCell>{row.totalCollection}</TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            {data.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell colSpan={2} sx={{ py: 1.5, fontWeight: 700, color: '#334155', borderBottom: 'none' }}>
                  Total
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: totals.patient.startsWith('-') ? '#d93025' : '#0f172a', borderBottom: 'none' }}>
                  {totals.patient}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.insurance}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  {totals.total}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TotalCollectionIndividualsTable;
