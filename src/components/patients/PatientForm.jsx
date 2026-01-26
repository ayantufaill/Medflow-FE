import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  CameraAlt as CameraAltIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { patientValidations } from '../../validations/patientValidations';
import {
  extractTextFromImage,
  parseDriverLicense,
} from '../../services/ocr.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const PatientForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hideButtons = false,
  formId,
}) => {
  // State to track selected country data for phone validation
  const [selectedCountryPrimary, setSelectedCountryPrimary] = useState(null);
  const [selectedCountrySecondary, setSelectedCountrySecondary] =
    useState(null);
  const [selectedCountryEmergency, setSelectedCountryEmergency] =
    useState(null);

  // OCR state
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [licensePreview, setLicensePreview] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [showOcrText, setShowOcrText] = useState(false);
  const fileInputRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: initialData || {
      firstName: '',
      middleName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: null,
      gender: '',
      ssn: '',
      phonePrimary: '',
      phoneSecondary: '',
      email: '',
      preferredLanguage: 'en',
      communicationPreference: 'phone',
      portalAccessEnabled: false,
      lastVisitDate: null,
      referralSource: '',
      isActive: true,
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
      notes: '',
      customFields: {},
    },
  });

  // SSN formatting function
  const formatSSN = (value) => {
    if (!value) return '';
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXX-XX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  // Memoize today's date to prevent creating new dayjs objects on every render
  const today = useMemo(() => dayjs(), []);

  // Use ref to track previous initialData ID to prevent unnecessary resets
  const previousInitialDataIdRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      // Check if this is actually new data (compare by _id or id)
      const currentId = initialData._id || initialData.id;
      if (previousInitialDataIdRef.current === currentId) {
        return; // Same data, skip reset
      }
      previousInitialDataIdRef.current = currentId;

      // Helper function to safely convert date to dayjs
      const parseDate = (dateValue) => {
        if (!dateValue) return null;
        const parsed = dayjs(dateValue);
        return parsed.isValid() ? parsed : null;
      };

      reset({
        firstName: initialData.firstName || '',
        middleName: initialData.middleName || '',
        lastName: initialData.lastName || '',
        preferredName: initialData.preferredName || '',
        dateOfBirth: parseDate(initialData.dateOfBirth),
        gender: initialData.gender || '',
        ssn: initialData.ssn
          ? formatSSN(initialData.ssn.replace(/-/g, ''))
          : '',
        phonePrimary: initialData.phonePrimary
          ? initialData.phonePrimary.replace(/^\+/, '')
          : '',
        phoneSecondary: initialData.phoneSecondary
          ? initialData.phoneSecondary.replace(/^\+/, '')
          : '',
        email: initialData.email || '',
        preferredLanguage: initialData.preferredLanguage || 'en',
        communicationPreference: initialData.communicationPreference || 'phone',
        portalAccessEnabled:
          initialData.portalAccessEnabled !== undefined
            ? initialData.portalAccessEnabled
            : false,
        lastVisitDate: parseDate(initialData.lastVisitDate),
        referralSource: initialData.referralSource || '',
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
        address: {
          line1: initialData.address?.line1 || '',
          line2: initialData.address?.line2 || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          postalCode: initialData.address?.postalCode || '',
        },
        emergencyContact: {
          name: initialData.emergencyContact?.name || '',
          relationship: initialData.emergencyContact?.relationship || '',
          phone: initialData.emergencyContact?.phone
            ? initialData.emergencyContact.phone.replace(/^\+/, '')
            : '',
        },
        notes: initialData.notes || '',
        customFields:
          initialData.customFields &&
          typeof initialData.customFields === 'object'
            ? initialData.customFields
            : {},
      });
    } else {
      // Reset to null if initialData becomes null
      previousInitialDataIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id || initialData?.id, reset]);

  const handleBack = () => {
    window.history.back();
  };

  // Handle driver's license scan
  const handleLicenseScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar(
        'Please upload a valid image file (JPEG, PNG, or WebP)',
        'error'
      );
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('Image file size must be less than 10MB', 'error');
      return;
    }

    try {
      setOcrProcessing(true);
      setOcrProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Extract text using OCR with progress tracking
      const extractedText = await extractTextFromImage(file, (progress) => {
        setOcrProgress(Math.round(progress * 100));
      });

      // Store OCR text for debugging
      setOcrText(extractedText);

      if (!extractedText || extractedText.trim().length < 10) {
        showSnackbar(
          'Could not extract text from image. Please ensure the image is clear and try again.',
          'warning'
        );
        setOcrProcessing(false);
        setOcrProgress(0);
        setOcrText(null);
        return;
      }

      // Parse driver's license data
      const parsedData = parseDriverLicense(extractedText);

      // Auto-populate form fields - only populate if field is currently empty
      const currentValues = watch();
      const updatedValues = {
        ...currentValues,
        // Only populate if current value is empty
        firstName:
          parsedData.firstName && !currentValues.firstName
            ? parsedData.firstName
            : currentValues.firstName,
        lastName:
          parsedData.lastName && !currentValues.lastName
            ? parsedData.lastName
            : currentValues.lastName,
        middleName:
          parsedData.middleName && !currentValues.middleName
            ? parsedData.middleName
            : currentValues.middleName,
        preferredName:
          parsedData.preferredName && !currentValues.preferredName
            ? parsedData.preferredName
            : currentValues.preferredName,
        dateOfBirth:
          parsedData.dateOfBirth && !currentValues.dateOfBirth
            ? dayjs(parsedData.dateOfBirth)
            : currentValues.dateOfBirth,
        gender:
          parsedData.gender && !currentValues.gender
            ? parsedData.gender
            : currentValues.gender,
        ssn:
          parsedData.ssn && !currentValues.ssn
            ? formatSSN(parsedData.ssn)
            : currentValues.ssn || '',
        phonePrimary:
          parsedData.phonePrimary && !currentValues.phonePrimary
            ? parsedData.phonePrimary
            : currentValues.phonePrimary || '',
        email:
          parsedData.email && !currentValues.email
            ? parsedData.email
            : currentValues.email || '',
        address: {
          line1:
            parsedData.address.line1 && !currentValues.address?.line1
              ? parsedData.address.line1
              : currentValues.address?.line1 || '',
          line2:
            parsedData.address.line2 && !currentValues.address?.line2
              ? parsedData.address.line2
              : currentValues.address?.line2 || '',
          city:
            parsedData.address.city && !currentValues.address?.city
              ? parsedData.address.city
              : currentValues.address?.city || '',
          state:
            parsedData.address.state && !currentValues.address?.state
              ? parsedData.address.state
              : currentValues.address?.state || '',
          postalCode:
            parsedData.address.postalCode && !currentValues.address?.postalCode
              ? parsedData.address.postalCode
              : currentValues.address?.postalCode || '',
        },
      };

      // Reset form with updated values
      reset(updatedValues);

      // Show success message with detailed feedback
      const extractedFields = [];
      if (parsedData.firstName && parsedData.lastName)
        extractedFields.push('Name');
      if (parsedData.middleName) extractedFields.push('Middle Name');
      if (parsedData.dateOfBirth) extractedFields.push('Date of Birth');
      if (parsedData.address.line1) extractedFields.push('Address');
      if (parsedData.address.line2) extractedFields.push('Address Line 2');
      if (parsedData.gender) extractedFields.push('Gender');
      if (parsedData.ssn) extractedFields.push('SSN');
      if (parsedData.phonePrimary) extractedFields.push('Phone');
      if (parsedData.email) extractedFields.push('Email');

      if (extractedFields.length > 0) {
        showSnackbar(
          `Successfully extracted ${
            extractedFields.length
          } field(s): ${extractedFields.join(
            ', '
          )}. Please review and complete remaining fields.`,
          'success'
        );
      } else {
        showSnackbar(
          'Text extracted but could not parse demographics. Please check the image quality and try again, or enter information manually.',
          'warning'
        );
        // Log OCR text for debugging
        console.log('OCR Text (for debugging):', extractedText);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      showSnackbar(
        error.message ||
          "Failed to process driver's license. Please try again or enter information manually.",
        'error'
      );
    } finally {
      setOcrProcessing(false);
      setOcrProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sanitizeValue = (value) =>
    typeof value === 'string' ? value.trim() : value;

  const customFields = watch('customFields') || {};

  const handleAddCustomField = () => {
    const newKey = `customField_${Object.keys(customFields).length + 1}`;
    const currentFields = { ...customFields };
    currentFields[newKey] = '';
    reset({
      ...watch(),
      customFields: currentFields,
    });
  };

  const handleRemoveCustomField = (key) => {
    const currentFields = { ...customFields };
    delete currentFields[key];
    reset({
      ...watch(),
      customFields: currentFields,
    });
  };

  const handleCustomFieldChange = (key, value) => {
    const currentFields = { ...customFields };
    currentFields[key] = value;
    reset({
      ...watch(),
      customFields: currentFields,
    });
  };

  const handleFormSubmit = (formData) => {
    // Helper to convert dayjs to ISO string
    const formatDate = (dateValue) => {
      if (!dateValue) return undefined;
      const dayjsDate = dayjs.isDayjs(dateValue) ? dateValue : dayjs(dateValue);
      return dayjsDate.isValid() ? dayjsDate.toISOString() : undefined;
    };

    // Format SSN - remove hyphens and send as digits only
    const formatSSNForSubmit = (ssnValue) => {
      if (!ssnValue) return '';
      return ssnValue.replace(/-/g, '');
    };

    const sanitizedData = {
      firstName: sanitizeValue(formData.firstName),
      lastName: sanitizeValue(formData.lastName),
      middleName: sanitizeValue(formData.middleName) || '',
      preferredName: sanitizeValue(formData.preferredName) || '',
      dateOfBirth: formatDate(formData.dateOfBirth),
      gender: formData.gender || '',
      ssn: formatSSNForSubmit(formData.ssn) || '',
      phonePrimary: formData.phonePrimary
        ? `+${sanitizeValue(formData.phonePrimary)}`
        : '',
      phoneSecondary: formData.phoneSecondary
        ? `+${sanitizeValue(formData.phoneSecondary)}`
        : '',
      email: sanitizeValue(formData.email) || '',
      preferredLanguage: sanitizeValue(formData.preferredLanguage) || 'en',
      communicationPreference:
        sanitizeValue(formData.communicationPreference) || 'phone',
      portalAccessEnabled:
        formData.portalAccessEnabled !== undefined
          ? formData.portalAccessEnabled
          : false,
      lastVisitDate: formatDate(formData.lastVisitDate),
      referralSource: sanitizeValue(formData.referralSource) || '',
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      address: {
        line1: sanitizeValue(formData.address?.line1) || '',
        line2: sanitizeValue(formData.address?.line2) || '',
        city: sanitizeValue(formData.address?.city) || '',
        state: sanitizeValue(formData.address?.state) || '',
        postalCode: sanitizeValue(formData.address?.postalCode) || '',
      },
      emergencyContact: {
        name: sanitizeValue(formData.emergencyContact?.name) || '',
        relationship:
          sanitizeValue(formData.emergencyContact?.relationship) || '',
        phone: formData.emergencyContact?.phone
          ? `+${sanitizeValue(formData.emergencyContact.phone)}`
          : '',
      },
      notes: sanitizeValue(formData.notes) || '',
      customFields:
        formData.customFields && Object.keys(formData.customFields).length > 0
          ? Object.fromEntries(
              Object.entries(formData.customFields).filter(
                ([key, value]) =>
                  key &&
                  value &&
                  key.trim() !== '' &&
                  value.toString().trim() !== ''
              )
            )
          : undefined,
    };

    // Send empty strings for optional fields when cleared instead of excluding them
    // This ensures the backend can properly update fields to empty values
    // Keep all fields but ensure empty strings are sent for cleared optional fields

    onSubmit(sanitizedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        id={formId}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Grid container spacing={2}>
          {/* Driver's License OCR Scanner */}
          {!isEditMode && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'action.hover',
                  textAlign: 'center',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleLicenseScan}
                  style={{ display: 'none' }}
                  id="license-upload"
                  disabled={ocrProcessing}
                />
                <label htmlFor="license-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={
                      ocrProcessing ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CameraAltIcon />
                      )
                    }
                    disabled={ocrProcessing || loading}
                    sx={{ mb: 1 }}
                  >
                    {ocrProcessing
                      ? "Scanning Driver's License..."
                      : "Scan Driver's License (OCR)"}
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: 'text.secondary' }}
                >
                  Upload a clear photo of the driver's license to auto-populate
                  patient demographics
                </Typography>
                {ocrProcessing && (
                  <Box sx={{ mt: 2 }}>
                    <CircularProgress size={24} />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Processing image...{' '}
                      {ocrProgress > 0
                        ? `${ocrProgress}%`
                        : 'This may take a few moments.'}
                    </Typography>
                  </Box>
                )}
                {licensePreview && !ocrProcessing && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={licensePreview}
                      alt="License preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '120px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    />
                    <Box
                      sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setLicensePreview(null);
                          setOcrText(null);
                          setShowOcrText(false);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Clear Preview
                      </Button>
                      {ocrText && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setShowOcrText(!showOcrText)}
                        >
                          {showOcrText ? 'Hide' : 'Show'} OCR Text
                        </Button>
                      )}
                    </Box>
                    {showOcrText && ocrText && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          display="block"
                          sx={{ mb: 1 }}
                        >
                          Extracted OCR Text (for debugging):
                        </Typography>
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {ocrText}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name *"
              {...register('firstName', patientValidations.firstName)}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name *"
              {...register('lastName', patientValidations.lastName)}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Middle Name"
              {...register('middleName', patientValidations.middleName)}
              error={!!errors.middleName}
              helperText={errors.middleName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Preferred Name"
              {...register('preferredName', patientValidations.preferredName)}
              error={!!errors.preferredName}
              helperText={errors.preferredName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={patientValidations.dateOfBirth}
              render={({ field }) => {
                // Ensure value is always a dayjs object or null
                let dateValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    dateValue = field.value.isValid() ? field.value : null;
                  } else {
                    const parsed = dayjs(field.value);
                    dateValue = parsed.isValid() ? parsed : null;
                  }
                }

                return (
                  <DatePicker
                    label="Date of Birth *"
                    value={dateValue}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateOfBirth,
                        helperText: errors.dateOfBirth?.message,
                      },
                    }}
                    maxDate={today}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender *</InputLabel>
              <Controller
                name="gender"
                control={control}
                rules={patientValidations.gender}
                render={({ field }) => (
                  <Select {...field} label="Gender *">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non_binary">Non-binary</MenuItem>
                    <MenuItem value="prefer_not_to_say">
                      Prefer not to say
                    </MenuItem>
                    <MenuItem value="unknown">Unknown</MenuItem>
                  </Select>
                )}
              />
              {errors.gender && (
                <FormHelperText>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="ssn"
              control={control}
              rules={patientValidations.ssn}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="SSN"
                  {...field}
                  value={formatSSN(field.value || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and hyphens, max 11 chars (XXX-XX-XXXX)
                    const cleaned = value.replace(/\D/g, '').slice(0, 9);
                    field.onChange(cleaned);
                  }}
                  error={!!errors.ssn}
                  helperText={errors.ssn?.message}
                  placeholder="XXX-XX-XXXX"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phonePrimary"
              control={control}
              rules={{
                ...patientValidations.phonePrimary,
                validate: (value, formValues) => {
                  // Use base validation
                  const baseValidation =
                    patientValidations.phonePrimary.validate(value, formValues);
                  if (baseValidation !== true) return baseValidation;

                  // Enhanced validation with country format
                  if (value && selectedCountryPrimary) {
                    const cleanPhone = value
                      .replace(/^\+/, '')
                      .replace(/\s/g, '');
                    const format = selectedCountryPrimary.format || '';

                    // Count expected digits from format (dots represent digits)
                    const expectedDigits = (format.match(/\./g) || []).length;

                    if (expectedDigits > 0) {
                      // Get country code length
                      const countryCode = selectedCountryPrimary.dialCode || '';
                      const countryCodeLength = countryCode.replace(
                        /[^0-9]/g,
                        ''
                      ).length;
                      const subscriberNumber =
                        cleanPhone.substring(countryCodeLength);

                      // Check if subscriber number matches expected format
                      if (subscriberNumber.length < expectedDigits - 2) {
                        return 'Phone number appears incomplete for the selected country';
                      }
                      if (subscriberNumber.length > expectedDigits + 2) {
                        return 'Phone number is too long for the selected country';
                      }
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
                      specialLabel="Primary Phone Number *"
                      country={'us'}
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search country"
                      onChange={(value, country) => {
                        // Update immediately to prevent infinite loops
                        field.onChange(value);
                        setSelectedCountryPrimary(country);
                      }}
                      value={field.value || ''}
                      inputStyle={{
                        width: '100%',
                        borderColor: errors.phonePrimary
                          ? '#d32f2f'
                          : undefined,
                      }}
                      buttonStyle={{
                        borderColor: errors.phonePrimary
                          ? '#d32f2f'
                          : undefined,
                      }}
                    />
                  </Box>
                  {errors.phonePrimary && (
                    <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                      {errors.phonePrimary.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phoneSecondary"
              control={control}
              rules={{
                ...patientValidations.phoneSecondary,
                validate: (value) => {
                  // Use base validation
                  const baseValidation =
                    patientValidations.phoneSecondary.validate(value);
                  if (baseValidation !== true) return baseValidation;

                  // Enhanced validation with country format
                  if (value && selectedCountrySecondary) {
                    const cleanPhone = value
                      .replace(/^\+/, '')
                      .replace(/\s/g, '');
                    const format = selectedCountrySecondary.format || '';

                    // Count expected digits from format (dots represent digits)
                    const expectedDigits = (format.match(/\./g) || []).length;

                    if (expectedDigits > 0) {
                      // Get country code length
                      const countryCode =
                        selectedCountrySecondary.dialCode || '';
                      const countryCodeLength = countryCode.replace(
                        /[^0-9]/g,
                        ''
                      ).length;
                      const subscriberNumber =
                        cleanPhone.substring(countryCodeLength);

                      // Check if subscriber number matches expected format
                      if (subscriberNumber.length < expectedDigits - 2) {
                        return 'Phone number appears incomplete for the selected country';
                      }
                      if (subscriberNumber.length > expectedDigits + 2) {
                        return 'Phone number is too long for the selected country';
                      }
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
                      specialLabel="Secondary Phone Number"
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search country"
                      onChange={(value, country) => {
                        // Update immediately to prevent infinite loops
                        field.onChange(value);
                        setSelectedCountrySecondary(country);
                      }}
                      value={field.value || ''}
                      inputStyle={{
                        width: '100%',
                        borderColor: errors.phoneSecondary
                          ? '#d32f2f'
                          : undefined,
                      }}
                      buttonStyle={{
                        borderColor: errors.phoneSecondary
                          ? '#d32f2f'
                          : undefined,
                      }}
                    />
                  </Box>
                  {errors.phoneSecondary && (
                    <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                      {errors.phoneSecondary.message}
                    </FormHelperText>
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
              {...register('email', patientValidations.email)}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.preferredLanguage}>
              <InputLabel>Preferred Language</InputLabel>
              <Controller
                name="preferredLanguage"
                control={control}
                rules={patientValidations.preferredLanguage}
                render={({ field }) => (
                  <Select {...field} label="Preferred Language">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                )}
              />
              {errors.preferredLanguage && (
                <FormHelperText>
                  {errors.preferredLanguage.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.communicationPreference}>
              <InputLabel>Communication Preference</InputLabel>
              <Controller
                name="communicationPreference"
                control={control}
                rules={patientValidations.communicationPreference}
                render={({ field }) => (
                  <Select {...field} label="Communication Preference">
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="portal">Portal</MenuItem>
                  </Select>
                )}
              />
              {errors.communicationPreference && (
                <FormHelperText>
                  {errors.communicationPreference.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 'medium' }}
            >
              Address
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Line 1 *"
              {...register(
                'address.line1',
                patientValidations['address.line1']
              )}
              error={!!errors.address?.line1}
              helperText={errors.address?.line1?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Line 2"
              {...register(
                'address.line2',
                patientValidations['address.line2']
              )}
              error={!!errors.address?.line2}
              helperText={errors.address?.line2?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="City *"
              {...register('address.city', patientValidations['address.city'])}
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="State *"
              {...register(
                'address.state',
                patientValidations['address.state']
              )}
              error={!!errors.address?.state}
              helperText={errors.address?.state?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="address.postalCode"
              control={control}
              rules={patientValidations['address.postalCode']}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Postal Code *"
                  {...field}
                  error={!!errors.address?.postalCode}
                  helperText={errors.address?.postalCode?.message}
                  inputProps={{
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, mt: 2, fontWeight: 'medium' }}
            >
              Emergency Contact
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              {...register(
                'emergencyContact.name',
                patientValidations['emergencyContact.name']
              )}
              error={!!errors.emergencyContact?.name}
              helperText={errors.emergencyContact?.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Relationship"
              {...register(
                'emergencyContact.relationship',
                patientValidations['emergencyContact.relationship']
              )}
              error={!!errors.emergencyContact?.relationship}
              helperText={errors.emergencyContact?.relationship?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="emergencyContact.phone"
              control={control}
              rules={{
                ...patientValidations['emergencyContact.phone'],
                validate: (value) => {
                  // Use base validation
                  const baseValidation =
                    patientValidations['emergencyContact.phone'].validate(
                      value
                    );
                  if (baseValidation !== true) return baseValidation;

                  // Enhanced validation with country format
                  if (value && selectedCountryEmergency) {
                    const cleanPhone = value
                      .replace(/^\+/, '')
                      .replace(/\s/g, '');
                    const format = selectedCountryEmergency.format || '';

                    // Count expected digits from format (dots represent digits)
                    const expectedDigits = (format.match(/\./g) || []).length;

                    if (expectedDigits > 0) {
                      // Get country code length
                      const countryCode =
                        selectedCountryEmergency.dialCode || '';
                      const countryCodeLength = countryCode.replace(
                        /[^0-9]/g,
                        ''
                      ).length;
                      const subscriberNumber =
                        cleanPhone.substring(countryCodeLength);

                      // Check if subscriber number matches expected format
                      if (subscriberNumber.length < expectedDigits - 2) {
                        return 'Phone number appears incomplete for the selected country';
                      }
                      if (subscriberNumber.length > expectedDigits + 2) {
                        return 'Phone number is too long for the selected country';
                      }
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
                      specialLabel="Emergency Contact Phone Number"
                      country={'us'}
                      enableSearch={true}
                      disableSearchIcon={false}
                      searchPlaceholder="Search country"
                      onChange={(value, country) => {
                        // Update immediately to prevent infinite loops
                        field.onChange(value);
                        setSelectedCountryEmergency(country);
                      }}
                      value={field.value || ''}
                      inputStyle={{
                        width: '100%',
                        borderColor: errors.emergencyContact?.phone
                          ? '#d32f2f'
                          : undefined,
                      }}
                      buttonStyle={{
                        borderColor: errors.emergencyContact?.phone
                          ? '#d32f2f'
                          : undefined,
                      }}
                    />
                  </Box>
                  {errors.emergencyContact?.phone && (
                    <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                      {errors.emergencyContact.phone.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lastVisitDate"
              control={control}
              render={({ field }) => {
                let dateValue = null;
                if (field.value) {
                  if (dayjs.isDayjs(field.value)) {
                    dateValue = field.value.isValid() ? field.value : null;
                  } else {
                    const parsed = dayjs(field.value);
                    dateValue = parsed.isValid() ? parsed : null;
                  }
                }

                return (
                  <DatePicker
                    label="Last Visit Date"
                    value={dateValue}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.lastVisitDate,
                        helperText: errors.lastVisitDate?.message,
                      },
                    }}
                    maxDate={today}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Referral Source"
              {...register('referralSource', {
                maxLength: {
                  value: 100,
                  message: 'Referral source must not exceed 100 characters',
                },
              })}
              error={!!errors.referralSource}
              helperText={errors.referralSource?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              {...register('notes', patientValidations.notes)}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Controller
                  name="portalAccessEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value || false}
                      onChange={field.onChange}
                    />
                  )}
                />
              }
              label="Portal Access Enabled"
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
                      checked={field.value !== undefined ? field.value : true}
                      onChange={field.onChange}
                    />
                  )}
                />
              }
              label="Active"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" component="h3">
                Custom Fields
              </Typography>
              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddCustomField}
              >
                Add Field
              </Button>
            </Box>
            {Object.keys(customFields).length === 0 ? (
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  No custom fields added. Click "Add Field" to add custom
                  fields.
                </Typography>
              </Paper>
            ) : (
              <>
                {Object.entries(customFields).map(([key, value], index) => (
                  <Box key={key} sx={{ width: '100%' }}>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                          fullWidth
                          label={`Field Name ${index + 1}`}
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value.trim();
                            if (newKey && newKey !== key) {
                              const currentFields = { ...customFields };
                              const oldValue = currentFields[key];
                              delete currentFields[key];
                              currentFields[newKey] = oldValue;
                              reset({
                                ...watch(),
                                customFields: currentFields,
                              });
                            }
                          }}
                          placeholder="e.g., Insurance Group Number, Special Instructions"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={`Field Value ${index + 1}`}
                          value={value || ''}
                          onChange={(e) =>
                            handleCustomFieldChange(key, e.target.value)
                          }
                          placeholder="Enter the value"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            pt: { xs: 0, sm: 1 },
                          }}
                        >
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveCustomField(key)}
                            title="Remove this field"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </>
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
                    : 'Create Patient'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default PatientForm;
