import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const ProductionReportTable = () => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
            <TableCell>Date</TableCell>
            <TableCell>Flags</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Procedure</TableCell>
            <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
            <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Production</TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.7rem', fontWeight: 700 } }}>
            <TableCell colSpan={5}></TableCell>
            <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
            <TableCell align="center">Bill</TableCell>
            <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Procedure Charge</TableCell>
            <TableCell align="right">Adj</TableCell>
            <TableCell align="right">Estimate write off ⓘ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total:</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductionReportTable;
