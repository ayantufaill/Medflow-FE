import React, { useState } from "react";
import { Dialog, Box, Grid } from "@mui/material";

import MyChartHeader from "./my-chart/MyChartHeader";
import MyChartLeftPanel from "./my-chart/MyChartLeftPanel";
import MyChartRightPanel from "./my-chart/MyChartRightPanel";
import MyChartFooter from "./my-chart/MyChartFooter";

const MyChartFileDialog = ({ open, onClose, patient }) => {
  // Patient data from props or default demo data
  const patientData = patient || {
    firstName: "Anna",
    lastName: "Ricco",
    dateOfBirth: "1998-08-25",
    email: "anna.ricco@example.com",
    registeredWith: "Family Dental",
  };

  // Initial rows with state
  const [rows, setRows] = useState([
    { name: "HIPAA", completed: "No", pending: "Yes", canCopy: false },
    { name: "Confidential Info", completed: "No", pending: "Yes", canCopy: true },
    { name: "Medical History", completed: "No", pending: "Yes", canCopy: true },
    { name: "Dental History", completed: "No", pending: "Yes", canCopy: true },
  ]);

  // Table visibility state
  const [showTable, setShowTable] = useState(true);

  // Toggle table visibility
  const handleToggleTable = () => {
    setShowTable((prev) => !prev);
  };

  // Handle delete pending request
  const handleDeletePending = (index) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, pending: "No" } : row
      )
    );
  };

  // Handle copy/import from MyChart
  const handleCopy = (index) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, completed: "Yes", pending: "No", canCopy: false } : row
      )
    );
  };

  // Handle unlink
  const handleUnlink = () => {
    console.log("Unlinking patient profile...");
    // TODO: Add actual unlink logic
  };

  // Handle ignore patient requests
  const handleIgnoreRequests = () => {
    setRows((prev) =>
      prev.map((row) => ({ ...row, pending: "No" }))
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{ zIndex: 1400 }} 
      PaperProps={{ 
        sx: { 
          borderRadius: '12px', 
          border: "1px solid #e0e5eb", 
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" 
        } 
      }}
    >
      <MyChartHeader onClose={onClose} />

      <Box sx={{ p: 4, pt: 3 }}>
        <Grid container spacing={3}>
          <MyChartLeftPanel 
            patientData={patientData} 
            showTable={showTable} 
            handleToggleTable={handleToggleTable} 
            rows={rows} 
            handleDeletePending={handleDeletePending} 
            handleCopy={handleCopy} 
          />
          <MyChartRightPanel 
            patientData={patientData} 
            showTable={showTable} 
            handleUnlink={handleUnlink} 
            handleIgnoreRequests={handleIgnoreRequests} 
          />
        </Grid>
      </Box>

      <MyChartFooter onClose={onClose} />
    </Dialog>
  );
};

export default MyChartFileDialog;
