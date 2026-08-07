import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SectionHeader = ({ number, icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2.5,
      py: 1.5,
      backgroundColor: '#F2F6FC',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    }}
  >

    {Icon && <Icon sx={{ color: '#1d4ed8', fontSize: '1.25rem' }} />}
    <Box>
      <Typography fontWeight={700} fontSize="0.85rem" sx={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

export default SectionHeader;
