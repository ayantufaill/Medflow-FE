import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { calculateAge, formatDate } from "./utils";

const MyChartLeftPanel = ({ patientData, showTable, handleToggleTable, rows, handleDeletePending, handleCopy }) => {
  return (
    <Grid size={{ xs: 12, md: showTable ? 7 : 6 }}>
      <Box
        sx={{
          border: "1px solid #d0d5dd",
          borderRadius: '8px',
          bgcolor: '#f9fafb',
          p: 3,
          height: "100%",
        }}
      >
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ color: "#09121f", fontWeight: 700, mb: 1, fontFamily: 'Inter', fontSize: '13px' }}
        >
          MYCHART PATIENT PROFILE
        </Typography>
        
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#374151', fontSize: '13px' }}>
            <strong>{patientData.firstName} {patientData.lastName}</strong> — {formatDate(patientData.dateOfBirth)} (Age {calculateAge(patientData.dateOfBirth)})
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#6b7280', fontSize: '12px', mt: 0.5 }}>
            Email: {patientData.email}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#6b7280', fontSize: '12px' }}>
            Registered With: {patientData.registeredWith}
          </Typography>
        </Box>

        <Typography 
          variant="caption" 
          sx={{ 
            display: "block", 
            mb: 1, 
            fontWeight: 600, 
            color: "#2262ef",
            cursor: "pointer",
            fontFamily: 'Inter',
            fontSize: '12px',
            "&:hover": { opacity: 0.8 }
          }}
          onClick={handleToggleTable}
        >
          {showTable ? "▼" : "▶"} Mychart Profile Status
        </Typography>

        {showTable && (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e5eb", borderRadius: '8px' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f3f4f6' }}>
              <TableRow>
                <TableCell sx={{ fontSize: "11px", fontWeight: 600, fontFamily: 'Inter', color: '#4b5563', borderBottom: '1px solid #e0e5eb' }}>Item</TableCell>
                <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, fontFamily: 'Inter', color: '#4b5563', borderBottom: '1px solid #e0e5eb' }}>Completed</TableCell>
                <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, fontFamily: 'Inter', color: '#4b5563', borderBottom: '1px solid #e0e5eb' }}>Request Pending</TableCell>
                <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, fontFamily: 'Inter', color: '#4b5563', borderBottom: '1px solid #e0e5eb' }}>Import</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell sx={{ fontSize: "12px", color: "#374151", fontFamily: 'Inter', borderBottom: '1px solid #f3f4f6' }}>{row.name}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "12px", fontFamily: 'Inter', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>{row.completed}</TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "12px", fontFamily: 'Inter', color: '#6b7280' }}>{row.pending}</Typography>
                      {row.pending === "Yes" && (
                        <DeleteIcon 
                          sx={{ fontSize: 16, color: "#ef4444", cursor: "pointer", "&:hover": { color: "#dc2626" } }}
                          onClick={() => handleDeletePending(index)}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #f3f4f6' }}>
                    {row.canCopy && (
                      <Button
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={() => handleCopy(index)}
                        sx={{ 
                          bgcolor: "#2262ef", 
                          color: "#fff",
                          textTransform: "none", 
                          fontSize: "11px",
                          fontWeight: 500,
                          fontFamily: 'Inter',
                          borderRadius: '6px',
                          minWidth: 60,
                          px: 2,
                          py: 0.5,
                          "&:hover": { bgcolor: "#1a50cc" } 
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
  );
};

export default MyChartLeftPanel;
