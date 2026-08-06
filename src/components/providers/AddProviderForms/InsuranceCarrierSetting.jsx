import React, { useState } from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box, Chip } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Label, inputProps, selectProps, CARRIERS, COLOR_SWATCHES } from './Shared';
import AddIcon from '@mui/icons-material/Add';

const InsuranceCarrierSetting = ({ register, control, watch, setValue }) => {
  const [carrierInput, setCarrierInput] = useState('');
  const [carriers, setCarriers] = useState([]);
  const selectedColor = watch('color');

  const handleAddCarrier = () => {
    if (carrierInput.trim() && !carriers.includes(carrierInput.trim())) {
      setCarriers((prev) => [...prev, carrierInput.trim()]);
      setCarrierInput('');
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid size={4}>
        <Label>Description</Label>
        <TextField fullWidth placeholder="Enter your Organization Name" 
          {...register('description')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>OpenDental Provider Id</Label>
        <TextField fullWidth placeholder="Enter Id" 
          {...register('openDentalProviderId')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Carrier To be Out of Network</Label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <Select displayEmpty value={carrierInput} onChange={(e) => {
                setCarrierInput(e.target.value);
                if (e.target.value) {
                  if (!carriers.includes(e.target.value)) setCarriers((prev) => [...prev, e.target.value]);
                  setCarrierInput('');
                }
              }} {...selectProps}>
              <MenuItem value=""><em>Select Carrier</em></MenuItem>
              {CARRIERS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      
      {/* Second Row */}
      <Grid size={4}>
        <Label>Open Edge Token</Label>
        <TextField fullWidth placeholder="Enter Token" 
          {...register('openEdgeToken')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Colors</Label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'nowrap', mt: 0.5 }}>
          <Box
            sx={{
              flexShrink: 0,
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed #D1D5DB', cursor: 'pointer', backgroundColor: '#fff',
              '&:hover': { backgroundColor: '#f9fafb' }
            }}
          >
            <AddIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          </Box>
          {COLOR_SWATCHES.map((c) => (
            <Box key={c} onClick={() => setValue('color', c)}
              sx={{
                flexShrink: 0,
                width: 24, height: 24, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                border: selectedColor === c ? '2px solid #1a3a6b' : 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.1s'
              }} />
          ))}
        </Box>
      </Grid>
      <Grid size={4}>
         {carriers.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 3 }}>
            {carriers.map((c) => (
              <Chip
                key={c}
                label={c}
                size="small"
                onDelete={() => setCarriers((prev) => prev.filter((x) => x !== c))}
                sx={{
                  backgroundColor: 'rgba(35, 98, 239, 0.08)',
                  border: '1.2px solid #2362EF',
                  color: '#2362EF',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '16px',
                  height: '28px',
                  '& .MuiChip-label': {
                    color: '#2362EF',
                    fontWeight: 600,
                    fontSize: '12px',
                    px: 1,
                  },
                  '& .MuiChip-deleteIcon': {
                    color: '#2362EF',
                    fontSize: '16px',
                    '&:hover': {
                      color: '#1a50cc',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default InsuranceCarrierSetting;
