import { createElement } from 'react';
import { Box, Typography } from '@mui/material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';

/** Compact overview tile: tinted icon on the left, label and value stacked beside it. */
const AutomationStatCard = ({ label, value, icon, color, tint }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 2.5,
      py: 2,
      bgcolor: COLORS.WHITE,
      border: '1px solid #E5E9F2',
      borderRadius: radius.lg,
      transition: 'box-shadow 0.2s ease-in-out',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    }}
  >
    <Box
      sx={{
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: radius.md,
        bgcolor: tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {createElement(icon, { sx: { fontSize: 22, color } })}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: fontWeight.bold, color: '#1E293B', lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default AutomationStatCard;
