import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

const MembershipAuditDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ backgroundColor: '#F8FAFC', color: '#1e293b', fontSize: '1.1rem', py: 2, px: 3, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
        Audit Membership Plan History
      </DialogTitle>
      <DialogContent sx={{ mt: 2, p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Difference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((item, index) => (
                <TableRow key={index} sx={{ verticalAlign: 'top' }}>
                  <TableCell sx={{ fontSize: '0.75rem', py: 2, color: '#475569' }}>
                    {index === 0 ? 'Jan 05 2026' : index === 1 ? 'Jan 04 2026' : 'Jan 02 2026'}<br/>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>11:37:42 AM</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 2, color: '#475569' }}>System Admin</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 2, color: '#475569' }}>MembershipPlan</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 2 }}>
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: index === 0 ? '#16a34a' : '#ea580c',
                      fontWeight: 600 
                    }}>
                      {index === 0 ? 'Add' : 'Update'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ p: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: 'none', py: 0.5, fontSize: '0.7rem', color: '#94a3b8' } }}>
                          <TableCell align="center">Key</TableCell>
                          <TableCell align="center">Old</TableCell>
                          <TableCell align="center">New</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {index === 0 ? (
                          <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem', color: '#475569' } }}>
                            <TableCell align="center">/planName</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">Bright Beginning</TableCell>
                          </TableRow>
                        ) : (
                          <>
                            <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem', color: '#475569' } }}>
                              <TableCell align="center">/planMonthlyFee</TableCell>
                              <TableCell align="center">45</TableCell>
                              <TableCell align="center">46</TableCell>
                            </TableRow>
                            <TableRow sx={{ '& td': { borderBottom: 'none', py: 0.5, fontSize: '0.75rem', color: '#475569' } }}>
                              <TableCell align="center">/planAnnualFee</TableCell>
                              <TableCell align="center">540</TableCell>
                              <TableCell align="center">550</TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, backgroundColor: '#F8FAFC', borderTop: '1px solid #e2e8f0' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', px: 3, borderRadius: '6px',
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipAuditDialog;
