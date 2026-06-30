import React from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button, TextField, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const renderFilterSelect = (label, prefix = '', options = [], defaultValue) => (
  <Select
    size="small"
    defaultValue={defaultValue}
    sx={{
      minWidth: 140,
      height: 36,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#1e293b',
      backgroundColor: '#fff',
      borderRadius: '8px',
      '& .MuiSelect-select': {
        py: 1,
        pl: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e8f0'
      }
    }}
  >
    <MenuItem value={defaultValue}>
      {prefix && <span style={{ color: '#64748b', marginRight: '4px' }}>{prefix}</span>}
      {label}
    </MenuItem>
    {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
  </Select>
);

const RecareListFilters = () => {
  return (
    <Box sx={{ mb: 2, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Top Filter Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 1.5, p: 2, pb: 1.5, backgroundColor: '#fff' }}>
        {renderFilterSelect('05/08/2026 - 06/08/2026', 'RANGE', [], '05/08/2026 - 06/08/2026')}
        {renderFilterSelect('All Dentists', 'DENTIST', [], 'All Dentists')}
        {renderFilterSelect('All Hygienists', 'HYGIENIST', [], 'All Hygienists')}
        {renderFilterSelect('With or Without', 'FLAGS', [], 'With or Without')}

        <TextField
          size="small"
          placeholder="Search patient"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              height: 36,
              fontSize: '0.75rem',
              '& fieldset': { borderColor: '#e2e8f0' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#00BBAB', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#00A395', boxShadow: 'none' } }}>
          Regenerate Recare
        </Button>
      </Box>

      {/* Second Filter Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 3, p: 2, pt: 1.5, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={<Checkbox size="small" icon={<RadioButtonUncheckedIcon sx={{ color: '#3b82f6' }} />} checkedIcon={<CheckCircleIcon sx={{ color: '#2563eb' }} />} sx={{ padding: '4px' }} />}
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', ml: 0.5 }}>Include Appointed</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" defaultChecked icon={<RadioButtonUncheckedIcon sx={{ color: '#3b82f6' }} />} checkedIcon={<CheckCircleIcon sx={{ color: '#2563eb' }} />} sx={{ padding: '4px' }} />}
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', ml: 0.5 }}>Show Flags in Report</Typography>}
            sx={{ m: 0 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Clear all
          </Typography>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}>
            Apply Filters
          </Button>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap' }}>
            Create Template
          </Button>
          <Button variant="outlined" size="small" startIcon={<PrintIcon sx={{ color: '#3b82f6' }} />} sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap' }}>
            Print
          </Button>
          <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#2E8CCC', boxShadow: 'none' } }}>
            Export CSV
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RecareListFilters;
