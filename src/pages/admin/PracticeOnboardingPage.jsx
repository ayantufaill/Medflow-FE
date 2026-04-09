import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { Link as LinkIcon, Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { practiceInfoService } from '../../services/practice-info.service';
import { providerService } from '../../services/provider.service';
import { userService } from '../../services/user.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useRoles } from '../../hooks/queries/useRoles';
import { useUsersByRole } from '../../hooks/queries/useUsers';
import { roomService } from '../../services/room.service';
import { fontSize, fontWeight } from '../../constants/styles';

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Practice Info' },
  { label: 'Providers' },
  { label: 'Users' },
  { label: 'Opening Hours' },
  { label: 'Schedule Setup' },
  { label: 'Billing Configuration' },
];

const NAVY = '#1976d2';
const GRAY_INACTIVE = '#d0d5dd';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC',
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'New Zealand',
  'Ireland',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Switzerland',
  'Austria',
  'Belgium',
  'Portugal',
  'Poland',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Singapore',
  'Malaysia',
  'Philippines',
  'United Arab Emirates',
  'Saudi Arabia',
  'South Africa',
  'Brazil',
  'Mexico',
  'Argentina',
];

const SOCIAL_MEDIA_FIELDS = [
  { name: 'facebookUrl', label: 'Facebook Page URL' },
  { name: 'googleBusinessUrl', label: 'Google Business URL' },
  { name: 'linkedInUrl', label: 'LinkedIn URL' },
  { name: 'twitterUrl', label: 'Twitter Page URL' },
  { name: 'instagramUrl', label: 'Instagram Page URL' },
  { name: 'yelpUrl', label: 'Yelp URL' },
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const WizardProgressBar = ({ activeStep }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 5,
        overflowX: 'auto',
        pb: 1,
        fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      }}
    >
      {STEPS.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const circleColor = isCompleted || isActive ? '#1976d2' : GRAY_INACTIVE;
        const textColor = isCompleted || isActive ? '#fff' : '#9aa5b4';

        return (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* Connector line before this step */}
            {index > 0 && (
              <Box
                sx={{
                  height: 2,
                  width: { xs: 24, sm: 40, md: 56 },
                  bgcolor: index <= activeStep ? '#1976d2' : GRAY_INACTIVE,
                  mx: 0,
                }}
              />
            )}

            {/* Step circle + label */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: textColor, fontWeight: 700, fontSize: fontSize.xs }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: isCompleted || isActive ? '#1976d2' : '#9aa5b4',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: fontSize.xs,
                  textAlign: 'center',
                  maxWidth: 72,
                  lineHeight: 1.2,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {step.label}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

// ─── Section Heading ──────────────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      color: '#1976d2',
      fontWeight: fontWeight.bold,
      mb: 2,
      mt: 1,
      fontSize: fontSize.md,
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    }}
  >
    {children}
  </Typography>
);

// ─── Bottom Action Buttons ────────────────────────────────────────────────────

const WizardActions = ({ onFinishLater, onNext, nextLabel = 'Next', loading = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
    <Button
      variant="outlined"
      onClick={onFinishLater}
      disabled={loading}
      size="small"
      sx={{ 
        borderColor: '#1976d2', 
        color: '#1976d2', 
        '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25,118,210,0.04)' },
        fontSize: '0.8rem',
        px: 2,
        py: 0.5
      }}
    >
      Finish Later
    </Button>
    <Button
      variant="contained"
      onClick={onNext}
      disabled={loading}
      size="small"
      sx={{
        bgcolor: '#1976d2',
        '&:hover': { bgcolor: '#1565c0' },
        minWidth: 100,
        fontSize: '0.8rem',
        px: 2.5,
        py: 0.6,
      }}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
    >
      {loading ? 'Saving...' : nextLabel}
    </Button>
  </Box>
);

// ─── Step 1: Practice Info ────────────────────────────────────────────────────

