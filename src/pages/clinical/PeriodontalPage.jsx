import React from 'react';
import { Box, Typography } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const PeriodontalPage = () => {
  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Box 
          sx={{ 
            border: '2px  #d1d5db',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            backgroundColor: '#f9fafb'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: '1rem', 
              color: '#6b7280',
              fontWeight: 300,
              mb: 1
            }}
          >
           This feature is under development
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PeriodontalPage;