import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

import calenderSvg from '../../../assets/treatmentplan/calender.svg';
import notesSvg from '../../../assets/treatmentplan/mdi_notes-outline.svg';

const NewTreatmentPlanHeader = ({ showOdontogram, setShowOdontogram }) => {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Left Date Pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#e6f0ff', px: 1.5, height: '30px', borderRadius: '15px' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#0052cc' }} />
          <Typography sx={{ color: '#0052cc', fontWeight: 700, fontSize: '0.8rem' }}>11/28/2022</Typography>
        </Box>
        
        {/* Connector Line */}
        <Box sx={{ width: '30px', height: '2px', bgcolor: '#14b8a6' }} />
        
        {/* Right Date Pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#0f172a', border: '1px solid #cbd5e1', px: 1.5, height: '30px', borderRadius: '15px' }}>
          <Box component="img" src={calenderSvg} alt="calendar" sx={{ width: 14, height: 14 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>02/14/2023</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" startIcon={<Box component="img" src={notesSvg} alt="notes" sx={{ width: 16, height: 16 }} />} sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b' }}>Notes</Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setShowOdontogram(!showOdontogram)}
          sx={{ textTransform: 'none', bgcolor: '#2563eb', boxShadow: 'none' }}
        >
          {showOdontogram ? 'Hide odontogram' : 'Show odontogram'}
        </Button>
      </Box>
    </Paper>
  );
};

export default NewTreatmentPlanHeader;
