import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Description as DescriptionIcon, Print as PrintIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { COLORS } from '../../constants/colors';

const TYPO = {
  fontFamily: 'Inter, sans-serif',
};

const ClaimPrintPreviewDialog = ({ open, claim, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    let objectUrl = null;

    const fetchPdf = async () => {
      if (!open || !claim?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const blob = await claimService.getClaimPdf(claim.id);
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        setError('Failed to load claim PDF. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // Cleanup URL to avoid memory leaks
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, claim?.id]);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleClose = () => {
    setPdfUrl(null);
    setError(null);
    onClose();
  };

  if (!claim) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth 
      sx={{ zIndex: 1500 }}
      PaperProps={{ 
        sx: { 
          height: '90vh', 
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: '14px', 
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden' 
        } 
      }}
    >
      <DialogTitle sx={{
        boxSizing: "border-box",
        px: "25px",
        py: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_TINT,
        m: 0,
        flexShrink: 0,
      }}>
        <DescriptionIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: TYPO.fontFamily }}>
          ADA 2019 Claim Form Preview ({claim?.claimNumber || claim?.id || 'Preview'})
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
            <Typography color="error" sx={{ fontWeight: 600 }}>{error}</Typography>
            <Button variant="outlined" onClick={onClose}>Close</Button>
          </Box>
        ) : pdfUrl ? (
          <Box sx={{ flexGrow: 1, position: 'relative', p: 1, display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
            <Box sx={{ width: '100%', height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
              <iframe 
                ref={iframeRef}
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 'none', display: 'block', backgroundColor: 'white' }} 
                title="Claim Print Preview"
              />
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#ffffff', borderTop: `1px solid ${COLORS.BORDER}`, justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
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
        <Button
          variant="outlined"
          onClick={handlePrint}
          disabled={!pdfUrl || loading}
          startIcon={<PrintIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            boxShadow: 'none',
            borderRadius: '8px',
            px: 2,
            py: 0.8,
            height: 36,
            border: '1px solid #3b82f6',
            backgroundColor: 'transparent',
            color: '#3b82f6',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' },
            '&.Mui-disabled': { borderColor: '#e5e7eb', color: '#9ca3af' },
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimPrintPreviewDialog;
