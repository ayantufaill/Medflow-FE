import React from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  MailOutline as MailIcon,
  Check as CheckIcon,
  PrintOutlined as PrintIcon,
  DescriptionOutlined as FileIcon,
  AccountBox as AccountBoxIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

// Note: This component is no longer used - icons are now integrated in PatientDetailActions
const IconToolbar = () => {
  const iconStyle = { color: '#1a237e', fontSize: 20 };

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ p: 0.5 }}>
      {/* 1. History / Hx Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <SyncIcon sx={iconStyle} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '8px',
              fontWeight: 'bold',
              color: '#4db6ac',
            }}
          >
            Hx
          </Box>
        </Box>
      </IconButton>

      {/* 2. Chat/Messages Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <ChatIcon sx={iconStyle} />
      </IconButton>

      {/* 3. Email with Check Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <Box sx={{ position: 'relative' }}>
          <MailIcon sx={iconStyle} />
          <CheckIcon 
            sx={{ 
              position: 'absolute', 
              bottom: -2, 
              right: -2, 
              fontSize: 10, 
              fontWeight: 'bold',
              color: '#1a237e' 
            }} 
          />
        </Box>
      </IconButton>

      {/* 4. Print Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <PrintIcon sx={iconStyle} />
      </IconButton>

      {/* 5. Document/File Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <FileIcon sx={iconStyle} />
      </IconButton>

      {/* 6. Profile/User Icon */}
      <IconButton size="small" sx={{ p: 0.5 }}>
        <AccountBoxIcon sx={{ ...iconStyle, fontSize: 22 }} />
      </IconButton>
    </Stack>
  );
};

export default IconToolbar;
