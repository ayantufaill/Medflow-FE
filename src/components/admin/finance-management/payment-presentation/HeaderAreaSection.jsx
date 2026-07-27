import React from 'react';
import { Grid, Typography, RadioGroup, FormControlLabel, Radio, Box, Checkbox, Select, MenuItem } from '@mui/material';
import FormSection from './FormSection';

const HeaderAreaSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Header Area" 
      show={show} 
      onToggle={onToggle}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Header Type</Typography>
          <RadioGroup value={formSettings.headerType} onChange={(e) => handleSettingChange('headerType', e.target.value)}>
            <FormControlLabel value="detachable" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Detachable slip</Typography>} />
            <FormControlLabel value="envelope" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>2-window envelope</Typography>} />
            <FormControlLabel value="regular" control={<Radio size="small" sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Regular</Typography>} />
          </RadioGroup>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Office Info</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeLogo} onChange={(e) => handleSettingChange('officeLogo', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Office Logo</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.officePhone} onChange={(e) => handleSettingChange('officePhone', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Office Phone Number</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeAddress} onChange={(e) => handleSettingChange('officeAddress', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Address</Typography>} />
            <Box sx={{ ml: 3 }}>
              <Select size="small" value={formSettings.officeAddressValue} onChange={(e) => handleSettingChange('officeAddressValue', e.target.value)} sx={{ height: 30, fontSize: '0.8rem', width: 140 }}>
                <MenuItem value="office1">Office Address</MenuItem>
              </Select>
            </Box>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeWebsite} onChange={(e) => handleSettingChange('officeWebsite', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Office Website</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeEmail} onChange={(e) => handleSettingChange('officeEmail', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Office Email</Typography>} />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Patient Info</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientName} onChange={(e) => handleSettingChange('patientName', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Patient Full Name</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientTitle} onChange={(e) => handleSettingChange('patientTitle', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Patient Title</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientAge} onChange={(e) => handleSettingChange('patientAge', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Patient Age</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientDOB} onChange={(e) => handleSettingChange('patientDOB', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Patient DOB</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientPhone} onChange={(e) => handleSettingChange('patientPhone', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Patient Phone Number</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.enclosedAmountBox} onChange={(e) => handleSettingChange('enclosedAmountBox', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Enclosed Amount Box</Typography>} />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>General</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.dueDate} onChange={(e) => handleSettingChange('dueDate', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Due Date</Typography>} />
            <Select size="small" value={formSettings.dueDateValue} onChange={(e) => handleSettingChange('dueDateValue', e.target.value)} sx={{ height: 30, fontSize: '0.8rem', width: '100%' }}>
              <MenuItem value="receipt">Upon Receipt</MenuItem>
            </Select>
          </Box>
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default HeaderAreaSection;
