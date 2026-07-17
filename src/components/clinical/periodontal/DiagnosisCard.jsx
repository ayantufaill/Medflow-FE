import React from 'react';
import { Box, Typography, Radio, FormControlLabel, Select, MenuItem } from '@mui/material';

const DiagnosisCard = () => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', height: '100%', minHeight: '219px', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ p: 2.5, px: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Header Row */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ bgcolor: '#FFF1F2', color: '#F43F5E', px: 1, py: 0.3, borderRadius: '4px', fontWeight: 600, fontSize: '11px', lineHeight: 1 }}>MH</Typography>
          <Typography sx={{ bgcolor: '#FFF1F2', color: '#F43F5E', px: 1, py: 0.3, borderRadius: '4px', fontWeight: 600, fontSize: '11px', lineHeight: 1 }}>DH</Typography>
          <Typography sx={{ ml: 1, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', fontSize: '12px' }}>DIAGNOSIS</Typography>
        </Box>
        
        {/* Healthy / Gingivitis */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <FormControlLabel control={<Radio size="small" sx={{ p: 0.5, color: '#cbd5e1' }} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Healthy</Typography>} sx={{ m: 0 }} />
          <FormControlLabel control={<Radio size="small" sx={{ p: 0.5, color: '#cbd5e1' }} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Gingivitis</Typography>} sx={{ m: 0 }} />
        </Box>
        
        {/* Periodontitis Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', minWidth: 90 }}>Periodontitis</Typography>
          <Select 
            size="small" 
            value="stage2" 
            sx={{ 
              height: 32, 
              fontSize: '13px', 
              minWidth: 160,
              borderRadius: '8px',
              color: '#334155',
              fontWeight: 500,
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            }} 
          >
            <MenuItem value="stage2" sx={{ fontSize: '13px' }}>Stage II</MenuItem>
          </Select>
        </Box>

        {/* Localized / Generalized / Molar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
          <FormControlLabel control={<Radio size="small" sx={{ p: 0.5, color: '#cbd5e1' }} />} label={<Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Localized (&lt; 30% of teeth)</Typography>} sx={{ m: 0 }} />
          <FormControlLabel control={<Radio size="small" checked sx={{ p: 0.5, color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Generalized</Typography>} sx={{ m: 0 }} />
          <FormControlLabel control={<Radio size="small" sx={{ p: 0.5, color: '#cbd5e1' }} />} label={<Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Molar/Incisor</Typography>} sx={{ m: 0 }} />
        </Box>

        {/* Periodontal Grading Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#334155', minWidth: 135 }}>Periodontal Grading:</Typography>
          <Select 
            size="small" 
            value="gradeB" 
            sx={{ 
              height: 32, 
              fontSize: '13px', 
              minWidth: 160,
              borderRadius: '8px',
              color: '#334155',
              fontWeight: 500,
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            }} 
          >
            <MenuItem value="gradeB" sx={{ fontSize: '13px' }}>Grade B</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default DiagnosisCard;
