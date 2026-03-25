import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';

const PatientReportPage = () => {
  const { patientId, reportSection } = useParams();
  const navigate = useNavigate();
  
  // Determine active section from URL or default to 'risk'
  const activeSection = reportSection || 'risk';

  // Navigation sections for the report page (like patient section tabs)
  const reportSections = [
    { id: 'risk', label: 'RISK ASSESSMENT', path: `/patients/${patientId}/report/risk` },
    { id: 'homecare', label: 'HOME CARE', path: `/patients/${patientId}/report/homecare` },
    { id: 'concerns', label: 'CONCERNS', path: `/patients/${patientId}/report/concerns` },
    { id: 'showcase', label: 'SHOWCASE', path: `/patients/${patientId}/report/showcase` },
  ];

  return (
    <Box>
      {/* Navigation Buttons (like patient pages) */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {reportSections.map((section) => (
          <Button
            key={section.id}
            variant="text"
            size="small"
            onClick={() => navigate(section.path)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              py: 1,
              px: 1.5,
              borderRadius: 1,
              bgcolor: activeSection === section.id ? 'primary.main' : 'grey.100',
              color: activeSection === section.id ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: activeSection === section.id ? 'primary.dark' : 'grey.200',
              },
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>
      
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight={fontWeight.bold} sx={{ fontSize: fontSize.lg, color: '#1a2735' }} gutterBottom>
          Dental Assessment Report
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: fontSize.md }}>
          Comprehensive visual dental health evaluation
        </Typography>
      </Box>

      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body1">
          Please select a section above to view the detailed report.
        </Typography>
      </Box>
    </Box>
  );
};

export default PatientReportPage;
