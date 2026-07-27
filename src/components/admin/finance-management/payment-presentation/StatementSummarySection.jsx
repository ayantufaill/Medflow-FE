import React from 'react';
import { Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import FormSection from './FormSection';

const StatementSummarySection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Statement Summary" 
      subTitle="only on full account statement"
      show={show} 
      onToggle={onToggle}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Totals</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalCharges} onChange={(e) => handleSettingChange('summaryTotalCharges', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Charges</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalPtPayments} onChange={(e) => handleSettingChange('summaryTotalPtPayments', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Patient Payments</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalOfficeAdj} onChange={(e) => handleSettingChange('summaryTotalOfficeAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Office Adjustments</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalRefunds} onChange={(e) => handleSettingChange('summaryTotalRefunds', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Refunds</Typography>} />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalInsPayments} onChange={(e) => handleSettingChange('summaryTotalInsPayments', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Insurance Payments</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalInsAdj} onChange={(e) => handleSettingChange('summaryTotalInsAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Total Insurance Adjs (write-off)</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryShowPerInsCoverage} onChange={(e) => handleSettingChange('summaryShowPerInsCoverage', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show per insurance coverage</Typography>} />
        <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryShowPerInsCoverageAdj} onChange={(e) => handleSettingChange('summaryShowPerInsCoverageAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show per insurance coverage adjs</Typography>} />
      </Box>
    </FormSection>
  );
};

export default StatementSummarySection;
