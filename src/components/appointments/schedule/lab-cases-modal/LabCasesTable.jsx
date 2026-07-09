import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

const LabCasesTable = () => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '400px' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, color: '#475569', backgroundColor: '#f8fafc', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Patient <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Lab Provider <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>Procedures</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Due Date <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Appointment Date <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Shared Date <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Status <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Box>
              </TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                <Typography sx={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>No results found</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LabCasesTable;
