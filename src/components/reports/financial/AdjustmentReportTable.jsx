import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const AdjustmentReportTable = ({ 
  loading, 
  sortedReportData, 
  groupedData, 
  grouping, 
  showProviderColumn, 
  showFlags, 
  showDOB, 
  getRowDisplayValues 
}) => {
  const getColumns = () => {
    let cols = [
      { label: 'Date', show: true },
      { label: 'Flags', show: showFlags },
      { label: 'Patient', show: true },
      { label: 'Transaction #', show: true },
      { label: 'ADA', show: true },
      { label: 'Site', show: true },
      { label: 'Description', show: true },
      { label: <React.Fragment key="rendering">Rendering Provider <InfoOutlinedIcon className="no-print" sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment>, show: showProviderColumn },
      { label: <React.Fragment key="billing">Billing Provider <InfoOutlinedIcon className="no-print" sx={{ fontSize: 12, verticalAlign: 'middle' }} /></React.Fragment>, show: showProviderColumn },
      { label: 'Adj', align: 'right', show: true },
      { label: 'Adjustment Type', show: true },
      { label: 'DOB', show: showDOB },
    ];
    return cols.filter(c => c.show !== false);
  };

  const columns = getColumns();

  const renderDataRow = (row, idx) => {
    const display = getRowDisplayValues(row);
    return (
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
        <TableCell>{display.date}</TableCell>
        {showFlags && (
          <TableCell>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {display.flags.map((color, i) => (
                <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
              ))}
            </Box>
          </TableCell>
        )}
        <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{display.patient}</TableCell>
        <TableCell>{display.transaction}</TableCell>
        <TableCell>{display.ada}</TableCell>
        <TableCell>{display.site}</TableCell>
        <TableCell>{display.description}</TableCell>
        {showProviderColumn && <TableCell>{display.rendering}</TableCell>}
        {showProviderColumn && <TableCell>{display.billing}</TableCell>}
        <TableCell align="right" sx={{ fontWeight: 600 }}>{display.adj}</TableCell>
        <TableCell>{display.type}</TableCell>
        {showDOB && <TableCell>{display.dob}</TableCell>}
      </TableRow>
    );
  };

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="adjustment-report-table" 
        elevation={0} 
        sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' }, position: 'relative', maxHeight: '600px' }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        <Table size="small" sx={{ minWidth: 1000 }} stickyHeader>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
              {columns.map((col, i) => (
                <TableCell key={i} align={col.align || 'left'}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {col.label} {i > 0 && typeof col.label === 'string' && <UnfoldMoreIcon className="no-print" sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} />}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedReportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    No adjustments found matching current criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              grouping !== 'no-grouping' && groupedData ? (
                Object.entries(groupedData).map(([groupName, groupRows], gIdx) => {
                  const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
                  const formattedSubtotal = subtotal < 0 ? `-$${Math.abs(subtotal).toFixed(2)}` : `$${subtotal.toFixed(2)}`;

                  return (
                    <React.Fragment key={gIdx}>
                      <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                        <TableCell colSpan={columns.length} sx={{ py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
                              {grouping === 'group-provider' ? 'Provider' : 'Adjustment Type'}: {groupName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', ml: 2 }}>
                              ({groupRows.length} records)
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      {groupRows.map((row, idx) => renderDataRow(row, `${gIdx}-${idx}`))}
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell colSpan={columns.length - (showDOB ? 3 : 2)} align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: '2px solid #e2e8f0' }}>
                          Subtotal for {groupName}:
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #e2e8f0' }}>
                          {formattedSubtotal}
                        </TableCell>
                        <TableCell colSpan={showDOB ? 2 : 1} sx={{ borderBottom: '2px solid #e2e8f0' }}></TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              ) : (
                sortedReportData.map((row, idx) => renderDataRow(row, idx))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdjustmentReportTable;
