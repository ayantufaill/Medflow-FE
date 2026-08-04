import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from '@mui/material';
import {
  PersonOutline as PersonOutlineIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import SectionContainer from '../practice-onboarding/practice-info/SectionContainer';
import FormInputLabel from '../practice-onboarding/practice-info/FormInputLabel';

// ─── Styles matching Practice Onboarding UI ───────────────────────────────────

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

// ─── Static data ──────────────────────────────────────────────────────────────

const ONLINE_SPECIALTIES = [
  'General dentist',
  'Pediatric dentist',
  'Prosthodontics',
  'Orthodontist',
  'Cosmetic dentist',
  'Hygienist',
];

// Cleaned core appointment types (no more dummy custom1, custom2... custom10)
const STANDARD_APPT_LIST = [
  { key: 'exam', label: 'Exam', defaultEnabled: false, defaultDuration: 60 },
  { key: 'emergency', label: 'Emergency', defaultEnabled: true, defaultDuration: 60 },
  { key: 'cleaning', label: 'Cleaning', defaultEnabled: false, defaultDuration: 60 },
  { key: 'treatment', label: 'Treatment', defaultEnabled: false, defaultDuration: 60 },
  { key: 'other', label: 'Other', defaultEnabled: false, defaultDuration: 60 },
  { key: 'onlineConsult', label: 'Online Consult', defaultEnabled: true, defaultDuration: 30 },
  { key: 'npExam', label: 'NP Exam', defaultEnabled: true, defaultDuration: 60 },
];

const STANDARD_APPT_KEYS = STANDARD_APPT_LIST.map((item) => item.key);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitialCustoms = (provider) => {
  const apptTypes = provider?.onlineProvider?.appointmentTypes || {};
  const customs = [];
  Object.keys(apptTypes).forEach((key) => {
    if (!STANDARD_APPT_KEYS.includes(key)) {
      // Filter out untouched legacy custom2...custom10 dummy placeholders from old data
      if (/^custom\d+$/.test(key) && !apptTypes[key]?.label) return;
      customs.push({
        key,
        label: apptTypes[key]?.label || key.replace(/^custom_\d+_/, ''),
        isCustom: true,
      });
    }
  });
  return customs;
};

const buildDefaults = (provider, initialCustoms) => {
  const online = provider?.onlineProvider || {};
  const apptTypes = online.appointmentTypes || {};

  const defaultAppt = (key, defaultEnabled = false, defaultDuration = 60, label = null) => ({
    enabled: apptTypes[key]?.enabled ?? defaultEnabled,
    duration: apptTypes[key]?.duration ?? defaultDuration,
    ...(label ? { label: apptTypes[key]?.label || label } : {}),
  });

  const defaults = {
    firstName: provider?.userId?.firstName || provider?.firstName || '',
    lastName: provider?.userId?.lastName || provider?.lastName || '',
    middleName: provider?.middleName || '',
    title: provider?.title || '',
    specialties: online.specialties || [],
    description: online.description || provider?.description || '',
    enableOnlineScheduling: online.enableOnlineScheduling ?? true,
    allowDoubleBooking: online.allowDoubleBooking ?? true,
    appointmentTypes: {},
  };

  STANDARD_APPT_LIST.forEach((item) => {
    defaults.appointmentTypes[item.key] = defaultAppt(item.key, item.defaultEnabled, item.defaultDuration);
  });

  initialCustoms.forEach((item) => {
    defaults.appointmentTypes[item.key] = defaultAppt(item.key, true, 60, item.label);
  });

  return defaults;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ApptTypeRow = ({ item, control, watch, onRemove }) => {
  const enabled = watch(`appointmentTypes.${item.key}.enabled`);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.25 }}>
      <Controller
        name={`appointmentTypes.${item.key}.enabled`}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            sx={{ m: 0, flex: 1 }}
            control={
              <Checkbox
                size="small"
                checked={!!field.value}
                onChange={field.onChange}
                sx={{ p: 0.5, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }}
              />
            }
            label={
              <Typography
                sx={{ fontSize: '0.85rem', color: field.value ? '#111827' : '#6b7280', fontWeight: field.value ? 600 : 400, ml: 0.5 }}
              >
                {item.label}
              </Typography>
            }
          />
        )}
      />
      <Box sx={{ minWidth: item.isCustom ? 100 : 80, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#8a8f9c', fontWeight: 500 }}>Min</Typography>
        <Controller
          name={`appointmentTypes.${item.key}.duration`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              disabled={!enabled}
              inputProps={{ min: 5, max: 480, style: { padding: '4px 6px', textAlign: 'center', fontSize: '0.8rem' } }}
              sx={{
                width: 55,
                '& .MuiOutlinedInput-root': {
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: enabled ? '#fff' : '#f9fafb',
                  '& fieldset': { borderColor: enabled ? '#d1d5db' : '#e5e7eb' },
                  '&:hover fieldset': { borderColor: enabled ? '#9ca3af' : '#e5e7eb' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
                }
              }}
            />
          )}
        />
        {item.isCustom && (
          <Box
            component="span"
            onClick={() => onRemove(item.key)}
            title="Delete custom appointment type"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ef4444',
              p: 0.25,
              borderRadius: '4px',
              '&:hover': { bgcolor: '#fef2f2' }
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: '18px' }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Main form ────────────────────────────────────────────────────────────────

const OnlineProviderForm = ({ formId, provider, onSubmit }) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(provider?.onlineProvider?.photoUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Custom Appointment Types state
  const [customItems, setCustomItems] = useState(() => getInitialCustoms(provider));
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: buildDefaults(provider, customItems),
  });

  const selectedSpecialties = watch('specialties') || [];

  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  };

  const toggleSpecialty = (spec) => {
    const current = selectedSpecialties;
    const next = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    setValue('specialties', next);
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    const key = `custom_${Date.now()}_${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const newItem = { key, label: trimmed, isCustom: true };
    setCustomItems((prev) => [...prev, newItem]);

    setValue(`appointmentTypes.${key}.enabled`, true);
    setValue(`appointmentTypes.${key}.duration`, 60);
    setValue(`appointmentTypes.${key}.label`, trimmed);

    setCustomName('');
    setIsAddingCustom(false);
  };

  const handleRemoveCustom = (keyToRemove) => {
    setCustomItems((prev) => prev.filter((c) => c.key !== keyToRemove));
    setValue(`appointmentTypes.${keyToRemove}`, undefined);
  };

  const submit = (data) => {
    const validKeys = [...STANDARD_APPT_LIST.map((i) => i.key), ...customItems.map((c) => c.key)];
    const cleanAppts = {};
    Object.keys(data.appointmentTypes || {}).forEach((k) => {
      if (validKeys.includes(k) && data.appointmentTypes[k]) {
        cleanAppts[k] = data.appointmentTypes[k];
      }
    });

    onSubmit({
      onlineProvider: {
        ...data,
        appointmentTypes: cleanAppts,
        photoUrl: photoPreview,
      },
    });
  };

  // Divide all appointment items across 3 columns evenly
  const allApptItems = [...STANDARD_APPT_LIST, ...customItems];
  const col1Size = Math.ceil(allApptItems.length / 3);
  const col2Size = Math.ceil((allApptItems.length - col1Size) / 2);
  const col1 = allApptItems.slice(0, col1Size);
  const col2 = allApptItems.slice(col1Size, col1Size + col2Size);
  const col3 = allApptItems.slice(col1Size + col2Size);

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(submit)} noValidate sx={{ pb: 1 }}>

      {/* Section 1: Online Provider Profile */}
      <SectionContainer title="Online Provider Profile" icon={PersonOutlineIcon}>
        {/* Photo upload / management area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            sx={{
              width: 110, height: 110, border: `2px dashed ${isDragging ? '#3b82f6' : '#cbd5e1'}`,
              borderRadius: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', mb: 1.5,
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: '#3b82f6', bgcolor: '#eff6ff' },
            }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Provider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <CloudUploadOutlinedIcon sx={{ fontSize: 44, color: '#9ca3af' }} />
            )}
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePhotoFile(f);
              e.target.value = '';
            }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>
            Provider Profile Photo
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', mt: 0.5 }}>
            {photoPreview ? 'Click on photo to change or use buttons below' : 'Drag your photo here or click on the box to upload'}
          </Typography>

          {/* Change and Delete photo action buttons */}
          {photoPreview && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  height: '30px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': { bgcolor: '#eff6ff', borderColor: '#2563eb' }
                }}
              >
                Change Photo
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => setPhotoPreview(null)}
                sx={{
                  height: '30px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                Delete Photo
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="First Name" required />
            <TextField fullWidth sx={commonInputStyles} placeholder="Enter First Name" {...register('firstName', { required: 'Required' })} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Last Name" required />
            <TextField fullWidth sx={commonInputStyles} placeholder="Enter Last Name" {...register('lastName', { required: 'Required' })} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Middle Name" />
            <TextField fullWidth sx={commonInputStyles} placeholder="Enter Middle Name" {...register('middleName')} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormInputLabel label="Professional Title" />
            <TextField fullWidth sx={commonInputStyles} placeholder="e.g. DMD, DDS" {...register('title')} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FormInputLabel label="Public Description & Bio" />
            <TextField fullWidth multiline rows={4} placeholder="Enter description shown on public scheduling page" sx={multilineInputStyles}
              {...register('description')} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormInputLabel label="Online Specialties Displayed" />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              {ONLINE_SPECIALTIES.map((spec) => {
                const checked = selectedSpecialties.includes(spec);
                return (
                  <FormControlLabel
                    key={spec}
                    sx={{ m: 0 }}
                    control={
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleSpecialty(spec)}
                        sx={{ p: 0.5, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.85rem', color: checked ? '#111827' : '#475569', fontWeight: checked ? 600 : 400, ml: 0.5 }}>
                        {spec}
                      </Typography>
                    }
                  />
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Section 2: Scheduling Preferences & Appointment Types */}
      <SectionContainer title="Scheduling & Appointment Types" icon={CalendarTodayOutlinedIcon}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Controller name="enableOnlineScheduling" control={control} render={({ field }) => (
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox size="small" checked={!!field.value} onChange={field.onChange}
                      sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: field.value ? 600 : 500, ml: 0.5 }}>
                      Enable Online Scheduling
                    </Typography>
                  }
                />
              )} />
              <Controller name="allowDoubleBooking" control={control} render={({ field }) => (
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox size="small" checked={!!field.value} onChange={field.onChange}
                      sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: field.value ? 600 : 500, ml: 0.5 }}>
                      Allow Double Booking
                    </Typography>
                  }
                />
              )} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <FormInputLabel label="Available Online Appointment Types & Duration" />
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingCustom(true)}
                sx={{
                  height: '28px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': { bgcolor: '#eff6ff', borderColor: '#2563eb' }
                }}
              >
                Add Custom
              </Button>
            </Box>

            {/* Inline input for adding custom appointment types */}
            {isAddingCustom && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, mb: 1.5, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Enter custom appointment type name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  sx={{ flex: 1, minWidth: 200, ...commonInputStyles }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustom();
                    }
                  }}
                  autoFocus
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!customName.trim()}
                    onClick={handleAddCustom}
                    sx={{ height: '32px', borderRadius: '6px', bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 600, px: 2 }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    onClick={() => { setIsAddingCustom(false); setCustomName(''); }}
                    sx={{ height: '32px', borderRadius: '6px', textTransform: 'none', fontWeight: 500, borderColor: '#d1d5db' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0, p: 2.5, bgcolor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              {/* Column 1 */}
              <Box sx={{ flex: 1, pr: { md: 2 } }}>
                {col1.map((item) => (
                  <ApptTypeRow key={item.key} item={item} control={control} watch={watch} onRemove={handleRemoveCustom} />
                ))}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: '#e5e7eb', display: { xs: 'none', md: 'block' } }} />

              {/* Column 2 */}
              <Box sx={{ flex: 1, px: { md: 2 } }}>
                {col2.map((item) => (
                  <ApptTypeRow key={item.key} item={item} control={control} watch={watch} onRemove={handleRemoveCustom} />
                ))}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: '#e5e7eb', display: { xs: 'none', md: 'block' } }} />

              {/* Column 3 */}
              <Box sx={{ flex: 1, pl: { md: 2 } }}>
                {col3.map((item) => (
                  <ApptTypeRow key={item.key} item={item} control={control} watch={watch} onRemove={handleRemoveCustom} />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </SectionContainer>

    </Box>
  );
};

export default OnlineProviderForm;
