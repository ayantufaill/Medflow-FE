import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../../constants/colors';


const AttachmentAlertModal = ({ open, title = "Attachment", message, onClose, onAttach }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth 
      sx={{ zIndex: 1400 }}
      PaperProps={{ 
        sx: { 
          borderRadius: '14px', 
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
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
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: 'Inter, sans-serif' }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4, minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, textAlign: 'center', fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ textTransform: 'none', borderRadius: '8px', px: 3, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onAttach} 
          variant="contained"
          sx={{ textTransform: 'none', backgroundColor: COLORS.SUCCESS, color: '#fff', borderRadius: '8px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#2e7d32', boxShadow: 'none' }, fontFamily: 'Inter, sans-serif' }}
        >
          Attach
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function ClaimAttachmentsDialog({ open, attachingClaim, onClose, onSave }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [isEditingPayorRef, setIsEditingPayorRef] = useState(false);
  const [payorRefValue, setPayorRefValue] = useState('');
  
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    if (attachingClaim) {
      setExistingAttachments(attachingClaim.attachments || []);
      setUploadedFiles([]);
    }
  }, [attachingClaim]);

  const hasAnyAttachments = existingAttachments.length > 0 || uploadedFiles.length > 0;

  if (!attachingClaim) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth 
        sx={{ zIndex: 1400 }} 
        PaperProps={{ 
          sx: { 
            borderRadius: '14px', 
            minHeight: '400px',
            border: `1px solid ${COLORS.BORDER}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
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
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Claim Attachments
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 4 }}>
          <input 
            type="file" 
            multiple 
            accept="image/*, application/pdf, .doc, .docx" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={(event) => {
              const files = Array.from(event.target.files);
              if (files.length > 0) {
                setUploadedFiles(prev => [...prev, ...files]);
              }
              event.target.value = null; 
            }} 
          />
          <Typography sx={{ mt: 3, fontSize: '0.8125rem', color: COLORS.TEXT_PRIMARY, mb: 2, fontFamily: 'Inter, sans-serif' }}>
            Claim #{attachingClaim?.claimNumber}
          </Typography>

          <Typography sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '0.95rem', mb: 1, fontFamily: 'Inter, sans-serif' }}>
            Previously Attached Files
          </Typography>
          {existingAttachments.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              {existingAttachments.map((attachment, index) => (
                <Box key={index} sx={{ position: 'relative', width: 80, height: 100, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', color: '#64748b' }}>
                    <DescriptionIcon sx={{ fontSize: 32 }} />
                    <Typography sx={{ fontSize: '0.6rem', mt: 0.5, textAlign: 'center', px: 0.5, wordBreak: 'break-word', lineHeight: 1.1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {attachment.name || 'Doc'}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => setExistingAttachments(prev => prev.filter((_, i) => i !== index))}
                    sx={{ position: 'absolute', top: -5, right: -5, bgcolor: '#fff', p: 0.2, '&:hover': { bgcolor: '#fff' } }}
                  >
                    <CancelIcon sx={{ fontSize: 16, color: '#666' }} />
                  </IconButton>
                  <SearchIcon sx={{ position: 'absolute', bottom: 2, right: 2, fontSize: 16, color: '#333', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }} />
                </Box>
              ))}
            </Box>
          ) : (
             <Typography sx={{ fontSize: '0.8125rem', color: COLORS.TEXT_SECONDARY, mb: 3, fontFamily: 'Inter, sans-serif' }}>
               No previous attachments
             </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>
              Payor Reference Number:
            </Typography>
            
            {isEditingPayorRef ? (
              <TextField
                value={payorRefValue}
                onChange={(event) => setPayorRefValue(event.target.value)}
                onBlur={() => setIsEditingPayorRef(false)}
                autoFocus
                variant="outlined"
                size="small"
                sx={{ width: 250, '& .MuiInputBase-root': { height: '30px', fontSize: '0.85rem' } }}
                error={!payorRefValue}
              />
            ) : (
              <>
                <Typography 
                  sx={{ 
                    fontSize: '0.85rem', 
                    color: '#333', 
                    fontWeight: 600, 
                    display: 'inline-block', 
                    borderBottom: '1px solid #333', 
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                >
                  {payorRefValue || '\u00A0'}
                </Typography>
                <IconButton size="small" sx={{ p: 0.5 }} onClick={() => setIsEditingPayorRef(true)}>
                  <EditIcon sx={{ fontSize: 16, color: '#333' }} />
                </IconButton>
              </>
            )}
            {!hasAnyAttachments && <ErrorIcon sx={{ fontSize: 18, color: '#d32f2f' }} />}
          </Box>

          <Typography sx={{ fontSize: '0.8125rem', color: COLORS.TEXT_PRIMARY, mb: 4, display: 'flex', gap: 1, fontFamily: 'Inter, sans-serif' }}>
            Claim Attachments Status: <span style={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>{attachingClaim?.status || 'readyForSubmission'}</span>
          </Typography>

          <Typography sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '0.95rem', mb: 1, fontFamily: 'Inter, sans-serif' }}>
            Imported Files
          </Typography>
          {uploadedFiles.length === 0 ? (
            <Typography sx={{ fontSize: '0.8125rem', color: COLORS.TEXT_SECONDARY, mb: 4, fontFamily: 'Inter, sans-serif' }}>
              No files added yet
            </Typography>
          ) : (
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {uploadedFiles.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f8f9fa', borderRadius: '4px', border: '1px solid #eee' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>
                    {file.name} <span style={{ color: '#888' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                  </Typography>
                  <IconButton size="small" onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}>
                    <DeleteIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Typography sx={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY, fontSize: '0.95rem', mb: 0.5, fontFamily: 'Inter, sans-serif' }}>
            Import from:
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_SECONDARY, fontStyle: 'italic', mb: 3, fontFamily: 'Inter, sans-serif' }}>
            *PDF files will be submitted as images*
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {/* Images */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #1976d2', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Images</Typography>
            </Box>
            {/* Upload from PC */}
            <Box onClick={() => fileInputRef.current?.click()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee', transition: 'opacity 0.2s', '&:hover': { opacity: 0.6 } }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Upload from PC</Typography>
            </Box>
            {/* Perio Chart */}
            <Box onClick={() => setActiveAlert('perio')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee', '&:hover': { opacity: 0.8 } }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 6 5 6 9v3c0 2-2 4-2 6 0 1 1 2 2 2h2c1-2 2-3 4-3s3 1 4 3h2c1 0 2-1 2-2 0-2-2-4-2-6V9c0-4-2-7-6-7z" /></svg>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Perio Chart</Typography>
            </Box>
            {/* Medical History */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M12 8v8M8 12h8" /></svg>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Medical History</Typography>
            </Box>
            {/* Dental History */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Dental History</Typography>
            </Box>
            {/* Progress Notes */}
            <Box onClick={() => setActiveAlert('progress')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee', '&:hover': { opacity: 0.8 } }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Progress Notes</Typography>
            </Box>
            {/* Upload EOBs */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer' }}>
              <Box sx={{ width: 36, height: 24, bgcolor: COLORS.ACCENT, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>EOB</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif' }}>Upload EOBs</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${COLORS.BORDER}` }}>
          <FormControlLabel
            control={<Checkbox defaultChecked size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT }, py: 0.5 }} />}
            label={<Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 600 }}>Send both Pearl-annotated and original images</Typography>}
            sx={{ mr: 'auto', ml: 1 }}
          />
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: '8px', px: 3, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave({ newFiles: uploadedFiles, retainedFiles: existingAttachments })}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: COLORS.ACCENT, color: '#fff', borderRadius: '8px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#1565c0', boxShadow: 'none' }, fontFamily: 'Inter, sans-serif' }}
          >
            Submit Attachments
          </Button>
          <Button
            onClick={() => onSave({ newFiles: uploadedFiles, retainedFiles: existingAttachments })}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: COLORS.ACCENT, color: '#fff', borderRadius: '8px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#1565c0', boxShadow: 'none' }, fontFamily: 'Inter, sans-serif' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nested Alerts */}
      <AttachmentAlertModal 
        open={activeAlert === 'perio'}
        onClose={() => setActiveAlert(null)}
        onAttach={() => setActiveAlert(null)}
        message={
          <>
            This patient doesn't have a perio chart. If you would like to start a new one, please click <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>here</a>.
          </>
        }
      />

      <AttachmentAlertModal 
        open={activeAlert === 'progress'}
        onClose={() => setActiveAlert(null)}
        onAttach={() => setActiveAlert(null)}
        message="This patient has no progress notes."
      />
    </>
  );
}
