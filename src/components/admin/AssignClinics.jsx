import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, OutlinedInput, Chip } from '@mui/material';
import { useBranch } from '../../hooks/redux';

const AssignClinics = ({ 
  branches, 
  defaultClinicId, 
  setDefaultClinicId, 
  restrictedClinicIds, 
  setRestrictedClinicIds, 
  accessAll, 
  setAccessAll, 
  isPlatformAdmin 
}) => {
  const handleRestrictedChange = (event) => {
    const {
      target: { value },
    } = event;
    setRestrictedClinicIds(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {isPlatformAdmin && (
        <FormControlLabel
          control={
            <Switch
              checked={accessAll}
              onChange={(e) => setAccessAll(e.target.checked)}
              color="primary"
            />
          }
          label="Access all clinics"
        />
      )}

      <FormControl fullWidth size="small" disabled={accessAll}>
        <InputLabel id="default-clinic-label">Default Clinic</InputLabel>
        <Select
          labelId="default-clinic-label"
          id="default-clinic"
          value={defaultClinicId || ''}
          label="Default Clinic"
          onChange={(e) => setDefaultClinicId(e.target.value)}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={accessAll}>
        <InputLabel id="restricted-clinics-label">Restricted Clinics</InputLabel>
        <Select
          labelId="restricted-clinics-label"
          id="restricted-clinics"
          multiple
          value={restrictedClinicIds || []}
          onChange={handleRestrictedChange}
          input={<OutlinedInput id="select-multiple-chip" label="Restricted Clinics" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const branch = branches.find((b) => b.id === value);
                return <Chip key={value} label={branch ? branch.name : value} size="small" />;
              })}
            </Box>
          )}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
          Select the clinics this user is allowed to access.
        </Typography>
      </FormControl>
    </Box>
  );
};

export default AssignClinics;
