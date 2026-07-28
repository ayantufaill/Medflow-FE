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
import {
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';

const InsurancePlansTable = ({ 
  plans, 
  loading, 
  onEdit, 
  onDelete, 
  onSync, 
  onAudit, 
  onFeeGuide, 
  onSubscribersClick 
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Group #</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Group Name</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Employer</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Template Name</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Phone</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Carrier</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>E-ID</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Plan Fee Guides</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Subscribers</TableCell>
            <TableCell align="right" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No insurance plans found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow 
                key={plan.id} 
                hover
                onClick={() => onEdit(plan)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              >
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.groupNumber}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b' }}>{plan.groupName}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.employer || '-'}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.templateName || '-'}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.phone || '-'}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.carrier}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{plan.electronicId}</TableCell>
                <TableCell>
                  <Link 
                    href="#" 
                    underline="hover" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFeeGuide(plan); }}
                    sx={{ 
                      fontSize: '0.8rem', 
                      color: plan.feeGuide === 'none' ? 'text.secondary' : '#2563eb' 
                    }}
                  >
                    {plan.feeGuide}
                  </Link>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }} align="center">
                  <Link
                    component="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const count = Number(plan.subscribers) || (plan.subscriberList ? plan.subscriberList.length : 0);
                      if (count > 0) {
                        onSubscribersClick(e, plan);
                      }
                    }}
                    sx={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none' }}
                  >
                    {Number(plan.subscribers) || (plan.subscriberList ? plan.subscriberList.length : 0)}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                    <Link
                      component="button"
                      onClick={(e) => { e.stopPropagation(); onSync(plan); }}
                      sx={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <SyncIcon sx={{ fontSize: '1rem' }} />
                      Sync
                    </Link>
                    
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); onAudit(plan); }}
                      sx={{ color: '#64748b' }}
                    >
                      <RestoreIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>

                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); onDelete(plan.id, plan.groupName); }}
                      sx={{ color: '#ef4444' }}
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

export default InsurancePlansTable;
