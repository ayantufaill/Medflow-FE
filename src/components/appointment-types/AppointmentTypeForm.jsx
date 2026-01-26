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
  InputAdornment,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { appointmentTypeValidations } from '../../validations/appointmentTypeValidations';

const AppointmentTypeForm = ({
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
    watch,
    setValue,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      defaultDuration: 30,
      defaultPrice: '',
      colorCode: '',
      requiresAuthorization: false,
      bufferBefore: 0,
      bufferAfter: 0,
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        defaultDuration: initialData.defaultDuration || 30,
        defaultPrice: initialData.defaultPrice || '',
        colorCode: initialData.colorCode || '',
        requiresAuthorization: initialData.requiresAuthorization || false,
        bufferBefore: initialData.bufferBefore || 0,
        bufferAfter: initialData.bufferAfter || 0,
        isActive: initialData.isActive !== false,
      });
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const colorCode = watch('colorCode');

  // Helper function to convert hex to color name or vice versa
  const handleColorChange = (newColor) => {
    setValue('colorCode', newColor, { shouldValidate: true });
  };

  // Helper function to format price to 2 decimal places
  const handlePriceChange = (fieldOnChange) => (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      fieldOnChange(e);
    }
  };

  const handleFormSubmit = (formData) => {
    const sanitizedData = {
      ...formData,
      name: sanitizeValue(formData.name),
      description: sanitizeValue(formData.description) || undefined,
      defaultDuration: Number(formData.defaultDuration),
      defaultPrice: formData.defaultPrice
        ? parseFloat(Number(formData.defaultPrice).toFixed(2))
        : undefined,
      colorCode: sanitizeValue(formData.colorCode) || undefined,
      bufferBefore: formData.bufferBefore ? Number(formData.bufferBefore) : 0,
      bufferAfter: formData.bufferAfter ? Number(formData.bufferAfter) : 0,
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Appointment Type Name *"
            {...register('name', appointmentTypeValidations.name)}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Default Duration (minutes) *"
            type="number"
            {...register(
              'defaultDuration',
              appointmentTypeValidations.defaultDuration
            )}
            error={!!errors.defaultDuration}
            helperText={errors.defaultDuration?.message}
            inputProps={{ min: 1, max: 1440 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="defaultPrice"
            control={control}
            rules={appointmentTypeValidations.defaultPrice}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Default Price"
                {...field}
                onChange={handlePriceChange(field.onChange)}
                error={!!errors.defaultPrice}
                helperText={errors.defaultPrice?.message}
                inputProps={{ min: 0, max: 999999.99, step: 0.01 }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="colorCode"
            control={control}
            rules={appointmentTypeValidations.colorCode}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Color Code"
                {...field}
                error={!!errors.colorCode}
                helperText={
                  errors.colorCode?.message || 'Hex color code (e.g., #FF5733) or color name (e.g., red, skyBlue)'
                }
                InputLabelProps={{
                  shrink: !!field.value,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        sx={{
                          position: 'relative',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: field.value || '#cccccc',
                          border: 1,
                          borderColor: 'divider',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="color"
                          value={(() => {
                            if (!field.value) return '#000000';
                            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(field.value)) return field.value;
                            const tempDiv = document.createElement('div');
                            tempDiv.style.color = field.value;
                            document.body.appendChild(tempDiv);
                            const computedColor = window.getComputedStyle(tempDiv).color;
                            document.body.removeChild(tempDiv);
                            if (computedColor && computedColor !== '') {
                              const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                              if (match) {
                                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                                return `#${r}${g}${b}`;
                              }
                            }
                            return '#000000';
                          })()}
                          onChange={(e) => {
                            e.stopPropagation();
                          }}
                          onBlur={(e) => {
                            field.onChange(e.target.value);
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          title="Pick a color"
                        />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Buffer Before (minutes)"
            type="number"
            {...register(
              'bufferBefore',
              appointmentTypeValidations.bufferBefore
            )}
            error={!!errors.bufferBefore}
            helperText={
              errors.bufferBefore?.message
            }
            inputProps={{ min: 0, max: 240 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Buffer After (minutes)"
            type="number"
            {...register('bufferAfter', appointmentTypeValidations.bufferAfter)}
            error={!!errors.bufferAfter}
            helperText={
              errors.bufferAfter?.message
            }
            inputProps={{ min: 0, max: 240 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Switch
                {...register('requiresAuthorization')}
                defaultChecked={initialData?.requiresAuthorization || false}
              />
            }
            label="Requires Authorization"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Controller
                name="isActive"
                control={control}
                rules={appointmentTypeValidations.isActive}
                render={({ field }) => (
                  <Switch
                    checked={field.value ?? true}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Active"
          />
          {errors.isActive && (
            <Box
              sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}
            >
              {errors.isActive.message}
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            {...register('description', appointmentTypeValidations.description)}
            error={!!errors.description}
            helperText={errors.description?.message}
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
                  : 'Create Appointment Type'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AppointmentTypeForm;
