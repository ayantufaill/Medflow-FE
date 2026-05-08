import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Checkbox,
  Button,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const columns = [
  { label: 'Tooth#', width: '60px' },
  { label: 'Surf', width: '50px' },
  { label: 'Code', width: '60px' },
  { label: 'Treatment', width: '150px' },
  { label: 'Options', width: '80px' },
  { label: 'Pt:', subLabel: '$0.00', width: '80px' },
  { label: 'Ins:', subLabel: '$0.00', width: '80px' },
  { label: 'Adj:', subLabel: '$0.00', width: '80px' },
  { label: 'Office Fee/UCR:', subLabel: '$0.00', width: '110px' },
  { label: 'Billed Fee:', subLabel: '$0.00', width: '90px' },
  { label: 'Provider', width: '80px' },
  { label: 'Status', width: '60px' },
  { label: 'Date', width: '80px' },
  { label: 'Phase', width: '60px' },
];

const ReEstimateCompletedProceduresDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        py: 1,
        px: 2
      }}>
        <Typography sx={{ color: '#1a3c7e', fontWeight: 700, fontSize: '0.9rem' }}>
          RE-ESTIMATE COMPLETED PROCEDURES
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#333', mb: 0.5 }}>
            Procedure Selection
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#666', mb: 2 }}>
            Please select the procedures you want to re-estimate.
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Box sx={{ 
          border: '1px solid #99cc33', 
          borderRadius: '10px',
          overflow: 'hidden',
          mb: 4
        }}>
          {/* Table Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: '#fff', 
            borderBottom: '1px solid #e0e0e0',
            py: 0.8,
            px: 2,
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <Box sx={{ minWidth: 40, display: 'flex', justifyContent: 'center' }}>
              <Checkbox size="small" checked sx={{ p: 0 }} />
            </Box>
            {columns.map((col, idx) => (
              <Box key={idx} sx={{ minWidth: col.width, px: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
                  {col.label}
                </Typography>
                {col.subLabel && (
                  <Typography sx={{ fontSize: '0.75rem', color: '#000', fontWeight: 700 }}>
                    {col.subLabel}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          {/* Empty Table Row/Body area as per image */}
          <Box sx={{ height: '40px', bgcolor: '#f5f5f5' }} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#333', mb: 2 }}>
            Estimate Settings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>With Default Fee Guide</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Without Scheduled Procedures</Typography>
              </Box>
            </Stack>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>With Zero Used</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Ignore Recare Procedures</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            bgcolor: '#e0e0e0', 
            color: '#444', 
            textTransform: 'none',
            borderRadius: '5px',
            px: 3,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#d5d5d5' }
          }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#333', fontStyle: 'italic' }}>
            Completed procedures that are invoiced and have linked transactions will not be re-estimated
          </Typography>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#7788bb', 
              color: '#fff', 
              textTransform: 'none',
              borderRadius: '5px',
              px: 3,
              '&:hover': { bgcolor: '#5c6bc0' }
            }}
          >
            Re-Estimate Selected
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReEstimateCompletedProceduresDialog;
