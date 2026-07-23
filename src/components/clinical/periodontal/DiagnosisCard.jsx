import React from 'react';
import { Box, Typography, Radio, FormControlLabel, Select, MenuItem, Checkbox } from '@mui/material';

const compareFieldsList = [
  { id: 'bleeding', label: 'Bleeding' },
  { id: 'probe', label: 'Probe' },
  { id: 'recession', label: 'Recession' },
  { id: 'attachmentLoss', label: 'Attachment Loss' },
  { id: 'gingiva', label: 'Gingiva' },
  { id: 'furcation', label: 'Furcation' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'pcs', label: 'Plq/calc/sup' }
];

const DiagnosisCard = ({ isCompareMode, compareDates, setCompareDates, compareFields, setCompareFields, visitDates }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', height: '100%', minHeight: '219px', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ p: 2.5, px: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: isCompareMode ? 'flex-start' : 'space-between', gap: isCompareMode ? 1.5 : 0 }}>
        
        {isCompareMode ? (
          <>
            {/* Compare Mode Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
              <Typography sx={{ color: '#64748b', fontSize: '13px', mr: 1 }}>Compare:</Typography>
              {visitDates && visitDates.length > 0 ? visitDates.map((vd, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={compareDates?.includes(vd.label) || idx === 0} 
                      onChange={(e) => {
                        if (setCompareDates) {
                          if (e.target.checked) {
                            setCompareDates([...(compareDates || []), vd.label]);
                          } else {
                            setCompareDates((compareDates || []).filter(d => d !== vd.label));
                          }
                        }
                      }}
                      sx={{ p: 0.5, color: '#94a3b8', '&.Mui-checked': { color: '#64748b' } }} 
                    />
                  }
                  label={<Typography sx={{ fontSize: '13px', color: '#64748b' }}>{vd.label}</Typography>}
                  sx={{ m: 0, mr: 2 }}
                />
              )) : (
                <FormControlLabel
                  control={<Checkbox size="small" checked sx={{ p: 0.5, color: '#94a3b8', '&.Mui-checked': { color: '#64748b' } }} />}
                  label={<Typography sx={{ fontSize: '13px', color: '#64748b' }}>07/15/2022</Typography>}
                  sx={{ m: 0 }}
                />
              )}
            </Box>

            <Typography sx={{ fontSize: '13px', color: '#64748b', mb: 1 }}>
              Select the dates and field you would like to compare:
            </Typography>

            {/* Compare Fields Checkboxes */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, columnGap: 2 }}>
              {compareFieldsList.map((field) => (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={compareFields?.[field.id] || false}
                      onChange={(e) => {
                        if (setCompareFields) {
                          setCompareFields({ ...compareFields, [field.id]: e.target.checked });
                        }
                      }}
                      sx={{ p: 0.5, color: '#94a3b8', '&.Mui-checked': { color: '#64748b' } }} 
                    />
                  }
                  label={<Typography sx={{ fontSize: '13px', color: '#64748b' }}>{field.label}</Typography>}
                  sx={{ m: 0, width: { xs: '45%', sm: '30%', md: 'auto' } }}
                />
              ))}
            </Box>
          </>
        ) : (
          <>
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
                  flex: 1,
                  minWidth: 100,
                  maxWidth: 200,
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
                  flex: 1,
                  minWidth: 100,
                  maxWidth: 200,
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default DiagnosisCard;
