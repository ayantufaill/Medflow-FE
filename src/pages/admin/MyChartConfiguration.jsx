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
  onChange,
  onRequiredStatusChange
}) => (
  <Box sx={{ mb: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{label}</Typography>
        {hasInfo && (
          <Tooltip title="Information">
            <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
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
      <Box sx={{ ml: 0.5 }}>
        <Typography variant="caption" color="textSecondary">Required Settings:</Typography>
        <RadioGroup 
          row 
          value={requiredStatus}
          onChange={(e) => onRequiredStatusChange && onRequiredStatusChange(e.target.value)}
        >
          <FormControlLabel value="required" control={<Radio size="small" />} label={<Typography variant="body2">Required</Typography>} />
          <FormControlLabel value="optional" control={<Radio size="small" />} label={<Typography variant="body2">Optional</Typography>} />
        </RadioGroup>
      </Box>
    )}
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
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: '#f4f6f8', 
      minHeight: '100vh', 
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ width: '100%', maxWidth: 1400 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              component={RouterLink}
              to="/admin/practice-setup"
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Practice Setup
            </Typography>
            <Typography variant="caption" color="textSecondary">{'>'}</Typography>
            <Typography variant="caption" color="textSecondary">MyChart Configuration</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
          >
            Save Configuration
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT COLUMN: Visuals & Payments */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Colors</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleResetColors}
                  sx={{ textTransform: 'none' }}
                >
                  Reset Colors
                </Button>
              </Box>
              
              {colorMapping.map(({ label, key }) => (
                <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="body2">{label}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {(settings.colors[key] || '#ffffff').toUpperCase()}
                    </Typography>
                    <input
                      type="color"
                      value={settings.colors[key] || '#ffffff'}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '28px',
                        height: '24px',
                        padding: 0,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    />
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>Patient Payment</Typography>
              <Box display="flex" flexDirection="column">
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={settings.patientPayment.includeAchPayment} 
                      onChange={(e) => handlePatientPaymentChange('includeAchPayment', e.target.checked)} 
                    />
                  } 
                  label={<Typography variant="body2">Include ACH Payment</Typography>} 
                />
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={settings.patientPayment.addPaymentAsQuickDeposit} 
                      onChange={(e) => handlePatientPaymentChange('addPaymentAsQuickDeposit', e.target.checked)} 
                    />
                  } 
                  label={<Typography variant="body2">Add payment as a quick deposit</Typography>} 
                />
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={settings.patientPayment.allowPatientToEditQuickPaymentAmount} 
                      onChange={(e) => handlePatientPaymentChange('allowPatientToEditQuickPaymentAmount', e.target.checked)} 
                    />
                  } 
                  label={<Typography variant="body2">Allow patient to edit quick payment amount</Typography>} 
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>Google Measurement ID Setup</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="G-XXXXXXXXXX" 
                value={settings.googleMeasurementId}
                onChange={(e) => handleGoogleIdChange(e.target.value)}
                sx={{ maxWidth: 350, mt: 1 }} 
              />
            </Paper>
          </Grid>

          {/* RIGHT COLUMN: Patient Info & General Sections */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold">Confidential Information</Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mb: 3, display: 'block' }}>
                Setting up the configuration here will apply to MyChart and Oryx Docs
              </Typography>

              <ConfigRow 
                label="Patient's Legal Name" 
                hasInfo 
                checked={settings.confidentialInfo.patientLegalName.enabled}
                requiredStatus={settings.confidentialInfo.patientLegalName.requiredStatus}
                onChange={(val) => handleConfidentialInfoChange('patientLegalName', 'enabled', val)}
                onRequiredStatusChange={(val) => handleConfidentialInfoChange('patientLegalName', 'requiredStatus', val)}
              />
              
              <ConfigRow 
                label="Preferred Pronouns" 
                showStatus={false} 
                checked={settings.confidentialInfo.preferredPronouns.enabled}
                onChange={(val) => handleConfidentialInfoChange('preferredPronouns', 'enabled', val)}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle2" fontWeight="bold">Patient's Information</Typography>
                    <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                  </Box>
                  <Switch 
                    size="small" 
                    checked={settings.patientInfo.enabled} 
                    onChange={(e) => handlePatientInfoChange('enabled', e.target.checked)}
                  />
                </Box>
                
                <Box sx={{ ml: 3, mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight="500">Gender Identity (for adults only)</Typography>
                    <Switch 
                      size="small" 
                      checked={settings.patientInfo.genderIdentity.enabled} 
                      onChange={(e) => handleGenderIdentityChange('enabled', e.target.checked)}
                      disabled={!settings.patientInfo.enabled}
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ opacity: settings.patientInfo.enabled && settings.patientInfo.genderIdentity.enabled ? 1 : 0.5 }}>
                    Select gender options:
                  </Typography>
                  <Grid container>
                    {['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'].map((g) => (
                      <Grid item xs={6} key={g}>
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small" 
                              checked={settings.patientInfo.genderIdentity.options[g]} 
                              onChange={(e) => handleGenderOptionChange(g, e.target.checked)}
                              disabled={!settings.patientInfo.enabled || !settings.patientInfo.genderIdentity.enabled}
                            />
                          } 
                          label={<Typography variant="caption" sx={{ opacity: settings.patientInfo.enabled && settings.patientInfo.genderIdentity.enabled ? 1 : 0.5 }}>{g}</Typography>} 
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

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Patient's Phone Number</Typography>
              <ConfigRow 
                label="Home Phone Number" 
                checked={settings.phoneNumber.homePhone.enabled}
                requiredStatus={settings.phoneNumber.homePhone.requiredStatus}
                onChange={(val) => handlePhoneNumberChange('homePhone', 'enabled', val)}
                onRequiredStatusChange={(val) => handlePhoneNumberChange('homePhone', 'requiredStatus', val)}
              />
              <ConfigRow 
                label="Work Phone Number" 
                checked={settings.phoneNumber.workPhone.enabled}
                requiredStatus={settings.phoneNumber.workPhone.requiredStatus}
                onChange={(val) => handlePhoneNumberChange('workPhone', 'enabled', val)}
                onRequiredStatusChange={(val) => handlePhoneNumberChange('workPhone', 'requiredStatus', val)}
              />

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>General Sections</Typography>
              <ConfigRow 
                label="Additional Info (for pedo only)" 
                hasInfo 
                checked={settings.generalSections.additionalInfoPedo.enabled}
                requiredStatus={settings.generalSections.additionalInfoPedo.requiredStatus}
                onChange={(val) => handleGeneralSectionsChange('additionalInfoPedo', 'enabled', val)}
                onRequiredStatusChange={(val) => handleGeneralSectionsChange('additionalInfoPedo', 'requiredStatus', val)}
              />
              <ConfigRow 
                label="Emergency Contact Information" 
                hasInfo 
                checked={settings.generalSections.emergencyContact.enabled}
                requiredStatus={settings.generalSections.emergencyContact.requiredStatus}
                onChange={(val) => handleGeneralSectionsChange('emergencyContact', 'enabled', val)}
                onRequiredStatusChange={(val) => handleGeneralSectionsChange('emergencyContact', 'requiredStatus', val)}
              />
              <ConfigRow 
                label="Release Information" 
                hasInfo 
                checked={settings.generalSections.releaseInformation.enabled}
                requiredStatus={settings.generalSections.releaseInformation.requiredStatus}
                onChange={(val) => handleGeneralSectionsChange('releaseInformation', 'enabled', val)}
                onRequiredStatusChange={(val) => handleGeneralSectionsChange('releaseInformation', 'requiredStatus', val)}
              />
              <ConfigRow 
                label="Spouse Information" 
                hasInfo 
                checked={settings.generalSections.spouseInformation.enabled}
                requiredStatus={settings.generalSections.spouseInformation.requiredStatus}
                onChange={(val) => handleGeneralSectionsChange('spouseInformation', 'enabled', val)}
                onRequiredStatusChange={(val) => handleGeneralSectionsChange('spouseInformation', 'requiredStatus', val)}
              />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">Dental Insurance And Financial Information</Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                </Box>
                <Switch 
                  size="small" 
                  checked={settings.dentalInsuranceFinancial.enabled} 
                  onChange={(e) => handleDentalInsuranceFinancialChange('enabled', e.target.checked)}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyChartConfiguration;
