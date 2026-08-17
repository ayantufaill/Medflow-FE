import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TablePagination
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import dayjs from 'dayjs';

const LabCasesTable = ({ 
  labCases = [], 
  loading = false, 
  onSort, 
  sortConfig, 
  pagination, 
  onPageChange,
  expandedNotes
}) => {
  
  const handleSort = (key) => {
    let order = 'asc';
    if (sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    onSort({ key, order });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />;
    return sortConfig.order === 'asc' 
      ? <KeyboardArrowUpIcon sx={{ fontSize: 14, ml: 0.5, color: '#2362EF' }} />
      : <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.5, color: '#2362EF' }} />;
  };

  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '400px' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, color: '#475569', backgroundColor: '#f8fafc', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
              <TableCell onClick={() => handleSort('patient')}>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Patient {getSortIcon('patient')}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Lab Provider
                </Box>
              </TableCell>
              <TableCell>Procedures</TableCell>
              <TableCell onClick={() => handleSort('dueDate')}>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Due Date {getSortIcon('dueDate')}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Appointment Date
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Shared Date
                </Box>
              </TableCell>
              <TableCell onClick={() => handleSort('status')}>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Status {getSortIcon('status')}
                </Box>
              </TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : labCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography sx={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No results found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              labCases.map((row) => (
                <TableRow key={row._id}>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.patient?.name || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.laboratory?.name || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                    <div dangerouslySetInnerHTML={{ __html: row.instructions || 'N/A' }} style={{
                      maxHeight: expandedNotes ? 'none' : '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: expandedNotes ? 'block' : '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.dueDate ? dayjs(row.dueDate).format('MM/DD/YYYY') : 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.appointmentDate ? dayjs(row.appointmentDate).format('MM/DD/YYYY') : 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.sentDate ? dayjs(row.sentDate).format('MM/DD/YYYY') : 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#334155' }}>
                     <div dangerouslySetInnerHTML={{ __html: row.instructions || 'N/A' }} style={{
                      maxHeight: expandedNotes ? 'none' : '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: expandedNotes ? 'block' : '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.page || 1) - 1}
          onPageChange={(e, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={pagination.limit || 25}
          rowsPerPageOptions={[25]}
          sx={{ borderTop: '1px solid #e2e8f0', '.MuiTablePagination-toolbar': { minHeight: '40px' } }}
        />
      )}
    </Box>
  );
};

export default LabCasesTable;
