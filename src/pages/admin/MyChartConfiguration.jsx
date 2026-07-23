import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
  Paper,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PaletteIcon from '@mui/icons-material/Palette';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  createPracticeInfo,
  updateMyChartSettings,
  selectPracticeInfo,
  selectPracticeInfoLoading
} from '../../store/slices/practiceInfoSlice';

// Reusable component for the repeated "Label + Switch + Required/Optional" pattern
const ConfigRow = ({
  label,
  hasInfo = false,
  showStatus = true,
  checked = true,
  requiredStatus = 'optional',
  hasDivider = false,
  onChange,
  onRequiredStatusChange
}) => (
  <Box sx={{ mb: 0 }}>
    <Box sx={{ py: 1.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4B5563', fontSize: '0.85rem' }}>{label}</Typography>
          {hasInfo && (
            <Tooltip title="Information">
              <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: '#9CA3AF' }} />
            </Tooltip>
          )}
        </Box>
        <Switch
          size="small"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
      </Box>
      {showStatus && (
        <Box sx={{ ml: 0 }}>
          <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem', mb: 0.5, display: 'block' }}>Required Settings:</Typography>
          <RadioGroup
            row
            value={requiredStatus}
            onChange={(e) => onRequiredStatusChange && onRequiredStatusChange(e.target.value)}
          >
            <FormControlLabel
              value="required"
              control={<Radio size="small" sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0.5 }} />}
              label={<Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>Required</Typography>}
              sx={{ mr: 3, ml: 0 }}
            />
            <FormControlLabel
              value="optional"
              control={<Radio size="small" sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0.5 }} />}
              label={<Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>Optional</Typography>}
              sx={{ ml: 0 }}
            />
          </RadioGroup>
        </Box>
      )}
    </Box>
    {hasDivider && <Divider sx={{ borderColor: '#f3f4f6' }} />}
  </Box>
);

const colorMapping = [
  { label: 'Primary Font Color', key: 'primaryFontColor' },
  { label: 'Secondary Font Color', key: 'secondaryFontColor' },
  { label: 'Page Background Color', key: 'pageBackgroundColor' },
  { label: 'Section Background Color', key: 'sectionBackgroundColor' },
  { label: 'Primary Color', key: 'primaryColor' },
  { label: 'Secondary Color', key: 'secondaryColor' },
];

const defaultSettings = {
  colors: {
    primaryFontColor: '#333333',
    secondaryFontColor: '#ffffff',
    pageBackgroundColor: '#ffffff',
    sectionBackgroundColor: '#ffffff',
    primaryColor: '#333333',
    secondaryColor: '#ffffff',
  },
  patientPayment: {
    includeAchPayment: true,
    addPaymentAsQuickDeposit: false,
    allowPatientToEditQuickPaymentAmount: true,
  },
  googleMeasurementId: '',
  confidentialInfo: {
    patientLegalName: { enabled: true, requiredStatus: 'optional' },
    preferredPronouns: { enabled: true },
    maritalStatus: { enabled: true, requiredStatus: 'optional' },
  },
  patientInfo: {
    enabled: true,
    genderIdentity: {
      enabled: true,
      options: {
        'Male/Man': true,
        'Female/Woman': true,
        'Trans Male': true,
        'Trans Female': true,
        'Nonbinary': true,
        'Another Gender': true,
        'Decline': true,
      }
    }
  },
  phoneNumber: {
    homePhone: { enabled: true, requiredStatus: 'required' },
    workPhone: { enabled: true, requiredStatus: 'optional' },
  },
  generalSections: {
    additionalInfoPedo: { enabled: true, requiredStatus: 'optional' },
    emergencyContact: { enabled: true, requiredStatus: 'required' },
    releaseInformation: { enabled: true, requiredStatus: 'required' },
    spouseInformation: { enabled: true, requiredStatus: 'optional' },
  },
  dentalInsuranceFinancial: {
    enabled: true,
  }
};

