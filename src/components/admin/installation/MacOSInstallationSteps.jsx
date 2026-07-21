import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView'; // alternative to apple icon to keep style consistent with WindowIcon, or just use AppleIcon
import AppleIcon from '@mui/icons-material/Apple';
import GetAppIcon from '@mui/icons-material/GetApp';
import InstallationStepCard from './InstallationStepCard';
import SystemRequirementsCard from './SystemRequirementsCard';

const MacOSInstallationSteps = () => {
  const requirements = [
    'OS: macOS Monterey 12 or newer',
    'CPU: Apple Silicon (M1, M2, M3) or Intel Core i5',
    'RAM: 8 GB minimum (16 GB recommended)',
    'Hardware support: macOS-supported intraoral camera drivers',
    'Network: Active broadband internet connection'
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Side: Steps */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <InstallationStepCard 
            title="Step 1: Download The MacOS Disk Image Bundle"
            description={<>Download the secure package installer for macOS. This package includes both Intel and Apple Silicon native compilation formats to ensure optimal workstation performance.</>}
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
              Download OryxImagingBundle.dmg (95 MB)
            </Button>
          </InstallationStepCard>

          <InstallationStepCard 
            title="Step 2: Install The Application"
            description={<>Double-click the downloaded OryxImagingBundle.dmg file. In the window that opens, drag the Oryx Imaging icon directly into your macOS Applications shortcut folder.</>}
          />

          <InstallationStepCard 
            title="Step 3: Allow Privacy &amp; Security Permissions"
            description={<>Due to macOS Gatekeeper, you may need to authorize the application. Go to System Settings &gt; Privacy &amp; Security. Under "Security", click Open Anyway next to Oryx Imaging to confirm launch permissions.</>}
          />

          <InstallationStepCard 
            title="Step 4: Launch And Sync"
            description={<>Launch the app from your Applications list. Select "Allow local network access" if prompted. Log in with your clinical registration keys to sync Oryx Imaging with your administrative database workstation.</>}
          />
        </Box>

        {/* Right Side: System Requirements Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '350px', lg: '450px' }, flexShrink: 0 }}>
          <SystemRequirementsCard osName="macOS" requirements={requirements} />
        </Box>
      </Box>
    </Box>
  );
};

export default MacOSInstallationSteps;
