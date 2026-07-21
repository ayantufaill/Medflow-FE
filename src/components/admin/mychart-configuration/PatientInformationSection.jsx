import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  InfoOutlinedIcon,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConfigRow from './ConfigRow';

const PatientInformationSection = ({ 
  patientInfo,
  confidentialInfo,
  onPatientInfoChange, 
  onGenderIdentityChange, 
  onGenderOptionChange,
  onConfidentialInfoChange
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2" fontWeight="bold">Patient's Information</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
        </Box>
        <Switch 
          size="small" 
          checked={patientInfo.enabled} 
          onChange={(e) => onPatientInfoChange('enabled', e.target.checked)}
        />
      </Box>
      
      <Box sx={{ ml: 3, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="500">Gender Identity (for adults only)</Typography>
          <Switch 
            size="small" 
            checked={patientInfo.genderIdentity.enabled} 
            onChange={(e) => onGenderIdentityChange('enabled', e.target.checked)}
            disabled={!patientInfo.enabled}
          />
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ opacity: patientInfo.enabled && patientInfo.genderIdentity.enabled ? 1 : 0.5 }}>
          Select gender options:
        </Typography>
        <Grid container>
          {['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'].map((g) => (
            <Grid item xs={6} key={g}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientInfo.genderIdentity.options[g]} 
                    onChange={(e) => onGenderOptionChange(g, e.target.checked)}
                    disabled={!patientInfo.enabled || !patientInfo.genderIdentity.enabled}
                  />
                } 
                label={<Typography variant="caption" sx={{ opacity: patientInfo.enabled && patientInfo.genderIdentity.enabled ? 1 : 0.5 }}>{g}</Typography>} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <ConfigRow 
        label="Marital Status" 
        hasInfo 
        checked={confidentialInfo.maritalStatus.enabled}
        requiredStatus={confidentialInfo.maritalStatus.requiredStatus}
        onChange={(val) => onConfidentialInfoChange('maritalStatus', 'enabled', val)}
        onRequiredStatusChange={(val) => onConfidentialInfoChange('maritalStatus', 'requiredStatus', val)}
      />
    </Box>
  );
};

export default PatientInformationSection;
