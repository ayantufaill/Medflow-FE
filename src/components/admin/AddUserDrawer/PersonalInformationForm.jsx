import React from 'react';
import { Grid, Typography, TextField, InputAdornment, IconButton, FormControl, Select, MenuItem, FormControlLabel, Switch, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller } from 'react-hook-form';

const Label = ({ children, required }) => (
  <Typography sx={{ fontFamily: 'Inter, sans-serif', color: '#4B5563', mb: 0.5, fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px' }}>
    {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
  </Typography>
);

const StyledTextField = (props) => (
  <TextField
    {...props}
    sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      ...props.sx
    }}
  />
);

const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const PersonalInformationForm = ({ register, errors, control, showPassword, setShowPassword, showConfirm, setShowConfirm, password, LANGUAGES }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>First Name</Label>
        <StyledTextField
          fullWidth size="small" placeholder="Enter First Name"
          {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' }, maxLength: { value: 50, message: 'Max 50 chars' } })}
          error={!!errors.firstName} helperText={errors.firstName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>Last Name</Label>
        <StyledTextField
          fullWidth size="small" placeholder="Enter Last Name"
          {...register('lastName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' }, maxLength: { value: 50, message: 'Max 50 chars' } })}
          error={!!errors.lastName} helperText={errors.lastName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label>Middle Name</Label>
        <StyledTextField fullWidth size="small" placeholder="Enter Middle Name" />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>Email</Label>
        <StyledTextField
          type="email" fullWidth size="small" placeholder="Enter Email"
          {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
          error={!!errors.email} helperText={errors.email?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>Phone Number</Label>
        <Controller
          name="phone"
          control={control}
          rules={{
            required: 'Required',
            pattern: {
              value: /^\(\d{3}\) \d{3}-\d{4}$/,
              message: 'Format must be (XXX) XXX-XXXX'
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              fullWidth size="small" placeholder="(XXX) XXX-XXXX"
              value={value || ''}
              onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
              error={!!error} helperText={error?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Select
                      defaultValue="US"
                      variant="standard"
                      disableUnderline
                      IconComponent={(props) => (
                        <svg {...props} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
                          <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      sx={{
                        '& .MuiSelect-select': {
                          py: 0,
                          pl: 0,
                          pr: '4px !important',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#4B5563',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          backgroundColor: 'transparent'
                        },
                        '& .MuiSelect-icon': {
                          position: 'relative',
                          right: 0
                        },
                        borderRight: '1px solid #e0e0e0',
                        pr: 1,
                        mr: 1
                      }}
                    >
                      <MenuItem value="US">US</MenuItem>
                      <MenuItem value="CA">CA</MenuItem>
                      <MenuItem value="UK">UK</MenuItem>
                      <MenuItem value="AU">AU</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label>Preferred Language</Label>
        <FormControl fullWidth size="small">
          <Select 
            defaultValue="en" 
            {...register('preferredLanguage')}
            sx={{ borderRadius: '8px' }}
          >
            {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>Password</Label>
        <StyledTextField
          fullWidth size="small" placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', {
            required: 'Required',
            minLength: { value: 8, message: 'Min 8 characters' },
            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Needs uppercase, lowercase and a number' },
          })}
          error={!!errors.password} helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Label required>Confirm Password</Label>
        <StyledTextField
          fullWidth size="small" placeholder="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          {...register('confirmPassword', { required: 'Required', validate: (v) => v === password || 'Passwords do not match' })}
          error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}>
                  {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Controller name="isActive" control={control} render={({ field }) => (
          <FormControlLabel
            label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563', ml: 1 }}>ACTIVE ACCOUNT</Typography>}
            control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
            labelPlacement="end"
            sx={{ m: 0 }}
          />
        )} />
      </Grid>
    </Grid>
  );
};

export default PersonalInformationForm;
