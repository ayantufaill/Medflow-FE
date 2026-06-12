import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Switch,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon, Add as AddIcon } from '@mui/icons-material';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useDispatch } from 'react-redux';
import { createProvider } from '../../store/slices/providerSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';

const FORM_ID = 'add-provider-dialog-form';

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

const CARRIERS = [
  'Delta Dental','Blue Cross Blue Shield','Aetna','Cigna','United Healthcare','Humana',
];

// ─── Shared sub-components ────────────────────────────────────────────────────

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

const AddressFields = ({ register, control, errors }) => (
  <>
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
  </>
);

// ─── Active Provider form (full) ──────────────────────────────────────────────

const ActiveProviderForm = ({ register, control, errors, watch, setValue }) => {
  const [carriers, setCarriers] = useState([]);
  const [carrierInput, setCarrierInput] = useState('');
  const selectedColor = watch('color');

  const handleAddCarrier = () => {
    if (carrierInput.trim() && !carriers.includes(carrierInput.trim())) {
      setCarriers((prev) => [...prev, carrierInput.trim()]);
      setCarrierInput('');
    }
  };

  return (
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

      {/* Row 8: Type | Signature on File | Default Dentist + Hygienist */}
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

      {/* Address */}
      <AddressFields register={register} control={control} errors={errors} />

      {/* Row: Description | Color */}
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
                '&:hover': { transform: 'scale(1.15)' },
              }} />
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>More Colors:</Typography>
          <input type="color" value={selectedColor || '#000000'}
            onChange={(e) => setValue('color', e.target.value)}
            style={{ width: 22, height: 22, padding: 0, border: '1px solid rgba(0,0,0,0.2)', borderRadius: 3, cursor: 'pointer' }} />
        </Box>
      </Grid>

      {/* Open Edge Token */}
      <Grid size={12}>
        <Label>Open Edge Token:</Label>
        <TextField fullWidth size="small" {...register('openEdgeToken')} />
      </Grid>

      {/* Carriers | OpenDental Provider Id */}
      <Grid size={6}>
        <Label>Carriers to be out of network</Label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select displayEmpty value={carrierInput} onChange={(e) => setCarrierInput(e.target.value)}>
              <MenuItem value=""><em>Select carrier</em></MenuItem>
              {CARRIERS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
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
              <Chip key={c} label={c} size="small"
                onDelete={() => setCarriers((prev) => prev.filter((x) => x !== c))}
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
  );
};

// ─── Referral / Care Team form ────────────────────────────────────────────────

