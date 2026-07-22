import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CourtesyCreditModificationsTable = ({ dummyData }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="courtesy-credit-mod-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
      >
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Date modified</TableCell>
              <TableCell>Modified by User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    No modifications found matching criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dummyData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.authorizedBy || row.user || ''}</TableCell>
                  <TableCell>{row.action || row.type || ''}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.patient}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.creditAmount || row.amount || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditModificationsTable;
