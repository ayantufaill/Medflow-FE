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
  CircularProgress
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const ProductionPerCodeTable = ({ loading, reportData }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="production-per-code-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative' }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Quantity <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Total Production <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Average Production <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  Percent Production <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    No records found matching current criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reportData.map((row, idx) => (
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
                  <TableCell sx={{ fontWeight: 600, color: '#3b82f6' }}>{row.code || '-'}</TableCell>
                  <TableCell>{row.procedure || '-'}</TableCell>
                  <TableCell align="right">{row.quantity || 0}</TableCell>
                  <TableCell align="right">${(row.totalProduction || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(row.avgProduction || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">{(row.percentProduction || 0).toFixed(2)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionPerCodeTable;
