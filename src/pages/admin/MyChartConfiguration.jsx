import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { practiceInfoService } from '../../services/practice-info.service';

// Reusable component for the repeated "Label + Switch + Required/Optional" pattern
const ConfigRow = ({ 
  label, 
  hasInfo = false, 
  showStatus = true, 
  checked, 
  onToggle, 
  requirement, 
  onRequirementChange 
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
        checked={!!checked} 
        onChange={(e) => onToggle(e.target.checked)} 
      />
    </Box>
    {showStatus && (
      <Box sx={{ ml: 0.5 }}>
        <Typography variant="caption" color="textSecondary">Required Settings:</Typography>
        <RadioGroup 
          row 
          value={requirement || 'optional'} 
          onChange={(e) => onRequirementChange(e.target.value)}
        >
          <FormControlLabel value="required" control={<Radio size="small" />} label={<Typography variant="body2">Required</Typography>} />
          <FormControlLabel value="optional" control={<Radio size="small" />} label={<Typography variant="body2">Optional</Typography>} />
        </RadioGroup>
      </Box>
    )}
  </Box>
);

const MyChartConfiguration = () => {
  const [loading, setLoading] = useState(true);
  const [practiceId, setPracticeId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const isInitialMount = useRef(true);
  const saveTimeout = useRef(null);

  const [config, setConfig] = useState({
    colors: {
      primaryFont: '#333333',
      secondaryFont: '#ffffff',
      pageBackground: '#ffffff',
      sectionBackground: '#ffffff',
      primary: '#333333',
      secondary: '#ffffff'
    },
    payment: {
      includeAch: true,
      quickDeposit: false,
      allowEditAmount: true
    },
    googleMeasurementId: '',
    rows: {
      legalName: { enabled: true, requirement: 'optional' },
      pronouns: { enabled: true },
      patientInfo: { enabled: true },
      genderIdentity: { enabled: true, options: ['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'] },
      maritalStatus: { enabled: true, requirement: 'optional' },
      homePhone: { enabled: true, requirement: 'required' },
      workPhone: { enabled: true, requirement: 'optional' },
      additionalInfoPedo: { enabled: true, requirement: 'optional' },
      emergencyContact: { enabled: true, requirement: 'required' },
      releaseInfo: { enabled: true, requirement: 'required' },
      spouseInfo: { enabled: true, requirement: 'optional' },
      insuranceFinancialInfo: { enabled: true }
    }
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await practiceInfoService.getCurrentPracticeInfo();
        if (data) {
          setPracticeId(data._id || data.id);
          if (data.myChartSettings && Object.keys(data.myChartSettings).length > 0) {
            setConfig(prev => ({
              ...prev,
              ...data.myChartSettings
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load MyChart config:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Autosave Logic
  const performSave = useCallback(async (currentConfig) => {
    if (!practiceId) return;
    setSaving(true);
    try {
      await practiceInfoService.updateMyChartSettings(practiceId, currentConfig);
      setStatus({ type: 'success', message: 'Changes saved automatically' });
    } catch (err) {
      console.error('Autosave error:', err);
      setStatus({ type: 'error', message: 'Failed to autosave' });
    } finally {
      setSaving(false);
      // Clear message after 2 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 2000);
    }
  }, [practiceId]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      performSave(config);
    }, 1000); // Wait for 1 second of inactivity before saving

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [config, performSave]);

  const updateColor = (key, value) => {
    setConfig(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const updatePayment = (key, value) => {
    setConfig(prev => ({
      ...prev,
      payment: { ...prev.payment, [key]: value }
    }));
  };

  const updateRow = (key, field, value) => {
    setConfig(prev => ({
      ...prev,
      rows: {
        ...prev.rows,
        [key]: { ...prev.rows[key], [field]: value }
      }
    }));
  };

  const toggleGenderOption = (option) => {
    const currentOptions = config.rows.genderIdentity.options || [];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter(o => o !== option)
      : [...currentOptions, option];
    
    updateRow('genderIdentity', 'options', newOptions);
  };

  const resetColors = () => {
    updateColor('primaryFont', '#333333');
    updateColor('secondaryFont', '#ffffff');
    updateColor('pageBackground', '#ffffff');
    updateColor('sectionBackground', '#ffffff');
    updateColor('primary', '#333333');
    updateColor('secondary', '#ffffff');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
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
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
        {saving && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="caption" color="textSecondary">Saving...</Typography>
          </Box>
        )}
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
                sx={{ textTransform: 'none' }}
                onClick={resetColors}
              >
                Reset Colors
              </Button>
            </Box>
            
            {[
              { label: 'Primary Font Color', key: 'primaryFont' },
              { label: 'Secondary Font Color', key: 'secondaryFont' },
              { label: 'Page Background Color', key: 'pageBackground' },
              { label: 'Section Background Color', key: 'sectionBackground' },
              { label: 'Primary Color', key: 'primary' },
              { label: 'Secondary Color', key: 'secondary' }
            ].map((item) => (
              <Box key={item.key} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="body2">{item.label}</Typography>
                <Box 
                  onClick={() => document.getElementById(`color-input-${item.key}`).click()}
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    border: '1px solid #ddd', 
                    borderRadius: 0.5, 
                    bgcolor: config.colors[item.key],
                    cursor: 'pointer'
                  }} 
                />
                <input
                  id={`color-input-${item.key}`}
                  type="color"
                  value={config.colors[item.key]}
                  onChange={(e) => updateColor(item.key, e.target.value)}
                  style={{ display: 'none' }}
                />
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Patient Payment</Typography>
            <Box display="flex" flexDirection="column">
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={config.payment.includeAch} 
                    onChange={(e) => updatePayment('includeAch', e.target.checked)}
                  />
                } 
                label={<Typography variant="body2">Include ACH Payment</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={config.payment.quickDeposit} 
                    onChange={(e) => updatePayment('quickDeposit', e.target.checked)}
                  />
                } 
                label={<Typography variant="body2">Add payment as a quick deposit</Typography>} 
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={config.payment.allowEditAmount} 
                    onChange={(e) => updatePayment('allowEditAmount', e.target.checked)}
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
              sx={{ maxWidth: 350, mt: 1 }} 
              value={config.googleMeasurementId}
              onChange={(e) => setConfig(prev => ({ ...prev, googleMeasurementId: e.target.value }))}
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
              checked={config.rows.legalName.enabled}
              onToggle={(v) => updateRow('legalName', 'enabled', v)}
              requirement={config.rows.legalName.requirement}
              onRequirementChange={(v) => updateRow('legalName', 'requirement', v)}
            />
            
            <ConfigRow 
              label="Preferred Pronouns" 
              showStatus={false} 
              checked={config.rows.pronouns.enabled}
              onToggle={(v) => updateRow('pronouns', 'enabled', v)}
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
                  checked={config.rows.patientInfo.enabled}
                  onChange={(e) => updateRow('patientInfo', 'enabled', e.target.checked)}
                />
              </Box>
              
              <Box sx={{ ml: 3, mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="500">Gender Identity (for adults only)</Typography>
                  <Switch 
                    size="small" 
                    checked={config.rows.genderIdentity.enabled}
                    onChange={(e) => updateRow('genderIdentity', 'enabled', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary">Select gender options:</Typography>
                <Grid container>
                  {['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'].map((g) => (
                    <Grid item xs={6} key={g}>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            size="small" 
                            checked={config.rows.genderIdentity.options.includes(g)}
                            onChange={() => toggleGenderOption(g)}
                          />
                        } 
                        label={<Typography variant="caption">{g}</Typography>} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <ConfigRow 
                label="Marital Status" 
                hasInfo 
                checked={config.rows.maritalStatus.enabled}
                onToggle={(v) => updateRow('maritalStatus', 'enabled', v)}
                requirement={config.rows.maritalStatus.requirement}
                onRequirementChange={(v) => updateRow('maritalStatus', 'requirement', v)}
              />
            </Box>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Patient's Phone Number</Typography>
            <ConfigRow 
              label="Home Phone Number" 
              checked={config.rows.homePhone.enabled}
              onToggle={(v) => updateRow('homePhone', 'enabled', v)}
              requirement={config.rows.homePhone.requirement}
              onRequirementChange={(v) => updateRow('homePhone', 'requirement', v)}
            />
            <ConfigRow 
              label="Work Phone Number" 
              checked={config.rows.workPhone.enabled}
              onToggle={(v) => updateRow('workPhone', 'enabled', v)}
              requirement={config.rows.workPhone.requirement}
              onRequirementChange={(v) => updateRow('workPhone', 'requirement', v)}
            />

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>General Sections</Typography>
            <ConfigRow 
              label="Additional Info (for pedo only)" 
              hasInfo 
              checked={config.rows.additionalInfoPedo.enabled}
              onToggle={(v) => updateRow('additionalInfoPedo', 'enabled', v)}
              requirement={config.rows.additionalInfoPedo.requirement}
              onRequirementChange={(v) => updateRow('additionalInfoPedo', 'requirement', v)}
            />
            <ConfigRow 
              label="Emergency Contact Information" 
              hasInfo 
              checked={config.rows.emergencyContact.enabled}
              onToggle={(v) => updateRow('emergencyContact', 'enabled', v)}
              requirement={config.rows.emergencyContact.requirement}
              onRequirementChange={(v) => updateRow('emergencyContact', 'requirement', v)}
            />
            <ConfigRow 
              label="Release Information" 
              hasInfo 
              checked={config.rows.releaseInfo.enabled}
              onToggle={(v) => updateRow('releaseInfo', 'enabled', v)}
              requirement={config.rows.releaseInfo.requirement}
              onRequirementChange={(v) => updateRow('releaseInfo', 'requirement', v)}
            />
            <ConfigRow 
              label="Spouse Information" 
              hasInfo 
              checked={config.rows.spouseInfo.enabled}
              onToggle={(v) => updateRow('spouseInfo', 'enabled', v)}
              requirement={config.rows.spouseInfo.requirement}
              onRequirementChange={(v) => updateRow('spouseInfo', 'requirement', v)}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
               <Box display="flex" alignItems="center">
                 <Typography variant="subtitle2" fontWeight="bold">Dental Insurance And Financial Information</Typography>
                 <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
               </Box>
               <Switch 
                size="small" 
                checked={config.rows.insuranceFinancialInfo.enabled}
                onChange={(e) => updateRow('insuranceFinancialInfo', 'enabled', e.target.checked)}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Box>

      {/* Subtle feedback for autosave */}
      <Snackbar open={!!status.message} autoHideDuration={2000}>
        <Alert severity={status.type === 'error' ? 'error' : 'success'} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyChartConfiguration;
