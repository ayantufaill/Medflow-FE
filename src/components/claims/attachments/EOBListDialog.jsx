import React from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox, IconButton, Button, Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { downloadDocumentFile } from '../../../utils/downloadUtils';
import BaseDialog from '../../shared/BaseDialog';
import { COLORS } from '../../../constants/colors';
import { radius, fontWeight } from '../../../constants/styles';

const EOBListDialog = ({ open, onClose, claimNumber, eobs }) => {
  return (
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
            Attach
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
            control={<Checkbox size="small" />}
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

          {(!eobs || eobs.length === 0) ? (
            <Box sx={{ p: 4, textAlign: 'center', backgroundColor: COLORS.SURFACE_CARD }}>
              <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, fontStyle: 'italic' }}>No EOB documents found.</Typography>
            </Box>
          ) : (
            eobs.map((eob, idx) => (
              <Box key={eob._id || eob.id || idx} sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: idx === eobs.length - 1 ? 'none' : `1px solid ${COLORS.BORDER}`, backgroundColor: COLORS.SURFACE_CARD, px: 2 }}>
                <Box sx={{ width: '40px' }}>
                  <Checkbox size="small" />
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
                  <IconButton size="small" sx={{ color: '#ef4444' }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </BaseDialog>
  );
};

export default EOBListDialog;