const ReferralForm = ({ register, control, errors }) => (
  <Grid container spacing={2}>
    <Grid size={3}>
      <Label required>First Name</Label>
      <TextField fullWidth size="small" placeholder="Enter First Name"
        {...register('firstName', { required: 'Required' })}
        error={!!errors.firstName} helperText={errors.firstName?.message} />
    </Grid>
    <Grid size={3}>
      <Label required>Last Name</Label>
      <TextField fullWidth size="small" placeholder="Enter Last Name"
        {...register('lastName', { required: 'Required' })}
        error={!!errors.lastName} helperText={errors.lastName?.message} />
    </Grid>
    <Grid size={3}>
      <Label required>Prefix (Dr, Mr...)</Label>
      <TextField fullWidth size="small" placeholder="Enter Title"
        {...register('prefix', { required: 'Required' })}
        error={!!errors.prefix} helperText={errors.prefix?.message} />
    </Grid>
    <Grid size={3}>
      <Label>Suffix (DDs...)</Label>
      <TextField fullWidth size="small" placeholder="Enter Suffix" {...register('suffix')} />
    </Grid>

    <Grid size={4}><PhoneInput label="Office Phone Number" required name="officePhone" control={control} /></Grid>
    <Grid size={4}><PhoneInput label="Mobile Phone Number" required name="mobilePhone" control={control} /></Grid>
    <Grid size={4}>
      <Label required>Email</Label>
      <TextField fullWidth size="small" type="email" placeholder="Enter Email"
        {...register('email', { required: 'Required' })}
        error={!!errors.email} helperText={errors.email?.message} />
    </Grid>

    <Grid size={4}><PhoneInput label="Fax Number" name="faxNumber" control={control} /></Grid>
    <Grid size={4}>
      <Label>Specialty</Label>
      <Controller name="specialty" control={control} render={({ field }) => (
        <FormControl fullWidth size="small">
          <Select {...field} displayEmpty>
            <MenuItem value=""><em>&nbsp;</em></MenuItem>
            {SPECIALTIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      )} />
    </Grid>

    <AddressFields register={register} control={control} errors={errors} />

    <Grid size={12}>
      <Label>Description</Label>
      <TextField fullWidth size="small" multiline rows={3}
        placeholder="Enter Description" {...register('description')} />
    </Grid>
  </Grid>
);

// ─── Lab form ─────────────────────────────────────────────────────────────────

const LabForm = ({ register, control, errors }) => (
  <Grid container spacing={2}>
    <Grid size={4}>
      <Label required>Lab Name</Label>
      <TextField fullWidth size="small" placeholder="Enter Lab Name"
        {...register('labName', { required: 'Required' })}
        error={!!errors.labName} helperText={errors.labName?.message} />
    </Grid>
    <Grid size={4}>
      <Label>Due Date in Days</Label>
      <TextField fullWidth size="small" type="number" placeholder="Enter Due Date in Days"
        inputProps={{ min: 0 }}
        {...register('dueDateInDays')} />
    </Grid>
    <Grid size={4}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <Typography variant="caption" fontWeight={600}>In-house Lab Provider</Typography>
        <Tooltip title="Mark this provider as an in-house lab">
          <InfoIcon sx={{ fontSize: 14, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <Controller name="inHouseLabProvider" control={control} render={({ field }) => (
        <Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />
      )} />
    </Grid>

    <Grid size={4}><PhoneInput label="Office Phone Number" required name="officePhone" control={control} /></Grid>
    <Grid size={4}><PhoneInput label="Mobile Phone Number" required name="mobilePhone" control={control} /></Grid>
    <Grid size={4}>
      <Label required>Email</Label>
      <TextField fullWidth size="small" type="email" placeholder="Enter Email"
        {...register('email', { required: 'Required' })}
        error={!!errors.email} helperText={errors.email?.message} />
    </Grid>

    <Grid size={4}><PhoneInput label="Fax Number" name="faxNumber" control={control} /></Grid>
    <Grid size={4}>
      <Label>Specialty</Label>
      <Controller name="specialty" control={control} render={({ field }) => (
        <FormControl fullWidth size="small">
          <Select {...field} displayEmpty>
            <MenuItem value=""><em>&nbsp;</em></MenuItem>
            {SPECIALTIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      )} />
    </Grid>

    <AddressFields register={register} control={control} errors={errors} />

    <Grid size={12}>
      <Label>Description</Label>
      <TextField fullWidth size="small" multiline rows={3}
        placeholder="Enter Description" {...register('description')} />
    </Grid>
  </Grid>
);

// ─── Default values per form type ─────────────────────────────────────────────

const ACTIVE_DEFAULTS = {
  firstName: '', lastName: '', middleName: '', prefix: '', suffix: '',
  preferredName: '', internalCodeName: '', email: '', organizationName: '',
  federalTaxNumber: '', npiNumber: '', additionalProviderId: '', dea: '',
  specialty: '', mobilePhone: '', homePhone: '', licenseNumber: '', taxIdType: '',
  providerType: 'Dentist', signatureOnFile: false, defaultDentist: false, defaultHygienist: false,
  country: 'United States', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '',
  description: '', color: '', openEdgeToken: '', openDentalProviderId: '',
};

const REFERRAL_DEFAULTS = {
  firstName: '', lastName: '', prefix: '', suffix: '',
  officePhone: '', mobilePhone: '', email: '', faxNumber: '', specialty: '',
  country: 'United States', addressLine1: '', addressLine2: '',
  city: '', state: '', zipCode: '', description: '',
};

const LAB_DEFAULTS = {
  labName: '', dueDateInDays: '', inHouseLabProvider: false,
  officePhone: '', mobilePhone: '', email: '', faxNumber: '', specialty: '',
  country: 'United States', addressLine1: '', addressLine2: '',
  city: '', state: '', zipCode: '', description: '',
};

// ─── Dialog ───────────────────────────────────────────────────────────────────

const AddProviderDialog = ({ open, title = 'Add Provider', providerCategory, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isLab = providerCategory === 'lab';
  const isActive = !providerCategory;

  const getDefaults = () => {
    if (isLab) return LAB_DEFAULTS;
    if (isActive) return ACTIVE_DEFAULTS;
    return REFERRAL_DEFAULTS;
  };

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: getDefaults(),
  });

  const handleClose = () => {
    if (saving) return;
    reset();
    setError('');
    onClose();
  };

  const submit = async (data) => {
    try {
      setSaving(true);
      setError('');

      let payload;
      if (isLab) {
        payload = {
          labName: data.labName,
          dueDateInDays: data.dueDateInDays,
          inHouseLabProvider: data.inHouseLabProvider,
          officePhone: data.officePhone,
          phone: data.mobilePhone,
          email: data.email,
          faxNumber: data.faxNumber,
          specialty: data.specialty,
          description: data.description,
          providerCategory,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      } else if (isActive) {
        payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          prefix: data.prefix,
          suffix: data.suffix,
          preferredName: data.preferredName,
          internalCodeName: data.internalCodeName,
          email: data.email,
          organizationName: data.organizationName,
          federalTaxNumber: data.federalTaxNumber,
          npiNumber: data.npiNumber,
          additionalProviderId: data.additionalProviderId,
          dea: data.dea,
          specialty: data.specialty,
          phone: data.mobilePhone,
          homePhone: data.homePhone,
          licenseNumber: data.licenseNumber,
          taxIdType: data.taxIdType,
          providerType: data.providerType,
          signatureOnFile: data.signatureOnFile,
          defaultDentist: data.defaultDentist,
          defaultHygienist: data.defaultHygienist,
          description: data.description,
          color: data.color,
          openEdgeToken: data.openEdgeToken,
          openDentalProviderId: data.openDentalProviderId,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      } else {
        payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          prefix: data.prefix,
          suffix: data.suffix,
          officePhone: data.officePhone,
          phone: data.mobilePhone,
          email: data.email,
          faxNumber: data.faxNumber,
          specialty: data.specialty,
          description: data.description,
          providerCategory,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      }

      const created = await dispatch(createProvider(payload)).unwrap();
      showSnackbar('Provider created successfully', 'success');
      handleClose();
      onSaved?.(created);
    } catch (err) {
      // The unwrap() handles the ConditionError object safely
      let msg = 'Failed to create provider. Please try again.';
      if (err?.name === 'ConditionError') return; // Aborted by Redux internally
      
      if (typeof err === 'string') {
        msg = err;
      } else if (err?.message) {
        msg = err.message;
      }

      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '90vh' } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#1a3a6b',
          color: 'white',
          py: 1.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        <Box component="form" id={FORM_ID} onSubmit={handleSubmit(submit)} noValidate>
          {isLab && <LabForm register={register} control={control} errors={errors} />}
          {isActive && <ActiveProviderForm register={register} control={control} errors={errors} watch={watch} setValue={setValue} />}
          {!isLab && !isActive && <ReferralForm register={register} control={control} errors={errors} />}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          * required field
        </Typography>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          size="small"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ backgroundColor: '#c8a830', '&:hover': { backgroundColor: '#a88820' } }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={handleClose} disabled={saving} variant="outlined" size="small"
          sx={{ borderColor: '#ccc', color: 'text.secondary' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProviderDialog;
