import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const MyChartFileDialog = ({ open, onClose, patient }) => {
  // Styles based on screenshot
  const headerBg = "#5c7bb7"; // Blue top bar
  const myChartGreen = "#e0f2f1"; // Left panel background
  const officeBlue = "#e8eaf6"; // Right panel background
  const copyGreen = "#4db6ac"; // Copy button color
  const unlinkBlue = "#5c7bb7"; // Unlink button color
  const ignoreTan = "#d7ccc8"; // Ignore button color

  // Patient data from props or default demo data
  const patientData = patient || {
    firstName: "Anna",
    lastName: "Ricco",
    dateOfBirth: "1998-08-25",
    email: "anna.ricco@example.com",
    registeredWith: "Family Dental",
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dob) => {
    if (!dob) return "";
    return new Date(dob).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Blue Header Bar */}
      <DialogTitle
        sx={{
          bgcolor: headerBg,
          color: "white",
          textAlign: "center",
          fontSize: "1rem",
          py: 1,
        }}
      >
        MyChart File
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          {/* LEFT PANEL: MyChart Patient Profile */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                border: "2px solid #b2dfdb",
                borderRadius: 2,
                bgcolor: myChartGreen,
                p: 2,
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ color: "#00897b", fontWeight: 700, mb: 1 }}
              >
                MYCHART PATIENT PROFILE
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{patientData.firstName} {patientData.lastName}</strong> — {formatDate(patientData.dateOfBirth)} (Age {calculateAge(patientData.dateOfBirth)})
                </Typography>
                <Typography variant="body2" color="text.secondary">Email: {patientData.email}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered With: {patientData.registeredWith} {patientData.email}
                </Typography>
              </Box>

              <Typography 
                variant="caption" 
                sx={{ 
                  display: "block", 
                  mb: 1, 
                  fontWeight: 600, 
                  color: "#00897b",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 }
                }}
                onClick={handleToggleTable}
              >
                {showTable ? "^" : "v"} Mychart Profile Status
              </Typography>

              {showTable && (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "0.75rem", fontWeight: 700 }}></TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.75rem", fontWeight: 700 }}>Completed</TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.75rem", fontWeight: 700 }}>Request Pending</TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.75rem", fontWeight: 700 }}>Import from MyChart</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={row.name}>
                        <TableCell sx={{ fontSize: "0.75rem", color: "#00897b" }}>{row.name}</TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{row.completed}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: "0.75rem" }}>{row.pending}</Typography>
                            {row.pending === "Yes" && (
                              <DeleteIcon 
                                sx={{ fontSize: 16, color: "#ef9a9a", cursor: "pointer" }}
                                onClick={() => handleDeletePending(index)}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {row.canCopy && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleCopy(index)}
                              sx={{ 
                                bgcolor: copyGreen, 
                                textTransform: "none", 
                                fontSize: "0.7rem",
                                minWidth: 60,
                                "&:hover": { bgcolor: "#00897b" } 
                              }}
                            >
                              Copy
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              )}
            </Box>
          </Grid>

          {/* RIGHT PANEL: Office Patient Profile */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                border: "2px solid #c5cae9",
                borderRadius: 2,
                bgcolor: officeBlue,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ color: "#3f51b5", fontWeight: 700, mb: 2 }}
              >
                OFFICE PATIENT PROFILE
              </Typography>

              <Typography variant="body2"><strong>{patientData.firstName} {patientData.lastName}</strong> - {formatDate(patientData.dateOfBirth)}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Email: {patientData.email}</Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleUnlink}
                  sx={{ bgcolor: unlinkBlue, textTransform: "none" }}
                >
                  Unlink
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleIgnoreRequests}
                  sx={{ 
                    bgcolor: ignoreTan, 
                    color: "white", 
                    textTransform: "none",
                    "&:hover": { bgcolor: "#bcaaa4" }
                  }}
                >
                  Ignore Patient Requests
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ bgcolor: "#9e9e9e", textTransform: "none", px: 4 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyChartFileDialog;
