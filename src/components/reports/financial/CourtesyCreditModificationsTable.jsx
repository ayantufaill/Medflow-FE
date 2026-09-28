import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPracticeInfo } from '../../../store/slices/practiceInfoSlice';

const CourtesyCreditModificationsTable = ({ dummyData, loading, groupedData }) => {
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

  const resolveFlagColor = (flagVal) => {
    const flagId = typeof flagVal === 'string' ? flagVal : flagVal?.id || flagVal?.text || flagVal?.color;
    const flagIdLower = String(flagId).toLowerCase();
    
    const found = globalFlags.find(f => 
      String(f.id).toLowerCase() === flagIdLower || 
      (f.name && f.name.toLowerCase() === flagIdLower) ||
      (f.text && f.text.toLowerCase() === flagIdLower)
    );
    if (found) return { color: found.color || '#94a3b8', name: found.name || found.text || flagId };
    
    // If it's an object with a color property, use it directly
    if (typeof flagVal === 'object' && flagVal !== null && flagVal.color) {
      return { color: flagVal.color, name: flagVal.name || flagVal.text || 'Flag' };
    }
    
    // Fallback: if flagId looks like a hex code, use it; otherwise default to slate grey
    const isValidHex = typeof flagId === 'string' && flagId.startsWith('#');
    return { color: isValidHex ? flagId : '#94a3b8', name: flagId || 'Flag' };
  };

  const renderRow = (row, idx) => (
    <TableRow key={row.id || idx} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
      <TableCell>{row.date || row.dateModified || ''}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minWidth: '20px' }}>
          {(row.flags || []).length === 0 && <span style={{color:'transparent'}}>-</span>}
          {(row.flags || []).map((flagVal, i) => {
            const { color, name } = resolveFlagColor(flagVal);
            return color ? (
              <Tooltip key={i} title={name} arrow placement="top">
                <Box 
                  sx={{ 
                    width: 14, height: 14, 
                    bgcolor: color, 
                    borderRadius: '2px', 
                    cursor: 'pointer', 
                    display: 'inline-block', 
                    mr: 0.5
                  }} 
                />
              </Tooltip>
            ) : null;
          })}
        </Box>
      </TableCell>
      <TableCell>{row.user || ''}</TableCell>
      <TableCell>{row.actionType || row.action || ''}</TableCell>
      <TableCell>{row.type}</TableCell>
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.patient}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.creditAmount || row.amount || 0).toFixed(2)}</TableCell>
    </TableRow>
  );

  const tableHeaders = (
    <TableHead>
      <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
        <TableCell>Date modified</TableCell>
        <TableCell>Flags</TableCell>
        <TableCell>Modified by User</TableCell>
        <TableCell>Action</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Patient</TableCell>
        <TableCell align="right">Amount</TableCell>
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
          const subtotal = groupRows.reduce((sum, r) => sum + (r.creditAmount || r.amount || 0), 0);
          return (
            <Box key={groupName} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#f1f5f9', px: 2, py: 1, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>
                  Adjustment Type: {groupName} ({groupRows.length} {groupRows.length === 1 ? 'entry' : 'entries'})
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
                      <TableCell colSpan={5} sx={{ py: 1.5, borderBottom: 'none' }}></TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 600, color: '#334155', borderBottom: 'none', fontSize: '0.75rem' }}>
                        Subtotal ({groupRows.length}):
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none', fontSize: '0.75rem' }}>
                        ${subtotal.toFixed(2)}
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
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer 
        id="courtesy-credit-mod-table" 
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
                    {loading ? 'Loading...' : 'No modifications found matching criteria.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dummyData.map((row, idx) => renderRow(row, idx))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourtesyCreditModificationsTable;

