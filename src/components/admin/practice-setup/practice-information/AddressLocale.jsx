import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Typography, IconButton, Tooltip } from '@mui/material';
import { LocationOn as LocationOnIcon, Facebook as FacebookIcon, Google as GoogleIcon, LinkedIn as LinkedInIcon, Twitter as TwitterIcon, Instagram as InstagramIcon } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';
import InfoCard from './InfoCard';
import { FieldRow, stdSx, inputSx } from './SharedComponents';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const AddressLocale = () => {
  const { register, control, watch } = useFormContext();

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
                <MenuItem value="Canada"        sx={{ fontSize: '0.85rem' }}>Canada</MenuItem>
                <MenuItem value="Mexico"        sx={{ fontSize: '0.85rem' }}>Mexico</MenuItem>
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
          <FieldRow label="City" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('city')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="State" labelWidth="100%">
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty>
                    <MenuItem value="" sx={{ fontSize: '0.85rem' }}><em>Select state</em></MenuItem>
                    {US_STATES.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>{s}</MenuItem>
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
          <FieldRow label="Zip/Postal Code" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('zipCode')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Time zone" labelWidth="100%">
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <FormControl sx={inputSx} variant="outlined" size="small" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }}>
                    <MenuItem value="America/New_York"    sx={{ fontSize: '0.85rem' }}>US Eastern</MenuItem>
                    <MenuItem value="America/Chicago"     sx={{ fontSize: '0.85rem' }}>US Central</MenuItem>
                    <MenuItem value="America/Denver"      sx={{ fontSize: '0.85rem' }}>US Mountain</MenuItem>
                    <MenuItem value="America/Los_Angeles" sx={{ fontSize: '0.85rem' }}>US Pacific</MenuItem>
                    <MenuItem value="America/Phoenix"     sx={{ fontSize: '0.85rem' }}>US Arizona</MenuItem>
                    <MenuItem value="America/Anchorage"   sx={{ fontSize: '0.85rem' }}>US Alaska</MenuItem>
                    <MenuItem value="America/Honolulu"    sx={{ fontSize: '0.85rem' }}>US Hawaii</MenuItem>
                    <MenuItem value="UTC"                 sx={{ fontSize: '0.85rem' }}>UTC</MenuItem>
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
