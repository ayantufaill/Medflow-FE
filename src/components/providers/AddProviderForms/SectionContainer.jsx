import React from 'react';
import { Box, Typography } from '@mui/material';

const SectionContainer = ({ title, icon, children, isInsurance }) => {
  const borderColor = '#E5E7EB';
  const headerBg = '#F3F8FD';

  return (
    <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 2, backgroundColor: '#FFFFFF' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}`, borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
        {icon && <img src={icon} alt={title} style={{ width: 22, height: 22 }} />}
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#111' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default SectionContainer;
