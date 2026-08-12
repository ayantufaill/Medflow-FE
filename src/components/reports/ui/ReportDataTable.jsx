import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const ReportDataTable = ({ columns, data, renderRow, loading, emptyMessage = "No data available." }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ 
      bgcolor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
      mt: 1 
    }}>
      <Table size="small" stickyHeader>
        <TableHead sx={{ backgroundColor: "rgba(240, 244, 249, 0.6)" }}>
          <TableRow sx={{ '& th': { fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif", py: 1.5, backgroundColor: 'transparent' } }}>
            {columns.map((col, idx) => (
              <TableCell key={idx} align={col.align || 'left'} sx={col.sx} padding={col.padding || 'normal'}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& .MuiTableRow-root:hover': { backgroundColor: '#f8fafc' }, '& .MuiTableCell-root': { fontSize: "0.85rem", verticalAlign: "middle", borderBottom: '1px solid #e2e8f0' } }}>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : data && data.length > 0 ? (
            data.map((row, idx) => renderRow(row, idx))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportDataTable;
