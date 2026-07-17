import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Link,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';
import { COLORS } from '../../../../constants/colors';

import LabCasesFilters from './LabCasesFilters';
import LabCasesActions from './LabCasesActions';
import LabCasesTable from './LabCasesTable';

const LabCasesDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          minHeight: '80vh'
        }
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
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
        }}
      >
        <ScienceIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Lab Cases
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
        <Link 
          href="#" 
          underline="always" 
          sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', mt: 1, mb: 2, display: 'inline-block' }}
        >
        </Link>

        {/* Filters */}
        <LabCasesFilters />

        {/* Actions */}
        <LabCasesActions />

        {/* Table */}
        <LabCasesTable />

        <Box sx={{ p: "12px 24px", borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE, display: 'flex', justifyContent: 'flex-end', mt: 'auto', mx: '-25px', mb: '-25px' }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onClose}
            sx={{ 
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_SECONDARY,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: "transparent" },
              textTransform: "none",
              borderRadius: "6px",
              px: "20px",
              height: 32,
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LabCasesDialog;
