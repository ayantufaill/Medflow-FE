import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Autocomplete, TextField, Grid } from '@mui/material';
import { US_STATES, STATE_CITIES } from '../../constants/usAddressData';

/**
 * A reusable component that renders a cascading State and City dropdown.
 * The City dropdown is disabled until a State is selected, and its options
 * are filtered based on the selected State.
 * 
 * @param {Object} props
 * @param {Object} props.control - The control object from react-hook-form
 * @param {Function} props.watch - The watch function from react-hook-form
 * @param {Function} props.setValue - The setValue function from react-hook-form
 * @param {Object} props.errors - The errors object from react-hook-form
 * @param {String} props.prefix - The field prefix (e.g., 'address.' or 'workAddress.')
 * @param {String} props.stateLabel - The label for the State field
 * @param {String} props.cityLabel - The label for the City field
 */
const AddressSelectFields = ({ 
  control, 
  watch, 
  setValue, 
  errors, 
  prefix = "address.", 
  stateLabel = "State", 
  cityLabel = "City",
  gridSize = { xs: 12, sm: 6 }
}) => {
  const selectedState = watch(`${prefix}state`);
  
  // Get available cities for the selected state
  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    return STATE_CITIES[selectedState] || [];
  }, [selectedState]);

  // Reset city if the selected state changes and the city is no longer valid
  useEffect(() => {
    const currentCity = watch(`${prefix}city`);
    if (selectedState && currentCity && !availableCities.includes(currentCity)) {
      setValue(`${prefix}city`, '');
    }
  }, [selectedState, availableCities, setValue, prefix, watch]);

  // Helper to extract nested error objects safely (e.g. "address.state")
  const getNestedError = (fieldName) => {
    const parts = fieldName.split('.').filter(Boolean);
    return parts.reduce((acc, part) => (acc && acc[part] ? acc[part] : null), errors);
  };

  const stateError = getNestedError(`${prefix}state`);
  const cityError = getNestedError(`${prefix}city`);

  return (
    <>
      <Grid size={gridSize}>
        <FormControl fullWidth error={!!stateError}>
          <InputLabel>{stateLabel} *</InputLabel>
          <Controller
            name={`${prefix}state`}
            control={control}
            render={({ field }) => (
              <Select {...field} label={`${stateLabel} *`}>
                {US_STATES.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {stateError && <FormHelperText>{stateError.message}</FormHelperText>}
        </FormControl>
      </Grid>
      
      <Grid size={gridSize}>
        <Controller
          name={`${prefix}city`}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <Autocomplete
              options={availableCities}
              value={value || null}
              onChange={(_, newValue) => onChange(newValue)}
              disabled={!selectedState}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  label={`${cityLabel} *`}
                  error={!!cityError}
                  helperText={
                    cityError?.message || 
                    (!selectedState ? "Please select a state first" : "")
                  }
                />
              )}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default AddressSelectFields;
