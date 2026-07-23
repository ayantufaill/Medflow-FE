import React, { createContext, useContext } from 'react';
import { Box, Typography, Divider, Checkbox, FormControlLabel, Switch, TextField, Tooltip, FormControl, Select, MenuItem } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const SettingsContext = createContext(null);

export const SectionHeader = ({ id, label }) => (
  <Box id={id} sx={{ pt: 1, pb: 0.5 }}>
    <Typography variant="body1" fontWeight={500} color="text.secondary" sx={{ mb: 0.75 }}>
      {label}
    </Typography>
    <Divider />
  </Box>
);

export const InfoIcon = () => (
  <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', ml: 0.5, verticalAlign: 'middle' }} />
);

export const SettingCheckbox = ({ label, defaultChecked = false, info = false }) => {
  const ctx = useContext(SettingsContext);
  const checked = ctx?.settings[label] !== undefined ? ctx.settings[label] : defaultChecked;
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(e) => ctx?.handleChange(label, e.target.checked)}
          sx={{ py: 0.5 }}
        />
      }
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography 
            sx={{ 
              color: checked ? '#2362EF' : '#4B5568', 
              fontSize: '12px',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
              fontWeight: 400,
              lineHeight: '15.6px'
            }}
          >
            {label}
          </Typography>
          {info && (
            <Tooltip title="More info" placement="right">
              <span><InfoIcon /></span>
            </Tooltip>
          )}
        </Box>
      }
      sx={{ display: 'flex', ml: 0, my: 0.25 }}
    />
  );
};

export const SettingToggle = ({ label, defaultValue, defaultOn = true }) => {
  const ctx = useContext(SettingsContext);
  const on = ctx?.settings[`${label}_on`] !== undefined ? ctx.settings[`${label}_on`] : defaultOn;
  const val = ctx?.settings[`${label}_val`] !== undefined ? ctx.settings[`${label}_val`] : defaultValue;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5 }}>
      <Switch size="small" checked={on} onChange={(e) => ctx?.handleChange(`${label}_on`, e.target.checked)} color="primary" />
      <Typography 
        sx={{ 
          flex: 1, 
          fontSize: '12px', 
          color: on ? '#2362EF' : '#4B5568',
          fontFamily: '"Inter", "Segoe UI", sans-serif',
          fontWeight: 400,
          lineHeight: '15.6px'
        }}
      >
        {label}
      </Typography>
      {defaultValue !== undefined && (
        <TextField
          variant="outlined"
          size="small"
          value={val}
          onChange={(e) => ctx?.handleChange(`${label}_val`, e.target.value)}
          inputProps={{ style: { textAlign: 'center', fontSize: '12px', padding: '4px 8px' } }}
          sx={{ width: 44, bgcolor: '#fff' }}
        />
      )}
    </Box>
  );
};

export const SettingInlineNumber = ({ label, defaultValue, info = false }) => {
  const ctx = useContext(SettingsContext);
  const val = ctx?.settings[label] !== undefined ? ctx.settings[label] : defaultValue;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
      <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>{label}</Typography>
      <TextField
        variant="outlined"
        size="small"
        value={val}
        onChange={(e) => ctx?.handleChange(label, e.target.value)}
        inputProps={{ style: { textAlign: 'center', fontSize: '12px', padding: '4px 8px' } }}
        sx={{ width: 50, bgcolor: '#fff' }}
      />
      {info && <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>}
    </Box>
  );
};

export const SettingInlineSelect = ({ label, options, defaultValue, info = false }) => {
  const ctx = useContext(SettingsContext);
  const val = ctx?.settings[label] !== undefined ? ctx.settings[label] : defaultValue;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.75 }}>
      <Typography variant="body2" color="primary.main" sx={{ fontSize: '12px' }}>{label}</Typography>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
        <Select value={val} onChange={(e) => ctx?.handleChange(label, e.target.value)} sx={{ fontSize: '12px', height: 28, bgcolor: '#fff' }}>
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value} sx={{ fontSize: '12px' }}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {info && <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>}
    </Box>
  );
};
