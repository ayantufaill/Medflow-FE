import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Drawer,
  Stack,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { userService } from '../../services/user.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

const PROVIDER_ROLE_NAMES = ['dentist', 'hygienist', 'assistant', 'doctor', 'provider'];
const PATIENT_ROLE_NAMES  = ['patient'];

const PROVIDER_TITLES   = ['DDS', 'DMD', 'RDH', 'DA', 'MD', 'DO', 'NP', 'PA'];
const PATIENT_TITLES    = ['Mr.', 'Mrs.', 'Ms.', 'Mx.', 'Dr.'];
const GENDERS           = [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }];
const MARITAL_STATUSES  = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (first, last) => {
  const f = (first || '').trim()[0] || '';
  const l = (last  || '').trim()[0] || '';
  return (f + l).toUpperCase() || '?';
};

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ letterSpacing: 1, fontWeight: 600, display: 'block', mb: 1.5 }}
  >
    {children}
  </Typography>
);

// ─── AddUserDrawer ────────────────────────────────────────────────────────────

const AddUserDrawer = ({ open, onClose, roles, onCreated }) => {
  const { showSnackbar } = useSnackbar();

  const [saving,          setSaving]          = useState(false);
  const [formError,       setFormError]       = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Core
      firstName:         '',
      lastName:          '',
      email:             '',
      password:          '',
      confirmPassword:   '',
      phone:             '',
      preferredLanguage: 'en',
      isActive:          true,
      // Provider profile
      npiNumber:                '',
      licenseNumber:            '',
      providerTitle:            '',
      specialty:                '',
      appointmentBufferMinutes: 0,
      maxDailyAppointments:     '',
      consultationFee:          '',
      isAcceptingNewPatients:   true,
      telehealthEnabled:        false,
      // Patient demographics
      middleInitial:  '',
      preferredName:  '',
      patientTitle:   '',
      dateOfBirth:    null,
      gender:         '',
      sexAtBirth:     '',
      genderIdentity: '',
      maritalStatus:  '',
      ssn:            '',
      occupation:     '',
      employer:       '',
    },
  });

  const password    = watch('password');
  const firstName   = watch('firstName');
  const lastName    = watch('lastName');

  // Derive which dynamic sections to show from selected roles
  const selectedRoleObjects = useMemo(
    () => roles.filter((r) => selectedRoleIds.includes(r._id || r.id)),
    [roles, selectedRoleIds]
  );

  const showProviderSection = useMemo(
    () => selectedRoleObjects.some((r) => PROVIDER_ROLE_NAMES.includes(r.name.toLowerCase())),
    [selectedRoleObjects]
  );

  const showPatientSection = useMemo(
    () => selectedRoleObjects.some((r) => PATIENT_ROLE_NAMES.includes(r.name.toLowerCase())),
    [selectedRoleObjects]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleClose = () => {
    if (saving) return;
    reset();
    setSelectedRoleIds([]);
    setFormError('');
    setShowPassword(false);
    setShowConfirm(false);
    onClose();
  };

  const toggleRole = (roleId) =>
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );

  const onSubmit = async (data) => {
    if (selectedRoleIds.length === 0) {
      setFormError('Please select at least one role.');
      return;
    }
    try {
      setSaving(true);
      setFormError('');

      const payload = {
        // Core user
        firstName:         data.firstName.trim(),
        lastName:          data.lastName.trim(),
        email:             data.email.trim(),
        password:          data.password,
        phone:             data.phone.trim() || undefined,
        preferredLanguage: data.preferredLanguage,
        isActive:          data.isActive,
        roleIds:           selectedRoleIds,
      };

      if (showProviderSection) {
        payload.providerProfile = {
          npiNumber:                data.npiNumber.trim()       || undefined,
          licenseNumber:            data.licenseNumber.trim()   || undefined,
          title:                    data.providerTitle          || undefined,
          specialty:                data.specialty.trim()       || undefined,
          appointmentBufferMinutes: Number(data.appointmentBufferMinutes) || 0,
          maxDailyAppointments:     data.maxDailyAppointments ? Number(data.maxDailyAppointments) : undefined,
          consultationFee:          data.consultationFee        ? Number(data.consultationFee) : undefined,
          isAcceptingNewPatients:   data.isAcceptingNewPatients,
          telehealthEnabled:        data.telehealthEnabled,
        };
      }

      if (showPatientSection) {
        payload.patientProfile = {
          middleInitial:  data.middleInitial.trim()  || undefined,
          preferredName:  data.preferredName.trim()  || undefined,
          title:          data.patientTitle           || undefined,
          dateOfBirth:    data.dateOfBirth            || undefined,
          gender:         data.gender !== ''          ? Number(data.gender) : undefined,
          sexAtBirth:     data.sexAtBirth.trim()      || undefined,
          genderIdentity: data.genderIdentity.trim()  || undefined,
          maritalStatus:  data.maritalStatus          || undefined,
          ssn:            data.ssn.trim()             || undefined,
          occupation:     data.occupation.trim()      || undefined,
          employer:       data.employer.trim()        || undefined,
        };
      }

      await userService.createUser(payload);
      showSnackbar('User created successfully', 'success');
      handleClose();
      onCreated();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create user.';
      setFormError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* ── Header ── */}
          <Box
            sx={{
              px: 3, py: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#1a3a6b', color: '#fff',
              borderBottom: 1, borderColor: 'divider', flexShrink: 0,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>Add New User</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Complete the fields below and assign a role
              </Typography>
            </Box>
            <IconButton onClick={handleClose} disabled={saving} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
                {formError}
              </Alert>
            )}

            {/* Avatar preview */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#1a3a6b', fontSize: '1.25rem', fontWeight: 700 }}>
                {getInitials(firstName, lastName)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {[firstName, lastName].filter(Boolean).join(' ') || 'New User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">Preview</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ══ SECTION 1 — Core User Info ══ */}
            <SectionLabel>Core Information</SectionLabel>
            <Grid container spacing={2}>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name" fullWidth size="small"
                  {...register('firstName', {
                    required: 'Required',
                    minLength: { value: 2, message: 'Min 2 chars' },
                    maxLength: { value: 50, message: 'Max 50 chars' },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name" fullWidth size="small"
                  {...register('lastName', {
                    required: 'Required',
                    minLength: { value: 2, message: 'Min 2 chars' },
                    maxLength: { value: 50, message: 'Max 50 chars' },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Email Address" type="email" fullWidth size="small"
                  {...register('email', {
                    required: 'Required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Password" fullWidth size="small"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase and a number',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Confirm Password" fullWidth size="small"
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Required',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}>
                          {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone" fullWidth size="small"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  helperText="International format"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Preferred Language</InputLabel>
                  <Select label="Preferred Language" defaultValue="en" {...register('preferredLanguage')}>
                    {LANGUAGES.map((l) => (
                      <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={<Typography variant="body2">Active account</Typography>}
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                    />
                  )}
                />
              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* ══ SECTION 2 — Role Assignment ══ */}
            <SectionLabel>Assign Role</SectionLabel>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Select one or more roles. Role-specific fields will appear below.
            </Typography>

            {roles.length === 0 ? (
              <Alert severity="info">No roles available</Alert>
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {roles.map((role) => {
                  const id       = role._id || role.id;
                  const selected = selectedRoleIds.includes(id);
                  return (
                    <Chip
                      key={id}
                      label={role.name}
                      onClick={() => toggleRole(id)}
                      color={selected ? 'primary' : 'default'}
                      variant={selected ? 'filled' : 'outlined'}
                      icon={selected ? <CheckCircleIcon /> : undefined}
                      disabled={saving}
                      sx={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </Stack>
            )}

            {/* ══ SECTION 3 — Provider Profile ══ */}
            {showProviderSection && (
              <>
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Provider Profile</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="NPI Number" fullWidth size="small"
                      placeholder="National Provider ID"
                      {...register('npiNumber')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="License Number" fullWidth size="small"
                      placeholder="State license"
                      {...register('licenseNumber')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Title</InputLabel>
                      <Select label="Title" defaultValue="" {...register('providerTitle')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {PROVIDER_TITLES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Specialty" fullWidth size="small"
                      placeholder="e.g. General Dentistry"
                      {...register('specialty')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Buffer (mins)" fullWidth size="small" type="number"
                      inputProps={{ min: 0 }}
                      {...register('appointmentBufferMinutes', { min: 0 })}
                      helperText="Appointment buffer"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Max Daily Appts" fullWidth size="small" type="number"
                      inputProps={{ min: 0 }}
                      {...register('maxDailyAppointments', { min: 0 })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Consultation Fee ($)" fullWidth size="small" type="number"
                      inputProps={{ min: 0, step: '0.01' }}
                      {...register('consultationFee', { min: 0 })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="isAcceptingNewPatients"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          label={<Typography variant="body2">Accepting new patients</Typography>}
                          control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="telehealthEnabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          label={<Typography variant="body2">Telehealth enabled</Typography>}
                          control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                        />
                      )}
                    />
                  </Grid>

                </Grid>
              </>
            )}

            {/* ══ SECTION 4 — Patient Demographics ══ */}
            {showPatientSection && (
              <>
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Patient Demographics</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Title</InputLabel>
                      <Select label="Title" defaultValue="" {...register('patientTitle')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {PATIENT_TITLES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Middle Initial" fullWidth size="small"
                      inputProps={{ maxLength: 1 }}
                      {...register('middleInitial')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Preferred Name" fullWidth size="small"
                      {...register('preferredName')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Date of Birth"
                          value={field.value}
                          onChange={field.onChange}
                          disableFuture
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select label="Gender" defaultValue="" {...register('gender')}>
                        <MenuItem value=""><em>Prefer not to say</em></MenuItem>
                        {GENDERS.map((g) => (
                          <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Sex at Birth" fullWidth size="small"
                      {...register('sexAtBirth')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Gender Identity" fullWidth size="small"
                      {...register('genderIdentity')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Marital Status</InputLabel>
                      <Select label="Marital Status" defaultValue="" {...register('maritalStatus')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {MARITAL_STATUSES.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="SSN" fullWidth size="small"
                      placeholder="XXX-XX-XXXX"
                      {...register('ssn')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Occupation" fullWidth size="small"
                      {...register('occupation')}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      label="Employer" fullWidth size="small"
                      {...register('employer')}
                    />
                  </Grid>

                </Grid>
              </>
            )}

          </Box>

          {/* ── Footer ── */}
          <Box
            sx={{
              px: 3, py: 2,
              borderTop: 1, borderColor: 'divider',
              display: 'flex', justifyContent: 'flex-end', gap: 1.5,
              backgroundColor: 'background.paper', flexShrink: 0,
            }}
          >
            <Button variant="outlined" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || selectedRoleIds.length === 0}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ backgroundColor: '#1a3a6b', '&:hover': { backgroundColor: '#142d54' } }}
            >
              {saving ? 'Creating...' : 'Create User'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default AddUserDrawer;
