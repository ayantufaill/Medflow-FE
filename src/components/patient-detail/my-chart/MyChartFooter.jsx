import React from 'react';
import { Box, Button } from "@mui/material";

const MyChartFooter = ({ onClose }) => {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      px: "20px", py: "12px", borderTop: "1px solid #e0e5eb", gap: "8px"
    }}>
      <Button 
        variant="outlined" 
        onClick={onClose} 
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
    </Box>
  );
};

export default MyChartFooter;