const Step1PracticeInfo = ({ onNext, onFinishLater }) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [phoneCountry, setPhoneCountry] = useState(null);
  const [faxCountry, setFaxCountry] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      practiceName: '',
      phone: '',
      email: '',
      website: '',
      businessRegistrationNumber: '',
      businessLegalName: '',
      fax: '',
      address: {
        street: '',
        country: 'United States',
        state: '',
        city: '',
        postalCode: '',
      },
      timezone: 'America/New_York',
      logo: null,
      facebookUrl: '',
      googleBusinessUrl: '',
      linkedInUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      yelpUrl: '',
    },
  });

  const sanitize = (v) => (typeof v === 'string' ? v.trim() : v);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        practiceName: sanitize(data.practiceName),
        phone: data.phone ? `+${sanitize(data.phone)}` : undefined,
        email: sanitize(data.email) || undefined,
        website: sanitize(data.website) || undefined,
        businessRegistrationNumber: sanitize(data.businessRegistrationNumber) || undefined,
        businessLegalName: sanitize(data.businessLegalName) || undefined,
        fax: data.fax ? `+${sanitize(data.fax)}` : undefined,
        address: {
          line1: sanitize(data.address?.street) || undefined,
          city: sanitize(data.address?.city) || undefined,
          state: sanitize(data.address?.state) || undefined,
          postalCode: sanitize(data.address?.postalCode) || undefined,
          country: sanitize(data.address?.country) || undefined,
        },
        timezone: data.timezone || 'UTC',
        logo: data.logo instanceof File ? data.logo : undefined,
        facebookUrl: sanitize(data.facebookUrl) || undefined,
        googleBusinessUrl: sanitize(data.googleBusinessUrl) || undefined,
        linkedInUrl: sanitize(data.linkedInUrl) || undefined,
        twitterUrl: sanitize(data.twitterUrl) || undefined,
        instagramUrl: sanitize(data.instagramUrl) || undefined,
        yelpUrl: sanitize(data.yelpUrl) || undefined,
      };

      const created = await practiceInfoService.createPracticeInfo(payload);
      showSnackbar('Practice information saved successfully!', 'success');
      onNext(created?._id || created?.id);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to save practice info.';
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e, rhfOnChange) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoPreview(null);
      rhfOnChange(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Logo must be under 5 MB', 'error');
      return;
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar('Only JPEG, PNG, GIF, or WebP images are allowed', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
    rhfOnChange(file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionHeading>1. Practice Information</SectionHeading>

      <Grid container spacing={2.5} sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {/* Row 1: Practice Name | Phone */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Practice Name"
            // {...register('practiceName', { required: 'Practice name is required' })}
            {...register('practiceName')}
            error={!!errors.practiceName}
            helperText={errors.practiceName?.message}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  '& .react-tel-input': { 
                    width: '100% !important',
                    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                    fontSize: fontSize.sm,
                  },
                  '& .form-control': { 
                    width: '100% !important',
                    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                    fontSize: fontSize.sm,
                    height: '42px',
                    paddingTop: '10px',
                    paddingBottom: '6px',
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                      boxShadow: 'none !important',
                    },
                    '&::before': {
                      borderBottom: 'none !important',
                    },
                    '&::after': {
                      borderBottom: 'none !important',
                    },
                  },
                  '& .react-tel-input .flag-dropdown': {
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    backgroundColor: 'transparent !important',
                    height: '42px',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                      backgroundColor: 'transparent !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                      backgroundColor: 'transparent !important',
                    },
                    '&::before': {
                      borderBottom: 'none !important',
                    },
                    '&::after': {
                      borderBottom: 'none !important',
                    },
                  },
                  '& .react-tel-input .selected-flag': {
                    width: '48px !important',
                    backgroundColor: 'transparent !important',
                    height: '42px',
                    border: 'none !important',
                    boxShadow: 'none !important',
                  },
                  '& .react-tel-input .form-control': {
                    paddingLeft: '56px',
                  },
                  '& .react-tel-input input': {
                    height: '42px',
                    paddingTop: '10px',
                    paddingBottom: '6px',
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                    },
                  },
                  '& .react-tel-input input:focus': {
                    border: 'none !important',
                    borderBottom: '2px solid #1a3a6b !important',
                    boxShadow: 'none !important',
                  },
                  '& .react-tel-input .highlight': {
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                  },
                }}>
                  <PhoneInput
                    {...field}
                    country="us"
                    enableSearch
                    specialLabel="Phone Number"
                    disableSearchIcon={false}
                    searchPlaceholder="Search country"
                    onChange={(value, country) => { field.onChange(value); setPhoneCountry(country); }}
                    value={field.value || ''}
                    inputStyle={{ 
                      width: '100%', 
                      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                      fontSize: fontSize.sm,
                      height: '42px',
                      border: 'none !important',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                      borderRadius: 0,
                      outline: 'none !important',
                      background: 'transparent !important',
                      WebkitTapHighlightColor: 'transparent !important',
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                </Box>
                {errors.phone && <FormHelperText error sx={{ mt: 0.5, mx: 1.75, fontSize: fontSize.xs }}>{errors.phone.message}</FormHelperText>}
              </Box>
            )}
          />
        </Grid>

        {/* Row 2: Email | Website */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Website"
            {...register('website')}
            error={!!errors.website}
            helperText={errors.website?.message}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>

        {/* Row 3: Business Registration Number | Business Legal Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Business Registration Number"
            {...register('businessRegistrationNumber')}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Business Legal Name"
            {...register('businessLegalName')}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>

        {/* Row 4: Fax (full width) */}
        <Grid size={12}>
          <Controller
            name="fax"
            control={control}
            render={({ field }) => (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  '& .react-tel-input': { 
                    width: '100% !important',
                    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                    fontSize: fontSize.sm,
                  },
                  '& .form-control': { 
                    width: '100% !important',
                    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                    fontSize: fontSize.sm,
                    height: '42px',
                    paddingTop: '10px',
                    paddingBottom: '6px',
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    backgroundColor: 'transparent !important',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                      boxShadow: 'none !important',
                    },
                    '&::before': {
                      borderBottom: 'none !important',
                    },
                    '&::after': {
                      borderBottom: 'none !important',
                    },
                  },
                  '& .react-tel-input .flag-dropdown': {
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    backgroundColor: 'transparent !important',
                    height: '42px',
                    boxShadow: 'none !important',
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                      backgroundColor: 'transparent !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                      backgroundColor: 'transparent !important',
                    },
                    '&::before': {
                      borderBottom: 'none !important',
                    },
                    '&::after': {
                      borderBottom: 'none !important',
                    },
                  },
                  '& .react-tel-input .selected-flag': {
                    width: '48px !important',
                    backgroundColor: 'transparent !important',
                    height: '42px',
                    border: 'none !important',
                    boxShadow: 'none !important',
                  },
                  '& .react-tel-input .form-control': {
                    paddingLeft: '56px',
                  },
                  '& .react-tel-input input': {
                    height: '42px',
                    paddingTop: '10px',
                    paddingBottom: '6px',
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                    borderRadius: 0,
                    outline: 'none !important',
                    '&:hover': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
                    },
                    '&:focus': {
                      borderBottom: '2px solid #1a3a6b !important',
                    },
                  },
                  '& .react-tel-input input:focus': {
                    border: 'none !important',
                    borderBottom: '2px solid #1a3a6b !important',
                    boxShadow: 'none !important',
                  },
                  '& .react-tel-input .highlight': {
                    border: 'none !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                  },
                }}>
                  <PhoneInput
                    {...field}
                    country="us"
                    enableSearch
                    specialLabel="Fax"
                    disableSearchIcon={false}
                    searchPlaceholder="Search country"
                    onChange={(value, country) => { field.onChange(value); setFaxCountry(country); }}
                    value={field.value || ''}
                    inputStyle={{ 
                      width: '100%', 
                      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
                      fontSize: fontSize.sm,
                      height: '42px',
                      border: 'none !important',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
                      borderRadius: 0,
                      outline: 'none !important',
                      background: 'transparent !important',
                      WebkitTapHighlightColor: 'transparent !important',
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                </Box>
                {errors.fax && <FormHelperText error sx={{ mt: 0.5, mx: 1.75, fontSize: fontSize.xs }}>{errors.fax.message}</FormHelperText>}
              </Box>
            )}
          />
        </Grid>
      </Grid>

      {/* Address Section */}
      <Box sx={{ mt: 4, mb: 1 }}>
        <SectionHeading>Address</SectionHeading>
      </Box>

      <Grid container spacing={2.5} sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {/* Row 1: Street | Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Street"
            {...register('address.street')}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Country</InputLabel>
            <Controller
              name="address.country"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label="Country" 
                  value={field.value || ''}
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>{c}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* Row 2: State | City */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>State</InputLabel>
            <Controller
              name="address.state"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label="State" 
                  value={field.value || ''}
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}><em>Select state</em></MenuItem>
                  {US_STATES.map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>{s}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="City"
            {...register('address.city')}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>

        {/* Row 3: Zip | Timezone */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Zip / Postal Code"
            {...register('address.postalCode')}
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            FormHelperTextProps={{ sx: { fontSize: fontSize.xs } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.timezone} variant="standard">
            <InputLabel>Time Zone</InputLabel>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  value={field.value || 'UTC'} 
                  onChange={(e) => field.onChange(e.target.value)} 
                  label="Time Zone"
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }
                  }}
                >
                  <MenuItem value="UTC" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>UTC (Coordinated Universal Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── North America ──────────</MenuItem>
                  <MenuItem value="America/New_York" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/New_York (Eastern Time)</MenuItem>
                  <MenuItem value="America/Chicago" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Chicago (Central Time)</MenuItem>
                  <MenuItem value="America/Denver" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Denver (Mountain Time)</MenuItem>
                  <MenuItem value="America/Los_Angeles" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Los_Angeles (Pacific Time)</MenuItem>
                  <MenuItem value="America/Phoenix" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Phoenix (Mountain Time - No DST)</MenuItem>
                  <MenuItem value="America/Anchorage" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Anchorage (Alaska Time)</MenuItem>
                  <MenuItem value="America/Honolulu" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Honolulu (Hawaii Time)</MenuItem>
                  <MenuItem value="America/Toronto" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Toronto (Eastern Time)</MenuItem>
                  <MenuItem value="America/Vancouver" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Vancouver (Pacific Time)</MenuItem>
                  <MenuItem value="America/Montreal" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Montreal (Eastern Time)</MenuItem>
                  <MenuItem value="America/Winnipeg" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Winnipeg (Central Time)</MenuItem>
                  <MenuItem value="America/Calgary" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Calgary (Mountain Time)</MenuItem>
                  <MenuItem value="America/Halifax" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Halifax (Atlantic Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── Central & South America ──────────</MenuItem>
                  <MenuItem value="America/Mexico_City" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Mexico_City (Central Time)</MenuItem>
                  <MenuItem value="America/Bogota" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Bogota (Colombia Time)</MenuItem>
                  <MenuItem value="America/Lima" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Lima (Peru Time)</MenuItem>
                  <MenuItem value="America/Santiago" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Santiago (Chile Time)</MenuItem>
                  <MenuItem value="America/Sao_Paulo" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Sao_Paulo (Brasilia Time)</MenuItem>
                  <MenuItem value="America/Buenos_Aires" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Buenos_Aires (Argentina Time)</MenuItem>
                  <MenuItem value="America/Caracas" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/Caracas (Venezuela Time)</MenuItem>
                  <MenuItem value="America/La_Paz" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>America/La_Paz (Bolivia Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── Europe ──────────</MenuItem>
                  <MenuItem value="Europe/London" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/London (Greenwich Mean Time)</MenuItem>
                  <MenuItem value="Europe/Paris" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Paris (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Berlin" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Berlin (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Rome" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Rome (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Madrid" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Madrid (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Amsterdam" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Amsterdam (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Brussels" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Brussels (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Vienna" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Vienna (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Zurich" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Zurich (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Stockholm" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Stockholm (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Copenhagen" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Copenhagen (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Oslo" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Oslo (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Dublin" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Dublin (Greenwich Mean Time)</MenuItem>
                  <MenuItem value="Europe/Lisbon" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Lisbon (Western European Time)</MenuItem>
                  <MenuItem value="Europe/Warsaw" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Warsaw (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Prague" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Prague (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Budapest" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Budapest (Central European Time)</MenuItem>
                  <MenuItem value="Europe/Athens" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Athens (Eastern European Time)</MenuItem>
                  <MenuItem value="Europe/Bucharest" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Bucharest (Eastern European Time)</MenuItem>
                  <MenuItem value="Europe/Sofia" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Sofia (Eastern European Time)</MenuItem>
                  <MenuItem value="Europe/Helsinki" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Helsinki (Eastern European Time)</MenuItem>
                  <MenuItem value="Europe/Moscow" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Europe/Moscow (Moscow Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── Asia ──────────</MenuItem>
                  <MenuItem value="Asia/Dubai" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Dubai (Gulf Standard Time)</MenuItem>
                  <MenuItem value="Asia/Riyadh" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Riyadh (Arabia Standard Time)</MenuItem>
                  <MenuItem value="Asia/Kuwait" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Kuwait (Arabia Standard Time)</MenuItem>
                  <MenuItem value="Asia/Qatar" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Qatar (Arabia Standard Time)</MenuItem>
                  <MenuItem value="Asia/Bahrain" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Bahrain (Arabia Standard Time)</MenuItem>
                  <MenuItem value="Asia/Muscat" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Muscat (Gulf Standard Time)</MenuItem>
                  <MenuItem value="Asia/Karachi" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Karachi (Pakistan Standard Time)</MenuItem>
                  <MenuItem value="Asia/Kolkata" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Kolkata (India Standard Time)</MenuItem>
                  <MenuItem value="Asia/Dhaka" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Dhaka (Bangladesh Standard Time)</MenuItem>
                  <MenuItem value="Asia/Colombo" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Colombo (Sri Lanka Time)</MenuItem>
                  <MenuItem value="Asia/Kathmandu" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Kathmandu (Nepal Time)</MenuItem>
                  <MenuItem value="Asia/Kabul" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Kabul (Afghanistan Time)</MenuItem>
                  <MenuItem value="Asia/Tehran" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Tehran (Iran Standard Time)</MenuItem>
                  <MenuItem value="Asia/Baghdad" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Baghdad (Arabia Standard Time)</MenuItem>
                  <MenuItem value="Asia/Jerusalem" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Jerusalem (Israel Standard Time)</MenuItem>
                  <MenuItem value="Asia/Beirut" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Beirut (Eastern European Time)</MenuItem>
                  <MenuItem value="Asia/Amman" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Amman (Eastern European Time)</MenuItem>
                  <MenuItem value="Asia/Damascus" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Damascus (Eastern European Time)</MenuItem>
                  <MenuItem value="Asia/Bangkok" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Bangkok (Indochina Time)</MenuItem>
                  <MenuItem value="Asia/Singapore" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Singapore (Singapore Time)</MenuItem>
                  <MenuItem value="Asia/Kuala_Lumpur" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Kuala_Lumpur (Malaysia Time)</MenuItem>
                  <MenuItem value="Asia/Jakarta" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Jakarta (Western Indonesia Time)</MenuItem>
                  <MenuItem value="Asia/Manila" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Manila (Philippine Time)</MenuItem>
                  <MenuItem value="Asia/Hong_Kong" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Hong_Kong (Hong Kong Time)</MenuItem>
                  <MenuItem value="Asia/Shanghai" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Shanghai (China Standard Time)</MenuItem>
                  <MenuItem value="Asia/Taipei" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Taipei (Taiwan Standard Time)</MenuItem>
                  <MenuItem value="Asia/Tokyo" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Tokyo (Japan Standard Time)</MenuItem>
                  <MenuItem value="Asia/Seoul" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Seoul (Korea Standard Time)</MenuItem>
                  <MenuItem value="Asia/Almaty" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Almaty (Kazakhstan Time)</MenuItem>
                  <MenuItem value="Asia/Tashkent" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Tashkent (Uzbekistan Time)</MenuItem>
                  <MenuItem value="Asia/Baku" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Baku (Azerbaijan Time)</MenuItem>
                  <MenuItem value="Asia/Yerevan" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Yerevan (Armenia Time)</MenuItem>
                  <MenuItem value="Asia/Tbilisi" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Asia/Tbilisi (Georgia Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── Africa ──────────</MenuItem>
                  <MenuItem value="Africa/Cairo" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Africa/Cairo (Eastern European Time)</MenuItem>
                  <MenuItem value="Africa/Johannesburg" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Africa/Johannesburg (South Africa Standard Time)</MenuItem>
                  <MenuItem value="Africa/Lagos" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Africa/Lagos (West Africa Time)</MenuItem>
                  <MenuItem value="Africa/Nairobi" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Africa/Nairobi (East Africa Time)</MenuItem>
                  <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>────────── Australia & Pacific ──────────</MenuItem>
                  <MenuItem value="Australia/Sydney" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Australia/Sydney (Australian Eastern Time)</MenuItem>
                  <MenuItem value="Australia/Melbourne" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Australia/Melbourne (Australian Eastern Time)</MenuItem>
                  <MenuItem value="Australia/Brisbane" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Australia/Brisbane (Australian Eastern Time)</MenuItem>
                  <MenuItem value="Australia/Perth" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Australia/Perth (Australian Western Time)</MenuItem>
                  <MenuItem value="Australia/Adelaide" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Australia/Adelaide (Australian Central Time)</MenuItem>
                  <MenuItem value="Pacific/Auckland" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Pacific/Auckland (New Zealand Time)</MenuItem>
                  <MenuItem value="Pacific/Honolulu" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Pacific/Honolulu (Hawaii Time)</MenuItem>
                </Select>
              )}
            />
            {errors.timezone && <FormHelperText sx={{ fontSize: fontSize.xs }}>{errors.timezone.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Logo Upload Section */}
      <Box sx={{ mt: 4, mb: 1 }}>
        <SectionHeading>Upload your office logo</SectionHeading>
        <Controller
          name="logo"
          control={control}
          render={({ field: { onChange } }) => (
            <Box sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  bgcolor: 'grey.50',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: NAVY },
                  minHeight: 140,
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    style={{ maxWidth: 200, maxHeight: 120, objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Please make sure the image does not exceed 500 x 500
                    </Typography>
                  </>
                )}
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => handleLogoChange(e, onChange)}
              />
              {logoPreview && (
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  sx={{ 
                    mt: 0.5,
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.4,
                    minHeight: 'auto',
                    height: 28
                  }}
                  onClick={() => { setLogoPreview(null); onChange(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                >
                  Remove logo
                </Button>
              )}
            </Box>
          )}
        />
      </Box>

      {/* Social Media Links Section */}
      <Box sx={{ mt: 4, mb: 1 }}>
        <SectionHeading>Social Media Links</SectionHeading>
      </Box>

      <Grid container spacing={2.5} sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {SOCIAL_MEDIA_FIELDS.map(({ name, label }) => (
          <Grid key={name} size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={label}
              {...register(name)}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'text.secondary' }}>
                    <LinkIcon fontSize="small" />
                  </Box>
                ),
                sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }
              }}
              InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            />
          </Grid>
        ))}
      </Grid>

      <WizardActions
        onFinishLater={onFinishLater}
        onNext={handleSubmit(onSubmit)}
        loading={loading}
      />
    </Box>
  );
};

// ─── Inline Provider Form ─────────────────────────────────────────────────────

const InlineProviderForm = ({ onSave, onCancel }) => {
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: { userId: '', npiNumber: '', licenseNumber: '', specialty: '', title: 'DDS' },
  });

  const { data: providerUsers = [], isLoading: usersLoading } = useUsersByRole('Provider', { limit: 100, status: 'active' });

  const TITLES = ['DDS', 'DMD', 'MD', 'DO', 'OD', 'RDH', 'Other'];

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        userId: data.userId || undefined,
        npiNumber: data.npiNumber || undefined,
        licenseNumber: data.licenseNumber || undefined,
        specialty: data.specialty ? [data.specialty] : undefined,
        title: data.title || undefined,
      };
      const created = await providerService.createProvider(payload);
      showSnackbar('Provider added successfully', 'success');
      reset();
      onSave(created);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to add provider', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Linked User (Provider role)</InputLabel>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label="Linked User (Provider role)" 
                  value={field.value || ''}
                  variant="standard"
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid rgba(0,0,0,0.42)' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(0,0,0,0.87)' }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}><em>Select user</em></MenuItem>
                  {usersLoading ? (
                    <MenuItem disabled sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>Loading...</MenuItem>
                  ) : (
                    providerUsers.map((u) => (
                      <MenuItem key={u._id || u.id} value={u._id || u.id} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
                        {u.firstName} {u.lastName} — {u.email}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Title</InputLabel>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label="Title" 
                  value={field.value || 'DDS'}
                  variant="standard"
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid rgba(0,0,0,0.42)' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(0,0,0,0.87)' }
                  }}
                >
                  {TITLES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>{t}</MenuItem>)}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="NPI Number" {...register('npiNumber')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="License Number" {...register('licenseNumber')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Specialty" placeholder="e.g. General Dentistry" {...register('specialty')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onCancel} 
          disabled={saving} 
          sx={{ 
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2,
            py: 0.5
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          sx={{ 
            textTransform: 'none', 
            bgcolor: '#1976d2', 
            '&:hover': { bgcolor: '#1565c0' },
            fontSize: '0.8rem',
            px: 2.5,
            py: 0.6,
            minHeight: 'auto'
          }}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : 'Apply'}
        </Button>
      </Box>
    </Box>
  );
};

// ─── Step 2: Providers ────────────────────────────────────────────────────────

const Step2Providers = ({ onNext, onFinishLater }) => {
  const { showSnackbar } = useSnackbar();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await providerService.getAllProviders(1, 100);
      setProviders(data?.providers || data?.data || []);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to load providers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProviders(); }, []);

  const getProviderName = (provider) => {
    if (provider.userId?.firstName || provider.userId?.lastName)
      return `${provider.userId.firstName || ''} ${provider.userId.lastName || ''}`.trim();
    if (provider.firstName || provider.lastName)
      return `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
    return provider.displayName || provider.name || 'Unknown Provider';
  };

  const handleProviderSaved = (created) => {
    setShowForm(false);
    loadProviders();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 3, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        <SectionHeading>2. Providers</SectionHeading>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize.sm }}>(Dentist, Hygienist or Specialist)</Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: fontSize.sm }}>Added Providers</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={32} /></Box>
      ) : (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
          {providers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No providers added yet.
            </Typography>
          ) : (
            providers.map((provider, i) => (
              <Box
                key={provider._id || provider.id || i}
                sx={{ px: 2, py: 1.25, borderBottom: i < providers.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}
              >
                <Typography variant="body2" color="primary">{getProviderName(provider)}</Typography>
              </Box>
            ))
          )}
        </Box>
      )}

      {showForm && (
        <InlineProviderForm onSave={handleProviderSaved} onCancel={() => setShowForm(false)} />
      )}

      {!showForm && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            onClick={() => setShowForm(true)}
            size="small"
            sx={{ 
              borderRadius: 20, 
              textTransform: 'none', 
              color: '#1976d2', 
              borderColor: '#1976d2', 
              px: 2, 
              py: 0.5,
              fontSize: '0.8rem',
              minHeight: 'auto',
              height: 32,
              '&:hover': { bgcolor: 'rgba(25,118,210,0.06)' } 
            }}
          >
            + Add Provider
          </Button>
          <Divider sx={{ flex: 1 }} />
        </Box>
      )}

      <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
    </Box>
  );
};

// ─── Inline User Form ─────────────────────────────────────────────────────────

const InlineUserForm = ({ onSave, onCancel, providers }) => {
  const { showSnackbar } = useSnackbar();
  const { data: allRoles = [] } = useRoles();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: { firstName: '', lastName: '', username: '', roles: [], email: '', providerId: '' },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        roles: data.roles,
        providerId: data.providerId || undefined,
      };
      const created = await userService.createUser(payload);
      showSnackbar('User added successfully', 'success');
      reset();
      onSave(created?.user || created);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to add user', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="First Name" {...register('firstName')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Last Name" {...register('lastName')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Username" {...register('username')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Roles</InputLabel>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  label="Roles"
                  variant="standard"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                    </Box>
                  )}
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid rgba(0,0,0,0.42)' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(0,0,0,0.87)' }
                  }}
                >
                  {allRoles.map((role) => (
                    <MenuItem key={role._id || role.id} value={role.name} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Email Address" type="email" {...register('email')} 
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Provider</InputLabel>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label="Provider" 
                  value={field.value || ''}
                  variant="standard"
                  sx={{ 
                    '& .MuiSelect-select': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInputLabel-root': { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" },
                    '& .MuiInput-underline:before': { borderBottom: '1px solid rgba(0,0,0,0.42)' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(0,0,0,0.87)' }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}><em>Select Provider</em></MenuItem>
                  {providers.map((p) => {
                    const name = p.userId?.firstName
                      ? `${p.userId.firstName} ${p.userId.lastName || ''}`.trim()
                      : p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : 'Unknown';
                    return (
                      <MenuItem key={p._id || p.id} value={p._id || p.id} sx={{ fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>{name}</MenuItem>
                    );
                  })}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onCancel} 
          disabled={saving} 
          sx={{ 
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2,
            py: 0.5
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          sx={{ 
            textTransform: 'none', 
            bgcolor: '#1976d2', 
            '&:hover': { bgcolor: '#1565c0' },
            fontSize: '0.8rem',
            px: 2.5,
            py: 0.6,
            minHeight: 'auto'
          }}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {saving ? 'Saving...' : 'Apply'}
        </Button>
      </Box>
    </Box>
  );
};

// ─── Step 3: Users ────────────────────────────────────────────────────────────

const Step3Users = ({ onNext, onFinishLater }) => {
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResult, providersResult] = await Promise.all([
        userService.getAllUsers(1, 100),
        providerService.getAllProviders(1, 100),
      ]);
      setUsers(usersResult?.users || []);
      setProviders(providersResult?.providers || providersResult?.data || []);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUserSaved = () => {
    setShowForm(false);
    loadData();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        <SectionHeading>3. Users</SectionHeading>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize.sm }}>(Front, Assistant or Manager)</Typography>
      </Box>

      <Box component="ul" sx={{ pl: 3, mb: 3, '& li': { mb: 0.5 }, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {[
          'Email address should be unique per user.',
          'The email is only used to set or reset a password. A personal email can be used.',
          'Once the users are added to the software, they will receive an email to set their password.',
          'Please make sure to include all users that would have access to your practice realm.',
          'Admin role allows the user to add/delete users and has access to all the pages and reports of the software (usually the office manager or owner).',
          'If the admin deactivates a user, they won\'t be able to login.',
        ].map((text, i) => (
          <Typography key={i} component="li" variant="body2" color="text.secondary" sx={{ fontSize: fontSize.sm }}>{text}</Typography>
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: fontSize.sm }}>Added Users</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={32} /></Box>
      ) : (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2, maxHeight: 320, overflowY: 'auto' }}>
          {users.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No users added yet.
            </Typography>
          ) : (
            users.map((user, i) => (
              <Box
                key={user._id || user.id || i}
                sx={{ px: 2, py: 1.25, borderBottom: i < users.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}
              >
                <Typography variant="body2" color="primary">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      )}

      {showForm && (
        <InlineUserForm onSave={handleUserSaved} onCancel={() => setShowForm(false)} providers={providers} />
      )}

      {!showForm && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            onClick={() => setShowForm(true)}
            size="small"
            sx={{ 
              borderRadius: 20, 
              textTransform: 'none', 
              color: '#1976d2', 
              borderColor: '#1976d2', 
              px: 2, 
              py: 0.5,
              fontSize: '0.8rem',
              minHeight: 'auto',
              height: 32,
              '&:hover': { bgcolor: 'rgba(25,118,210,0.06)' } 
            }}
          >
            + Add User
          </Button>
          <Divider sx={{ flex: 1 }} />
        </Box>
      )}

      <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
    </Box>
  );
};

// ─── Step 4: Opening Hours ────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_HOURS = {
  Monday:    { closed: true,  fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Tuesday:   { closed: false, fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Wednesday: { closed: false, fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Thursday:  { closed: false, fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Friday:    { closed: false, fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Saturday:  { closed: true,  fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
  Sunday:    { closed: true,  fromHour: '07', fromMin: '00', fromPeriod: 'AM', toHour: '04', toMin: '00', toPeriod: 'PM' },
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const TimeInput = ({ value, onChange }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* Hour */}
      <Box
        component="select"
        value={value.fromHour ?? value.hour}
        onChange={(e) => update(value.fromHour !== undefined ? 'fromHour' : 'hour', e.target.value)}
        style={{
          border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px',
          fontSize: 13, height: 26, background: '#f5f5f5', cursor: 'pointer',
          fontFamily: "'Manrope', 'Segoe UI', sans-serif",
        }}
      >
        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>:</Typography>
      {/* Minute */}
      <Box
        component="select"
        value={value.fromMin ?? value.min}
        onChange={(e) => update(value.fromMin !== undefined ? 'fromMin' : 'min', e.target.value)}
        style={{
          border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px',
          fontSize: 13, height: 26, background: '#f5f5f5', cursor: 'pointer',
          fontFamily: "'Manrope', 'Segoe UI', sans-serif",
        }}
      >
        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
      </Box>
      {/* AM/PM */}
      {['AM', 'PM'].map((period) => {
        const currentPeriod = value.fromPeriod ?? value.period;
        const isActive = currentPeriod === period;
        return (
          <Box
            key={period}
            component="button"
            type="button"
            onClick={() => update(value.fromPeriod !== undefined ? 'fromPeriod' : 'period', period)}
            style={{
              border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px',
              fontSize: 12, height: 26, cursor: 'pointer', fontWeight: isActive ? 700 : 400,
              background: isActive ? '#d0d7e6' : '#f5f5f5',
              color: isActive ? NAVY : '#555',
              fontFamily: "'Manrope', 'Segoe UI', sans-serif",
            }}
          >
            {period}
          </Box>
        );
      })}
    </Box>
  );
};

const Step4OpeningHours = ({ onNext, onFinishLater }) => {
  const [schedule, setSchedule] = useState(DEFAULT_HOURS);

  const updateDay = (day, field, val) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: val } }));

  const updateTime = (day, which, updated) => {
    // which = 'from' | 'to'
    if (which === 'from') {
      setSchedule((prev) => ({
        ...prev,
        [day]: { ...prev[day], fromHour: updated.fromHour, fromMin: updated.fromMin, fromPeriod: updated.fromPeriod },
      }));
    } else {
      setSchedule((prev) => ({
        ...prev,
        [day]: { ...prev[day], toHour: updated.toHour, toMin: updated.toMin, toPeriod: updated.toPeriod },
      }));
    }
  };

  return (
    <Box>
      <SectionHeading>4. Opening &amp; Scheduling Hours</SectionHeading>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, maxWidth: 620, fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        Your office opening and closing time including the hours reserved for administrative tasks such as morning huddle.
        This will update your opening and scheduling times.
      </Typography>

      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: fontWeight.semibold, letterSpacing: 0.5, mb: 1, display: 'block', fontSize: fontSize.xs }}>
        Weekdays
      </Typography>

      <Box>
        {DAYS.map((day) => {
          const row = schedule[day];
          return (
            <Box
              key={day}
              sx={{
                display: 'flex', alignItems: 'center', py: 0.75,
                gap: 2, minHeight: 36,
              }}
            >
              {/* Day name */}
              <Typography variant="body2" sx={{ width: 90, flexShrink: 0, color: 'text.primary', fontSize: fontSize.sm }}>
                {day}
              </Typography>

              {/* From */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 180 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: fontSize.sm }}>from:</Typography>
                {!row.closed && (
                  <TimeInput
                    value={{ fromHour: row.fromHour, fromMin: row.fromMin, fromPeriod: row.fromPeriod }}
                    onChange={(updated) => updateTime(day, 'from', updated)}
                  />
                )}
              </Box>

              {/* To */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 180 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: fontSize.sm }}>to:</Typography>
                {!row.closed && (
                  <TimeInput
                    value={{ fromHour: row.toHour, fromMin: row.toMin, fromPeriod: row.toPeriod }}
                    onChange={(updated) =>
                      setSchedule((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], toHour: updated.fromHour, toMin: updated.fromMin, toPeriod: updated.fromPeriod },
                      }))
                    }
                  />
                )}
              </Box>

              {/* Closed checkbox */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                <Box
                  component="input"
                  type="checkbox"
                  checked={row.closed}
                  onChange={(e) => updateDay(day, 'closed', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: NAVY, cursor: 'pointer' }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: row.closed ? NAVY : 'text.secondary', fontWeight: row.closed ? fontWeight.semibold : fontWeight.regular, fontSize: fontSize.sm }}
                >
                  closed
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
    </Box>
  );
};

// ─── Step 5: Schedule Setup ───────────────────────────────────────────────────

const START_HOUR = 7;
const END_HOUR = 18;
const SLOT_H = 28; // px per 30-min slot

const COLUMN_COLORS = ['#e8eaf6','#e8f5e9','#fff3e0','#fce4ec','#e0f7fa','#f3e5f5','#fffde7'];

const formatDayLabel = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

const Step5ScheduleSetup = ({ onNext, onFinishLater }) => {
  const { showSnackbar } = useSnackbar();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [savingRoom, setSavingRoom] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.getAllRooms(1, 50);
      setRooms(data?.rooms || data?.data || []);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRooms(); }, []);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;
    setSavingRoom(true);
    try {
      await roomService.createRoom({ name: newRoomName.trim(), isActive: true });
      showSnackbar('Operatory added', 'success');
      setNewRoomName('');
      setAddingRoom(false);
      loadRooms();
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to add operatory', 'error');
    } finally {
      setSavingRoom(false);
    }
  };

  const timeSlots = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    timeSlots.push({ label: `${h > 12 ? h - 12 : h}${h < 12 ? 'am' : 'pm'}`, key: `${h}:00` });
    timeSlots.push({ label: '', key: `${h}:30` });
  }

  const prevDay = () => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const nextDay = () => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });

  const displayRooms = rooms.length > 0
    ? rooms
    : [{ _id: 'op1', name: 'Operatory 1' }, { _id: 'op2', name: 'Operatory 2' }, { _id: 'op3', name: 'Operatory 3' }];

  return (
    <Box>
      <SectionHeading>5. Schedule Setup</SectionHeading>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 620, fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        Your operatories and providers working time. During which your office is open for patients.
        This will only affect your default schedule.
      </Typography>

      {/* + Add Operatory */}
      {addingRoom ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <TextField
            placeholder="Operatory name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
            autoFocus
            variant="standard"
            InputLabelProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            InputProps={{ sx: { fontSize: fontSize.sm, fontFamily: "'Manrope', 'Segoe UI', sans-serif" } }}
            sx={{ width: 180 }}
          />
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleAddRoom} 
            disabled={savingRoom}
            sx={{ 
              textTransform: 'none', 
              bgcolor: '#1976d2', 
              '&:hover': { bgcolor: '#1565c0' },
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              minHeight: 'auto',
              height: 32
            }}>
            {savingRoom ? <CircularProgress size={16} color="inherit" /> : 'Save'}
          </Button>
          <Button 
            size="small" 
            onClick={() => setAddingRoom(false)} 
            sx={{ 
              textTransform: 'none',
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              color: '#1976d2'
            }}>
            Cancel
          </Button>
          <Divider sx={{ flex: 1 }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            onClick={() => setAddingRoom(true)}
            size="small"
            sx={{ 
              borderRadius: 20, 
              textTransform: 'none', 
              color: NAVY, 
              borderColor: NAVY, 
              px: 2,
              py: 0.5,
              fontSize: '0.8rem',
              minHeight: 'auto',
              height: 32
            }}
          >
            + Add Operatory
          </Button>
          <Divider sx={{ flex: 1 }} />
        </Box>
      )}

      {/* Hint */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mb: 1, fontSize: fontSize.xs }}>
        ⊕ Click and/or drag to create an operatory schedule entry
      </Typography>

      {/* Calendar grid */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', overflowX: 'auto' }}>
        {/* Day navigation header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: '#f0f4f8', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box component="button" type="button" onClick={prevDay}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: NAVY, padding: '0 4px', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>‹</Box>
          <Typography variant="body2" fontWeight={fontWeight.semibold} sx={{ color: NAVY, minWidth: 160, textAlign: 'center', fontSize: fontSize.sm }}>
            {formatDayLabel(selectedDate)}
          </Typography>
          <Box component="button" type="button" onClick={nextDay}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: NAVY, padding: '0 4px', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>›</Box>
        </Box>

        {/* Column headers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: `52px repeat(${displayRooms.length}, 1fr)`, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ bgcolor: '#f8f9fa' }} />
          {displayRooms.map((room, i) => (
            <Box key={room._id || room.id || i} sx={{ px: 1, py: 0.75, textAlign: 'center', bgcolor: '#f8f9fa', borderLeft: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" fontWeight={fontWeight.semibold} color="text.secondary" sx={{ fontSize: fontSize.xs }}>{room.name}</Typography>
            </Box>
          ))}
        </Box>

        {/* Time rows */}
        <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
          {timeSlots.map((slot, si) => (
            <Box
              key={slot.key}
              sx={{
                display: 'grid',
                gridTemplateColumns: `52px repeat(${displayRooms.length}, 1fr)`,
                minHeight: SLOT_H,
                borderBottom: slot.label ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              {/* Time label */}
              <Box sx={{ px: 0.5, pt: 0.25, textAlign: 'right', borderRight: '1px solid', borderColor: 'divider', bgcolor: '#fafafa' }}>
                {slot.label && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: fontSize.xs }}>{slot.label}</Typography>
                )}
              </Box>
              {/* Operatory cells */}
              {displayRooms.map((room, ci) => (
                <Box
                  key={room._id || ci}
                  sx={{
                    borderLeft: '1px solid', borderColor: 'divider',
                    bgcolor: si % 2 === 0 ? '#fff' : `${COLUMN_COLORS[ci % COLUMN_COLORS.length]}44`,
                    minHeight: SLOT_H,
                    '&:hover': { bgcolor: `${COLUMN_COLORS[ci % COLUMN_COLORS.length]}88`, cursor: 'pointer' },
                  }}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
    </Box>
  );
};

// ─── Step 6: Billing Configuration ───────────────────────────────────────────

const Step6BillingConfig = ({ onNext, onFinishLater }) => {
  const [outOfNetwork, setOutOfNetwork] = useState('no');
  const [assignment, setAssignment] = useState('in-assignment');
  const [billingProvider, setBillingProvider] = useState('default');

  return (
    <Box sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <SectionHeading>6. Billing Configuration</SectionHeading>

      {/* Question 1 */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: fontWeight.medium, fontSize: fontSize.sm }}>
          1- Are you out of network (aka fee of service-not contracted with any insurance companies)?
        </Typography>
        {[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }].map(({ value, label }) => (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              component="input" type="radio"
              name="outOfNetwork" value={value}
              checked={outOfNetwork === value}
              onChange={() => setOutOfNetwork(value)}
              style={{ width: 16, height: 16, accentColor: NAVY, cursor: 'pointer' }}
            />
            <Typography variant="body2" sx={{ fontSize: fontSize.sm }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Question 2 */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: fontWeight.medium, fontSize: fontSize.sm }}>
          2- Are you in-assignment (do you accept insurance payment directly to the office) or non-assignment
          (patient pays total amount and gets reimbursed by the insurance)?
        </Typography>
        {[
          { value: 'in-assignment', label: 'In-assignment' },
          { value: 'non-assignment', label: 'Non-assignment' },
        ].map(({ value, label }) => (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              component="input" type="radio"
              name="assignment" value={value}
              checked={assignment === value}
              onChange={() => setAssignment(value)}
              style={{ width: 16, height: 16, accentColor: NAVY, cursor: 'pointer' }}
            />
            <Typography variant="body2" sx={{ color: assignment === value ? 'primary.main' : 'text.primary', fontSize: fontSize.sm }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Question 3 */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <Typography variant="body2" fontWeight={fontWeight.medium} sx={{ fontSize: fontSize.sm }}>3- Setup Billing Provider</Typography>
          <Typography variant="caption" sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'text.disabled', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSize.xs, flexShrink: 0, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>i</Typography>
        </Box>
        {[
          { value: 'default', label: 'Default Provider' },
          { value: 'treating', label: 'Treating Provider' },
          { value: 'business', label: 'Business Entity' },
        ].map(({ value, label }) => (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              component="input" type="radio"
              name="billingProvider" value={value}
              checked={billingProvider === value}
              onChange={() => setBillingProvider(value)}
              style={{ width: 16, height: 16, accentColor: NAVY, cursor: 'pointer' }}
            />
            <Typography variant="body2" sx={{ color: billingProvider === value ? 'primary.main' : 'text.primary', fontSize: fontSize.sm }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <WizardActions onFinishLater={onFinishLater} onNext={onNext} nextLabel="Finish" />
    </Box>
  );
};

// ─── Coming Soon Placeholder ──────────────────────────────────────────────────

const ComingSoonStep = ({ stepNumber, title, onNext, onFinishLater }) => (
  <Box sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
    <SectionHeading>{stepNumber}. {title}</SectionHeading>
    <Paper variant="outlined" sx={{ py: 8, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: fontSize.lg }}>Coming Soon</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize.sm }}>This step will be available in a future update.</Typography>
    </Paper>
    <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
  </Box>
);

// ─── Main Wizard Page ─────────────────────────────────────────────────────────

const PracticeOnboardingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleFinishLater = () => navigate('/admin');
  const advance = () => setActiveStep((s) => s + 1);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1PracticeInfo onNext={advance} onFinishLater={handleFinishLater} />;
      case 1:
        return <Step2Providers onNext={advance} onFinishLater={handleFinishLater} />;
      case 2:
        return <Step3Users onNext={advance} onFinishLater={handleFinishLater} />;
      case 3:
        return <Step4OpeningHours onNext={advance} onFinishLater={handleFinishLater} />;
      case 4:
        return <Step5ScheduleSetup onNext={advance} onFinishLater={handleFinishLater} />;
      case 5:
        return <Step6BillingConfig onNext={() => navigate('/admin')} onFinishLater={handleFinishLater} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, py: 4, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Typography
        variant="h5"
        sx={{ color: NAVY, fontWeight: fontWeight.bold, mb: 1, textAlign: 'center', fontSize: fontSize.lg }}
      >
        Practice Onboarding
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4, fontSize: fontSize.sm }}
      >
        Complete the steps below to set up your practice.
      </Typography>

      <WizardProgressBar activeStep={activeStep} />

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 2.5, sm: 4 },
        }}
      >
        {renderStepContent()}
      </Paper>
    </Box>
  );
};

export default PracticeOnboardingPage;