import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const CourtesyCreditReportTable = ({ dummyData, totalAmount }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="courtesy-credit-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
      >
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Flags</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Patient Name <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  Amount <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
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
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {(row.flags || []).map((color, i) => (
                        <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{row.id || row.date}</TableCell>
                  <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.name || row.patient}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.amount || row.creditAmount || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell colSpan={2} sx={{ py: 1.5, borderBottom: 'none' }}></TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: 'none' }}>
                Total ({dummyData.length} patients):
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                ${totalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditReportTable;
