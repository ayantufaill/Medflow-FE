import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Chip,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import {
  Info as InfoIcon,
  Add as AddIcon,
  PersonOutline as PersonOutlineIcon,
  AssignmentOutlined as AssignmentOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { selectProviderList, selectProviderDropdownList, fetchAllProvidersForDropdown } from '../../store/slices/providerSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { US_STATES, STATE_CITIES } from '../../constants/usAddressData';
import SectionContainer from '../practice-onboarding/practice-info/SectionContainer';
import FormInputLabel from '../practice-onboarding/practice-info/FormInputLabel';

// ─── Styles matching Practice Onboarding UI & Dropdown fixes ─────────────────

const dropdownMenuProps = {
  style: { zIndex: 10000 },
  sx: { zIndex: 10000 },
};

const commonInputStyles = {
  '& .MuiOutlinedInput-root': {
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
    '&.Mui-disabled': { backgroundColor: '#f9fafb', opacity: 0.8 },
  },
  '& .MuiOutlinedInput-input': {
    padding: '0 12px',
    height: '36px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    mx: 0.5,
    mt: 0.5,
  }
};

const selectStyles = {
  ...commonInputStyles,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    height: '100% !important',
    fontSize: '0.85rem',
  },
  '& .MuiSelect-icon': {
    color: '#9ca3af',
  }
};

const multilineInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    padding: '10px 12px',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
    fontSize: '0.85rem',
    lineHeight: '1.4',
  }
};

