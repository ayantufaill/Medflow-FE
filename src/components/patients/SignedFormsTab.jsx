import React from "react";
import { Box, Typography } from "@mui/material";

const SignedFormsTab = () => {
  const sectionTitleColor = "#5c7cba";

  return (
    <Box sx={{ p: 2 }}>
      {/* Update Requests Section */}
      <Typography 
        sx={{ 
          fontSize: "0.95rem", 
          fontWeight: 700, 
          color: sectionTitleColor,
          letterSpacing: '0.02em',
          mb: 4
        }}
      >
        SIGNED FORMS
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Typography sx={{ color: "#555", fontSize: "0.85rem" }}>
          You don't have signed forms to view
        </Typography>
      </Box>
    </Box>
  );
};

export default SignedFormsTab;
