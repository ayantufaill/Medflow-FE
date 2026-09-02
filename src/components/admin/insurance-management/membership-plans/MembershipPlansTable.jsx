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
  Card,
  CardContent,
} from '@mui/material';
import {
} from '@mui/icons-material';
import syncSvg from '../../../../assets/claimicons/refreshicon.svg';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';
import auditSvg from '../../../../assets/scheduleconfigurationicon/appointmentchecklist.svg';

const MembershipPlansTable = ({ plans, loading, view, onDelete, onSync, onAudit }) => {
  if (view === 'grid') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, width: '100%' }}>
        {loading ? (
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={30} />
          </Box>
        ) : plans.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography color="text.secondary">No membership plans found</Typography>
          </Box>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id} sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: 'none',
              border: '1px solid #e2e8f0',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                borderColor: '#cbd5e1'
              }
            }}>
              <Box sx={{ bgcolor: '#F8FAFC', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                  {plan.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => onSync()} sx={{ p: 0.5 }}>
                    <img src={syncSvg} alt="Sync" style={{ width: 14, height: 14, filter: 'brightness(0) saturate(100%) invert(31%) sepia(93%) saturate(3088%) hue-rotate(213deg) brightness(96%) contrast(93%)' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onAudit()} sx={{ p: 0.5 }}>
                    <img src={auditSvg} alt="Audit" style={{ width: 14, height: 14, filter: 'brightness(0) saturate(100%) invert(31%) sepia(93%) saturate(3088%) hue-rotate(213deg) brightness(96%) contrast(93%)' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(plan.id, plan.name)} sx={{ color: '#ef4444', p: 0.5 }}>
                    <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16, filter: 'invert(39%) sepia(61%) saturate(2359%) hue-rotate(338deg) brightness(97%) contrast(94%)' }} />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{plan.monthlyFee}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>/month for a year</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mx: 0.5 }}>or</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{plan.annualFee}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>/year</Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Plan Name</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Template Name</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Subscribers</TableCell>
            <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Annual Fee</TableCell>
            <TableCell align="right" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          ) : plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Typography color="text.secondary">No membership plans found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id} sx={{ '& td': { py: 2, borderBottom: '1px solid #f1f5f9' } }}>
                <TableCell sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                  {plan.name}
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', color: '#475569' }}>
                  {plan.templateName || '-'}
                </TableCell>
                <TableCell>
                  <Link href="#" underline="none" sx={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
                    {plan.subscribers}
                  </Link>
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>
                  {plan.annualFee}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                    <Link
                      component="button"
                      onClick={() => onSync()}
                      sx={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <img src={syncSvg} alt="Sync" style={{ width: 14, height: 14, filter: 'brightness(0) saturate(100%) invert(31%) sepia(93%) saturate(3088%) hue-rotate(213deg) brightness(96%) contrast(93%)' }} />
                      Sync
                    </Link>
                    <IconButton size="small" onClick={() => onAudit()}>
                      <img src={auditSvg} alt="Audit" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(31%) sepia(93%) saturate(3088%) hue-rotate(213deg) brightness(96%) contrast(93%)' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(plan)}>
                      <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16, filter: 'invert(39%) sepia(61%) saturate(2359%) hue-rotate(338deg) brightness(97%) contrast(94%)' }} />
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

export default MembershipPlansTable;
