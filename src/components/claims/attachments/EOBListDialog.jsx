import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox, IconButton, Button, Tooltip, CircularProgress
} from '@mui/material';
import deleteIconSvg from '../../../assets/claimicons/deleteicon.svg';
import { downloadDocumentFile } from '../../../utils/downloadUtils';
import BaseDialog from '../../shared/BaseDialog';
import ConfirmationDialog from '../../shared/ConfirmationDialog';
import { COLORS } from '../../../constants/colors';
import { radius, fontWeight } from '../../../constants/styles';
import { claimService } from '../../../services/claim.service';

const EOBListDialog = ({ open, onClose, claimNumber, claimId, eobs, onEobsChange, onAttachSelected }) => {
  const [localEobs, setLocalEobs] = useState(eobs || []);
  const [selectedEobs, setSelectedEobs] = useState([]);
  const [deletingEob, setDeletingEob] = useState(null); // { eob, idx }
  const [deleting, setDeleting] = useState(false);

  // Sync local state when the eobs prop changes (e.g. parent re-renders with fresh data)
  useEffect(() => {
    setLocalEobs(eobs || []);
  }, [eobs]);

  const handleAttachClick = () => {
    const selected = localEobs.filter(eob => {
      const eobId = eob._id || eob.id || localEobs.indexOf(eob);
      return selectedEobs.includes(eobId);
    });
    if (onAttachSelected) {
      onAttachSelected(selected);
    }
  };

  const handleDeleteEob = (eob, idx) => {
    const eobId = eob._id || eob.id;
    if (!eobId || !claimId) {
      // If no ID, just remove from local state (e.g. freshly uploaded without proper ID)
      setLocalEobs(prev => prev.filter((_, i) => i !== idx));
      return;
    }

    // Show the styled confirmation dialog
    setDeletingEob({ eob, idx });
  };

  const handleConfirmDelete = async () => {
    if (!deletingEob) return;

    const { eob, idx } = deletingEob;
    const eobId = eob._id || eob.id;

    setDeleting(true);
    try {
      await claimService.deleteClaimEOB(claimId, eobId);
      setLocalEobs(prev => {
        const updated = prev.filter((_, i) => i !== idx);
        onEobsChange?.(updated);
        return updated;
      });
      setSelectedEobs(prev => prev.filter(id => id !== eobId));
      setDeletingEob(null);
    } catch (error) {
      console.error('Failed to delete EOB:', error);
      alert('Failed to delete EOB. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BaseDialog
        open={open}
        onClose={onClose}
        title={<b>Claim #{claimNumber} EOBs</b>}
        maxWidth="md"
        paperSx={{ maxWidth: '750px', width: '100%' }}
        actions={
          <>
            <Button
              variant="outlined"
              onClick={handleAttachClick}
              disabled={selectedEobs.length === 0}
              sx={{
                textTransform: 'none',
                borderColor: COLORS.BORDER,
                color: COLORS.TEXT_PRIMARY,
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                height: '36px',
                px: 3,
                '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
              }}
            >
              {selectedEobs.length > 0 ? `Attach (${selectedEobs.length})` : 'Attach'}
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: COLORS.ACCENT,
                color: COLORS.WHITE,
                '&:hover': { bgcolor: '#426392' },
                textTransform: 'none',
                px: 3,
                borderRadius: radius.sm,
                boxShadow: 'none',
                fontWeight: fontWeight.medium,
              }}
            >
              Close
            </Button>
          </>
        }
      >
        <Box>
          <Box sx={{ pb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={localEobs.length > 0 && selectedEobs.length === localEobs.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEobs(localEobs.map((eob, idx) => eob._id || eob.id || idx));
                    } else {
                      setSelectedEobs([]);
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '14px', color: COLORS.TEXT_PRIMARY }}>Select All</Typography>}
            />
          </Box>
          
          <Box sx={{ borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${COLORS.BORDER}` }}>
            {/* Table Header */}
            <Box sx={{ backgroundColor: COLORS.SURFACE_TINT, display: 'flex', alignItems: 'center', p: 1, borderBottom: `1px solid ${COLORS.BORDER}`, px: 2 }}>
              <Box sx={{ width: '40px' }}></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>Name</Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>Date</Typography></Box>
              <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>Type</Typography></Box>
              <Box sx={{ width: '80px' }}></Box>
              <Box sx={{ width: '100px' }}></Box>
              <Box sx={{ width: '40px' }}></Box>
            </Box>

            {(!localEobs || localEobs.length === 0) ? (
              <Box sx={{ p: 4, textAlign: 'center', backgroundColor: COLORS.SURFACE_CARD }}>
                <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, fontStyle: 'italic' }}>No EOB documents found.</Typography>
              </Box>
            ) : (
              localEobs.map((eob, idx) => {
                const eobId = eob._id || eob.id || idx;
                return (
                <Box key={eobId} sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: idx === localEobs.length - 1 ? 'none' : `1px solid ${COLORS.BORDER}`, backgroundColor: COLORS.SURFACE_CARD, px: 2 }}>
                  <Box sx={{ width: '40px' }}>
                    <Checkbox 
                      size="small" 
                      checked={selectedEobs.includes(eobId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEobs(prev => [...prev, eobId]);
                        } else {
                          setSelectedEobs(prev => prev.filter(id => id !== eobId));
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    {(() => {
                      const name = eob.filename || eob.fileName || `EOB #${idx + 1}`;
                      const displayName = name.length > 15 ? name.substring(0, 15) + '...' : name;
                      return (
                        <Tooltip title={name.length > 15 ? name : ''} placement="top">
                          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>
                            {displayName}
                          </Typography>
                        </Tooltip>
                      );
                    })()}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>{eob.uploadedAt || eob.uploadDate || eob.createdAt ? new Date(eob.uploadedAt || eob.uploadDate || eob.createdAt).toLocaleDateString() : ''}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>{eob.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Image'}</Typography>
                  </Box>
                  <Box sx={{ width: '80px', textAlign: 'center' }}>
                    <Typography onClick={() => {
                      const url = eob.url || eob.storagePath || eob.fileUrl || eob.documentUrl;
                      if (url) window.open(url, '_blank');
                      else alert('No URL available to open this document.');
                    }} sx={{ fontSize: '13px', color: COLORS.ACCENT, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Open</Typography>
                  </Box>
                  <Box sx={{ width: '100px', textAlign: 'center' }}>
                    <Typography onClick={() => {
                      const url = eob.url || eob.storagePath || eob.fileUrl || eob.documentUrl;
                      if (url) {
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = eob.filename || eob.fileName || `EOB #${idx + 1}`;
                        a.target = '_blank';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } else {
                        alert('No URL available to download this document.');
                      }
                    }} sx={{ fontSize: '13px', color: COLORS.ACCENT, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Download</Typography>
                  </Box>
                  <Box sx={{ width: '40px', textAlign: 'center' }}>
                    <IconButton size="small" onClick={() => handleDeleteEob(eob, idx)}>
                      <Box component="img" src={deleteIconSvg} alt="delete" sx={{ width: 14, height: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              )})
            )}
          </Box>
        </Box>
      </BaseDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deletingEob}
        onClose={() => setDeletingEob(null)}
        onConfirm={handleConfirmDelete}
        title="Delete EOB"
        message="Are you sure you want to delete this EOB?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleting}
        dialogSx={{ zIndex: 140000 }}
      />
    </>
  );
};

export default EOBListDialog;
