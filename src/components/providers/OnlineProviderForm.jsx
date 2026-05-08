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
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

// ─── Static data ──────────────────────────────────────────────────────────────

const ONLINE_SPECIALTIES = [
  'General dentist',
  'Pediatric dentist',
  'Prosthodontics',
  'Orthodontist',
  'Cosmetic dentist',
  'Hygienist',
];

const APPT_COL1 = [
  { key: 'exam',         label: 'Exam' },
  { key: 'emergency',    label: 'Emergency' },
  { key: 'cleaning',     label: 'Cleaning' },
  { key: 'treatment',    label: 'Treatment' },
  { key: 'other',        label: 'Other' },
  { key: 'onlineConsult',label: 'Online Consult' },
];

const APPT_COL2 = [
  { key: 'npExam',   label: 'NP Exam' },
  { key: 'custom2',  label: 'Custom2' },
  { key: 'custom3',  label: 'Custom3' },
  { key: 'custom4',  label: 'Custom4' },
  { key: 'custom5',  label: 'Custom5' },
];

const APPT_COL3 = [
  { key: 'custom6',  label: 'Custom 6' },
  { key: 'custom7',  label: 'Custom 7' },
  { key: 'custom8',  label: 'Custom 8' },
  { key: 'custom9',  label: 'Custom 9' },
  { key: 'custom10', label: 'Custom 10' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildDefaults = (provider) => {
  const online = provider?.onlineProvider || {};
  const apptTypes = online.appointmentTypes || {};

  const defaultAppt = (key, defaultEnabled = false, defaultDuration = 60) => ({
    enabled:  apptTypes[key]?.enabled  ?? defaultEnabled,
    duration: apptTypes[key]?.duration ?? defaultDuration,
  });

  return {
    firstName:            provider?.userId?.firstName || provider?.firstName || '',
    lastName:             provider?.userId?.lastName  || provider?.lastName  || '',
    middleName:           provider?.middleName || '',
    title:                provider?.title || '',
    specialties:          online.specialties || [],
    description:          online.description || provider?.description || '',
    enableOnlineScheduling: online.enableOnlineScheduling ?? true,
    allowDoubleBooking:   online.allowDoubleBooking ?? true,
    appointmentTypes: {
      exam:         defaultAppt('exam'),
      emergency:    defaultAppt('emergency', true),
      cleaning:     defaultAppt('cleaning'),
      treatment:    defaultAppt('treatment'),
      other:        defaultAppt('other'),
      onlineConsult:defaultAppt('onlineConsult', true, 30),
      npExam:       defaultAppt('npExam', true),
      custom2:      defaultAppt('custom2'),
      custom3:      defaultAppt('custom3'),
      custom4:      defaultAppt('custom4'),
      custom5:      defaultAppt('custom5'),
      custom6:      defaultAppt('custom6'),
      custom7:      defaultAppt('custom7'),
      custom8:      defaultAppt('custom8'),
      custom9:      defaultAppt('custom9'),
      custom10:     defaultAppt('custom10'),
    },
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

const ApptTypeRow = ({ item, control, watch }) => {
  const enabled = watch(`appointmentTypes.${item.key}.enabled`);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
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
                sx={{ p: 0.5, color: field.value ? 'primary.main' : 'text.disabled' }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ color: field.value ? 'primary.main' : 'text.primary', fontWeight: field.value ? 600 : 400 }}
              >
                {item.label}
              </Typography>
            }
          />
        )}
      />
      <Box sx={{ minWidth: 70 }}>
        <Typography variant="caption" color="text.disabled" display="block">Duration</Typography>
        <Controller
          name={`appointmentTypes.${item.key}.duration`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              disabled={!enabled}
              inputProps={{ min: 5, max: 480, style: { padding: '2px 6px', width: 50 } }}
              sx={{
                '& .MuiOutlinedInput-root': { backgroundColor: enabled ? 'white' : '#f5f5f5' },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

// ─── Main form ────────────────────────────────────────────────────────────────

const OnlineProviderForm = ({ formId, provider, onSubmit }) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(provider?.onlineProvider?.photoUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: buildDefaults(provider),
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
    handlePhotoFile(e.dataTransfer.files[0]);
  };

  const toggleSpecialty = (spec) => {
    const current = selectedSpecialties;
    const next = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    setValue('specialties', next);
  };

  const submit = (data) => onSubmit({ onlineProvider: data });

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(submit)} noValidate>

      {/* Photo upload */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{
            width: 120, height: 120, border: `2px dashed ${isDragging ? '#1a3a6b' : '#90caf9'}`,
            borderRadius: 1, backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', mb: 1,
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: '#1a3a6b' },
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Provider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <PersonIcon sx={{ fontSize: 60, color: '#90caf9' }} />
          )}
        </Box>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handlePhotoFile(e.target.files[0])} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Drag your photo here or click on the empty box to add your file.
        </Typography>
      </Box>

      <Grid container spacing={2}>

        {/* Row 1: First Name | Last Name | Middle Name */}
        <Grid size={4}>
          <Label required>First Name</Label>
          <TextField fullWidth size="small" {...register('firstName', { required: 'Required' })} />
        </Grid>
        <Grid size={4}>
          <Label required>Last Name</Label>
          <TextField fullWidth size="small" {...register('lastName', { required: 'Required' })} />
        </Grid>
        <Grid size={4}>
          <Label>Middle Name</Label>
          <TextField fullWidth size="small" {...register('middleName')} />
        </Grid>

        {/* Row 2: Title | Specialty checkboxes | Description */}
        <Grid size={3}>
          <Label>Title</Label>
          <TextField fullWidth size="small" {...register('title')} />
        </Grid>
        <Grid size={4}>
          <Label>Specialty</Label>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
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
                      sx={{ p: 0.5, color: checked ? 'primary.main' : undefined }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: checked ? 'primary.main' : 'text.primary' }}>
                      {spec}
                    </Typography>
                  }
                />
              );
            })}
          </Box>
        </Grid>
        <Grid size={5}>
          <Label>Description</Label>
          <TextField fullWidth size="small" multiline rows={5} placeholder="Enter Description"
            {...register('description')} />
        </Grid>

        {/* Online scheduling toggles */}
        <Grid size={12}>
          <Controller name="enableOnlineScheduling" control={control} render={({ field }) => (
            <FormControlLabel
              sx={{ display: 'block', mb: 0.5 }}
              control={
                <Checkbox size="small" checked={!!field.value} onChange={field.onChange}
                  sx={{ color: field.value ? 'primary.main' : undefined }} />
              }
              label={
                <Typography variant="body2" sx={{ color: field.value ? 'primary.main' : 'text.primary', fontWeight: field.value ? 600 : 400 }}>
                  Enable online scheduling
                </Typography>
              }
            />
          )} />
          <Controller name="allowDoubleBooking" control={control} render={({ field }) => (
            <FormControlLabel
              sx={{ display: 'block' }}
              control={
                <Checkbox size="small" checked={!!field.value} onChange={field.onChange}
                  sx={{ color: field.value ? 'primary.main' : undefined }} />
              }
              label={
                <Typography variant="body2" sx={{ color: field.value ? 'primary.main' : 'text.primary', fontWeight: field.value ? 600 : 400 }}>
                  Allow double booking
                </Typography>
              }
            />
          )} />
        </Grid>

        {/* Online Appointment Types */}
        <Grid size={12}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5 }}>
            Online Appointment Types
          </Typography>
          <Box sx={{ display: 'flex', gap: 0 }}>
            {/* Column 1 */}
            <Box sx={{ flex: 1, pr: 2 }}>
              {APPT_COL1.map((item) => (
                <ApptTypeRow key={item.key} item={item} control={control} watch={watch} />
              ))}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Column 2 */}
            <Box sx={{ flex: 1, px: 2 }}>
              {APPT_COL2.map((item) => (
                <ApptTypeRow key={item.key} item={item} control={control} watch={watch} />
              ))}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Column 3 */}
            <Box sx={{ flex: 1, pl: 2 }}>
              {APPT_COL3.map((item) => (
                <ApptTypeRow key={item.key} item={item} control={control} watch={watch} />
              ))}
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default OnlineProviderForm;
