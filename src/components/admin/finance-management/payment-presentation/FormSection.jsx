import React from 'react';
import { Paper, Grid, Typography, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';

const FormSection = ({ title, subTitle, children, show, onToggle }) => (
  <Paper sx={{ mb: 3, borderRadius: 2, border: '1px solid #E5E9F2', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)', overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <Box sx={{ width: '18%', flexShrink: 0, p: 2.5, borderRight: '1px solid #E5E9F2', bgcolor: '#F8FAFC' }}>
        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>{title}</Typography>
        {subTitle && (
          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic', mt: 0.5 }}>
            {subTitle}
          </Typography>
        )}
        <RadioGroup row sx={{ mt: 1.5 }} value={show ? 'show' : 'hide'} onChange={(e) => onToggle(e.target.value === 'show')}>
          <FormControlLabel 
            value="show" 
            control={<Radio size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />} 
            label={<Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>Show</Typography>} 
          />
          <FormControlLabel 
            value="hide" 
            control={<Radio size="small" sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />} 
            label={<Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>Hide</Typography>} 
          />
        </RadioGroup>
      </Box>
      <Box sx={{ flex: 1, p: 2.5, bgcolor: 'white' }}>
        {children}
      </Box>
    </Box>
  </Paper>
);

export default FormSection;
