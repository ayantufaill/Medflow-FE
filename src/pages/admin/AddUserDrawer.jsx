import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { DatePicker }         from '@mui/x-date-pickers/DatePicker';
import { TimePicker }         from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs }       from '@mui/x-date-pickers/AdapterDayjs';
import { userService }        from '../../services/user.service';
import { useSnackbar }        from '../../contexts/SnackbarContext';

// ─── Role mapping ─────────────────────────────────────────────────────────────

const PROVIDER_ROLE_NAMES = ['dentist', 'hygienist', 'assistant'];
const PATIENT_ROLE_NAMES  = ['patient'];

// ─── Lookup data ──────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

const PROVIDER_TITLES  = ['DDS', 'DMD', 'RDH', 'DA', 'MD', 'DO', 'NP', 'PA'];
const PATIENT_TITLES   = ['Mr.', 'Mrs.', 'Ms.', 'Mx.', 'Dr.'];
const GENDERS          = [{ value: 0, label: 'Unknown' }, { value: 1, label: 'Male' }, { value: 2, label: 'Female' }];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership'];
const PROFILE_TYPES    = ['adult', 'child', 'guardian'];
const CONTACT_METHODS  = [
  { value: 0, label: 'Phone' },
  { value: 1, label: 'Email' },
  { value: 2, label: 'SMS'   },
  { value: 3, label: 'Portal'},
];

const DAYS_OF_WEEK = [
  { dayOfWeek: 1, label: 'Monday'    },
  { dayOfWeek: 2, label: 'Tuesday'   },
  { dayOfWeek: 3, label: 'Wednesday' },
  { dayOfWeek: 4, label: 'Thursday'  },
  { dayOfWeek: 5, label: 'Friday'    },
  { dayOfWeek: 6, label: 'Saturday'  },
  { dayOfWeek: 7, label: 'Sunday'    },
];

const DEFAULT_START = dayjs().hour(9).minute(0).second(0);
const DEFAULT_END   = dayjs().hour(17).minute(0).second(0);

