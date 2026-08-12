import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { claimService } from '../../services/claim.service';
import { COLORS } from '../../constants/colors';

const TYPO = {
  fontFamily: 'Inter, sans-serif',
};

const InvalidInfoDialog = ({ open, onClose, claim }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (open && claim?.id) {
      setLoading(true);
      claimService.validateClaim(claim.id)
        .then((res) => {
          setErrors(res.errors || []);
        })
        .catch((err) => {
          console.error("Failed to fetch validation errors", err);
          setErrors([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!open) {
      setErrors([]);
    }
  }, [open, claim]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 1600 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.9rem', color: '#475569' }}>
          Please fix the following invalid info before sending the claim:
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, pt: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : errors.length === 0 ? (
          <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.85rem', color: '#64748b' }}>
            No validation errors found.
          </Typography>
        ) : (
          <Table size="small" sx={{ borderTop: `1px solid ${COLORS.BORDER}`, mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 700, fontSize: '0.85rem', color: '#334155', borderBottom: `2px solid ${COLORS.BORDER}` }}>Field Name</TableCell>
                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 700, fontSize: '0.85rem', color: '#334155', borderBottom: `2px solid ${COLORS.BORDER}` }}>Invalid Value</TableCell>
                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 700, fontSize: '0.85rem', color: '#334155', borderBottom: `2px solid ${COLORS.BORDER}` }}>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errors.map((err, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.85rem', color: '#475569', borderBottom: `1px solid ${COLORS.BORDER}` }}>{err.code}</TableCell>
                  <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.85rem', color: '#475569', borderBottom: `1px solid ${COLORS.BORDER}` }}></TableCell>
                  <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.85rem', color: '#475569', borderBottom: `1px solid ${COLORS.BORDER}` }}>{err.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              textTransform: 'none',
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              py: 0.75,
              '&:hover': {
                borderColor: COLORS.BORDER_DARK,
                backgroundColor: COLORS.SURFACE_HOVER,
              },
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InvalidInfoDialog;
