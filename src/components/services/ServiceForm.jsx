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

const ServiceForm = ({ onSubmit, initialData = null, loading = false, isEditMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    defaultValues: {
      cptCode: '',
      name: '',
      description: '',
      defaultPrice: '',
      durationMinutes: '',
      category: '',
      requiresAuthorization: false,
      isBillable: true,
      taxRate: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        cptCode: initialData.cptCode || '',
        name: initialData.name || '',
        description: initialData.description || '',
        defaultPrice: initialData.defaultPrice?.toString() || '',
        durationMinutes: initialData.durationMinutes?.toString() || '',
        category: initialData.category || '',
        requiresAuthorization: initialData.requiresAuthorization || false,
        isBillable: initialData.isBillable !== false,
        taxRate: initialData.taxRate?.toString() || '',
        isActive: initialData.isActive !== false,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      cptCode: data.cptCode,
      name: data.name,
      description: data.description || undefined,
      defaultPrice: parseFloat(data.defaultPrice),
      durationMinutes: data.durationMinutes ? parseInt(data.durationMinutes) : undefined,
      category: data.category || undefined,
      requiresAuthorization: data.requiresAuthorization,
      isBillable: data.isBillable,
      taxRate: data.taxRate ? parseFloat(data.taxRate) : undefined,
      isActive: data.isActive,
    };
    onSubmit(formattedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        {/* CPT Code */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('cptCode', {
              required: 'CPT code is required',
              minLength: { value: 4, message: 'Min 4 characters' },
              maxLength: { value: 10, message: 'Max 10 characters' },
            })}
            label="CPT Code *"
            fullWidth
            error={!!errors.cptCode}
            helperText={errors.cptCode?.message}
            placeholder="e.g., 99213"
          />
        </Grid>

        {/* Service Name */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            {...register('name', {
              required: 'Service name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
            label="Service Name *"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        {/* Description */}
        <Grid size={12}>
          <TextField
            {...register('description', {
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
            label="Description"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message || 'Optional description of the service'}
          />
        </Grid>

        {/* Default Price */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('defaultPrice', {
              required: 'Default price is required',
              min: { value: 0, message: 'Must be positive' },
            })}
            label="Default Price *"
            type="number"
            fullWidth
            error={!!errors.defaultPrice}
            helperText={errors.defaultPrice?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        {/* Duration */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('durationMinutes', {
              min: { value: 5, message: 'Min 5 minutes' },
              max: { value: 480, message: 'Max 480 minutes' },
            })}
            label="Duration (Minutes)"
            type="number"
            fullWidth
            error={!!errors.durationMinutes}
            helperText={errors.durationMinutes?.message || 'Average procedure time'}
            inputProps={{ min: 5, max: 480 }}
          />
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('category', {
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
            label="Category"
            fullWidth
            error={!!errors.category}
            helperText={errors.category?.message}
            placeholder="e.g., Lab, Imaging, Consult"
          />
        </Grid>

        {/* Tax Rate */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('taxRate', {
              min: { value: 0, message: 'Must be positive' },
            })}
            label="Tax Rate (%)"
            type="number"
            fullWidth
            error={!!errors.taxRate}
            helperText={errors.taxRate?.message}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        {/* Toggles */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', height: '100%' }}>
            <Controller
              name="isBillable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label="Billable"
                />
              )}
            />
            <Controller
              name="requiresAuthorization"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label="Requires Pre-Authorization"
                />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label="Active"
                />
              )}
            />
          </Box>
        </Grid>

        {/* Buttons */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button variant="outlined" onClick={() => window.history.back()} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Service'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceForm;
