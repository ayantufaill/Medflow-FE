import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, TextField, Button, IconButton, Autocomplete, Checkbox, FormControl, FormControlLabel, MenuItem, Select
} from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon, Info as InfoIcon, Edit as EditIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';

export const ClaimsDialogs = ({
  openEditDialog, setOpenEditDialog, editingClaim, setEditingClaim,
  openAttachDialog, setOpenAttachDialog, attachingClaim,
  openPreviewDialog, setOpenPreviewDialog, previewingClaim, activeTab, handleSaveEdit, handleSaveAttach
}) => {
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
      <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a3a6b', borderBottom: '1px solid #e0e6ed', pb: 2 }}>
          ADA 2019 Claim Form Preview ({previewingClaim?.claimNumber})
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {previewingClaim && (
            <Box sx={{ border: '2px solid #e0e6ed', p: 3, borderRadius: '6px', backgroundColor: '#fafafa', fontFamily: 'monospace' }}>
              <Typography sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
                ADA Dental Claim Form
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }} sx={{ borderRight: '1px solid #e0e6ed' }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>1. HEADER INFORMATION</Typography>
                  <Typography variant="body2">Primary Insurance Claim</Typography>
                  <Typography variant="body2">Carrier: {previewingClaim.carrier}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>2. PATIENT INFORMATION</Typography>
                  <Typography variant="body2">Name: {previewingClaim.patientName}</Typography>
                  <Typography variant="body2">Code: {previewingClaim.patientCode}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ borderTop: '1px solid #e0e6ed', mt: 2, pt: 2 }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>3. PROCEDURES SUBMITTED</Typography>
                  {previewingClaim.procedures.map((proc, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{proc.code} - {proc.name}</Typography>
                      <Typography variant="body2">${proc.fee.toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ borderTop: '1px solid #e0e6ed', mt: 2, pt: 2, textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Total Claim Charge: ${previewingClaim.procedures.reduce((acc, curr) => acc + curr.fee, 0).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e6ed' }}>
          <Button onClick={() => setOpenPreviewDialog(false)} sx={{ textTransform: 'none', color: '#718096' }}>
            Close Preview
          </Button>
          <Button
            variant="contained"
            onClick={() => alert('Printing ADA form...')}
            sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
          >
            Print Form
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
