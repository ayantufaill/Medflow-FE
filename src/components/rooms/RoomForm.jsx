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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useBranch } from '../../hooks/redux';

const RoomForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  const { branches, fetchBranches: loadBranches } = useBranch();
  useEffect(() => {
    if (branches.length === 0) loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      isActive: true,
      branchId: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        isActive: initialData.isActive !== false,
        branchId: initialData.branchId || '',
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
      name: sanitizeValue(formData.name),
      isActive: formData.isActive ?? true,
      branchId: formData.branchId || undefined,
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Room Name or Number *"
            {...register('name', {
              required: 'Room name is required',
              minLength: {
                value: 1,
                message: 'Room name must be at least 1 character',
              },
              maxLength: {
                value: 100,
                message: 'Room name must be less than 100 characters',
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message || 'e.g., Room 101, Exam Room 1, etc.'}
            placeholder="Enter room name or number"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="room-branch-label">Branch</InputLabel>
                <Select
                  labelId="room-branch-label"
                  label="Branch"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value=""><em>Not specified</em></MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControlLabel
            control={
              <Controller
                name="isActive"
                control={control}
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
                  : 'Create Room'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RoomForm;
