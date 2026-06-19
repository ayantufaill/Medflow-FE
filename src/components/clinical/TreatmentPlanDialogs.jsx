import React from 'react';
import { Dialog, Typography, Stack, Button, Box } from '@mui/material';

export const DeleteConfirmationDialog = ({ 
  open, 
  onClose, 
  onDelete, 
  selectedVisitIds, 
  selectedProcedureIds, 
  visits 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          p: 3,
          maxWidth: '450px',
          width: '100%',
          border: '1.5px solid #ef4444'
        }
      }}
    >
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
        Are you sure you want to delete the selected procedure?
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
        {selectedVisitIds.map(vId => {
          const v = visits.find(visit => visit.id === vId);
          return v ? (
            <Typography key={vId} sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
              - {v.label} (Entire Visit)
            </Typography>
          ) : null;
        })}
        {selectedProcedureIds.map(pId => {
          let foundProc = null;
          let isVisitSelected = false;
          visits.forEach(v => {
            const p = v.procedures.find(proc => proc.id === pId);
            if (p) {
              foundProc = p;
              if (selectedVisitIds.includes(v.id)) {
                isVisitSelected = true;
              }
            }
          });
          if (foundProc && !isVisitSelected) {
            return (
              <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                - {foundProc.treatmentName}
              </Typography>
            );
          }
          return null;
        })}
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="contained" 
          onClick={onDelete}
          sx={{ 
            bgcolor: '#e53935', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#c62828' }
          }}
        >
          Delete
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            bgcolor: '#78909c', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#546e7a' }
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Dialog>
  );
};

export const ReferConfirmationDialog = ({ 
  open, 
  onClose, 
  onRefer, 
  selectedDentist, 
  selectedProcedureIds, 
  visits 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          p: 3,
          maxWidth: '450px',
          width: '100%',
          border: '1.5px solid #f59e0b'
        }
      }}
    >
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
        Are you sure you want to REFER the following procedures to '{selectedDentist}':
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
        {selectedProcedureIds.map(pId => {
          let foundProc = null;
          visits.forEach(v => {
            const p = v.procedures.find(proc => proc.id === pId);
            if (p) foundProc = p;
          });
          if (foundProc) {
            return (
              <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                - {foundProc.treatmentName}{foundProc.toothNumber ? `(${foundProc.toothNumber})` : ''}
              </Typography>
            );
          }
          return null;
        })}
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="contained" 
          onClick={onRefer}
          sx={{ 
            bgcolor: '#f59e0b', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#d97706' }
          }}
        >
          Refer
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            bgcolor: '#78909c', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#546e7a' }
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Dialog>
  );
};

export const DbiConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  selectedProcedureIds, 
  visits 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          p: 3,
          maxWidth: '450px',
          width: '100%',
          border: '1.5px solid #f59e0b'
        }
      }}
    >
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
        Are you sure you want to NOT bill all the selected procedures
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
        {selectedProcedureIds.map(pId => {
          let foundProc = null;
          visits.forEach(v => {
            const p = v.procedures.find(proc => proc.id === pId);
            if (p) foundProc = p;
          });
          if (foundProc) {
            const suffix = foundProc.toothNumber || foundProc.surface 
              ? `(${foundProc.toothNumber ?? ''}${foundProc.surface ? ' ' + foundProc.surface : ''})`
              : '';
            return (
              <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                -{foundProc.treatmentName}{suffix}
              </Typography>
            );
          }
          return null;
        })}
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="contained" 
          onClick={onConfirm}
          sx={{ 
            bgcolor: '#f59e0b', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#d97706' }
          }}
        >
          Update
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            bgcolor: '#78909c', 
            color: '#fff', 
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#546e7a' }
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Dialog>
  );
};

export const FollowUpProcedureDialog = ({ 
  open, 
  onClose, 
  onSave, 
  followUpDate, 
  setFollowUpDate, 
  followUpReason, 
  setFollowUpReason 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          p: 0,
          maxWidth: '450px',
          width: '100%',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: '#2d4571', px: 2, py: 1.5 }}>
        <Typography sx={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>
          Follow Up Procedure:
        </Typography>
      </Box>
      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#334155' }}>
            Follow-up Date:
          </Typography>
          <Box 
            component="input"
            type="text"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            sx={{
              border: 'none',
              borderBottom: '1px solid #ccc',
              outline: 'none',
              fontSize: '0.875rem',
              color: '#334155',
              width: '120px',
              pb: 0.2
            }}
          />
        </Stack>

        <Box 
          component="textarea"
          placeholder="Reason"
          value={followUpReason}
          onChange={(e) => setFollowUpReason(e.target.value)}
          rows={4}
          sx={{
            width: '100%',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            p: 1,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'none',
            mb: 3
          }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="contained" 
            onClick={onSave}
            sx={{ 
              bgcolor: '#bca67a', 
              color: '#fff', 
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#aa956b' }
            }}
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ 
              bgcolor: '#94a3b8', 
              color: '#fff', 
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#64748b' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
