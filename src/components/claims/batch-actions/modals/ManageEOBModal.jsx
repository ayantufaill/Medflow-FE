import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { claimService } from '../../../../services/claim.service';

const ManageEOBModal = ({
  open,
  onClose,
  selectedBatchPayment, // May be a ledger detail row OR a real batch payment
}) => {
  const fileInputRef = useRef(null);

  // Resolved batch payment (with a valid DocNum id)
  const [resolvedPayment, setResolvedPayment] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [eobs, setEobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [isClaimMode, setIsClaimMode] = useState(false);

  useEffect(() => {
    if (!open || !selectedBatchPayment) return;

    // If the object already has eobs array and a paymentRef, it's a real batch payment
    const looksLikeBatchPayment = selectedBatchPayment?.paymentRef !== undefined;

    if (looksLikeBatchPayment) {
      setResolvedPayment(selectedBatchPayment);
      setEobs(selectedBatchPayment.eobs || []);
      setIsClaimMode(false);
      return;
    }

    // Otherwise it's an individual claim (e.g. from LedgerList)
    setIsClaimMode(true);
    const claimId = selectedBatchPayment?.id || selectedBatchPayment?._id;
    const claimNumber = selectedBatchPayment?.claimNumber || selectedBatchPayment?.claimCode || claimId;
    
    setResolvedPayment({ id: claimId, paymentRef: `Claim #${claimNumber}`, eobs: selectedBatchPayment.eobs || [] });
    setEobs(selectedBatchPayment.eobs || []);
    
  }, [open, selectedBatchPayment]);

  const handleFileChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFile = async (file) => {
    if (!resolvedPayment?.id) {
      alert('No payment ID found. Cannot upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', `EOB for Payment ${resolvedPayment.paymentRef || resolvedPayment.id}`);

    setUploading(true);
    try {
      let result;
      if (isClaimMode) {
        result = await claimService.uploadClaimEOB(resolvedPayment.id, formData);
      } else {
        result = await claimService.uploadEOB(resolvedPayment.id, formData);
      }
      
      // Use returned eob list or append optimistically
      if (Array.isArray(result?.eobs)) {
        setEobs(result.eobs);
      } else {
        const newEob = result?.eob || {
          id: `temp-${Date.now()}`,
          filename: file.name,
          uploadDate: new Date().toISOString(),
          size: formatFileSize(file.size),
          url: null,
        };
        setEobs(prev => [...prev, newEob]);
      }
      setHasChanges(true);
    } catch (error) {
      alert(`Upload failed: ${error?.response?.data?.error?.message || error?.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (eob) => {
    const eobId = eob._id || eob.id;
    setDeleting(eobId);
    try {
      if (isClaimMode) {
        await claimService.deleteClaimEOB(resolvedPayment.id, eobId);
      } else {
        await claimService.deleteEOB(resolvedPayment.id, eobId);
      }
      setEobs(prev => prev.filter(e => (e._id || e.id) !== eobId));
      setHasChanges(true);
    } catch (error) {
      alert(`Delete failed: ${error?.response?.data?.error?.message || error?.response?.data?.message || error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(hasChanges)}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: 'Inter, sans-serif' }
      }}
    >
      <DialogTitle sx={{ boxSizing: 'border-box', px: '25px', py: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Manage EOB Documents
          {resolvedPayment?.paymentRef ? ` — ${resolvedPayment.paymentRef}` : ''}
        </Typography>
        <IconButton onClick={() => onClose(hasChanges)} size="small" sx={{ color: '#64748B' }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, px: 3, pb: 2 }}>
        {resolving ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6, gap: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ color: '#64748b', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              Loading payment details...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#4a5568', fontFamily: 'Inter, sans-serif' }}>
              Uploaded EOB Statements ({eobs.length})
            </Typography>

            {eobs.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', mb: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
                  No EOB documents have been uploaded yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {eobs.map((eob, idx) => {
                  const eobId = eob._id || eob.id;
                  const name = eob.filename || eob.fileName || eob.originalName || `EOB Document ${idx + 1}`;
                  const date = eob.uploadDate || eob.uploadedAt || eob.createdAt
                    ? new Date(eob.uploadDate || eob.uploadedAt || eob.createdAt).toLocaleDateString()
                    : '';
                  const isDeleting = deleting === eobId;

                  return (
                    <Paper
                      key={eobId || idx}
                      variant="outlined"
                      sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096', display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          {[date, eob.size].filter(Boolean).join(' · ')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
                        {eob.url && (
                          <>
                            <Tooltip title="Open">
                              <IconButton size="small" onClick={() => window.open(eob.url, '_blank')} sx={{ color: '#7d9cc4' }}>
                                <OpenIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = eob.url;
                                  a.download = name;
                                  a.click();
                                }}
                                sx={{ color: '#7d9cc4' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            disabled={isDeleting}
                            onClick={() => handleDelete(eob)}
                            sx={{ color: '#e53e3e' }}
                          >
                            {isDeleting ? <CircularProgress size={14} /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Upload Section */}
            <Box
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              sx={{
                border: `2px dashed ${dragOver ? '#2362EF' : '#94a3b8'}`,
                p: 3,
                borderRadius: '8px',
                textAlign: 'center',
                bgcolor: dragOver ? '#eff6ff' : '#f8fafc',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <CircularProgress size={28} sx={{ mb: 1, color: '#2362EF' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a5568', fontFamily: 'Inter, sans-serif' }}>
                    Uploading EOB...
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 36, color: '#a0aec0', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, fontFamily: 'Inter, sans-serif' }}>
                    Click to select or drag & drop a file
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 2, fontFamily: 'Inter, sans-serif' }}>
                    Supported format: PDF up to 10MB
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    sx={{ bgcolor: '#2362EF', '&:hover': { bgcolor: '#1D53CC' }, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(35,98,239,0.2)', borderRadius: '8px', fontFamily: 'Inter, sans-serif' }}
                  >
                    Choose File & Upload
                  </Button>
                </>
              )}
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e0e5eb', px: 2.5, py: 2, bgcolor: '#fff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <Button
          variant="outlined"
          onClick={() => onClose(hasChanges)}
          sx={{ textTransform: 'none', color: '#64748b', borderColor: '#cbd5e1', fontWeight: 600, borderRadius: '8px', px: 3, fontFamily: 'Inter, sans-serif', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageEOBModal;
