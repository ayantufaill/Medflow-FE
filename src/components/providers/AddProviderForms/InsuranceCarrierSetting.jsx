import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box, Chip, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Label, inputProps, selectProps, CARRIERS, COLOR_SWATCHES } from './Shared';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import { selectProviderList, selectProviderDropdownList, fetchAllProvidersForDropdown } from '../../../store/slices/providerSlice';
import { useSnackbar } from '../../../contexts/SnackbarContext';

const InsuranceCarrierSetting = ({ register, control, watch, setValue, providerId }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [carrierInput, setCarrierInput] = useState('');
  const [carriers, setCarriers] = useState([]);
  const selectedColor = watch('color');
  const colorInputRef = useRef(null);

  const providersFromList = useSelector(selectProviderList) || [];
  const providersFromDropdown = useSelector(selectProviderDropdownList) || [];

  useEffect(() => {
    if (providersFromDropdown.length === 0 && providersFromList.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [dispatch, providersFromDropdown.length, providersFromList.length]);

  const allProviders = useMemo(() => {
    return providersFromDropdown.length > 0 ? providersFromDropdown : providersFromList;
  }, [providersFromDropdown, providersFromList]);

  const assignedColorsMap = useMemo(() => {
    const map = {};
    allProviders.forEach((p) => {
      const pId = p._id || p.id;
      if (pId !== providerId && p.color) {
        map[p.color.toLowerCase()] = p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : (p.providerCode || 'another provider');
      }
    });
    return map;
  }, [allProviders, providerId]);

  const handleCustomColorChange = (e) => {
    const customHex = e.target.value;
    const assignedTo = assignedColorsMap[customHex.toLowerCase()];
    if (assignedTo) {
      showSnackbar(`Color ${customHex} is already assigned to ${assignedTo}`, 'warning');
      return;
    }
    setValue('color', customHex);
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 0.5 }}>
          <input
            type="color"
            ref={colorInputRef}
            style={{ display: 'none' }}
            value={selectedColor || '#2dd4bf'}
            onChange={handleCustomColorChange}
          />
          <Tooltip title="Add custom color" arrow>
            <Box
              onClick={() => colorInputRef.current?.click()}
              sx={{
                flexShrink: 0,
                width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px dashed #D1D5DB', cursor: 'pointer', backgroundColor: '#fff',
                '&:hover': { backgroundColor: '#f9fafb' }
              }}
            >
              <AddIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
            </Box>
          </Tooltip>
          {COLOR_SWATCHES.map((c) => {
            const assignedTo = assignedColorsMap[c.toLowerCase()];
            const isAssigned = !!assignedTo;
            const isSelected = selectedColor?.toLowerCase() === c.toLowerCase();

            const swatchNode = (
              <Box
                key={c}
                onClick={() => {
                  if (isAssigned) {
                    showSnackbar(`Color is already assigned to ${assignedTo}`, 'warning');
                    return;
                  }
                  setValue('color', c);
                }}
                sx={{
                  flexShrink: 0,
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: c,
                  cursor: isAssigned ? 'not-allowed' : 'pointer',
                  border: isSelected ? '2px solid #1a3a6b' : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  opacity: isAssigned ? 0.35 : 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { transform: isAssigned ? 'none' : 'scale(1.1)' },
                  transition: 'transform 0.1s'
                }}
              >
                {isAssigned && (
                  <BlockIcon sx={{ fontSize: 14, color: '#374151', opacity: 0.8 }} />
                )}
              </Box>
            );

            return isAssigned ? (
              <Tooltip key={c} title={`Assigned to ${assignedTo}`} arrow>
                {swatchNode}
              </Tooltip>
            ) : (
              swatchNode
            );
          })}
          {selectedColor && !COLOR_SWATCHES.some((c) => c.toLowerCase() === selectedColor.toLowerCase()) && (
            <Tooltip title="Custom selected color" arrow>
              <Box
                sx={{
                  flexShrink: 0,
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: selectedColor,
                  border: '2px solid #1a3a6b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
            </Tooltip>
          )}
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
