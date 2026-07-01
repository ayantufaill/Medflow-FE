import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const commonCellSx = { 
  py: 0, 
  px: '12px', 
  borderBottom: '1px solid #DFE5EC !important', 
  fontSize: '12px',
  whiteSpace: 'nowrap'
};

const blueCellSx = {
  ...commonCellSx,
  bgcolor: '#2362EF',
  color: '#FFFFFF',
  borderBottom: '1px solid #FFFFFF !important'
};

const totalCellSx = {
  ...commonCellSx,
  bgcolor: '#E5F8F7', 
  color: '#00BBAB',
  fontWeight: 'bold',
  borderBottom: '1px solid #DFE5EC !important',
  borderLeft: '1px solid #DFE5EC',
};

const headerSx = {
  ...commonCellSx,
  bgcolor: '#F8FAFC',
  color: '#6B778C',
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  borderBottom: '1px solid #DFE5EC !important'
};

const formatCurrency = (val) => `$${val.toFixed(2)}`;

const AgingTable = ({ view = 'invoices' }) => {
  return (
    <Box sx={{ flex: 1, height: '254px', position: 'relative' }}>
      <TableContainer sx={{ 
        borderRadius: '22px', 
        border: '1px solid #DFE5EC', 
        bgcolor: '#FFFFFF',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Table sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }} size="small">
          <TableHead>
            <TableRow sx={{ height: '32px' }}>
              <TableCell sx={{ ...headerSx, width: '234px', minWidth: '234px', maxWidth: '234px', p: 0 }}></TableCell>
              <TableCell align="right" sx={headerSx}>AGING 0-30</TableCell>
              <TableCell align="right" sx={headerSx}>31-60</TableCell>
              <TableCell align="right" sx={headerSx}>61-90</TableCell>
              <TableCell align="right" sx={headerSx}>&gt;90</TableCell>
              <TableCell align="right" sx={{ ...headerSx, bgcolor: '#00BBAB', color: '#FFF', width: '80px', minWidth: '80px', maxWidth: '80px', p: 0, textAlign: 'center' }}>TOTAL</TableCell>
              <TableCell sx={{ ...headerSx, width: '40px', borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* White Rows */}
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Family Outstanding Bills</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{...totalCellSx, color: '#00BBAB'}}>{formatCurrency(0)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Family Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{...totalCellSx, color: '#00BBAB'}}>{formatCurrency(0)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Insurance Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, color: '#00BBAB' }}>{formatCurrency(0)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>

            {/* Blue Rows */}
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Outstanding Bills</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#6B778C', cursor: 'pointer', fontSize: '10px' }}>&gt;</TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#2362EF', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>RESET</TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Insurance Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(0)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#6B778C', cursor: 'pointer', fontSize: '10px' }}>&lt;</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgingTable;
