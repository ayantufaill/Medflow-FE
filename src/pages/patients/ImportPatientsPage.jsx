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
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

const ImportPatientsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden' }}>
      {/* Page Title */}
      <Box sx={{ px: '20px', pt: '18px', pb: 1 }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: fontWeight.bold,
            fontSize: fontSize.xl,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          Import Patients
        </Typography>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER}`, px: '20px' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="import patient tabs"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: 'Inter',
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              minWidth: 'auto',
              px: 2,
              py: 1.2,
              minHeight: 40,
              color: COLORS.TEXT_SECONDARY,
              '&:hover': {
                color: COLORS.TEXT_PRIMARY,
              },
            },
            '& .Mui-selected': {
              color: `${COLORS.ACCENT} !important`,
              fontWeight: fontWeight.semibold,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.ACCENT,
              height: 2.5,
              borderRadius: radius.pill,
            },
          }}
        >
          <Tab label="Completed Profiles" />
          <Tab label="Incomplete Profiles" />
          <Tab label="Deleted Profiles" />
          <Tab label="Signed Forms" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box>
        {tabValue === 0 && <CompletedProfilesTab />}
        {tabValue === 1 && <IncompleteProfilesTab />}
        {tabValue === 2 && <DeletedProfilesTab />}
        {tabValue === 3 && <SignedFormsTab />}
      </Box>
    </Box>
  );
};

export default ImportPatientsPage;
