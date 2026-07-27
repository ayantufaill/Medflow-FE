import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ConfigRow from './ConfigRow';

const GeneralSectionsConfiguration = ({ 
  generalSections, 
  onGeneralSectionsChange 
}) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>General Sections</Typography>
      <ConfigRow 
        label="Additional Info (for pedo only)" 
        hasInfo 
        checked={generalSections.additionalInfoPedo.enabled}
        requiredStatus={generalSections.additionalInfoPedo.requiredStatus}
        onChange={(val) => onGeneralSectionsChange('additionalInfoPedo', 'enabled', val)}
        onRequiredStatusChange={(val) => onGeneralSectionsChange('additionalInfoPedo', 'requiredStatus', val)}
      />
      <ConfigRow 
        label="Emergency Contact Information" 
        hasInfo 
        checked={generalSections.emergencyContact.enabled}
        requiredStatus={generalSections.emergencyContact.requiredStatus}
        onChange={(val) => onGeneralSectionsChange('emergencyContact', 'enabled', val)}
        onRequiredStatusChange={(val) => onGeneralSectionsChange('emergencyContact', 'requiredStatus', val)}
      />
      <ConfigRow 
        label="Release Information" 
        hasInfo 
        checked={generalSections.releaseInformation.enabled}
        requiredStatus={generalSections.releaseInformation.requiredStatus}
        onChange={(val) => onGeneralSectionsChange('releaseInformation', 'enabled', val)}
        onRequiredStatusChange={(val) => onGeneralSectionsChange('releaseInformation', 'requiredStatus', val)}
      />
      <ConfigRow 
        label="Spouse Information" 
        hasInfo 
        checked={generalSections.spouseInformation.enabled}
        requiredStatus={generalSections.spouseInformation.requiredStatus}
        onChange={(val) => onGeneralSectionsChange('spouseInformation', 'enabled', val)}
        onRequiredStatusChange={(val) => onGeneralSectionsChange('spouseInformation', 'requiredStatus', val)}
      />
    </Box>
  );
};

export default GeneralSectionsConfiguration;
