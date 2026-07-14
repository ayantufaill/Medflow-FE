import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import ClinicalNavbar from "../clinical/ClinicalNavbar";
import ExamNavbar from "../clinical/ExamNavbar";

const RadioExamHeader = () => {
  return (
    <>
      <ClinicalNavbar />
      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, mb: 0 }}>
        <Typography sx={{ 
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700, 
          fontSize: '24px', 
          lineHeight: '29.04px',
          color: '#111827' 
        }}>
          Exam
        </Typography>
        <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', pt: 0.5 }}>
          Patient examination records and clinical findings
        </Typography>
      </Stack>
      <Box sx={{ px: 0 }}>
        <ExamNavbar />
      </Box>
    </>
  );
};

export default RadioExamHeader;
