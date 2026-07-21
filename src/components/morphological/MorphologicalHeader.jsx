import React from 'react';
import { Box, Button, Typography, Radio, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisitDatesTimeline from '../patients/VisitDatesTimeline';

const MorphologicalHeader = ({ visitDates, formData, handleFieldChange, onNewExam, onDateClick, isSigned, activeAppointmentId }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, mx: -3, px: 3, borderBottom: '1px solid #e0e0e0' }}>
      {/* Left: Visit dates timeline + New Exam */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', flex: 1 }}>
        <VisitDatesTimeline visitDates={visitDates} onDateClick={onDateClick} activeAppointmentId={activeAppointmentId} />
        <Button 
          startIcon={<AddIcon sx={{ fontSize: 18 }} />} 
          disableRipple
          onClick={onNewExam}
          disabled={isSigned}
          sx={{ 
            textTransform: 'none', 
            color: isSigned ? '#9ca3af' : '#2563eb', 
            fontWeight: 600, 
            fontSize: '0.8rem', 
            whiteSpace: 'nowrap', 
            flexShrink: 0,
            px: 2,
            py: 0.5,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'transparent', textDecoration: isSigned ? 'none' : 'underline' }
          }}
        >
          New Exam
        </Button>
      </Box>

      {/* Right: DH Badge + Radio/Checkboxes */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          sx={{ 
            bgcolor: '#fee2e2', 
            color: '#ef4444', 
            px: 1, 
            py: 0.25, 
            borderRadius: '4px',
            fontWeight: 700, 
            fontSize: '0.7rem' 
          }}
        >
          DH
        </Typography>
        
        <FormControlLabel
          control={
            <Radio 
              size="small" 
              checked={formData.analysisRequired} 
              onClick={() => handleFieldChange('analysisRequired', !formData.analysisRequired)} 
              sx={{ '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>Analysis required</Typography>}
        />
        <FormControlLabel
          control={
            <Radio 
              size="small" 
              checked={formData.analysisReferred} 
              onClick={() => handleFieldChange('analysisReferred', !formData.analysisReferred)} 
              sx={{ '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>Analysis referred</Typography>}
        />
      </Box>
    </Box>
  );
};

export default MorphologicalHeader;
