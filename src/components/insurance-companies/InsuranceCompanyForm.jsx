import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { insuranceCompanyValidations } from '../../validations/insuranceCompanyValidations';

const InsuranceCompanyForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      payerId: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      email: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      // Strip + prefix from phone if it exists for PhoneInput component
      const phoneValue = initialData.phone?.startsWith('+')
        ? initialData.phone.substring(1)
        : initialData.phone || '';

      reset({
        name: initialData.name || '',
        payerId: initialData.payerId || '',
        phone: phoneValue,
        addressLine1: initialData.addressLine1 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        email: initialData.email || '',
        isActive: initialData.isActive !== false,
      });
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
      name: sanitizeValue(formData.name),
      payerId: sanitizeValue(formData.payerId) || undefined,
      phone: formData.phone ? `+${sanitizeValue(formData.phone)}` : undefined,
      addressLine1: sanitizeValue(formData.addressLine1) || undefined,
      city: sanitizeValue(formData.city) || undefined,
      state: sanitizeValue(formData.state) || undefined,
      zipCode: sanitizeValue(formData.zipCode) || undefined,
      email: sanitizeValue(formData.email) || undefined,
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Insurance Company Name *"
            {...register('name', insuranceCompanyValidations.name)}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Payer ID *"
            {...register('payerId', insuranceCompanyValidations.payerId)}
            error={!!errors.payerId}
            helperText={errors.payerId?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            rules={insuranceCompanyValidations.phone}
            render={({ field }) => (
              <Box>
                <Box
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                ></Box>
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
                    specialLabel="Phone Number *"
                    enableSearch={true}
                    disableSearchIcon={false}
                    searchPlaceholder="Search country"
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
                  <Box
                    sx={{
                      color: '#d32f2f',
                      fontSize: '0.75rem',
                      mt: 0.5,
                      mx: 1.75,
                    }}
                  >
                    {errors.phone.message}
                  </Box>
                )}
              </Box>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email *"
            type="email"
            {...register('email', insuranceCompanyValidations.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address"
            {...register(
              'addressLine1',
              insuranceCompanyValidations.addressLine1
            )}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="City *"
            {...register('city', insuranceCompanyValidations.city)}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="State *"
            {...register('state', insuranceCompanyValidations.state)}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Zip Code"
            {...register('zipCode', insuranceCompanyValidations.zipCode)}
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                {...register('isActive')}
                defaultChecked={initialData?.isActive !== false}
              />
            }
            label="Active"
          />
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
                  : 'Create Insurance Company'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InsuranceCompanyForm;
