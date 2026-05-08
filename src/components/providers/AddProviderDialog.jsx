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
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { providerService } from '../../services/provider.service';

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

const Label = ({ children, required }) => (
  <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

const PhoneInput = ({ label, required, name, register, errors }) => (
  <Box>
    <Label required={required}>{label}</Label>
    <TextField
      fullWidth size="small" placeholder="(201) 555-0123"
      InputProps={{ startAdornment: <InputAdornment position="start">🇺🇸 ·</InputAdornment> }}
      {...register(name, required ? { required: 'Required' } : {})}
      error={!!errors[name]} helperText={errors[name]?.message}
    />
  </Box>
);

// ─── Address block (shared between both form types) ───────────────────────────

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
    <Grid size={12}>
      <Label>Description</Label>
      <TextField fullWidth size="small" multiline rows={3}
        placeholder="Enter Description" {...register('description')} />
    </Grid>
  </>
);

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

    <Grid size={4}><PhoneInput label="Office Phone Number" required name="officePhone" register={register} errors={errors} /></Grid>
    <Grid size={4}><PhoneInput label="Mobile Phone Number" required name="mobilePhone" register={register} errors={errors} /></Grid>
    <Grid size={4}>
      <Label required>Email</Label>
      <TextField fullWidth size="small" type="email" placeholder="Enter Email"
        {...register('email', { required: 'Required' })}
        error={!!errors.email} helperText={errors.email?.message} />
    </Grid>

    <Grid size={4}><PhoneInput label="Fax Number" name="faxNumber" register={register} errors={errors} /></Grid>
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
        <Switch
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          size="small"
        />
      )} />
    </Grid>

    <Grid size={4}><PhoneInput label="Office Phone Number" required name="officePhone" register={register} errors={errors} /></Grid>
    <Grid size={4}><PhoneInput label="Mobile Phone Number" required name="mobilePhone" register={register} errors={errors} /></Grid>
    <Grid size={4}>
      <Label required>Email</Label>
      <TextField fullWidth size="small" type="email" placeholder="Enter Email"
        {...register('email', { required: 'Required' })}
        error={!!errors.email} helperText={errors.email?.message} />
    </Grid>

    <Grid size={4}><PhoneInput label="Fax Number" name="faxNumber" register={register} errors={errors} /></Grid>
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
  </Grid>
);

// ─── Dialog ───────────────────────────────────────────────────────────────────

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

const AddProviderDialog = ({ open, title = 'Add Provider', providerCategory, onClose, onSaved }) => {
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isLab = providerCategory === 'lab';

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: isLab ? LAB_DEFAULTS : REFERRAL_DEFAULTS,
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

      const payload = {
        ...(isLab
          ? { labName: data.labName, dueDateInDays: data.dueDateInDays, inHouseLabProvider: data.inHouseLabProvider }
          : { firstName: data.firstName, lastName: data.lastName, prefix: data.prefix, suffix: data.suffix }
        ),
        officePhone: data.officePhone,
        phone: data.mobilePhone,
        email: data.email,
        faxNumber: data.faxNumber,
        specialty: data.specialty,
        description: data.description,
        providerCategory,
        address: {
          country: data.country,
          street: data.addressLine1,
          address2: data.addressLine2,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      };

      const created = await providerService.createProvider(payload);
      showSnackbar('Provider created successfully', 'success');
      handleClose();
      onSaved?.(created);
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create provider. Please try again.';
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
          {isLab
            ? <LabForm register={register} control={control} errors={errors} />
            : <ReferralForm register={register} control={control} errors={errors} />
          }
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
