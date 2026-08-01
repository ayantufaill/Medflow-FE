import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CollectionCarrierTable = ({ carriers = [] }) => {
  return (
    <Box>
      {carriers.map((carrier, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          {/* Section Header */}
          <Typography sx={{ color: '#2262ef', fontWeight: 700, fontSize: '0.95rem', mb: 1.5 }}>
            {carrier.name}
          </Typography>

          {/* Patients Data Table */}
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                    <TableCell>Patient</TableCell>
                    <TableCell>Collection</TableCell>
                    <TableCell>Production</TableCell>
                    <TableCell>Write-off</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrier.patients.map((p, pIdx) => (
                    <TableRow key={pIdx} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                      <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                        {p.name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{p.collection}</TableCell>
                      <TableCell>{p.production}</TableCell>
                      <TableCell>{p.writeoff}</TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Summary Row */}
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#334155', borderBottom: 'none' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      {carrier.collection}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      {carrier.production}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      {carrier.writeoff}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CollectionCarrierTable;
