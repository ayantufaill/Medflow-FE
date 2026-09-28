import React, { useMemo } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Typography, IconButton, Tooltip } from '@mui/material';
import { LocationOn as LocationOnIcon, Facebook as FacebookIcon, Google as GoogleIcon, LinkedIn as LinkedInIcon, Twitter as TwitterIcon, Instagram as InstagramIcon } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';
import InfoCard from './InfoCard';
import { FieldRow, stdSx, inputSx } from './SharedComponents';
import { US_STATES, STATE_CITIES } from '../../../../constants/usAddressData';
import { TIME_ZONES, STATE_TIME_ZONES } from '../../../../constants/timeZones';

const AddressLocale = () => {
  const { register, control, watch, setValue } = useFormContext();
  const selectedState = watch('state');
  const availableCities = STATE_CITIES[selectedState] || [];

  const timeZoneOptions = useMemo(() => {
    const stateZones = selectedState ? STATE_TIME_ZONES[selectedState] || [] : TIME_ZONES.map((tz) => tz.value);
    return TIME_ZONES.filter((tz) => new Set([...stateZones, 'Asia/Karachi']).has(tz.value));
  }, [selectedState]);

  return (
    <InfoCard title="ADDRESS & LOCALE" icon={<LocationOnIcon sx={{ fontSize: 16 }} />}>
      <FieldRow label="Country" labelWidth="100%">
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
              <Select {...field} sx={{ fontSize: '0.85rem' }}>
                <MenuItem value="United States" sx={{ fontSize: '0.85rem' }}>United States</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </FieldRow>

      <FieldRow label="Address Line 1" labelWidth="100%">
        <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('addressLine1')} inputProps={{ style: stdSx }} />
      </FieldRow>
      
      <FieldRow label="Address Line 2" labelWidth="100%">
        <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('addressLine2')} placeholder="Address line 2" inputProps={{ style: stdSx }} />
      </FieldRow>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="State" labelWidth="100%">
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty onChange={(e) => {
                    field.onChange(e);
                    setValue('city', '');
                  }}>
                    <MenuItem value="" sx={{ fontSize: '0.85rem' }}><em>Select state</em></MenuItem>
                    {US_STATES.map((s) => (
                      <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.85rem' }}>{s.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="City" labelWidth="100%">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty disabled={!selectedState}>
                    <MenuItem value="" sx={{ fontSize: '0.85rem' }}><em>{selectedState ? 'Select city' : 'Select state first'}</em></MenuItem>
                    {availableCities.map((c) => (
                      <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FieldRow label="Zip/Postal Code" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('zipCode')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FieldRow label="Time zone" labelWidth="100%">
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ ...inputSx, minWidth: 0 }} variant="outlined" size="small" fullWidth>
                  <Select
                    {...field}
                    sx={{ fontSize: '0.85rem' }}
                    renderValue={(v) => {
                      const tz = TIME_ZONES.find((t) => t.value === v);
                      return (
                        <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tz ? tz.label : v}
                        </Box>
                      );
                    }}
                  >
                    {timeZoneOptions.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value} sx={{ fontSize: '0.85rem' }}>{tz.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Business Registration Number" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('businessRegNumber')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Business Registration Identifier" labelWidth="100%">
            <Controller
              name="businessRegIdentifier"
              control={control}
              render={({ field }) => (
                <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty>
                    <MenuItem value=""    sx={{ fontSize: '0.85rem' }}><em>Select...</em></MenuItem>
                    <MenuItem value="EIN" sx={{ fontSize: '0.85rem' }}>EIN</MenuItem>
                    <MenuItem value="SSN" sx={{ fontSize: '0.85rem' }}>SSN</MenuItem>
                    <MenuItem value="NPI" sx={{ fontSize: '0.85rem' }}>NPI</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
        </Box>
      </Box>

      <FieldRow label="Business Legal Name" labelWidth="100%">
        <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('businessLegalName')} inputProps={{ style: stdSx }} />
      </FieldRow>

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px', fontWeight: 500, mb: 1 }}>
          Social Media Links
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {[
            { icon: <FacebookIcon  sx={{ fontSize: 18 }} />, field: 'facebookUrl',  label: 'Facebook',  color: '#1877F2' },
            { icon: <GoogleIcon    sx={{ fontSize: 18 }} />, field: 'googleUrl',    label: 'Google',    color: '#EA4335' },
            { icon: <TwitterIcon   sx={{ fontSize: 18 }} />, field: 'twitterUrl',   label: 'Twitter/X', color: '#1DA1F2' },
            { icon: <InstagramIcon sx={{ fontSize: 18 }} />, field: 'instagramUrl', label: 'Instagram', color: '#E1306C' },
          ].map(({ icon, field, label, color }) => (
            <Tooltip key={field} title={watch(field) || label}>
              <IconButton
                size="small"
                sx={{
                  border: '1px solid #ddd', borderRadius: 1, p: 0.75,
                  color: watch(field) ? color : 'text.disabled',
                  '&:hover': { color, borderColor: color },
                  bgcolor: '#fff'
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: '#3B63E0', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          These settings are linked to Communication Settings
        </Typography>
      </Box>

    </InfoCard>
  );
};

export default AddressLocale;
