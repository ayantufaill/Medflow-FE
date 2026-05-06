import { useEffect } from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { allergyValidations } from '../../validations/allergyValidations';

const AllergyForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
  patients = [],
  users = [],
  patientsLoading = false,
  usersLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
  } = useForm({
    defaultValues: initialData || {
      patientId: '',
      allergen: '',
      reaction: '',
      severity: '',
      documentedBy: '',
      documentedDate: null,
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        patientId: initialData.patientId || '',
        allergen: initialData.allergen || '',
        reaction: initialData.reaction || '',
        severity: initialData.severity || '',
        documentedBy: initialData.documentedBy?._id || initialData.documentedBy || '',
        documentedDate: initialData.documentedDate ? dayjs(initialData.documentedDate) : null,
        isActive: initialData.isActive !== false,
      });
    }
  }, [initialData, reset]);

  const sanitizeValue = (value) => (typeof value === 'string' ? value.trim() : value);

  const handleFormSubmit = (formData) => {
    onSubmit({
      ...formData,
      allergen: sanitizeValue(formData.allergen),
      reaction: sanitizeValue(formData.reaction),
      documentedDate: formData.documentedDate ? formData.documentedDate.toISOString() : null,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.patientId}>
              <InputLabel>Patient *</InputLabel>
              <Controller
                name="patientId"
                control={control}
                rules={allergyValidations.patientId}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Patient *"
                    disabled={patientsLoading || isEditMode}
                  >
                    <MenuItem value=""><em>--Select Patient--</em></MenuItem>
                    {patients.map((patient) => (
                      <MenuItem key={patient._id || patient.id} value={patient._id || patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.patientCode})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.patientId && <FormHelperText>{errors.patientId.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Allergen *"
              {...register('allergen', allergyValidations.allergen)}
              error={!!errors.allergen}
              helperText={errors.allergen?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Reaction *"
              {...register('reaction', allergyValidations.reaction)}
              error={!!errors.reaction}
              helperText={errors.reaction?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.severity}>
              <InputLabel>Severity *</InputLabel>
              <Controller
                name="severity"
                control={control}
                rules={allergyValidations.severity}
                render={({ field }) => (
                  <Select {...field} value={field.value || ''} label="Severity *">
                    <MenuItem value=""><em>--Select Severity--</em></MenuItem>
                    <MenuItem value="mild">Mild</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="severe">Severe</MenuItem>
                  </Select>
                )}
              />
              {errors.severity && <FormHelperText>{errors.severity.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.documentedBy}>
              <InputLabel>Documented By *</InputLabel>
              <Controller
                name="documentedBy"
                control={control}
                rules={allergyValidations.patientId}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Documented By *"
                    disabled={usersLoading || isEditMode}
                  >
                    <MenuItem value=""><em>--Select User--</em></MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user._id || user.id} value={user._id || user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.documentedBy && <FormHelperText>{errors.documentedBy.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="documentedDate"
              control={control}
              rules={allergyValidations.documentedDate}
              render={({ field }) => {
                const dateValue = field.value
                  ? dayjs.isDayjs(field.value)
                    ? field.value.isValid() ? field.value : null
                    : dayjs(field.value).isValid() ? dayjs(field.value) : null
                  : null;

                return (
                  <DatePicker
                    label="Documented Date *"
                    value={dateValue}
                    onChange={field.onChange}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.documentedDate,
                        helperText: errors.documentedDate?.message,
                      },
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value !== false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Is Active"
                />
              )}
            />
          </Grid>

          {!hideButtons && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => window.history.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading || !isValid}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Allergy'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AllergyForm;
