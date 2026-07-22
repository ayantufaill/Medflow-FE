import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

const ProviderCollectionPaymentTypeTable = ({
  loading,
  sortedReportData,
  showFlags,
  totals,
  summaryStats
}) => {
  return (
    <>
      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
        <TableContainer 
          id="provider-collection-payment-table" 
          elevation={0} 
          sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
              <CircularProgress size={30} />
            </Box>
          )}
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell rowSpan={2}>Date</TableCell>
                <TableCell rowSpan={2}>Flags</TableCell>
                <TableCell rowSpan={2}>Patient</TableCell>
                <TableCell rowSpan={2}>Code</TableCell>
                <TableCell rowSpan={2}>Procedure</TableCell>
                <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e2e8f0' }}>Provider / Internal Code</TableCell>
                <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e2e8f0' }}>Collection</TableCell>
                <TableCell align="right" rowSpan={2} sx={{ borderLeft: '1px solid #e2e8f0' }}>Adjustment</TableCell>
                <TableCell align="right" rowSpan={2}>Pt. Refund</TableCell>
                <TableCell align="right" rowSpan={2}>Ins. Refund</TableCell>
                <TableCell align="right" rowSpan={2}>Pay From Credit</TableCell>
                <TableCell align="right" rowSpan={2}>New Credit</TableCell>
              </TableRow>
              <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell align="center" sx={{ borderLeft: '1px solid #e2e8f0' }}>Render</TableCell>
                <TableCell align="center">Bill</TableCell>
                <TableCell align="right" sx={{ borderLeft: '1px solid #e2e8f0' }}>Insurance Payment</TableCell>
                <TableCell align="right">Patient Payment</TableCell>
                <TableCell align="right">Actual Write-off</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReportData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No records found matching current criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedReportData.map((row, idx) => (
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
                    <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {showFlags && row.flags && row.flags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {row.flags.map((color, i) => (
                            <Box key={i} sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color, flexShrink: 0 }} />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient || 'Patient'}</TableCell>
                    <TableCell>{row.code || '-'}</TableCell>
                    <TableCell>{row.procedure || '-'}</TableCell>
                    <TableCell align="center">{row.render || '-'}</TableCell>
                    <TableCell align="center">{row.bill || '-'}</TableCell>
                    <TableCell align="right">${(row.ins || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.pt || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.actual || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.ptRef || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.insRef || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.payFrom || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.newCredit || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
              <TableRow sx={{ '& td': { fontWeight: 700, fontSize: '0.75rem', color: '#1e293b', borderTop: '2px solid #e0e0e0', py: 1.5 } }}>
                <TableCell colSpan={7} align="right">Total:</TableCell>
                <TableCell align="right">${totals.totalIns.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalPt.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalActualWriteOff.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalCollAdj.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalPtRef.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalInsRef.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalPayFrom.toFixed(2)}</TableCell>
                <TableCell align="right">${totals.totalRefundTo.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer Summary Section */}
      <Box id="provider-collection-payment-footer" sx={{ mt: 3, ml: 4 }}>
        {summaryStats.map((stat, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 260, color: '#3b82f6' }}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default ProviderCollectionPaymentTypeTable;
