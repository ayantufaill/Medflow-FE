import React from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Chip
} from '@mui/material';

const ViewConsentDialog = ({
  open,
  onClose,
  consent
}) => {
  if (!consent) return null;

  const signatures = consent.signatures || {};
  const activeSignatures = Object.keys(signatures).filter(key => signatures[key]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      sx={{ zIndex: 9999 }}
      PaperProps={{ 
        sx: { 
          borderRadius: 3,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        } 
      }}
    >
      <DialogTitle sx={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 700, pb: 2, pt: 3, px: 4, borderBottom: '1px solid #f1f5f9' }}>
        Consent Details
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
            Consent Name
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: 600 }}>
            {consent.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1 }}>
            File Type
          </Typography>
          <Chip label={consent.fileType || 'Upload PDF'} size="small" sx={{ backgroundColor: '#eff6ff', color: '#3b82f6', fontWeight: 600 }} />
        </Box>

        <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
            Mapped Procedures
          </Typography>
          {consent.procedures && consent.procedures.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {consent.procedures.map((proc, pIdx) => (
                <Box key={pIdx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', backgroundColor: '#f8fafc', p: 1.5, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 700, minWidth: 45, backgroundColor: '#eff6ff', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                    {proc.code}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                    {proc.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No procedures mapped to this consent.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
            Required Signatures
          </Typography>
          {activeSignatures.length > 0 ? (
            <Grid container spacing={1}>
              {activeSignatures.map((sig) => (
                <Grid item key={sig}>
                  <Chip 
                    label={sig.charAt(0).toUpperCase() + sig.slice(1)} 
                    size="small" 
                    sx={{ backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', fontWeight: 500 }} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No signatures required.
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewConsentDialog;
