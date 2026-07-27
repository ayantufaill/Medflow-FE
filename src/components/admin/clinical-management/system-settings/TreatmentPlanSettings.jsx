import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';

const TreatmentPlanSettings = ({ treatmentPlan, handleTreatmentPlanChange }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          Treatment Plan Procedures
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Default Procedure State on Treatment Plan</Typography>
          <RadioGroup row value={treatmentPlan.defaultState} onChange={(e) => handleTreatmentPlanChange({ defaultState: e.target.value })}>
            <FormControlLabel value="Diagnosed" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Diagnosed</Typography>} />
            <FormControlLabel value="Accepted" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Accepted</Typography>} />
            <FormControlLabel value="Presented" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Presented</Typography>} />
          </RadioGroup>
        </Box>
        <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={treatmentPlan.hideFeeAndProvider} onChange={(e) => handleTreatmentPlanChange({ hideFeeAndProvider: e.target.checked })} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />}
            label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Hide Fee and Provider on Existing out Procedures</Typography>}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TreatmentPlanSettings;
