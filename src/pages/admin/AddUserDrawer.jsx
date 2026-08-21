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
import { useSnackbar }        from '../../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { createUser } from '../../store/slices/userSlice';
import { COLORS } from '../../constants/colors';

import adduserIcon from '../../assets/usermanagement icons/adduser1.svg';
import personalInfoIcon from '../../assets/usermanagement icons/personalinformation.svg';
import assignRolesIcon from '../../assets/usermanagement icons/assignroles.svg';

import CardWrapper from '../../components/admin/AddUserDrawer/CardWrapper';
import PersonalInformationForm from '../../components/admin/AddUserDrawer/PersonalInformationForm';
import AssignRoles from '../../components/admin/AddUserDrawer/AssignRoles';
import ProviderProfileForm from '../../components/admin/AddUserDrawer/ProviderProfileForm';
import PatientProfileForm from '../../components/admin/AddUserDrawer/PatientProfileForm';

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
  const dispatch = useDispatch();

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
      prev.includes(roleId) ? [] : [roleId]
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

      await dispatch(createUser(payload)).unwrap();
      showSnackbar('User created successfully', 'success');
      handleClose();
      onCreated();
    } catch (err) {
      if (err?.name === 'ConditionError') return;
      const msg = typeof err === 'string' ? err : 
        (err?.message || 'Failed to create user.');
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
            px: '25px', py: '16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: COLORS.SURFACE_TINT,
            borderBottom: `1px solid ${COLORS.BORDER}`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <img src={adduserIcon} alt="Add User" style={{ width: 20, height: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>Add User</Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: 'text.secondary' }}>
                  Core fields for everyone-role specific fields appear below
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} disabled={saving} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box ref={scrollBodyRef} sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, backgroundColor: COLORS.BACKGROUND }}>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
                {formError}
              </Alert>
            )}

            {/* Avatar preview */}
            <CardWrapper>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#2262EF', fontSize: '1rem', fontWeight: 700 }}>
                  {getInitials(firstName, lastName)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '20px', color: '#111' }}>
                    {[firstName, lastName].filter(Boolean).join(' ') || 'New User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Preview</Typography>
                </Box>
              </Box>
            </CardWrapper>

            {/* ══ SECTION 1 — Core User ══ */}
            <CardWrapper title="Personal Information" icon={personalInfoIcon}>
              <PersonalInformationForm 
                register={register} 
                errors={errors} 
                control={control} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
                showConfirm={showConfirm} 
                setShowConfirm={setShowConfirm} 
                password={password} 
                LANGUAGES={LANGUAGES} 
              />
            </CardWrapper>

            {/* ══ SECTION 2 — Role Assignment ══ */}
            <CardWrapper title="Assign Roles" icon={assignRolesIcon}>
              <AssignRoles 
                roles={roles} 
                selectedRoleIds={selectedRoleIds} 
                toggleRole={toggleRole} 
                saving={saving} 
              />
            </CardWrapper>

            {/* ══ SECTION 3 — Provider Profile ══ */}
            {showProviderSection && (
              <Box ref={providerSectionRef}>
              <CardWrapper title="Provider Profile">
                <ProviderProfileForm 
                  register={register} 
                  control={control} 
                  workingHours={workingHours} 
                  updateDay={updateDay} 
                  PROVIDER_TITLES={PROVIDER_TITLES} 
                />
              </CardWrapper>
              </Box>
            )}
            {/* ══ SECTIONS 4–7 — Patient Profile ══ */}
            {showPatientSection && (
              <Box ref={patientSectionRef}>
              <CardWrapper title="Patient Profile">
                <PatientProfileForm 
                  register={register} 
                  control={control} 
                  PATIENT_TITLES={PATIENT_TITLES} 
                  GENDERS={GENDERS} 
                  MARITAL_STATUSES={MARITAL_STATUSES} 
                  CONTACT_METHODS={CONTACT_METHODS} 
                  PROFILE_TYPES={PROFILE_TYPES} 
                />
              </CardWrapper>
              </Box>
            )}

          </Box>

          {/* ── Footer ── */}
          <Box sx={{
            px: '25px', py: '16px', flexShrink: 0,
            borderTop: `1px solid ${COLORS.BORDER}`,
            display: 'flex', justifyContent: 'flex-end', gap: 1.5,
            backgroundColor: 'white',
          }}>
            <Button variant="outlined" onClick={handleClose} disabled={saving} sx={{ borderRadius: 2, borderColor: '#d1d5db', color: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'transparent' } }}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || selectedRoleIds.length === 0}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ backgroundColor: '#2262EF', borderRadius: 2, '&:hover': { backgroundColor: '#1d4ed8' }, boxShadow: 'none' }}
            >
              Save
            </Button>
          </Box>

        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default AddUserDrawer;
