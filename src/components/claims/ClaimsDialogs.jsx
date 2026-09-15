import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, TextField, Button, IconButton, Autocomplete, Checkbox, FormControl, FormControlLabel, MenuItem, Select, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon, Info as InfoIcon, Edit as EditIcon, ErrorOutline as ErrorIcon, Description as DescriptionIcon, Print as PrintIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { COLORS } from '../../constants/colors';
import ClaimAttachmentsDialog from './attachments/ClaimAttachmentsDialog';
import ClaimPrintPreviewDialog from './ClaimPrintPreviewDialog';

const TYPO = {
  fontFamily: 'Inter, sans-serif',
  header: { fontSize: '1rem', fontWeight: 600 },
};

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#94a3b8' },
  },
  '& .MuiInputBase-input, & .MuiInputBase-inputMultiline': {
    fontSize: '0.75rem !important',
    fontFamily: 'Inter, sans-serif !important',
  },
  '& .MuiOutlinedInput-root:not(.MuiInputBase-multiline)': {
    height: 36,
  }
};

const selectSx = {
  width: '100%',
  height: 36,
  fontSize: '13px',
  fontFamily: 'Inter',
  fontWeight: 500,
  color: '#09121f',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  '& .MuiSelect-select': { py: 1, pl: 2, display: 'flex', alignItems: 'center', gap: 0.5 },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
};

export const ClaimsDialogs = ({
  openEditDialog, setOpenEditDialog, editingClaim, setEditingClaim,
  openAttachDialog, setOpenAttachDialog, attachingClaim,
  openPreviewDialog, setOpenPreviewDialog, previewingClaim, activeTab, handleSaveEdit, handleSaveAttach
}) => {
  const [fullClaimDetails, setFullClaimDetails] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (openPreviewDialog && previewingClaim?.id) {
      setLoadingPreview(true);
      claimService.getClaimById(previewingClaim.id)
        .then(res => setFullClaimDetails(res.claim || res))
        .catch(err => console.error('Failed to load full claim details', err))
        .finally(() => setLoadingPreview(false));
    } else {
      setFullClaimDetails(null);
    }
  }, [openPreviewDialog, previewingClaim]);

  const displayClaim = fullClaimDetails || previewingClaim;

  const handlePrintClaim = async () => {
    if (!displayClaim?.id) return;
    try {
      const blob = await claimService.downloadClaimPdf(displayClaim.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Failed to print claim PDF', error);
      alert('Failed to generate claim form. Please try again.');
    }
  };

  return (
    <>
      {/* Edit Claim Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)} 
        maxWidth="sm" 
        fullWidth 
        sx={{ zIndex: 1500 }}
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
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: TYPO.fontFamily }}>
            Edit Claim {editingClaim?.claimNumber}
          </Typography>
          <IconButton onClick={() => setOpenEditDialog(false)} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '24px !important', pb: 3, px: 3 }}>
          {editingClaim && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Patient Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                  value={editingClaim.patientName}
                  onChange={(e) => setEditingClaim({ ...editingClaim, patientName: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Claim Type
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                  value={editingClaim.claimType}
                  onChange={(e) => setEditingClaim({ ...editingClaim, claimType: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Carrier
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                  value={editingClaim.carrier}
                  onChange={(e) => setEditingClaim({ ...editingClaim, carrier: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={editingClaim.status}
                    onChange={(e) => setEditingClaim({ ...editingClaim, status: e.target.value })}
                    sx={selectSx}
                    MenuProps={{ sx: { zIndex: 1600 } }}
                  >
                    <MenuItem value="draft" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>draft</MenuItem>
                    <MenuItem value="submitted" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>submitted</MenuItem>
                    <MenuItem value="pending" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>pending</MenuItem>
                    <MenuItem value="paid" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>paid</MenuItem>
                    <MenuItem value="partial" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>partial</MenuItem>
                    <MenuItem value="denied" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>denied</MenuItem>
                    <MenuItem value="cancelled" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>cancelled</MenuItem>
                    <MenuItem value="readyForSubmission" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>readyForSubmission</MenuItem>
                    <MenuItem value="inProcess" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>inProcess</MenuItem>
                    <MenuItem value="accepted" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>accepted</MenuItem>
                    <MenuItem value="acceptedPaid" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>acceptedPaid</MenuItem>
                    <MenuItem value="error" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>error</MenuItem>
                    <MenuItem value="rejected" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>rejected</MenuItem>
                    <MenuItem value="eobUploaded" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>eobUploaded</MenuItem>
                    <MenuItem value="validationError" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>validationError</MenuItem>
                    <MenuItem value="manualClaim" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>manualClaim</MenuItem>
                    <MenuItem value="acceptedForProcessing" sx={{ fontFamily: 'Inter', fontSize: '13px' }}>acceptedForProcessing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {activeTab === 4 && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Subscriber Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      sx={textFieldSx}
                      value={editingClaim.subscriber || ''}
                      onChange={(e) => setEditingClaim({ ...editingClaim, subscriber: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Plan Name (#)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      sx={textFieldSx}
                      value={editingClaim.planName || ''}
                      onChange={(e) => setEditingClaim({ 
                        ...editingClaim, 
                        planName: e.target.value,
                        policyNumber: e.target.value // Backup for API payload
                      })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Submitted Value ($)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      sx={textFieldSx}
                      type="number"
                      value={editingClaim.submittedValue || 0}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                        setEditingClaim({ 
                          ...editingClaim, 
                          submittedValue: val,
                          submittedAmount: val || 0 // Backup for API payload
                        });
                      }}
                    />
                  </Grid>
                </>
              )}
              {activeTab === 5 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Treating Provider
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                    value={editingClaim.treatingProvider || ''}
                    onChange={(e) => setEditingClaim({ ...editingClaim, treatingProvider: e.target.value })}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Clearing House Status Message
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                  value={editingClaim.clearingHouseMessage || ''}
                  onChange={(e) => setEditingClaim({ 
                    ...editingClaim, 
                    clearingHouseMessage: e.target.value,
                    denialReason: e.target.value // Backup for API payload
                  })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Description / Remarks
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editingClaim.description}
                  onChange={(e) => setEditingClaim({ 
                    ...editingClaim, 
                    description: e.target.value,
                    notes: e.target.value // Backup for API payload
                  })}
                  sx={textFieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Internal Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editingClaim.notes}
                  onChange={(e) => setEditingClaim({ ...editingClaim, notes: e.target.value })}
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.BORDER}` }}>
          <Button 
            onClick={() => setOpenEditDialog(false)} 
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
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              backgroundColor: COLORS.ACCENT,
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: COLORS.ACCENT_DARK,
                boxShadow: 'none',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachments Management Dialog */}
      {openAttachDialog && attachingClaim && (
        <ClaimAttachmentsDialog
          open={openAttachDialog}
          attachingClaim={attachingClaim}
          onClose={() => setOpenAttachDialog(false)}
          onSave={handleSaveAttach}
        />
      )}

      {/* Claim Form Preview Dialog */}
      {openPreviewDialog && previewingClaim && (
        <ClaimPrintPreviewDialog
          open={openPreviewDialog}
          claim={previewingClaim}
          onClose={() => setOpenPreviewDialog(false)}
        />
      )}
    </>
  );
};
