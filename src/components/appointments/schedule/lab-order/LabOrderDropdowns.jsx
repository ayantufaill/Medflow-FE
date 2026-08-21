import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

const LabOrderDropdowns = ({ 
  labs, 
  selectedLab, 
  setSelectedLab, 
  template, 
  handleTemplateChange 
}) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <Box>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>
          Choose Lab <span style={{ color: '#ef4444' }}>*</span>
        </Typography>
        <FormControl size="small" sx={{ width: '250px' }}>
          <Select 
            value={selectedLab} 
            onChange={(e) => setSelectedLab(e.target.value)} 
            MenuProps={{ sx: { zIndex: 14000 } }} 
            sx={{ fontSize: '13px', height: '36px', fontFamily: 'Inter', borderRadius: '8px' }}
          >
            {labs.map(lab => (
              <MenuItem key={lab._id} value={lab._id} sx={{ fontSize: '13px', fontFamily: 'Inter' }}>
                {lab.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>
          Choose Template
        </Typography>
        <FormControl size="small" sx={{ width: '250px' }}>
          <Select 
            value={template} 
            onChange={handleTemplateChange} 
            MenuProps={{ sx: { zIndex: 14000 } }} 
            sx={{ fontSize: '13px', height: '36px', fontFamily: 'Inter', borderRadius: '8px' }}
          >
            <MenuItem value="none" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>None</MenuItem>
            <MenuItem value="crown" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Crown Template</MenuItem>
            <MenuItem value="denture" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Denture Template</MenuItem>
            <MenuItem value="bridge" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Bridge Template</MenuItem>
            <MenuItem value="implant" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Implant Crown Template</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default LabOrderDropdowns;
