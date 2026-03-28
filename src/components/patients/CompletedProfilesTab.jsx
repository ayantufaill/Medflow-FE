import React from "react";
import { Box, Typography } from "@mui/material";

const CompletedProfilesTab = () => {
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
        UPDATE REQUESTS
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Typography sx={{ color: "#555", fontSize: "0.85rem" }}>
          You don't have new patients to Update
        </Typography>
      </Box>

      {/* New Patients Section */}
      <Typography 
        sx={{ 
          fontSize: "0.95rem", 
          fontWeight: 700, 
          color: sectionTitleColor,
          letterSpacing: '0.02em',
          mb: 4
        }}
      >
        NEW PATIENTS
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: "#555", fontSize: "0.85rem" }}>
          You don't have new patients to import
        </Typography>
      </Box>
    </Box>
  );
};

export default CompletedProfilesTab;
