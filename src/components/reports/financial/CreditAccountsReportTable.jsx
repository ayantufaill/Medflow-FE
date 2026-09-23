import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const CreditAccountsReportTable = ({ dummyData, loading, groupedData }) => {
  const calculateTotals = (data) => {
    return {
      amount: data.reduce((sum, row) => sum + (row.amount || 0), 0),
      credit: data.reduce((sum, row) => sum + (row.credit || 0), 0),
      insCredit: data.reduce((sum, row) => sum + (row.insCredit || 0), 0)
    };
  };

  const renderRow = (row, idx) => (
    <TableRow 
      key={row.id || idx} 
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
  );

  const tableHeaders = (
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
  );

  const loadingOverlay = loading && (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
      <CircularProgress size={30} />
    </Box>
  );

  // Grouped rendering
  if (groupedData && Object.keys(groupedData).length > 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {Object.entries(groupedData).map(([groupName, groupRows]) => {
          const totals = calculateTotals(groupRows);
          return (
            <Box key={groupName} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#f1f5f9', px: 2, py: 1, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>
                  {groupName} ({groupRows.length} {groupRows.length === 1 ? 'entry' : 'entries'})
                </Typography>
              </Box>
              <TableContainer 
                elevation={0} 
                sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative', maxHeight: '400px' }}
              >
                {loadingOverlay}
                <Table size="small" sx={{ minWidth: 800 }} stickyHeader>
                  {tableHeaders}
                  <TableBody>
                    {groupRows.map((row, idx) => renderRow(row, idx))}
                    {/* Subtotal Row */}
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell colSpan={4} align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: 'none' }}>
                        Subtotal ({groupRows.length}):
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                        ${totals.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                        ${totals.credit.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                        ${totals.insCredit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })}
      </Box>
    );
  }

  // Default flat rendering
  const flatTotals = calculateTotals(dummyData);
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="credit-accounts-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative', maxHeight: '600px' }}
      >
        {loadingOverlay}
        <Table size="small" sx={{ minWidth: 800 }} stickyHeader>
          {tableHeaders}
          <TableBody>
            {dummyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {loading ? 'Loading...' : 'No data found.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dummyData.map((row, idx) => renderRow(row, idx))
            )}
            {/* Total Row */}
            {dummyData.length > 0 && (
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell colSpan={4} align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: 'none' }}>
                  Total:
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  ${flatTotals.amount.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  ${flatTotals.credit.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                  ${flatTotals.insCredit.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreditAccountsReportTable;
