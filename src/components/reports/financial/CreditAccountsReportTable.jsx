import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const CreditAccountsReportTable = ({ dummyData }) => {
  const totalAmount = dummyData.reduce((sum, row) => sum + (row.amount || 0), 0);
  const totalCredit = dummyData.reduce((sum, row) => sum + (row.credit || 0), 0);
  const totalInsCredit = dummyData.reduce((sum, row) => sum + (row.insCredit || 0), 0);

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="credit-accounts-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
      >
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Patient Name <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Patient Credit</TableCell>
              <TableCell align="right">Insurance Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    No data found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dummyData.map((row, idx) => (
                <TableRow 
                  key={idx} 
                  sx={{ 
                    '& td': { 
                      fontSize: '0.75rem', 
                      py: 1.5, 
                      verticalAlign: 'middle', 
                      borderBottom: '1px solid #e2e8f0', 
                      color: '#1e293b' 
                    } 
                  }}
                >
                  <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell>{row.dob || '-'}</TableCell>
                  <TableCell>{row.email || '-'}</TableCell>
                  <TableCell>{row.phone || '-'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.amount || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.insCredit || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell colSpan={4} align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: 'none' }}>
                Total:
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                ${totalAmount.toFixed(2)}
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                ${totalCredit.toFixed(2)}
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                ${totalInsCredit.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreditAccountsReportTable;
