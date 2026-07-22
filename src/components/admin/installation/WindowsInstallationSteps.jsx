import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import GetAppIcon from '@mui/icons-material/GetApp';
import InstallationStepCard from './InstallationStepCard';
import SystemRequirementsCard from './SystemRequirementsCard';

const WindowsInstallationSteps = () => {
  const requirements = [
    'OS: Windows 10 or 11 (64-bit Pro recommended)',
    'CPU: Intel Core i5 / AMD Ryzen 5 or higher',
    'RAM: 8 GB minimum (16 GB recommended)',
    'USB: USB 3.0 port for hardware sensors',
    'Network: Active high-speed broadband connection'
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Side: Steps */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <InstallationStepCard 
            title="Step 1: Download The Oryx Imaging Installer"
            description={<>Download the certified MSI installer packet for windows. This download contains the drivers and system service utility required to require to establish bridge cummunication between your local X-ray sensor/intraoral cameras and teh oryx clous system</>}
          >
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              sx={{
                backgroundColor: '#2F6FED',
                color: '#fff',
                textTransform: 'none',
                fontSize: '12px',
                borderRadius: '8px',
                boxShadow: 'none',
                px: 2,
                py: 1,
                '&:hover': { backgroundColor: '#2558be', boxShadow: 'none' }
              }}
            >
              Download OryxImagingSetup.msi (112MB)
            </Button>
          </InstallationStepCard>

          <InstallationStepCard 
            title="Step 2: Run The Setup Wizard"
            description={<>Once the download is complete, locate the OryxImagingSetup.msi file in your downloads folder. Double-click it to run the installer. If a Windows User Account Control prompt appears, click Yes to grant administration privilege. Follow the prompt wizard and click Finish.</>}
          />

          <InstallationStepCard 
            title="Step 3: Connect And Activate Workstation Device"
            description={<>Connect your X-ray sensor or intraoral camera to an active USB port. Open the Oryx Imaging client from the newly created Desktop shortcut. Fill in your clinic authentication keys and select the appropriate workstation name. The sensor integration status will light up green once ready.</>}
          />
        </Box>

        {/* Right Side: System Requirements Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '350px', lg: '450px' }, flexShrink: 0 }}>
          <SystemRequirementsCard osName="Windows" requirements={requirements} />
        </Box>
      </Box>
    </Box>
  );
};

export default WindowsInstallationSteps;
