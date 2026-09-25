import { useEffect, useMemo, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { practiceInfoValidations } from '../../validations/practiceInfoValidations';
import { US_STATES, STATE_CITIES } from '../../constants/usAddressData';
import { TIME_ZONES, STATE_TIME_ZONES } from '../../constants/timeZones';

const PracticeInfoForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  // State to track selected country data for phone validation
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryFax, setSelectedCountryFax] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: initialData || {
      practiceName: '',
      taxId: '',
      npiNumber: '',
      phone: '',
      fax: '',
      email: '',
      website: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
      },
      logo: null,
      timezone: 'Asia/Karachi',
      businessHours: {},
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        practiceName: initialData.practiceName || '',
        taxId: initialData.taxId || '',
        npiNumber: initialData.npiNumber || '',
        phone: initialData.phone || '',
        fax: initialData.fax || '',
        email: initialData.email || '',
        website: initialData.website || '',
        address: initialData.address || {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
        },
        logo: null,
        logoPath: initialData.logoPath || '',
        timezone: initialData.timezone || 'Asia/Karachi',
        businessHours: initialData.businessHours || {},
      });
      if (initialData.logoPath) {
        setLogoPreview(initialData.logoPath);
      }
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

  const selectedState = watch('address.state');
  const availableCities = STATE_CITIES[selectedState] || [];

  const timeZoneOptions = useMemo(() => {
    const stateZones = selectedState ? STATE_TIME_ZONES[selectedState] || [] : TIME_ZONES.map((tz) => tz.value);
    return TIME_ZONES.filter((tz) => new Set([...stateZones, 'Asia/Karachi']).has(tz.value));
  }, [selectedState]);

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const handleFormSubmit = (formData) => {
    const sanitizedData = {
      ...formData,
      practiceName: sanitizeValue(formData.practiceName),
      taxId: sanitizeValue(formData.taxId) || undefined,
      npiNumber: sanitizeValue(formData.npiNumber) || undefined,
      phone: formData.phone ? `+${sanitizeValue(formData.phone)}` : undefined,
      fax: formData.fax ? `+${sanitizeValue(formData.fax)}` : undefined,
      email: sanitizeValue(formData.email),
      website: sanitizeValue(formData.website) || undefined,
      address: {
        line1: sanitizeValue(formData.address?.line1),
        line2: sanitizeValue(formData.address?.line2) || undefined,
        city: sanitizeValue(formData.address?.city),
        state: sanitizeValue(formData.address?.state),
        postalCode: sanitizeValue(formData.address?.postalCode),
      },
      timezone: sanitizeValue(formData.timezone),
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Practice Name"
            {...register('practiceName', practiceInfoValidations.practiceName)}
            error={!!errors.practiceName}
            helperText={errors.practiceName?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Tax ID"
            {...register('taxId', practiceInfoValidations.taxId)}
            error={!!errors.taxId}
            helperText={errors.taxId?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="NPI Number"
            {...register('npiNumber', practiceInfoValidations.npiNumber)}
            error={!!errors.npiNumber}
            helperText={errors.npiNumber?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            rules={{
              ...practiceInfoValidations.phone,
              validate: (value) => {
                // If a country is selected and value exists, check length against format
                if (selectedCountry && value) {
                  const format = selectedCountry.format || '';
                  // Count the number of dots in the format (represents expected digits)
                  const requiredLength = (format.match(/\./g) || []).length;

                  if (value.length !== requiredLength) {
                    return 'Phone number is incomplete';
                  }
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Box>
                <Box
                  sx={{
                    width: '100%',
                    '& .react-tel-input': {
                      width: '100% !important',
                    },
                    '& .form-control': {
                      width: '100% !important',
                    },
                  }}
                >
                  <PhoneInput
                    {...field}
                    country={'us'}
                    enableSearch={true}
                    specialLabel="Phone Number"
                    disableSearchIcon={false}
                    searchPlaceholder="Search country"
                    onChange={(value, country, e, formattedValue) => {
                      field.onChange(value);
                      setSelectedCountry(country);
                    }}
                    value={field.value || ''}
                    inputStyle={{
                      width: '100%',
                      borderColor: errors.phone ? '#d32f2f' : undefined,
                    }}
                    buttonStyle={{
                      borderColor: errors.phone ? '#d32f2f' : undefined,
                    }}
                  />
                </Box>
                {errors.phone && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.phone.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="fax"
            control={control}
            rules={{
              ...practiceInfoValidations.fax,
              validate: (value) => {
                if (!value) return true; // Fax is optional
                // If a country is selected and value exists, check length against format
                if (selectedCountryFax && value) {
                  const format = selectedCountryFax.format || '';
                  const requiredLength = (format.match(/\./g) || []).length;

                  if (value.length !== requiredLength) {
                    return 'Fax number is incomplete';
                  }
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Box>
                <Box
                  sx={{
                    width: '100%',
                    '& .react-tel-input': {
                      width: '100% !important',
                    },
                    '& .form-control': {
                      width: '100% !important',
                    },
                  }}
                >
                  <PhoneInput
                    {...field}
                    country={'us'}
                    enableSearch={true}
                    disableSearchIcon={false}
                    specialLabel="Fax Number"
                    searchPlaceholder="Search country"
                    onChange={(value, country, e, formattedValue) => {
                      field.onChange(value);
                      setSelectedCountryFax(country);
                    }}
                    value={field.value || ''}
                    inputStyle={{
                      width: '100%',
                      borderColor: errors.fax ? '#d32f2f' : undefined,
                    }}
                    buttonStyle={{
                      borderColor: errors.fax ? '#d32f2f' : undefined,
                    }}
                  />
                </Box>
                {errors.fax && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.fax.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email', practiceInfoValidations.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Website"
            {...register('website', practiceInfoValidations.website)}
            error={!!errors.website}
            helperText={errors.website?.message}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Address Line 1"
            {...register(
              'address.line1',
              practiceInfoValidations.address.line1
            )}
            error={!!errors.address?.line1}
            helperText={errors.address?.line1?.message}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Address Line 2"
            {...register(
              'address.line2',
              practiceInfoValidations.address.line2
            )}
            error={!!errors.address?.line2}
            helperText={errors.address?.line2?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={!!errors.address?.state}>
            <InputLabel>State</InputLabel>
            <Controller
              name="address.state"
              control={control}
              rules={practiceInfoValidations.address.state}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('address.city', '');
                  }}
                  label="State"
                >
                  <MenuItem value="" disabled>
                    Select State
                  </MenuItem>
                  {US_STATES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.address?.state && (
              <FormHelperText>{errors.address.state.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={!!errors.address?.city}>
            <InputLabel>City</InputLabel>
            <Controller
              name="address.city"
              control={control}
              rules={practiceInfoValidations.address.city}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ''}
                  disabled={!selectedState}
                  label="City"
                >
                  <MenuItem value="" disabled>
                    Select City
                  </MenuItem>
                  {availableCities.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.address?.city && (
              <FormHelperText>{errors.address.city.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Zip Code"
            {...register(
              'address.postalCode',
              practiceInfoValidations.address.postalCode
            )}
            error={!!errors.address?.postalCode}
            helperText={errors.address?.postalCode?.message}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="logo"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Box>
                {logoPreview && (
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <img
                      src={logoPreview}
                      alt="Practice Logo Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}
                <TextField
                  {...field}
                  fullWidth
                  type="file"
                  inputProps={{
                    accept:
                      'image/jpeg,image/jpg,image/png,image/gif,image/webp',
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (5MB max)
                      if (file.size > 5 * 1024 * 1024) {
                        return;
                      }
                      // Validate file type
                      const validTypes = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                      ];
                      if (!validTypes.includes(file.type)) {
                        return;
                      }
                      // Create preview
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoPreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                      onChange(file);
                    } else {
                      setLogoPreview(null);
                      onChange(null);
                    }
                  }}
                  helperText="Upload practice logo (Max 5MB, JPEG/PNG/GIF/WebP)"
                />
                {errors.logo && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {errors.logo.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.timezone}>
            <InputLabel>Timezone</InputLabel>
            <Controller
              name="timezone"
              control={control}
              rules={practiceInfoValidations.timezone}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || 'Asia/Karachi'}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Timezone"
                  renderValue={(v) => {
                    const tz = TIME_ZONES.find((t) => t.value === v);
                    return (
                      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tz ? tz.label : v}
                      </Box>
                    );
                  }}
                >
                  {timeZoneOptions.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.timezone && (
              <FormHelperText>{errors.timezone.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        {!hideButtons && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={loading}
              >
                {loading
                  ? 'Saving...'
                  : isEditMode
                    ? 'Save Changes'
                    : 'Create Practice Info'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PracticeInfoForm;
