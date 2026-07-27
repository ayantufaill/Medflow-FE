import React from 'react';
import { Grid, Typography, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import FormSection from './FormSection';

const AgingBalanceSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Aging Balance & Credit" 
      show={show} 
      onToggle={onToggle}
    >
      {/* Balance Aging Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, minWidth: 120, pt: 1 }}>Balance Aging:</Typography>
        <Box>
          <RadioGroup row value={formSettings.agingBalance} onChange={(e) => handleSettingChange('agingBalance', e.target.value)}>
            <FormControlLabel value="total" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Total Aging (ins & pt)</Typography>} />
            <FormControlLabel value="patientOnly" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Patient Aging Only</Typography>} />
            <FormControlLabel value="none" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Don't Show Aging</Typography>} />
          </RadioGroup>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: -0.5, fontStyle: 'italic' }}>This excludes the estimated remaining write-off (ins adj).</Typography>
        </Box>
      </Box>

      {/* Account Credit Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, minWidth: 120, pt: 1 }}>Account Credit:</Typography>
        <RadioGroup row value={formSettings.agingCredit} onChange={(e) => handleSettingChange('agingCredit', e.target.value)}>
          <FormControlLabel value="total" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Total Credit (ins & pt)</Typography>} />
          <FormControlLabel value="patientOnly" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show Patient Credit Only</Typography>} />
          <FormControlLabel value="none" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Don't Show Credit</Typography>} />
        </RadioGroup>
      </Box>

      {/* Aging Date Row */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, minWidth: 120 }}>Aging Date:</Typography>
        <RadioGroup row value={formSettings.agingDate} onChange={(e) => handleSettingChange('agingDate', e.target.value)}>
          <FormControlLabel value="dos" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Remaining Balance DOS</Typography>} />
          <FormControlLabel value="invoice" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Invoice Date</Typography>} />
        </RadioGroup>
      </Box>
    </FormSection>
  );
};

export default AgingBalanceSection;
