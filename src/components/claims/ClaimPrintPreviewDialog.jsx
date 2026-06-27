import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { claimService } from '../../services/claim.service';

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
      PaperProps={{ sx: { height: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' } }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: '#5b72a9', 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: 600,
          py: 1.5,
          fontSize: '1rem'
        }}
      >
        Print Preview
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#e5e7eb' }}>
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
          <Box sx={{ flexGrow: 1, position: 'relative', p: 3, display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
            <Box sx={{ width: '100%', maxWidth: '850px', height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
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

      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e5e7eb', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            textTransform: 'none', 
            color: '#6b7280', 
            bgcolor: '#e5e7eb',
            fontWeight: 600,
            borderRadius: '4px',
            px: 3,
            '&:hover': { bgcolor: '#d1d5db' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          disabled={!pdfUrl || loading}
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#d4bd98', 
            color: '#fff',
            fontWeight: 600,
            borderRadius: '4px',
            px: 4,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#c5ae89', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#e5e7eb', color: '#9ca3af' }
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClaimPrintPreviewDialog;
