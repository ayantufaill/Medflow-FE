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
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const MembershipAuditDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Audit Membership Plan History
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            View the historical audit trail for this membership plan.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
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
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipAuditDialog;
