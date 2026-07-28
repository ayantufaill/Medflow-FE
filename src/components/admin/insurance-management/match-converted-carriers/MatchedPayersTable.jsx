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
  Paper,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const MatchedPayersTable = ({ matchedPayers, onClear, title = "Matched Payers" }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, position: 'relative' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{title}</Typography>
        <Button
          onClick={onClear}
          endIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            position: 'absolute',
            right: 0,
            textTransform: 'none',
            color: '#ef4444',
            fontSize: '0.85rem',
            fontWeight: 600,
            p: 0,
            '&:hover': { background: 'none', textDecoration: 'underline' }
          }}
        >
          Delete all
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Old Name</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>MedFlow Name</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Old ID</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>MedFlow ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchedPayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                  No Data Available
                </TableCell>
              </TableRow>
            ) : (
              matchedPayers.map((p, i) => (
                <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f8fafc' }, '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#1e293b', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.oldName}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#1e293b', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.oryxName}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.oldId}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', py: 1 }}>{p.oryxId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MatchedPayersTable;
