import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Typography, Button, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';

const InsuranceDialogs = ({
  addCoverageDialogOpen,
  setAddCoverageDialogOpen,
  newCoverageType,
  handleSaveNewCoverage,

  viewCoverageDialogOpen,
  setViewCoverageDialogOpen,
  selectedRow,
  handleEdit,

  deactivateDialogOpen,
  setDeactivateDialogOpen,
  handleConfirmDeactivate,

  activateDialogOpen,
  setActivateDialogOpen,
  handleConfirmActivate,

  editDialogOpen,
  setEditDialogOpen,
  handleSaveEdit,

  reviewImportedDialogOpen,
  setReviewImportedDialogOpen,
  setHasImportedCoverage,
  showSnackbar
}) => {
  return (
    <>
      {/* Add Coverage Dialog */}
      <Dialog 
        open={addCoverageDialogOpen} 
        onClose={() => setAddCoverageDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: radius.xl } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add {newCoverageType}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField autoFocus margin="dense" label="Insurance Company/Payer" type="text" fullWidth variant="outlined" />
            <TextField margin="dense" label="Plan Type" type="text" fullWidth variant="outlined" />
            <TextField margin="dense" label="Subscriber Name" type="text" fullWidth variant="outlined" />
            <TextField margin="dense" label="Policy Number" type="text" fullWidth variant="outlined" />
            <TextField margin="dense" label="Group Number" type="text" fullWidth variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setAddCoverageDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNewCoverage} 
            variant="contained" 
            sx={{ bgcolor: COLORS.ACCENT, textTransform: 'none', borderRadius: radius.md, '&:hover': { bgcolor: COLORS.ACCENT_HOVER } }}
          >
            Save Coverage
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Coverage Dialog */}
      <Dialog 
        open={viewCoverageDialogOpen} 
        onClose={() => setViewCoverageDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: radius.xl } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Coverage Details - {selectedRow?.payer}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Plan:</strong> {selectedRow.plan}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Subscriber:</strong> {selectedRow.subscriber}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Status:</strong> <Chip label={selectedRow.status.toUpperCase()} size="small" sx={{ ml: 1, bgcolor: selectedRow.status === 'active' ? COLORS.PRICE_BG : '#fff3e0', color: selectedRow.status === 'active' ? COLORS.STATUS_SUCCESS : COLORS.STATUS_WARNING, fontWeight: 700 }} />
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Eligibility Checked:</strong> {selectedRow.eligibilityChecked}</Typography>
              {selectedRow.dentist && (
                <Typography variant="body1" sx={{ mb: 2 }}><strong>Dentist:</strong> {selectedRow.dentist}</Typography>
              )}
              {selectedRow.members && (
                <Typography variant="body1" sx={{ mb: 2 }}><strong>Members:</strong> {selectedRow.members.join(', ')}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setViewCoverageDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Close
          </Button>
          <Button 
            onClick={() => handleEdit(selectedRow)} 
            variant="outlined" 
            sx={{ borderColor: COLORS.ACCENT, color: COLORS.ACCENT, textTransform: 'none', borderRadius: radius.md }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog 
        open={deactivateDialogOpen} 
        onClose={() => setDeactivateDialogOpen(false)}
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { width: '450px', maxWidth: '100%', borderRadius: radius.lg, p: 0 } }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.25,
          backgroundColor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
        }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            Confirm Deactivation
          </Typography>
          <IconButton size="small" onClick={() => setDeactivateDialogOpen(false)} sx={{ color: COLORS.TEXT_MUTED, p: '4px' }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>
            Are you sure you want to deactivate coverage for <strong style={{ fontWeight: fontWeight.bold }}>{selectedRow?.payer}</strong>?
          </Typography>
          <Typography sx={{ mt: 1, fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
            This will move the coverage to archived status.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 2.5, pb: 2.5 }}>
          <Button onClick={() => setDeactivateDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDeactivate} 
            variant="contained" 
            sx={{ bgcolor: COLORS.STATUS_ERROR, textTransform: 'none', borderRadius: radius.md, '&:hover': { bgcolor: '#dc2626' }, boxShadow: 'none' }}
          >
            Deactivate
          </Button>
        </Box>
      </Dialog>

      {/* Activate Coverage Dialog */}
      <Dialog 
        open={activateDialogOpen} 
        onClose={() => setActivateDialogOpen(false)}
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { width: '450px', maxWidth: '100%', borderRadius: radius.lg, p: 0 } }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.25,
          backgroundColor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
        }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            Confirm Activation
          </Typography>
          <IconButton size="small" onClick={() => setActivateDialogOpen(false)} sx={{ color: COLORS.TEXT_MUTED, p: '4px' }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>
            Are you sure you want to activate coverage for <strong style={{ fontWeight: fontWeight.bold }}>{selectedRow?.payer}</strong>?
          </Typography>
          <Typography sx={{ mt: 1, fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
            This will move the coverage back to active status.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 2.5, pb: 2.5 }}>
          <Button onClick={() => setActivateDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmActivate} 
            variant="contained" 
            sx={{ bgcolor: COLORS.STATUS_SUCCESS, textTransform: 'none', borderRadius: radius.md, '&:hover': { bgcolor: '#16a34a' }, boxShadow: 'none' }}
          >
            Activate
          </Button>
        </Box>
      </Dialog>

      {/* Edit Coverage Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: radius.xl } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Coverage - {selectedRow?.payer}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField autoFocus margin="dense" label="Insurance Company/Payer" type="text" fullWidth variant="outlined" defaultValue={selectedRow?.payer} />
            <TextField margin="dense" label="Plan Type" type="text" fullWidth variant="outlined" defaultValue={selectedRow?.plan} />
            <TextField margin="dense" label="Subscriber Name" type="text" fullWidth variant="outlined" defaultValue={selectedRow?.subscriber} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            sx={{ bgcolor: COLORS.ACCENT, textTransform: 'none', borderRadius: radius.md, '&:hover': { bgcolor: COLORS.ACCENT_HOVER } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Imported Coverage Dialog */}
      <Dialog 
        open={reviewImportedDialogOpen} 
        onClose={() => setReviewImportedDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: radius.xl } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Review Imported Coverage</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Please review the insurance details uploaded by the patient.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Payer:</strong> United Healthcare <br />
              <strong>Plan:</strong> PPO Basic <br />
              <strong>Subscriber:</strong> John Doe <br />
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setReviewImportedDialogOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setReviewImportedDialogOpen(false);
              setHasImportedCoverage(false);
              showSnackbar('Imported coverage approved and added', 'success');
            }} 
            variant="contained" 
            sx={{ bgcolor: COLORS.STATUS_SUCCESS, textTransform: 'none', borderRadius: radius.md }}
          >
            Approve & Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InsuranceDialogs;
