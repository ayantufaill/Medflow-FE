import React from 'react';
import { Box, Typography, Button, Grid } from "@mui/material";
import { formatDate } from "./utils";

const MyChartRightPanel = ({ patientData, showTable, handleUnlink, handleIgnoreRequests }) => {
  return (
    <Grid size={{ xs: 12, md: showTable ? 5 : 6 }}>
      <Box
        sx={{
          border: "1px solid #e0e5eb",
          borderRadius: '8px',
          bgcolor: '#ffffff',
          p: 3,
          height: "fit-content",
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ color: "#09121f", fontWeight: 700, mb: 2, fontFamily: 'Inter', fontSize: '13px' }}
        >
          OFFICE PATIENT PROFILE
        </Typography>

        <Box sx={{ flex: 1, textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#374151', fontSize: '13px' }}>
            <strong>{patientData.firstName} {patientData.lastName}</strong> - {formatDate(patientData.dateOfBirth)}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#6b7280', fontSize: '12px', mt: 0.5 }}>
            Email: {patientData.email}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleUnlink}
            sx={{ 
              flex: 1,
              borderColor: "#d0d5dd", 
              color: "#374151", 
              textTransform: "none",
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '6px',
              "&:hover": { bgcolor: "#f9fafb", borderColor: "#9ca3af" }
            }}
          >
            Unlink
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleIgnoreRequests}
            sx={{ 
              flex: 1,
              borderColor: "#d0d5dd", 
              color: "#ef4444", 
              textTransform: "none",
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '6px',
              "&:hover": { bgcolor: "#fef2f2", borderColor: "#ef4444" }
            }}
          >
            Ignore Patient Requests
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default MyChartRightPanel;
