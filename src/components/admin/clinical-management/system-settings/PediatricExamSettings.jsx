import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

const PediatricExamSettings = ({ pediatric, handlePediatricChange }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          Pediatric Exam
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={pediatric.activateExam} onChange={(e) => handlePediatricChange({ activateExam: e.target.checked })} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />}
          label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Activate Pediatric Exam</Typography>}
        />
      </Box>
    </Box>
  );
};

export default PediatricExamSettings;
