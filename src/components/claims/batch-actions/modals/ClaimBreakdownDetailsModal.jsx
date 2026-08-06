import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ClaimBreakdownDetailsModal = ({ open, onClose, selectedBatchPayment }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ zIndex: 9999 }} PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' } }}>
      <DialogTitle sx={{ boxSizing: "border-box", px: "25px", py: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
            Claim Breakdown Details
          </Typography>
          <Typography component="span" sx={{ fontSize: "15px", color: '#64748B', fontWeight: 400 }}>
            — Reference #: <Typography component="span" sx={{ fontWeight: 600, color: '#0F172A', fontSize: "15px" }}>{selectedBatchPayment?.paymentRef}</Typography> ({selectedBatchPayment?.carrier})
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748B' }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 2.5 }}>
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0', borderRadius: '12px', overflowX: 'auto', width: '100%' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#f8f9fa', py: '10px', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell>CLAIM #</TableCell>
                <TableCell>PATIENT ID</TableCell>
                <TableCell>PATIENT NAME</TableCell>
                <TableCell align="right">SUBMITTED</TableCell>
                <TableCell align="right">AMOUNT PAID</TableCell>
                <TableCell align="right">WRITE OFF</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedBatchPayment?.claims?.map((claim, idx) => (
                <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' }, transition: 'background-color 0.15s' }}>
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', fontFamily: 'monospace' }}>{claim.claimNumber}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', color: '#4a5568' }}>{claim.patientId}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{claim.patient}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', color: '#4a5568' }}>${claim.submitted?.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>${claim.paid?.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', color: '#b45309' }}>${claim.writeOff?.toFixed(2)}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5 }}>
                    <Chip
                      label={claim.status}
                      size="small"
                      sx={{
                        bgcolor: claim.status === 'Failed' ? '#fee2e2' : '#dcfce7',
                        color: claim.status === 'Failed' ? '#b91c1c' : '#15803d',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 2.5, py: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', fontWeight: 600, borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimBreakdownDetailsModal;
