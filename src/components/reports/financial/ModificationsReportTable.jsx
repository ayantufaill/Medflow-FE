import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';

const ModificationsReportTable = ({ mappedModifications = [], loading = false }) => {
  const totalFees = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.fees || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCreditAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.creditAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalDebitAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.debitAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCollection = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.collection || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalAccountCredit = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.accountCredit || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const netProd = totalFees + totalCreditAdj + totalDebitAdj;

  const formatAmount = (val, prefix = '') => {
    if (val === 0) return '$0.00';
    if (val < 0) return `-$${Math.abs(val).toFixed(2)}`;
    return `${prefix}$${val.toFixed(2)}`;
  };

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer id="modifications-report-table" component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
        <Table size="small" sx={{ minWidth: 800, '& .MuiTableCell-root': { borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', px: 1.5, py: 1.5 } }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b', borderRight: '1px solid #e2e8f0' } }}>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Action</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>transaction #</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>procedures</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>rendering prov / internal code</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>billing prov / internal code</TableCell>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>production</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>collection</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>account credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', borderRight: '1px solid #e2e8f0' }}>fees</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', borderRight: '1px solid #e2e8f0' }}>credit adj</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', borderRight: '1px solid #e2e8f0' }}>debit adj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : mappedModifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
                  No modifications found for selected date.
                </TableCell>
              </TableRow>
            ) : (
              mappedModifications.map((row, index) => {
                const isAdd = row.action === 'Add';
                const isVoid = row.action === 'Void';
                const bgColor = isAdd ? '#e6f4ea' : isVoid ? '#fce8e6' : '#fff';
                const textColor = isAdd ? '#007b3e' : isVoid ? '#d93025' : '#000';
                const collectionColor = (row.collection || '').startsWith('-') ? '#d93025' : (row.collection || '').startsWith('+') ? '#007b3e' : '#000';

                return (
                  <TableRow key={index} sx={{ backgroundColor: bgColor }}>
                    <TableCell sx={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>{row.action}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#0052cc', textDecoration: 'underline' }}>{row.trans}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.proc}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.rendering}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.billing}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.fees}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: (row.creditAdj || '').startsWith('-') ? '#007b3e' : (row.creditAdj || '').startsWith('+') ? '#d93025' : '#000' }}>{row.creditAdj}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.debitAdj}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: collectionColor }}>{row.collection}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: (row.accountCredit || '').startsWith('+') ? '#007b3e' : '#000' }}>{row.accountCredit}</TableCell>
                  </TableRow>
                );
              })
            )}

            {!loading && mappedModifications.length > 0 && (
              <>
                {/* Totals Rows */}
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell colSpan={5} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>totals modifications</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{formatAmount(totalFees)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalCreditAdj < 0 ? '#d93025' : '#000' }}>{formatAmount(totalCreditAdj)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{formatAmount(totalDebitAdj)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalCollection < 0 ? '#d93025' : totalCollection > 0 ? '#007b3e' : '#000' }}>{formatAmount(totalCollection, '+')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalAccountCredit < 0 ? '#d93025' : totalAccountCredit > 0 ? '#007b3e' : '#000' }}>{formatAmount(totalAccountCredit, '+')}</TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell colSpan={3} sx={{ border: 'none' }}></TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', backgroundColor: '#f5f5f5' }}>net prod modification</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', backgroundColor: '#f5f5f5' }}>(prod + adj)</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', backgroundColor: '#f5f5f5', color: netProd < 0 ? '#d93025' : '#000' }}>{formatAmount(netProd)}</TableCell>
                  <TableCell colSpan={4} sx={{ border: 'none' }}></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ModificationsReportTable;
