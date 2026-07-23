import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ConfigRow from './ConfigRow';

const ConfidentialInfoSection = ({ 
  confidentialInfo, 
  onConfidentialInfoChange 
}) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold">Confidential Information</Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 3, display: 'block' }}>
        Setting up the configuration here will apply to MyChart and Oryx Docs
      </Typography>

      <ConfigRow 
        label="Patient's Legal Name" 
        hasInfo 
        checked={confidentialInfo.patientLegalName.enabled}
        requiredStatus={confidentialInfo.patientLegalName.requiredStatus}
        onChange={(val) => onConfidentialInfoChange('patientLegalName', 'enabled', val)}
        onRequiredStatusChange={(val) => onConfidentialInfoChange('patientLegalName', 'requiredStatus', val)}
      />
      
      <ConfigRow 
        label="Preferred Pronouns" 
        showStatus={false} 
        checked={confidentialInfo.preferredPronouns.enabled}
        onChange={(val) => onConfidentialInfoChange('preferredPronouns', 'enabled', val)}
      />

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

export default ConfidentialInfoSection;
