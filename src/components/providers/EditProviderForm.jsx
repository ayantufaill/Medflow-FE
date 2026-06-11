import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  InputAdornment,
} from '@mui/material';
import { Info as InfoIcon, Add as AddIcon } from '@mui/icons-material';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

// ─── Static data ──────────────────────────────────────────────────────────────

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

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

const Label = ({ children, required }) => (
  <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

const PhoneInput = ({ label, required, name, control }) => (
  <Box>
    <Label required={required}>{label}</Label>
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
          <ReactPhoneInput
            country={'us'}
            value={value}
            onChange={(phone) => onChange(phone)}
            inputStyle={{
              width: '100%',
              height: '40px',
              borderColor: error ? '#d32f2f' : '#ccc',
              borderRadius: '4px'
            }}
            containerStyle={{ width: '100%' }}
          />
          {error && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block', ml: 1.5 }}>
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
  const [carriers, setCarriers] = useState(
    provider?.carriersOutOfNetwork || []
  );
  const [carrierInput, setCarrierInput] = useState('');

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
    <Box component="form" id={formId} onSubmit={handleSubmit(submit)} noValidate>
      <Grid container spacing={2}>

        {/* Row 1: First Name | Last Name | Middle Name */}
        <Grid size={4}>
          <Label required>First Name</Label>
          <TextField fullWidth size="small" placeholder="Enter First Name"
            {...register('firstName', { required: 'Required' })}
            error={!!errors.firstName} helperText={errors.firstName?.message} />
        </Grid>
        <Grid size={4}>
          <Label required>Last Name</Label>
          <TextField fullWidth size="small" placeholder="Enter Last Name"
            {...register('lastName', { required: 'Required' })}
            error={!!errors.lastName} helperText={errors.lastName?.message} />
        </Grid>
        <Grid size={4}>
          <Label>Middle Name</Label>
          <TextField fullWidth size="small" placeholder="Enter Middle Name" {...register('middleName')} />
        </Grid>

        {/* Row 2: Prefix | Suffix | Preferred Name | Internal Code Name */}
        <Grid size={2}>
          <Label required>Prefix (Dr, Mr...)</Label>
          <TextField fullWidth size="small" placeholder="Enter Title" {...register('prefix')} />
        </Grid>
        <Grid size={2}>
          <Label>Suffix (DDs...)</Label>
          <TextField fullWidth size="small" placeholder="Enter Suffix" {...register('suffix')} />
        </Grid>
        <Grid size={4}>
          <Label>Preferred Name</Label>
          <TextField fullWidth size="small" placeholder="Enter Preferred Name" {...register('preferredName')} />
        </Grid>
        <Grid size={4}>
          <Label>
            Internal Code Name&nbsp;
            <Tooltip title="Internal identifier for this provider">
              <InfoIcon sx={{ fontSize: 14, verticalAlign: 'middle', cursor: 'help' }} />
            </Tooltip>
          </Label>
          <TextField fullWidth size="small" placeholder="Enter Internal Code" {...register('internalCodeName')} />
        </Grid>

        {/* Row 3: Email */}
        <Grid size={4}>
          <Label required>Email</Label>
          <TextField fullWidth size="small" type="email" placeholder="Enter Email"
            {...register('email', { required: 'Required' })}
            error={!!errors.email} helperText={errors.email?.message} />
        </Grid>

        {/* Row 4: Organization Name | Federal Tax Number */}
        <Grid size={6}>
          <Label>Organization Name</Label>
          <TextField fullWidth size="small" placeholder="Enter Organization Name" {...register('organizationName')} />
        </Grid>
        <Grid size={6}>
          <Label required>Federal Tax Number</Label>
          <TextField fullWidth size="small" placeholder="Enter Federal Tax Number"
            {...register('federalTaxNumber', { required: 'Required' })}
            error={!!errors.federalTaxNumber} helperText={errors.federalTaxNumber?.message} />
        </Grid>

        {/* Row 5: NPI | Additional Provider ID | DEA */}
        <Grid size={4}>
          <Label required>NPI</Label>
          <TextField fullWidth size="small" placeholder="Enter NPI"
            {...register('npiNumber', { required: 'Required' })}
            error={!!errors.npiNumber} helperText={errors.npiNumber?.message} />
        </Grid>
        <Grid size={4}>
          <Label>Additional Provider ID</Label>
          <TextField fullWidth size="small" placeholder="Fills 52A on manual claim"
            {...register('additionalProviderId')} />
        </Grid>
        <Grid size={4}>
          <Label>DEA</Label>
          <TextField fullWidth size="small" placeholder="Enter DEA" {...register('dea')} />
        </Grid>

        {/* Row 6: Specialty | Mobile Phone | Home Phone */}
        <Grid size={4}>
          <Label>Specialty</Label>
          <Controller name="specialty" control={control} render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field} displayEmpty>
                <MenuItem value=""><em>Select Specialty</em></MenuItem>
                {SPECIALTIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          )} />
        </Grid>
        <Grid size={4}><PhoneInput label="Mobile Phone Number" required name="mobilePhone" control={control} /></Grid>
        <Grid size={4}><PhoneInput label="Home Phone Number" name="homePhone" control={control} /></Grid>

        {/* Row 7: License Number | Tax Id Type */}
        <Grid size={6}>
          <Label required>License Number</Label>
          <TextField fullWidth size="small" placeholder="Enter License Number"
            {...register('licenseNumber', { required: 'Required' })}
            error={!!errors.licenseNumber} helperText={errors.licenseNumber?.message} />
        </Grid>
        <Grid size={6}>
          <Label required>Tax Id Type</Label>
          <TextField fullWidth size="small"
            {...register('taxIdType', { required: 'Required' })}
            error={!!errors.taxIdType} helperText={errors.taxIdType?.message} />
        </Grid>

        {/* Row 8: Type radio | Signature on File | Default Dentist + Default Hygienist */}
        <Grid size={4}>
          <Label>Type</Label>
          <Controller name="providerType" control={control} render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="Dentist" control={<Radio size="small" />} label={<Typography variant="body2">Dentist</Typography>} />
              <FormControlLabel value="Hygienist" control={<Radio size="small" />} label={<Typography variant="body2">Hygienist</Typography>} />
              <FormControlLabel value="Assistant/Other" control={<Radio size="small" />} label={<Typography variant="body2">Assistant/ Other</Typography>} />
            </RadioGroup>
          )} />
        </Grid>
        <Grid size={4} sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
          <Controller name="signatureOnFile" control={control} render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} />}
              label={<Typography variant="body2">Signature on File</Typography>}
            />
          )} />
        </Grid>
        <Grid size={4} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 2 }}>
          <Controller name="defaultDentist" control={control} render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} />}
              label={<Typography variant="body2">Default Dentist</Typography>}
            />
          )} />
          <Controller name="defaultHygienist" control={control} render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" checked={!!field.value} onChange={field.onChange} />}
              label={<Typography variant="body2">Default Hygienist</Typography>}
            />
          )} />
        </Grid>

        {/* Row 9: Country | Address Line 1 | Address Line 2 */}
        <Grid size={4}>
          <Label required>Country</Label>
          <Controller name="country" control={control} render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Mexico">Mexico</MenuItem>
              </Select>
            </FormControl>
          )} />
        </Grid>
        <Grid size={4}>
          <Label required>Address Line 1</Label>
          <TextField fullWidth size="small"
            {...register('addressLine1', { required: 'Required' })}
            error={!!errors.addressLine1} helperText={errors.addressLine1?.message} />
        </Grid>
        <Grid size={4}>
          <Label>Address Line 2</Label>
          <TextField fullWidth size="small" placeholder="Address line 2" {...register('addressLine2')} />
        </Grid>

        {/* Row 10: City | State | Zip */}
        <Grid size={4}>
          <Label required>City</Label>
          <TextField fullWidth size="small"
            {...register('city', { required: 'Required' })}
            error={!!errors.city} helperText={errors.city?.message} />
        </Grid>
        <Grid size={4}>
          <Label required>State/Province</Label>
          <Controller name="state" control={control} rules={{ required: 'Required' }} render={({ field }) => (
            <FormControl fullWidth size="small" error={!!errors.state}>
              <Select {...field} displayEmpty>
                <MenuItem value=""><em>Select State</em></MenuItem>
                {US_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          )} />
        </Grid>
        <Grid size={4}>
          <Label required>Zip/Postal Code</Label>
          <TextField fullWidth size="small"
            {...register('zipCode', { required: 'Required' })}
            error={!!errors.zipCode} helperText={errors.zipCode?.message} />
        </Grid>

        {/* Row 11: Description | Color */}
        <Grid size={6}>
          <Label>Description</Label>
          <TextField fullWidth size="small" multiline rows={3} placeholder="Enter Description"
            {...register('description')} />
        </Grid>
        <Grid size={6}>
          <Label>Color</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
            {COLOR_SWATCHES.map((c) => (
              <Box key={c} onClick={() => setValue('color', c)}
                sx={{
                  width: 22, height: 22, borderRadius: '3px', backgroundColor: c, cursor: 'pointer',
                  border: selectedColor === c ? '2px solid #1a3a6b' : '1px solid rgba(0,0,0,0.2)',
                  transition: 'transform 0.1s',
                  '&:hover': { transform: 'scale(1.15)' },
                }} />
            ))}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>More Colors:</Typography>
            <input type="color" value={selectedColor || '#000000'}
              onChange={(e) => setValue('color', e.target.value)}
              style={{ width: 22, height: 22, padding: 0, border: '1px solid rgba(0,0,0,0.2)', borderRadius: 3, cursor: 'pointer' }} />
          </Box>
        </Grid>

        {/* Row 12: Open Edge Token */}
        <Grid size={12}>
          <Label>Open Edge Token:</Label>
          <TextField fullWidth size="small" {...register('openEdgeToken')} />
        </Grid>

        {/* Row 13: Carriers out of network | OpenDental Provider Id */}
        <Grid size={6}>
          <Label>Carriers to be out of network</Label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select displayEmpty value={carrierInput}
                onChange={(e) => setCarrierInput(e.target.value)}>
                <MenuItem value=""><em>Select carrier</em></MenuItem>
                {['Delta Dental','Blue Cross Blue Shield','Aetna','Cigna','United Healthcare','Humana'].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddCarrier}
              sx={{ color: 'primary.main', textTransform: 'none' }}>
              +Add
            </Button>
          </Box>
          {carriers.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {carriers.map((c) => (
                <Chip key={c} label={c} size="small" onDelete={() => handleRemoveCarrier(c)}
                  sx={{ fontSize: '0.75rem' }} />
              ))}
            </Box>
          )}
        </Grid>
        <Grid size={6}>
          <Label>OpenDental Provider Id</Label>
          <TextField fullWidth size="small" {...register('openDentalProviderId')} />
        </Grid>

      </Grid>
    </Box>
  );
};

export default EditProviderForm;
