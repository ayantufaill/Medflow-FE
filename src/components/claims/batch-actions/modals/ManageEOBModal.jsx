import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Upload as UploadIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ManageEOBModal = ({
  open,
  onClose,
  selectedBatchPayment,
  uploadingEob,
  handleEobUpload,
  handleDeleteEob
}) => {
  const fileInputRef = useRef(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 9999 }} PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' } }}>
      <DialogTitle sx={{ boxSizing: "border-box", px: "25px", py: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: '#0F172A', flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Manage EOB Documents
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748B' }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#4a5568' }}>
          Uploaded EOB Statements ({selectedBatchPayment?.eobs?.length || 0})
        </Typography>

        {(!selectedBatchPayment?.eobs || selectedBatchPayment.eobs.length === 0) ? (
          <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', mb: 3, bgcolor: '#f8fafc' }}>
            <Typography variant="body2" sx={{ color: '#718096', mb: 2, fontStyle: 'italic' }}>
              No EOB documents have been uploaded for this batch payment yet.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {selectedBatchPayment.eobs.map((eob) => (
              <Paper key={eob.id || eob._id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {eob.filename || eob.fileName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                    Uploaded: {new Date(eob.uploadDate || eob.createdAt).toLocaleDateString()} | Size: {eob.size || 'Unknown'}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      if (eob.url) window.open(eob.url, '_blank');
                      else alert(`Downloading EOB document: ${eob.filename || eob.fileName}`);
                    }}
                    size="small"
                    sx={{ color: '#7d9cc4' }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteEob && handleDeleteEob(eob.id || eob._id, eob.filename || eob.fileName)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Upload Section */}
        <Box sx={{ border: '2px dashed #94a3b8', p: 3, borderRadius: '8px', textAlign: 'center', bgcolor: '#f8fafc' }}>
          <CloudUploadIcon sx={{ fontSize: 36, color: '#a0aec0', mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5 }}>
            Select a digital EOB PDF statement to link
          </Typography>
          <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 2 }}>
            Supported format: PDF up to 10MB
          </Typography>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf"
            onChange={handleEobUpload}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon sx={{ fontSize: 16 }} />}
            disabled={uploadingEob}
            onClick={() => fileInputRef.current?.click()}
            sx={{ bgcolor: '#2362EF', '&:hover': { bgcolor: '#1D53CC' }, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(35, 98, 239, 0.2)', borderRadius: '8px' }}
          >
            {uploadingEob ? 'Uploading EOB...' : 'Choose File & Upload'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 2.5, py: 2, bgcolor: '#f8fafc', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', fontWeight: 600, borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageEOBModal;
