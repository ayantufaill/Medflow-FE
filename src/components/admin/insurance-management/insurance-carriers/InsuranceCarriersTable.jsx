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
  CircularProgress,
  IconButton,
  Link,
  Paper,
} from '@mui/material';
import syncSvg from '../../../../assets/claimicons/refreshicon.svg';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

const InsuranceCarriersTable = ({ companies, loading, onEdit, onDelete, onSync }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ color: '#334155', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Carrier</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Phone</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Address</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Electronic ID</TableCell>
            <TableCell align="right" sx={{ color: '#334155', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No insurance carriers found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow 
                key={company._id || company.id} 
                hover
                onClick={() => onEdit(company)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              >
                <TableCell sx={{ color: '#1e293b', fontWeight: 500 }}>{company.name}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{company.phone || '-'}</TableCell>
                <TableCell sx={{ color: '#475569' }}>
                  {company.address ? (
                    <Typography sx={{ fontSize: '0.85rem' }}>
                      {company.address}, {company.city}, {company.state} {company.zipCode}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell sx={{ color: '#475569' }}>{company.payerId || '-'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                    <Link
                      component="button"
                      onClick={(e) => { e.stopPropagation(); onSync(); }}
                      sx={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <img src={syncSvg} alt="Sync" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(29%) sepia(87%) saturate(2227%) hue-rotate(215deg) brightness(96%) contrast(92%)' }} />
                      Sync
                    </Link>

                    <Link
                      component="button"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none' }}
                    >
                      {company.plansCount || 1} Plan(s)
                    </Link>

                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); onDelete(company._id || company.id, company.name); }}
                      sx={{ color: '#ef4444' }}
                    >
                      <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} />
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

export default InsuranceCarriersTable;
