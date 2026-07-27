import React from 'react';
import { Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import FormSection from './FormSection';

const NextAppointmentsSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Next Scheduled Appointments" 
      show={show} 
      onToggle={onToggle}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Provider Name</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.apptShowTreatmentProvider} onChange={(e) => handleSettingChange('apptShowTreatmentProvider', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Treatment Provider Name</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.apptShowHygieneProvider} onChange={(e) => handleSettingChange('apptShowHygieneProvider', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Hygiene Provider Name</Typography>} />
      </Box>
    </FormSection>
  );
};

export default NextAppointmentsSection;