const makeDefaultWorkingHours = () =>
  DAYS_OF_WEEK.map(({ dayOfWeek, label }) => ({
    dayOfWeek,
    label,
    isAvailable: dayOfWeek <= 5,       // Mon–Fri on, Sat–Sun off
    startTime:   dayOfWeek <= 5 ? DEFAULT_START : null,
    endTime:     dayOfWeek <= 5 ? DEFAULT_END   : null,
  }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Default form values ──────────────────────────────────────────────────────

const DEFAULT_VALUES = {
  firstName: '', lastName: '', email: '',
  password: '', confirmPassword: '',
  phone: '', preferredLanguage: 'en', isActive: true,

  npiNumber: '', licenseNumber: '', providerTitle: '', specialty: '',
  appointmentBufferMinutes: 0, maxDailyAppointments: '', consultationFee: '',
  isAcceptingNewPatients: true, telehealthEnabled: false,

  patientTitle: '', middleInitial: '', preferredName: '',
  dateOfBirth: null,
  gender: '', sexAtBirth: '', genderIdentity: '',
  maritalStatus: '', ssn: '', occupation: '', employer: '',

  mobilePhone: '', homePhone: '', workPhone: '',
  preferredContactMethod: '',

  address: '', address2: '', city: '', state: '', zip: '', country: '',
  'workAddress.line1': '', 'workAddress.line2': '',
  'workAddress.city': '', 'workAddress.state': '',
  'workAddress.postalCode': '', 'workAddress.country': '',

  chartNumber: '', medicaidId: '',
  preferredDentistId: '', preferredHygienistId: '',
  referralSource: '', patientProfileType: '',
  portalAccessEnabled: false, patientFlags: '',
  'emergencyContact.name': '', 'emergencyContact.relationship': '',
  'emergencyContact.phone': '',
};

// ─── AddUserDrawer ────────────────────────────────────────────────────────────

const AddUserDrawer = ({ open, onClose, roles, onCreated }) => {
  const { showSnackbar } = useSnackbar();

  const [saving,          setSaving]          = useState(false);
  const [formError,       setFormError]       = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [workingHours,    setWorkingHours]    = useState(makeDefaultWorkingHours);

  const scrollBodyRef      = useRef(null);
  const providerSectionRef = useRef(null);
  const patientSectionRef  = useRef(null);

  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const password  = watch('password');
  const firstName = watch('firstName');
  const lastName  = watch('lastName');

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

  // Auto-scroll to the dynamic section when it first appears
  useEffect(() => {
    if (showProviderSection && providerSectionRef.current) {
      setTimeout(() => {
        providerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [showProviderSection]);

  useEffect(() => {
    if (showPatientSection && patientSectionRef.current) {
      setTimeout(() => {
        patientSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [showPatientSection]);

  // ── Working hours helpers ─────────────────────────────────────────────────────

  const updateDay = (dayOfWeek, field, value) =>
    setWorkingHours((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              [field]: value,
              // When toggling on, set defaults if times are null
              ...(field === 'isAvailable' && value
                ? { startTime: d.startTime ?? DEFAULT_START, endTime: d.endTime ?? DEFAULT_END }
                : {}),
            }
          : d
      )
    );

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleClose = () => {
    if (saving) return;
    reset(DEFAULT_VALUES);
    setSelectedRoleIds([]);
    setFormError('');
    setShowPassword(false);
    setShowConfirm(false);
    setWorkingHours(makeDefaultWorkingHours());
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
          npiNumber:                data.npiNumber.trim()     || undefined,
          licenseNumber:            data.licenseNumber.trim() || undefined,
          title:                    data.providerTitle        || undefined,
          specialty:                data.specialty.trim()     || undefined,
          appointmentBufferMinutes: Number(data.appointmentBufferMinutes) || 0,
          maxDailyAppointments:     data.maxDailyAppointments ? Number(data.maxDailyAppointments) : undefined,
          consultationFee:          data.consultationFee      ? Number(data.consultationFee) : undefined,
          isAcceptingNewPatients:   data.isAcceptingNewPatients,
          telehealthEnabled:        data.telehealthEnabled,
          workingHours: workingHours.map(({ dayOfWeek, isAvailable, startTime, endTime }) => ({
            dayOfWeek,
            isAvailable,
            startTime: isAvailable && startTime ? dayjs(startTime).format('HH:mm') : undefined,
            endTime:   isAvailable && endTime   ? dayjs(endTime).format('HH:mm')   : undefined,
          })),
        };
      }

      if (showPatientSection) {
        const hasWorkAddress = [
          data['workAddress.line1'], data['workAddress.city'],
          data['workAddress.state'], data['workAddress.postalCode'],
        ].some((v) => v?.trim());

        const hasEmergencyContact = [
          data['emergencyContact.name'],
          data['emergencyContact.relationship'],
          data['emergencyContact.phone'],
        ].some((v) => v?.trim());

        payload.patientProfile = {
          title: data.patientTitle || undefined, middleInitial: data.middleInitial.trim() || undefined,
          preferredName: data.preferredName.trim() || undefined, dateOfBirth: data.dateOfBirth || undefined,
          gender: data.gender !== '' ? Number(data.gender) : undefined,
          sexAtBirth: data.sexAtBirth.trim() || undefined, genderIdentity: data.genderIdentity.trim() || undefined,
          maritalStatus: data.maritalStatus || undefined, ssn: data.ssn.trim() || undefined,
          occupation: data.occupation.trim() || undefined, employer: data.employer.trim() || undefined,
          mobilePhone: data.mobilePhone.trim() || undefined, homePhone: data.homePhone.trim() || undefined,
          workPhone: data.workPhone.trim() || undefined,
          preferredContactMethod: data.preferredContactMethod !== '' ? Number(data.preferredContactMethod) : undefined,
          address: data.address.trim() || undefined, address2: data.address2.trim() || undefined,
          city: data.city.trim() || undefined, state: data.state.trim() || undefined,
          zip: data.zip.trim() || undefined, country: data.country.trim() || undefined,
          workAddress: hasWorkAddress ? {
            line1: data['workAddress.line1'].trim() || undefined, line2: data['workAddress.line2'].trim() || undefined,
            city: data['workAddress.city'].trim() || undefined, state: data['workAddress.state'].trim() || undefined,
            postalCode: data['workAddress.postalCode'].trim() || undefined, country: data['workAddress.country'].trim() || undefined,
          } : undefined,
          chartNumber: data.chartNumber.trim() || undefined, medicaidId: data.medicaidId.trim() || undefined,
          preferredDentistId: data.preferredDentistId.trim() || undefined,
          preferredHygienistId: data.preferredHygienistId.trim() || undefined,
          referralSource: data.referralSource.trim() || undefined,
          patientProfileType: data.patientProfileType || undefined,
          portalAccessEnabled: data.portalAccessEnabled,
          patientFlags: data.patientFlags
            ? data.patientFlags.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
          emergencyContact: hasEmergencyContact ? {
            name: data['emergencyContact.name'].trim() || undefined,
            relationship: data['emergencyContact.relationship'].trim() || undefined,
            phone: data['emergencyContact.phone'].trim() || undefined,
          } : undefined,
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

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 580 }, mt: '64px', height: 'calc(100% - 64px)' } }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* ── Header ── */}
          <Box sx={{
            px: 3, py: 2, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#1a3a6b', color: '#fff',
            borderBottom: 1, borderColor: 'divider',
          }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>Add New User</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Core fields for everyone — role-specific fields appear below
              </Typography>
            </Box>
            <IconButton onClick={handleClose} disabled={saving} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box ref={scrollBodyRef} sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>

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

            {/* ══ SECTION 1 — Core User ══ */}
            <SectionLabel>Core Information</SectionLabel>
            <Grid container spacing={2}>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="First Name" fullWidth size="small"
                  {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' }, maxLength: { value: 50, message: 'Max 50 chars' } })}
                  error={!!errors.firstName} helperText={errors.firstName?.message} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Last Name" fullWidth size="small"
                  {...register('lastName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' }, maxLength: { value: 50, message: 'Max 50 chars' } })}
                  error={!!errors.lastName} helperText={errors.lastName?.message} />
              </Grid>

              <Grid size={12}>
                <TextField label="Email Address" type="email" fullWidth size="small"
                  {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                  error={!!errors.email} helperText={errors.email?.message} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Password" fullWidth size="small"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Needs uppercase, lowercase and a number' },
                  })}
                  error={!!errors.password} helperText={errors.password?.message}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Confirm Password" fullWidth size="small"
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', { required: 'Required', validate: (v) => v === password || 'Passwords do not match' })}
                  error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}>
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Phone" fullWidth size="small" placeholder="+1 (555) 000-0000"
                  {...register('phone')} helperText="International format" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Preferred Language</InputLabel>
                  <Select label="Preferred Language" defaultValue="en" {...register('preferredLanguage')}>
                    {LANGUAGES.map((l) => <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Controller name="isActive" control={control} render={({ field }) => (
                  <FormControlLabel
                    label={<Typography variant="body2">Active account</Typography>}
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                  />
                )} />
              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* ══ SECTION 2 — Role Assignment ══ */}
            <SectionLabel>Assign Role</SectionLabel>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Dentist / Hygienist / Assistant → provider fields.&nbsp; Patient → patient profile fields.
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
              <Box ref={providerSectionRef}>
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Provider Profile</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="NPI Number" fullWidth size="small" placeholder="National Provider ID"
                      {...register('npiNumber')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="License Number" fullWidth size="small" placeholder="State license"
                      {...register('licenseNumber')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Title</InputLabel>
                      <Select label="Title" defaultValue="" {...register('providerTitle')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {PROVIDER_TITLES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Specialty" fullWidth size="small" placeholder="e.g. General Dentistry"
                      {...register('specialty')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Buffer (mins)" fullWidth size="small" type="number"
                      inputProps={{ min: 0 }} helperText="Appointment buffer"
                      {...register('appointmentBufferMinutes', { min: 0 })} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Max Daily Appts" fullWidth size="small" type="number"
                      inputProps={{ min: 0 }}
                      {...register('maxDailyAppointments', { min: 0 })} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Consultation Fee ($)" fullWidth size="small" type="number"
                      inputProps={{ min: 0, step: '0.01' }}
                      {...register('consultationFee', { min: 0 })} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="isAcceptingNewPatients" control={control} render={({ field }) => (
                      <FormControlLabel
                        label={<Typography variant="body2">Accepting new patients</Typography>}
                        control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                      />
                    )} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="telehealthEnabled" control={control} render={({ field }) => (
                      <FormControlLabel
                        label={<Typography variant="body2">Telehealth enabled</Typography>}
                        control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                      />
                    )} />
                  </Grid>

                </Grid>

                {/* Working Hours / Schedule */}
                <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                  Working Hours
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                  Toggle a day off to mark it as unavailable. Mon–Fri default to 9 AM – 5 PM.
                </Typography>

                <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: 110 }}>Day</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: 80 }}>Available</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Start</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>End</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workingHours.map((row) => (
                        <TableRow key={row.dayOfWeek} sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={row.isAvailable ? 600 : 400} color={row.isAvailable ? 'text.primary' : 'text.disabled'}>
                              {row.label}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Switch
                              size="small"
                              checked={row.isAvailable}
                              onChange={(e) => updateDay(row.dayOfWeek, 'isAvailable', e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            {row.isAvailable ? (
                              <TimePicker
                                value={row.startTime}
                                onChange={(v) => updateDay(row.dayOfWeek, 'startTime', v)}
                                slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                              />
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {row.isAvailable ? (
                              <TimePicker
                                value={row.endTime}
                                onChange={(v) => updateDay(row.dayOfWeek, 'endTime', v)}
                                slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                              />
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}

            {/* ══ SECTIONS 4–7 — Patient Profile ══ */}
            {showPatientSection && (
              <Box ref={patientSectionRef}>

                {/* 4. Demographics */}
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Patient — Demographics</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Title</InputLabel>
                      <Select label="Title" defaultValue="" {...register('patientTitle')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {PATIENT_TITLES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Middle Initial" fullWidth size="small"
                      inputProps={{ maxLength: 1 }} {...register('middleInitial')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Preferred Name" fullWidth size="small"
                      {...register('preferredName')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="dateOfBirth" control={control} render={({ field }) => (
                      <DatePicker label="Date of Birth" value={field.value} onChange={field.onChange}
                        disableFuture slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                    )} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select label="Gender" defaultValue="" {...register('gender')}>
                        <MenuItem value=""><em>Prefer not to say</em></MenuItem>
                        {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Sex at Birth" fullWidth size="small" {...register('sexAtBirth')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Gender Identity" fullWidth size="small" {...register('genderIdentity')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Marital Status</InputLabel>
                      <Select label="Marital Status" defaultValue="" {...register('maritalStatus')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {MARITAL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="SSN" fullWidth size="small" placeholder="XXX-XX-XXXX"
                      {...register('ssn')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Occupation" fullWidth size="small" {...register('occupation')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Employer" fullWidth size="small" {...register('employer')} />
                  </Grid>

                </Grid>

                {/* 5. Contact */}
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Patient — Contact</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Mobile Phone" fullWidth size="small"
                      placeholder="+1 (555) 000-0000" {...register('mobilePhone')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Home Phone" fullWidth size="small" {...register('homePhone')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Work Phone" fullWidth size="small" {...register('workPhone')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Preferred Contact Method</InputLabel>
                      <Select label="Preferred Contact Method" defaultValue=""
                        {...register('preferredContactMethod')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {CONTACT_METHODS.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>

                {/* 6. Address */}
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Patient — Address</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={12}>
                    <TextField label="Address Line 1" fullWidth size="small" {...register('address')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Address Line 2" fullWidth size="small" {...register('address2')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="City" fullWidth size="small" {...register('city')} />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField label="State" fullWidth size="small" {...register('state')} />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField label="ZIP" fullWidth size="small" {...register('zip')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Country" fullWidth size="small" {...register('country')} />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">Work Address (optional)</Typography>
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Work Line 1" fullWidth size="small" {...register('workAddress.line1')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Work Line 2" fullWidth size="small" {...register('workAddress.line2')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Work City" fullWidth size="small" {...register('workAddress.city')} />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField label="Work State" fullWidth size="small" {...register('workAddress.state')} />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField label="Postal Code" fullWidth size="small" {...register('workAddress.postalCode')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Work Country" fullWidth size="small" {...register('workAddress.country')} />
                  </Grid>

                </Grid>

                {/* 7. Clinical / Admin */}
                <Divider sx={{ my: 3 }} />
                <SectionLabel>Patient — Clinical / Admin</SectionLabel>
                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Chart Number" fullWidth size="small" {...register('chartNumber')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Medicaid ID" fullWidth size="small" {...register('medicaidId')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Preferred Dentist ID" fullWidth size="small" {...register('preferredDentistId')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Preferred Hygienist ID" fullWidth size="small" {...register('preferredHygienistId')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Referral Source" fullWidth size="small" {...register('referralSource')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Patient Profile Type</InputLabel>
                      <Select label="Patient Profile Type" defaultValue="" {...register('patientProfileType')}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {PROFILE_TYPES.map((t) => (
                          <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <TextField label="Patient Flags" fullWidth size="small"
                      placeholder="e.g. VIP, Allergy, Special needs"
                      helperText="Comma-separated"
                      {...register('patientFlags')} />
                  </Grid>

                  <Grid size={12}>
                    <Controller name="portalAccessEnabled" control={control} render={({ field }) => (
                      <FormControlLabel
                        label={<Typography variant="body2">Portal access enabled</Typography>}
                        control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
                      />
                    )} />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">Emergency Contact (optional)</Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Name" fullWidth size="small" {...register('emergencyContact.name')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Relationship" fullWidth size="small" {...register('emergencyContact.relationship')} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Phone" fullWidth size="small" {...register('emergencyContact.phone')} />
                  </Grid>

                </Grid>

              </Box>
            )}

          </Box>

          {/* ── Footer ── */}
          <Box sx={{
            px: 3, py: 2, flexShrink: 0,
            borderTop: 1, borderColor: 'divider',
            display: 'flex', justifyContent: 'flex-end', gap: 1.5,
            backgroundColor: 'background.paper',
          }}>
            <Button variant="outlined" onClick={handleClose} disabled={saving}>Cancel</Button>
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
