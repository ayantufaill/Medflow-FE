import React from 'react';
import { Select, MenuItem, Checkbox, FormControlLabel, Typography, TextField, InputAdornment, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SearchIcon from '@mui/icons-material/Search';

export const ReportSelect = ({ label, prefix, options = [], value, defaultValue, onChange, width, sx }) => {
  return (
    <Select
      size="small"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      MenuProps={{ sx: { zIndex: 1600 } }}
      sx={{
        width: width || 'auto',
        minWidth: width ? 'auto' : 100,
        height: 36,
        fontSize: '13px',
        fontFamily: 'Inter',
        fontWeight: 500,
        color: '#09121f',
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
        },
        ...sx
      }}
    >
      {(label || prefix) && (
        <MenuItem value={defaultValue || ''} disabled={!defaultValue}>
          {prefix && <span style={{ color: '#64748b', marginRight: '4px' }}>{prefix}</span>}
          {label}
        </MenuItem>
      )}
      {options.map((opt, idx) => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        return <MenuItem key={idx} value={optValue} sx={{ fontFamily: 'Inter', fontSize: '13px' }}>{optLabel}</MenuItem>;
      })}
    </Select>
  );
};

export const ReportCheckbox = ({ label, checked, defaultChecked, onChange, sx }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox 
          size="small" 
          icon={<RadioButtonUncheckedIcon sx={{ color: '#cbd5e1' }} />} 
          checkedIcon={<CheckCircleIcon sx={{ color: '#2563eb' }} />} 
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          sx={{ padding: '4px' }} 
        />
      }
      label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', ml: 0.5, whiteSpace: 'nowrap' }}>{label}</Typography>}
      sx={{ m: 0, ...sx }}
    />
  );
};

export const ReportSearchInput = ({ placeholder = "Search", value, onChange, width = '224px' }) => {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={{
        width: width,
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
  );
};

export const ReportDivider = () => {
  return (
    <Box sx={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', mx: 1 }} />
  );
};
