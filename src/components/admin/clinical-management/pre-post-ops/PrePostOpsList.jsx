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
  IconButton,
  Paper 
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DocIcon
} from '@mui/icons-material';

const PrePostOpsList = ({
  filteredOps,
  handleEditDocument,
  handleDeleteOp
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5, width: '25%' }}>Name</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5, width: '15%' }}>Type</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5, width: '15%' }}>Procedures</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5 }}>Description</TableCell>
            <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5, width: 100 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOps.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  No pre & post-ops documents found. Try adding a new one!
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredOps.map((op, idx) => (
              <TableRow 
                key={op.id || idx}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f8fafc' },
                  transition: 'background-color 0.2s ease',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ backgroundColor: '#eff6ff', p: 1, borderRadius: 1.5, display: 'flex' }}>
                      <DocIcon sx={{ fontSize: '1.2rem', color: '#3b82f6' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                      {op.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Typography 
                    sx={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: op.type === 'Post Operation' ? '#059669' : '#0284c7', 
                      backgroundColor: op.type === 'Post Operation' ? '#d1fae5' : '#e0f2fe', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {op.type}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                    {op.procedures}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {op.description}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ py: 2, px: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditDocument(op)} 
                      sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }}
                    >
                      <EditIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteOp(op.id)} 
                      sx={{ color: '#ef4444', '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' } }}
                    >
                      <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrePostOpsList;
