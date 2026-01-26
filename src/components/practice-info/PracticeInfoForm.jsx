import { useEffect, useState } from 'react';
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
      timezone: 'UTC',
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
        timezone: initialData.timezone || 'UTC',
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
          <TextField
            fullWidth
            label="City"
            {...register('address.city', practiceInfoValidations.address.city)}
            error={!!errors.address?.city}
            helperText={errors.address?.city?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="State"
            {...register(
              'address.state',
              practiceInfoValidations.address.state
            )}
            error={!!errors.address?.state}
            helperText={errors.address?.state?.message}
          />
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
                  value={field.value || 'UTC'}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Timezone"
                >
                  <MenuItem value="UTC">
                    UTC (Coordinated Universal Time)
                  </MenuItem>
                  <MenuItem disabled>
                    ────────── North America ──────────
                  </MenuItem>
                  <MenuItem value="America/New_York">
                    America/New_York (Eastern Time)
                  </MenuItem>
                  <MenuItem value="America/Chicago">
                    America/Chicago (Central Time)
                  </MenuItem>
                  <MenuItem value="America/Denver">
                    America/Denver (Mountain Time)
                  </MenuItem>
                  <MenuItem value="America/Los_Angeles">
                    America/Los_Angeles (Pacific Time)
                  </MenuItem>
                  <MenuItem value="America/Phoenix">
                    America/Phoenix (Mountain Time - No DST)
                  </MenuItem>
                  <MenuItem value="America/Anchorage">
                    America/Anchorage (Alaska Time)
                  </MenuItem>
                  <MenuItem value="America/Honolulu">
                    America/Honolulu (Hawaii Time)
                  </MenuItem>
                  <MenuItem value="America/Toronto">
                    America/Toronto (Eastern Time)
                  </MenuItem>
                  <MenuItem value="America/Vancouver">
                    America/Vancouver (Pacific Time)
                  </MenuItem>
                  <MenuItem value="America/Montreal">
                    America/Montreal (Eastern Time)
                  </MenuItem>
                  <MenuItem value="America/Winnipeg">
                    America/Winnipeg (Central Time)
                  </MenuItem>
                  <MenuItem value="America/Calgary">
                    America/Calgary (Mountain Time)
                  </MenuItem>
                  <MenuItem value="America/Halifax">
                    America/Halifax (Atlantic Time)
                  </MenuItem>
                  <MenuItem disabled>
                    ────────── Central & South America ──────────
                  </MenuItem>
                  <MenuItem value="America/Mexico_City">
                    America/Mexico_City (Central Time)
                  </MenuItem>
                  <MenuItem value="America/Bogota">
                    America/Bogota (Colombia Time)
                  </MenuItem>
                  <MenuItem value="America/Lima">
                    America/Lima (Peru Time)
                  </MenuItem>
                  <MenuItem value="America/Santiago">
                    America/Santiago (Chile Time)
                  </MenuItem>
                  <MenuItem value="America/Sao_Paulo">
                    America/Sao_Paulo (Brasilia Time)
                  </MenuItem>
                  <MenuItem value="America/Buenos_Aires">
                    America/Buenos_Aires (Argentina Time)
                  </MenuItem>
                  <MenuItem value="America/Caracas">
                    America/Caracas (Venezuela Time)
                  </MenuItem>
                  <MenuItem value="America/La_Paz">
                    America/La_Paz (Bolivia Time)
                  </MenuItem>
                  <MenuItem disabled>────────── Europe ──────────</MenuItem>
                  <MenuItem value="Europe/London">
                    Europe/London (Greenwich Mean Time)
                  </MenuItem>
                  <MenuItem value="Europe/Paris">
                    Europe/Paris (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Berlin">
                    Europe/Berlin (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Rome">
                    Europe/Rome (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Madrid">
                    Europe/Madrid (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Amsterdam">
                    Europe/Amsterdam (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Brussels">
                    Europe/Brussels (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Vienna">
                    Europe/Vienna (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Zurich">
                    Europe/Zurich (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Stockholm">
                    Europe/Stockholm (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Copenhagen">
                    Europe/Copenhagen (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Oslo">
                    Europe/Oslo (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Dublin">
                    Europe/Dublin (Greenwich Mean Time)
                  </MenuItem>
                  <MenuItem value="Europe/Lisbon">
                    Europe/Lisbon (Western European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Warsaw">
                    Europe/Warsaw (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Prague">
                    Europe/Prague (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Budapest">
                    Europe/Budapest (Central European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Athens">
                    Europe/Athens (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Bucharest">
                    Europe/Bucharest (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Sofia">
                    Europe/Sofia (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Helsinki">
                    Europe/Helsinki (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Europe/Moscow">
                    Europe/Moscow (Moscow Time)
                  </MenuItem>
                  <MenuItem disabled>────────── Asia ──────────</MenuItem>
                  <MenuItem value="Asia/Dubai">
                    Asia/Dubai (Gulf Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Riyadh">
                    Asia/Riyadh (Arabia Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Kuwait">
                    Asia/Kuwait (Arabia Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Qatar">
                    Asia/Qatar (Arabia Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Bahrain">
                    Asia/Bahrain (Arabia Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Muscat">
                    Asia/Muscat (Gulf Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Karachi">
                    Asia/Karachi (Pakistan Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Kolkata">
                    Asia/Kolkata (India Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Dhaka">
                    Asia/Dhaka (Bangladesh Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Colombo">
                    Asia/Colombo (Sri Lanka Time)
                  </MenuItem>
                  <MenuItem value="Asia/Kathmandu">
                    Asia/Kathmandu (Nepal Time)
                  </MenuItem>
                  <MenuItem value="Asia/Kabul">
                    Asia/Kabul (Afghanistan Time)
                  </MenuItem>
                  <MenuItem value="Asia/Tehran">
                    Asia/Tehran (Iran Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Baghdad">
                    Asia/Baghdad (Arabia Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Jerusalem">
                    Asia/Jerusalem (Israel Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Beirut">
                    Asia/Beirut (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Asia/Amman">
                    Asia/Amman (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Asia/Damascus">
                    Asia/Damascus (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Asia/Bangkok">
                    Asia/Bangkok (Indochina Time)
                  </MenuItem>
                  <MenuItem value="Asia/Singapore">
                    Asia/Singapore (Singapore Time)
                  </MenuItem>
                  <MenuItem value="Asia/Kuala_Lumpur">
                    Asia/Kuala_Lumpur (Malaysia Time)
                  </MenuItem>
                  <MenuItem value="Asia/Jakarta">
                    Asia/Jakarta (Western Indonesia Time)
                  </MenuItem>
                  <MenuItem value="Asia/Manila">
                    Asia/Manila (Philippine Time)
                  </MenuItem>
                  <MenuItem value="Asia/Hong_Kong">
                    Asia/Hong_Kong (Hong Kong Time)
                  </MenuItem>
                  <MenuItem value="Asia/Shanghai">
                    Asia/Shanghai (China Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Taipei">
                    Asia/Taipei (Taiwan Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Tokyo">
                    Asia/Tokyo (Japan Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Seoul">
                    Asia/Seoul (Korea Standard Time)
                  </MenuItem>
                  <MenuItem value="Asia/Almaty">
                    Asia/Almaty (Kazakhstan Time)
                  </MenuItem>
                  <MenuItem value="Asia/Tashkent">
                    Asia/Tashkent (Uzbekistan Time)
                  </MenuItem>
                  <MenuItem value="Asia/Baku">
                    Asia/Baku (Azerbaijan Time)
                  </MenuItem>
                  <MenuItem value="Asia/Yerevan">
                    Asia/Yerevan (Armenia Time)
                  </MenuItem>
                  <MenuItem value="Asia/Tbilisi">
                    Asia/Tbilisi (Georgia Time)
                  </MenuItem>
                  <MenuItem disabled>────────── Africa ──────────</MenuItem>
                  <MenuItem value="Africa/Cairo">
                    Africa/Cairo (Eastern European Time)
                  </MenuItem>
                  <MenuItem value="Africa/Johannesburg">
                    Africa/Johannesburg (South Africa Standard Time)
                  </MenuItem>
                  <MenuItem value="Africa/Lagos">
                    Africa/Lagos (West Africa Time)
                  </MenuItem>
                  <MenuItem value="Africa/Nairobi">
                    Africa/Nairobi (East Africa Time)
                  </MenuItem>
                  <MenuItem disabled>
                    ────────── Australia & Pacific ──────────
                  </MenuItem>
                  <MenuItem value="Australia/Sydney">
                    Australia/Sydney (Australian Eastern Time)
                  </MenuItem>
                  <MenuItem value="Australia/Melbourne">
                    Australia/Melbourne (Australian Eastern Time)
                  </MenuItem>
                  <MenuItem value="Australia/Brisbane">
                    Australia/Brisbane (Australian Eastern Time)
                  </MenuItem>
                  <MenuItem value="Australia/Perth">
                    Australia/Perth (Australian Western Time)
                  </MenuItem>
                  <MenuItem value="Australia/Adelaide">
                    Australia/Adelaide (Australian Central Time)
                  </MenuItem>
                  <MenuItem value="Pacific/Auckland">
                    Pacific/Auckland (New Zealand Time)
                  </MenuItem>
                  <MenuItem value="Pacific/Honolulu">
                    Pacific/Honolulu (Hawaii Time)
                  </MenuItem>
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
