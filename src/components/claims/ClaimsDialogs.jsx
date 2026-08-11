import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, TextField, Button, IconButton, Autocomplete, Checkbox, FormControl, FormControlLabel, MenuItem, Select, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon, Info as InfoIcon, Edit as EditIcon, ErrorOutline as ErrorIcon, Description as DescriptionIcon, Print as PrintIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { COLORS } from '../../constants/colors';
import ClaimAttachmentsDialog from './attachments/ClaimAttachmentsDialog';

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
      <Dialog 
        open={openPreviewDialog} 
        onClose={() => setOpenPreviewDialog(false)} 
        maxWidth="lg" 
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
          <DescriptionIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: TYPO.fontFamily }}>
            ADA 2019 Claim Form Preview ({displayClaim?.claimNumber})
          </Typography>
          <IconButton onClick={() => setOpenPreviewDialog(false)} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '24px !important', backgroundColor: '#f8fafc' }}>
          {loadingPreview ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : displayClaim && (
            <Box sx={{ border: '1px solid #cbd5e1', p: 4, borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '900px', mx: 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 4, color: '#1a3a6b' }}>
                ADA Dental Claim Form
              </Typography>

              <Grid container spacing={3}>
                {/* 1. Header & Carrier */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>HEADER INFORMATION</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2"><strong>Type of Transaction:</strong> Statement of Actual Services</Typography>
                      <Typography variant="body2"><strong>Claim Format:</strong> {displayClaim.claimFormat || 'E-claim'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2"><strong>Carrier Name:</strong> {displayClaim.insuranceCompany?.name || displayClaim.carrier || '—'}</Typography>
                      <Typography variant="body2"><strong>Carrier Address:</strong> {displayClaim.insuranceCompany?.address || '—'}</Typography>
                      <Typography variant="body2"><strong>Carrier City, State, Zip:</strong> {displayClaim.insuranceCompany?.city ? `${displayClaim.insuranceCompany.city}, ${displayClaim.insuranceCompany.state} ${displayClaim.insuranceCompany.zip}` : '—'}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* 2. Subscriber & Patient */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>SUBSCRIBER INFORMATION</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {displayClaim.subscriberDetails?.firstName} {displayClaim.subscriberDetails?.lastName}</Typography>
                    <Typography variant="body2"><strong>Member ID:</strong> {displayClaim.subscriberDetails?.memberId}</Typography>
                    <Typography variant="body2"><strong>Group Number:</strong> {displayClaim.subscriberDetails?.groupNumber}</Typography>
                    <Typography variant="body2"><strong>DOB:</strong> {displayClaim.subscriberDetails?.dateOfBirth ? new Date(displayClaim.subscriberDetails.dateOfBirth).toLocaleDateString() : '—'} <strong>Gender:</strong> {displayClaim.subscriberDetails?.gender || '—'}</Typography>
                    <Typography variant="body2"><strong>Address:</strong> {displayClaim.subscriberDetails?.address}, {displayClaim.subscriberDetails?.city}, {displayClaim.subscriberDetails?.state} {displayClaim.subscriberDetails?.zip}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>PATIENT INFORMATION</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {displayClaim.patient?.firstName || displayClaim.patientName} {displayClaim.patient?.lastName || ''}</Typography>
                    <Typography variant="body2"><strong>Relationship to Subscriber:</strong> {displayClaim.subscriberDetails?.relationshipToSubscriber === 1 ? 'Self' : displayClaim.subscriberDetails?.relationshipToSubscriber === 2 ? 'Spouse' : displayClaim.subscriberDetails?.relationshipToSubscriber === 3 ? 'Child' : 'Other'}</Typography>
                    <Typography variant="body2"><strong>DOB:</strong> {displayClaim.patient?.dateOfBirth ? new Date(displayClaim.patient.dateOfBirth).toLocaleDateString() : displayClaim.patientDob || '—'} <strong>Gender:</strong> {displayClaim.patient?.gender || '—'}</Typography>
                    <Typography variant="body2"><strong>Address:</strong> {displayClaim.patient?.address ? `${displayClaim.patient.address.line1 || displayClaim.patient.address || ''} ${displayClaim.patient.address.line2 || ''}, ${displayClaim.patient.address.city || displayClaim.patient.city || ''}, ${displayClaim.patient.address.state || displayClaim.patient.state || ''} ${displayClaim.patient.address.postalCode || displayClaim.patient.zip || ''}`.replace(/ ,/g, ',').trim().replace(/^,|,$/g, '') : '—'}</Typography>
                  </Box>
                </Grid>

                {/* 3. Provider Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>BILLING PROVIDER</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {displayClaim.billingProvider ? `${displayClaim.billingProvider.firstName} ${displayClaim.billingProvider.lastName}` : '—'}</Typography>
                    <Typography variant="body2"><strong>NPI:</strong> {displayClaim.billingProvider?.npi || '—'}</Typography>
                    <Typography variant="body2"><strong>TIN:</strong> {displayClaim.billingProvider?.tin || '—'}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>TREATING DENTIST</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Name:</strong> {displayClaim.treatingProvider ? (typeof displayClaim.treatingProvider === 'object' ? `${displayClaim.treatingProvider.firstName || ''} ${displayClaim.treatingProvider.lastName || ''}`.trim() : displayClaim.treatingProvider) : '—'}</Typography>
                    <Typography variant="body2"><strong>NPI:</strong> {displayClaim.treatingProvider?.npi || '—'}</Typography>
                  </Box>
                </Grid>

                {/* 4. Record of Services */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>RECORD OF SERVICES PROVIDED</Typography>
                  <Table size="small" sx={{ mt: 1, border: '1px solid #e0e6ed' }}>
                    <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Date of Service</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Procedure Code</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tooth/Surface</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Fee</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayClaim.procedures?.length > 0 ? displayClaim.procedures.map((proc, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{proc.dateOfService ? new Date(proc.dateOfService).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>{proc.code || '—'}</TableCell>
                          <TableCell>{proc.tooth || '—'} {proc.surface ? `(${proc.surface})` : ''}</TableCell>
                          <TableCell>{proc.description || '—'}</TableCell>
                          <TableCell>{proc.providerName || (displayClaim.treatingProvider ? (typeof displayClaim.treatingProvider === 'object' ? `${displayClaim.treatingProvider.firstName || ''} ${displayClaim.treatingProvider.lastName || ''}`.trim() : displayClaim.treatingProvider) : '—')}</TableCell>
                          <TableCell align="right">${(proc.fee || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ color: '#718096', py: 2 }}>
                            No procedures listed for this claim.
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={5} align="right" sx={{ fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>Total Fee:</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, borderTop: '2px solid #e2e8f0' }}>
                          ${(displayClaim.procedures || []).reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>

                {/* 5. Signatures */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>AUTHORIZATIONS & SIGNATURES</Typography>
                  <Box sx={{ mt: 1, p: 2, border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Patient / Subscriber Signature</Typography>
                      <Box sx={{ mt: 0.5, borderBottom: '1px solid #e2e8f0', pb: 0.5 }}>
                        <Typography sx={{ fontFamily: 'cursive', color: displayClaim.patientSignature ? '#1a3a6b' : '#a0aec0', fontStyle: displayClaim.patientSignature ? 'normal' : 'italic' }}>
                          {displayClaim.patientSignature ? displayClaim.patientSignature : 'Signature on File'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Provider Signature</Typography>
                      <Box sx={{ mt: 0.5, borderBottom: '1px solid #e2e8f0', pb: 0.5 }}>
                        <Typography sx={{ fontFamily: 'cursive', color: displayClaim.providerSignature ? '#1a3a6b' : '#a0aec0', fontStyle: displayClaim.providerSignature ? 'normal' : 'italic' }}>
                          {displayClaim.providerSignature ? displayClaim.providerSignature : 'Signature on File'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* 6. Attachments & Remarks */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, backgroundColor: '#e2e8f0', p: 1, borderRadius: '4px' }}>ATTACHMENTS & REMARKS</Typography>
                  <Box sx={{ mt: 1, p: 2, backgroundColor: '#f8fafc', borderRadius: '4px', height: '100%' }}>
                    <Typography variant="body2"><strong>Remarks:</strong> {displayClaim.notes || displayClaim.description || 'None'}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}><strong>Attachments included:</strong> {displayClaim.hasAttachment ? 'Yes (See attachments section)' : 'None'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e6ed', backgroundColor: '#ffffff' }}>
          <Button 
            onClick={() => setOpenPreviewDialog(false)} 
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
            onClick={handlePrintClaim}
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
    </>
  );
};
