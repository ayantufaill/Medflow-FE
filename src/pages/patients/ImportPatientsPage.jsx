import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import CompletedProfilesTab from "../../components/patients/CompletedProfilesTab";
import IncompleteProfilesTab from "../../components/patients/IncompleteProfilesTab";
import DeletedProfilesTab from "../../components/patients/DeletedProfilesTab";
import SignedFormsTab from "../../components/patients/SignedFormsTab";

const ImportPatientsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const headerBlue = "#5c7cba"; // Matching the audit/import header color
  const sectionTitleColor = "#5c7cba"; // Deep blue for "UPDATE REQUESTS"

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>
      {/* Title Header */}
      <Box 
        sx={{ 
          bgcolor: headerBlue, 
          color: "#fff", 
          py: 0.7, 
          textAlign: "center" 
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Import Patients
        </Typography>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="import patient tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 400,
              minWidth: 'auto',
              px: 3,
              color: '#666',
            },
            '& .Mui-selected': {
              color: '#333 !important',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: headerBlue,
              height: 3,
            }
          }}
        >
          <Tab label="Completed Profiles" />
          <Tab label="Incomplete Profiles" />
          <Tab label="Deleted Profiles" />
          <Tab label="Signed Forms" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 0 }}>
        {tabValue === 0 && <CompletedProfilesTab />}
        {tabValue === 1 && <IncompleteProfilesTab />}
        {tabValue === 2 && <DeletedProfilesTab />}
        {tabValue === 3 && <SignedFormsTab />}
      </Box>
    </Box>
  );
};

export default ImportPatientsPage;
