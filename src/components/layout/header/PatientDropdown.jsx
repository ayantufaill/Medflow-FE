import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const PatientDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      onClick={() => setOpen((p) => !p)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '155px',
        height: '42px',
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        border: '1px solid #e0e5eb',
        borderRadius: '100px',
        px: '8px',
        gap: '8px',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '28px',
          height: '28px',
          backgroundColor: '#2262ef',
          borderRadius: '50%',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '10px', fontWeight: 600 }}>AT</Typography>
      </Box>

      {/* Name & info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: 0,
            color: '#09121f',
          }}
        >
          Ali Tariq
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '10.5px',
            lineHeight: '13.13px',
            letterSpacing: 0,
            color: '#5c646f',
          }}
        >
          #PAT007 · 43y
        </Typography>
      </Box>

      {/* Toggle arrow */}
      <Box sx={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {open
          ? <KeyboardArrowUp sx={{ fontSize: '14px', color: '#7a8a9a' }} />
          : <KeyboardArrowDown sx={{ fontSize: '14px', color: '#7a8a9a' }} />
        }
      </Box>
    </Box>
  );
};

export default PatientDropdown;
