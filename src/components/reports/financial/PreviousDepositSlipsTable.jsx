import React from 'react';
import {
  Box,
  Typography,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const PreviousDepositSlipsTable = ({ displaySlips, isSlipsExpanded, setIsSlipsExpanded }) => {
  return (
    <Box className="no-print">
      <Typography 
        variant="body2" 
        onClick={() => setIsSlipsExpanded(!isSlipsExpanded)}
        sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
      >
        <Box component="span" sx={{ mr: 1, display: 'inline-block', transform: isSlipsExpanded ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>⌄</Box> Previous Deposit Slips:
      </Typography>
      <Collapse in={isSlipsExpanded}>
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1.5, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                  <TableCell>Date of Slip</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displaySlips.map((row, idx) => {
                  const displayDate = row.date && !isNaN(Date.parse(row.date)) 
                    ? new Date(row.date).toLocaleDateString() 
                    : row.date || '-';
                  const displayAmount = typeof row.amount === 'number' 
                    ? `$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                    : row.amount ? `$${row.amount}` : '$0.00';
                  return (
                    <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                      <TableCell>{displayDate}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{displayAmount}</TableCell>
                      <TableCell>{row.memo || row.bankAccountInfo || ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PreviousDepositSlipsTable;
