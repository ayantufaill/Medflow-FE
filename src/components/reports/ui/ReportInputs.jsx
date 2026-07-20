import React from 'react';
import { Select, MenuItem, Checkbox, FormControlLabel, Typography, TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const ReportSelect = ({ label, labelPosition = 'top', prefix, options = [], value, defaultValue, onChange, width, sx }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: labelPosition === 'left' ? 'row' : 'column', alignItems: labelPosition === 'left' ? 'center' : 'flex-start', gap: labelPosition === 'left' ? 1 : 0, minWidth: width || 140 }}>
      {label && (
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: labelPosition === 'top' ? 0.5 : 0, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
          {label.toLowerCase()}
        </Typography>
      )}
      <Select
        size="small"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        MenuProps={{ sx: { zIndex: 1600 } }}
        sx={{
          width: '100%',
          height: 36,
          fontSize: '13px',
          fontFamily: 'Inter',
          fontWeight: 500,
          color: '#09121f',
          backgroundColor: '#fafbfe',
          borderRadius: '4px',
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
        renderValue={(selected) => {
          const selectedOpt = options.find(opt => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            return optVal === selected;
          });
          
          let displayLabel = selected;
          if (selectedOpt) {
            displayLabel = typeof selectedOpt === 'object' ? selectedOpt.label : selectedOpt;
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span>{displayLabel}</span>
            </Box>
          );
        }}
      >
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return <MenuItem key={idx} value={optValue} sx={{ fontFamily: 'Inter', fontSize: '13px' }}>{optLabel}</MenuItem>;
        })}
      </Select>
    </Box>
  );
};

export const ReportCheckbox = ({ label, checked, defaultChecked, onChange, sx }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox 
          size="small" 
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