const deepMerge = (target, source) => {
  if (!source) return target;
  const output = { ...target };
  Object.keys(target).forEach((key) => {
    if (source[key] !== undefined) {
      if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  });
  return output;
};

const MyChartConfiguration = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const { showSnackbar } = useSnackbar();
  const practiceInfo = useSelector(selectPracticeInfo);
  const loading = useSelector(selectPracticeInfoLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (practiceInfo?.myChartSettings && Object.keys(practiceInfo.myChartSettings).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(prev => deepMerge(prev, practiceInfo.myChartSettings));
    }
  }, [practiceInfo?.myChartSettings]);

  const handleSave = async () => {
    try {
      let id = practiceInfo?._id || practiceInfo?.id;
      if (!id) {
        // Auto-create a default practice info so the user is unblocked
        const newPractice = await dispatch(createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: {
            line1: '123 Default St',
            city: 'Metropolis',
            state: 'NY',
            postalCode: '10001',
            country: 'United States'
          }
        })).unwrap();
        id = newPractice._id || newPractice.id;
      }

      await dispatch(updateMyChartSettings({
        practiceInfoId: id,
        mychartSettingsData: settings
      })).unwrap();
      showSnackbar('MyChart configuration saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save MyChart configuration', 'error');
    }
  };

  const handleColorChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleResetColors = () => {
    setSettings(prev => ({
      ...prev,
      colors: { ...defaultSettings.colors }
    }));
  };

  const handlePatientPaymentChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      patientPayment: {
        ...prev.patientPayment,
        [key]: value
      }
    }));
  };

  const handleGoogleIdChange = (value) => {
    setSettings(prev => ({
      ...prev,
      googleMeasurementId: value
    }));
  };

  const handleConfidentialInfoChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      confidentialInfo: {
        ...prev.confidentialInfo,
        [key]: {
          ...prev.confidentialInfo[key],
          [field]: value
        }
      }
    }));
  };

  const handlePatientInfoChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value
      }
    }));
  };

  const handleGenderIdentityChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        genderIdentity: {
          ...prev.patientInfo.genderIdentity,
          [field]: value
        }
      }
    }));
  };

  const handleGenderOptionChange = (option, value) => {
    setSettings(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        genderIdentity: {
          ...prev.patientInfo.genderIdentity,
          options: {
            ...prev.patientInfo.genderIdentity.options,
            [option]: value
          }
        }
      }
    }));
  };

  const handlePhoneNumberChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      phoneNumber: {
        ...prev.phoneNumber,
        [key]: {
          ...prev.phoneNumber[key],
          [field]: value
        }
      }
    }));
  };

  const handleGeneralSectionsChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      generalSections: {
        ...prev.generalSections,
        [key]: {
          ...prev.generalSections[key],
          [field]: value
        }
      }
    }));
  };

  const handleDentalInsuranceFinancialChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      dentalInsuranceFinancial: {
        ...prev.dentalInsuranceFinancial,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 3 }}>MyChart Configuration</Typography>

          <Box sx={{ display: 'flex', gap: 2.5, width: '100%', mb: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* ROW 1 */}
            <Box sx={{ flex: { xs: '1 1 auto', md: 3 } }}>
              {/* Colors Section */}
              <Paper sx={{ height: '100%', mb: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} elevation={0}>
                {/* Header */}
                <Box sx={{ bgcolor: '#f8fafc', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PaletteIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: '#111827' }}>COLORS</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Brand appearance</Typography>
                  </Box>
                </Box>

                {/* Body */}
                <Box sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleResetColors}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        py: 0.5,
                        px: 1.5,
                        color: '#3b82f6',
                        borderColor: '#3b82f6',
                        '&:hover': {
                          borderColor: '#2563eb',
                          bgcolor: '#eff6ff'
                        }
                      }}
                    >
                      Reset Colors
                    </Button>
                  </Box>

                  {colorMapping.map(({ label, key }) => (
                    <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 500 }}>{label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {(settings.colors[key] || '#ffffff').toLowerCase()}
                        </Typography>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 1,
                            border: '1px solid #e5e7eb',
                            backgroundColor: settings.colors[key] || '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <input
                            type="color"
                            value={settings.colors[key] || '#ffffff'}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            style={{
                              opacity: 0,
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
            <Box sx={{ flex: { xs: '1 1 auto', md: 5 } }}>
              {/* Payment & Analytics Section */}
              <Paper sx={{ height: '100%', mb: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} elevation={0}>
                {/* Header */}
                <Box sx={{ bgcolor: '#f8fafc', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCardIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: '#111827' }}>PATIENT PAYMENT & ANALYTICS</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Billing options and tracking setup</Typography>
                  </Box>
                </Box>

                {/* Body */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: '0.85rem', color: '#111827', mb: 1.5 }}>Payment Options</Typography>
                  <Box display="flex" flexDirection="column" sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={settings.patientPayment.includeAchPayment}
                          onChange={(e) => handlePatientPaymentChange('includeAchPayment', e.target.checked)}
                          sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0.5 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.85rem', color: '#4B5563' }}>Include ACH Payment</Typography>}
                      sx={{ mb: 0.5, ml: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={settings.patientPayment.addPaymentAsQuickDeposit}
                          onChange={(e) => handlePatientPaymentChange('addPaymentAsQuickDeposit', e.target.checked)}
                          sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0.5 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.85rem', color: '#4B5563' }}>Add payment as a quick deposit</Typography>}
                      sx={{ mb: 0.5, ml: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={settings.patientPayment.allowPatientToEditQuickPaymentAmount}
                          onChange={(e) => handlePatientPaymentChange('allowPatientToEditQuickPaymentAmount', e.target.checked)}
                          sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0.5 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.85rem', color: '#4B5563' }}>Allow patient to edit quick payment amount</Typography>}
                      sx={{ ml: 0 }}
                    />
                  </Box>

                  <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: '0.85rem', color: '#111827', mb: 1 }}>Google Measurement ID</Typography>
                  <TextField
                    size="small"
                    placeholder="G-XXXXXXXXXX"
                    value={settings.googleMeasurementId}
                    onChange={(e) => handleGoogleIdChange(e.target.value)}
                    inputProps={{ style: { fontSize: '0.85rem', color: '#4B5563' } }}
                    sx={{
                      width: '60%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': { borderColor: '#d1d5db' },
                        '&:hover fieldset': { borderColor: '#9ca3af' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Box>
            <Box sx={{ flex: { xs: '1 1 auto', md: 4 } }}>
              {/* Phone Numbers Section */}
              <Paper sx={{ height: '100%', mb: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} elevation={0}>
                {/* Header */}
                <Box sx={{ bgcolor: '#f8fafc', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneOutlinedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: '#111827' }}>PHONE NUMBERS</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Home & work contact numbers</Typography>
                  </Box>
                </Box>
                {/* Body */}
                <Box sx={{ px: 2, pb: 1 }}>
                  <ConfigRow
                    label="Home Phone Number"
                    checked={settings.phoneNumber.homePhone.enabled}
                    requiredStatus={settings.phoneNumber.homePhone.requiredStatus}
                    onChange={(val) => handlePhoneNumberChange('homePhone', 'enabled', val)}
                    onRequiredStatusChange={(val) => handlePhoneNumberChange('homePhone', 'requiredStatus', val)}
                    hasDivider={true}
                  />
                  <ConfigRow
                    label="Work Phone Number"
                    checked={settings.phoneNumber.workPhone.enabled}
                    requiredStatus={settings.phoneNumber.workPhone.requiredStatus}
                    onChange={(val) => handlePhoneNumberChange('workPhone', 'enabled', val)}
                    onRequiredStatusChange={(val) => handlePhoneNumberChange('workPhone', 'requiredStatus', val)}
                  />
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2.5, width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* ROW 2 */}
            <Box sx={{ flex: { xs: '1 1 auto', md: 3 } }}>
              {/* Identity & Legal Name Section */}
              <Paper sx={{ height: '100%', mb: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} elevation={0}>
                {/* Header */}
                <Box sx={{ bgcolor: '#f8fafc', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PersonOutlineIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: '#111827' }}>IDENTITY & LEGAL NAME</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Name, pronouns, gender & marital status</Typography>
                  </Box>
                </Box>
                {/* Body */}
                <Box sx={{ px: 2, py: 1 }}>
                  <ConfigRow
                    label="Patient's Legal Name"
                    hasInfo
                    checked={settings.confidentialInfo.patientLegalName.enabled}
                    requiredStatus={settings.confidentialInfo.patientLegalName.requiredStatus}
                    onChange={(val) => handleConfidentialInfoChange('patientLegalName', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleConfidentialInfoChange('patientLegalName', 'requiredStatus', val)}
                    hasDivider={true}
                  />

                  <ConfigRow
                    label="Preferred Pronouns"
                    showStatus={false}
                    checked={settings.confidentialInfo.preferredPronouns.enabled}
                    onChange={(val) => handleConfidentialInfoChange('preferredPronouns', 'enabled', val)}
                    hasDivider={true}
                  />

                  <ConfigRow
                    label="Patient's Information"
                    hasInfo
                    showStatus={false}
                    checked={settings.patientInfo.enabled}
                    onChange={(val) => handlePatientInfoChange('enabled', val)}
                    hasDivider={false}
                  />

                  {/* Nested Gender Identity Box */}
                  <Box sx={{ bgcolor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 2, p: 1.5, mt: 0.5, mb: 2.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography sx={{ fontWeight: 500, color: '#4B5563', fontSize: '0.85rem' }}>Gender Identity (adults only)</Typography>
                      <Switch
                        size="small"
                        checked={settings.patientInfo.genderIdentity.enabled}
                        onChange={(e) => handleGenderIdentityChange('enabled', e.target.checked)}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem', mb: 1, display: 'block' }}>Select gender options:</Typography>
                    <Grid container spacing={0}>
                      {['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'].map((g) => (
                        <Grid item xs={12} sm={6} lg={4} key={g}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={settings.patientInfo.genderIdentity.options[g]}
                                onChange={(e) => handleGenderOptionChange(g, e.target.checked)}
                                disabled={!settings.patientInfo.genderIdentity.enabled}
                                sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5, mr: 0 }}
                              />
                            }
                            label={<Typography variant="caption" sx={{ fontSize: '0.8rem', color: '#4B5563' }}>{g}</Typography>}
                            sx={{ mb: 0, ml: 0 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <ConfigRow
                    label="Marital Status"
                    hasInfo
                    checked={settings.confidentialInfo.maritalStatus.enabled}
                    requiredStatus={settings.confidentialInfo.maritalStatus.requiredStatus}
                    onChange={(val) => handleConfidentialInfoChange('maritalStatus', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleConfidentialInfoChange('maritalStatus', 'requiredStatus', val)}
                  />
                </Box>
              </Paper>
            </Box>
            <Box sx={{ flex: { xs: '1 1 auto', md: 9 } }}>
              {/* General Sections */}
              <Paper sx={{ height: '100%', mb: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} elevation={0}>
                {/* Header */}
                <Box sx={{ bgcolor: '#f8fafc', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, bgcolor: '#eff6ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ListAltIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem', color: '#111827' }}>GENERAL SECTIONS</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Additional forms shown to patients</Typography>
                  </Box>
                </Box>
                {/* Body */}
                <Box sx={{ px: 2, py: 1 }}>
                  <ConfigRow
                    label="Additional Info (pedo only)"
                    hasInfo
                    checked={settings.generalSections.additionalInfoPedo.enabled}
                    requiredStatus={settings.generalSections.additionalInfoPedo.requiredStatus}
                    onChange={(val) => handleGeneralSectionsChange('additionalInfoPedo', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleGeneralSectionsChange('additionalInfoPedo', 'requiredStatus', val)}
                    hasDivider={true}
                  />
                  <ConfigRow
                    label="Emergency Contact Information"
                    hasInfo
                    checked={settings.generalSections.emergencyContact.enabled}
                    requiredStatus={settings.generalSections.emergencyContact.requiredStatus}
                    onChange={(val) => handleGeneralSectionsChange('emergencyContact', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleGeneralSectionsChange('emergencyContact', 'requiredStatus', val)}
                    hasDivider={true}
                  />
                  <ConfigRow
                    label="Release Information"
                    hasInfo
                    checked={settings.generalSections.releaseInformation.enabled}
                    requiredStatus={settings.generalSections.releaseInformation.requiredStatus}
                    onChange={(val) => handleGeneralSectionsChange('releaseInformation', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleGeneralSectionsChange('releaseInformation', 'requiredStatus', val)}
                    hasDivider={true}
                  />
                  <ConfigRow
                    label="Spouse Information"
                    hasInfo
                    checked={settings.generalSections.spouseInformation.enabled}
                    requiredStatus={settings.generalSections.spouseInformation.requiredStatus}
                    onChange={(val) => handleGeneralSectionsChange('spouseInformation', 'enabled', val)}
                    onRequiredStatusChange={(val) => handleGeneralSectionsChange('spouseInformation', 'requiredStatus', val)}
                    hasDivider={true}
                  />
                  <ConfigRow
                    label="Dental Insurance And Financial Information"
                    hasInfo
                    showStatus={false}
                    checked={settings.dentalInsuranceFinancial.enabled}
                    onChange={(val) => handleDentalInsuranceFinancialChange('enabled', val)}
                    hasDivider={false}
                  />
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4, py: 1.2 }}
            >
              Save Configuration
            </Button>
          </Box>
    </>
  );
};

export default MyChartConfiguration;
