import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProceduresInsuranceTable = ({ data = [] }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Code</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Insurance</TableCell>
              <TableCell>Claim Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{row.code}</TableCell>
                <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {row.patient}
                </TableCell>
                <TableCell>{row.insurance}</TableCell>
                <TableCell sx={{ 
                  color: row.claimStatus === 'Sent' ? '#166534' : '#64748b', 
                  fontWeight: 600 
                }}>
                  {row.claimStatus}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProceduresInsuranceTable;
