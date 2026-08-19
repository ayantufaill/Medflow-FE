import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

const LabOrderFooter = ({ onClose, handleCreateSlip, saving }) => {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      px: "20px", py: "12px", borderTop: "1px solid #e0e5eb", gap: "8px"
    }}>
      <Button 
        variant="outlined" 
        onClick={onClose} 
        disabled={saving}
        sx={{
          fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
          textTransform: "none", borderRadius: "8px",
          border: "1px solid #d0d5dd", color: "#374151",
          px: "16px", py: "7px",
          "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
        }}
      >
        Close
      </Button>
      <Button 
        variant="contained" 
        disableElevation
        onClick={handleCreateSlip}
        disabled={saving}
        sx={{
          fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
          textTransform: "none", borderRadius: "8px",
          backgroundColor: "#2262ef", color: "#fff",
          px: "20px", py: "7px",
          "&:hover": { backgroundColor: "#1a50cc" },
        }}
      >
        {saving ? <CircularProgress size={18} color="inherit" /> : "Create slip"}
      </Button>
    </Box>
  );
};

export default LabOrderFooter;
