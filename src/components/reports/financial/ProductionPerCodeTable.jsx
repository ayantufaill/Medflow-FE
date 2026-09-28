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
  TableFooter,
  CircularProgress
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const TableHeader = ({ showCollection }) => (
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
      {showCollection && (
        <TableCell align="right">
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            Total Collection <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />
          </Box>
        </TableCell>
      )}
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
);

const DataRows = ({ rows, showCollection }) => (
  <>
    {rows.map((row, idx) => (
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
        {showCollection && (
          <TableCell align="right">${(row.totalCollection || 0).toFixed(2)}</TableCell>
        )}
        <TableCell align="right">${(row.avgProduction || 0).toFixed(2)}</TableCell>
        <TableCell align="right">{(row.percentProduction || 0).toFixed(2)}%</TableCell>
      </TableRow>
    ))}
  </>
);

const TotalsFooter = ({ rows, showCollection }) => {
  const totals = useMemo(() => {
    const totalQty = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const totalProd = rows.reduce((sum, r) => sum + (r.totalProduction || 0), 0);
    const totalColl = showCollection ? rows.reduce((sum, r) => sum + (r.totalCollection || 0), 0) : 0;
    const avgProd = totalQty > 0 ? totalProd / totalQty : 0;
    const totalPercent = rows.reduce((sum, r) => sum + (r.percentProduction || 0), 0);
    return { totalQty, totalProd, totalColl, avgProd, totalPercent };
  }, [rows, showCollection]);

  return (
    <TableFooter>
      <TableRow sx={{ '& td': { fontSize: '0.75rem', fontWeight: 700, py: 1.5, borderTop: '2px solid #e2e8f0', backgroundColor: '#f8f9fa', color: '#1e293b' } }}>
        <TableCell colSpan={2} sx={{ fontWeight: 700 }}>Totals</TableCell>
        <TableCell align="right">{totals.totalQty}</TableCell>
        <TableCell align="right">${totals.totalProd.toFixed(2)}</TableCell>
        {showCollection && (
          <TableCell align="right">${totals.totalColl.toFixed(2)}</TableCell>
        )}
        <TableCell align="right">${totals.avgProd.toFixed(2)}</TableCell>
        <TableCell align="right">{totals.totalPercent.toFixed(2)}%</TableCell>
      </TableRow>
    </TableFooter>
  );
};

const ProductionPerCodeTable = ({ loading, reportData }) => {
  // Detect if data is grouped by provider
  const isGrouped = reportData && reportData.grouped === true && Array.isArray(reportData.groups);
  const isFlatObj = reportData && reportData.showCollection === true && Array.isArray(reportData.rows);
  const showCollection = reportData && reportData.showCollection === true;
  
  // Flatten all rows for ungrouped data
  const flatRows = isGrouped ? [] : (isFlatObj ? reportData.rows : (Array.isArray(reportData) ? reportData : []));
  const isEmpty = isGrouped 
    ? reportData.groups.every(g => g.rows.length === 0) 
    : flatRows.length === 0;

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

        {isGrouped ? (
          // Grouped by provider - render a section per provider
          reportData.groups.map((group, gIdx) => (
            <Box key={gIdx} sx={{ mb: gIdx < reportData.groups.length - 1 ? 2 : 0 }}>
              <Box sx={{ px: 2, py: 1.5, backgroundColor: '#eef2ff', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8rem' }}>
                  {group.providerName || 'Unassigned'}
                </Typography>
              </Box>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHeader showCollection={showCollection} />
                <TableBody>
                  {group.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={showCollection ? 7 : 6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No records for this provider.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <DataRows rows={group.rows} showCollection={showCollection} />
                  )}
                </TableBody>
                {group.rows.length > 0 && <TotalsFooter rows={group.rows} showCollection={showCollection} />}
              </Table>
            </Box>
          ))
        ) : (
          // Flat (ungrouped) table
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHeader showCollection={showCollection} />
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={showCollection ? 7 : 6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No records found matching current criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <DataRows rows={flatRows} showCollection={showCollection} />
              )}
            </TableBody>
            {!isEmpty && <TotalsFooter rows={flatRows} showCollection={showCollection} />}
          </Table>
        )}
      </TableContainer>

      {/* Footer for print */}
      <Box id="production-per-code-footer" sx={{ display: 'none' }}>
        <Typography variant="caption">
          Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductionPerCodeTable;