const phoneInputStyles = {
  '& .react-tel-input': {
    width: '100%',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      borderColor: '#9ca3af',
    },
    '&:focus-within': {
      borderColor: '#3b82f6',
    },
  },
  '& .react-tel-input .special-label': {
    display: 'none !important',
  },
  '& .react-tel-input .country-list': {
    zIndex: '10000 !important',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: '0.85rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  '& .react-tel-input .form-control': {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    paddingLeft: '48px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    outline: 'none',
  },
  '& .react-tel-input .form-control:focus': {
    border: 'none',
    boxShadow: 'none',
  },
  '& .react-tel-input .flag-dropdown': {
    border: 'none',
    borderRight: '1px solid #d1d5db',
    borderRadius: '8px 0 0 8px',
    backgroundColor: 'transparent',
    width: '42px',
    height: '100%',
  },
  '& .react-tel-input .flag-dropdown:hover': {
    backgroundColor: '#f3f4f6',
  },
  '& .react-tel-input .selected-flag': {
    width: '100%',
    height: '100%',
    padding: '0 0 0 8px',
    backgroundColor: 'transparent',
  },
  '& .react-tel-input .selected-flag:hover': {
    backgroundColor: 'transparent',
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const SPECIALTIES = [
  'Dental Assistant',
  'Practice Billing Entity',
  'Dental Hygienist',
  'Dental Laboratory Technician',
  'General Dentist',
  'Denturist',
  'Endodontist',
  'Myofunctional Therapist',
  'Orthodontist',
  'Pathology, Oral & Maxillofacial',
  'Pedodontist',
  'Periodontist',
  'Prosthodontist',
  'Surgery, Oral & Maxillofacial',
];

const COLOR_SWATCHES = [
  '#f5f0c8','#c8b4f0','#a8d8d0','#b8e8b8','#f5d5a8',
  '#f5c8d8','#6cbb6c','#c8a878','#7898d8','#e88878',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const buildDefaultValues = (provider) => {
  const u = provider?.userId || {};
  const addr = provider?.address || {};

  return {
    firstName:            u.firstName   || provider?.firstName   || '',
    lastName:             u.lastName    || provider?.lastName    || '',
    middleName:           u.middleName  || provider?.middleName  || '',
    prefix:               provider?.prefix      || provider?.title || '',
    suffix:               provider?.suffix      || provider?.suffixTitle || '',
    preferredName:        provider?.preferredName || '',
    internalCodeName:     provider?.internalCodeName || provider?.providerCode || '',
    email:                u.email || provider?.email || '',
    organizationName:     provider?.organizationName || '',
    federalTaxNumber:     provider?.federalTaxId || provider?.federalTaxNumber || '',
    npiNumber:            provider?.npiNumber || '',
    additionalProviderId: provider?.additionalProviderId || '',
    dea:                  provider?.dea || provider?.deaNumber || '',
    specialty:            Array.isArray(provider?.specialty) ? provider.specialty[0] || '' : provider?.specialty || '',
    mobilePhone:          provider?.phone || provider?.mobilePhone || '',
    homePhone:            provider?.homePhone || '',
    licenseNumber:        provider?.licenseNumber || '',
    taxIdType:            provider?.taxIdType || '',
    providerType:         provider?.providerType || 'Dentist',
    signatureOnFile:      provider?.signatureOnFile || false,
    defaultDentist:       provider?.isDefaultDentist || provider?.defaultDentist || false,
    defaultHygienist:     provider?.isDefaultHygienist || provider?.defaultHygienist || false,
    country:              addr.country || provider?.country || 'United States',
    addressLine1:         addr.street || addr.address1 || addr.addressLine1 || '',
    addressLine2:         addr.address2 || addr.addressLine2 || '',
    city:                 addr.city || provider?.city || '',
    state:                addr.state || provider?.state || '',
    zipCode:              addr.zipCode || addr.zip || provider?.zipCode || '',
    description:          provider?.description || '',
    color:                provider?.color || '',
    openEdgeToken:        provider?.openEdgeToken || '',
    openDentalProviderId: provider?.openDentalProviderId || '',
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const PhoneInputRow = ({ label, required, name, control }) => (
  <Box sx={{ width: '100%' }}>
    <FormInputLabel label={label} required={required} />
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? 'Required' : false,
        validate: (value) => {
          if (!value && !required) return true;
          if (!value && required) return 'Required';
          const cleanPhone = (value || '').replace(/\D/g, '');
          if (cleanPhone.length > 0 && cleanPhone.length < 10) return 'Phone number appears incomplete';
          if (cleanPhone.length > 15) return 'Phone number is too long';
          return true;
        }
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <Box sx={phoneInputStyles}>
            <ReactPhoneInput
              country={'us'}
              specialLabel={""}
              dropdownStyle={{ zIndex: 10000 }}
              value={value || ''}
              onChange={(phone) => onChange(phone)}
            />
          </Box>
          {error && (
            <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, ml: 0.5 }}>
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  </Box>
);

// ─── Main form ────────────────────────────────────────────────────────────────

const EditProviderForm = ({ formId, provider, onSubmit, loading }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [carriers, setCarriers] = useState(
    provider?.carriersOutOfNetwork || []
  );
  const [carrierInput, setCarrierInput] = useState('');

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

  const currentProviderId = provider?._id || provider?.id;
  const assignedColorsMap = useMemo(() => {
    const map = {};
    allProviders.forEach((p) => {
      const pId = p._id || p.id;
      if (pId !== currentProviderId && p.color) {
        map[p.color.toLowerCase()] = p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : (p.providerCode || 'another provider');
      }
    });
    return map;
  }, [allProviders, currentProviderId]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: buildDefaultValues(provider),
  });

  const selectedColor = watch('color');

  const handleAddCarrier = () => {
    if (carrierInput.trim() && !carriers.includes(carrierInput.trim())) {
      setCarriers((prev) => [...prev, carrierInput.trim()]);
      setCarrierInput('');
    }
  };

  const handleRemoveCarrier = (c) => setCarriers((prev) => prev.filter((x) => x !== c));

  const submit = (data) => {
    onSubmit({ ...data, carriersOutOfNetwork: carriers });
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(submit)} noValidate sx={{ pb: 1 }}>
      
      {/* Section 1: Personal Information (Strictly 3 fields per row: md: 4) */}
      <SectionContainer title="Personal Information" icon={PersonOutlineIcon}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="First Name" required />
            <TextField fullWidth placeholder="Enter First Name"
              sx={commonInputStyles}
              {...register('firstName', { required: 'Required' })}
              error={!!errors.firstName} helperText={errors.firstName?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Last Name" required />
            <TextField fullWidth placeholder="Enter Last Name"
              sx={commonInputStyles}
              {...register('lastName', { required: 'Required' })}
              error={!!errors.lastName} helperText={errors.lastName?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Middle Name" />
            <TextField fullWidth placeholder="Enter Middle Name" sx={commonInputStyles} {...register('middleName')} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Prefix (Dr, Mr...)" required />
            <TextField fullWidth placeholder="Enter Title" sx={commonInputStyles} {...register('prefix', { required: 'Required' })} error={!!errors.prefix} helperText={errors.prefix?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Suffix (DDS...)" />
            <TextField fullWidth placeholder="Enter Suffix" sx={commonInputStyles} {...register('suffix')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Preferred Name" />
            <TextField fullWidth placeholder="Enter Preferred Name" sx={commonInputStyles} {...register('preferredName')} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormInputLabel label="Internal Code Name" />
              <Tooltip title="Internal identifier for this provider">
                <InfoIcon sx={{ fontSize: 15, ml: 0.5, mb: 0.8, color: '#9ca3af', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <TextField fullWidth placeholder="Enter Internal Code" sx={commonInputStyles} {...register('internalCodeName')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Email Address" required />
            <TextField fullWidth type="email" placeholder="Enter Email"
              sx={commonInputStyles}
              {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
              error={!!errors.email} helperText={errors.email?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PhoneInputRow label="Mobile Phone Number" required name="mobilePhone" control={control} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PhoneInputRow label="Home Phone Number" name="homePhone" control={control} />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Section 2: Professional Credentials & Identifiers (Strictly 3 fields per row: md: 4) */}
      <SectionContainer title="Professional Credentials & Identifiers" icon={AssignmentOutlinedIcon}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Organization Name" />
            <TextField fullWidth placeholder="Enter Organization Name" sx={commonInputStyles} {...register('organizationName')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Federal Tax Number" required />
            <TextField fullWidth placeholder="Enter Federal Tax Number"
              sx={commonInputStyles}
              {...register('federalTaxNumber', { required: 'Required' })}
              error={!!errors.federalTaxNumber} helperText={errors.federalTaxNumber?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="NPI Number" required />
            <TextField fullWidth placeholder="Enter NPI"
              sx={commonInputStyles}
              {...register('npiNumber', { required: 'Required' })}
              error={!!errors.npiNumber} helperText={errors.npiNumber?.message} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Additional Provider ID" />
            <TextField fullWidth placeholder="Fills 52A on manual claim"
              sx={commonInputStyles}
              {...register('additionalProviderId')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="DEA Number" />
            <TextField fullWidth placeholder="Enter DEA" sx={commonInputStyles} {...register('dea')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Specialty" />
            <Controller name="specialty" control={control} render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                sx={selectStyles}
                SelectProps={{ displayEmpty: true, IconComponent: KeyboardArrowDownIcon, MenuProps: dropdownMenuProps }}
              >
                <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#9ca3af' }}><em>Select Specialty</em></MenuItem>
                {SPECIALTIES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>{s}</MenuItem>)}
              </TextField>
            )} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="License Number" required />
            <TextField fullWidth placeholder="Enter License Number"
              sx={commonInputStyles}
              {...register('licenseNumber', { required: 'Required' })}
              error={!!errors.licenseNumber} helperText={errors.licenseNumber?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Tax ID Type" required />
            <TextField fullWidth placeholder="Enter Tax ID Type" sx={commonInputStyles}
              {...register('taxIdType', { required: 'Required' })}
              error={!!errors.taxIdType} helperText={errors.taxIdType?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Provider Type" />
            <Controller name="providerType" control={control} render={({ field }) => (
              <RadioGroup row {...field} sx={{ mt: 0.2 }}>
                <FormControlLabel value="Dentist" control={<Radio size="small" sx={{ p: 0.5, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500, mr: 0.5 }}>Dentist</Typography>} />
                <FormControlLabel value="Hygienist" control={<Radio size="small" sx={{ p: 0.5, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500, mr: 0.5 }}>Hygienist</Typography>} />
                <FormControlLabel value="Assistant/Other" control={<Radio size="small" sx={{ p: 0.5, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>Other</Typography>} />
              </RadioGroup>
            )} />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Section 3: Address & Location Details (Strictly 3 fields per row: md: 4) */}
      <SectionContainer title="Address & Location Details" icon={LocationOnOutlinedIcon}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Country" required />
            <Controller name="country" control={control} render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                sx={selectStyles}
                SelectProps={{ IconComponent: KeyboardArrowDownIcon, MenuProps: dropdownMenuProps }}
              >
                <MenuItem value="United States" sx={{ fontSize: '0.85rem' }}>United States</MenuItem>
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Address Line 1" required />
            <TextField fullWidth placeholder="Enter Street Address" sx={commonInputStyles}
              {...register('addressLine1', { required: 'Required' })}
              error={!!errors.addressLine1} helperText={errors.addressLine1?.message} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Address Line 2" />
            <TextField fullWidth placeholder="Apt, Suite, Bldg (optional)" sx={commonInputStyles} {...register('addressLine2')} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="State/Province" required />
            <Controller name="state" control={control} rules={{ required: 'Required' }} render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                error={!!errors.state}
                helperText={errors.state?.message}
                sx={selectStyles}
                onChange={(e) => { field.onChange(e); setValue('city', ''); }}
                SelectProps={{ displayEmpty: true, IconComponent: KeyboardArrowDownIcon, MenuProps: dropdownMenuProps }}
              >
                <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#9ca3af' }}><em>Select State</em></MenuItem>
                {US_STATES.map((s) => <MenuItem key={s.value} value={s.label} sx={{ fontSize: '0.85rem' }}>{s.label}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="City" required />
            <Controller name="city" control={control} rules={{ required: 'Required' }} render={({ field: { onChange, value }, fieldState: { error } }) => {
              const currentStateLabel = watch('state');
              const stateObj = US_STATES.find(s => s.label === currentStateLabel);
              const stateAbbr = stateObj ? stateObj.value : '';
              return (
                <Autocomplete
                  options={STATE_CITIES[stateAbbr] || []}
                  value={value || ""}
                  onChange={(_, newVal) => onChange(newVal || "")}
                  onInputChange={(_, newInputValue) => onChange(newInputValue || "")}
                  disabled={!currentStateLabel}
                  freeSolo
                  PopperProps={dropdownMenuProps}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      sx={commonInputStyles}
                      placeholder={currentStateLabel ? "Enter City" : "Select state first"}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              );
            }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Zip/Postal Code" required />
            <TextField fullWidth placeholder="Enter Zip/Postal Code" sx={commonInputStyles}
              {...register('zipCode', { required: 'Required' })}
              error={!!errors.zipCode} helperText={errors.zipCode?.message} />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Section 4: Preferences & Integration Settings (Strictly 3 fields per row: md: 4) */}
      <SectionContainer title="Preferences & Integration Settings" icon={SettingsOutlinedIcon}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Controller name="signatureOnFile" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />}
                  label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Signature on File</Typography>}
                  sx={{ m: 0 }}
                />
              )} />
              <Controller name="defaultDentist" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />}
                  label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Default Dentist</Typography>}
                  sx={{ m: 0 }}
                />
              )} />
              <Controller name="defaultHygienist" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />}
                  label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Default Hygienist</Typography>}
                  sx={{ m: 0 }}
                />
              )} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Open Edge Token" />
            <TextField fullWidth placeholder="Enter Open Edge Token" sx={commonInputStyles} {...register('openEdgeToken')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="OpenDental Provider ID" />
            <TextField fullWidth placeholder="Enter OpenDental ID" sx={commonInputStyles} {...register('openDentalProviderId')} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Description & Notes" />
            <TextField fullWidth placeholder="Clinical or Provider Notes" sx={commonInputStyles}
              {...register('description')} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Calendar Color Accent" />
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', height: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
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
                        width: 24, height: 24, borderRadius: '5px', backgroundColor: c,
                        cursor: isAssigned ? 'not-allowed' : 'pointer',
                        border: isSelected ? '2.5px solid #3b82f6' : '1px solid #d1d5db',
                        opacity: isAssigned ? 0.35 : 1,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: isAssigned ? 'none' : 'scale(1.1)' },
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
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Custom:</Typography>
                <input
                  type="color"
                  value={selectedColor || '#3b82f6'}
                  onChange={(e) => {
                    const customHex = e.target.value;
                    const assignedTo = assignedColorsMap[customHex.toLowerCase()];
                    if (assignedTo) {
                      showSnackbar(`Color ${customHex} is already assigned to ${assignedTo}`, 'warning');
                      return;
                    }
                    setValue('color', customHex);
                  }}
                  style={{ width: 32, height: 24, padding: 0, border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#fff' }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <FormInputLabel label="Carriers Out Of Network" />
            <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <FormControl fullWidth sx={selectStyles}>
                    <Select displayEmpty value={carrierInput}
                      IconComponent={KeyboardArrowDownIcon}
                      MenuProps={dropdownMenuProps}
                      onChange={(e) => setCarrierInput(e.target.value)}>
                      <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#9ca3af' }}><em>Select carrier to add</em></MenuItem>
                      {['Delta Dental','Blue Cross Blue Shield','Aetna','Cigna','United Healthcare','Humana'].map((c) => (
                        <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddCarrier}
                  variant="outlined"
                  sx={{
                    height: '36px',
                    borderRadius: '8px',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    px: 2.5,
                    '&:hover': { bgcolor: '#eff6ff', borderColor: '#2563eb' }
                  }}>
                  Add Carrier
                </Button>
              </Box>
              {carriers.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #e5e7eb' }}>
                  {carriers.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      size="small"
                      onDelete={() => handleRemoveCarrier(c)}
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
            </Box>
          </Grid>
        </Grid>
      </SectionContainer>

    </Box>
  );
};

export default EditProviderForm;
