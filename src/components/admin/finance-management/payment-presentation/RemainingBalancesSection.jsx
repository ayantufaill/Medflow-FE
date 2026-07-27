import React from 'react';
import { Grid, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import FormSection from './FormSection';

const RemainingBalancesSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Remaining Balances" 
      show={show} 
      onToggle={onToggle}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Estimated portions</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 4 }}>
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstRemInsAdj} onChange={(e) => handleSettingChange('balEstRemInsAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Estimated Remaining Ins. Adjustment</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstRemIns} onChange={(e) => handleSettingChange('balEstRemIns', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Estimated Remaining Insurance</Typography>} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalPtPayments} onChange={(e) => handleSettingChange('balTotalPtPayments', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Patient Payments</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalInsPayments} onChange={(e) => handleSettingChange('balTotalInsPayments', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Insurance Payments</Typography>} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalAdj} onChange={(e) => handleSettingChange('balTotalAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Adjustment</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstPtPortion} onChange={(e) => handleSettingChange('balEstPtPortion', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Estimated pt portion</Typography>} />
        </Box>
      </Box>
    </FormSection>
  );
};

export default RemainingBalancesSection;
