import React from 'react';
import { Box, Typography, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';

const PerioChartingSettings = ({ perio, handlePerioChange }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          Perio Charting
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
          Display one or three probing measurements for recession and Attached Gingiva on Facial and Lingual of each tooth
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, minWidth: 80 }}>Gingiva</Typography>
            <RadioGroup row value={perio.gingiva} onChange={(e) => handlePerioChange({ gingiva: e.target.value })}>
              <FormControlLabel value="One" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>One</Typography>} />
              <FormControlLabel value="Three" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Three</Typography>} />
            </RadioGroup>
          </Box>
          <FormControlLabel
            control={<Checkbox size="small" checked={perio.attachedGingiva} onChange={(e) => handlePerioChange({ attachedGingiva: e.target.checked })} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />}
            label={
              <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
                Perio Chart Attached Gingiva <Typography component="span" sx={{ color: '#64748b', fontSize: '0.8rem' }}>(add and display attached gingiva measurement on the perio chart)</Typography>
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', width: '100%' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, minWidth: 80 }}>Recession</Typography>
            <RadioGroup row value={perio.recession} onChange={(e) => handlePerioChange({ recession: e.target.value })}>
              <FormControlLabel value="One" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>One</Typography>} />
              <FormControlLabel value="Three" control={<Radio size="small" sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Three</Typography>} />
            </RadioGroup>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Probing Depth Limit</Typography>
            <Select
              value={perio.probingDepthLimit}
              onChange={(e) => handlePerioChange({ probingDepthLimit: e.target.value })}
              size="small"
              sx={{ 
                backgroundColor: '#fff', 
                fontSize: '0.85rem', 
                borderRadius: 1.5,
                minWidth: 80,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
              }}
            >
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PerioChartingSettings;
