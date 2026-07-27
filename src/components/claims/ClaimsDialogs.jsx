import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, TextField, Button, IconButton, Autocomplete, Checkbox, FormControl, FormControlLabel, MenuItem, Select, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon, Info as InfoIcon, Edit as EditIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';

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
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a3a6b', borderBottom: '1px solid #e0e6ed', pb: 2 }}>
          Edit Claim {editingClaim?.claimNumber}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingClaim && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Patient Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingClaim.patientName}
                  onChange={(e) => setEditingClaim({ ...editingClaim, patientName: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Claim Type
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingClaim.claimType}
                  onChange={(e) => setEditingClaim({ ...editingClaim, claimType: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Carrier
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingClaim.carrier}
                  onChange={(e) => setEditingClaim({ ...editingClaim, carrier: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={editingClaim.status}
                    onChange={(e) => setEditingClaim({ ...editingClaim, status: e.target.value })}
                  >
                    <MenuItem value="draft">draft</MenuItem>
                    <MenuItem value="submitted">submitted</MenuItem>
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="paid">paid</MenuItem>
                    <MenuItem value="partial">partial</MenuItem>
                    <MenuItem value="denied">denied</MenuItem>
                    <MenuItem value="cancelled">cancelled</MenuItem>
                    <MenuItem value="readyForSubmission">readyForSubmission</MenuItem>
                    <MenuItem value="inProcess">inProcess</MenuItem>
                    <MenuItem value="accepted">accepted</MenuItem>
                    <MenuItem value="acceptedPaid">acceptedPaid</MenuItem>
                    <MenuItem value="error">error</MenuItem>
                    <MenuItem value="rejected">rejected</MenuItem>
                    <MenuItem value="eobUploaded">eobUploaded</MenuItem>
                    <MenuItem value="validationError">validationError</MenuItem>
                    <MenuItem value="manualClaim">manualClaim</MenuItem>
                    <MenuItem value="acceptedForProcessing">acceptedForProcessing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {activeTab === 4 && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Subscriber Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingClaim.subscriber || ''}
                      onChange={(e) => setEditingClaim({ ...editingClaim, subscriber: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Plan Name (#)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingClaim.planName || ''}
                      onChange={(e) => setEditingClaim({ ...editingClaim, planName: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Submitted Value ($)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={editingClaim.submittedValue || 0}
                      onChange={(e) => setEditingClaim({ ...editingClaim, submittedValue: parseFloat(e.target.value) || 0 })}
                    />
                  </Grid>
                </>
              )}
              {activeTab === 5 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Treating Provider
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={editingClaim.treatingProvider || ''}
                    onChange={(e) => setEditingClaim({ ...editingClaim, treatingProvider: e.target.value })}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Clearing House Status Message
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingClaim.clearingHouseMessage || ''}
                  onChange={(e) => setEditingClaim({ ...editingClaim, clearingHouseMessage: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Description / Remarks
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editingClaim.description}
                  onChange={(e) => setEditingClaim({ ...editingClaim, description: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Internal Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editingClaim.notes}
                  onChange={(e) => setEditingClaim({ ...editingClaim, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e0e6ed' }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ textTransform: 'none', color: '#718096' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachments Management Dialog */}
      <Dialog open={openAttachDialog} onClose={() => setOpenAttachDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '8px', minHeight: '400px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, pb: 1 }}>
          <Typography sx={{ fontWeight: 600, color: '#333', fontSize: '1.05rem' }}>
            Claim Attachments
          </Typography>
          <IconButton onClick={() => setOpenAttachDialog(false)} size="small" sx={{ color: '#999' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 1, pb: 4 }}>
          {attachingClaim && (
            <>
              <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 2 }}>
                Claim {attachingClaim.claimNumber}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#444' }}>
                  Payor Reference Number:
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 600, display: 'inline-block', borderBottom: '1px solid #333', minWidth: '20px' }}>
                  &nbsp;
                </Typography>
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <EditIcon sx={{ fontSize: 16, color: '#333' }} />
                </IconButton>
                <ErrorIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
              </Box>

              <Typography sx={{ fontWeight: 700, color: '#333', fontSize: '0.95rem', mb: 1 }}>
                Imported Files
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#666', mb: 4 }}>
                No files added yet
              </Typography>

              <Typography sx={{ fontWeight: 700, color: '#333', fontSize: '0.95rem', mb: 0.5 }}>
                Import from:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic', mb: 3 }}>
                *PDF files will be submitted as images*
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Images */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #1976d2', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Images</Typography>
                </Box>
                {/* Upload from PC */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Upload from PC</Typography>
                </Box>
                {/* Perio Chart */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 6 5 6 9v3c0 2-2 4-2 6 0 1 1 2 2 2h2c1-2 2-3 4-3s3 1 4 3h2c1 0 2-1 2-2 0-2-2-4-2-6V9c0-4-2-7-6-7z" /></svg>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Perio Chart</Typography>
                </Box>
                {/* Medical History */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><path d="M12 8v8M8 12h8" /></svg>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Medical History</Typography>
                </Box>
                {/* Dental History */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Dental History</Typography>
                </Box>
                {/* Progress Notes */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer', borderRight: '1px solid #eee' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Progress Notes</Typography>
                </Box>
                {/* Upload EOBs */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, cursor: 'pointer' }}>
                  <Box sx={{ width: 36, height: 24, bgcolor: '#6b21a8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>EOB</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Upload EOBs</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 1, backgroundColor: '#fafafa' }}>
          <FormControlLabel
            control={<Checkbox defaultChecked size="small" sx={{ color: '#1a3a6b', '&.Mui-checked': { color: '#1a3a6b' }, py: 0.5 }} />}
            label={<Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Send both Pearl-annotated and original images</Typography>}
            sx={{ mr: 'auto', ml: 1 }}
          />
          <Button onClick={() => setOpenAttachDialog(false)} sx={{ textTransform: 'none', color: '#333', bgcolor: '#e2e8f0', borderRadius: '20px', px: 3, fontWeight: 600, '&:hover': { bgcolor: '#cbd5e1' } }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveAttach}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#7994c6', borderRadius: '20px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#627cb3', boxShadow: 'none' } }}
          >
            Submit Attachments
          </Button>
          <Button
            onClick={handleSaveAttach}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#68d391', borderRadius: '20px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#48bb78', boxShadow: 'none' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Claim Form Preview Dialog */}
      <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a3a6b', borderBottom: '1px solid #e0e6ed', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>ADA 2019 Claim Form Preview ({displayClaim?.claimNumber})</span>
          <IconButton onClick={() => setOpenPreviewDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, backgroundColor: '#f8fafc' }}>
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
          <Button onClick={() => setOpenPreviewDialog(false)} sx={{ textTransform: 'none', color: '#718096' }}>
            Close Preview
          </Button>
          <Button
            variant="contained"
            onClick={handlePrintClaim}
            sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
          >
            Print Form
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
