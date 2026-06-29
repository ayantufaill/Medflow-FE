import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const renderFilterSelect = (label, options = [], defaultValue) => (
  <Select
    size="small"
    defaultValue={defaultValue}
    sx={{ 
      minWidth: 100, 
      height: 36,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#64748b',
      backgroundColor: '#fff',
      borderRadius: '8px',
      '& .MuiSelect-select': {
        py: 1,
        pl: 2,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e8f0'
      }
    }}
  >
    <MenuItem value={defaultValue}>{label}</MenuItem>
    {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
  </Select>
);

const AgingReportFilters = () => {
  return (
    <Box sx={{ mb: 2, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Top Filter Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 2, pb: 1.5, backgroundColor: '#fff' }}>
        {renderFilterSelect('BALANCE', [], 'BALANCE')}
        {renderFilterSelect('OWING', [], 'OWING')}
        {renderFilterSelect('BILLING DATE', [], 'BILLING DATE')}
        {renderFilterSelect('CLAIMS', [], 'CLAIMS')}
        {renderFilterSelect('PATIENTS', [], 'PATIENTS')}
        {renderFilterSelect('PROVIDER', [], 'PROVIDER')}
        {renderFilterSelect('AR RANGE', [], 'AR RANGE')}
        {renderFilterSelect('PTS FLAGS', [], 'PTS FLAGS')}
        {renderFilterSelect('SORT REPORT', [], 'SORT REPORT')}
      </Box>

      {/* Second Filter Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 2, p: 2, pt: 1.5, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked icon={<RadioButtonUncheckedIcon sx={{ color: '#cbd5e1' }} />} checkedIcon={<CheckCircleIcon sx={{ color: '#2563eb' }} />} sx={{ padding: '4px' }} />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', ml: 0.5 }}>Show Flags</Typography>} 
            sx={{ m: 0 }}
          />
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked icon={<RadioButtonUncheckedIcon sx={{ color: '#cbd5e1' }} />} checkedIcon={<CheckCircleIcon sx={{ color: '#2563eb' }} />} sx={{ padding: '4px' }} />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', ml: 0.5 }}>Payment Plan Owing</Typography>} 
            sx={{ m: 0 }}
          />
        </Box>

        <Box sx={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', mx: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
            RESET AGE ON 
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Pt</Typography>
          <Select size="small" defaultValue="dont" sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff', height: 32, borderRadius: '20px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
            <MenuItem value="dont">Don't reset</MenuItem>
          </Select>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Ins</Typography>
          <Select size="small" defaultValue="dont" sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff', height: 32, borderRadius: '20px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
            <MenuItem value="dont">Don't reset</MenuItem>
          </Select>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Clear all
          </Typography>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#2563eb', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', whiteSpace: 'nowrap' }}>
            Apply Filters
          </Button>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap' }}>
            Create Template
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AgingReportFilters;
