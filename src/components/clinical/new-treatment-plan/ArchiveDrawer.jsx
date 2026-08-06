import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { COLORS } from '../../../constants/colors';

const ArchiveDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 } }
      }}
    >
      <Box sx={{
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
        <ArchiveOutlinedIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Archive
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
          No archived treatment plans
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ArchiveDrawer;
