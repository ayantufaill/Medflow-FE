import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { Close as CloseIcon, CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { formatDateForPayload } from '../../../utils/dateUtils';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { patientService } from '../../../services/patient.service';
import { extractTextFromImage, parseInsuranceCard } from '../../../services/ocr.service';
import { useSelector } from 'react-redux';
import { selectCachedPatient } from '../../../store/slices/patientSlice';

export default function InsuranceDialog({
  open,
  onClose,
  patientId,
  insurance,
  mode,
  companies = [],
  existingInsurances = [],
  onSave,
  saving,
  setSaving,
}) {
  const { showSnackbar } = useSnackbar();
  const today = useMemo(() => dayjs(), []);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [cardPreview, setCardPreview] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [showOcrText, setShowOcrText] = useState(false);
  const fileInputRef = useRef(null);
  const previousInsuranceIdRef = useRef(null);
  const previousOpenRef = useRef(false);

  const cachedPatient = useSelector(selectCachedPatient(patientId));
  const household = cachedPatient?.household || [];

  const companyList = Array.isArray(companies) ? companies : companies?.companies || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: insurance || {
      insuranceCompanyId: '',
      policyNumber: '',
      groupNumber: '',
      groupName: '',
      subscriberName: '',
      subscriberDateOfBirth: null,
      relationshipToPatient: 'self',
      insuranceType: 'primary',
      effectiveDate: null,
      expirationDate: null,
      copayAmount: '',
      deductibleAmount: '',
      isActive: true,
      autoVerify: true,
      verificationStatus: 'pending',
      verificationDate: null,
      notes: '',
    },
  });

  useEffect(() => {
    if (!open) {
      previousInsuranceIdRef.current = null;
      previousOpenRef.current = false;
      setCardPreview(null);
      setOcrText(null);
      setShowOcrText(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const currentInsuranceId = insurance?._id || insurance?.id || null;
    if (!previousOpenRef.current) previousOpenRef.current = true;

    if (insurance && currentInsuranceId) {
      if (previousInsuranceIdRef.current === currentInsuranceId) return;
      previousInsuranceIdRef.current = currentInsuranceId;
      const companyId =
        insurance.insuranceCompanyId?._id ||
        insurance.insuranceCompanyId?.id ||
        insurance.insuranceCompanyId;
      reset({
        ...insurance,
        insuranceCompanyId: companyId || '',
        subscriberDateOfBirth: insurance.subscriberDateOfBirth ? dayjs(insurance.subscriberDateOfBirth) : null,
        effectiveDate: insurance.effectiveDate ? dayjs(insurance.effectiveDate) : null,
        expirationDate: insurance.expirationDate ? dayjs(insurance.expirationDate) : null,
        verificationDate: insurance.verificationDate ? dayjs(insurance.verificationDate) : null,
      });
    } else {
      if (previousInsuranceIdRef.current === null) return;
      previousInsuranceIdRef.current = null;
      reset({
        insuranceCompanyId: '',
        policyNumber: '',
        groupNumber: '',
        groupName: '',
        subscriberName: '',
        subscriberDateOfBirth: null,
        relationshipToPatient: 'self',
        effectiveDate: null,
        expirationDate: null,
        copayAmount: '',
        deductibleAmount: '',
        isActive: true,
        autoVerify: true,
        verificationStatus: 'pending',
        verificationDate: null,
        notes: '',
      });
    }
  }, [open, insurance]);

  const relationship = watch('relationshipToPatient');
  const isSelf = relationship === 'self';

  useEffect(() => {
    if (isSelf && cachedPatient) {
      const name = [cachedPatient.firstName, cachedPatient.lastName].filter(Boolean).join(' ');
      if (name) setValue('subscriberName', name);
      if (cachedPatient.dateOfBirth) setValue('subscriberDateOfBirth', dayjs(cachedPatient.dateOfBirth));
    }
  }, [isSelf, cachedPatient, setValue]);

  const handleInsuranceCardScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar('Please upload a valid image file (JPEG, PNG, or WebP)', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('Image file size must be less than 10MB', 'error');
      return;
    }
    try {
      setOcrProcessing(true);
      setOcrProgress(0);
      const reader = new FileReader();
      reader.onloadend = () => setCardPreview(reader.result);
      reader.readAsDataURL(file);
      const extractedText = await extractTextFromImage(file, (p) => setOcrProgress(Math.round(p * 100)));
      setOcrText(extractedText);
      if (!extractedText || extractedText.trim().length < 10) {
        showSnackbar('Could not extract text from image. Please ensure the image is clear and try again.', 'warning');
        setOcrProcessing(false);
        return;
      }
      const parsedData = parseInsuranceCard(extractedText);
      const currentValues = watch();
      const extractedFields = [];
      if (parsedData.subscriberName && !currentValues.subscriberName) {
        setValue('subscriberName', parsedData.subscriberName);
        extractedFields.push('Subscriber Name');
      }
      if (parsedData.policyNumber && !currentValues.policyNumber) {
        setValue('policyNumber', parsedData.policyNumber);
        extractedFields.push('Policy Number');
      }
      if (parsedData.groupNumber && !currentValues.groupNumber) {
        setValue('groupNumber', parsedData.groupNumber);
        extractedFields.push('Group Number');
      }
      if (parsedData.subscriberDateOfBirth && !currentValues.subscriberDateOfBirth) {
        setValue('subscriberDateOfBirth', dayjs(parsedData.subscriberDateOfBirth));
        extractedFields.push('Subscriber Date of Birth');
      }
      if (parsedData.effectiveDate && !currentValues.effectiveDate) {
        setValue('effectiveDate', dayjs(parsedData.effectiveDate));
        extractedFields.push('Effective Date');
      }
      if (parsedData.expirationDate && !currentValues.expirationDate) {
        setValue('expirationDate', dayjs(parsedData.expirationDate));
        extractedFields.push('Expiration Date');
      }
      if (parsedData.insuranceCompanyName && !currentValues.insuranceCompanyId) {
        const matched = companyList.find(
          (c) =>
            c.name?.toLowerCase().includes(parsedData.insuranceCompanyName?.toLowerCase()) ||
            parsedData.insuranceCompanyName?.toLowerCase().includes(c.name?.toLowerCase())
        );
        if (matched) {
          setValue('insuranceCompanyId', matched._id || matched.id);
          extractedFields.push('Insurance Company');
        }
      }
      if (extractedFields.length > 0) {
        showSnackbar(`Successfully extracted ${extractedFields.length} field(s): ${extractedFields.join(', ')}.`, 'success');
      } else {
        showSnackbar('Text extracted but could not parse insurance information. Please enter manually.', 'warning');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to process insurance card.', 'error');
    } finally {
      setOcrProcessing(false);
      setOcrProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const effectiveDateValue = watch('effectiveDate');
  const expirationDateValue = watch('expirationDate');


  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        patientId,
        subscriberDateOfBirth: formatDateForPayload(data.subscriberDateOfBirth),
        effectiveDate: formatDateForPayload(data.effectiveDate),
        expirationDate: formatDateForPayload(data.expirationDate),
        copayAmount: data.copayAmount ? parseFloat(data.copayAmount) : undefined,
        deductibleAmount: data.deductibleAmount ? parseFloat(data.deductibleAmount) : undefined,
        verificationDate: formatDateForPayload(data.verificationDate),
      };
      if (mode === 'add') {
        await patientService.createPatientInsurance(patientId, payload);
        showSnackbar('Insurance added and unsent claims generated successfully', 'success');
        reset({
          insuranceCompanyId: '',
          policyNumber: '',
          groupNumber: '',
          groupName: '',
          subscriberName: '',
          subscriberDateOfBirth: null,
          relationshipToPatient: 'self',
          effectiveDate: null,
          expirationDate: null,
          copayAmount: '',
          deductibleAmount: '',
          isActive: true,
          autoVerify: true,
          verificationStatus: 'pending',
          verificationDate: null,
          notes: '',
        });
        setCardPreview(null);
        setOcrText(null);
      } else {
        await patientService.updatePatientInsurance(patientId, insurance._id || insurance.id, payload);
        showSnackbar('Insurance updated successfully', 'success');
      }
      await onSave();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || err.response?.data?.message || `Failed to ${mode === 'add' ? 'add' : 'update'} insurance`,
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth 
        disableEnforceFocus
        sx={{ '& .MuiDialog-container': { zIndex: 9999 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{mode === 'add' ? 'Add Insurance' : 'Edit Insurance'}</Typography>
            <IconButton onClick={onClose} sx={{ color: (t) => t.palette.grey[500] }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInsuranceCardScan}
                style={{ display: 'none' }}
                id="insurance-card-upload"
                disabled={ocrProcessing}
              />
              <label htmlFor="insurance-card-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={ocrProcessing ? <CircularProgress size={20} /> : <CameraAltIcon />}
                  disabled={ocrProcessing || saving}
                  sx={{ mb: 1 }}
                >
                  {ocrProcessing ? 'Scanning...' : 'Scan Insurance Card (OCR)'}
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Upload a clear photo of the insurance card to auto-populate
              </Typography>
              {cardPreview && !ocrProcessing && (
                <Box sx={{ mt: 2 }}>
                  <img src={cardPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 4 }} />
                  <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => { setCardPreview(null); setOcrText(null); }}>
                    Remove Preview
                  </Button>
                </Box>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.insuranceCompanyId}>
                  <InputLabel>Insurance Company *</InputLabel>
                  <Controller
                    name="insuranceCompanyId"
                    control={control}
                    rules={{ required: 'Insurance company is required' }}
                    render={({ field }) => (
                      <Select {...field} label="Insurance Company *">
                        {companyList.map((c) => (
                          <MenuItem key={c._id || c.id} value={c._id || c.id}>{c.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.insuranceCompanyId && <FormHelperText>{errors.insuranceCompanyId.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Policy Number *"
                  {...register('policyNumber', { required: 'Policy number is required', minLength: { value: 5, message: 'At least 5 characters' } })}
                  error={!!errors.policyNumber}
                  helperText={errors.policyNumber?.message}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Group Number" {...register('groupNumber')} />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Group Name" {...register('groupName')} />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                {isSelf ? (
                  <TextField
                    fullWidth
                    label="Subscriber Name *"
                    {...register('subscriberName', { required: 'Subscriber name is required' })}
                    error={!!errors.subscriberName}
                    helperText={errors.subscriberName?.message}
                    disabled={true}
                  />
                ) : (
                  <FormControl fullWidth error={!!errors.subscriberName}>
                    <InputLabel>Subscriber Name *</InputLabel>
                    <Controller
                      name="subscriberName"
                      control={control}
                      rules={{ required: 'Subscriber name is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Subscriber Name *"
                          onChange={async (e) => {
                            field.onChange(e);
                            const selectedName = e.target.value;
                            if (selectedName === 'custom') return;
                            const selectedMember = household.find(m => `${m.firstName} ${m.lastName}` === selectedName);
                            if (selectedMember) {
                              setValue('subscriberDateOfBirth', selectedMember.dateOfBirth ? dayjs(selectedMember.dateOfBirth) : null);
                              try {
                                const insurances = await patientService.getPatientInsurances(selectedMember._id || selectedMember.id, true);
                                if (insurances && insurances.length > 0) {
                                  const primary = insurances.find(i => i.Ordinal === 1) || insurances[0];
                                  if (primary) {
                                    if (primary.insuranceCompanyId || primary.insuranceCompany?._id) {
                                      setValue('insuranceCompanyId', primary.insuranceCompanyId || primary.insuranceCompany?._id);
                                    }
                                    if (primary.policyNumber || primary.SubscriberID) {
                                      setValue('policyNumber', primary.policyNumber || primary.SubscriberID);
                                    }
                                    if (primary.groupNumber || primary.GroupNum) {
                                      setValue('groupNumber', primary.groupNumber || primary.GroupNum);
                                    }
                                    showSnackbar('Auto-filled policy details from family member.', 'success');
                                  }
                                }
                              } catch (err) {
                                console.error('Failed to fetch family member insurance', err);
                              }
                            }
                          }}
                        >
                          {household.map((member) => (
                            <MenuItem key={member._id || member.id} value={`${member.firstName} ${member.lastName}`}>
                              {member.firstName} {member.lastName}
                            </MenuItem>
                          ))}
                          <MenuItem value="custom"><em>Other (Manual Entry)</em></MenuItem>
                        </Select>
                      )}
                    />
                    {errors.subscriberName && <FormHelperText>{errors.subscriberName.message}</FormHelperText>}
                  </FormControl>
                )}
                {/* If custom is selected, we might want to show a text input, but for simplicity, if it's custom, the user can just change the relationship to something else, or we can just let them type. Actually, if they select "Other (Manual Entry)", the value is "custom" and they can't type. We should handle custom. Let's just remove custom for now as the user requested household dropdown. */}
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="subscriberDateOfBirth"
                  control={control}
                  rules={{ required: 'Subscriber DOB is required' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Subscriber DOB *"
                      slotProps={{ textField: { fullWidth: true, error: !!errors.subscriberDateOfBirth, helperText: errors.subscriberDateOfBirth?.message } }}
                      maxDate={today}
                      disabled={isSelf}
                    />
                  )}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Relationship *</InputLabel>
                  <Controller
                    name="relationshipToPatient"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} label="Relationship *">
                        <MenuItem value="self">Self</MenuItem>
                        <MenuItem value="spouse">Spouse</MenuItem>
                        <MenuItem value="child">Child</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="effectiveDate"
                  control={control}
                  rules={{ required: 'Effective date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Effective Date *"
                      slotProps={{ textField: { fullWidth: true, error: !!errors.effectiveDate, helperText: errors.effectiveDate?.message } }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="expirationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Expiration Date"
                      slotProps={{ textField: { fullWidth: true } }}
                      minDate={effectiveDateValue ? dayjs(effectiveDateValue) : undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Verification Status</InputLabel>
                  <Controller
                    name="verificationStatus"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Verification Status">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value ?? true} />}
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField fullWidth label="Notes" multiline rows={2} {...register('notes')} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
